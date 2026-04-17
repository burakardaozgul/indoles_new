# 09 — Auth, Roller ve İzinler

> **Amaç:** INDOLES platformunun kullanıcı kimlikleri, rol modeli, permission matrix'i ve auth enforcement katmanlarını sabitlemek.
>
> **Bağlı belgeler:** `05-tech-architecture.md` §4.5 & §9, `06-data-model.md` §2.1, `10-content-model-sanity.md`.
> **Provider:** Clerk.

---

## 1. Temel Kararlar

| Alan | Karar | Gerekçe |
|---|---|---|
| Auth provider | Clerk | Enterprise ready, SSO/SAML, MFA, webhook'lar, TR bölge desteği |
| Session | Clerk JWT (cookie-based) | HTTP-only + Secure + SameSite=Lax |
| Rol modeli | `guest`, `user`, `consultant`, `admin` | 4-kademe yeterli; fine-grained permission ileride |
| MFA | Opsiyonel; admin için **zorunlu** | Saldırı yüzeyi düşürme |
| Organization desteği | Evet (Clerk Orgs) ama faz 2 | İlk sürümde tekil kullanıcılar |
| SSO/SAML | Enterprise müşteri gelirse Clerk üzerinden | Faz 2 açık |
| Registration | Email + password + Google + LinkedIn + Apple | Professional audience için LinkedIn anahtar |
| Signup friction | Düşük — brief submit veya paket purchase'da zorla | Funnel optimize |
| Email verification | Zorunlu | Spam hesap engelleme |

---

## 2. Roller

| Rol | Kim | Anahtar yetkiler |
|---|---|---|
| `guest` | Girişsiz ziyaretçi | Public sayfaları gör, AI agent ile sohbet et (anonim), iletişim formu gönder |
| `user` | Kayıtlı kullanıcı | Brief gönder, randevu al, kendi brief/booking/payment'larını gör, hesap ayarları |
| `consultant` | INDOLES iç ekip danışmanı | Kendi atanmış brief'lerini gör, kendi booking takvimini gör, case study draft yaz (Sanity Studio) |
| `admin` | INDOLES yönetimi (Burak + gelecek ekip) | Tüm kullanıcıları gör/düzenle, tüm brief/booking/payment'lara erişim, Sanity Studio full, feature flag, user role assignment |

**Rol atama:**
- Default: `user` (Clerk signup hook).
- `consultant`: Admin tarafından manuel promote edilir (Clerk dashboard veya admin panelde).
- `admin`: Clerk dashboard'dan manuel set — hiçbir UI flow yükseltme yapmaz.

**Rol storage:**
- Source of truth: Clerk `publicMetadata.role`.
- Cache + query kolaylığı için `users.role` Neon'a da mirror'lanır (webhook ile).

---

## 3. Permission Matrix

### 3.1 Domain yetkileri

| Aksiyon | guest | user | consultant | admin |
|---|---|---|---|---|
| Public sayfa (pillar, paket, case, blog, danışman) **görüntüle** | ✓ | ✓ | ✓ | ✓ |
| AI agent ile sohbet | ✓ (anonim) | ✓ (persistent) | ✓ | ✓ |
| İletişim formu gönder | ✓ | ✓ | ✓ | ✓ |
| Hesap oluştur | ✓ | — | — | — |
| Brief **oluştur** | ✗ | ✓ | ✓ | ✓ |
| Kendi brief'lerini **gör/düzenle** | ✗ | ✓ | ✓ | ✓ |
| Başka kullanıcının brief'ini gör | ✗ | ✗ | ✓ (atanmışsa) | ✓ |
| Brief **statüsünü değiştir** | ✗ | ✗ | ✓ (atanmışsa, kısıtlı) | ✓ |
| Booking **al** | ✗ | ✓ | ✓ | ✓ |
| Kendi booking'lerini **gör/iptal** | ✗ | ✓ | ✓ | ✓ |
| Başka kullanıcının booking'ini gör | ✗ | ✗ | ✓ (kendisi host ise) | ✓ |
| Ödeme **yap** | ✗ | ✓ | ✓ | ✓ |
| Kendi payment history | ✗ | ✓ | ✓ | ✓ |
| Danışman profili **düzenle** (kendi) | ✗ | ✗ | ✓ | ✓ |
| Danışman oluştur / diğerini düzenle | ✗ | ✗ | ✗ | ✓ |
| Paket oluştur / düzenle (Sanity) | ✗ | ✗ | ✗ | ✓ |
| Case study draft yaz (Sanity) | ✗ | ✗ | ✓ | ✓ |
| Case study publish | ✗ | ✗ | ✗ | ✓ |
| Blog yazısı draft/publish | ✗ | ✗ | ✓ (draft) | ✓ (publish) |
| Admin panel erişim | ✗ | ✗ | ✗ | ✓ |
| Kullanıcı listesi / rol atama | ✗ | ✗ | ✗ | ✓ |
| Feature flag yönetimi (PostHog) | ✗ | ✗ | ✗ | ✓ |
| Audit log görüntüleme | ✗ | ✗ | ✗ | ✓ |

### 3.2 Özel durumlar

- **Anonim AI sohbet**: Sınırlı rate (20 msg/dk/IP). Giriş yapınca `session_id` → `user_id` migrate.
- **Brief escalation**: Atanmamış brief'ler sadece admin'de; admin consultant'a assign eder.
- **Consultant self-profile**: Kendi profili → edit, başkasının profili → read-only.
- **Danışman rezervasyon takvimi**: Cal.com'da host olarak görür; bizim admin panelde sadece özetini görür.

---

## 4. Teknik Enforcement

### 4.1 Middleware (edge katmanı)

`src/middleware.ts` — her request'te:

```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtected = createRouteMatcher([
  "/app/(.*)",
  "/admin/(.*)",
  "/studio/(.*)",
  "/api/trpc/(.*)",
  "/api/upload(.*)",
]);

const isAdmin = createRouteMatcher(["/admin/(.*)"]);
const isStudio = createRouteMatcher(["/studio/(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // 1. Locale redirect — next-intl middleware chain
  const localeResponse = await localeMiddleware(req);
  if (localeResponse) return localeResponse;

  // 2. Auth check
  if (isProtected(req)) {
    const session = await auth();
    if (!session.userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    // 3. Role-based check
    if (isAdmin(req) && session.sessionClaims?.metadata?.role !== "admin") {
      return NextResponse.redirect(new URL("/app/dashboard", req.url));
    }
    if (isStudio(req)) {
      const role = session.sessionClaims?.metadata?.role;
      if (role !== "admin" && role !== "consultant") {
        return NextResponse.redirect(new URL("/app/dashboard", req.url));
      }
    }
  }

  return NextResponse.next();
});
```

### 4.2 tRPC middleware (uygulama katmanı)

`src/server/trpc.ts`:

```typescript
import { initTRPC, TRPCError } from "@trpc/server";

const t = initTRPC.context<Context>().create();

// Base
export const publicProcedure = t.procedure.use(loggingMiddleware);

// Authenticated
export const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.auth?.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { ...ctx, auth: ctx.auth } });
});

// Consultant+
export const consultantProcedure = protectedProcedure.use(({ ctx, next }) => {
  const role = ctx.auth.sessionClaims?.metadata?.role;
  if (role !== "consultant" && role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next();
});

// Admin only
export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  const role = ctx.auth.sessionClaims?.metadata?.role;
  if (role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next();
});

// Ownership helper (runtime, per-resource)
export async function assertOwnership<T extends { userId: string }>(
  resource: T | null,
  ctxUserId: string
): Promise<void> {
  if (!resource || resource.userId !== ctxUserId) {
    throw new TRPCError({ code: "NOT_FOUND" }); // NOT_FOUND > FORBIDDEN — enumeration engelleme
  }
}
```

### 4.3 RSC layout guards

`src/app/(admin)/admin/layout.tsx` ve `src/app/(auth)/app/layout.tsx` içinde:

```typescript
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId, sessionClaims } = await auth();
  if (!userId) redirect("/sign-in");
  if (sessionClaims?.metadata?.role !== "admin") redirect("/app/dashboard");
  return <>{children}</>;
}
```

Middleware çift emniyet; RSC layout ikinci kapı.

### 4.4 Sanity Studio

Studio erişimi Next.js üzerinden (`/studio`) — middleware kontrol eder. Ayrıca Sanity projenin `sanity.config.ts`'inde `resolveUserFromRequest` helper'ı ile Clerk oturumu Sanity'e map'lenir; rol'e göre Sanity schema'larında conditional field visibility (örn. sadece admin publish edebilir).

### 4.5 API Route Handler

Non-tRPC route'lar (webhook'lar, upload, agent) kendi auth'unu yapar:

```typescript
// /api/upload/route.ts
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });
  // ... rest
}
```

---

## 5. Clerk Konfigürasyonu

### 5.1 Publishable + Secret Key
SST Secrets üzerinden inject. Environment başına ayrı Clerk instance (dev/preview/prod).

### 5.2 Metadata schema
Clerk `publicMetadata`:
```typescript
type UserPublicMetadata = {
  role: "user" | "consultant" | "admin";
  consultantId?: string;  // consultant ise
  locale?: "tr" | "en";
  marketingOptIn?: boolean;
};
```

### 5.3 Session claims
`sessionClaims.metadata` = publicMetadata. JWT template Clerk dashboard'dan:
```json
{
  "metadata": "{{user.public_metadata}}"
}
```

### 5.4 Sign-in/up akışları
- Giriş sayfası: `/sign-in` — Clerk `<SignIn />` component.
- Kayıt sayfası: `/sign-up` — Clerk `<SignUp />` component.
- After sign-up redirect: `/app/dashboard`.
- After sign-in redirect: referrer varsa ona, yoksa `/app/dashboard`.

### 5.5 Webhook sync
`/api/webhooks/clerk` — Svix signature verify:
- `user.created` → Neon `users` INSERT.
- `user.updated` → UPDATE.
- `user.deleted` → soft delete (`deleted_at = now()`).
- `session.created` → audit event (`user.logged_in`).

---

## 6. Özel Akışlar

### 6.1 Consultant onboarding
1. Admin Clerk dashboard'da yeni user oluşturur veya mevcut user'ı `role = consultant` yapar.
2. Admin, admin panelde `/admin/consultants/new` → `consultants` row'u oluşturur (slug, cal event type, pillar focus).
3. Consultant ilk login'de kendi profil sayfasına yönlendirilir, Sanity'deki profil dokümanını doldurur.
4. Admin publish'ler, consultant canlıya çıkar.

### 6.2 Password reset
Clerk native — `/forgot-password` → email link.

### 6.3 Account deletion (KVKK/GDPR)
Kullanıcı `/app/hesap`'ta "Hesabımı sil" → confirmation modal → tRPC `user.deleteAccount`:
1. Clerk'ten `userId` delete.
2. Neon'da `users.deleted_at = now()`.
3. Audit event.
4. Inngest job (30 gün sonra): PII anonymize (email, name → null/placeholder), brief/booking history kalır ama kimliksizleşir.

### 6.4 Role elevation (user → consultant)
UI akışı yok — sadece admin dashboard'tan:
1. `/admin/users/{id}` → "Promote to consultant" butonu.
2. tRPC `user.updateRole` (adminProcedure) → Clerk API call + Neon update + audit event.
3. Consultant bir sonraki login'de yeni permission'larla.

### 6.5 Impersonation (support)
Admin bir kullanıcı adına "act as" yapabilir mi? **Hayır** (v1). Support ihtiyacı varsa admin kullanıcıyla konuşarak çözer; v2'de Clerk impersonation feature'ı değerlendirilebilir (dikkatli audit trail gerekir).

---

## 7. Güvenlik Notları

### 7.1 Brute force
Clerk built-in rate limit + account lockout (5 başarısız deneme → 15 dk kilit).

### 7.2 Session hijacking
- HTTPS only (HSTS).
- Cookie `HttpOnly + Secure + SameSite=Lax`.
- Session rotation at re-auth.
- Device fingerprint (Clerk tarafında).

### 7.3 Privilege escalation
- `publicMetadata.role` yalnızca Clerk Admin API üzerinden yazılabilir (server-side, SST Secret ile).
- Client-side manipulasyon imkansız (JWT server-signed).

### 7.4 CSRF
tRPC + Clerk cookie auth; origin check middleware'de + SameSite cookie zaten koruyucu.

### 7.5 JWT expiration
Clerk default 1 saat; refresh token Clerk tarafında sessizce rotate eder.

---

## 8. Test Stratejisi

- **Unit:** Middleware guards (happy path + forbidden).
- **Integration:** tRPC procedure'ları — farklı rol ctx'leri ile.
- **E2E (Playwright):** Sign-up, sign-in, brief submit, admin panel guard.
- **Fixture user'lar:** `tests/fixtures/users.ts` — `admin`, `consultant`, `user` role'lerinde seed user'lar.

---

## 9. Açık Sorular

| # | Soru | Önerilen v1 cevabı | Ne zaman |
|---|---|---|---|
| 1 | Multi-role (bir kullanıcı hem consultant hem user olabilir mi)? | Hayır — hiyerarşik (consultant zaten user'ın üstü) | — |
| 2 | Organization feature (B2B ekip hesabı)? | Hayır, v2 | Enterprise müşteri gelirse |
| 3 | API key ile programatik erişim? | Hayır (v1), v2'de consultant için | Müşteri integration talebi |
| 4 | Impersonation (admin'in user adına giriş yapması)? | Hayır, v2 | Support volume artarsa |
| 5 | SAML/SSO enterprise müşteri için? | Clerk Enterprise plan, faz 2 | İlk enterprise lead |
| 6 | "Magic link" only mod (password'süz)? | Hayır, v1'de password + social yeterli | Kullanıcı şikayeti gelirse |
