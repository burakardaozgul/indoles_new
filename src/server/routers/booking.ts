import { createTRPCRouter, protectedProcedure } from "../trpc";
import { bookings, users } from "@/server/db/schema";
import { eq, desc } from "drizzle-orm";

export const bookingRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const [user] = await ctx.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.clerkId, ctx.auth.userId!))
      .limit(1);
    if (!user) return [];
    return ctx.db
      .select()
      .from(bookings)
      .where(eq(bookings.userId, user.id))
      .orderBy(desc(bookings.startAt));
  }),
});
