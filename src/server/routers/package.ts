import { createTRPCRouter, publicProcedure } from "../trpc";
import { packages } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const packageRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z
        .object({
          pillar: z.enum(["growth", "transform", "build"]).optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const conditions = [eq(packages.active, true)];
      if (input?.pillar) conditions.push(eq(packages.pillar, input.pillar));
      return ctx.db
        .select()
        .from(packages)
        .where(and(...conditions));
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const [pkg] = await ctx.db
        .select()
        .from(packages)
        .where(eq(packages.slug, input.slug))
        .limit(1);
      return pkg ?? null;
    }),
});
