import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Webhook secret missing" },
      { status: 500 }
    );
  }

  const headers = {
    "svix-id": req.headers.get("svix-id") ?? "",
    "svix-timestamp": req.headers.get("svix-timestamp") ?? "",
    "svix-signature": req.headers.get("svix-signature") ?? "",
  };
  const body = await req.text();

  let evt: { type: string; data: Record<string, unknown> };
  try {
    evt = new Webhook(secret).verify(body, headers) as typeof evt;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const data = evt.data as {
    id: string;
    email_addresses?: Array<{ email_address: string }>;
    first_name?: string;
    last_name?: string;
    public_metadata?: { role?: "user" | "consultant" | "admin" };
  };
  const primaryEmail = data.email_addresses?.[0]?.email_address;

  switch (evt.type) {
    case "user.created":
    case "user.updated": {
      if (!primaryEmail) break;
      const name = [data.first_name, data.last_name].filter(Boolean).join(" ");
      const role = data.public_metadata?.role ?? "user";

      await db
        .insert(users)
        .values({
          clerkId: data.id,
          email: primaryEmail,
          name: name || null,
          role,
        })
        .onConflictDoUpdate({
          target: users.clerkId,
          set: { email: primaryEmail, name: name || null, role },
        });
      break;
    }
    case "user.deleted": {
      await db
        .update(users)
        .set({ deletedAt: new Date() })
        .where(eq(users.clerkId, data.id));
      break;
    }
  }

  return NextResponse.json({ ok: true });
}
