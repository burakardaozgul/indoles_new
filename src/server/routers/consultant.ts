import { createTRPCRouter, publicProcedure } from "../trpc";
import { consultants } from "@/server/db/schema";
import { eq, asc } from "drizzle-orm";
import { z } from "zod";

export const consultantRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(consultants)
      .where(eq(consultants.active, true))
      .orderBy(asc(consultants.displayOrder));
  }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const [consultant] = await ctx.db
        .select()
        .from(consultants)
        .where(eq(consultants.slug, input.slug))
        .limit(1);
      return consultant ?? null;
    }),
});
