import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

export async function POST(req: NextRequest) {
  const secret = process.env.CAL_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Secret missing" }, { status: 500 });
  }

  const signature = req.headers.get("x-cal-signature-256") ?? "";
  const raw = await req.text();
  const expected = crypto
    .createHmac("sha256", secret)
    .update(raw)
    .digest("hex");

  if (
    signature.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  ) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(raw);
  // TODO: booking upsert + Inngest trigger — docs/11 §4.3
  // TODO: booking upsert + Inngest trigger
console.error("Cal.com webhook:", payload.triggerEvent);

  return NextResponse.json({ ok: true });
}
