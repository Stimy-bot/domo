import { FastifyRequest } from 'fastify';
import { z } from 'zod';

export const AuthEventUserSchema = z.object({
  _id: z.string(),
  email: z.string().nullable(),
  fullName: z.string(),
});

export type AuthEventUser = z.infer<typeof AuthEventUserSchema>;

// Roles available in your system
export const ROLES = ['user', 'admin', 'superAdmin'] as const;
export type RoleType = typeof ROLES[number];

type Role = 'user' | 'admin' | 'superAdmin';

// JWT Access Token Payload
export interface AccessTokenPayload {
  userId: string;
  sessionId: string;
  role: Role[];
  isAdmin: boolean;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  profilePicture: string;
  phone: string;
  age: number;
  gender: string;
  birthDate: Date;
  bio: string;
  verified: boolean;
  phoneVerified: boolean;
  carrier: string;
  otp?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  iat?: number;
  exp?: number;
  aud?: string[];
  permissions?: string[];
}

// Custom request interface extending FastifyRequest
export interface AuthenticatedRequest extends FastifyRequest {
  userId: string;
  sessionId: string;
  auth?: AccessTokenPayload;
}
