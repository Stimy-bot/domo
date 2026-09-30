import { api } from "encore.dev/api";
import { getDb } from "../encore.service";

export const pingDb = api(
  { method: "GET", path: "/mongo/ping" },
  async () => {
    const db = await getDb();
    const result = await db.command({ ping: 1 });
    return { ok: true, result };
  }
);
