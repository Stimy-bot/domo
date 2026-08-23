import { ObjectId, type Db } from 'mongodb';
import {VerificationCodeType} from '@domo/constants';

export type VerificationCodeTypeKey = keyof typeof VerificationCodeType;

export interface VerificationCodeInput {
  userId: ObjectId | string;
  target?: string;
  type: VerificationCodeTypeKey;
  code?: string;
  expiresAt: Date | string;
}

// Raw MongoDB document structure
export interface VerificationCodeEntity {
  _id: ObjectId;
  userId: ObjectId;
  target?: string;
  type: VerificationCodeTypeKey;
  code?: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Formatted structure for API responses
export type SafeVerificationCode = Omit<
  VerificationCodeEntity,
  '_id' | 'userId'
> & {
  _id: string;
  userId: string;
};

// --- Sanitization Helper ---

export function sanitizeVerificationCode(
  codeDoc: VerificationCodeEntity,
): SafeVerificationCode {
  const { _id, userId, ...rest } = codeDoc;
  return {
    ...rest,
    _id: _id.toString(),
    userId: userId.toString(),
  };
}

// --- Factory for Creating Verification Code Documents ---

export function buildVerificationCodeDocument(
  input: VerificationCodeInput,
): Omit<VerificationCodeEntity, '_id'> {
  const now = new Date();

  const parsedUserId =
    typeof input.userId === 'string'
      ? new ObjectId(input.userId)
      : input.userId;

  const parsedExpiresAt =
    typeof input.expiresAt === 'string'
      ? new Date(input.expiresAt)
      : input.expiresAt;

  // Validate conditional requirement for code
  if (input.type !== VerificationCodeType.EmailVerification && !input.code) {
    throw new Error(
      `Verification code is required for type "${String(input.type)}"`,
    );
  }

  return {
    userId: parsedUserId,
    ...(input.target && { target: input.target.trim() }),
    type: input.type,
    ...(input.code && { code: input.code.trim() }),
    expiresAt: parsedExpiresAt,
    createdAt: now,
    updatedAt: now,
  };
}

// --- Collection Index Setup (including TTL) ---

export async function ensureVerificationCodeIndexes(db: Db): Promise<void> {
  const collection = db.collection<VerificationCodeEntity>('verificationCodes');

  await collection.createIndexes([
    { key: { userId: 1 } },
    { key: { type: 1 } },
    // TTL Index: automatically deletes document when expiresAt date is reached
    { key: { expiresAt: 1 }, expireAfterSeconds: 0 },
  ]);
}

