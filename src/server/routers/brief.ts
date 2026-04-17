import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { briefs, users } from "@/server/db/schema";
import { eq, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { inngest } from "@/lib/inngest/client";

const briefInput = z.object({
  companyName: z.string().min(2).max(200),
  sector: z.string().min(2),
  problemDescription: z.string().min(50).max(5000),
  budget: z.enum(["small", "medium", "large"]),
  timeline: z.enum(["urgent", "normal", "flexible"]),
  preferredPillar: z.enum(["growth", "transform", "build"]).optional(),
  attachmentUrls: z.array(z.string().url()).max(5).optional(),
});

export const briefRouter = createTRPCRouter({
  create: protectedProcedure.input(briefInput).mutation(async ({ ctx, input }) => {
    const [user] = await ctx.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.clerkId, ctx.auth.userId!))
      .limit(1);

    if (!user) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "User not synced" });
    }

    const [brief] = await ctx.db
      .insert(briefs)
      .values({
        userId: user.id,
        companyName: input.companyName,
        sector: input.sector,
        problemDescription: input.problemDescription,
        budget: input.budget,
        timeline: input.timeline,
        preferredPillar: input.preferredPillar ?? null,
        status: "pending",
        source: "form",
      })
      .returning();

    await inngest.send({
      name: "brief/created",
      data: { briefId: brief!.id, userId: user.id },
    });

    return brief!;
  }),

  list: protectedProcedure.query(async ({ ctx }) => {
    const [user] = await ctx.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.clerkId, ctx.auth.userId!))
      .limit(1);
    if (!user) return [];
    return ctx.db
      .select()
      .from(briefs)
      .where(eq(briefs.userId, user.id))
      .orderBy(desc(briefs.createdAt));
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [user] = await ctx.db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.clerkId, ctx.auth.userId!))
        .limit(1);
      if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

      const [brief] = await ctx.db
        .select()
        .from(briefs)
        .where(eq(briefs.id, input.id))
        .limit(1);

      if (!brief || brief.userId !== user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return brief;
    }),
});
