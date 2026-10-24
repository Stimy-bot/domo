// apps/my_fastify/src/app/plugins/cookie.ts

import fastifyCookie from '@fastify/cookie';
import type { FastifyInstance, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';

export default fp(async (fastify: FastifyInstance) => {
  const accessSecret = process.env.JWT_SECRET;
  const refreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!accessSecret || !refreshSecret) {
    fastify.log.error('JWT_SECRET or JWT_REFRESH_SECRET is missing!');
    throw new Error('Missing JWT secrets for cookie signing');
  }

  // Combine both secrets for cookie signing
  const cookieSecret = `${accessSecret}.${refreshSecret}`;

  await fastify.register(fastifyCookie, {
    secret: cookieSecret,
    hook: 'onRequest',
  });

  fastify.decorate(
    'setAuthCookies',
    (reply: FastifyReply, accessToken: string, refreshToken: string) => {
      reply
        .setCookie('accessToken', accessToken, {
          path: '/',
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          signed: true,
        })
        .setCookie('refreshToken', refreshToken, {
          path: '/auth/refresh',
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          signed: true,
        });
    },
  );

  fastify.decorate('clearAuthCookies', (reply: FastifyReply) => {
    reply
      .clearCookie('accessToken', { path: '/', signed: true })
      .clearCookie('refreshToken', { path: '/auth/refresh', signed: true });
  });

  fastify.log.info('Cookie Plugin successfully registered');
});
