import { createServerFn } from '@tanstack/react-start';
import clientPromise from '../lib/db';
import { authMiddleware } from './auth-middleware';

export const getUsers = createServerFn({ method: 'GET' }).handler(async () => {
  const client = await clientPromise;
  const db = client.db();
  const users = await db.collection('users').find({}).toArray();

  return users.map(user => ({
    ...user,
    _id: user._id.toString(),
  }));
});

export const getUserID = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    return context?.user?.id;
  });

export const getAvatar = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    return context?.user?.image;
  });
