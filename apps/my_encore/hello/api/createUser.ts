// apps/my_encore/hello/api/createUser.ts
import { api } from 'encore.dev/api';
import { getDb } from '../encore.service';

export const createUser = api(
  { method: 'POST', path: '/users' },
  async (req: { name: string; email: string }) => {
    const db = await getDb();
    const users = db.collection('users');

    const result = await users.insertOne({
      name: req.name,
      email: req.email,
      createdAt: new Date(),
    });

    return { id: result.insertedId.toString() };
  },
);
