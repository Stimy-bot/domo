// apps/my_start/src/lib/auth.ts
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { tanstackStartCookies } from 'better-auth/tanstack-start';
import clientPromise from './db';

const client = await clientPromise;
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client, 
  }),
  secret: process.env.BETTER_AUTH_SECRET || 'development_fallback_secret_32_chars_long',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:5173',
  plugins: [tanstackStartCookies()],
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google:
      process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
        ? {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }
        : undefined,

    github:
      process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
        ? {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          }
        : undefined,

    linkedin:
      process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET
        ? {
            clientId: process.env.LINKEDIN_CLIENT_ID,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
          }
        : undefined,
  },
});