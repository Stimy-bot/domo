
import { z } from 'zod';

// Runtime guard to prevent browser execution
if (typeof window !== 'undefined') {
  throw new Error('[SECURITY ERROR] env.server.ts was imported in a browser runtime!');
}

const getEnv = (key: string, fallback?: string) => process.env[key] ?? fallback;

const sanitizeUrl = (value: string | undefined) => {
  if (!value) return undefined;
  return value.replace(/^https?:\/\/https?:\/\//, 'http://').replace(/^https?:\/\/$/, '');
};

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.string().url(),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  MONGO_DATABASE_URI: z.string().min(1),
});

const parseServerEnv = () => {
  const normalizedEnv = {
    NODE_ENV: getEnv('NODE_ENV', 'development') as 'development' | 'production' | 'test',
    JWT_SECRET: getEnv('JWT_SECRET', getEnv('SECRET_KEY')) ?? '',
    BETTER_AUTH_SECRET:
      getEnv('BETTER_AUTH_SECRET', getEnv('SESSION_SECRET') ?? getEnv('COOKIE_SECRET') ?? getEnv('JWT_SECRET') ?? ''),
    BETTER_AUTH_URL:
      sanitizeUrl(getEnv('BETTER_AUTH_URL', getEnv('APP_ORIGIN') ?? getEnv('VITE_API_URL'))) ?? 'http://localhost:5000',
    GOOGLE_CLIENT_SECRET: getEnv('GOOGLE_CLIENT_SECRET', getEnv('GOOGLE_CLIENT_ID') ?? ''),
    MONGO_DATABASE_URI:
      getEnv('MONGO_DATABASE_URI', getEnv('MONGO_URI') ?? getEnv('MONGO_CONNECTION') ?? 'mongodb://127.0.0.1:27017/domo'),
  };

  const result = serverEnvSchema.safeParse(normalizedEnv);

  if (!result.success) {
    console.error('Invalid server environment variables:', result.error.flatten().fieldErrors);
    throw new Error('Invalid server environment variables');
  }

  return result.data;
};

export const serverEnv = parseServerEnv();