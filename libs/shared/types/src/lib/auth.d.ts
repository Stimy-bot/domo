import { FastifyRequest } from 'fastify';
import { z } from 'zod';
export declare const AuthEventUserSchema: z.ZodObject<{
    _id: z.ZodString;
    email: z.ZodNullable<z.ZodString>;
    fullName: z.ZodString;
}, z.core.$strip>;
export type AuthEventUser = z.infer<typeof AuthEventUserSchema>;
export declare const ROLES: readonly ["user", "admin", "superAdmin"];
export type RoleType = typeof ROLES[number];
type Role = 'user' | 'admin' | 'superAdmin';
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
export interface AuthenticatedRequest extends FastifyRequest {
    userId: string;
    sessionId: string;
    auth?: AccessTokenPayload;
}
export {};
