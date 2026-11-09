// apps/my_start/src/lib/auth-server-func.ts
import { createServerFn } from '@tanstack/react-start';
import clientPromise from '../lib/db';
import { authMiddleware } from './auth-middleware';

export interface UserDTO {
  id: string;
  email: string;
  phoneNumber?: string;
  name?: string;
  birthDate?: string;
  image?: string;
  role?: string;
  bio?: string;
  createdAt?: string;
}

export const getUsers = createServerFn({ method: 'GET' }).handler(async (): Promise<UserDTO[]> => {
  const client = await clientPromise;
  const db = client.db();

  // Query 'user' collection (or 'users' depending on your schema)
  const users = await db.collection('user').find({}).toArray();

  return users.map((user) => ({
    id: user._id.toString(),
    email: user.email ?? '',
    phoneNumber: user.phoneNumber ?? '',
    name: user.name ?? 'Anonymous',
    birthDate: user.name ?? '',
    image: user.avatar ?? '',
    role: user.role ?? 'user',
    bio: user.bio ?? '',
    createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : undefined,
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
