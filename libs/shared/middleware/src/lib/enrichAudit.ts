// libs/middleware/src/lib/enrichAudit.ts

import type { AuditEventType } from '@domo/schemas';
import { insertLogIntoDb } from '@domo/services';
import { ObjectId } from '@fastify/mongodb';
import type { FastifyReply, FastifyRequest } from 'fastify';

export interface CustomAuditLog {
  type?: AuditEventType;
  actor?: {
    _id?: string | ObjectId;
    email?: string;
    fullName?: string;
  };
  target?: {
    _id?: string | ObjectId;
    [key: string]: unknown;
  };
  metadata?: Record<string, unknown>;
}

export function enrichAudit(defaultType: AuditEventType) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    // Only process successful responses (2xx)
    if (reply.statusCode >= 200 && reply.statusCode < 300) {
      const anyReq = req as FastifyRequest & {
        user?: { _id?: string | ObjectId; email?: string; fullName?: string };
        auditLog?: CustomAuditLog;
      };

      const actor = anyReq.user
        ? {
            _id: anyReq.user._id ? String(anyReq.user._id) : undefined,
            email: anyReq.user.email,
            fullName: anyReq.user.fullName,
          }
        : undefined;

      const params = req.params as Record<string, string | undefined>;
      const targetParam = params?.id;
      let autoTarget: { _id: string } | undefined;

      if (targetParam && typeof targetParam === 'string' && ObjectId.isValid(targetParam)) {
        autoTarget = { _id: targetParam };
      }

      const log = {
        type: anyReq.auditLog?.type || defaultType,
        actor: anyReq.auditLog?.actor || actor,
        ...((anyReq.auditLog?.target || autoTarget) && {
          target: anyReq.auditLog?.target || autoTarget,
        }),
        ip: req.ip || (req.headers['x-forwarded-for'] as string) || '127.0.0.1',
        metadata: {
          ...(anyReq.auditLog?.metadata || {}),
          method: req.method,
          path: req.url,
        },
      };

      try {
        // Pass req.db as first parameter matching Fastify MongoDB native driver setup
        await insertLogIntoDb(req.db, log as unknown);
      } catch (err) {
        req.log.error(err, `[Audit Error] ${log.type}: ${(err as Error).message}`);
      }
    }
  };
}
