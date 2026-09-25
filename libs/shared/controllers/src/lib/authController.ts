// libs/shared/controllers/src/lib/authController.ts
import type { FastifyReply, FastifyRequest } from 'fastify';
import { ObjectId } from 'bson';
import { z } from 'zod';
import {
  BAD_REQUEST,
  CONFLICT,
  CREATED,
  OK,
  UNAUTHORIZED,
} from '@domo/types';
import { AppErrorCode } from '@domo/constants'
import { buildUserDocument, sanitizeUser, type UserEntity } from '@domo/models';
import {
  emailSchema,
  ipAddressSchema,
  loginSchema,
  registerSchema,
  requestOtpSchema,
  resetPasswordSchema,
  verificationCodeSchema,
} from '@domo/schemas';
import {
  createAccount,
  createSessionAndTokens,
  exchangeCodeForToken,
  getGoogleUser,
  logAuthEvent,
  loginUser,
  refreshUserAccessToken,
  requestOtpService,
  resetPassword,
  sendPasswordResetEmail,
  verifyEmail,
  verifyOtpService,
} from '@domo/services';
import {
  appAssert,
  AppError,
  catchErrors,
  clearAuthCookies,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  setAuthCookies,
  verifyToken,
} from '@domo/utils';

// Helper to reliably retrieve or derive full name
const getFullName = (user: {
  firstName?: string;
  lastName?: string;
  fullName?: string;
}) => user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim();

export const registerHandler = catchErrors(
  async (req: FastifyRequest, reply: FastifyReply) => {
    const xForwardedFor = req.headers['x-forwarded-for'];
    const clientIp =
      (typeof xForwardedFor === 'string'
        ? xForwardedFor.split(',')[0]?.trim()
        : Array.isArray(xForwardedFor)
          ? xForwardedFor[0]
          : undefined) ||
      req.ip ||
      '127.0.0.1';

    const result = registerSchema.safeParse({
      ...(req.body as object),
      userAgent: (req.headers['user-agent'] as string) || 'unknown',
      ip: clientIp,
    });

    if (!result.success) {
      const formattedErrors = z.treeifyError(result.error);
      req.log.error(
        { errors: formattedErrors },
        ' Registration Validation Failed',
      );

      return reply.status(BAD_REQUEST).send({
        message: 'Invalid registration data',
        errors: formattedErrors,
      });
    }

    const requestData = result.data;
    const email = (requestData.email || '').trim().toLowerCase();
const phone = typeof requestData.phone === 'string'      ? requestData.phone.replace(/\D/g, '')
      : undefined;

    const usersCollection = req.db.collection<UserEntity>('users');
    const existingUser = await usersCollection.findOne({
      $or: [{ email }, ...(phone ? [{ phone }] : [])],
    });

    if (existingUser) {
      const safeExisting = sanitizeUser(existingUser);
      req.log.warn(
        {
          email: safeExisting.email,
          phone: safeExisting.phone,
          id: safeExisting._id,
        },
        ' Registration attempt for existing user',
      );

      const resolvedEmail = safeExisting.email || email || '';

      await logAuthEvent(
        req,
        {
          _id: safeExisting._id as string | ObjectId,
          email: resolvedEmail,
          fullName: getFullName(safeExisting),
        },
        'user_register_conflict',
        { method: 'manual', email: resolvedEmail },
      );

      return reply.status(CONFLICT).send({
        message: 'A user with that email or phone already exists',
      });
    }

    const { user, accessToken, refreshToken } = await createAccount(
      { db: req.db, logger: req.log },
      {
        ...requestData,
        age: requestData.age ? Number(requestData.age) : undefined,
        userAgent: requestData.userAgent || 'Unknown',
      },
    );

    await logAuthEvent(
      req,
      {
        _id: user['_id'] as string | ObjectId,
        email: user['email'] as string || email,
        fullName: getFullName(user),
      },
      'user_register',
      { method: 'manual',
        email: user['email'] as string || email,
       },
    );

    setAuthCookies({ reply, accessToken, refreshToken });
    return reply.status(CREATED).send(user);
  },
);

export const loginHandler = catchErrors(
  async (req: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = loginSchema.parse(req.body);

    const userAgent = (req.headers['user-agent'] as string) || 'unknown';
    const xForwardedFor = req.headers['x-forwarded-for'];
    const rawIp =
      (typeof xForwardedFor === 'string'
        ? xForwardedFor.split(',')[0]?.trim()
        : Array.isArray(xForwardedFor)
          ? xForwardedFor[0]
          : undefined) ||
      req.ip ||
      '127.0.0.1';

    const normalizedIp = rawIp === '::1' ? '127.0.0.1' : rawIp;
    ipAddressSchema.parse(normalizedIp);

    const { user, accessToken, refreshToken } = await loginUser(
      { db: req.db, logger: req.log },
      {
        email,
        password,
        userAgent,
        ip: normalizedIp,
      },
    );

    appAssert(
      user['active'] ?? true,
      UNAUTHORIZED,
      'Your account is not active.',
      AppErrorCode.AccountInactive,
    );

    logAuthEvent(
      req,
      {
        _id: user['_id'] as string | ObjectId,
        email: typeof user?.email === 'string' ? user.email : undefined,
        fullName: getFullName(user),
      },
      'user_login',
      { method: 'password', success: true },
    ).catch((err) => req.log.error({ err }, 'Audit log failed'));

    setAuthCookies({ reply, accessToken, refreshToken });
    return reply.status(OK).send({ message: 'Login successful', user });
  },
);

export const logoutHandler = catchErrors(
  async (req: FastifyRequest, reply: FastifyReply) => {
    const accessToken = req.cookies['accessToken'];

    if (!accessToken) {
      clearAuthCookies(reply);
      return reply.status(OK).send({ message: 'Logout successful' });
    }

    const { payload } = verifyToken(accessToken);

    if (payload?.userId) {
      // 1. Log event
      const usersCollection = req.db.collection<UserEntity>('users');
      const user = await usersCollection.findOne({
        _id: new ObjectId(payload.userId),
      });

      if (user) {
        const safeUser = sanitizeUser(user);
        await logAuthEvent(
          req,
          {
            _id: safeUser._id,
            email: safeUser.email,
            fullName: getFullName(safeUser),
          },
          'user_logout',
          { method: 'manual' },
        );
      }

      // 2. Delete session
      if (
        'sessionId' in payload &&
        typeof payload.sessionId === 'string' &&
        ObjectId.isValid(payload.sessionId)
      ) {
        await req.db
          .collection('sessions')
          .deleteOne({ _id: new ObjectId(payload.sessionId) });
      }
    }

    // Always clear cookies on logout
    clearAuthCookies(reply);
    return reply.status(OK).send({ message: 'Logout successful' });
  },
);

export const refreshHandler = catchErrors(
  async (req: FastifyRequest, reply: FastifyReply) => {
    const refreshToken = req.cookies['refreshToken'];
    appAssert(refreshToken, UNAUTHORIZED, 'Missing refresh token');

    const { accessToken, newRefreshToken } = await refreshUserAccessToken(
      { db: req.db, logger: req.log },
      refreshToken,
    );

    if (newRefreshToken) {
      reply.cookie(
        'refreshToken',
        newRefreshToken,
        getRefreshTokenCookieOptions(),
      );
    }

    reply.cookie('accessToken', accessToken, getAccessTokenCookieOptions());
    return reply.status(OK).send({ message: 'Access token refreshed' });
  },
);

export const verifyEmailHandler = catchErrors(
  async (
    req: FastifyRequest<{ Params: { code: string } }>,
    reply: FastifyReply,
  ) => {
    const verificationCode = verificationCodeSchema.parse(req.params.code);
    const result = await verifyEmail(
      { db: req.db, logger: req.log },
      verificationCode,
    );

    await logAuthEvent(
      req,
      {
        _id: result.user['_id'] as string | ObjectId,
        email:
          typeof result.user['email'] === 'string'
            ? result.user['email']
            : undefined,
        fullName: getFullName(result.user),
      },
      'email_verification',
      {
        method: 'link_click',
        verificationId: verificationCode,
        email:
          typeof result.user['email'] === 'string'
            ? result.user['email']
            : undefined,
      },
    );

    return reply
      .status(OK)
      .send({ message: 'Email was successfully verified' });
  },
);

export const sendPasswordResetHandler = catchErrors(
  async (req: FastifyRequest, reply: FastifyReply) => {
    const body = req.body as { email?: string };
    const email = emailSchema.parse(body?.email);

    await sendPasswordResetEmail({ db: req.db, logger: req.log }, email);

    await logAuthEvent(
      req,
      {
        _id: new ObjectId().toString(),
        email,
        fullName: 'Password Resetter',
      },
      'password_reset',
      {
        method: 'manual',
        success: true,
        email,
      },
    );

    return reply.status(OK).send({ message: 'Password reset email sent' });
  },
);

export const resetPasswordHandler = catchErrors(
  async (req: FastifyRequest, reply: FastifyReply) => {
    const requestData = resetPasswordSchema.parse(req.body);
    const result = await resetPassword(
      { db: req.db, logger: req.log },
      requestData,
    );

    await logAuthEvent(
      req,
      {
        _id: result.user['_id'] as string | ObjectId,
        email:
          typeof result.user['email'] === 'string'
            ? result.user['email']
            : undefined,
        fullName: getFullName(result.user),
      },
      'password_reset',
      {
        method: 'manual',
        success: true,
      },
    );

    clearAuthCookies(reply);
    return reply
      .status(OK)
      .send({ message: 'Password was reset successfully' });
  },
);

export const requestOtpHandler = catchErrors(
  async (req: FastifyRequest, reply: FastifyReply) => {
    const { phone } = requestOtpSchema.parse(req.body);
    const userAgent = (req.headers['user-agent'] as string) || 'unknown';
    const ip = req.ip || 'unknown';

    const result = await requestOtpService(
      { db: req.db, logger: req.log },
      { phone, ip, userAgent },
    );

    await logAuthEvent(
      req,
      {
        _id: new ObjectId().toString(),
        email: '',
        fullName: 'Guest',
      },
      'otp_request',
      {
        method: 'sms',
        success: true,
        phone,
      },
    );

    return reply.status(OK).send(result);
  },
);

export const verifyOtpHandler = catchErrors(
  async (req: FastifyRequest, reply: FastifyReply) => {
    const body = req.body as { phone: string; otp: string };
    const { phone, otp } = body || {};

    const userAgent = (req.headers['user-agent'] as string) || 'unknown';
    const ip = req.ip || 'unknown';

    const { user, accessToken, refreshToken } = await verifyOtpService(
      { db: req.db, logger: req.log },
      {
        phone,
        otp,
        ip,
        userAgent,
      },
    );

    await logAuthEvent(
      req,
      {
        _id: user['_id'] as string | ObjectId,
        email: typeof user?.email === 'string' ? user.email : undefined,
        fullName: getFullName(user),
      },
      'otp_verification',
      {
        method: 'sms',
        success: true,
        phone,
      },
    );

    setAuthCookies({ reply, accessToken, refreshToken });
    return reply.status(OK).send({
      message: 'Phone verified successfully',
      user,
    });
  },
);

export const googleCallbackHandler = catchErrors(
  async (
    req: FastifyRequest<{ Querystring: { code?: string } }>,
    reply: FastifyReply,
  ) => {
    const { code } = req.query;

    appAssert(code, UNAUTHORIZED, 'Google authorization failed');

    const { access_token } = await exchangeCodeForToken(code);
    const googleUser = await getGoogleUser(access_token);

    const usersCollection = req.db.collection<UserEntity>('users');
    let user = await usersCollection.findOne({ email: googleUser.email });

    if (!user) {
      const fallbackLastName =
        googleUser.family_name ||
        googleUser.name?.split(' ').slice(1).join(' ') ||
        ' ';

      const newUserDoc = {
        ...(await buildUserDocument({
          email: googleUser.email,
          firstName: googleUser.given_name || googleUser.name?.split(' ')[0],
          lastName: fallbackLastName,
          ...(googleUser.picture ? { profilePicture: googleUser.picture } : {}),
          googleId: googleUser.sub,
          birthDate: googleUser.birthdate
            ? new Date(googleUser.birthdate)
            : undefined,
        })),
        verified: true,
      };

      const insertResult = await usersCollection.insertOne(
        newUserDoc as unknown as UserEntity,
      );
      user = {
        _id: insertResult.insertedId,
        ...(newUserDoc as unknown as Omit<UserEntity, '_id'>),
      } as UserEntity;
    } else if (!user.googleId) {
      await usersCollection.updateOne(
        { _id: user._id },
        { $set: { googleId: googleUser.sub, updatedAt: new Date() } },
      );
      user.googleId = googleUser.sub;
    }

    appAssert(user, UNAUTHORIZED, 'User processing failed');

    if (user.active === false) {
      throw new AppError(
        UNAUTHORIZED,
        'Your account is deactivated.',
        AppErrorCode.AccountInactive,
      );
    }

    const safeUser = sanitizeUser(user);

    const sessionResult = await req.db.collection('sessions').insertOne({
      userId: user._id,
      userAgent: (req.headers['user-agent'] as string) || 'unknown',
      createdAt: new Date(),
    });

    const fullName = getFullName(safeUser);

    const { accessToken, refreshToken } = await createSessionAndTokens(
      { db: req.db, logger: req.log },
      new ObjectId(safeUser._id),
      safeUser.role || 'user',
      safeUser.email,
      fullName,
      sessionResult.insertedId.toString(),
    );

    await logAuthEvent(
      req,
      {
        _id: safeUser._id,
        email: safeUser.email,
        fullName,
      },
      'user_login',
      {
        method: 'google',
        success: true,
      },
    );

    setAuthCookies({ reply, accessToken, refreshToken });

    const appOrigin = process.env['APP_ORIGIN'] || 'http://localhost:3000';
    if (!user.birthDate) {
      return reply.redirect(
        `${appOrigin}/complete-profile?reason=missing_info`,
      );
    }

    return reply.redirect(`${appOrigin}/dashboard`);
  },
);
