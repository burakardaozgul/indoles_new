import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // TODO: S3 presigned URL generate — brief attachments için.
  return NextResponse.json({ todo: "S3 presigned URL implementation pending" });
}
