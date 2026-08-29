// types/fastify.d.ts
import 'fastify';
import type { Db, ObjectId as MongoObjectId } from 'mongodb';
import type { Types } from 'mongoose';
import type { AccessTokenPayload, RefreshTokenPayload } from '@domo/types';

export interface AuditLogActor {
  _id: Types.ObjectId | MongoObjectId | string;
  email: string;
  fullName: string;
  [key: string]: unknown;
}

export interface AuditLogTarget {
  _id: Types.ObjectId | MongoObjectId;
  [key: string]: unknown;
}

export interface AuditLogPayload {
  type: string;
  actor: AuditLogActor;
  target: AuditLogTarget;
  metadata?: Record<string, unknown>;
}

declare module 'fastify' {
  interface FastifyRequest {
    /**
     * Populated by authenticateCookie.
     * JWT payloads are *partial* profile objects.
     */
    authUser?: Partial<AccessTokenPayload> & {
      permissions: string[];
      _id?: string | MongoObjectId | Types.ObjectId;
      profilePicture?: string;
      carrier?: string;
    };

    /**
     * Convenience fields set by middleware
     */
    userId?: string;
    sessionId?: string;

    /**
     * User payload attached to request.
     * Extended to support required controller fields (e.g., _id, email, fullName).
     */
    user: Partial<AccessTokenPayload> & {
      _id: Types.ObjectId | MongoObjectId | string;
      email: string;
      fullName: string;
      permissions?: string[];
      [key: string]: any;
    };

    /**
     * Audit log structure populated by controllers and processed by audit middleware
     */
    auditLog?: AuditLogPayload;

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