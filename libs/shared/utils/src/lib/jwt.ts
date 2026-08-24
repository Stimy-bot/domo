import { createSigner, createVerifier, SignerOptions, VerifierOptions } from 'fast-jwt';
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

export type SignOptionsAndSecret = SignerOptions & { secret: string };

// --- Configurations ---

const defaultAudience = [Audience.User, Audience.Admin, Audience.SuperAdmin];

// --- Signers & Verifiers ---

const accessSigner = createSigner({
  key: JWT_SECRET,
  expiresIn: 15 * 60 * 1000, // 15 minutes in ms
  aud: defaultAudience,
});

const refreshSigner = createSigner({
  key: JWT_REFRESH_SECRET,
  expiresIn: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
  aud: defaultAudience,
});

const defaultVerifier = createVerifier({
  key: JWT_SECRET,
});

// --- Utilities ---

/**
 * Signs a token using fast-jwt signers.
 */
export const signToken = (
  payload: AccessTokenPayload | RefreshTokenPayload,
  options?: Partial<SignOptionsAndSecret>,
): string => {
  const cleanPayload = JSON.parse(JSON.stringify(payload));

  // If a custom secret or options are supplied, instantiate dynamic signer
  if (options?.secret || options?.expiresIn) {
    const customSigner = createSigner({
      key: options.secret || JWT_SECRET,
      expiresIn: options.expiresIn,
      aud: defaultAudience,
      ...options,
    });
    return customSigner(cleanPayload);
  }

  // Check if signing refresh payload
  if ('sessionId' in payload && !('userId' in payload)) {
    return refreshSigner(cleanPayload);
  }

  return accessSigner(cleanPayload);
};

/**
 * Verifies a token and returns payload or error string.
 */
export const verifyToken = <TPayload extends object = AccessTokenPayload>(
  token: string,
  options?: VerifierOptions & { secret?: string },
): { payload?: TPayload; error?: string } => {
  try {
    const verifier = options?.secret
      ? createVerifier({ key: options.secret, ...options })
      : defaultVerifier;

    const result = verifier(token) as TPayload;
    return { payload: result };
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : String(error) };
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
    { secret: JWT_REFRESH_SECRET, expiresIn: 30 * 24 * 60 * 60 * 1000 },
  );

  return { accessToken, refreshToken };
};