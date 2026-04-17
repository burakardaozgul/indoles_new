# INDOLES Web Mimari Sadeleştirme — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** INDOLES web sitesini mevcut 12-katmanlı monolit yapıdan statik-öncelikli + 2-route serverless yapıya indirgemek; popup davranışını aynen koruyarak auth/DB/payments/AI agent/Inngest/Sanity/SST katmanlarını kaldırmak.

**Architecture:** Next.js 15 SSG (App Router) + 2 REST API route (`/api/contact`, `/api/visitor-profile`) + 3 external servis (Cal.com embed, PostHog EU, Resend). Kalıcı DB yok; veri mail arşivi + PostHog person properties'te yaşar. Deploy: Vercel.

**Tech Stack:** Next.js 15 · React 19 · TypeScript 5.7 · Tailwind v4 · Radix UI · next-intl · react-hook-form + Zod · Resend + React Email · posthog-js/node · Cloudflare Turnstile · Sentry · Vitest · Playwright

**Spec:** `docs/superpowers/specs/2026-04-17-simplification-design.md`

**Çalışma dizini:** `indoles-web/` (git repo). Tüm path'ler buradan relative.

**Branch:** `feat/simplification-migration`

---

## Phase Overview

| Phase | Amaç | Çalışır çıktı |
|-------|------|---------------|
| 0 | Hazırlık | Branch + ADR taslakları + baseline snapshot |
| 1 | Paralel backend | Yeni `/api/*` route'ları çalışır, eski kod hâlâ yerinde |
| 2 | Frontend cut-over | Popup + contact form yeni route'lara yazar, eski tRPC coexist |
| 3 | Kod silme | Auth/DB/agent/payments/Sanity/Inngest silinir, build geçer |
| 4 | package.json + env | Dep temizliği, fresh install, env reduce |
| 5 | Deploy migration | Vercel'e geçiş, preview onaylı |
| 6 | Docs + ADR | CLAUDE.md, docs, 7 ADR yazılır |
| 7 | Test suite refactor | E2E temizliği, yeni spec'ler |
| 8 | Prod cutover | Canlıya al + smoke test |

Toplam hedef süre: 10 iş günü (2 hafta).

---

## Phase 0 — Hazırlık

### Task 0.1: Branch ve baseline

**Files:** — (yalnızca git)

- [ ] **Step 1: Feature branch aç**

```bash
cd indoles-web
git checkout -b feat/simplification-migration
git push -u origin feat/simplification-migration
```

Expected: branch uzakta oluşur.

- [ ] **Step 2: Baseline Playwright snapshot**

Çalışır durumdaki mevcut siteden referans görüntüler al; ilerleyen phase'lerde regresyon kontrolü için.

Run: `pnpm test:e2e --update-snapshots` (sadece popup + homepage spec'lerinde)
Commit: baseline snapshot'ları aynı branch'te sakla.

```bash
git add tests/e2e/__screenshots__
git commit -m "chore(baseline): playwright snapshots before simplification"
```

- [ ] **Step 3: Current state documented**

`active_context.md`'yi aç, en üste ekle:

```markdown
## Simplification Migration — başlangıç: 2026-04-17

- Branch: `feat/simplification-migration`
- Spec: `docs/superpowers/specs/2026-04-17-simplification-design.md`
- Plan: `docs/superpowers/plans/2026-04-17-simplification-plan.md`
- Phase: 0 (prep)
```

```bash
git add active_context.md
git commit -m "docs(active): simplification migration started"
```

### Task 0.2: ADR taslakları (7 adet)

**Files:**
- Create: `docs/decisions/ADR-007-remove-ai-agent.md`
- Create: `docs/decisions/ADR-008-remove-clerk-auth.md`
- Create: `docs/decisions/ADR-009-remove-payments.md`
- Create: `docs/decisions/ADR-010-remove-database.md`
- Create: `docs/decisions/ADR-011-remove-inngest.md`
- Create: `docs/decisions/ADR-012-vercel-deploy.md`
- Create: `docs/decisions/ADR-013-popup-rest-migration.md`

- [ ] **Step 1: ADR template oku**

Run: `cat docs/decisions/ADR-template.md`

Template format'ını ADR-006 örneğiyle kıyasla: `cat docs/decisions/ADR-006-remove-sanity.md`

- [ ] **Step 2: ADR-007 yaz**

`docs/decisions/ADR-007-remove-ai-agent.md`:

```markdown
# ADR-007: AI Agent Kaldırılması

**Durum:** Önerildi
**Tarih:** 2026-04-17
**Karar sahibi:** Burak Arda Özgül
**Bağlı:** `docs/superpowers/specs/2026-04-17-simplification-design.md`, `ADR-001-agent-orchestration.md`

## Bağlam

ADR-001 Vercel AI SDK + Gemini agent'ını seçti. Agent rezervasyon ve brief oluşturma tool'ları ile entegre edildi. Ancak launch fazında:

- Kritik yolculuklar (rezervasyon = Cal.com, brief = contact form) agent olmadan zaten çalışıyor
- Agent'in somut conversion etkisi ölçülmedi
- Gemini API maliyeti, tool call disiplin yükü, fallback state karmaşıklığı devam ediyor
- Sadeleştirme girişimi kapsamında ek karmaşıklık kaldırılıyor

## Karar

AI agent tamamen kaldırılır. `src/app/api/agent/*`, `src/server/agent/*`, ilgili chatbot UI component'leri silinir. `docs/07-ai-agent-spec.md` arşivlenir (dosya silinmez, başına "Arşive alındı" notu eklenir). Vercel AI SDK + Gemini dependency'leri çıkar.

## Sonuç

**Olumlu:**
- `@ai-sdk/google`, `ai` dependency'leri kalkar
- `/api/agent` route + tool orchestration kodu silinir (~500 satır)
- Gemini API quota/maliyet endişesi biter

**Olumsuz:**
- Chatbot deneyimi kaybolur; ziyaretçi sorusu olursa contact form veya popup'a yönlenir
- Popup persona+problems context'i chatbot'a inject edilmez (spec §8 düşer)

## Yeniden değerlendirme tetikleyicileri

- Launch sonrası 6 ay: ziyaretçi sorularının hacmi formu tetiklemeden sorulup cevapsız kalıyorsa agent FAQ asistanı olarak dönebilir
- Rezervasyon conversion'ı <%3'te takılıyorsa agent lead-qualification rolüyle yeniden düşünülür
```

- [ ] **Step 3: ADR-008 yaz**

`docs/decisions/ADR-008-remove-clerk-auth.md`:

```markdown
# ADR-008: Clerk / Auth Kaldırılması

**Durum:** Önerildi
**Tarih:** 2026-04-17
**Karar sahibi:** Burak Arda Özgül
**Bağlı:** `docs/superpowers/specs/2026-04-17-simplification-design.md`

## Bağlam

`docs/09-auth-roles-permissions.md` 4 rol (guest/user/expert/admin) tanımlıyor. Launch'ta:
- Self-signup kullanıcı yok
- Danışan vitrini iç ekip (Faz 1), self-signup yok
- Admin panel ihtiyacı somutlaşmadı (mail + PostHog yeterli)
- Müşteri portalı Faz 2'ye ertelendi (CLAUDE.md §6)

## Karar

Clerk + sign-in/sign-up route'ları + role permission kodu kaldırılır. `docs/09`'daki KVKK bölümü `docs/14-privacy-kvkk.md`'ye taşınır; rollerle ilgili bölümler arşivlenir.

## Sonuç

**Olumlu:** `@clerk/nextjs`, `svix`, auth middleware, webhook handler, role-check kod bloğu (~800 satır) kalkar.

**Olumsuz:** Sign-up/sign-in URL'leri 410 veya homepage'e redirect olur; gelen 404 için SEO etkisi — robots.txt ve redirect mapping eklenir.

## Yeniden değerlendirme tetikleyicileri

- Müşteri portalı ihtiyacı somutlaşırsa (Faz 2)
- Danışan self-signup açılırsa — ama bu CLAUDE.md §6'da explicit dışlandı
```

- [ ] **Step 4: ADR-009 yaz**

`docs/decisions/ADR-009-remove-payments.md`:

```markdown
# ADR-009: Payment (Stripe + iyzico) Kaldırılması

**Durum:** Önerildi
**Tarih:** 2026-04-17
**Karar sahibi:** Burak Arda Özgül

## Bağlam

Mimari stripe (global) + iyzico (TR) dual gateway kurgulamış. Ancak INDOLES'in satış modeli şu an:
- Paketler görüşme-sonrası teklifleşme ile satılır
- Online self-checkout ihtiyacı yok
- Ödeme webhook + fatura üretimi backoffice'te yürür

Dual gateway'in bakımı launch funnel'ına değer katmıyor.

## Karar

Stripe ve iyzico dependency'leri + webhook handler'ları + checkout UI'ı kaldırılır.

## Sonuç

**Olumlu:** `stripe`, `iyzipay` + webhook retry logic + ödeme state machine silinir.

**Olumsuz:** Ödeme gelirse elle süreç kurulur. İlk 12 ay için kabul edilebilir.

## Yeniden değerlendirme tetikleyicileri

- Ürünleşmiş paketlerde online self-checkout talebi >10 lead/ay
- Kampanya flow'u online ödeme gerektirirse
```

- [ ] **Step 5: ADR-010 yaz**

`docs/decisions/ADR-010-remove-database.md`:

```markdown
# ADR-010: DB (Neon + Drizzle) Kaldırılması

**Durum:** Önerildi
**Tarih:** 2026-04-17
**Karar sahibi:** Burak Arda Özgül
**Bağlı:** `docs/superpowers/specs/2026-04-17-simplification-design.md` §5, `ADR-008`, `ADR-009`

## Bağlam

Neon + Drizzle katmanı şu ihtiyaçlar için kuruldu:
- Auth user storage → ADR-008 ile düşer
- Payment transactions → ADR-009 ile düşer
- `popup_submissions` lead tablosu → spec ile Resend + PostHog'a devrediliyor
- Consultant profile, service, package content → ADR-006 ile statik TS + MDX'e geçti

DB için sürdürülen nedenler kalmadı.

## Karar

`src/server/db/*` (schema, migrations, mutations, client), `drizzle.config.ts`, Neon env değişkenleri kaldırılır. Lead verisi Resend mail + PostHog person properties'te yaşar.

## Sonuç

**Olumlu:** 
- `drizzle-orm`, `drizzle-kit`, `drizzle-zod`, `@neondatabase/serverless`, `pg`, `@types/pg` çıkar
- DB migration disiplini kalkar
- Neon maliyeti sıfır

**Olumsuz:**
- "Son 30 gün lead" gibi sorgular PostHog'a taşınır
- Duplicate submission kontrolü launch'ta yok (Spec §5.1.4)
- Popup → Cal.com booking ID eşleşmesi launch'ta yok (spec §12 risk)

## Yeniden değerlendirme tetikleyicileri

- PostHog event volume free tier limitini aşarsa (1M/ay)
- Lead raporlama mail aramaktan daha yapılandırılmış ihtiyaca dönüşürse
- CRM entegrasyonu kritikleşirse (HubSpot/Pipedrive) → ayrı ADR
```

- [ ] **Step 6: ADR-011 yaz**

`docs/decisions/ADR-011-remove-inngest.md`:

```markdown
# ADR-011: Background Jobs (Inngest) Kaldırılması

**Durum:** Önerildi
**Tarih:** 2026-04-17
**Karar sahibi:** Burak Arda Özgül

## Bağlam

Inngest şu akışlar için planlanmıştı:
- Popup lead → mail queue
- Clerk webhook → Neon sync (ADR-008 ile düşer)
- Payment webhook → receipt mail (ADR-009 ile düşer)
- 24 ay retention cron (ADR-010 ile düşer — DB yok)

Kalan tek use-case: popup lead → mail. Route içinde sync çağrı + 3 retry yeterli.

## Karar

Inngest tamamen kaldırılır. `src/app/api/inngest/*`, `inngest.config.ts` silinir. Mail gönderimi route handler içinde sync olarak yapılır; fail durumunda exponential backoff retry.

## Sonuç

**Olumlu:** `inngest` dependency + ayrı SDK + function schema kalkar.

**Olumsuz:** Launch'ta mail fail'i için queue yok. 3 retry sonrası 500 dönülür, Sentry capture edilir. İlk 12 ay için kabul.

## Yeniden değerlendirme tetikleyicileri

- Mail fail oranı >%1/ay
- Webhook-triggered async iş ihtiyacı doğarsa (örn. Cal.com → CRM sync)
```

- [ ] **Step 7: ADR-012 yaz**

`docs/decisions/ADR-012-vercel-deploy.md`:

```markdown
# ADR-012: Deploy Platformu SST/AWS → Vercel

**Durum:** Önerildi
**Tarih:** 2026-04-17
**Karar sahibi:** Burak Arda Özgül

## Bağlam

`docs/05-tech-architecture.md` SST Ion + OpenNext + eu-central-1 AWS deploy'unu önerdi. Neden: tam kontrol, IaC disiplini, çok servisli stack yönetimi.

Sadeleştirme sonrası stack:
- 1 Next.js app, 2 API route, statik içerik
- Ayrı VPC/RDS/SQS gereksinimi yok
- Preview environment disiplini kritik

Bu profile Vercel tam uyuyor. AWS'ten kazanılan kontrol, ek operasyon maliyetine değmez.

## Karar

Vercel'e geçilir. SST config, CloudWatch entegrasyonu, Axiom log kaldırılır. Vercel built-in log + Sentry + PostHog yeter.

## Sonuç

**Olumlu:**
- Preview per-PR otomatik (`vercel.app` URL)
- Env management tek UI
- Edge + ISR built-in
- `sst`, `@axiomhq/js` dependency'leri kalkar
- AWS kurulum-bakım yükü sıfırlanır

**Olumsuz:**
- Lock-in riski (ayrı ADR gerektirmeden geri dönülebilir — codebase standard Next.js)
- Vercel maliyeti volume arttıkça artar (launch trafiğinde önemsiz)

## Yeniden değerlendirme tetikleyicileri

- Aylık maliyet >$500
- Data residency EU gereksinimi Vercel fra1 region'un dışına taşarsa
- Vercel platform değişikliği/fiyatlandırma düşmanca olursa
```

- [ ] **Step 8: ADR-013 yaz**

`docs/decisions/ADR-013-popup-rest-migration.md`:

```markdown
# ADR-013: Popup Altkatman — tRPC → REST, DB → Mail+PostHog

**Durum:** Önerildi
**Tarih:** 2026-04-17
**Karar sahibi:** Burak Arda Özgül
**Bağlı:** `docs/superpowers/specs/2026-04-17-entry-popup-design.md`, `docs/superpowers/specs/2026-04-17-simplification-design.md` §5.1

## Bağlam

Entry popup spec (2026-04-17) tRPC mutation + `popup_submissions` Neon tablosu + Inngest queue tabanlı lead akışı öneriyordu. Sadeleştirme ile tRPC/DB/Inngest düşüyor ama popup davranışı (3-stage, problem taxonomy, cookie, chip pattern, KVKK, event taksonomisi) korunacak.

## Karar

Popup altkatmanı:
- `tRPC popup.submit` → `POST /api/visitor-profile`
- `INSERT popup_submissions` → Resend mail (iç + autoreply) + PostHog `identify` + `capture`
- Server-side Cal.com API call → Cal.com embed client-side prefill URL ile değiştirilir
- Inngest queue → route içinde sync, 3 retry
- Chatbot context injection (entry-popup §8) → tamamen düşer (ADR-007 agent kaldırıldı)
- 24 ay retention cron → düşer (DB yok; mail arşivi + PostHog retention policy)
- Duplicate submission kontrolü (entry-popup §15.2) → tamamen düşer
- Cal.com booking ID ↔ popup submission eşleşmesi → Faz 2'ye ertelendi

Davranışsal spec (Stage 1/2/3, copy, cookie kuralları, a11y, viewport, layout, event taksonomisi, KVKK metin, i18n surface'leri) %100 korunur.

## Sonuç

**Olumlu:** Popup backend kod ~500 satırdan ~80 satıra iner. Migration disiplini, queue takibi kalkar.

**Olumsuz:** Popup-design §16'da planlanan ADR-004 (1 saat booking duration) ve ADR-005 (quickbook guest path) bu sadeleştirmede gereksizdir — yazılmayacak olarak işaretlenir; quickbook zaten auth'suz ve süre Cal.com event type'ında tanımlanır.

## Yeniden değerlendirme tetikleyicileri

- Popup conversion rate hedefi (%5-8) tutmazsa flow/backend ayrı değerlendirme
- Mail/PostHog yetmez hale gelirse ADR-010 ile birlikte revize
```

- [ ] **Step 9: ADR'ları commit'le**

```bash
git add docs/decisions/ADR-007-remove-ai-agent.md \
        docs/decisions/ADR-008-remove-clerk-auth.md \
        docs/decisions/ADR-009-remove-payments.md \
        docs/decisions/ADR-010-remove-database.md \
        docs/decisions/ADR-011-remove-inngest.md \
        docs/decisions/ADR-012-vercel-deploy.md \
        docs/decisions/ADR-013-popup-rest-migration.md
git commit -m "docs(adr): 007-013 simplification decisions (draft/Önerildi)"
```

---

## Phase 1 — Paralel Backend

Hedef: Yeni `/api/contact` ve `/api/visitor-profile` route'ları çalışır durumda olsun. Eski tRPC ve popup mutation kodu hâlâ dursun (Phase 3'te silinecek). İntegrasyon testleri yeşil.

### Task 1.1: Zod schema'lar

**Files:**
- Create: `src/lib/schemas/visitor-profile.ts`
- Create: `src/lib/schemas/contact.ts`
- Create: `src/lib/schemas/__tests__/visitor-profile.test.ts`
- Create: `src/lib/schemas/__tests__/contact.test.ts`

- [ ] **Step 1: visitor-profile test yaz**

`src/lib/schemas/__tests__/visitor-profile.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { visitorProfileSchema } from '../visitor-profile';

describe('visitorProfileSchema', () => {
  const validPayload = {
    persona: 'donusum-teknoloji',
    problems: ['a', 'b', 'c'],
    lead: {
      firstName: 'Burak',
      lastName: 'Özgül',
      phone: '+905551112233',
      email: 'burak@indoles.com.tr',
      company: 'INDOLES',
      title: 'Kurucu',
    },
    submissionType: 'booking',
    kvkkConsent: true,
    locale: 'tr',
    turnstileToken: 'tkn-abc',
  };

  it('geçerli payload kabul edilir', () => {
    expect(() => visitorProfileSchema.parse(validPayload)).not.toThrow();
  });

  it('problems tam 3 eleman olmalı', () => {
    expect(() => visitorProfileSchema.parse({ ...validPayload, problems: ['a', 'b'] })).toThrow();
    expect(() => visitorProfileSchema.parse({ ...validPayload, problems: ['a', 'b', 'c', 'd'] })).toThrow();
  });

  it('kvkkConsent mutlaka true olmalı', () => {
    expect(() => visitorProfileSchema.parse({ ...validPayload, kvkkConsent: false })).toThrow();
  });

  it('email format invalid reddedilir', () => {
    expect(() => visitorProfileSchema.parse({
      ...validPayload,
      lead: { ...validPayload.lead, email: 'x' },
    })).toThrow();
  });

  it('persona enum dışında değer reddedilir', () => {
    expect(() => visitorProfileSchema.parse({ ...validPayload, persona: 'other' })).toThrow();
  });
});
```

- [ ] **Step 2: Test fail'ini doğrula**

Run: `pnpm test src/lib/schemas/__tests__/visitor-profile.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: visitor-profile schema implement et**

`src/lib/schemas/visitor-profile.ts`:

```ts
import { z } from 'zod';

export const visitorProfileSchema = z.object({
  persona: z.enum(['donusum-teknoloji', 'buyume-pazarlar']),
  problems: z.array(z.string().min(1)).length(3),
  lead: z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    phone: z.string().regex(/^\+?[0-9\s-]{7,}$/),
    email: z.string().email(),
    company: z.string().min(2),
    title: z.string().min(2),
  }),
  submissionType: z.enum(['booking', 'contact']),
  kvkkConsent: z.literal(true),
  locale: z.enum(['tr', 'en']),
  utm: z.object({
    source: z.string().optional(),
    medium: z.string().optional(),
    campaign: z.string().optional(),
  }).optional(),
  turnstileToken: z.string().min(1),
});

export type VisitorProfilePayload = z.infer<typeof visitorProfileSchema>;
```

- [ ] **Step 4: Test geçir**

Run: `pnpm test src/lib/schemas/__tests__/visitor-profile.test.ts`
Expected: 5 passed.

- [ ] **Step 5: contact test + schema**

`src/lib/schemas/__tests__/contact.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { contactSchema } from '../contact';

describe('contactSchema', () => {
  const validPayload = {
    firstName: 'Burak',
    lastName: 'Özgül',
    email: 'burak@indoles.com.tr',
    phone: '+905551112233',
    company: 'INDOLES',
    subject: 'Dönüşüm projesi',
    message: 'Kısa bir açıklama, en az 20 karakter olmalı ki geçsin.',
    budgetRange: '100k-250k',
    timeline: '1-3-months',
    kvkkConsent: true,
    locale: 'tr',
    turnstileToken: 'tkn-abc',
  };

  it('geçerli payload kabul edilir', () => {
    expect(() => contactSchema.parse(validPayload)).not.toThrow();
  });

  it('message minimum 20 karakter', () => {
    expect(() => contactSchema.parse({ ...validPayload, message: 'çok kısa' })).toThrow();
  });

  it('kvkkConsent mutlaka true olmalı', () => {
    expect(() => contactSchema.parse({ ...validPayload, kvkkConsent: false })).toThrow();
  });
});
```

`src/lib/schemas/contact.ts`:

```ts
import { z } from 'zod';

export const contactSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[0-9\s-]{7,}$/),
  company: z.string().min(2),
  subject: z.string().min(3),
  message: z.string().min(20).max(2000),
  budgetRange: z.enum(['<25k', '25k-100k', '100k-250k', '250k-1m', '>1m', 'other']),
  timeline: z.enum(['asap', '1-3-months', '3-6-months', 'exploring']),
  kvkkConsent: z.literal(true),
  locale: z.enum(['tr', 'en']),
  turnstileToken: z.string().min(1),
});

export type ContactPayload = z.infer<typeof contactSchema>;
```

- [ ] **Step 6: Test geçir ve commit**

Run: `pnpm test src/lib/schemas`
Expected: 8 passed.

```bash
git add src/lib/schemas
git commit -m "feat(schemas): Zod validators for contact + visitor-profile"
```

### Task 1.2: Turnstile verify helper

**Files:**
- Create: `src/lib/security/turnstile.ts`
- Create: `src/lib/security/__tests__/turnstile.test.ts`

- [ ] **Step 1: Test yaz**

`src/lib/security/__tests__/turnstile.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { verifyTurnstile } from '../turnstile';

describe('verifyTurnstile', () => {
  beforeEach(() => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'test-secret');
    global.fetch = vi.fn();
  });

  it('başarılı verification true döner', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });
    const ok = await verifyTurnstile('token-abc', '1.2.3.4');
    expect(ok).toBe(true);
  });

  it('başarısız verification false döner', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: false, 'error-codes': ['invalid'] }),
    });
    const ok = await verifyTurnstile('token-bad', '1.2.3.4');
    expect(ok).toBe(false);
  });

  it('network hatasında false döner', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('net'));
    const ok = await verifyTurnstile('token-x', '1.2.3.4');
    expect(ok).toBe(false);
  });
});
```

- [ ] **Step 2: Test fail doğrula**

Run: `pnpm test src/lib/security`
Expected: FAIL.

- [ ] **Step 3: Implement**

`src/lib/security/turnstile.ts`:

```ts
const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return false;

  try {
    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret,
        response: token,
        remoteip: ip,
      }),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { success: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
```

- [ ] **Step 4: Test geçir + commit**

Run: `pnpm test src/lib/security`
Expected: 3 passed.

```bash
git add src/lib/security
git commit -m "feat(security): Cloudflare Turnstile verify helper"
```

### Task 1.3: Resend client + retry wrapper

**Files:**
- Create: `src/lib/mail/client.ts`
- Create: `src/lib/mail/__tests__/client.test.ts`

- [ ] **Step 1: Test yaz**

`src/lib/mail/__tests__/client.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendMailWithRetry } from '../client';

const resendSendMock = vi.fn();
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: { send: resendSendMock },
  })),
}));

describe('sendMailWithRetry', () => {
  beforeEach(() => {
    resendSendMock.mockReset();
    vi.stubEnv('RESEND_API_KEY', 'test-key');
  });

  it('ilk denemede başarılıysa tek call', async () => {
    resendSendMock.mockResolvedValueOnce({ data: { id: '1' }, error: null });
    await sendMailWithRetry({ from: 'a', to: 'b', subject: 's', react: null, text: 't' });
    expect(resendSendMock).toHaveBeenCalledTimes(1);
  });

  it('2 kez fail + 3. denemede başarılıysa 3 call', async () => {
    resendSendMock
      .mockResolvedValueOnce({ data: null, error: { message: 'x' } })
      .mockResolvedValueOnce({ data: null, error: { message: 'y' } })
      .mockResolvedValueOnce({ data: { id: '2' }, error: null });
    await sendMailWithRetry(
      { from: 'a', to: 'b', subject: 's', react: null, text: 't' },
      { maxAttempts: 3, baseDelayMs: 1 },
    );
    expect(resendSendMock).toHaveBeenCalledTimes(3);
  });

  it('3 kez fail sonrası throw', async () => {
    resendSendMock.mockResolvedValue({ data: null, error: { message: 'x' } });
    await expect(
      sendMailWithRetry(
        { from: 'a', to: 'b', subject: 's', react: null, text: 't' },
        { maxAttempts: 3, baseDelayMs: 1 },
      ),
    ).rejects.toThrow();
    expect(resendSendMock).toHaveBeenCalledTimes(3);
  });
});
```

- [ ] **Step 2: Test fail doğrula**

Run: `pnpm test src/lib/mail`
Expected: FAIL.

- [ ] **Step 3: Implement**

`src/lib/mail/client.ts`:

```ts
import { Resend } from 'resend';

type SendInput = Parameters<Resend['emails']['send']>[0];
type RetryOpts = { maxAttempts?: number; baseDelayMs?: number };

let cachedClient: Resend | null = null;
function client(): Resend {
  if (!cachedClient) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error('RESEND_API_KEY yok');
    cachedClient = new Resend(key);
  }
  return cachedClient;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function sendMailWithRetry(
  input: SendInput,
  opts: RetryOpts = {},
): Promise<void> {
  const maxAttempts = opts.maxAttempts ?? 3;
  const baseDelayMs = opts.baseDelayMs ?? 500;
  let lastErr: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const { data, error } = await client().emails.send(input);
    if (data && !error) return;
    lastErr = error;
    if (attempt < maxAttempts) {
      await sleep(baseDelayMs * Math.pow(3, attempt - 1));
    }
  }
  throw new Error(`Resend failed after ${maxAttempts}: ${JSON.stringify(lastErr)}`);
}
```

- [ ] **Step 4: Test geçir + commit**

Run: `pnpm test src/lib/mail`
Expected: 3 passed.

```bash
git add src/lib/mail
git commit -m "feat(mail): Resend client with exponential-backoff retry"
```

### Task 1.4: React Email template'leri

**Files:**
- Create: `emails/VisitorProfileLeadNotification.tsx`
- Create: `emails/VisitorProfileAutoreply.tsx`
- Create: `emails/ContactNotification.tsx`
- Create: `emails/ContactAutoreply.tsx`
- Create: `emails/__tests__/templates.test.ts`

- [ ] **Step 1: Template snapshot test yaz**

`emails/__tests__/templates.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { render } from '@react-email/render';
import VisitorProfileLeadNotification from '../VisitorProfileLeadNotification';
import VisitorProfileAutoreply from '../VisitorProfileAutoreply';
import ContactNotification from '../ContactNotification';
import ContactAutoreply from '../ContactAutoreply';

const sampleLead = {
  firstName: 'Burak',
  lastName: 'Özgül',
  email: 'burak@indoles.com.tr',
  phone: '+905551112233',
  company: 'INDOLES',
  title: 'Kurucu',
};

describe('email templates', () => {
  it('VisitorProfileLeadNotification render olur', async () => {
    const html = await render(
      <VisitorProfileLeadNotification
        persona="donusum-teknoloji"
        problems={['manuel-surecler', 'ai-uygulanma', 'verim-olcum']}
        lead={sampleLead}
        submissionType="booking"
        locale="tr"
      />,
    );
    expect(html).toContain('Burak');
    expect(html).toContain('INDOLES');
  });

  it('VisitorProfileAutoreply persona tonu içerir (sanayici)', async () => {
    const html = await render(
      <VisitorProfileAutoreply
        persona="donusum-teknoloji"
        firstName="Burak"
        submissionType="contact"
        locale="tr"
      />,
    );
    expect(html).toContain('Burak');
  });

  it('ContactNotification render olur', async () => {
    const html = await render(
      <ContactNotification
        firstName="Ayşe"
        lastName="Yılmaz"
        email="a@b.c"
        phone="+905550001122"
        company="Acme"
        subject="Proje"
        message="Uzun bir mesaj, 20 karakterden fazla."
        budgetRange="100k-250k"
        timeline="1-3-months"
        locale="tr"
      />,
    );
    expect(html).toContain('Ayşe');
    expect(html).toContain('100k-250k');
  });

  it('ContactAutoreply render olur', async () => {
    const html = await render(
      <ContactAutoreply firstName="Ayşe" locale="tr" />,
    );
    expect(html).toContain('Ayşe');
  });
});
```

- [ ] **Step 2: Test fail doğrula**

Run: `pnpm test emails`
Expected: FAIL.

- [ ] **Step 3: VisitorProfileLeadNotification implement**

`emails/VisitorProfileLeadNotification.tsx`:

```tsx
import {
  Body, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from '@react-email/components';

type Lead = {
  firstName: string; lastName: string; email: string;
  phone: string; company: string; title: string;
};

export interface Props {
  persona: 'donusum-teknoloji' | 'buyume-pazarlar';
  problems: string[];
  lead: Lead;
  submissionType: 'booking' | 'contact';
  locale: 'tr' | 'en';
  utm?: { source?: string; medium?: string; campaign?: string };
}

const personaLabel = {
  'donusum-teknoloji': 'Sanayici — Dönüşüm ve Teknoloji',
  'buyume-pazarlar': 'Ticaret — Büyüme ve Yeni Pazarlar',
};

export default function VisitorProfileLeadNotification(props: Props) {
  const { persona, problems, lead, submissionType, locale, utm } = props;
  return (
    <Html>
      <Head />
      <Preview>Yeni popup lead — {lead.firstName} {lead.lastName} ({lead.company})</Preview>
      <Body style={{ fontFamily: 'system-ui, sans-serif' }}>
        <Container>
          <Heading as="h2">Yeni Popup Lead</Heading>
          <Section>
            <Text><b>Kişi:</b> {lead.firstName} {lead.lastName}</Text>
            <Text><b>Unvan:</b> {lead.title}</Text>
            <Text><b>Şirket:</b> {lead.company}</Text>
            <Text><b>Email:</b> {lead.email}</Text>
            <Text><b>Telefon:</b> {lead.phone}</Text>
          </Section>
          <Hr />
          <Section>
            <Text><b>Persona:</b> {personaLabel[persona]}</Text>
            <Text><b>Seçtiği 3 sorun:</b></Text>
            <ul>
              {problems.map((p) => <li key={p}>{p}</li>)}
            </ul>
            <Text><b>Submission tipi:</b> {submissionType}</Text>
            <Text><b>Locale:</b> {locale}</Text>
            {utm && (
              <Text><b>UTM:</b> {utm.source ?? '—'} / {utm.medium ?? '—'} / {utm.campaign ?? '—'}</Text>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
```

- [ ] **Step 4: VisitorProfileAutoreply implement**

`emails/VisitorProfileAutoreply.tsx`:

```tsx
import { Body, Container, Head, Html, Preview, Text } from '@react-email/components';

export interface Props {
  persona: 'donusum-teknoloji' | 'buyume-pazarlar';
  firstName: string;
  submissionType: 'booking' | 'contact';
  locale: 'tr' | 'en';
}

const copy = {
  'donusum-teknoloji': {
    tr: {
      open: 'Merhaba {first},',
      body: 'Seçimlerini aldık. Dönüşüm ve teknoloji tarafında birlikte hangi adımı atacağımızı, 1 iş günü içinde bir öneriyle döneceğiz.',
      close: 'Sabırla okuyoruz, elle hazırlıyoruz.',
    },
    en: {
      open: 'Hi {first},',
      body: 'Noted. We will follow up within one business day with concrete next steps on the transformation side.',
      close: 'Prepared thoughtfully, sent from a human.',
    },
  },
  'buyume-pazarlar': {
    tr: {
      open: 'Merhaba {first},',
      body: 'Seçimlerini aldık. Büyüme tarafında birlikte neyi test edebileceğimizi 1 iş günü içinde netleştireceğiz.',
      close: 'Acele etmiyoruz ama hızlı hareket ediyoruz.',
    },
    en: {
      open: 'Hi {first},',
      body: 'Noted. We will follow up within one business day with a concrete growth experiment to consider.',
      close: 'Moving fast, not rushed.',
    },
  },
};

export default function VisitorProfileAutoreply({ persona, firstName, submissionType, locale }: Props) {
  const t = copy[persona][locale];
  return (
    <Html>
      <Head />
      <Preview>{t.body}</Preview>
      <Body style={{ fontFamily: 'system-ui, sans-serif' }}>
        <Container>
          <Text>{t.open.replace('{first}', firstName)}</Text>
          <Text>{t.body}</Text>
          {submissionType === 'booking' && (
            <Text>{locale === 'tr'
              ? 'Bir sonraki ekranda müsait olduğun saati seçebilirsin; onay otomatik gider.'
              : 'On the next screen you can pick a time that works for you; confirmation will be sent automatically.'}
            </Text>
          )}
          <Text>{t.close}</Text>
          <Text>INDOLES</Text>
        </Container>
      </Body>
    </Html>
  );
}
```

- [ ] **Step 5: ContactNotification implement**

`emails/ContactNotification.tsx`:

```tsx
import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from '@react-email/components';

export interface Props {
  firstName: string; lastName: string; email: string; phone: string;
  company: string; subject: string; message: string;
  budgetRange: string; timeline: string; locale: 'tr' | 'en';
}

export default function ContactNotification(props: Props) {
  return (
    <Html>
      <Head />
      <Preview>İletişim formu — {props.subject}</Preview>
      <Body style={{ fontFamily: 'system-ui, sans-serif' }}>
        <Container>
          <Heading as="h2">Yeni iletişim formu</Heading>
          <Section>
            <Text><b>{props.firstName} {props.lastName}</b> ({props.company})</Text>
            <Text>{props.email} · {props.phone}</Text>
            <Hr />
            <Text><b>Konu:</b> {props.subject}</Text>
            <Text><b>Bütçe:</b> {props.budgetRange} · <b>Zaman:</b> {props.timeline}</Text>
            <Hr />
            <Text style={{ whiteSpace: 'pre-wrap' }}>{props.message}</Text>
            <Hr />
            <Text><b>Locale:</b> {props.locale}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
```

- [ ] **Step 6: ContactAutoreply implement**

`emails/ContactAutoreply.tsx`:

```tsx
import { Body, Container, Head, Html, Preview, Text } from '@react-email/components';

export default function ContactAutoreply({ firstName, locale }: { firstName: string; locale: 'tr' | 'en' }) {
  const t = locale === 'tr'
    ? { open: `Merhaba ${firstName},`, body: 'Mesajını aldık. 1 iş günü içinde döneceğiz.', close: 'Sabırla okuyoruz, elle hazırlıyoruz.' }
    : { open: `Hi ${firstName},`, body: 'We received your message. We will reply within one business day.', close: 'Prepared thoughtfully, sent from a human.' };
  return (
    <Html>
      <Head />
      <Preview>{t.body}</Preview>
      <Body style={{ fontFamily: 'system-ui, sans-serif' }}>
        <Container>
          <Text>{t.open}</Text>
          <Text>{t.body}</Text>
          <Text>{t.close}</Text>
          <Text>INDOLES</Text>
        </Container>
      </Body>
    </Html>
  );
}
```

- [ ] **Step 7: Test geçir + commit**

Run: `pnpm test emails`
Expected: 4 passed.

```bash
git add emails/
git commit -m "feat(emails): React Email templates for contact + visitor-profile (TR+EN)"
```

### Task 1.5: PostHog server client

**Files:**
- Create: `src/lib/analytics/posthog-server.ts`

- [ ] **Step 1: Implement**

`src/lib/analytics/posthog-server.ts`:

```ts
import { PostHog } from 'posthog-node';

let instance: PostHog | null = null;

export function posthogServer(): PostHog {
  if (!instance) {
    instance = new PostHog(process.env.POSTHOG_API_KEY ?? '', {
      host: process.env.POSTHOG_HOST ?? 'https://eu.posthog.com',
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return instance;
}

export async function flushPosthog(): Promise<void> {
  if (instance) await instance.shutdown();
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/analytics/posthog-server.ts
git commit -m "feat(analytics): PostHog server client singleton"
```

### Task 1.6: `/api/visitor-profile` route handler

**Files:**
- Create: `src/app/api/visitor-profile/route.ts`
- Create: `src/app/api/visitor-profile/__tests__/route.test.ts`

- [ ] **Step 1: Test yaz**

`src/app/api/visitor-profile/__tests__/route.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../route';

vi.mock('@/lib/security/turnstile', () => ({ verifyTurnstile: vi.fn() }));
vi.mock('@/lib/mail/client', () => ({ sendMailWithRetry: vi.fn() }));
vi.mock('@/lib/analytics/posthog-server', () => ({
  posthogServer: () => ({ identify: vi.fn(), capture: vi.fn() }),
  flushPosthog: vi.fn(),
}));

const validBody = {
  persona: 'donusum-teknoloji',
  problems: ['a', 'b', 'c'],
  lead: {
    firstName: 'Burak', lastName: 'Özgül',
    phone: '+905551112233', email: 'burak@indoles.com.tr',
    company: 'INDOLES', title: 'Kurucu',
  },
  submissionType: 'booking',
  kvkkConsent: true,
  locale: 'tr',
  turnstileToken: 'tkn',
};

function buildRequest(body: unknown): Request {
  return new Request('http://localhost/api/visitor-profile', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': '1.2.3.4' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/visitor-profile', () => {
  beforeEach(() => vi.clearAllMocks());

  it('400 — invalid Zod', async () => {
    const { verifyTurnstile } = await import('@/lib/security/turnstile');
    vi.mocked(verifyTurnstile).mockResolvedValueOnce(true);
    const res = await POST(buildRequest({ ...validBody, problems: ['x'] }));
    expect(res.status).toBe(400);
  });

  it('403 — Turnstile fail', async () => {
    const { verifyTurnstile } = await import('@/lib/security/turnstile');
    vi.mocked(verifyTurnstile).mockResolvedValueOnce(false);
    const res = await POST(buildRequest(validBody));
    expect(res.status).toBe(403);
  });

  it('200 — happy path (booking)', async () => {
    const { verifyTurnstile } = await import('@/lib/security/turnstile');
    const { sendMailWithRetry } = await import('@/lib/mail/client');
    vi.mocked(verifyTurnstile).mockResolvedValueOnce(true);
    vi.mocked(sendMailWithRetry).mockResolvedValue(undefined);
    const res = await POST(buildRequest(validBody));
    expect(res.status).toBe(200);
    expect(sendMailWithRetry).toHaveBeenCalledTimes(2);
  });

  it('500 — Resend hepsi fail', async () => {
    const { verifyTurnstile } = await import('@/lib/security/turnstile');
    const { sendMailWithRetry } = await import('@/lib/mail/client');
    vi.mocked(verifyTurnstile).mockResolvedValueOnce(true);
    vi.mocked(sendMailWithRetry).mockRejectedValueOnce(new Error('resend'));
    const res = await POST(buildRequest(validBody));
    expect(res.status).toBe(500);
  });
});
```

- [ ] **Step 2: Test fail doğrula**

Run: `pnpm test src/app/api/visitor-profile`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement**

`src/app/api/visitor-profile/route.ts`:

```ts
import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { visitorProfileSchema } from '@/lib/schemas/visitor-profile';
import { verifyTurnstile } from '@/lib/security/turnstile';
import { sendMailWithRetry } from '@/lib/mail/client';
import { posthogServer, flushPosthog } from '@/lib/analytics/posthog-server';
import VisitorProfileLeadNotification from '../../../../emails/VisitorProfileLeadNotification';
import VisitorProfileAutoreply from '../../../../emails/VisitorProfileAutoreply';

export const runtime = 'nodejs';

export async function POST(req: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const parsed = visitorProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'validation', issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const data = parsed.data;

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '0.0.0.0';
  const ok = await verifyTurnstile(data.turnstileToken, ip);
  if (!ok) {
    return NextResponse.json({ error: 'turnstile_failed' }, { status: 403 });
  }

  const kvkkConsentAt = new Date().toISOString();

  try {
    await sendMailWithRetry({
      from: 'INDOLES <noreply@indoles.com.tr>',
      to: process.env.LEAD_INBOX_EMAIL ?? 'lead@indoles.com.tr',
      subject: `Yeni popup lead — ${data.lead.firstName} ${data.lead.lastName} (${data.lead.company})`,
      react: VisitorProfileLeadNotification({
        persona: data.persona,
        problems: data.problems,
        lead: data.lead,
        submissionType: data.submissionType,
        locale: data.locale,
        utm: data.utm,
      }),
    });
    await sendMailWithRetry({
      from: 'INDOLES <hello@indoles.com.tr>',
      to: data.lead.email,
      subject: data.locale === 'tr' ? 'Seçimini aldık — INDOLES' : 'We got your selection — INDOLES',
      react: VisitorProfileAutoreply({
        persona: data.persona,
        firstName: data.lead.firstName,
        submissionType: data.submissionType,
        locale: data.locale,
      }),
    });
  } catch (err) {
    Sentry.captureException(err, { tags: { route: 'visitor-profile', step: 'mail' } });
    return NextResponse.json({ error: 'mail_failed' }, { status: 500 });
  }

  const ph = posthogServer();
  const distinctId = `email:${data.lead.email.toLowerCase()}`;
  try {
    ph.identify({
      distinctId,
      properties: {
        persona: data.persona,
        first_name: data.lead.firstName,
        last_name: data.lead.lastName,
        company: data.lead.company,
        title: data.lead.title,
        selected_problems: data.problems,
        first_seen_locale: data.locale,
        kvkk_consent_at: kvkkConsentAt,
        utm_source: data.utm?.source,
        utm_medium: data.utm?.medium,
        utm_campaign: data.utm?.campaign,
      },
    });
    ph.capture({
      distinctId,
      event: data.submissionType === 'booking'
        ? 'popup_booking_submitted'
        : 'popup_contact_submitted',
      properties: {
        persona: data.persona,
        problems: data.problems,
        locale: data.locale,
      },
    });
    await flushPosthog();
  } catch (err) {
    Sentry.captureException(err, { tags: { route: 'visitor-profile', step: 'posthog' } });
  }

  return NextResponse.json({
    ok: true,
    calComEmbedUrl: data.submissionType === 'booking'
      ? buildCalEmbedUrl(data)
      : undefined,
  });
}

function buildCalEmbedUrl(data: {
  lead: { firstName: string; lastName: string; email: string };
  persona: 'donusum-teknoloji' | 'buyume-pazarlar';
  locale: 'tr' | 'en';
}): string {
  const base = process.env.CAL_COM_EMBED_URL ?? 'https://cal.com/indoles/gorusme';
  const params = new URLSearchParams({
    name: `${data.lead.firstName} ${data.lead.lastName}`,
    email: data.lead.email,
    'metadata[persona]': data.persona,
    'metadata[locale]': data.locale,
  });
  return `${base}?${params.toString()}`;
}
```

- [ ] **Step 4: Test geçir + commit**

Run: `pnpm test src/app/api/visitor-profile`
Expected: 4 passed.

```bash
git add src/app/api/visitor-profile
git commit -m "feat(api): visitor-profile REST route (coexists with old tRPC)"
```

### Task 1.7: `/api/contact` route handler

**Files:**
- Create: `src/app/api/contact/route.ts`
- Create: `src/app/api/contact/__tests__/route.test.ts`

- [ ] **Step 1: Test yaz** (visitor-profile testiyle benzer yapı; 400/403/200/500 path'leri)

`src/app/api/contact/__tests__/route.test.ts` — yapı Task 1.6 Step 1 ile aynı, body `contactSchema`'ya uyumlu.

Tam content:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../route';

vi.mock('@/lib/security/turnstile', () => ({ verifyTurnstile: vi.fn() }));
vi.mock('@/lib/mail/client', () => ({ sendMailWithRetry: vi.fn() }));
vi.mock('@/lib/analytics/posthog-server', () => ({
  posthogServer: () => ({ capture: vi.fn() }),
  flushPosthog: vi.fn(),
}));

const validBody = {
  firstName: 'Ayşe', lastName: 'Yılmaz',
  email: 'a@b.c', phone: '+905550001122', company: 'Acme',
  subject: 'Proje', message: 'Uzun mesaj, 20 karakterden fazla.',
  budgetRange: '100k-250k', timeline: '1-3-months',
  kvkkConsent: true, locale: 'tr', turnstileToken: 'tkn',
};

function req(body: unknown): Request {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': '1.2.3.4' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/contact', () => {
  beforeEach(() => vi.clearAllMocks());

  it('400 invalid', async () => {
    const { verifyTurnstile } = await import('@/lib/security/turnstile');
    vi.mocked(verifyTurnstile).mockResolvedValueOnce(true);
    const res = await POST(req({ ...validBody, message: 'kısa' }));
    expect(res.status).toBe(400);
  });

  it('403 turnstile fail', async () => {
    const { verifyTurnstile } = await import('@/lib/security/turnstile');
    vi.mocked(verifyTurnstile).mockResolvedValueOnce(false);
    const res = await POST(req(validBody));
    expect(res.status).toBe(403);
  });

  it('200 happy path', async () => {
    const { verifyTurnstile } = await import('@/lib/security/turnstile');
    const { sendMailWithRetry } = await import('@/lib/mail/client');
    vi.mocked(verifyTurnstile).mockResolvedValueOnce(true);
    vi.mocked(sendMailWithRetry).mockResolvedValue(undefined);
    const res = await POST(req(validBody));
    expect(res.status).toBe(200);
    expect(sendMailWithRetry).toHaveBeenCalledTimes(2);
  });

  it('500 mail fail', async () => {
    const { verifyTurnstile } = await import('@/lib/security/turnstile');
    const { sendMailWithRetry } = await import('@/lib/mail/client');
    vi.mocked(verifyTurnstile).mockResolvedValueOnce(true);
    vi.mocked(sendMailWithRetry).mockRejectedValueOnce(new Error('resend'));
    const res = await POST(req(validBody));
    expect(res.status).toBe(500);
  });
});
```

- [ ] **Step 2: Implement**

`src/app/api/contact/route.ts`:

```ts
import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { contactSchema } from '@/lib/schemas/contact';
import { verifyTurnstile } from '@/lib/security/turnstile';
import { sendMailWithRetry } from '@/lib/mail/client';
import { posthogServer, flushPosthog } from '@/lib/analytics/posthog-server';
import ContactNotification from '../../../../emails/ContactNotification';
import ContactAutoreply from '../../../../emails/ContactAutoreply';

export const runtime = 'nodejs';

export async function POST(req: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'validation', issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const data = parsed.data;

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '0.0.0.0';
  const ok = await verifyTurnstile(data.turnstileToken, ip);
  if (!ok) {
    return NextResponse.json({ error: 'turnstile_failed' }, { status: 403 });
  }

  try {
    await sendMailWithRetry({
      from: 'INDOLES <noreply@indoles.com.tr>',
      to: process.env.SALES_INBOX_EMAIL ?? 'sales@indoles.com.tr',
      subject: `İletişim — ${data.subject} — ${data.firstName} ${data.lastName}`,
      react: ContactNotification(data),
    });
    await sendMailWithRetry({
      from: 'INDOLES <hello@indoles.com.tr>',
      to: data.email,
      subject: data.locale === 'tr' ? 'Mesajını aldık — INDOLES' : 'We got your message — INDOLES',
      react: ContactAutoreply({ firstName: data.firstName, locale: data.locale }),
    });
  } catch (err) {
    Sentry.captureException(err, { tags: { route: 'contact', step: 'mail' } });
    return NextResponse.json({ error: 'mail_failed' }, { status: 500 });
  }

  try {
    const ph = posthogServer();
    ph.capture({
      distinctId: `email:${data.email.toLowerCase()}`,
      event: 'contact_form_submitted',
      properties: {
        subject: data.subject,
        budget_range: data.budgetRange,
        timeline: data.timeline,
        locale: data.locale,
      },
    });
    await flushPosthog();
  } catch (err) {
    Sentry.captureException(err, { tags: { route: 'contact', step: 'posthog' } });
  }

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3: Test geçir + commit**

Run: `pnpm test src/app/api/contact`
Expected: 4 passed.

```bash
git add src/app/api/contact
git commit -m "feat(api): contact REST route (coexists with old tRPC)"
```

### Task 1.8: Phase 1 smoke check

- [ ] **Step 1: Tüm testleri çalıştır**

Run: `pnpm test`
Expected: yeni testler yeşil, mevcut testler bozulmamış.

- [ ] **Step 2: Type check**

Run: `pnpm typecheck`
Expected: 0 error.

- [ ] **Step 3: Dev server ayağa kalkar**

Run: `pnpm dev`
Curl: `curl -X POST http://localhost:3000/api/contact -H 'content-type: application/json' -d '{}'`
Expected: 400 (validation fail). Server error yok.

- [ ] **Step 4: Checkpoint commit**

Kod eklendi, hiçbir şey silinmedi; site hâlâ eski tRPC akışıyla çalışıyor.

```bash
git commit --allow-empty -m "checkpoint: phase 1 complete (parallel backend in place)"
```

---

## Phase 2 — Frontend Cut-over

Hedef: Popup Stage 3 ve contact page, yeni REST route'larına yazsın. Eski tRPC ve mevcut `/api/agent` tüketimi kullanılmasın.

### Task 2.1: Popup Stage 3 — REST fetch cut-over

**Files:**
- Modify: `src/components/marketing/entry-popup/stages/Stage3.tsx` (veya mevcut component path'i)
- Modify: `src/components/marketing/entry-popup/PopupProvider.tsx` (tRPC import'u kaldır)
- Modify: `src/components/marketing/entry-popup/__tests__/stage3.test.tsx`

- [ ] **Step 1: Mevcut Stage3 component'ini oku**

Run: `ls src/components/marketing/entry-popup/`
Oku: `cat src/components/marketing/entry-popup/Stage3.tsx` (veya doğru path'i bul)

- [ ] **Step 2: tRPC mutation çağrısını fetch ile değiştir**

Mevcut kodda `api.popup.submit.useMutation(...)` tipi bir satır var. Bunu kaldır, yerine:

```tsx
async function submitVisitorProfile(payload: VisitorProfilePayload): Promise<{
  ok: true; calComEmbedUrl?: string;
} | { ok: false; error: string }> {
  const res = await fetch('/api/visitor-profile', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { ok: false, error: data.error ?? 'unknown' };
  }
  return (await res.json()) as { ok: true; calComEmbedUrl?: string };
}
```

Form submit handler'da: validate → `submitVisitorProfile(payload)` → booking path ise `calComEmbedUrl`'i embed component'ine ver.

- [ ] **Step 3: Turnstile widget ekle**

Form'un en altında (submit button'un üstünde):

```tsx
<div ref={turnstileRef} data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />
```

Ve `useEffect` ile `window.turnstile.render(turnstileRef.current, { callback: (token) => setTurnstileToken(token) })`.

Turnstile script'ini `app/[locale]/layout.tsx`'e ekle:

```tsx
<Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
```

- [ ] **Step 4: Test güncelle**

Mevcut Stage3 test dosyasında tRPC mock'unu kaldır, `global.fetch` mock'u ekle:

```ts
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ ok: true, calComEmbedUrl: 'https://cal.com/x' }),
}) as typeof fetch;
```

- [ ] **Step 5: Test geçir + commit**

Run: `pnpm test src/components/marketing/entry-popup`
Expected: 0 fail.

```bash
git add src/components/marketing/entry-popup src/app/[locale]/layout.tsx
git commit -m "refactor(popup): Stage 3 submits to /api/visitor-profile via fetch; add Turnstile"
```

### Task 2.2: Cal.com embed prefill akışı

**Files:**
- Modify: `src/components/marketing/entry-popup/BookingSuccessView.tsx` (veya teşekkür state component'i)
- Create: `src/lib/calcom/prefill.ts` (helper)

- [ ] **Step 1: Helper implement**

`src/lib/calcom/prefill.ts`:

```ts
export function openCalEmbed(url: string): void {
  if (typeof window === 'undefined') return;
  const cal = (window as unknown as { Cal?: (cmd: string, ...args: unknown[]) => void }).Cal;
  if (cal) {
    cal('ui', { styles: { branding: { brandColor: '#000' } } });
    cal('modal', { url });
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
```

- [ ] **Step 2: BookingSuccessView — openCalEmbed'i tetikle**

Popup Stage 3 booking path'te response dönünce `openCalEmbed(calComEmbedUrl)` çağır.

- [ ] **Step 3: Test + commit**

```bash
git add src/lib/calcom src/components/marketing/entry-popup
git commit -m "feat(popup): Cal.com embed prefill via @calcom/embed"
```

### Task 2.3: `/iletisim` standalone contact form

**Files:**
- Create: `src/app/(marketing)/[locale]/iletisim/page.tsx` (eğer yoksa)
- Create: `src/components/marketing/ContactForm.tsx`
- Create: `messages/tr/contact.json`
- Create: `messages/en/contact.json`

- [ ] **Step 1: Mevcut durumu kontrol**

Run: `ls src/app/(marketing)/[locale]/iletisim/ 2>/dev/null || echo "yok"`

- [ ] **Step 2: ContactForm component (react-hook-form + Zod)**

`src/components/marketing/ContactForm.tsx`:

```tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, type ContactPayload } from '@/lib/schemas/contact';

export function ContactForm({ locale }: { locale: 'tr' | 'en' }) {
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const turnstileRef = useRef<HTMLDivElement>(null);

  const form = useForm<Omit<ContactPayload, 'turnstileToken' | 'locale' | 'kvkkConsent'> & { kvkkConsent: boolean }>({
    resolver: zodResolver(contactSchema.omit({ turnstileToken: true, locale: true })),
  });

  useEffect(() => {
    const w = window as unknown as { turnstile?: { render: (el: Element, opts: unknown) => void } };
    if (w.turnstile && turnstileRef.current) {
      w.turnstile.render(turnstileRef.current, {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
        callback: setTurnstileToken,
      });
    }
  }, []);

  async function onSubmit(values: Omit<ContactPayload, 'turnstileToken' | 'locale'>): Promise<void> {
    setState('submitting');
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...values, locale, turnstileToken, kvkkConsent: true }),
    });
    setState(res.ok ? 'success' : 'error');
  }

  if (state === 'success') return <div>{locale === 'tr' ? 'Mesajını aldık.' : 'We got your message.'}</div>;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* design-tokens skill ile finalize edilecek field'lar */}
      {/* firstName, lastName, email, phone, company, subject, budgetRange select, timeline select, message textarea */}
      <div ref={turnstileRef} />
      <button type="submit" disabled={state === 'submitting' || !turnstileToken}>
        {locale === 'tr' ? 'Gönder' : 'Submit'}
      </button>
    </form>
  );
}
```

> **Not:** Bu iskelet. Field markup'ı `indoles-design-tokens` ve `indoles-brand-voice` skill'leriyle finalize edilecek (Task 2.4).

- [ ] **Step 3: Page component**

`src/app/(marketing)/[locale]/iletisim/page.tsx`:

```tsx
import { ContactForm } from '@/components/marketing/ContactForm';
import { getTranslations } from 'next-intl/server';

export default async function ContactPage({ params }: { params: { locale: 'tr' | 'en' } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'contact' });
  return (
    <main>
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
      <ContactForm locale={params.locale} />
    </main>
  );
}
```

- [ ] **Step 4: i18n mesajları**

`messages/tr/contact.json`:

```json
{
  "title": "Bize yazın",
  "subtitle": "Projenizi anlatın. 1 iş günü içinde dönüyoruz.",
  "submit": "Gönder"
}
```

`messages/en/contact.json`:

```json
{
  "title": "Write to us",
  "subtitle": "Tell us about your project. We reply within one business day.",
  "submit": "Submit"
}
```

- [ ] **Step 5: Commit**

```bash
git add src/app/\(marketing\)/\[locale\]/iletisim \
        src/components/marketing/ContactForm.tsx \
        messages/tr/contact.json messages/en/contact.json
git commit -m "feat(contact): /iletisim page with form submitting to /api/contact"
```

### Task 2.4: Contact form — brand-voice + design-tokens finalize

- [ ] **Step 1: `indoles-brand-voice` skill'ini çağır**

Form label'larını, placeholder'ları, submit button copy'sini (TR+EN), teşekkür ekranı copy'sini ve validation hata mesajlarını persona-nötr tonda finalize et.

- [ ] **Step 2: `indoles-design-tokens` skill'ini çağır**

Form field spacing, hata rengi, disabled state, focus ring, KVKK checkbox visual — `lib/design/tokens.ts` ve `components/ui/*` üzerinden. Literal Tailwind yasak.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "style(contact): finalize form with brand voice + design tokens"
```

### Task 2.5: KVKK sayfası

**Files:**
- Create: `src/app/(marketing)/[locale]/gizlilik-kvkk/page.tsx`
- Create: `content/legal/kvkk.tr.mdx`
- Create: `content/legal/kvkk.en.mdx`

- [ ] **Step 1: KVKK metni**

`content/legal/kvkk.tr.mdx`:

```mdx
# Gizlilik ve KVKK Aydınlatma Metni

**Veri sorumlusu:** İndoles Yazılım A.Ş.

## Toplanan Veriler
- Ad, soyad, telefon, e-posta, şirket, unvan
- Popup'ta seçilen persona ve 3 sorun
- Iletişim formunda verilen mesaj, bütçe aralığı, zaman bilgisi

## İşleme Amacı
- İletişim kurma, rezervasyon, lead takibi, persona-based personalization

## Saklama
- Mail arşivinde: inbox policy gereği (24 ay sonra manuel inceleme)
- PostHog analitik: PostHog retention policy gereği (varsayılan 7 yıl, ayarlanabilir)

## Paylaşım
- Cal.com (rezervasyon için)
- Resend (e-posta için)
- PostHog (analytics)

## Haklar
- Erişim, düzeltme, silme, itiraz haklarınızı kullanmak için: [privacy@indoles.com.tr](mailto:privacy@indoles.com.tr)
```

- [ ] **Step 2: EN versiyonu yaz**

`content/legal/kvkk.en.mdx`: — TR'nin İngilizce dengi, aynı yapı.

- [ ] **Step 3: Page component**

`src/app/(marketing)/[locale]/gizlilik-kvkk/page.tsx`:

```tsx
import KvkkTr from '@/../content/legal/kvkk.tr.mdx';
import KvkkEn from '@/../content/legal/kvkk.en.mdx';

export default function KvkkPage({ params }: { params: { locale: 'tr' | 'en' } }) {
  return <main className="prose mx-auto">{params.locale === 'tr' ? <KvkkTr /> : <KvkkEn />}</main>;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/\(marketing\)/\[locale\]/gizlilik-kvkk content/legal
git commit -m "feat(legal): KVKK page for TR + EN"
```

### Task 2.6: Phase 2 smoke check

- [ ] **Step 1: Dev server'da popup ve contact test**

Run: `pnpm dev`
Browser: `http://localhost:3000/tr` → popup aç → Stage 3 booking → `/api/visitor-profile`'a gittiğini devtools'ta doğrula → Cal.com embed açıldığını doğrula.

Browser: `http://localhost:3000/tr/iletisim` → form doldur → 200 response.

- [ ] **Step 2: Checkpoint commit**

```bash
git commit --allow-empty -m "checkpoint: phase 2 complete (frontend cut over to REST)"
```

---

## Phase 3 — Kod Silme

Hedef: Artık kullanılmayan alt-ağaçlar silinsin. Build geçsin. Sadeleşen kod işlevsel olarak azalmış ama site aynı sayfaları render etmeye devam etsin.

### Task 3.1: tRPC + server router'ları sil

**Files:**
- Delete: `src/server/routers/` (alt-ağacın tamamı)
- Delete: `src/server/trpc/`
- Delete: `src/app/api/trpc/`

- [ ] **Step 1: Bağımlılık kullanım taraması**

Run: `grep -r "from '@/server/trpc\|from '@/server/routers\|api\.popup\|api\.booking\|api\.brief\|api\.consultant\|api\.user\|api\.package\|api\.tool" src --include='*.ts*'`
Expected: 0 match. Varsa import'u kaldır veya değiştir; tasklist'e ekle.

- [ ] **Step 2: Silme**

```bash
rm -rf src/server/trpc src/server/routers src/app/api/trpc
```

- [ ] **Step 3: Root layout'tan TRPCProvider kaldır**

`src/app/layout.tsx` (veya provider'ın mount edildiği yer):

```tsx
// Sil: import { TRPCProvider } from '@/app/_components/TRPCProvider';
// Sil: <TRPCProvider>{children}</TRPCProvider>
```

- [ ] **Step 4: Build çalışıyor mu**

Run: `pnpm typecheck && pnpm build`
Expected: 0 error.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor(server): remove tRPC + all domain routers"
```

### Task 3.2: DB + Drizzle sil

**Files:**
- Delete: `src/server/db/`
- Delete: `drizzle.config.ts`
- Delete: `src/server/db/migrations/`

- [ ] **Step 1: Silme**

```bash
rm -rf src/server/db drizzle.config.ts
```

- [ ] **Step 2: Build kontrol + commit**

Run: `pnpm typecheck && pnpm build`

```bash
git add -A
git commit -m "refactor(db): remove Neon + Drizzle infrastructure (ADR-010)"
```

### Task 3.3: Auth (Clerk) sil

**Files:**
- Delete: `src/app/sign-in/`
- Delete: `src/app/sign-up/`
- Delete: `src/app/(auth)/`
- Delete: `src/app/(admin)/`
- Delete: `src/app/api/webhooks/clerk/`
- Delete: `src/middleware.ts` (Clerk middleware varsa) veya Clerk kısmını çıkar

- [ ] **Step 1: Silme**

```bash
rm -rf src/app/sign-in src/app/sign-up \
       src/app/\(auth\) src/app/\(admin\) \
       src/app/api/webhooks/clerk
```

- [ ] **Step 2: middleware.ts temizle**

`src/middleware.ts` — Clerk kısmını kaldır, sadece next-intl middleware kalsın:

```ts
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

export default createIntlMiddleware(routing);

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

- [ ] **Step 3: ClerkProvider mount'unu kaldır**

`src/app/layout.tsx` içindeki `<ClerkProvider>` wrapper'ını kaldır.

- [ ] **Step 4: Component'lerde useAuth/useUser kullanımını bul ve sil**

Run: `grep -rn "@clerk/nextjs\|useUser\|useAuth\|currentUser\|auth()" src --include='*.ts*'`
Her match'i incele — büyük ihtimalle auth-required feature'da; component tamamen silinebilir ya da guest-only versiyona indirgenir.

- [ ] **Step 5: Build kontrol + commit**

Run: `pnpm typecheck && pnpm build`

```bash
git add -A
git commit -m "refactor(auth): remove Clerk + sign-in/up + admin + app dashboard (ADR-008)"
```

### Task 3.4: Payments sil

**Files:**
- Delete: `src/server/payments/` (varsa)
- Delete: `src/app/api/webhooks/stripe/`
- Delete: `src/app/api/webhooks/iyzico/`
- Delete: Ödeme-ilişkili page/component'ler

- [ ] **Step 1: Tarama**

Run: `grep -rn "stripe\|iyzipay\|checkout" src --include='*.ts*' | head -30`

- [ ] **Step 2: Silme**

```bash
rm -rf src/app/api/webhooks/stripe src/app/api/webhooks/iyzico src/server/payments
```

- [ ] **Step 3: Build + commit**

Run: `pnpm typecheck && pnpm build`

```bash
git add -A
git commit -m "refactor(payments): remove Stripe + iyzico (ADR-009)"
```

### Task 3.5: AI Agent sil

**Files:**
- Delete: `src/app/api/agent/`
- Delete: `src/server/agent/` (varsa)
- Delete: `src/components/*/ChatBot.tsx` veya benzeri agent UI component'leri

- [ ] **Step 1: Tarama**

Run: `grep -rn "from '@ai-sdk/google'\|from 'ai'\|ChatBot\|AgentClient" src --include='*.ts*'`

- [ ] **Step 2: Silme**

```bash
rm -rf src/app/api/agent src/server/agent
# chatbot component'lerini grep sonucuna göre sil
```

- [ ] **Step 3: Popup persona+problems context injection kaldır**

`src/components/marketing/entry-popup/` altında agent'a persona inject eden kod varsa sil.

- [ ] **Step 4: Build + commit**

Run: `pnpm typecheck && pnpm build`

```bash
git add -A
git commit -m "refactor(agent): remove AI agent + chatbot (ADR-007)"
```

### Task 3.6: Inngest sil

**Files:**
- Delete: `src/app/api/inngest/`
- Delete: `inngest.config.ts` (varsa)
- Delete: `src/server/inngest/` (varsa)

- [ ] **Step 1: Tarama + silme**

```bash
grep -rn "from 'inngest'\|inngest/client" src --include='*.ts*'
rm -rf src/app/api/inngest src/server/inngest inngest.config.ts
```

- [ ] **Step 2: Build + commit**

```bash
pnpm typecheck && pnpm build
git add -A
git commit -m "refactor(inngest): remove background job infrastructure (ADR-011)"
```

### Task 3.7: Sanity izleri sil

**Files:**
- Delete: `src/app/studio/`
- Delete: `sanity/` (dizin)
- Delete: `sanity.config.ts`
- Delete: `sanity.cli.ts` (varsa)

- [ ] **Step 1: Silme**

```bash
rm -rf src/app/studio sanity sanity.config.ts sanity.cli.ts
```

- [ ] **Step 2: Build + commit**

```bash
pnpm typecheck && pnpm build
git add -A
git commit -m "refactor(sanity): remove remaining Sanity traces (ADR-006 closure)"
```

### Task 3.8: SST config sil

**Files:**
- Delete: `sst.config.ts`

- [ ] **Step 1: Silme + commit**

```bash
rm sst.config.ts
git add -A
git commit -m "refactor(deploy): remove SST config — migrating to Vercel (ADR-012)"
```

### Task 3.9: Phase 3 smoke check

- [ ] **Step 1: Build clean**

Run: `pnpm typecheck && pnpm build`
Expected: 0 error, 0 warning (orphan import).

- [ ] **Step 2: Dev test**

Run: `pnpm dev`
Browser: `/tr`, `/en`, `/tr/iletisim`, popup trigger → hepsi render olmalı.

- [ ] **Step 3: Checkpoint**

```bash
git commit --allow-empty -m "checkpoint: phase 3 complete (code deletion done)"
```

---

## Phase 4 — package.json + env Cleanup

### Task 4.1: package.json dependencies temizle

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Kaldırılacak paketleri çıkar**

`package.json`'u aç, aşağıdaki paketleri **sil** (dependencies ve devDependencies'te):

`@clerk/nextjs`, `svix`, `@trpc/client`, `@trpc/server`, `@trpc/next`, `@trpc/react-query`, `@tanstack/react-query`, `superjson`, `drizzle-orm`, `drizzle-zod`, `drizzle-kit`, `@neondatabase/serverless`, `pg`, `@types/pg`, `stripe`, `iyzipay`, `@ai-sdk/google`, `ai`, `inngest`, `@sanity/image-url`, `@sanity/vision`, `@sanity/webhook`, `next-sanity`, `sanity`, `sst`, `@vitejs/plugin-react`, `@axiomhq/js`, `react-email`.

- [ ] **Step 2: Scripts temizle**

`scripts` alanından şu satırları sil:

`db:generate`, `db:migrate`, `db:push`, `db:studio`, `db:seed`, `sanity:typegen`, `sst:dev`, `sst:deploy`.

- [ ] **Step 3: Yeni dep ekle**

Varsa eksik olanları ekle:

```bash
pnpm add @next/mdx @mdx-js/react posthog-node
```

- [ ] **Step 4: Fresh install**

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

- [ ] **Step 5: Build geçiyor mu**

Run: `pnpm typecheck && pnpm build`

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore(deps): prune 14+ package families + scripts cleanup"
```

### Task 4.2: .env.example güncelle

**Files:**
- Modify: `.env.example`

- [ ] **Step 1: Sil ve yeniden yaz**

`.env.example`:

```env
# Resend
RESEND_API_KEY=
LEAD_INBOX_EMAIL=lead@indoles.com.tr
SALES_INBOX_EMAIL=sales@indoles.com.tr

# PostHog (EU Cloud)
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://eu.posthog.com
POSTHOG_API_KEY=
POSTHOG_HOST=https://eu.posthog.com

# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=

# Sentry
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_DSN=
SENTRY_AUTH_TOKEN=

# Cal.com
CAL_COM_EMBED_URL=https://cal.com/indoles/gorusme
```

- [ ] **Step 2: Commit**

```bash
git add .env.example
git commit -m "chore(env): simplified env template (Resend+PostHog+Turnstile+Sentry+Cal)"
```

---

## Phase 5 — Deploy Migration

### Task 5.1: next.config.ts sadeleştir

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Mevcut config'i oku**

Run: `cat next.config.ts`

- [ ] **Step 2: Simplify**

`next.config.ts` — SST/OpenNext ilgili her şey kalkar. Sentry wrap kalır, next-intl plugin kalır:

```ts
import createNextIntlPlugin from 'next-intl/plugin';
import { withSentryConfig } from '@sentry/nextjs';
import createMDX from '@next/mdx';

const withNextIntl = createNextIntlPlugin();
const withMDX = createMDX({});

const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  reactStrictMode: true,
};

export default withSentryConfig(withNextIntl(withMDX(nextConfig)));
```

- [ ] **Step 3: Build + commit**

```bash
pnpm build
git add next.config.ts
git commit -m "chore(config): simplify next.config — remove SST/OpenNext wiring"
```

### Task 5.2: Vercel proje setup

**Files:** — (Vercel dashboard)

- [ ] **Step 1: Vercel CLI install (lokalde)**

```bash
pnpm add -g vercel
vercel login
```

- [ ] **Step 2: Proje link et**

```bash
cd indoles-web
vercel link
```

- [ ] **Step 3: Env'leri Vercel'e ekle**

Vercel dashboard'da şu env'leri **Preview + Production**'a ekle:
- `RESEND_API_KEY`, `LEAD_INBOX_EMAIL`, `SALES_INBOX_EMAIL`
- `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`, `POSTHOG_API_KEY`, `POSTHOG_HOST`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`
- `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_DSN`, `SENTRY_AUTH_TOKEN`
- `CAL_COM_EMBED_URL`

- [ ] **Step 4: Preview deploy**

```bash
vercel
```

Expected: `https://indoles-web-<hash>.vercel.app` URL'i döner.

- [ ] **Step 5: Preview'ı test et**

Browser'da URL'i aç:
- Homepage render oluyor mu
- Popup trigger çalışıyor mu
- `/iletisim` form çalışıyor mu
- Cal.com embed açılıyor mu

### Task 5.3: Phase 5 checkpoint

- [ ] **Step 1: Commit**

```bash
git commit --allow-empty -m "checkpoint: phase 5 complete (Vercel preview working)"
```

---

## Phase 6 — Docs + CLAUDE.md Update

### Task 6.1: CLAUDE.md — §4 Tech Stack güncelle

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: §4 tablosunu değiştir**

Mevcut §4 tablosunu sadeleşmiş versiyonla değiştir:

```markdown
## 4. Tech Stack Özeti

**Mimari seçim:** Next.js 15 SSG + 2 REST API route. DB yok, auth yok, payment yok. Detay: `docs/05-tech-architecture.md` ve `docs/superpowers/specs/2026-04-17-simplification-design.md`.

| Katman | Teknoloji | Not |
|--------|-----------|-----|
| Frontend | Next.js 15 (App Router, RSC, SSG) | React 19 |
| Styling | Tailwind v4 + Radix UI + cva + Framer Motion | `lib/design/tokens.ts` |
| Backend | Next.js Route Handlers (2 endpoint) | `/api/contact`, `/api/visitor-profile` |
| Database | **Yok** | Launch'ta DB yok; ADR-010 |
| Auth | **Yok** | Launch'ta auth yok; ADR-008 |
| İçerik | Statik TS + MDX | `src/lib/content/*.ts` + `content/yazilar/*.mdx`; ADR-006 |
| Booking | Cal.com Cloud (embed) | `@calcom/embed-react` |
| Ödeme | **Yok** | ADR-009 |
| AI Agent | **Yok** | Launch'ta agent yok; ADR-007 |
| i18n | next-intl | Path-based TR+EN |
| Background Jobs | **Yok** | ADR-011 |
| Email | Resend + React Email | Transactional |
| Spam koruma | Cloudflare Turnstile | Invisible |
| Analytics | PostHog EU Cloud | Funnel + replay + feature flag |
| Observability | Sentry + Vercel built-in | — |
| Deploy | Vercel (eu-central) | ADR-012 |
| CI/CD | GitHub Actions + Vercel preview | — |
| Test | Vitest + Playwright | — |
```

- [ ] **Step 2: §6 Out of Scope'a ekle**

```markdown
| Auth / user accounts (launch) | Danışan vitrini iç ekip, self-signup yok; ADR-008 |
| Ödeme gateway'i (launch) | Teklifleşme süreci; ADR-009 |
| AI chatbot (launch) | Agent ROI belirsiz; ADR-007 |
| Kalıcı DB (launch) | Mail + PostHog yeterli; ADR-010 |
```

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs(claude): update tech stack + out of scope for simplification"
```

### Task 6.2: docs/05-tech-architecture.md güncelle

**Files:**
- Modify: `docs/05-tech-architecture.md`

- [ ] **Step 1: Mimari diyagramı sade versiyonla değiştir**

Mevcut 12-servis diyagramını, simplification spec'teki `graph LR` diyagramıyla değiştir (`spec §2.1`'den kopyala).

- [ ] **Step 2: Servis tablosunu güncelle**

Simplification spec'te §3.1 ve §3.2 — aynı çıkan/kalan bilgisini bu dosyaya yansıt.

- [ ] **Step 3: Commit**

```bash
git add docs/05-tech-architecture.md
git commit -m "docs(arch): update tech-architecture for simplified stack"
```

### Task 6.3: docs/06-data-model.md arşivle

**Files:**
- Modify: `docs/06-data-model.md`

- [ ] **Step 1: Başına not ekle**

`docs/06-data-model.md`'nin en başına (H1'den hemen sonra):

```markdown
> **Arşive alındı (2026-04-17)** — ADR-010 kapsamında DB kaldırıldı. Bu dosya Faz 2 referansı olarak korunuyor; launch'ta PostgreSQL tabloları yok. Veri akışı: `docs/superpowers/specs/2026-04-17-simplification-design.md` §5.
```

- [ ] **Step 2: Commit**

```bash
git add docs/06-data-model.md
git commit -m "docs(data-model): archive with Faz 2 reference note"
```

### Task 6.4: docs/07-ai-agent-spec.md arşivle

**Files:**
- Modify: `docs/07-ai-agent-spec.md`

- [ ] **Step 1: Başına not**

```markdown
> **Arşive alındı (2026-04-17)** — ADR-007 kapsamında AI agent kaldırıldı. Bu spec Faz 2'de agent FAQ asistanı olarak geri gelirse referans olarak korunuyor.
```

- [ ] **Step 2: Commit**

```bash
git add docs/07-ai-agent-spec.md
git commit -m "docs(agent-spec): archive with Faz 2 reference note"
```

### Task 6.5: docs/09-auth-roles-permissions.md split

**Files:**
- Modify: `docs/09-auth-roles-permissions.md` (arşive)
- Create: `docs/14-privacy-kvkk.md` (KVKK bölümü çıkar)

- [ ] **Step 1: KVKK bölümünü yeni dosyaya taşı**

`docs/09`'daki KVKK bölümünü tam olarak kopyala → `docs/14-privacy-kvkk.md` yeni dosyasına yapıştır, H1 ve intro ekle.

- [ ] **Step 2: docs/09 başına arşiv notu**

```markdown
> **Arşive alındı (2026-04-17)** — ADR-008 kapsamında Clerk + auth kaldırıldı. KVKK bölümü `docs/14-privacy-kvkk.md`'ye taşındı.
```

- [ ] **Step 3: Commit**

```bash
git add docs/09-auth-roles-permissions.md docs/14-privacy-kvkk.md
git commit -m "docs(auth): archive + split KVKK content to docs/14"
```

### Task 6.6: docs/11-funnel-customer-flows.md güncelle

**Files:**
- Modify: `docs/11-funnel-customer-flows.md`

- [ ] **Step 1: Auth-required booking path'ını sil**

Dosyada "auth gerekli" veya "`/app/rezervasyon`" referanslarını bul; tek path'e indir (guest quick-book + Cal.com).

- [ ] **Step 2: AI agent entry point'lerini sil**

"AI agent devreye giriş" bölümlerini sil veya Faz 2 notuyla işaretle.

- [ ] **Step 3: Commit**

```bash
git add docs/11-funnel-customer-flows.md
git commit -m "docs(funnel): remove auth-required booking + AI entry points"
```

### Task 6.7: entry-popup-design.md cross-ref ekle

**Files:**
- Modify: `docs/superpowers/specs/2026-04-17-entry-popup-design.md`

- [ ] **Step 1: Başına not**

Mevcut spec'in "Bağlı belgeler" satırından sonra:

```markdown
> **Altkatman revize (2026-04-17):** Bu spec davranışsal olarak geçerlidir. Altkatman (tRPC → REST, DB → mail+PostHog, Cal.com API → embed prefill, chatbot injection düşer, 24 ay retention/duplicate check düşer) `docs/decisions/ADR-013-popup-rest-migration.md` ile yürürlüğe girmiştir. Değişen bölümler: §6.3, §8, §9, §10, §11.3, §15.2.
```

- [ ] **Step 2: Commit**

```bash
git add docs/superpowers/specs/2026-04-17-entry-popup-design.md
git commit -m "docs(popup-spec): cross-ref ADR-013 for simplified substrate"
```

---

## Phase 7 — Test Suite Refactor

### Task 7.1: Kaldırılan E2E spec'leri sil

**Files:**
- Delete: `tests/e2e/auth-*.spec.ts`
- Delete: `tests/e2e/booking-auth.spec.ts` (varsa)
- Delete: `tests/e2e/payment*.spec.ts`
- Delete: `tests/e2e/agent-*.spec.ts`
- Delete: `tests/e2e/admin-*.spec.ts`

- [ ] **Step 1: Silme**

```bash
cd tests/e2e
ls *.spec.ts | grep -E "auth|payment|agent|admin|booking-auth" | xargs rm -v
cd ../..
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "test(e2e): remove specs for deleted features"
```

### Task 7.2: Popup E2E spec'lerini yeni API'ya adapte et

**Files:**
- Modify: `tests/e2e/popup-*.spec.ts`

- [ ] **Step 1: tRPC mock kullanımını fetch mock ile değiştir**

Her spec'te Playwright'ın `page.route()` ile `/api/visitor-profile` endpoint'ini mock'la. tRPC URL path'lerini kaldır.

```ts
await page.route('**/api/visitor-profile', (route) =>
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ ok: true, calComEmbedUrl: 'https://cal.com/indoles/gorusme?mock=1' }),
  }),
);
```

- [ ] **Step 2: Çalıştır**

Run: `pnpm test:e2e tests/e2e/popup-*.spec.ts`
Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add tests/e2e
git commit -m "test(e2e): popup specs use /api/visitor-profile mock"
```

### Task 7.3: Contact form E2E spec

**Files:**
- Create: `tests/e2e/contact-form.spec.ts`

- [ ] **Step 1: Test yaz**

```ts
import { test, expect } from '@playwright/test';

test('contact form submit — happy path', async ({ page }) => {
  await page.route('**/api/contact', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }),
  );
  await page.goto('/tr/iletisim');
  await page.getByLabel(/ad/i).first().fill('Burak');
  await page.getByLabel(/soyad/i).fill('Özgül');
  await page.getByLabel(/e-posta/i).fill('test@indoles.com.tr');
  await page.getByLabel(/telefon/i).fill('+905551112233');
  await page.getByLabel(/şirket/i).fill('INDOLES');
  await page.getByLabel(/konu/i).fill('Proje');
  await page.getByLabel(/mesaj/i).fill('Uzun bir mesaj, 20 karakterden fazla elbette.');
  await page.getByRole('button', { name: /gönder/i }).click();
  await expect(page.getByText(/mesajını aldık/i)).toBeVisible();
});
```

- [ ] **Step 2: 4 viewport'ta çalışt**

Playwright config'te projects section'ı 4 viewport'u (375, 768, 1280, 1536) kapsıyor olmalı.

Run: `pnpm test:e2e tests/e2e/contact-form.spec.ts`

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/contact-form.spec.ts
git commit -m "test(e2e): contact form happy path across 4 viewports"
```

### Task 7.4: i18n parite test

**Files:**
- Create: `src/i18n/__tests__/parity.test.ts`

- [ ] **Step 1: Test implement**

```ts
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

function flatten(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    typeof v === 'object' && v !== null
      ? flatten(v as Record<string, unknown>, prefix ? `${prefix}.${k}` : k)
      : [prefix ? `${prefix}.${k}` : k],
  );
}

describe('i18n parity', () => {
  const trDir = path.join(process.cwd(), 'messages/tr');
  const enDir = path.join(process.cwd(), 'messages/en');

  const trFiles = fs.readdirSync(trDir).filter((f) => f.endsWith('.json'));

  trFiles.forEach((file) => {
    it(`${file} — TR ve EN key'leri eşit`, () => {
      const tr = JSON.parse(fs.readFileSync(path.join(trDir, file), 'utf-8'));
      const en = JSON.parse(fs.readFileSync(path.join(enDir, file), 'utf-8'));
      const trKeys = new Set(flatten(tr));
      const enKeys = new Set(flatten(en));
      const missingInEn = [...trKeys].filter((k) => !enKeys.has(k));
      const missingInTr = [...enKeys].filter((k) => !trKeys.has(k));
      expect({ missingInEn, missingInTr }).toEqual({ missingInEn: [], missingInTr: [] });
    });
  });
});
```

- [ ] **Step 2: Geç + commit**

Run: `pnpm test src/i18n/__tests__/parity.test.ts`

```bash
git add src/i18n/__tests__/parity.test.ts
git commit -m "test(i18n): TR ↔ EN key parity guard"
```

### Task 7.5: Design token leak scanner

**Files:**
- Create: `scripts/check-token-leaks.test.ts`

- [ ] **Step 1: Test implement**

```ts
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      walk(full, out);
    } else if (/\.(tsx?|css)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

const BANNED_PATTERNS = [
  /text-\[\d+px\]/,            // text-[23px]
  /\b(w|h|p|m|gap)-\[\d+px\]/, // w-[120px]
  /#[0-9a-fA-F]{3,8}(?!\})/,   // inline hex color
];

describe('design token leak scanner', () => {
  it('literal pixel / hex yok (components + pages)', () => {
    const files = [
      ...walk(path.join(process.cwd(), 'src/components')),
      ...walk(path.join(process.cwd(), 'src/app')),
    ];
    const offenders: string[] = [];
    for (const f of files) {
      const content = fs.readFileSync(f, 'utf-8');
      for (const p of BANNED_PATTERNS) {
        if (p.test(content)) {
          offenders.push(`${f} — ${p}`);
          break;
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
```

- [ ] **Step 2: Commit**

```bash
git add scripts/check-token-leaks.test.ts
git commit -m "test(design): token leak scanner for literal px/hex values"
```

### Task 7.6: Phase 7 smoke check

- [ ] **Step 1: Tüm testler**

```bash
pnpm test
pnpm test:e2e
```

- [ ] **Step 2: Checkpoint**

```bash
git commit --allow-empty -m "checkpoint: phase 7 complete (tests refactored)"
```

---

## Phase 8 — Prod Cutover

### Task 8.1: PR ve review

- [ ] **Step 1: PR aç**

```bash
git push -u origin feat/simplification-migration
gh pr create --title "feat: mimari sadeleştirme — auth/DB/payments/agent/inngest/SST kaldır" \
  --body "$(cat <<'EOF'
## Özet

INDOLES web sitesini spec (`docs/superpowers/specs/2026-04-17-simplification-design.md`) uyarınca sadeleştirir.

## Kaldırılan
- Clerk (ADR-008)
- Neon + Drizzle (ADR-010)
- Stripe + iyzico (ADR-009)
- Vercel AI SDK + Gemini agent (ADR-007)
- Inngest (ADR-011)
- Sanity izleri (ADR-006 closure)
- SST/AWS → Vercel (ADR-012)

## Korunan
- Persona-driven homepage
- Entry popup davranışı (3-stage, taxonomy, KVKK, events) — altkatman değişti (ADR-013)
- Cal.com rezervasyon
- i18n (TR+EN parite)
- Editorial-minimalist design system

## Test Plan
- [x] Unit (Vitest) — yeşil
- [x] Integration (route handlers) — yeşil
- [x] E2E (Playwright 4 viewport) — yeşil
- [x] Preview deploy çalışır (Vercel)
EOF
)"
```

- [ ] **Step 2: Self-review + Burak onayı bekle**

### Task 8.2: Production deploy

- [ ] **Step 1: Merge**

PR approved → `main`'e merge.

- [ ] **Step 2: Vercel prod deploy**

Vercel otomatik prod deploy'u tetikler.

- [ ] **Step 3: Smoke test prod URL**

Browser:
- `https://indoles.com.tr/tr` — homepage
- Popup Stage 1-2-3 akışı
- `/iletisim` form submit
- Cal.com embed
- Sentry dashboard'da error yok
- PostHog event'leri geliyor

- [ ] **Step 4: active_context güncelle**

```markdown
## Simplification Migration — tamamlandı: 2026-05-01

- Prod deploy başarılı
- ADR-007 → ADR-013 "Kabul Edildi" olarak işaretle
```

- [ ] **Step 5: ADR status "Kabul Edildi"**

```bash
# ADR-007 → ADR-013 dosyalarında "Durum: Önerildi" → "Durum: Kabul Edildi"
# 7 dosyada sed ile veya elle
git add docs/decisions/ADR-00{7,8,9}-*.md docs/decisions/ADR-01{0,1,2,3}-*.md
git commit -m "docs(adr): mark 007-013 as Kabul Edildi after production deploy"
```

- [ ] **Step 6: Final commit**

```bash
git commit --allow-empty -m "checkpoint: simplification migration complete"
```

---

## Self-Review Checklist

Plan yazımı sonrası kendiliğinden kontrol edildi:

**Spec coverage:** Spec §1-13 her bölüm plan'da task olarak karşılandı — dependency envanteri (Task 4.1), route haritası (Phase 2 + 3), popup veri akışı (Task 1.6, 2.1, 2.2), contact akışı (Task 1.7, 2.3), içerik modeli (Task 2.5 ve mevcut TS/MDX korunur), error handling (Task 1.3 retry + route'larda Sentry), testing (Phase 7), deploy (Phase 5), ADR'lar (Task 0.2), docs (Phase 6).

**Placeholder scan:** TBD/TODO yok. Tek "eksik-adı" ContactForm field markup'ının brand-voice+design-tokens finalize'ı (Task 2.4) — bu bilinçli bir hand-off; ilgili skill'ler çağrılıyor.

**Type consistency:** `visitorProfileSchema` (Task 1.1) ← `/api/visitor-profile` (Task 1.6) ← Stage3 form (Task 2.1) aynı shape. `contactSchema` (Task 1.1) ← `/api/contact` (Task 1.7) ← ContactForm (Task 2.3) aynı shape. Mail template prop'ları (Task 1.4) route handler'ın geçtiği parametrelerle uyumlu.

---

## Sonraki Adım

Plan kaydedildi. İki execution opsiyonu:

**1. Subagent-Driven (önerilir)** — her task için fresh subagent dispatch, aralarda review, hızlı iterasyon

**2. Inline Execution** — bu session'da `executing-plans` ile batch execution, checkpoint'lerde review

Hangi yaklaşımı istersin?
