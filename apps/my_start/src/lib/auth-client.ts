import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: 'http://localhost:5173',
  redirect: '/',
});

export const { useSession, signIn, signOut, signUp, getSession } = authClient;
