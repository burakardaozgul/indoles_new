import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const payload = await req.json();
  // iyzico callback — conversationId ile match, imza doğrulama iyzico özel formatında.
  // TODO: payments upsert
  console.log("iyzico callback:", payload);
  return NextResponse.json({ ok: true });
}
