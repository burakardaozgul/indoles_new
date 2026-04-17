import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    stage: process.env.NEXT_PUBLIC_APP_STAGE ?? "development",
    timestamp: new Date().toISOString(),
  });
}
