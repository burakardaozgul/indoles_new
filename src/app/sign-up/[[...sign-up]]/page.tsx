import { hasClerk } from "@/lib/auth/has-clerk";

export default async function SignUpPage() {
  if (!hasClerk()) {
    return (
      <main className="min-h-screen grid place-items-center p-10 text-center">
        <div className="max-w-prose-editorial space-y-4">
          <h1 className="typography-display-lg">Kayıt için Clerk gerekli</h1>
          <p className="typography-body-md text-ink-700">
            `.env.local` dosyasında `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` ve
            `CLERK_SECRET_KEY` tanımla.
          </p>
        </div>
      </main>
    );
  }

  const { SignUp } = await import("@clerk/nextjs");
  const { ClerkProvider } = await import("@clerk/nextjs");
  return (
    <ClerkProvider>
      <main className="min-h-screen grid place-items-center px-6 py-16">
        <SignUp />
      </main>
    </ClerkProvider>
  );
}
