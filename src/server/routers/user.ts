import { createTRPCRouter, protectedProcedure } from "../trpc";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    const [user] = await ctx.db
      .select()
      .from(users)
      .where(eq(users.clerkId, ctx.auth.userId!))
      .limit(1);
    return user ?? null;
  }),
});
