// apps/my_start/src/integrations/trpc/react.ts

import { QueryClient } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import superjson from 'superjson';
import type { TRPCRouter } from '@/integrations/trpc/router';

export const { TRPCProvider, useTRPC } = createTRPCContext<TRPCRouter>();

export function createQueryClient() {
  return new QueryClient();
}

export function createTrpcClient() {
  return createTRPCClient<TRPCRouter>({
    links: [
      httpBatchLink({
        transformer: superjson,
        url: '/api/trpc',
      }),
    ],
  });
}
