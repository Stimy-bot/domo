// apps/my_start/src/integrations/trpc/router.ts
import type { TRPCRouterRecord } from '@trpc/server';
import { TRPCError } from '@trpc/server';
import clientPromise from '../../lib/db';
import { createTRPCRouter, publicProcedure } from './init'; // Adjust import path if needed

const peopleRouter = {
  // Matches trpc.people.currentUserName in dashboard.tsx
  currentUserName: publicProcedure.query(({ ctx }) => {
    return ctx.session?.user?.name ?? null;
  }),

  // Your MongoDB list procedure
  list: publicProcedure.query(async () => {
    try {
      const client = await clientPromise;
      const db = client.db();

      const items = await db
        .collection('users') // Adjust collection name if needed
        .find({})
        .toArray();

      return items.map((item) => ({
        ...item,
        _id: item._id.toString(),
      }));
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch records from MongoDB',
        cause: error,
      });
    }
  }),
} satisfies TRPCRouterRecord;

export const trpcRouter = createTRPCRouter({
  people: peopleRouter,
});

export type TRPCRouter = typeof trpcRouter;
