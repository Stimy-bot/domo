// apps/my_start/src/lib/auth-middleware.ts
import { createMiddleware } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import { getSession } from './auth-client';

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const { data: session } = await getSession({
    fetchOptions: {
      headers: getRequestHeaders() as HeadersInit,
    },
  });
  return await next({
    context: {
      user: {
        id: session?.user?.id,
        name: session?.user?.name,
        email: session?.user?.email,
        image: session?.user?.image,
        phoneNumber: (session?.user as { phoneNumber?: string })?.phoneNumber,
        birthDate: (session?.user as { birthDate?: string })?.birthDate,
        bio: (session?.user as { bio?: string })?.bio,
        role: (session?.user as { role?: string })?.role,
      },
    },
  });
});
