// apps/fastify/src/app/plugins/cookie.ts
import fp from 'fastify-plugin';
import fastifyCookie from '@fastify/cookie';
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

import {
  createSessionAndTokens,
  verifyToken,
  AccessTokenPayload,
  RefreshTokenPayload,
} from '@domo/utils';

import { loadEnv } from '@domo/constants';

const { NODE_ENV } = loadEnv();
const isProd = NODE_ENV === 'production';
const sameSite: 'none' | 'lax' = isProd ? 'none' : 'lax';

// --- Cookie options ---
const accessCookieOpts = {
  httpOnly: true,
  sameSite,
  secure: isProd,
  path: '/',
  maxAge: 15 * 60,
};

const refreshCookieOpts = {
  httpOnly: true,
  sameSite,
  secure: isProd,
  path: '/api/auth/refresh',
  maxAge: 30 * 24 * 60 * 60,
};

export default fp(async (fastify: FastifyInstance) => {
  await fastify.register(fastifyCookie, {
    secret: process.env.JWT_SECRET,
    hook: 'onRequest',
  });

  // --- Issue cookies using your existing createSessionAndTokens ---
  fastify.decorate(
    'issueAuthCookies',
    (
      reply: FastifyReply,
      userId: string,
      role: ('user' | 'admin' | 'superAdmin')[],
      email: string,
      fullName: string,
      sessionId: string,
    ) => {
      const { accessToken, refreshToken } = createSessionAndTokens(
        userId,
        role,
        email,
        fullName,
        sessionId,
      );

      reply
        .setCookie('accessToken', accessToken, accessCookieOpts)
        .setCookie('refreshToken', refreshToken, refreshCookieOpts);

      return { accessToken, refreshToken };
    },
  );

  // --- Clear cookies ---
  fastify.decorate('clearAuthCookies', (reply: FastifyReply) => {
    reply
      .clearCookie('accessToken', accessCookieOpts)
      .clearCookie('refreshToken', refreshCookieOpts);
  });

  // --- Verify access cookie ---
  fastify.decorate(
    'verifyAccessCookie',
    <T extends object = AccessTokenPayload>(
      request: FastifyRequest,
    ): { payload?: T; error?: string } => {
      const token = request.cookies.accessToken;
      if (!token) return { error: 'Missing access token' };

      return verifyToken<T>(token);
    },
  );

  // --- Verify refresh cookie ---
  fastify.decorate(
    'verifyRefreshCookie',
    <T extends object = RefreshTokenPayload>(
      request: FastifyRequest,
    ): { payload?: T; error?: string } => {
      const token = request.cookies.refreshToken;
      if (!token) return { error: 'Missing refresh token' };

      return verifyToken<T>(token, { secret: process.env.JWT_REFRESH_SECRET });
    },
  );

  // --- Rotate tokens using your existing createSessionAndTokens ---
  fastify.decorate(
    'rotateTokens',
    (
      reply: FastifyReply,
      refreshPayload: RefreshTokenPayload,
      accessPayload: Partial<AccessTokenPayload>,
    ) => {
      // Guard required fields that createSessionAndTokens needs
      if (
        !accessPayload.userId ||
        !accessPayload.role ||
        !accessPayload.email ||
        !accessPayload.fullName
      ) {
        // Either throw or return a controlled error — choose what fits your flow
        throw new Error('rotateTokens: missing required access payload fields');
      }

      const { accessToken, refreshToken } = createSessionAndTokens(
        accessPayload.userId,
        accessPayload.role,
        accessPayload.email,
        accessPayload.fullName,
        refreshPayload.sessionId,
      );

      reply
        .setCookie('accessToken', accessToken, accessCookieOpts)
        .setCookie('refreshToken', refreshToken, refreshCookieOpts);

      return { accessToken, refreshToken };
    },
  );

  // --- Auth preHandler ---
  fastify.decorate(
    'authenticateCookie',
    async (request: FastifyRequest, reply: FastifyReply) => {
      fastify.log.debug(
        { cookies: request.cookies },
        'authenticateCookie: incoming cookies',
      );
      const token = request.cookies?.accessToken;
      fastify.log.debug(
        { tokenPresent: !!token },
        'authenticateCookie: token presence',
      );

      if (!token) {
        fastify.log.debug('authenticateCookie: no access token found');
        return reply.code(401).send({ error: 'Missing access token' });
      }

      const { payload, error } =
        verifyToken<Partial<AccessTokenPayload>>(token);
      fastify.log.debug(
        { payload, error },
        'authenticateCookie: verifyToken result',
      );

      if (error || !payload) {
        fastify.log.debug(
          { error },
          'authenticateCookie: token invalid or expired',
        );
        return reply.code(401).send({ error: error ?? 'Unauthorized' });
      }

      request.user = { ...payload, permissions: [] as string[] };
      request.userId = payload.userId;
      request.sessionId = payload.sessionId;
      fastify.log.debug(
        {
          user: request.user,
          userId: request.userId,
          sessionId: request.sessionId,
        },
        'authenticateCookie: user set',
      );
    },
  );

  fastify.log.info('Cookie Auth Plugin integrated with createSessionAndTokens');
});
