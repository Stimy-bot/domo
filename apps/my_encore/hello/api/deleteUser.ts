// apps/my_encore/hello/api/deleteUser.ts
import { api } from 'encore.dev/api';
import { ObjectId } from 'mongodb';
import { getDb } from '../encore.service';

export const deleteUser = api(
  { method: 'DELETE', path: '/users/:id' },
  async ({ id }: { id: string }) => {
    const db = await getDb();
    const users = db.collection('users');

    const result = await users.deleteOne({ _id: new ObjectId(id) });

    return { deletedCount: result.deletedCount };
  },
);
