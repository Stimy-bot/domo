// libs/controllers/src/lib/userController.ts
import type { FastifyReply, FastifyRequest } from 'fastify';
import { ObjectId } from 'mongodb';
import z from 'zod';
import {
  BAD_REQUEST,
  FORBIDDEN,
  NOT_FOUND,
  OK,
  UNAUTHORIZED,
} from '@domo/constants';
import {
  sanitizeUser,
  type UserEntity,
} from '@domo/models';
import { updateSchema } from '@domo/schemas';
import {
  deleteAllUsers,
  logAuthEvent,
  updateAccount,
  type ActorParam,
} from '@domo/services';
import {
  appAssert,
  catchErrors,
  clearAuthCookies,
  verifyToken,
} from '@domo/utils';
import { type AccessTokenPayload } from '@domo/types'


/* GET /user */
export const getUserHandler = catchErrors(
  async (req: FastifyRequest, reply: FastifyReply) => {
    appAssert(req.userId, UNAUTHORIZED, 'Not authenticated');

    const usersCollection = req.db.collection<UserEntity>('users');
    const user = await usersCollection.findOne({
      _id: new ObjectId(req.userId),
    });
    appAssert(user, NOT_FOUND, 'User not found');

    // Optionally populate company if present
    let companyDoc = null;
    if (user.company) {
      companyDoc = await req.db
        .collection('companies')
        .findOne({ _id: user.company });
    }

    const safeUser = sanitizeUser(user);

    return reply.status(OK).send({
      ...safeUser,
      company: companyDoc,
    });
  },
);

/* GET /users */
export const getUsersHandler = catchErrors(
  async (req: FastifyRequest, reply: FastifyReply) => {
    const usersCollection = req.db.collection<UserEntity>('users');
    const users = await usersCollection
      .find({})
      .project({ password: 0, otp: 0, otpExpiresAt: 0 })
      .toArray();

    const sanitizedUsers = users.map((u) => sanitizeUser(u as UserEntity));
    return reply.status(OK).send(sanitizedUsers);
  },
);

/* GET /user/me */
export const getCurrentUserHandler = catchErrors(
  async (req: FastifyRequest, reply: FastifyReply) => {
    const accessToken = req.cookies['accessToken'];
    appAssert(accessToken, UNAUTHORIZED, 'Missing access token');

    try {
      const { payload } = verifyToken<AccessTokenPayload>(accessToken);
      appAssert(payload?.userId, UNAUTHORIZED, 'Invalid access token');

      const usersCollection = req.db.collection<UserEntity>('users');
      const user = await usersCollection.findOne({
        _id: new ObjectId(payload.userId),
      });

      appAssert(user, NOT_FOUND, 'User not found');

      return reply.status(OK).send(sanitizeUser(user));
    } catch {
      clearAuthCookies(reply);
      return reply.status(UNAUTHORIZED).send({ message: 'Session expired' });
    }
  },
);

/* PATCH /user/update/:id */
export const updateHandler = catchErrors(
  async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const payload = updateSchema.parse({
      ...(req.body as object),
      userAgent: req.headers['user-agent'],
      ip: (req.headers['x-forwarded-for'] as string) || req.ip,
    });

    if (!req.user) {
      return reply.status(UNAUTHORIZED).send({ message: 'Not authenticated' });
    }

    const requestingUserId = String(
      (req.user as { userId?: string }).userId ?? req.userId,
    );
    const { id: targetUserId } = z
      .object({ id: z.string().regex(/^[0-9a-fA-F]{24}$/) })
      .parse(req.params);

    const usersCollection = req.db.collection<UserEntity>('users');
    const targetUser = await usersCollection.findOne({
      _id: new ObjectId(targetUserId),
    });

    if (!targetUser) {
      return reply.status(NOT_FOUND).send({ message: 'User not found' });
    }

    const isSelf = requestingUserId === targetUserId;
    const permissions = (req.user as unknown as { permissions?: string[] })
      .permissions;
    const hasPerm = (permissions || []).some((p) =>
      [
        'canEditUser',
        'canEditAnyUser',
        'canEditAllUsers',
        'canChangeAnyUserRole',
        'canDeactivateUser',
        'canDeleteUser',
        'canDeleteAnyUser',
        'canActivateUser',
      ].includes(p),
    );

    if (!isSelf && !hasPerm) {
      return reply.status(FORBIDDEN).send({ message: 'Cannot edit that user' });
    }

    const { user, accessToken, refreshToken } = await updateAccount(
      { db: req.db, jwt: req.server.jwt },
      {
        ...payload,
        active:
          typeof payload.active === 'boolean' ? payload.active : undefined,
        userId: targetUserId,
        actorId: requestingUserId,
      },
    );

    try {
      const actor: ActorParam = {
        _id: requestingUserId,
        email: String((req.user as { email?: unknown }).email || ''),
        fullName: String((req.user as { fullName?: unknown }).fullName || ''),
      };

      await logAuthEvent(req, actor, 'user_update', {
        method: 'manual',
        success: true,
      });

      if (
        payload.active !== undefined &&
        payload.active !== targetUser.active
      ) {
        await logAuthEvent(req, actor, 'user_status_change', {
          method: 'manual',
          previousStatus: Boolean(targetUser.active),
          newStatus: Boolean(payload.active),
          changedBy: requestingUserId,
          reason: 'Status toggled via admin update',
        });
      }
    } catch (auditErr) {
      req.log.error(
        { err: auditErr },
        '[AUDIT] user update logging failed (non-fatal)',
      );
    }

    return reply.status(OK).send({ user, accessToken, refreshToken });
  },
);

/* DELETE /user/:id */
export const deleteHandler = catchErrors(
  async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const { id } = z
      .object({ id: z.string().regex(/^[0-9a-fA-F]{24}$/) })
      .parse(req.params);

    const usersCollection = req.db.collection<UserEntity>('users');
    const deletedUser = await usersCollection.findOneAndDelete({
      _id: new ObjectId(id),
    });

    appAssert(deletedUser, NOT_FOUND, 'User not found');

    const safeUser = sanitizeUser(deletedUser);
    const actor: ActorParam = {
      _id: safeUser._id,
      email: safeUser.email,
      fullName: safeUser.fullName,
    };

    await logAuthEvent(req, actor, 'account_deletion', { method: 'manual' });

    return reply.status(OK).send({ message: 'User removed' });
  },
);

/* PATCH /user/deactivate/:id */
export const toggleUserActiveStatusHandler = catchErrors(
  async (
    req: FastifyRequest<{ Params: { id: string }; Body: { active: boolean } }>,
    reply: FastifyReply,
  ) => {
    const { id } = req.params;
    const { active } = req.body || {};

    if (typeof active !== 'boolean') {
      return reply
        .status(BAD_REQUEST)
        .send({ message: 'Invalid active status' });
    }

    const usersCollection = req.db.collection<UserEntity>('users');
    const updatedUser = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { active, updatedAt: new Date() } },
      { returnDocument: 'after' },
    );

    if (!updatedUser) {
      return reply.status(NOT_FOUND).send({ message: 'User not found' });
    }

    const actor = req.user as unknown as AccessTokenPayload | undefined;
    const actorId = String(actor?.userId ?? '');
    const actorEmail = actor?.email ?? 'unknown';
    const actorName = actor?.fullName ?? 'unknown';

    try {
      await req.db.collection('audit_logs').insertOne({
        type: active ? 'user_activated' : 'user_deactivated',
        actorId,
        actor: {
          _id: actorId,
          email: actorEmail,
          fullName: actorName,
        },
        targetId: id,
        ip: req.ip,
        metadata: {
          active,
          toggledAt: new Date().toISOString(),
        },
        createdAt: new Date(),
      });
    } catch (err) {
      req.log.error({ err }, '[Audit Log] Failed to insert');
    }

    return reply.status(OK).send(sanitizeUser(updatedUser));
  },
);

/* DELETE /user/delete/all */
export const deleteAllHandler = catchErrors(
  async (req: FastifyRequest, reply: FastifyReply) => {
    const requestingUser = req.user as unknown as AccessTokenPayload | undefined;
    appAssert(requestingUser, FORBIDDEN, 'Forbidden');
    appAssert(
      requestingUser.permissions?.includes('canDeleteAllUsers'),
      FORBIDDEN,
      'Forbidden',
    );

    const result = await deleteAllUsers({ db: req.db, jwt: req.server.jwt });

    const actor: ActorParam = {
      _id: String(requestingUser.userId),
      email: requestingUser.email,
      fullName: requestingUser.fullName,
    };

    await logAuthEvent(req, actor, 'all_accounts_deletion', {
      method: 'manual',
      success: true,
      reason: 'Admin action',
    });

    return reply.status(OK).send({ message: result.message });
  },
);