// apps/my_encore/hello/api/getUser.ts
import { api } from "encore.dev/api";
import { getDb } from "../encore.service";
import { ObjectId } from "mongodb";

export const getUser = api(
  { method: "GET", path: "/users/:id" },
  async ({ id }: { id: string }) => {
    const db = await getDb();
    const users = db.collection("users");

    const user = await users.findOne({ _id: new ObjectId(id) });
    if (!user) return { error: "User not found" };

    return { user };
  }
);
