import { auth } from "@clerk/nextjs/server";

export type Role = "user" | "consultant" | "admin";

export async function getRole(): Promise<Role | null> {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: Role } | undefined)?.role;
  return role ?? null;
}

export async function requireAdmin(): Promise<void> {
  const role = await getRole();
  if (role !== "admin") throw new Error("Admin rolü gerekli");
}
