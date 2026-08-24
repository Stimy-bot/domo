// libs/shared/middleware/src/lib/authenticate.ts
import { FastifyPluginAsync, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { ObjectId } from '@fastify/mongodb';
import { UNAUTHORIZED, AppErrorCode } from '@domo/constants';
import { verifyToken, appAssert } from '@domo/utils';
import type { AccessTokenPayload } from '@domo/types';
import { UserEntity, RoleType } from '@domo/models';
import { rolePermissions } from '@domo/config';

/**
 * Runtime shape attached to request.authUser.
 * Keep optional everything that may be missing at runtime.
 */
type RequestAuthUser = Partial<
  AccessTokenPayload & {
    permissions: string[];
    _id: string | ObjectId;
    profilePicture: string;
    carrier: string;
    phone: string;
    age: number;
    gender: string;
    birthDate?: Date;
    bio: string;
    active: boolean;
    verified: boolean;
    phoneVerified: boolean;
    isAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
>;

export const authenticateHook = async (req: FastifyRequest) => {
  // cookies may be undefined in types; guard safely
  const cookies = (req as FastifyRequest & { cookies?: Record<string, string> }).cookies;

  const authHeader = String(req.headers.authorization || '');
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
  const accessToken = cookies?.['accessToken'] || bearerToken;

  // runtime check and throw with appAssert for consistent error handling
  if (!accessToken) {
    appAssert(false, UNAUTHORIZED, 'Not authorized', AppErrorCode.InvalidAccessToken);
  }

  // narrow to string for the verifier
  const token = accessToken as string;

  const { payload, error } = verifyToken<AccessTokenPayload>(token);
  if (!payload) {
    appAssert(false, UNAUTHORIZED, error === 'jwt expired' ? 'Token expired' : 'Invalid token', AppErrorCode.InvalidAccessToken);
  }

  // payload is now defined
  const pl = payload as AccessTokenPayload;
  if (typeof pl.userId !== 'string' || typeof pl.sessionId !== 'string') {
    appAssert(false, UNAUTHORIZED, 'Invalid token payload', AppErrorCode.InvalidAccessToken);
  }

  // load user
  const user = await req.db
    .collection<UserEntity>('users')
    .findOne({ _id: new ObjectId(pl.userId) });

  if (!user) {
    appAssert(false, UNAUTHORIZED, 'User not found', AppErrorCode.InvalidAccessToken);
  }

  // normalize roles
  const roles: RoleType[] = Array.isArray(user.role)
    ? user.role
    : user.role
      ? [user.role as RoleType]
      : [];

  if (roles.length === 0) {
    appAssert(false, UNAUTHORIZED, 'User has no roles', AppErrorCode.InvalidAccessToken);
  }

  // aggregate permissions
  const permissionSet = new Set<string>();
  for (const role of roles) {
    const perms = rolePermissions[role];
    if (!perms) {
      req.log?.warn?.({ role, userId: user._id }, 'authenticate: unknown role');
      continue;
    }
    for (const perm of perms) permissionSet.add(perm);
  }
  const effectivePermissions = Array.from(permissionSet);

  // attach authUser (use partial shape to avoid strict assignment errors)
  (req as FastifyRequest & { authUser?: RequestAuthUser }).authUser = {
    userId: pl.userId,
    sessionId: pl.sessionId,
    email: user.email ?? undefined,
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
    role: roles,
    permissions: effectivePermissions,
    isAdmin: Boolean(user.isAdmin),
    _id: user._id,
    profilePicture: user.profilePicture ?? undefined,
    carrier: typeof user.carrier === 'string' ? user.carrier : '',
    phone: typeof user.phone === 'string' ? user.phone : '',
    age: typeof user.age === 'number' ? user.age : 0,
    gender: typeof user.gender === 'string' ? user.gender : '',
    birthDate: user.birthDate ?? new Date(0),
    bio: typeof user.bio === 'string' ? user.bio : '',
    active: Boolean(user.active),
    verified: Boolean(user.verified),
    phoneVerified: Boolean(user.phoneVerified),
    createdAt: user.createdAt ?? undefined,
    updatedAt: user.updatedAt ?? undefined,
  };

 req.userId = payload.userId;
  req.sessionId = payload.sessionId;
};

const authenticatePlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorateRequest('user', null as any);
  fastify.decorateRequest('userId', undefined);
  fastify.decorateRequest('sessionId', undefined);

  // Decorate fastify instance to allow `onRequest: [fastify.authenticate]` on protected routes
  fastify.decorate('authenticate', authenticateHook);
};

export default fp(authenticatePlugin);