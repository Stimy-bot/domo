import {
  auditEventTypeSchema,
  auditLogListSchema,
  auditLogSchema,
  createAuditLogInputSchema,
  isoDateStringSchema,
  objectIdSchema,
} from '@domo/schemas';
import {
  deleteAllLogsFromDb,
  deleteAuditLogById,
  fetchLogsFromDb,
  getAuditLogById,
  insertLogIntoDb,
} from '@domo/services';
import { BAD_REQUEST, CREATED, NOT_FOUND, OK } from '@domo/types';
import type { FastifyPluginAsync, FastifyRequest } from 'fastify';
import { z } from 'zod';

//
// Helpers and schemas
//
const emptyToUndef = (v: unknown) => (v === '' ? undefined : v);

const listQuerySchema = z.object({
  type: z.preprocess(emptyToUndef, auditEventTypeSchema.optional()),
  actorId: z.preprocess(emptyToUndef, objectIdSchema.optional()),
  startDate: z.preprocess(emptyToUndef, isoDateStringSchema.optional()),
  endDate: z.preprocess(emptyToUndef, isoDateStringSchema.optional()),
  limit: z.coerce.number().min(1).max(100).default(50),
  confirm: z.coerce.boolean().optional(),
});

type ListQuery = z.infer<typeof listQuerySchema>;
type CreateAuditInput = z.infer<typeof createAuditLogInputSchema>;

//
// Fastify Plugin
//
const auditRoutes: FastifyPluginAsync = async fastify => {
  //
  // GET /api/audit-logs
  //
  fastify.get('/', async (req: FastifyRequest<{ Querystring: ListQuery }>, reply) => {
    const query = listQuerySchema.parse(req.query);

    const filters: Record<string, unknown> = {};
    if (query.type) filters.type = query.type;
    if (query.actorId) filters['actor._id'] = query.actorId;

    if (query.startDate || query.endDate) {
      filters.createdAt = {};
      if (query.startDate) (filters.createdAt as any).$gte = new Date(query.startDate);
      if (query.endDate) (filters.createdAt as any).$lte = new Date(query.endDate);
    }

    // pass the Mongo Db instance from fastify (fastify-mongodb)
    const db = (fastify.mongo as any).db;
    const logs = await fetchLogsFromDb(db, filters, query.limit);
    const parsed = auditLogListSchema.parse(logs);

    return reply.status(OK).send(parsed);
  });

  //
  // POST /api/audit-logs
  //
  fastify.post('/', async (req: FastifyRequest<{ Body: CreateAuditInput }>, reply) => {
    const input = createAuditLogInputSchema.parse(req.body);

    const db = (fastify.mongo as any).db;
    const inserted = await insertLogIntoDb(db, input);
    const parsed = auditLogSchema.parse(inserted);

    return reply.status(CREATED).send(parsed);
  });

  //
  // GET /api/audit-logs/:id
  //
  fastify.get('/:id', async (req: FastifyRequest<{ Params: { id: string } }>, reply) => {
    const validatedId = objectIdSchema.parse(req.params.id);

    const db = (fastify.mongo as any).db;
    const log = await getAuditLogById(db, validatedId);

    if (!log) {
      return reply.status(NOT_FOUND).send({ message: 'Audit log not found' });
    }

    const parsed = auditLogSchema.parse(log);
    return reply.status(OK).send(parsed);
  });

  //
  // DELETE /api/audit-logs
  //
  fastify.delete('/', async (req: FastifyRequest<{ Querystring: ListQuery }>, reply) => {
    const query = listQuerySchema.parse(req.query);

    const filters: Record<string, unknown> = {};
    if (query.type) filters.type = query.type;
    if (query.actorId) filters['actor._id'] = query.actorId;

    if (query.startDate || query.endDate) {
      filters.createdAt = {};
      if (query.startDate) (filters.createdAt as any).$gte = new Date(query.startDate);
      if (query.endDate) (filters.createdAt as any).$lte = new Date(query.endDate);
    }

    const hasAnyFilter = Object.keys(filters).length > 0;
    const confirm = Boolean(query.confirm);

    if (!hasAnyFilter && !confirm) {
      return reply.status(BAD_REQUEST).send({
        message: 'Refusing to delete all logs. Provide a filter or confirm=true.',
      });
    }

    const db = (fastify.mongo as any).db;
    const result = await deleteAllLogsFromDb(db, filters);
    return reply.status(OK).send({ deletedCount: result.deletedCount });
  });

  //
  // DELETE /api/audit-logs/:id
  //
  fastify.delete('/:id', async (req: FastifyRequest<{ Params: { id: string } }>, reply) => {
    const validatedId = objectIdSchema.parse(req.params.id);

    const db = (fastify.mongo as any).db;
    const deleted = await deleteAuditLogById(db, validatedId);

    if (!deleted) {
      return reply.status(NOT_FOUND).send({ message: 'Audit log not found' });
    }

    return reply.status(OK).send({ deleted: true });
  });
};

export { auditRoutes };
