import { type Db, ObjectId } from 'mongodb';

export interface UserRefInput {
  _id: ObjectId | string;
  email?: string;
  fullName?: string;
}

export interface UserRef {
  _id: ObjectId;
  email?: string;
  fullName?: string;
}

export interface AuditLogInput {
  type: string;
  actor?: UserRefInput | null;
  target?: UserRefInput | null;
  ip?: string;
  metadata?: Record<string, unknown>;
}

// Raw MongoDB document structure
export interface AuditLogEntity {
  _id: ObjectId;
  type: string;
  actor: UserRef | null;
  target: UserRef | null;
  ip: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// Formatted structure for API responses
export interface SafeUserRef {
  _id: string;
  email?: string;
  fullName?: string;
}

export type SafeAuditLog = Omit<AuditLogEntity, '_id' | 'actor' | 'target'> & {
  _id: string;
  actor: SafeUserRef | null;
  target: SafeUserRef | null;
};

// --- Sub-document Helpers ---

export function buildUserRef(userRef?: UserRefInput | null): UserRef | null {
  if (!userRef) return null;

  const parsedId = typeof userRef._id === 'string' ? new ObjectId(userRef._id) : userRef._id;

  return {
    _id: parsedId,
    ...(userRef.email && { email: userRef.email.toLowerCase().trim() }),
    ...(userRef.fullName && { fullName: userRef.fullName.trim() }),
  };
}

export function sanitizeUserRef(userRef?: UserRef | null): SafeUserRef | null {
  if (!userRef) return null;

  return {
    ...userRef,
    _id: userRef._id.toString(),
  };
}

// --- Sanitization Helper ---

export function sanitizeAuditLog(log: AuditLogEntity): SafeAuditLog {
  const { _id, actor, target, ...rest } = log;

  return {
    ...rest,
    _id: _id.toString(),
    actor: sanitizeUserRef(actor),
    target: sanitizeUserRef(target),
  };
}

// --- Factory for Creating Audit Log Documents ---

export function buildAuditLogDocument(input: AuditLogInput): Omit<AuditLogEntity, '_id'> {
  const now = new Date();

  return {
    type: input.type.trim(),
    actor: buildUserRef(input.actor),
    target: buildUserRef(input.target),
    ip: input.ip?.trim() || 'unknown',
    metadata: input.metadata ?? {},
    createdAt: now,
    updatedAt: now,
  };
}

// --- Collection Index Setup (including 90-day TTL) ---

export async function ensureAuditLogIndexes(db: Db): Promise<void> {
  const collection = db.collection<AuditLogEntity>('auditLogs');

  await collection.createIndexes([
    // Type filtering index
    { key: { type: 1 } },
    // Primary sorting index (newest logs first)
    { key: { createdAt: -1 } },
    // Admin dashboard search indexes
    { key: { 'actor._id': 1 } },
    { key: { 'target._id': 1 } },
    // TTL index: auto-delete logs after 90 days (7,776,000 seconds)
    { key: { createdAt: 1 }, expireAfterSeconds: 7776000 },
  ]);
}
