// apps/api/src/plugins/auth.ts
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import { serverEnv } from '@domo/constants/server';

export async function registerAuth(fastify: FastifyInstance) {
  // 1. Register Fastify JWT plugin
  await fastify.register(fastifyJwt, {
    secret: serverEnv.JWT_SECRET,
    sign: {
      expiresIn: '1d',
    },
  });

  // 2. Add custom authentication decorator/guard
  fastify.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch {
        reply.code(401).send({ error: 'Unauthorized', message: 'Invalid or expired token' });
      }
    }
  );
}

// Extend Fastify types so TypeScript knows about request.user and fastify.authenticate
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { userId: string; email: string; role: string };
    user: { userId: string; email: string; role: string };
  }
}