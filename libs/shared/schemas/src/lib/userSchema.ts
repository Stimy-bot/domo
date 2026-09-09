import Fastify from 'fastify';
import { Type, type Static } from '@sinclair/typebox';
import { CREATED } from '@domo/types';

const fastify = Fastify({ logger: true });

// Define Schema using TypeBox
export const UserSchema = Type.Object({
  name: Type.String(),
  email: Type.String({ format: 'email' }),
  age: Type.Optional(Type.Number({ minimum: 18 })),
});

// Infer static TypeScript type directly from Schema
type UserType = Static<typeof UserSchema>;

fastify.post<{ Body: UserType }>(
  '/users',
  {
    schema: {
      body: UserSchema,
      response: {
        201: Type.Object({
          id: Type.String(),
          success: Type.Boolean(),
        }),
      },
    },
  },
  async (request, reply) => {
    // Safe at runtime AND strictly typed at compile time
    const { name, email, age } = request.body;
    request.log.info({ name, email, age }, 'Creating user');
    reply.code(CREATED);
    return { id: 'usr_999', success: true };
  },
);
