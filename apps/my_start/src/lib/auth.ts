import { betterAuth } from 'better-auth'
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { tanstackStartCookies } from 'better-auth/tanstack-start'

// Fallback to localhost if the environment variable isn't set
const mongoUri = import.meta.env.MONGO_URI || "mongodb://localhost:27017/database";

const client = new MongoClient(mongoUri);
const db = client.db();

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  plugins: [tanstackStartCookies()],
  database: mongodbAdapter(db, {
    client
  }),
})