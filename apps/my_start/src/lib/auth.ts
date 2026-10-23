import { betterAuth } from 'better-auth'
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { tanstackStartCookies } from 'better-auth/tanstack-start'

const mongoUri = process.env.MONGO_URI || import.meta.env.MONGO_URI || "mongodb://localhost:27017/database";

// Use a global variable in development to prevent multiple connection pools during HMR
let client: MongoClient;

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof global & {
    _mongoClient?: MongoClient;
  };
  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(mongoUri);
    await globalWithMongo._mongoClient.connect();
  }
  client = globalWithMongo._mongoClient;
} else {
  client = new MongoClient(mongoUri);
  await client.connect(); // <-- This was missing!
}

const db = client.db();

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  plugins: [tanstackStartCookies()],
  database: mongodbAdapter(db, {
    client
  }),
  socialProviders: {
    github: { 
        clientId: process.env.GITHUB_CLIENT_ID as string, 
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
    }, 
     google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
})