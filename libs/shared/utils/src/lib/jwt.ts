import jwt, { type Secret, type SignOptions, type VerifyOptions } from 'jsonwebtoken';
import { Audience, loadEnv } from '@domo/constants';

// --- Environment Variables ---

const { JWT_SECRET, JWT_REFRESH_SECRET } = loadEnv();


export const ROLES = ['user', 'admin', 'superAdmin'] as const;
export type RoleType = (typeof ROLES)[number];

// --- Types ---

export type AccessTokenPayload = {
  userId: string;
  sessionId: string;
  role: RoleType[];
  isAdmin: boolean;
  email: string;
  fullName: string;
};

export type RefreshTokenPayload = {
  sessionId: string;
};

export type SignOptionsAndSecret = SignOptions & { secret: Secret };

// --- Configurations ---

export const defaults: SignOptions & VerifyOptions = {
  audience: [Audience.User, Audience.Admin, Audience.SuperAdmin],
};

export const accessTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: '15m',
  secret: JWT_SECRET,
};

export const refreshTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: '30d',
  secret: JWT_REFRESH_SECRET,
};

// --- Utilities ---

/**
 * Signs a token using jsonwebtoken.
 */
export const signToken = (
  payload: AccessTokenPayload | RefreshTokenPayload,
  options?: Partial<SignOptionsAndSecret>,
): string => {
  const { secret, ...signOpts } = {
    ...accessTokenSignOptions,
    ...options,
  };

  const cleanPayload = JSON.parse(JSON.stringify(payload));

  return jwt.sign(cleanPayload, secret, {
    ...defaults,
    ...signOpts,
  });
};

/**
 * Verifies a token and returns payload or error string.
 */
export const verifyToken = <TPayload extends object = AccessTokenPayload>(
  token: string,
  options?: VerifyOptions & { secret?: Secret },
): { payload?: TPayload; error?: string } => {
  const { secret = JWT_SECRET, ...verifyOpts } = options || {};

  try {
    const result = jwt.verify(token, secret, {
      ...defaults,
      ...verifyOpts,
    }) as TPayload;

    return { payload: result };
  } catch (error: any) {
    return { error: error.message };
  }
};

/**
 * Helper to create both access and refresh tokens.
 */
export const createSessionAndTokens = (
  userId: string,
  role: RoleType[],
  email: string,
  fullName: string,
  sessionId: string,
) => {
  const isAdmin =
    role.includes('ADMIN' as RoleType) ||
    role.includes('admin' as RoleType) ||
    role.includes('superAdmin' as RoleType);

  const accessToken = signToken({
    userId,
    sessionId,
    role,
    isAdmin,
    email,
    fullName,
  });

  const refreshToken = signToken(
    { sessionId },
    refreshTokenSignOptions,
  );

  return { accessToken, refreshToken };
};