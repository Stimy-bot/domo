// @domo/libs/controllers/src/lib/authController.ts
import type { FastifyReply, FastifyRequest } from 'fastify';
import { ObjectId, Db } from 'mongodb';
import { CREATED, OK, UNAUTHORIZED } from '@domo/constants';
import {
  createAccount,
  loginUser,
  refreshUserAccessToken,
  resetPassword,
  sendPasswordResetEmail,
  verifyEmail,
} from '@domo/services';

import {
  catchErrors,
  verifyToken,
  appAssert,
  clearAuthCookies,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  setAuthCookies,
} from '@domo/utils';
import {
  emailSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verificationCodeSchema,
} from '@domo/schemas';

declare module 'fastify' {
  interface FastifyRequest {
    db: Db;
    userId?: string;
    user?: { userId: string };
  }

  interface FastifyInstance {
    db: Db;
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export const registerHandler = catchErrors(
  async (req: FastifyRequest, reply: FastifyReply) => {
    const request = registerSchema.parse({
      ...(req.body as object),
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    });

    const { user, accessToken, refreshToken } = await createAccount(
      req.db,
      request,
    );

    setAuthCookies({ reply, accessToken, refreshToken });

    return reply.status(CREATED).send(user);
  },
);

export const loginHandler = catchErrors(
  async (req: FastifyRequest, reply: FastifyReply) => {
    const request = loginSchema.parse({
      ...(req.body as object),
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    });

    const { accessToken, refreshToken } = await loginUser(req.db, request);

    setAuthCookies({ reply, accessToken, refreshToken });

    return reply.status(OK).send({ message: 'Login successful' });
  },
);

export const logoutHandler = catchErrors(
  async (req: FastifyRequest, reply: FastifyReply) => {
    const accessToken = req.cookies.accessToken;
    const { payload } = verifyToken<{ sessionId: string }>(accessToken || '');

    if (payload?.sessionId) {
      const sessionsCollection = req.db.collection('sessions');
      await sessionsCollection.deleteOne({
        _id: new ObjectId(payload.sessionId),
      });
    }

    clearAuthCookies(reply);

    return reply.status(OK).send({ message: 'Logout successful' });
  },
);

export const refreshHandler = catchErrors(
  async (req: FastifyRequest, reply: FastifyReply) => {
    const refreshToken = req.cookies.refreshToken;
    appAssert(refreshToken, UNAUTHORIZED, 'Missing refresh token');

    const { accessToken, newRefreshToken } = await refreshUserAccessToken(
      req.db,
      refreshToken,
    );

    if (newRefreshToken) {
      reply.setCookie(
        'refreshToken',
        newRefreshToken,
        getRefreshTokenCookieOptions(),
      );
    }

    return reply
      .status(OK)
      .setCookie('accessToken', accessToken, getAccessTokenCookieOptions())
      .send({ message: 'Access token refreshed' });
  },
);

export const verifyEmailHandler = catchErrors(
  async (
    req: FastifyRequest<{ Params: { code: string } }>,
    reply: FastifyReply,
  ) => {
    const verificationCode = verificationCodeSchema.parse(req.params.code);

    await verifyEmail(req.db, verificationCode);

    return reply
      .status(OK)
      .send({ message: 'Email was successfully verified' });
  },
);

export const sendPasswordResetHandler = catchErrors(
  async (req: FastifyRequest, reply: FastifyReply) => {
    const body = req.body as { email: string };
    const email = emailSchema.parse(body.email);

    await sendPasswordResetEmail(req.db, email);

    return reply.status(OK).send({ message: 'Password reset email sent' });
  },
);

export const resetPasswordHandler = catchErrors(
  async (req: FastifyRequest, reply: FastifyReply) => {
    const request = resetPasswordSchema.parse(req.body);

    await resetPassword(req.db, request);

    clearAuthCookies(reply);

    return reply
      .status(OK)
      .send({ message: 'Password was reset successfully' });
  },
);
