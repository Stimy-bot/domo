// apps/my_fastify/src/app/plugins/cors.ts

import cors from '@fastify/cors';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

export default fp(async (fastify: FastifyInstance) => {
  fastify.log.info('CORS Plugin: initializing');

  const isProd = process.env.NODE_ENV === 'production';
  const origin = isProd ? (process.env.CORS_ORIGIN ?? 'http://localhost:5713') : true;

  if (isProd && !process.env.CORS_ORIGIN) {
    fastify.log.warn(
      'CORS Plugin: CORS_ORIGIN missing in production, using fallback http://localhost:5713',
    );
  }

  await fastify.register(cors, {
    origin,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  fastify.log.info('CORS Plugin successfully registered');
});
