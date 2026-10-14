import { NOT_FOUND, OK } from '@domo/constants';
import { sanitizeUser, type UserEntity } from '@domo/models';
import { appAssert } from '@domo/utils';
import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { ObjectId } from 'mongodb';

// TypeBox response schema reflecting SafeUser
const UserResponseSchema = Type.Object({
  _id: Type.String(),
  email: Type.String(),
  firstName: Type.String(),
  lastName: Type.String(),
  fullName: Type.String(),
  permissions: Type.Array(Type.String()),
  active: Type.Boolean(),
  verified: Type.Boolean(),
  profilePicture: Type.String(),
  bio: Type.String(),
});

const userRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    '/user',
    {
      schema: {
        response: {
          200: UserResponseSchema,
        },
      },
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      const rawUserId = request.userId ?? request.user?.userId;

      appAssert(rawUserId, NOT_FOUND, 'User session invalid');

      const userId =
        typeof rawUserId === 'string' ? new ObjectId(rawUserId) : rawUserId;

      // Native MongoDB collection query
      const user = await fastify.mongo.db
        ?.collection<UserEntity>('users')
        .findOne({ _id: userId, active: true });

      appAssert(user, NOT_FOUND, 'User not found');

      // Use functional sanitizer to transform UserEntity into SafeUser
      return reply.status(OK).send(sanitizeUser(user));
    }
  );
};

export default userRoutes;