import { ObjectId, type Db } from 'mongodb';
export declare function hashValue(value: string): Promise<string>;
export declare function compareValue(value: string, stored: string): Promise<boolean>;
export declare const ROLES: readonly ["user", "admin", "superAdmin"];
export type RoleType = (typeof ROLES)[number];
export declare const GENDERS: readonly ["male", "female", "other", "prefer_not_to_say"];
export type GenderType = (typeof GENDERS)[number];
export interface RoleChange {
    changedBy: ObjectId;
    previousRole: RoleType[];
    newRole: RoleType[];
    changedAt: Date;
}
export interface UserInput {
    email: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    googleId?: string;
    age?: number;
    gender?: GenderType;
    birthDate?: Date;
    ip?: string;
    phoneVerified?: boolean;
    active?: boolean;
    bio?: string;
    phone?: string;
    carrier?: 'att' | 'verizon' | 'tmobile';
    company?: ObjectId;
}
export interface UserEntity {
    _id: ObjectId;
    email: string;
    googleId?: string;
    phone?: string;
    carrier?: 'att' | 'verizon' | 'tmobile';
    firstName: string;
    lastName: string;
    password?: string;
    verified: boolean;
    profilePicture: string;
    isAdmin: boolean;
    role: RoleType[];
    active: boolean;
    company?: ObjectId;
    phoneVerified: boolean;
    otp?: string;
    otpExpiresAt?: Date;
    deletedAt: Date | null;
    roleHistory: RoleChange[];
    age?: number;
    gender?: GenderType;
    birthDate?: Date;
    bio: string;
    lastLoginIp?: string;
    lastLoginAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
export type SafeUser = Omit<UserEntity, '_id' | 'company' | 'password' | 'otp' | 'otpExpiresAt' | 'roleHistory'> & {
    _id: string;
    company?: string;
    fullName: string;
    permissions: string[];
};
export declare function getUserFullName(user: Pick<UserEntity, 'firstName' | 'lastName'>): string;
export declare function getUserPermissions(roles?: RoleType[]): string[];
export declare function sanitizeUser(user: UserEntity): SafeUser;
export declare function comparePassword(plain: string, hashed?: string): Promise<boolean>;
export declare function buildUserDocument(input: UserInput): Promise<Omit<UserEntity, '_id'>>;
export declare function ensureUserIndexes(db: Db): Promise<void>;
//# sourceMappingURL=userModel.d.ts.map