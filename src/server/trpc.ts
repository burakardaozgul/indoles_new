import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TRPCContext } from "./context";

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.auth?.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      auth: ctx.auth,
    },
  });
});

export const consultantProcedure = protectedProcedure.use(({ ctx, next }) => {
  const role = (ctx.auth.sessionClaims?.metadata as { role?: string } | undefined)
    ?.role;
  if (role !== "consultant" && role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next();
});

export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  const role = (ctx.auth.sessionClaims?.metadata as { role?: string } | undefined)
    ?.role;
  if (role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next();
});
