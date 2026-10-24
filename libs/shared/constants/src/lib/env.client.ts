import { z } from 'zod';

// 1. Schema for Public Client Environment Variables ONLY
const clientEnvSchema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_FIREBASE_API_KEY: z.string().min(1),
  VITE_FIREBASE_AUTH_DOMAIN: z.string().min(1),
  VITE_FIREBASE_PROJECT_ID: z.string().min(1),
  VITE_GOOGLE_CLIENT_ID: z.string().min(1),
});

const viteEnv = (
  import.meta as ImportMeta & {
    env: Record<string, string | undefined>;
  }
).env;

// 2. Parse import.meta.env (Vite's exposed variables)
const parseClientEnv = () => {
  const result = clientEnvSchema.safeParse({
    VITE_API_URL: viteEnv.VITE_API_URL,
    VITE_FIREBASE_API_KEY: viteEnv.VITE_FIREBASE_API_KEY,
    VITE_FIREBASE_AUTH_DOMAIN: viteEnv.VITE_FIREBASE_AUTH_DOMAIN,
    VITE_FIREBASE_PROJECT_ID: viteEnv.VITE_FIREBASE_PROJECT_ID,
    VITE_GOOGLE_CLIENT_ID: viteEnv.VITE_GOOGLE_CLIENT_ID,
  });

  if (!result.success) {
    console.error('Invalid client environment variables:', result.error.flatten().fieldErrors);
    throw new Error('Invalid client environment variables');
  }

  return result.data;
};

export const clientEnv = parseClientEnv();
