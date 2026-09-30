// apps/my_encore/hello/api/updateUser.ts
import { api } from "encore.dev/api";
import { getDb } from "../encore.service";
import { ObjectId } from "mongodb";

export const updateUser = api(
  { method: "PUT", path: "/users/:id" },
  async ({ id, name, email }: { id: string; name?: string; email?: string }) => {
    const db = await getDb();
    const users = db.collection("users");

    const update = {
      ...(name && { name }),
      ...(email && { email }),
      updatedAt: new Date(),
    };

    const result = await users.updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    return { modifiedCount: result.modifiedCount };
  }
);
