import { TRPCError } from "@trpc/server";
import type { TRPCRouterRecord } from "@trpc/server";
// import { z } from 'zod'

import { createTRPCRouter, publicProcedure, protectedProcedure } from "./init";

const peopleRouter = {
  list: publicProcedure.query(async () =>
    fetch("https://swapi.dev/api/people")
      .then((res) => res.json())
      .then((d) => d.results as { name: string }[])
  ),
  currentUserName: protectedProcedure.query(async (opts) => {
    return opts.ctx.session?.user?.name;
  }),
} satisfies TRPCRouterRecord;

export const trpcRouter = createTRPCRouter({
  people: peopleRouter,
});
export type TRPCRouter = typeof trpcRouter;