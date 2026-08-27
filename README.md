# INDOLES Web

INDOLES (İndoles Yazılım A.Ş.) kurumsal web platformu.

Sanayi için teknoloji dönüşümü, ticaret için agresif büyüme.

---

## Tech Stack

| Katman | Seçim |
|---|---|
| Framework | Next.js 15 (App Router, RSC, SSG) + React 19 |
| Styling | Tailwind CSS v4 (`@theme`) + Radix UI + cva |
| Tipografi | Lexend · Inter · JetBrains Mono (`next/font/google`) |
| İçerik | Statik TypeScript + MDX (`src/lib/content/*`, `content/*`) |
| i18n | next-intl — path-based TR + EN |
| API | 2 REST Route Handler: `/api/contact`, `/api/visitor-profile` |
| E-posta | Resend + React Email |
| Randevu | Kendi takvim sistemi (entegrasyon bekliyor — ADR-025) |
| Spam koruma | Cloudflare Turnstile |
| Analytics | Google Analytics 4 |
| Hata izleme | Sentry |
| Deploy | Cloudflare Workers (OpenNext) — ADR-024 |
| Test | Vitest + Playwright |
| 3D / motion (v2) | Three.js + @react-three/fiber + @react-three/drei · Lenis · GSAP ScrollTrigger |

**Yok:** veritabanı, auth, ödeme gateway'i, AI agent, background job. Gerekçeler `docs/decisions/ADR-006…ADR-013`'te.

Mimari detay: `docs/05-tech-architecture.md`.

---

## Geliştirme

```bash
pnpm install
cp .env.example .env.local   # değerleri doldur
pnpm dev                      # http://localhost:3000 → /tr
```

| Komut | İş |
|---|---|
| `pnpm dev` | Dev sunucusu (Turbopack) |
| `pnpm build` | Production build |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Vitest |
| `pnpm test:e2e` | Playwright |
| `pnpm lint` | ESLint |
| `pnpm format` | Prettier |
| `pnpm seo:audit` | 124 URL × 20 kural SEO/GEO denetimi (çalışan sunucuya karşı) |

### Cloudflare (ADR-024)

| Komut | Ne yapar |
|---|---|
| `pnpm cf:build` | OpenNext derlemesi — `NEXT_PUBLIC_APP_STAGE=production` ve kanonik host script'e gömülü |
| `pnpm cf:preview` | Derleyip Workers çalışma zamanını **yerelde** ayağa kaldırır |
| `pnpm cf:deploy:preview` | `stage=preview` ile dağıtır — `workers.dev` adresi `noindex` olur, canlıya dokunmaz |
| `pnpm cf:deploy` | Production dağıtımı |
| `pnpm cf:typegen` | Worker binding'lerinden tip üretir |

Aşama değişkeni bilerek script'e gömülü: `NEXT_PUBLIC_APP_STAGE` production değilse `robots.txt` tüm siteyi kapatır ve GA4 yüklenmez (denetim LG-02). Deploy sonrası ilk kontrol `curl <adres>/robots.txt` olmalı.

Sırlar repoya yazılmaz — `wrangler secret put <AD>` ile tanımlanır: `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `SENTRY_DSN`. Kanonik host `www.indoles.com.tr`; custom domain bağlama `wrangler.jsonc` içinde yorumda bekliyor ve **cutover'da** açılır.

---

## Tasarım sistemi

Tüm görsel kararlar repo içinde kodla alınır. Otorite sırası:

1. `docs/04-design-system-principles.md` — estetik otorite
2. `src/lib/design/tokens.ts` — token'ların TS tanımı
3. `src/styles/globals.css` — Tailwind `@theme` + primitive'ler
4. `src/styles/sections.css` — karmaşık bölüm mekanikleri
5. Component

Bu sırayı atlayan bir değişiklik (component'e ham hex/px yazmak gibi) kabul edilmez. Sistemden sapma ADR gerektirir.

Mevcut sürüm **v2** (2026-08-19, `ADR-015-design-system-v2.md`): Lexend display tipografisi, logo teal'inden türetilmiş tek marka skalası + gold accent, çok katmanlı elevation, canvas tabanlı motion.

### Sürekli sahne — tüm site

`ADR-016` ile onaylanan, `ADR-017` ile tüm siteye taşınan kurgu: sayfa boyunca
hiç unmount edilmeyen tek bir WebGL blob, anasayfada koreografiye bağlı,
iç sayfalarda sessiz eşlikçi. Chrome (siyah bilgi şeridi, nav, footer) layout
seviyesindedir ve her sayfada aynıdır.

Motion ve etkileşim kuralları `docs/04` §12'de; tune edilebilir tüm değerler
`src/lib/v2/anim-config.ts`'te.

---

## Dokümantasyon

| Dosya | İçerik |
|---|---|
| `CLAUDE.md` | Workspace memory — çalışma prensipleri, klasör haritası, konvansiyonlar |
| `active_context.md` | Oturumlar arası durum dökümü |
| `docs/01-vision-positioning.md` | Vizyon, iki eksen, persona'lar, rekabet konumu |
| `docs/02-information-architecture.md` | Route haritası, navigasyon, sayfa tipolojileri |
| `docs/03-brand-voice-tone.md` | Ton matrisi, persona-aware copy kuralları |
| `docs/04-design-system-principles.md` | Design System v2 |
| `docs/05-tech-architecture.md` | Stack, akışlar, environment |
| `docs/08-seo-i18n-strategy.md` | hreflang, sitemap, llms.txt |
| `docs/11-funnel-customer-flows.md` | Üçlü taahhüt funnel'ı |
| `docs/12-analytics-measurement.md` | GA4 event taksonomisi, KPI |
| `docs/13-ui-ux-audit.md` | İç sayfa UI/UX bulguları (2026-08-19) |
| `docs/14-privacy-kvkk.md` | KVKK, veri saklama |
| `docs/decisions/` | ADR-001 … ADR-017 |

`docs/06`, `docs/07` ve `docs/09` **arşivdir** — uygulanmamış katmanları (Postgres modeli, AI agent, Clerk auth) tarif ederler ve dosya başlarında bu şekilde işaretlidirler.
