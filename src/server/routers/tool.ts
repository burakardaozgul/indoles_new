/**
 * AI agent tool router — iç tool handler'lar buraya bağlanır.
 * Detay: docs/07-ai-agent-spec.md §4.
 */

import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { packages } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

export const toolRouter = createTRPCRouter({
  getPackages: publicProcedure
    .input(
      z.object({
        pillar: z.enum(["growth", "transform", "build"]).optional(),
        locale: z.enum(["tr", "en"]),
      })
    )
    .query(async ({ ctx, input }) => {
      const conditions = [eq(packages.active, true)];
      if (input.pillar) conditions.push(eq(packages.pillar, input.pillar));
      return ctx.db
        .select()
        .from(packages)
        .where(and(...conditions));
    }),
});
