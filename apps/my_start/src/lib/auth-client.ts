// apps/my_start/src/lib/auth-client.ts
import {
  inferAdditionalFields,
  jwtClient,
  phoneNumberClient,
  twoFactorClient,
} from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import type { auth } from './auth';

export const authClient = createAuthClient({
  baseURL: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173',
  plugins: [
    inferAdditionalFields<typeof auth>(),
    jwtClient(),
    twoFactorClient(),
    phoneNumberClient(),
  ],
});

export const { useSession, signIn, signOut, signUp, getSession } = authClient;
