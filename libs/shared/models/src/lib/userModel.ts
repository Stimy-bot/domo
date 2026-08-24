// libs/shared-models/src/lib/userModel.ts
import { ObjectId, type Db } from 'mongodb';
import { rolePermissions } from '@domo/constants';
import { randomBytes, scrypt as _scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

const SALT_BYTES = 16;
const KEY_LEN = 64; // bytes

export async function hashValue(value: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES).toString('hex');
  const derived = (await scrypt(value, salt, KEY_LEN)) as Buffer;
  return `${salt}:${derived.toString('hex')}`;
}

export async function compareValue(value: string, stored: string): Promise<boolean> {
  const [salt, keyHex] = stored.split(':');
  if (!salt || !keyHex) return false;
  const derived = (await scrypt(value, salt, KEY_LEN)) as Buffer;
  const key = Buffer.from(keyHex, 'hex');
  if (derived.length !== key.length) return false;
  return timingSafeEqual(derived, key);
}


export const ROLES = ['user', 'admin', 'superAdmin'] as const;
export type RoleType = (typeof ROLES)[number];

export const GENDERS = ['male', 'female', 'other', 'prefer_not_to_say'] as const;
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

// Complete raw MongoDB document structure
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

// Type formatted for API responses
export type SafeUser = Omit<
  UserEntity,
  '_id' | 'company' | 'password' | 'otp' | 'otpExpiresAt' | 'roleHistory'
> & {
  _id: string;
  company?: string;
  fullName: string;
  permissions: string[];
};

// --- Virtual Utilities ---

export function getUserFullName(user: Pick<UserEntity, 'firstName' | 'lastName'>): string {
  return `${user.firstName || ''} ${user.lastName || ''}`.trim();
}

export function getUserPermissions(roles: RoleType[] = []): string[] {
  const permissionSet = new Set<string>();
  roles.forEach((role) => {
    const perms = rolePermissions[role];
    if (perms) perms.forEach((p: string) => permissionSet.add(p));
  });
  return Array.from<string>(permissionSet);
}

export function sanitizeUser(user: UserEntity): SafeUser {
  const { password, otp, otpExpiresAt, roleHistory, _id, company, ...safe } = user;
  void password;
  void otp;
  void otpExpiresAt;
  void roleHistory;

  return {
    ...safe,
    _id: _id.toString(),
    ...(company ? { company: company.toString() } : {}),
    fullName: getUserFullName(user),
    permissions: getUserPermissions(user.role),
  };
}

// --- Password & Auth Helpers ---

export async function comparePassword(plain: string, hashed?: string): Promise<boolean> {
  if (!hashed) return false;
  return compareValue(plain, hashed);
}

// --- Factory for Creating Documents ---

export async function buildUserDocument(input: UserInput): Promise<Omit<UserEntity, '_id'>> {
  const now = new Date();
  const hashedPassword = input.password ? await hashValue(input.password) : undefined;

  return {
    email: input.email.toLowerCase().trim(),
    ...(input.googleId && { googleId: input.googleId }),
    ...(input.phone && { phone: input.phone.trim() }),
    ...(input.carrier && { carrier: input.carrier }),
    firstName: input.firstName?.trim() ?? '',
    lastName: input.lastName?.trim() ?? '',
    ...(hashedPassword && { password: hashedPassword }),
    verified: false,
    profilePicture:
      'https://cdn.pixabay.com/photo/2017/06/13/12/53/profile-2398782_640.png',
    isAdmin: false,
    role: ['user'],
    active: true,
    ...(input.company && { company: input.company }),
    phoneVerified: false,
    deletedAt: null,
    roleHistory: [],
    ...(input.age !== undefined && { age: input.age }),
    ...(input.gender && { gender: input.gender }),
    ...(input.birthDate && { birthDate: input.birthDate }),
    bio: input.bio?.trim() ?? '',
    lastLoginAt: now,
    createdAt: now,
    updatedAt: now,
  };
}

// --- Collection Index Setup ---

export async function ensureUserIndexes(db: Db): Promise<void> {
  const collection = db.collection<UserEntity>('users');

  await collection.createIndexes([
    { key: { email: 1 }, unique: true },
    { key: { googleId: 1 }, unique: true, sparse: true },
    { key: { phone: 1 }, unique: true, sparse: true },
    { key: { active: 1 } },
    { key: { company: 1 } },
    { key: { company: 1, active: 1 } },
  ]);
}
