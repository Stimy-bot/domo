import { createFileRoute } from '@tanstack/react-router';
import { auth } from '@/lib/auth';

export const Route = createFileRoute('/api/name')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const session = await auth.api.getSession({
          headers: request.headers,
        });

        if (!session) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return Response.json({ name: session.user?.name });
      },
    },
  },
});
