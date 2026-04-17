import { redirect } from "next/navigation";
import Link from "next/link";
import { hasClerk } from "@/lib/auth/has-clerk";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!hasClerk()) {
    return (
      <main className="min-h-screen grid place-items-center p-10 text-center bg-paper">
        <div className="max-w-prose-editorial space-y-4">
          <p className="typography-label uppercase text-ink-500 tracking-widest">
            Setup gerekli
          </p>
          <h1 className="typography-display-lg">Clerk yapılandırması eksik</h1>
          <p className="typography-body-md text-ink-700">
            `/app/*` alanı Clerk ile korunur. `.env.local` dosyasına geçerli
            bir <code className="typography-body-sm">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code>{" "}
            ve <code className="typography-body-sm">CLERK_SECRET_KEY</code>{" "}
            ekleyip sunucuyu yeniden başlatın.
          </p>
          <p>
            <Link
              href="/"
              className="text-brand-700 underline underline-offset-4 decoration-brand-300 hover:decoration-brand-500"
            >
              Anasayfaya dön
            </Link>
          </p>
        </div>
      </main>
    );
  }

  const { auth } = await import("@clerk/nextjs/server");
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in?redirect_url=/app/dashboard");
  }

  return (
    <div className="min-h-screen bg-surface-1">
      <header className="bg-paper border-b border-surface-2">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 h-16 flex items-center justify-between">
          <Link href="/app/dashboard" className="typography-h3 tracking-tight">
            INDOLES
          </Link>
          <nav className="flex items-center gap-6 typography-body-sm text-ink-700">
            <Link href="/app/dashboard" className="hover:text-ink-900">
              Panel
            </Link>
            <Link href="/app/brief/yeni" className="hover:text-ink-900">
              Brief
            </Link>
            <Link href="/app/rezervasyon" className="hover:text-ink-900">
              Rezervasyon
            </Link>
            <Link href="/app/hesap" className="hover:text-ink-900">
              Hesap
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-[1440px] px-6 md:px-12 py-12 md:py-16">
        {children}
      </main>
    </div>
  );
}
