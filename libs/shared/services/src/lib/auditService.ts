// libs/services/src/lib/auditService.ts
import type { FastifyRequest } from 'fastify';
import geoip from 'geoip-lite';
import { Db, ObjectId, type WithId, type Document } from 'mongodb';
import {
  auditLogSchema,
  createAuditLogInputSchema,
  objectIdSchema,
  type AuditLog,
} from '@domo/schemas';

declare module 'fastify' {
  interface FastifyRequest {
    db: Db;
  }
}

/* Helpers */
const toHexString = (v: unknown): string | undefined => {
  if (typeof v === 'string') return v;
  if (
    typeof v === 'object' &&
    v !== null &&
    'toHexString' in v &&
    typeof v.toHexString === 'function'
  ) {
    return v.toHexString();
  }
  return undefined;
};

const toISOString = (v: unknown): string | undefined => {
  if (v instanceof Date) return v.toISOString();
  const d = new Date(v as string | number | Date);
  return isNaN(d.getTime()) ? undefined : d.toISOString();
};

function normalizeAuditDoc(doc: WithId<Document> | Record<string, unknown>) {
  return {
    _id: toHexString(doc['_id']),
    type: doc['type'],
    metadata: doc['metadata'] ?? {},
    ip: doc['ip'] ?? undefined,
    createdAt: toISOString(doc['createdAt']),
    updatedAt: toISOString(doc['updatedAt']),
    actor: doc['actor']
      ? {
          _id: toHexString(doc['actor']._id),
          email: doc['actor'].email,
          fullName: doc['actor'].fullName,
        }
      : undefined,
    target: doc['target']
      ? {
          _id: toHexString(doc['target']._id),
          email: doc['target'].email,
          fullName: doc['target'].fullName,
        }
      : undefined,
  };
}

export type ActorParam = {
  _id: string | ObjectId;
  email?: string;
  fullName?: string;
};

export async function insertLogIntoDb(
  db: Db,
  input: unknown,
): Promise<AuditLog> {
  const parsed = createAuditLogInputSchema.parse(input);

  const toObjectId = (v: unknown) =>
    v && ObjectId.isValid(String(v)) ? new ObjectId(String(v)) : v;

  if (parsed.actor?._id) {
    parsed.actor._id = toObjectId(parsed.actor._id) as typeof parsed.actor._id;
  }
  if (parsed.target?._id) {
    parsed.target._id = toObjectId(parsed.target._id) as typeof parsed.target._id;
  }

  const now = new Date();
  const docToInsert = {
    ...parsed,
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection('audit_logs').insertOne(docToInsert);
  const insertedDoc = {
    _id: result.insertedId,
    ...docToInsert,
  };

  return auditLogSchema.parse(normalizeAuditDoc(insertedDoc));
}

export async function logAuthEvent<M extends Record<string, unknown>>(
  req: FastifyRequest,
  user: ActorParam,
  type: string,
  metadata: M & { method: string },
  options?: { failHard?: boolean },
) {
  const actorId = toHexString(user?._id) || '';
  const xForwardedFor = req.headers['x-forwarded-for'];
  const rawIp =
    (typeof xForwardedFor === 'string'
      ? xForwardedFor.split(',')[0]?.trim()
      : Array.isArray(xForwardedFor)
        ? xForwardedFor[0]
        : undefined) ||
    req.socket.remoteAddress ||
    req.ip ||
    '127.0.0.1';

  const cleanIp = rawIp.replace(/^.*:/, '');

  const geo = geoip.lookup(cleanIp);
  const location = geo
    ? `${geo.city || 'Unknown City'}, ${geo.region || ''} ${geo.country}`.trim()
    : 'Local/Internal';

  // Ensure email is always present in metadata for schema validation
  const resolvedEmail = metadata['email'] || user.email || '';

  const payload = {
    type,
    actor: {
      _id: actorId,
      email: user.email || resolvedEmail,
      fullName: user.fullName || '',
    },
    ip: cleanIp,
    metadata: {
      email: resolvedEmail, // <--- Add resolved email here
      ...metadata,
      userAgent: (req.headers['user-agent'] as string) || 'unknown',
      location,
    },
  };

  try {
    const log = await insertLogIntoDb(req.db, payload);
    return { ok: true, log };
  } catch (err) {
    req.log.error(
      { err, type, actorId, cleanIp },
      '[AUDIT] Failed to log event',
    );
    if (options?.failHard) throw err;
    return { ok: false, error: err };
  }
}

export async function getAuditLogById(db: Db, id: unknown): Promise<AuditLog> {
  const validId = objectIdSchema.parse(id);
  const doc = await db
    .collection('audit_logs')
    .findOne({ _id: new ObjectId(validId) });

  if (!doc) throw new Error(`AuditLog with id=${validId} not found`);
  return auditLogSchema.parse(normalizeAuditDoc(doc));
}

export async function fetchLogsFromDb(
  db: Db,
  filter: Record<string, unknown> = {},
  limit = 100,
): Promise<AuditLog[]> {
  const docs = await db
    .collection('audit_logs')
    .find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();

  return (docs || []).reduce((acc: AuditLog[], doc) => {
    const result = auditLogSchema.safeParse(normalizeAuditDoc(doc));
    if (result.success) {
      acc.push(result.data);
    } else {
      console.warn(
        `[AUDIT] Validation failed for log ${doc['_id']}:`,
        result.error.format(),
      );
    }
    return acc;
  }, []);
}

export async function deleteAllLogsFromDb(
  db: Db,
  filters: Record<string, unknown> = {},
): Promise<{ deletedCount: number }> {
  const result = await db.collection('audit_logs').deleteMany(filters);
  return { deletedCount: result.deletedCount ?? 0 };
}

export async function deleteAuditLogById(
  db: Db,
  id: unknown,
): Promise<boolean> {
  const validId = objectIdSchema.parse(id);
  const result = await db
    .collection('audit_logs')
    .deleteOne({ _id: new ObjectId(validId) });
  return result.deletedCount === 1;
}