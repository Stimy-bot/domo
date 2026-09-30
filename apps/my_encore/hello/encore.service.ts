import { Service } from "encore.dev/service";
import { secret } from "encore.dev/config";
import { MongoClient, Db } from "mongodb";

export default new Service("hello");

export const mongoConnectionString = secret("MongoConnectionString");

let dbInstance: Db | null = null;

export async function getDb(): Promise<Db> {
  if (dbInstance) return dbInstance;

  const uri = mongoConnectionString();

  const client = new MongoClient(uri, {
    serverApi: { version: "1", strict: true, deprecationErrors: true },
  });

  await client.connect();
  await client.db("admin").command({ ping: 1 });

  console.log("MongoDB connected inside hello service");

  dbInstance = client.db("mydb");
  return dbInstance;
}
