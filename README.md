# INDOLES Web

INDOLES (İndoles Yazılım A.Ş.) kurumsal web platformu.

Sanayi için teknoloji dönüşümü, ticaret için agresif büyüme.

---

## Tech Stack (özet)

- **Frontend:** Next.js 15 (App Router, RSC) + React 19 + Tailwind CSS v4
- **Backend:** Next.js Route Handlers + tRPC + Drizzle ORM + Neon Postgres
- **Auth:** Clerk
- **CMS:** Sanity (embedded Studio)
- **AI:** Vercel AI SDK + Google Gemini
- **Payments:** Stripe (global) + iyzico (TR)
- **Booking:** Cal.com Cloud
- **Background:** Inngest
- **Deploy:** AWS (SST Ion + OpenNext) — `eu-central-1`

Detay: `docs/05-tech-architecture.md`.

---

## Geliştirme

```bash
pnpm install
cp .env.example .env.local   # değerleri doldur
pnpm dev                      # http://localhost:3000
```

### Veritabanı

```bash
pnpm db:generate    # migration üret
pnpm db:push        # şemayı DB'ye pushla (dev)
pnpm db:seed        # test datası
pnpm db:studio      # Drizzle Studio
```

### Test

```bash
pnpm test           # Vitest (unit + integration)
pnpm test:e2e       # Playwright
```

### Deploy

```bash
pnpm sst:dev                           # SST dev mode
pnpm sst:deploy --stage preview        # Preview deploy
pnpm sst:deploy --stage production     # Production deploy
```

---

## Dokümantasyon

Tüm mimari ve ürün kararları `docs/` altındadır:

- `01-vision-positioning.md` — Vizyon, persona'lar, ton
- `02-information-architecture.md` — Sayfa haritası, URL, nav
- `03-brand-voice-tone.md` — Ton rehberi
- `04-design-system-principles.md` — Tasarım dili
- `05-tech-architecture.md` — Teknik mimari (bu repo)
- `06-data-model.md` — Postgres tablolar, ER diyagramı
- `07-ai-agent-spec.md` — AI agent
- `08-seo-i18n-strategy.md` — SEO + i18n
- `09-auth-roles-permissions.md` — Auth + rol + permission
- `10-content-model-sanity.md` — Sanity şeması
- `11-funnel-customer-flows.md` — Funnel, müşteri akışları
- `12-analytics-measurement.md` — PostHog event'ler, KPI

Mimari kararlar: `docs/decisions/ADR-XXX-*.md`.

Workspace memory: `CLAUDE.md`.

---

## Lisans

Proprietary — © İndoles Yazılım A.Ş.
