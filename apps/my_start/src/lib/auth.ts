// apps/my_start/src/lib/auth.ts
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { tanstackStartCookies } from 'better-auth/tanstack-start';
import { MongoClient } from 'mongodb';

declare global {
  // Prevent duplicate client connections in development HMR
  // eslint-disable-next-line no-var
  var mongoClient: MongoClient | undefined;
}

const mongoUri = process.env.MONGO_URI as string || "mongodb://localhost:27017/database";

let client: MongoClient;

if (process.env.NODE_ENV === "development") {
  if (!global.mongoClient) {
    global.mongoClient = new MongoClient(mongoUri);
  }
  client = global.mongoClient;
} else {
  client = new MongoClient(mongoUri);
}

const db = client.db();

// Filter social providers to avoid missing client key warnings
const socialProviders: Record<string, { clientId: string; clientSecret: string }> = {};

if (process.env.GITHUB_CLIENT_ID as string && process.env.GITHUB_CLIENT_SECRET as string) {
  socialProviders.github = {
    clientId: process.env.GITHUB_CLIENT_ID as string,
    clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
  };
}

if (process.env.GOOGLE_CLIENT_ID as string && process.env.GOOGLE_CLIENT_SECRET as string) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  };
}

if (process.env.LINKEDIN_CLIENT_ID as string && process.env.LINKEDIN_CLIENT_SECRET as string) {
  socialProviders.linkedin = {
    clientId: process.env.LINKEDIN_CLIENT_ID as string,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string,
  };
}

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET as string || "development_fallback_secret_32_chars_long",
  baseURL: process.env.BETTER_AUTH_URL as string || "http://localhost:5173",
  plugins: [tanstackStartCookies()],
  emailAndPassword: {
    enabled: true,
  },
  ...(Object.keys(socialProviders).length > 0 && { socialProviders }),
});