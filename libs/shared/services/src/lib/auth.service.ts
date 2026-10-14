// @domo/libs/services/src/lib/auth.service.ts
import { ObjectId, type Db } from 'mongodb';
import {
  loadEnv,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  TOO_MANY_REQUESTS,
  UNAUTHORIZED,
} from '@domo/constants';
import {
  buildSessionDocument,
  type RefreshTokenPayload,
  type SessionEntity,
} from '@domo/models';
import {
  appAssert,
  compareValue,
  fiveMinutesAgo,
  getPasswordResetTemplate,
  getVerifyEmailTemplate,
  hashValue,
  ONE_DAY_MS,
  oneHourFromNow,
  oneYearFromNow,
  refreshTokenSignOptions,
  sendMail,
  signToken,
  thirtyDaysFromNow,
  verifyToken,
} from '@domo/utils';

const { APP_ORIGIN } = loadEnv();

export enum VerificationCodeType {
  EmailVerification = 'email_verification',
  PasswordReset = 'password_reset',
}

export interface VerificationCodeEntity {
  _id: ObjectId;
  userId: ObjectId;
  type: VerificationCodeType;
  expiresAt: Date;
  createdAt: Date;
}

export interface UserEntity {
  _id: ObjectId;
  email: string;
  password?: string;
  verified: boolean;
  createdAt: Date;
}

const omitPassword = <T extends { password?: string }>(user: T) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// --- Service Methods ---

export type CreateAccountParams = {
  email: string;
  password: string;
  userAgent?: string;
  ip?: string;
};

export const createAccount = async (db: Db, data: CreateAccountParams) => {
  const usersCollection = db.collection<UserEntity>('users');
  const sessionsCollection = db.collection<SessionEntity>('sessions');
  const verificationCollection = db.collection<VerificationCodeEntity>('verification_codes');

  const existingUser = await usersCollection.findOne({ email: data.email });
  appAssert(!existingUser, CONFLICT, 'Email already in use');

  const hashedPassword = await hashValue(data.password);
  const now = new Date();

  const userResult = await usersCollection.insertOne({
    _id: new ObjectId(),
    email: data.email,
    password: hashedPassword,
    verified: false,
    createdAt: now,
  });

  const userId = userResult.insertedId;

  // Create verification code
  const codeResult = await verificationCollection.insertOne({
    _id: new ObjectId(),
    userId,
    type: VerificationCodeType.EmailVerification,
    expiresAt: oneYearFromNow(),
    createdAt: now,
  });

  const verifyUrl = `${APP_ORIGIN}/email/verify/${codeResult.insertedId.toString()}`;

  const { error } = await sendMail({
    to: data.email,
    ...getVerifyEmailTemplate(verifyUrl),
  });
  if (error) console.error('Verification email error:', error);

  // Create session
  const sessionDoc = buildSessionDocument({
    userId,
    userAgent: data.userAgent,
    ip: data.ip,
  });

  const sessionResult = await sessionsCollection.insertOne({
    _id: new ObjectId(),
    ...sessionDoc,
  });

  const sessionId = sessionResult.insertedId.toString();

  const refreshToken = signToken({ sessionId }, refreshTokenSignOptions);
  const accessToken = signToken({ userId: userId.toString(), sessionId });

  const createdUser = await usersCollection.findOne<UserEntity>({ _id: userId });
  appAssert(createdUser, INTERNAL_SERVER_ERROR, 'Failed to create user');

  return {
    user: omitPassword(createdUser),
    accessToken,
    refreshToken,
  };
};

export type LoginParams = {
  email: string;
  password: string;
  userAgent?: string;
  ip?: string;
};

export const loginUser = async (db: Db, { email, password, userAgent, ip }: LoginParams) => {
  const usersCollection = db.collection<UserEntity>('users');
  const sessionsCollection = db.collection<SessionEntity>('sessions');

  const user = await usersCollection.findOne<UserEntity>({ email });
  appAssert(user && user.password, UNAUTHORIZED, 'Invalid email or password');

  const isValid = await compareValue(password, user.password);
  appAssert(isValid, UNAUTHORIZED, 'Invalid email or password');

  const sessionDoc = buildSessionDocument({
    userId: user._id,
    userAgent,
    ip,
  });

  const sessionResult = await sessionsCollection.insertOne({
    _id: new ObjectId(),
    ...sessionDoc,
  });

  const sessionId = sessionResult.insertedId.toString();
  const sessionInfo: RefreshTokenPayload = { sessionId };

  const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);
  const accessToken = signToken({
    ...sessionInfo,
    userId: user._id.toString(),
  });

  return {
    user: omitPassword(user),
    accessToken,
    refreshToken,
  };
};

export const verifyEmail = async (db: Db, code: string) => {
  const usersCollection = db.collection<UserEntity>('users');
  const verificationCollection = db.collection<VerificationCodeEntity>('verification_codes');

  let codeObjectId: ObjectId;
  try {
    codeObjectId = new ObjectId(code);
  } catch {
    appAssert(false, NOT_FOUND, 'Invalid verification code format');
  }

  const validCode = await verificationCollection.findOne<VerificationCodeEntity>({
    _id: codeObjectId,
    type: VerificationCodeType.EmailVerification,
    expiresAt: { $gt: new Date() },
  });
  appAssert(validCode, NOT_FOUND, 'Invalid or expired verification code');

  const updateResult = (await usersCollection.findOneAndUpdate(
    { _id: validCode.userId },
    { $set: { verified: true } },
    { returnDocument: 'after' }
  )) as UserEntity | null;
  appAssert(updateResult, INTERNAL_SERVER_ERROR, 'Failed to verify email');

  await verificationCollection.deleteOne({ _id: validCode._id });

  return {
    user: omitPassword(updateResult),
  };
};

export const refreshUserAccessToken = async (db: Db, refreshToken: string) => {
  const sessionsCollection = db.collection<SessionEntity>('sessions');

  const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
    secret: refreshTokenSignOptions.secret,
  });
  appAssert(payload?.sessionId, UNAUTHORIZED, 'Invalid refresh token');

  const session = await sessionsCollection.findOne<SessionEntity>({
    _id: new ObjectId(payload.sessionId),
  });

  const now = Date.now();
  appAssert(
    session && session.expiresAt.getTime() > now,
    UNAUTHORIZED,
    'Session expired'
  );

  const sessionNeedsRefresh = session.expiresAt.getTime() - now <= ONE_DAY_MS;
  if (sessionNeedsRefresh) {
    const newExpiresAt = thirtyDaysFromNow();
    await sessionsCollection.updateOne(
      { _id: session._id },
      { $set: { expiresAt: newExpiresAt } }
    );
  }

  const newRefreshToken = sessionNeedsRefresh
    ? signToken({ sessionId: session._id.toString() }, refreshTokenSignOptions)
    : undefined;

  const accessToken = signToken({
    userId: session.userId.toString(),
    sessionId: session._id.toString(),
  });

  return {
    accessToken,
    newRefreshToken,
  };
};

export const sendPasswordResetEmail = async (db: Db, email: string) => {
  try {
    const usersCollection = db.collection<UserEntity>('users');
    const verificationCollection = db.collection<VerificationCodeEntity>('verification_codes');

    const user = await usersCollection.findOne<UserEntity>({ email });
    appAssert(user, NOT_FOUND, 'User not found');

    const fiveMinAgo = fiveMinutesAgo();
    const count = await verificationCollection.countDocuments({
      userId: user._id,
      type: VerificationCodeType.PasswordReset,
      createdAt: { $gt: fiveMinAgo },
    });
    appAssert(
      count <= 1,
      TOO_MANY_REQUESTS,
      'Too many requests, please try again later'
    );

    const expiresAt = oneHourFromNow();
    const codeResult = await verificationCollection.insertOne({
      _id: new ObjectId(),
      userId: user._id,
      type: VerificationCodeType.PasswordReset,
      expiresAt,
      createdAt: new Date(),
    });

    const resetUrl = `${APP_ORIGIN}/password/reset?code=${codeResult.insertedId.toString()}&exp=${expiresAt.getTime()}`;

    const { data, error } = await sendMail({
      to: email,
      ...getPasswordResetTemplate(resetUrl),
    });

    appAssert(
      data?.id,
      INTERNAL_SERVER_ERROR,
      `${error?.name} - ${error?.message}`
    );

    return { url: resetUrl, emailId: data.id };
  } catch (error: any) {
    console.error('SendPasswordResetError:', error?.message);
    return {};
  }
};

export type ResetPasswordParams = {
  password: string;
  verificationCode: string;
};

export const resetPassword = async (
  db: Db,
  { verificationCode, password }: ResetPasswordParams
) => {
  const usersCollection = db.collection<UserEntity>('users');
  const sessionsCollection = db.collection<SessionEntity>('sessions');
  const verificationCollection = db.collection<VerificationCodeEntity>('verification_codes');

  let codeObjectId: ObjectId;
  try {
    codeObjectId = new ObjectId(verificationCode);
  } catch {
    appAssert(false, NOT_FOUND, 'Invalid verification code format');
  }

  const validCode = await verificationCollection.findOne<VerificationCodeEntity>({
    _id: codeObjectId,
    type: VerificationCodeType.PasswordReset,
    expiresAt: { $gt: new Date() },
  });
  appAssert(validCode, NOT_FOUND, 'Invalid or expired verification code');

  const hashedPassword = await hashValue(password);
  const updatedUser = (await usersCollection.findOneAndUpdate(
    { _id: validCode.userId },
    { $set: { password: hashedPassword } },
    { returnDocument: 'after' }
  )) as UserEntity | null;
  appAssert(updatedUser, INTERNAL_SERVER_ERROR, 'Failed to reset password');

  await verificationCollection.deleteOne({ _id: validCode._id });
  await sessionsCollection.deleteMany({ userId: validCode.userId });

  return { user: omitPassword(updatedUser) };
};