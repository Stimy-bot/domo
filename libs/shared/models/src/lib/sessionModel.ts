// @beginning/libs/shared-models/src/lib/sessionModel.ts
import { ObjectId, type Db } from 'mongodb';
import {
  signToken,
  refreshTokenSignOptions,
} from '@domo/utils';

 const thirtyDaysFromNow = () =>
  new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
 

export interface SessionInput {
  userId: ObjectId;
  userAgent?: string;
  ip?: string;
  expiresAt?: Date;
}

export interface SessionEntity {
  _id?: ObjectId;
  userId: ObjectId;
  userAgent?: string;
  ip?: string;
  createdAt: Date;
  expiresAt: Date;
}

// --- Refresh Token Helper ---

export type RefreshTokenPayload = {
  sessionId: string;
};

export function getRefreshToken(sessionId: ObjectId | string): string {
  const payload: RefreshTokenPayload = {
    sessionId: sessionId.toString(),
  };

  return signToken(payload, refreshTokenSignOptions);
}

// --- Factory for Creating Session Documents ---

export function buildSessionDocument(
  input: SessionInput,
): Omit<SessionEntity, '_id'> {
  const now = new Date();

  return {
    userId: input.userId,
    ...(input.userAgent && { userAgent: input.userAgent }),
    ...(input.ip && { ip: input.ip }),
    createdAt: now,
    expiresAt:
      input.expiresAt ??
      (typeof thirtyDaysFromNow === 'function'
        ? thirtyDaysFromNow()
        : thirtyDaysFromNow),
  };
}

// --- Collection Index Setup (including TTL) ---

export async function ensureSessionIndexes(db: Db): Promise<void> {
  const collection = db.collection<SessionEntity>('sessions');

  await collection.createIndexes([
    { key: { userId: 1 } },
    // TTL index: automatically removes the document when expiresAt date is reached
    { key: { expiresAt: 1 }, expireAfterSeconds: 0 },
  ]);
}
