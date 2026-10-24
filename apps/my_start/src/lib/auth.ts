import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { tanstackStartCookies } from 'better-auth/tanstack-start';
import { MongoClient } from 'mongodb';

// const mongoUri = process.env.MONGO_URI;

// if (!mongoUri) {
//   throw new Error("MONGO_URI environment variable is not set");
// }

// declare global {
//   // eslint-disable-next-line no-var
//   var mongoClient: MongoClient | undefined;
// }

// let client: MongoClient;

// if (process.env.NODE_ENV === "development") {
//   if (!global.mongoClient) {
//     global.mongoClient = new MongoClient(mongoUri);
//     await global.mongoClient.connect();
//   }

//   client = global.mongoClient;
// } else {
//   client = new MongoClient(mongoUri);
//   await client.connect();
// }
const client = new MongoClient('mongodb://localhost:27017/database');

const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db),

  plugins: [tanstackStartCookies()],

  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.VITE_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.VITE_GOOGLE_CLIENT_SECRET as string,
    },
    linkedin: {
      clientId: process.env.LINKEDIN_CLIENT_ID as string,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string,
    },
  },
});
