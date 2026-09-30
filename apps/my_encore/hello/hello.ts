import { api } from "encore.dev/api";
import { getDb } from "./encore.service";

interface UserLog {
  name: string;
  timestamp: string;
}

// Example POST endpoint inside the hello service
export const greetAndLog = api(
  { expose: true, method: "POST", path: "/hello" },
  async (params: { name: string }): Promise<{ message: string; logId: string }> => {
    // Await the connection pool from our service container
    const db = await getDb();
    const collection = db.collection<UserLog>("logs");

    const newLog = {
      name: params.name,
      timestamp: new Date().toISOString(),
    };

    const result = await collection.insertOne(newLog);

    return {
      message: `Hello, ${params.name}!`,
      logId: result.insertedId.toString(),
    };
  }
);
