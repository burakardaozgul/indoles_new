import { auth } from "@clerk/nextjs/server";
import { db } from "./db";

export async function createTRPCContext() {
  const session = await auth();
  return {
    db,
    auth: session,
  };
}

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;
