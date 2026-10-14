import 'fastify';
import { Db } from 'mongodb';

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