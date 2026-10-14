// apps/fastify/src/app/plugins/jwt.ts
import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { Audience } from '@domo/constants';
import { UNAUTHORIZED } from '@domo/constants';

export default fp(async (fastify: FastifyInstance) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    fastify.log.error('JWT_SECRET environment variable is missing!');
    throw new Error('Missing JWT_SECRET configuration');
  }

  const audience = [
    Audience.User,
    Audience.Admin,
    Audience.SuperAdmin,
  ] as [string, ...string[]];

  await fastify.register(fastifyJwt as any, {
    secret,
    sign: {
      audience,
    },
    verify: {
      audience,
    },
  });

  fastify.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify({ audience } as any);
      } catch (err: unknown) {
        fastify.log.debug({ err }, 'jwt-verify-failed');
        const message = err instanceof Error ? err.message : 'Unauthorized';
        return reply.code(UNAUTHORIZED).send({ error: message });
      }
    },
  );

  fastify.log.info('JWT Plugin successfully registered');
});
