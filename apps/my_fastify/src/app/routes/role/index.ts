import { FastifyPluginAsync, FastifyRequest } from 'fastify';
import { ObjectId } from 'mongodb';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, OK } from '@domo/types';
import { rolePermissions } from '@domo/config';
import { UserEntity, RoleType } from '@domo/models';
import { logAuthEvent } from '@domo/services';
import { authenticateHook, requireValidTargetId, authorize } from '@domo/middleware';

type ParamsId = { id: string };
type PatchBody = { role?: string };

type AuthenticatedRequest = FastifyRequest & {
  user: {
    id?: string;
    _id?: string;
    email?: string;
    fullName?: string;
  };
}

const auditActorFromReq = (req: FastifyRequest) => {
  const authReq = req as AuthenticatedRequest;
  const rawUser = authReq.user ?? (req.raw as unknown as { user?: AuthenticatedRequest['user'] })?.user;

  return {
    _id: String(rawUser?.id ?? rawUser?._id ?? ''),
    email: String(rawUser?.email ?? ''),
    fullName: rawUser?.fullName ?? '',
  };
};

const roleRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async (_req, reply) => {
    const roles = Object.entries(rolePermissions).map(([name, permissions]) => ({
      name,
      permissions,
    }));
    return reply.status(OK).send(roles);
  });

  fastify.patch(
    '/user/:id/role',
    {
      preHandler: [
        authenticateHook,
        authorize('canChangeAnyUserRole'),
        requireValidTargetId,
      ],
    },
    async (req: FastifyRequest<{ Params: ParamsId; Body: PatchBody }>, reply) => {
      const { id } = req.params;
      const { role } = req.body ?? {};

      if (!fastify.mongo?.db) {
        return reply.status(INTERNAL_SERVER_ERROR).send({ error: 'Database connection not initialized' });
      }

      if (!ObjectId.isValid(id)) {
        return reply.status(BAD_REQUEST).send({ error: 'Invalid user ID format' });
      }

      const validRoles = Object.keys(rolePermissions);
      const normalizedRole = typeof role === 'string' ? role.trim().toLowerCase() : '';
      const matchedRole = validRoles.find((r) => r.toLowerCase() === normalizedRole) as RoleType | undefined;

      if (!matchedRole) {
        return reply
          .status(BAD_REQUEST)
          .send({ error: `Invalid role. Allowed roles: ${validRoles.join(', ')}` });
      }

      try {
        const usersCollection = fastify.mongo.db.collection<UserEntity>('users');
        const userObjectId = new ObjectId(id);

        const previousUser = await usersCollection.findOne({ _id: userObjectId });
        if (!previousUser) {
          return reply.status(BAD_REQUEST).send({ error: 'User not found' });
        }

        const updatedUser = await usersCollection.findOneAndUpdate(
          { _id: userObjectId },
          {
            $set: {
              role: [matchedRole],
              updatedAt: new Date(),
            },
          },
          { returnDocument: 'after' }
        );

        if (!updatedUser) {
          return reply.status(INTERNAL_SERVER_ERROR).send({ error: 'Failed to update user' });
        }

        const actorPayload = auditActorFromReq(req);

        try {
          await logAuthEvent(req, actorPayload, 'user.role.updated', {
            method: 'PATCH',
            targetId: id,
            previousRole: previousUser.role,
            newRole: matchedRole,
            success: true,
          });
        } catch (auditErr) {
          fastify.log.error({ auditErr }, '[AUDIT] logAuthEvent failed (non-fatal)');
        }

        return reply.status(OK).send({ message: 'Role updated', user: updatedUser });
      } catch (err) {
        fastify.log.error({ err }, 'Error updating role');
        return reply.status(INTERNAL_SERVER_ERROR).send({ error: 'Internal server error' });
      }
    }
  );
};

export { roleRoutes };