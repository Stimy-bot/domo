// libs/shared/services/src/lib/authService.ts
import { loadEnv, VerificationCodeType } from '@domo/constants';
import type { Role } from '@domo/types';
import {
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  TOO_MANY_REQUESTS,
  UNAUTHORIZED,
} from '@domo/types';
import {
  fiveMinutesAgo,
  ONE_DAY_MS,
  oneHourFromNow,
  oneYearFromNow,
  thirtyDaysFromNow,
  getPasswordResetTemplate,
  getVerifyEmailTemplate,
} from '@domo/utils';
import {
  compareValue,
  hashValue,
  sendMail,
  signToken,
  verifyToken,
} from '@domo/utils/server';
import {
  appAssert,
} from '@domo/utils';

import { ObjectId } from '@fastify/mongodb';
import type { FastifyBaseLogger } from 'fastify';
import type { Db } from 'mongodb';
import { insertLogIntoDb } from './auditService.js';
import { twilioService } from './twilioService.js';

const env = loadEnv();

/**
 * Helper to normalize IP addresses
 */
const normalizeIp = (ip?: string) =>
  ip === '::1' || ip === '::ffff:127.0.0.1' ? '127.0.0.1' : ip || 'unknown';

/**
 * Helper to strip sensitive password hash before returning user
 */
const sanitizeUser = <T extends Record<string, unknown>>(user: T) => {
  const sanitized = { ...user };
  delete sanitized['password'];
  return sanitized as Omit<T, 'password'>;
};

// ==========================================
// Types
// ==========================================
export interface ServiceContext {
  db: Db;
  logger?: FastifyBaseLogger;
}

export interface UserDocument {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phone?: string;
  password?: string;
  role: Role[];
  active: boolean;
  phoneVerified: boolean;
  verified?: boolean;
  profilePicture?: string;
  lastLoginIp?: string;
  lastLoginAt?: Date;
  [key: string]: unknown;
}

export type CreateAccountParams = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  age?: number;
  bio?: string;
  gender?: string;
  birthDate?: Date;
  ip: string;
  userAgent: string;
};

export type LoginParams = {
  email: string;
  password: string;
  userAgent?: string;
  ip: string;
};

export type ResetPasswordParams = {
  password: string;
  verificationCode: string;
};

export type UpdateAccountParams = {
  userId: string;
  userAgent?: string;
  actorId?: string;
  ip?: string;
  role?: Role | Role[];
  active?: boolean;
  firstName?: string;
  lastName?: string;
  email?: string;
  bio?: string;
  gender?: string;
  birthDate?: Date;
  password?: string;
  phone?: string;
  profilePicture?: string;
  method?: string;
  [key: string]: unknown;
};

export type OtpRequestParams = {
  phone: string;
  ip: string;
  userAgent?: string;
};

export type OtpVerifyParams = {
  phone: string;
  otp: string;
  ip: string;
  userAgent?: string;
};

// ==========================================
// Token Creation Helper
// ==========================================
/**
 * Inserts a session document and returns signed access + refresh tokens.
 * Uses shared signToken from @domo/utils for signing.
 */
export const createSessionAndTokens = async (
  ctx: ServiceContext,
  userId: ObjectId,
  role: Role | Role[],
  email: string,
  fullName: string,
  userAgent = 'unknown',
  ip = 'unknown',
) => {
  const sessionsCollection = ctx.db.collection('sessions');

  const sessionResult = await sessionsCollection.insertOne({
    userId,
    userAgent,
    ip: normalizeIp(ip),
    expiresAt: thirtyDaysFromNow(),
    createdAt: new Date(),
  });

  const sessionId = sessionResult.insertedId.toString();
  const rolesArray = Array.isArray(role) ? role : [role];

  // Access token: sign with default secret (handled by signToken)
  const accessToken = signToken({
    userId: userId.toString(),
    email,
    fullName,
    role: rolesArray,
    sessionId,
  });

  // Refresh token: sign with explicit refresh secret and expiry duration
  const refreshToken = signToken(
    { sessionId },
    { expiresIn: '30d' },
  );

  return { accessToken, refreshToken, sessionId };
};

// ==========================================
// Service Methods
// ==========================================

export const createAccount = async (
  ctx: ServiceContext,
  {
    firstName,
    lastName,
    email,
    phone,
    age,
    bio,
    gender,
    birthDate,
    password,
    userAgent,
    ip,
  }: CreateAccountParams,
) => {
  const usersCollection = ctx.db.collection<UserDocument>('users');
  const codesCollection = ctx.db.collection('verificationCodes');

  // 1. Check for existing user
  const existingUser = await usersCollection.findOne({
    $or: [{ email }, { phone }],
  });

  if (existingUser?.phoneVerified) {
    appAssert(false, CONFLICT, 'This account is already verified. Please login.');
  }

  // 2. Upsert User
  const hashedPassword = await hashValue(password);
  const filter = { $or: [{ email }, { phone }] };
  const update = {
    $set: {
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`.trim(),
      email,
      phone,
      bio,
      gender,
      age,
      ip: normalizeIp(ip),
      birthDate,
      password: hashedPassword,
      phoneVerified: false,
      active: true,
      role: ['user' as Role],
      updatedAt: new Date(),
    },
    $setOnInsert: {
      createdAt: new Date(),
    },
  };

  const options = { upsert: true, returnDocument: 'after' as const };
  const user = await usersCollection.findOneAndUpdate(filter, update, options);

  appAssert(user, INTERNAL_SERVER_ERROR, 'Failed to create account');

  // 3. Twilio Verify Integration
  if (phone) {
    try {
      await twilioService.sendVerificationCode(phone, ctx.logger);
    } catch (err: unknown) {
      if (ctx.logger) {
        ctx.logger.error({ err, phone }, 'Twilio Verify start failed during registration');
      } else {
        console.error('Twilio Verify start failed during registration:', err);
      }
    }
  }

  // 4. Create Email Verification Code
  const codeValue = Math.floor(100000 + Math.random() * 900000).toString();
  const codeInsert = await codesCollection.insertOne({
    userId: user._id,
    target: email,
    type: VerificationCodeType.EmailVerification,
    expiresAt: oneYearFromNow(),
    code: codeValue,
    createdAt: new Date(),
  });

  // 5. Send Verification Email
  const url = `${env.APP_ORIGIN}/email/verify/${codeInsert.insertedId.toString()}`;
  sendMail({
    to: email,
    ...getVerifyEmailTemplate(url),
  }).catch((err: unknown) => {
    if (ctx.logger) {
      ctx.logger.error({ err, email }, 'Verification email sending failed');
    } else {
      console.error('Email failed:', err);
    }
  });

  // 6. Create Session and Tokens
  const { accessToken, refreshToken } = await createSessionAndTokens(
    ctx,
    user._id,
    user.role,
    user.email,
    user.fullName || '',
    userAgent,
    ip,
  );

  return { user: sanitizeUser(user), accessToken, refreshToken };
};

export const loginUser = async (
  ctx: ServiceContext,
  { email, password, userAgent = 'unknown', ip }: LoginParams,
) => {
  const usersCollection = ctx.db.collection<UserDocument>('users');

  const user = await usersCollection.findOne({ email });
  appAssert(user?.password, UNAUTHORIZED, 'Invalid email or password');

  const isValid = await compareValue(password, user.password);
  appAssert(isValid, UNAUTHORIZED, 'Invalid email or password');

  const updatedIp = normalizeIp(ip);
  const now = new Date();

  await usersCollection.updateOne(
    { _id: user._id },
    { $set: { lastLoginIp: updatedIp, lastLoginAt: now } },
  );

  const { accessToken, refreshToken } = await createSessionAndTokens(
    ctx,
    user._id,
    user.role,
    user.email,
    user.fullName || '',
    userAgent,
    ip,
  );

  return { user: sanitizeUser(user), accessToken, refreshToken };
};

export const refreshUserAccessToken = async (ctx: ServiceContext, refreshToken: string) => {
  const { payload } = verifyToken<{ sessionId?: string }>(refreshToken);
  appAssert(payload, UNAUTHORIZED, 'Invalid refresh token');
  const sessionId = payload.sessionId;

  appAssert(sessionId, UNAUTHORIZED, 'Invalid refresh token');

  const sessionsCollection = ctx.db.collection('sessions');
  const usersCollection = ctx.db.collection<UserDocument>('users');

  const session = await sessionsCollection.findOne({
    _id: new ObjectId(sessionId),
  });
  const now = Date.now();
  appAssert(
    session && new Date(session.expiresAt as string | number | Date).getTime() > now,
    UNAUTHORIZED,
    'Session expired',
  );

  const expiresAtMs = new Date(session.expiresAt as string | number | Date).getTime();
  if (expiresAtMs - now <= ONE_DAY_MS) {
    await sessionsCollection.updateOne(
      { _id: session._id },
      { $set: { expiresAt: thirtyDaysFromNow() } },
    );
  }

  const user = await usersCollection.findOne({
    _id: new ObjectId(session.userId as string | ObjectId),
  });
  appAssert(user, INTERNAL_SERVER_ERROR, 'User not found during token refresh');

  const newAccessToken = signToken(
    {
      userId: user._id.toString(),
      email: user.email,
      fullName: user.fullName || '',
      role: user.role,
      sessionId: session._id.toString(),
    },
    { expiresIn: '15m' },
  );

  const newRefreshToken = signToken(
    { sessionId: session._id.toString() },
    { expiresIn: '30d' },
  );

  return { accessToken: newAccessToken, newRefreshToken };
};

export const verifyEmail = async (ctx: ServiceContext, codeId: string) => {
  const codesCollection = ctx.db.collection('verificationCodes');
  const usersCollection = ctx.db.collection<UserDocument>('users');

  const validCode = await codesCollection.findOne({
    _id: new ObjectId(codeId),
    type: VerificationCodeType.EmailVerification,
    expiresAt: { $gt: new Date() },
  });
  appAssert(validCode, NOT_FOUND, 'Invalid or expired verification code');

  const updatedUser = await usersCollection.findOneAndUpdate(
    { _id: new ObjectId(validCode.userId as string | ObjectId) },
    { $set: { verified: true } },
    { returnDocument: 'after' },
  );
  appAssert(updatedUser, INTERNAL_SERVER_ERROR, 'Failed to verify email');

  await codesCollection.deleteOne({ _id: validCode._id });

  return { user: sanitizeUser(updatedUser) };
};

export const sendPasswordResetEmail = async (ctx: ServiceContext, email: string) => {
  const usersCollection = ctx.db.collection('users');
  const codesCollection = ctx.db.collection('verificationCodes');

  const user = await usersCollection.findOne({ email });
  appAssert(user, NOT_FOUND, 'User not found');

  const recent = await codesCollection.countDocuments({
    userId: user._id,
    type: VerificationCodeType.PasswordReset,
    createdAt: { $gt: fiveMinutesAgo() },
  });
  appAssert(recent <= 1, TOO_MANY_REQUESTS, 'Try again later');

  const expiresAt = oneHourFromNow();
  const verificationCodeValue = Math.floor(100000 + Math.random() * 900000).toString();

  const codeInsert = await codesCollection.insertOne({
    userId: user._id,
    target: email,
    type: VerificationCodeType.PasswordReset,
    expiresAt,
    code: verificationCodeValue,
    createdAt: new Date(),
  });

  const url = `${env.APP_ORIGIN}/password/reset?code=${codeInsert.insertedId.toString()}&exp=${expiresAt.getTime()}`;

  const { data, error } = await sendMail({
    to: email,
    ...getPasswordResetTemplate(url),
  });

  if (error) {
    if (ctx.logger) ctx.logger.error({ error }, 'Resend API Error');
    appAssert(false, INTERNAL_SERVER_ERROR, `Email failed: ${error.message}`);
  }

  appAssert(data?.id, INTERNAL_SERVER_ERROR, `Failed to send email`);

  return { url, emailId: data.id };
};

export const resetPassword = async (
  ctx: ServiceContext,
  { verificationCode, password }: ResetPasswordParams,
) => {
  const codesCollection = ctx.db.collection('verificationCodes');
  const usersCollection = ctx.db.collection<UserDocument>('users');
  const sessionsCollection = ctx.db.collection('sessions');

  const code = await codesCollection.findOne({
    _id: new ObjectId(verificationCode),
    type: VerificationCodeType.PasswordReset,
    expiresAt: { $gt: new Date() },
  });
  appAssert(code, NOT_FOUND, 'Invalid or expired code');

  const userId = new ObjectId(code.userId as string | ObjectId);
  const newHashedPassword = await hashValue(password);

  await usersCollection.updateOne({ _id: userId }, { $set: { password: newHashedPassword } });

  await codesCollection.deleteOne({ _id: code._id });
  await sessionsCollection.deleteMany({ userId });

  const user = await usersCollection.findOne({ _id: userId });
  appAssert(user, INTERNAL_SERVER_ERROR, 'User retrieval failed');

  return { user: sanitizeUser(user) };
};

export const updateAccount = async (
  ctx: ServiceContext,
  { userId, userAgent = '', ip, role, active, method = 'manual', ...fields }: UpdateAccountParams,
) => {
  const usersCollection = ctx.db.collection<UserDocument>('users');
  const targetId = new ObjectId(userId);

  const user = await usersCollection.findOne({ _id: targetId });
  appAssert(user, NOT_FOUND, 'User not found');

  const oldRole = Array.isArray(user.role) ? [...user.role] : [user.role];
  const oldStatus = user.active;

  const allowedFields = [
    'email',
    'firstName',
    'lastName',
    'profilePicture',
    'phone',
    'password',
    'role',
    'active',
    'bio',
    'gender',
    'birthDate',
    'age',
    'carrier',
  ];

  const updateFields: Record<string, unknown> = {};
  let profileChanged = false;

  Object.keys(fields).forEach(key => {
    if (allowedFields.includes(key) && fields[key] !== undefined) {
      if (user[key] !== fields[key]) {
        profileChanged = true;
        updateFields[key] = fields[key];
      }
    }
  });

  if (role) {
    updateFields['role'] = Array.isArray(role) ? role : [role];
  }
  if (typeof active === 'boolean') {
    updateFields['active'] = active;
  }

  if (updateFields['firstName'] || updateFields['lastName']) {
    const fn = (updateFields['firstName'] as string) || user.firstName;
    const ln = (updateFields['lastName'] as string) || user.lastName;
    updateFields['fullName'] = `${fn} ${ln}`.trim();
  }

  if (Object.keys(updateFields).length > 0) {
    updateFields['updatedAt'] = new Date();
    await usersCollection.updateOne({ _id: targetId }, { $set: updateFields });
  }

  const updatedUser = await usersCollection.findOne({ _id: targetId });
  appAssert(updatedUser, INTERNAL_SERVER_ERROR, 'User retrieval failed');

  const logBase = {
    actor: {
      _id: userId,
      email: updatedUser.email,
      fullName: updatedUser.fullName || 'Unknown',
    },
    target: {
      _id: updatedUser._id.toString(),
      email: updatedUser.email,
      fullName: updatedUser.fullName || 'Unknown',
    },
    ip: normalizeIp(ip),
  };

  if (role !== undefined && JSON.stringify(updatedUser.role) !== JSON.stringify(oldRole)) {
    await insertLogIntoDb(ctx.db, {
      ...logBase,
      type: 'user_update',
      metadata: {
        method: method || 'manual',
        action: 'role_change',
        previous: oldRole.join(', '),
        current: updatedUser.role.join(', '),
      },
    }).catch((err: unknown) => ctx.logger?.error({ err }, 'Audit Log Failed'));
  }

  if (typeof active === 'boolean' && active !== oldStatus) {
    await insertLogIntoDb(ctx.db, {
      ...logBase,
      type: 'user_status_change',
      metadata: {
        previousStatus: String(oldStatus),
        newStatus: String(active),
        method: method || 'manual',
      },
    }).catch((err: unknown) => ctx.logger?.error({ err }, 'Audit Log Failed'));
  }

  if (profileChanged) {
    await insertLogIntoDb(ctx.db, {
      ...logBase,
      type: 'user_update',
      metadata: {
        method: method === 'oauth' ? 'oauth' : 'manual',
        action: 'profile_update',
        updatedFields: Object.keys(fields).filter(k => allowedFields.includes(k)),
      },
    }).catch((err: unknown) => ctx.logger?.error({ err }, 'Audit Log Failed'));
  }

  const { accessToken, refreshToken } = await createSessionAndTokens(
    ctx,
    updatedUser._id,
    updatedUser.role,
    updatedUser.email,
    updatedUser.fullName || '',
    userAgent,
    ip,
  );

  return {
    user: sanitizeUser(updatedUser),
    accessToken,
    refreshToken,
  };
};

export const updateProfilePicture = async (
  ctx: ServiceContext,
  userId: string,
  firebaseImageUrl: string,
) => {
  const usersCollection = ctx.db.collection<UserDocument>('users');

  const updatedUser = await usersCollection.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $set: { profilePicture: firebaseImageUrl, updatedAt: new Date() } },
    { returnDocument: 'after' },
  );

  appAssert(updatedUser, NOT_FOUND, 'User not found');
  return sanitizeUser(updatedUser);
};

export const deleteAccount = async (ctx: ServiceContext, userId: string) => {
  const usersCollection = ctx.db.collection('users');
  const sessionsCollection = ctx.db.collection('sessions');

  const deleted = await usersCollection.deleteOne({
    _id: new ObjectId(userId),
  });
  appAssert(deleted.deletedCount > 0, NOT_FOUND, 'User not found');

  await sessionsCollection.deleteMany({ userId: new ObjectId(userId) });
  return { message: 'Account deleted successfully' };
};

export const deleteAllUsers = async (ctx: ServiceContext) => {
  const usersCollection = ctx.db.collection('users');
  const sessionsCollection = ctx.db.collection('sessions');
  const codesCollection = ctx.db.collection('verificationCodes');

  const result = await usersCollection.deleteMany({});
  await sessionsCollection.deleteMany({});
  await codesCollection.deleteMany({});

  return {
    message: 'All accounts and related data deleted successfully',
    deletedCount: result.deletedCount,
  };
};

export const requestOtpService = async (
  ctx: ServiceContext,
  { phone, ip, userAgent }: OtpRequestParams,
) => {
  const usersCollection = ctx.db.collection<UserDocument>('users');

  const user = await usersCollection.findOne({ phone });
  appAssert(user, NOT_FOUND, 'User with this phone number not found');

  try {
    await twilioService.sendVerificationCode(phone, ctx.logger);
  } catch (err: unknown) {
    if (ctx.logger) {
      ctx.logger.error({ err, phone }, 'Twilio requestOtpService failure');
    }
    appAssert(false, UNAUTHORIZED, 'Failed to send OTP. Try again later.');
  }

  await insertLogIntoDb(ctx.db, {
    type: 'otp_request',
    actor: {
      _id: user._id.toString(),
      email: user.email,
      fullName: user.fullName || '',
    },
    ip: normalizeIp(ip),
    metadata: { method: 'sms', phone, userAgent },
  });

  return { message: 'OTP sent successfully' };
};

export const verifyOtpService = async (
  ctx: ServiceContext,
  { phone, otp, ip, userAgent }: OtpVerifyParams,
) => {
  const usersCollection = ctx.db.collection<UserDocument>('users');

  const user = await usersCollection.findOne({ phone });
  appAssert(user, NOT_FOUND, 'User not found');

let check: { valid?: boolean };
  try {
    check = await twilioService.checkVerificationCode(phone, otp, ctx.logger);
  } catch (err: unknown) {
    if (ctx.logger) {
      ctx.logger.error({ err, phone }, 'Twilio checkVerificationCode error');
    }
    appAssert(false, UNAUTHORIZED, 'Invalid or expired OTP');
  }

  appAssert(check && check.valid, UNAUTHORIZED, 'Invalid or expired OTP');

  await usersCollection.updateOne({ _id: user._id }, { $set: { phoneVerified: true } });

  const { accessToken, refreshToken } = await createSessionAndTokens(
    ctx,
    user._id,
    user.role,
    user.email,
    user.fullName || '',
    userAgent,
    ip,
  );

  await insertLogIntoDb(ctx.db, {
    type: 'otp_verification',
    actor: {
      _id: user._id.toString(),
      email: user.email,
      fullName: user.fullName || '',
    },
    ip: normalizeIp(ip),
    metadata: { method: 'sms', success: true, phone, userAgent },
  });

  return { user: sanitizeUser(user), accessToken, refreshToken };
};
