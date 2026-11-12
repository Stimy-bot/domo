// apps/my_start/src/routes/api/auth/$.ts
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        // Dynamic import prevents server auth & MongoDB from loading during client bundle evaluation
        const { auth } = await import('../../../lib/auth');
        return auth.handler(request);
      },
      POST: async ({ request }: { request: Request }) => {
        const { auth } = await import('../../../lib/auth');
        return auth.handler(request);
      },
    },
  },
});
