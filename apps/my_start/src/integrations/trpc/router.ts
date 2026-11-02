// apps/my_start/src/integrations/trpc/router.ts
import { TRPCError } from "@trpc/server";
import type { TRPCRouterRecord } from "@trpc/server";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "./init";

const peopleRouter = {
  list: publicProcedure.query(async () =>
    fetch("https://swapi.dev/api/people")
      .then((res) => res.json())
      .then((d) => d.results as { name: string }[])
  ),
  currentUserName: protectedProcedure.query(async (opts) => {
    // Check if the session or user does not exist
    if (!opts.ctx.session?.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be signed in to view this information.",
      });
    }
    
    return opts.ctx.session.user.name;
  }),
} satisfies TRPCRouterRecord;

export const trpcRouter = createTRPCRouter({
  people: peopleRouter,
});
export type TRPCRouter = typeof trpcRouter;

