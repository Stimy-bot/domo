import { rolePermissions } from '@domo/config';
import { AppErrorCode } from '@domo/constants';
import type { RoleType, UserEntity } from '@domo/models';
import type { AccessTokenPayload } from '@domo/types';
import { UNAUTHORIZED } from '@domo/types';
import { appAssert } from '@domo/utils/client';
import { verifyToken } from '@domo/utils';
import { ObjectId } from '@fastify/mongodb';
import type { FastifyPluginAsync, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

export const authenticateHook = async (req: FastifyRequest) => {
  // Safe extraction of cookies
  const cookies = (req as FastifyRequest & { cookies?: Record<string, string> }).cookies;

  const authHeader = String(req.headers.authorization || '');
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
  const accessToken = cookies?.['accessToken'] || bearerToken;

  if (!accessToken) {
    appAssert(false, UNAUTHORIZED, 'Not authorized', AppErrorCode.InvalidAccessToken);
  }

  const token = accessToken as string;

  const payload = verifyToken(token);
  if (!payload) {
    appAssert(false, UNAUTHORIZED, 'Invalid token', AppErrorCode.InvalidAccessToken);
  }

  const pl = payload as unknown as AccessTokenPayload;
  if (typeof pl.userId !== 'string' || typeof pl.sessionId !== 'string') {
    appAssert(false, UNAUTHORIZED, 'Invalid token payload', AppErrorCode.InvalidAccessToken);
  }

  // Load user from database
  const user = await req.db
    .collection<UserEntity>('users')
    .findOne({ _id: new ObjectId(pl.userId) });

  if (!user) {
    appAssert(false, UNAUTHORIZED, 'User not found', AppErrorCode.InvalidAccessToken);
  }

  // Normalize user roles
  const roles: RoleType[] = Array.isArray(user.role)
    ? user.role
    : user.role
      ? [user.role as RoleType]
      : [];

  if (roles.length === 0) {
    appAssert(false, UNAUTHORIZED, 'User has no roles', AppErrorCode.InvalidAccessToken);
  }

  // Aggregate permissions across all roles
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

  // Construct object satisfying types/fastify.d.ts
  const authUserData = {
    userId: pl.userId,
    sessionId: pl.sessionId,
    email: user.email ?? '',
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

  // Safe property assignment avoiding ESLint explicit-any warnings
  const reqWithUser = req as unknown as {
    user: typeof authUserData;
    authUser: typeof authUserData;
    userId: string;
    sessionId: string;
  };
  reqWithUser.user = authUserData;
  reqWithUser.authUser = authUserData;

  reqWithUser.userId = pl.userId;
  reqWithUser.sessionId = pl.sessionId;
};

const authenticatePlugin: FastifyPluginAsync = async fastify => {
  fastify.decorateRequest('user', null as never);
  fastify.decorateRequest('authUser', null as never);
  fastify.decorateRequest('userId', undefined);
  fastify.decorateRequest('sessionId', undefined);

  fastify.decorate('authenticate', authenticateHook);
};

export default fp(authenticatePlugin);
