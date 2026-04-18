import { NextResponse } from "next/server";

// Clerk user-sync webhook — DB removed (ADR-010).
// Route kept as stub; full removal in Task 3.6 auth cleanup.
export async function POST() {
  return NextResponse.json({ ok: true });
}
