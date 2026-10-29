// apps/my_start/src/lib/auth.ts
import { betterAuth } from 'better-auth';
// import { mongodbAdapter } from 'better-auth/adapters/mongodb';
// import { tanstackStartCookies } from 'better-auth/tanstack-start';
// import { MongoClient } from 'mongodb';

// declare global {
//   // Prevent duplicate client connections in development HMR
//   // eslint-disable-next-line no-var
//   var mongoClient: MongoClient | undefined;
// }

// const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/database';

// let client: MongoClient;

// if (process.env.NODE_ENV === 'development') {
//   if (!global.mongoClient) {
//     global.mongoClient = new MongoClient(mongoUri);
//   }
//   client = global.mongoClient;
// } else {
//   client = new MongoClient(mongoUri);
// }

// const db = client.db();

// export const auth = betterAuth({
//   database: mongodbAdapter(db),
//   secret: process.env.BETTER_AUTH_SECRET || 'development_fallback_secret_32_chars_long',
//   baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:5173',
//   plugins: [tanstackStartCookies()],
//   emailAndPassword: {
//     enabled: true,
//   },
//   socialProviders: {
//     // Better Auth gracefully handles undefined properties if keys are missing
//     google:
//       process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
//         ? {
//             clientId: process.env.GOOGLE_CLIENT_ID,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//           }
//         : undefined,

//     github:
//       process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
//         ? {
//             clientId: process.env.GITHUB_CLIENT_ID,
//             clientSecret: process.env.GITHUB_CLIENT_SECRET,
//           }
//         : undefined,

//     linkedin:
//       process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET
//         ? {
//             clientId: process.env.LINKEDIN_CLIENT_ID,
//             clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
//           }
//         : undefined,
//   },
// });
export const auth = betterAuth({
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID! as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET! as string,
    },
  },
});