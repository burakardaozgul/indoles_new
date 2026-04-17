import { auth } from "@clerk/nextjs/server";
import { db } from "./db";

export async function createTRPCContext() {
  // auth() requires clerkMiddleware() to be active. In local/E2E environments
  // where Clerk keys are absent the middleware falls back to plainMiddleware,
  // so auth() throws. Swallow gracefully and return a null session.
  const session = await auth().catch(() => null);
  return {
    db,
    auth: session,
  };
}

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;
