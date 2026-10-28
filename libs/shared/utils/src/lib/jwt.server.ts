// libs/shared/utils/src/lib/jwt.server.ts

import { serverEnv } from '@domo/constants/server';
import jwt, { type SignOptions } from 'jsonwebtoken';
import type { Role } from '@domo/types';

if (typeof window !== 'undefined') {
  throw new Error('[SECURITY ERROR] jwt.server.ts was imported in a browser environment!');
}

export interface UserPayload {
userId?: string;
  email?: string;
  role?: string | Role[];
  fullName?: string;  
  sessionId?: string;
}

/**
 * Sign a JWT token (Server-only)
 */
export function signToken(
  payload: UserPayload,
  expiresIn: SignOptions['expiresIn'] = '1d',
): string {
  return jwt.sign(payload, serverEnv.JWT_SECRET, { expiresIn });
}

/**
 * Verify a JWT token (Server-only)
 */
export function verifyServerToken(token: string): UserPayload {
  return jwt.verify(token, serverEnv.JWT_SECRET) as UserPayload;
}
