import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/lib/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const isProtected = createRouteMatcher([
  "/app(.*)",
  "/admin(.*)",
  "/studio(.*)",
  "/api/trpc(.*)",
  "/api/upload(.*)",
]);

const isAdmin = createRouteMatcher(["/admin(.*)"]);
const isStudio = createRouteMatcher(["/studio(.*)"]);

// Clerk'in gerçek anahtarı yoksa (local boot, kimlik entegrasyonu kurulmadan)
// sadece locale middleware'i çalışır, auth-gated alanlar sign-in'e redirect eder.
// Gerçek key `pk_live_` veya `pk_test_<base64>` formatında olur.
const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const hasClerk =
  (clerkKey.startsWith("pk_test_") || clerkKey.startsWith("pk_live_")) &&
  clerkKey.length > 20;

function plainMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isApi = pathname.startsWith("/api") || pathname.startsWith("/studio");
  const isAppArea =
    pathname.startsWith("/app") || pathname.startsWith("/admin");
  const isSystem =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up");

  if (isAppArea || isStudio(req)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
  if (!isApi && !isSystem) {
    return intlMiddleware(req);
  }
  return NextResponse.next();
}

const clerkEnabledMiddleware = clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  const isApi = pathname.startsWith("/api") || pathname.startsWith("/studio");
  const isAppArea =
    pathname.startsWith("/app") || pathname.startsWith("/admin");
  const isSystem =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up");

  if (isProtected(req)) {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      const signIn = new URL("/sign-in", req.url);
      signIn.searchParams.set("redirect_url", pathname);
      return NextResponse.redirect(signIn);
    }
    const role = (sessionClaims?.metadata as { role?: string } | undefined)
      ?.role;
    if (isAdmin(req) && role !== "admin") {
      return NextResponse.redirect(new URL("/app/dashboard", req.url));
    }
    if (isStudio(req) && role !== "admin" && role !== "consultant") {
      return NextResponse.redirect(new URL("/app/dashboard", req.url));
    }
  }

  if (!isApi && !isAppArea && !isSystem) {
    return intlMiddleware(req);
  }
  return NextResponse.next();
});

export default hasClerk ? clerkEnabledMiddleware : plainMiddleware;

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/", "/(api|trpc)(.*)"],
};
