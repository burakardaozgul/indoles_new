import { redirect } from "next/navigation";
import { hasClerk } from "@/lib/auth/has-clerk";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!hasClerk()) {
    return (
      <main className="min-h-screen grid place-items-center p-10 text-center">
        <div className="max-w-prose-editorial">
          <h1 className="typography-display-lg">Clerk yapılandırması eksik</h1>
        </div>
      </main>
    );
  }

  const { auth } = await import("@clerk/nextjs/server");
  const { userId, sessionClaims } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=/admin");
  const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;
  if (role !== "admin") redirect("/app/dashboard");

  return (
    <div className="min-h-screen bg-surface-1">
      <header className="border-b border-surface-2 bg-paper">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 h-16 flex items-center justify-between">
          <a href="/admin" className="typography-h3">
            INDOLES Admin
          </a>
          <nav className="flex gap-6 typography-body-sm text-ink-700">
            <a href="/admin/briefs">Brief</a>
            <a href="/admin/bookings">Booking</a>
            <a href="/admin/users">Users</a>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-[1440px] px-6 md:px-12 py-10">
        {children}
      </main>
    </div>
  );
}
