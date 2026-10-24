// src/middleware/requireValidTargetId.ts

import { BAD_REQUEST } from '@domo/types';
import { ObjectId } from '@fastify/mongodb';
import type { FastifyReply, FastifyRequest } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    targetUserId: ObjectId;
  }
}

export async function requireValidTargetId(req: FastifyRequest, reply: FastifyReply) {
  const params = req.params as Record<string, string | undefined>;

  // Support both :id and :userId route param names
  const rawId =
    typeof params['id'] === 'string'
      ? params['id']
      : typeof params['userId'] === 'string'
        ? params['userId']
        : undefined;

  // 1) Missing or literally "undefined"
  if (!rawId || rawId === 'undefined') {
    return reply.status(BAD_REQUEST).send({ message: 'Missing userId in URL' });
  }

  // 2) Not a valid ObjectId
  if (!ObjectId.isValid(rawId)) {
    return reply.status(BAD_REQUEST).send({ message: 'Invalid userId format' });
  }

  // 3) Attach parsed ObjectId directly to the request instance
  req.targetUserId = new ObjectId(rawId);
}
