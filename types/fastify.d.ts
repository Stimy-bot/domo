import 'fastify';
import type { Db, ObjectId } from 'mongodb';
import type { AccessTokenPayload, RefreshTokenPayload } from '@domo/types';

declare module 'fastify' {
  interface FastifyRequest {
    /**
     * Populated by authenticateCookie.
     * JWT payloads are *partial* profile objects.
     */
    authUser?: Partial<AccessTokenPayload> & {
      permissions: string[];
      _id?: string | ObjectId;
      profilePicture?: string;
      carrier?: string;
    };

    /**
     * Convenience fields set by middleware
     */
    userId?: string;
    sessionId?: string;

    /**
     * Legacy alias for code still using req.user.
     * Must also be partial.
     */
    user?: (Partial<AccessTokenPayload> & { permissions: string[] }) | undefined;

    /**
     * DB handle attached at bootstrap
     */
    db: Db;
  }

  interface FastifyInstance {
    issueAuthCookies: (
      reply: FastifyReply,
      userId: string,
      role: ('user' | 'admin' | 'superAdmin')[],
      email: string,
      fullName: string,
      sessionId: string,
    ) => { accessToken: string; refreshToken: string };

    clearAuthCookies: (reply: FastifyReply) => void;

    verifyAccessCookie: <T extends object = Partial<AccessTokenPayload>>(
      request: FastifyRequest,
    ) => { payload?: T; error?: string };

    verifyRefreshCookie: <T extends object = RefreshTokenPayload>(
      request: FastifyRequest,
    ) => { payload?: T; error?: string };

    rotateTokens: (
      reply: FastifyReply,
      refreshPayload: RefreshTokenPayload,
      accessPayload: Partial<AccessTokenPayload>,
    ) => { accessToken: string; refreshToken: string };

    authenticateCookie: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;

    jwt?: {
      signToken?: (
        payload: Partial<AccessTokenPayload> | RefreshTokenPayload,
        opts?: { secret?: string; expiresIn?: number | string },
      ) => string;

      verifyToken?: <T extends object = Partial<AccessTokenPayload> | RefreshTokenPayload>(
        token: string,
        opts?: { secret?: string },
      ) => { payload?: T; error?: string };
    };
  }
}
