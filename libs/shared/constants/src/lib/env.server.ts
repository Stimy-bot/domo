
import { z } from 'zod';

// Runtime guard to prevent browser execution
if (typeof window !== 'undefined') {
  throw new Error('[SECURITY ERROR] env.server.ts was imported in a browser runtime!');
}

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.string().url(),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  MONGO_DATABASE_URI: z.string().min(1),
});

const parseServerEnv = () => {
  const result = serverEnvSchema.safeParse(process.env);

  if (!result.success) {
    console.error('Invalid server environment variables:', result.error.flatten().fieldErrors);
    throw new Error('Invalid server environment variables');
  }

  return result.data;
};

export const serverEnv = parseServerEnv();