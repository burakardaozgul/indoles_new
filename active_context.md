## Simplification Migration — durum: Phase 7 tamam (2026-04-18)

- Branch: `feat/simplification-migration` (main'den 41 commit ileri)
- Spec: `docs/superpowers/specs/2026-04-17-simplification-design.md`
- Plan: `docs/superpowers/plans/2026-04-17-simplification-plan.md`

### Tamamlandı

- Phase 0: 7 ADR (007-013) + branch
- Phase 1: Paralel backend — `/api/contact`, `/api/visitor-profile`, Zod, Turnstile, Resend retry, 4 mail template, PostHog server
- Phase 2: Frontend cut-over — popup REST + Turnstile, Cal.com embed prefill, `/iletisim` ContactForm + real Cal.com embed, `/gizlilik-kvkk` sayfası
- Phase 3: 28+ dependency ailesi çıkarıldı, ~10 kod alt-ağacı silindi (tRPC, DB, Clerk, Payments, Agent, Inngest, Sanity, SST)
- Phase 4: `package.json` 77 → ~50 dep; env template; fresh install temiz
- Phase 5.1: `next.config.ts` sadeleştirildi (SST/OpenNext kaldırıldı, Sentry wrapper eklendi)
- Phase 6: CLAUDE.md §4 + §6, docs/05 mimari, docs/06 arşiv, docs/07 arşiv, docs/09 split + docs/14 yeni, docs/11 funnel, popup-design cross-ref
- Phase 7: E2E popup spec güncellendi (Turnstile stub + route mock), contact-form e2e eklendi, i18n parity test, token leak scanner (skipped — 33 debt)

### Burak'ın onayıyla yapılacak

- Phase 5.2: Vercel proje setup + env migration (interactive, Vercel account)
- Phase 8: Remote push + `gh pr create` + review + merge + prod deploy (blast radius geri dönülmez)

### Teknik borçlar

- `@vitejs/plugin-react` kaldırılamadı (`vitest.config.ts` import ediyor); vitest konfig migrasyonuyla çözülür
- Design token leak 33 offender (`w-[1440px]` max-width, hex renkler); scanner testi `it.skip` ile duruyor, dosyalar dokunulurken düzeltilmeli

---

# Active Context — Entry Popup Implementation

> **Son güncelleme:** 2026-04-17 (Phase 4 + ADR-006 + Docker DB setup; **Task 25 DB driver switch bekliyor**)
> **Yeniden başlatırken:** Bu dosyayı ilk oku, sonra aşağıdaki "FRESH SESSION ENTRY POINT" bölümünü takip et.

---

## 🔴 FRESH SESSION ENTRY POINT (Task 25 başlangıcı)

### Durum (fresh session açıldığında)

1. **Phase 4 bitti.** HEAD: `ce99de5`. 88/88 test yeşil. typecheck temiz.
2. **ADR-006 (Sanity kaldırıldı)** — docs güncel. Source code cleanup Phase 6'da.
3. **Docker postgres çalışıyor:** container `indoles-dev-db`, port **5433** (5432 başka container'da tutulu), DB `indoles`, user `postgres`, pw `dev`. 14 table + `popup_submissions` migration apply edildi.
4. **`.env.local` DATABASE_URL güncel:** `postgresql://postgres:dev@localhost:5433/indoles` (gitignored, commit edilmedi)
5. **`playwright.config.ts:26` fix edildi:** `pnpm dev` → `corepack pnpm dev` (commit bekliyor)
6. **Task 25 BLOCKER:** Runtime `src/server/db/index.ts` `@neondatabase/serverless` `neon-http` driver kullanıyor — local postgres'le konuşamaz (HTTPS API bekler). E2E submit path patlayacak.

### İlk adım (driver switch)

**Karar (Burak onaylı):** `src/server/db/index.ts`'e conditional driver switch ekle. URL localhost ise `pg` + `drizzle-orm/node-postgres`, değilse mevcut `neon-http`.

**Task sırası:**

1. **`pg` + `@types/pg` install:**
   ```bash
   cd "/Users/burakardaozgul/Documents/AA - Claude/INDOLES - Yeni/indoles-web"
   corepack pnpm add pg
   corepack pnpm add -D @types/pg
   ```

2. **`src/server/db/index.ts` refactor — ~15 satır additive:**
   ```typescript
   // Pseudocode:
   // if (connectionString.includes("localhost") || connectionString.includes("127.0.0.1")) {
   //   // use pg + drizzle-orm/node-postgres
   //   const { Pool } = await import("pg");
   //   const { drizzle: drizzlePg } = await import("drizzle-orm/node-postgres");
   //   const pool = new Pool({ connectionString });
   //   return drizzlePg(pool, { schema });
   // }
   // // else existing neon-http path
   ```
   **Önemli:** async dynamic import kullanırsan export type değişir. Simplest: sync top-level import her ikisini de et, runtime'da seç. Import cost negligible.

3. **Docker container zaten çalışıyor** (fresh session'da `docker ps` ile doğrula). Değilse:
   ```bash
   docker start indoles-dev-db   # varsa start
   # veya (container silinmişse):
   docker run -d --name indoles-dev-db -p 5433:5432 -e POSTGRES_PASSWORD=dev -e POSTGRES_DB=indoles -e POSTGRES_USER=postgres postgres:16
   sleep 4
   docker exec -i indoles-dev-db psql -U postgres -d indoles < src/server/db/migrations/0000_handy_lockjaw.sql
   ```

4. **Driver switch verify:**
   ```bash
   corepack pnpm tsc --noEmit       # temiz olmalı
   corepack pnpm vitest run         # 88/88
   # dev server smoke test:
   corepack pnpm dev &              # başlat
   sleep 10
   curl http://localhost:3000/tr | head -5   # 200 dönmeli
   # tRPC endpoint smoke (manual): popup submit mock payload gönder
   kill %1                          # dev server durdur
   ```

5. **Driver switch commit:**
   ```bash
   git add src/server/db/index.ts package.json pnpm-lock.yaml playwright.config.ts
   git commit -m "feat(db): dual-driver support — pg for local, neon-http for Neon Cloud"
   ```

6. **Task 25 dispatch (implementer Sonnet):** Playwright E2E happy path — plan §3367-3460'ta verbatim test kodu. Cookie clear, 4s trigger, persona select, problem select, action select, form fill, submit, success state. Mevcut `tests/e2e/homepage.spec.ts` baseline var (revizyon gerekebilir — PersonaAxes silindi, "iki persona ekseni" test title misleading).

### Task 25 için ek notlar

- **Mevcut `homepage.spec.ts`:** 3 test var (TR home loads, EN home loads, /api/health). `text=Sanayi` ve `text=Ticaret` default editorial hero'da hâlâ var → muhtemelen geçer. Ama test title "iki persona ekseni gösterir" yanıltıcı — güncelleme gerek.
- **Test isolation:** Her test öncesi `await context.clearCookies()` zaten plan'da var. DB cleanup için `afterEach`: popup_submissions truncate veya test prefix'li email (`"playwright-test-${Date.now()}@..."`) kullan.
- **Dev server reuse:** `playwright.config.ts` `reuseExistingServer: true` — manuel `corepack pnpm dev` açıkken test çalışır, değilse Playwright auto-start eder (artık corepack ile).
- **tRPC popup submit cookie etkisi:** Submit sonrası `indoles_popup_state` cookie'si `outcome: "completed"` ile yazılır — E2E bunu PersonaChip görünürlüğü için doğrulayabilir (bonus coverage).

---

## Neredeyiz?

**Phase 4 — Integration tamamlandı.** 24 task içinden 23 bitmiş (Task 7 Cal.com skip edildi). **Phase 5 — E2E + a11y** sırada (2 task: 25, 26). **Phase 6 — docs + hardening** sonra (5 task: 27-31 + ADR-006 follow-up cleanup).

Ek olarak bu session: **ADR-006 (Sanity kaldırma)** kararı alındı ve doc temizliği yapıldı. Source code + package.json cleanup Phase 6'ya bırakıldı. **Docker postgres kuruldu (port 5433)** ve runtime DB driver switch gerekliliği tespit edildi — Task 25 ilk adımı.

### Hızlı kontrol komutları

```bash
cd "/Users/burakardaozgul/Documents/AA - Claude/INDOLES - Yeni/indoles-web"
git log --oneline | head -10       # Commit geçmişi
corepack pnpm vitest run 2>&1 | tail -5    # 88/88 test yeşil olmalı
corepack pnpm tsc --noEmit                  # Hatasız çıkmalı
```

**Not:** Shell'de `pnpm` PATH'te yok — `corepack pnpm` ile çalıştır.

---

## Bitmiş task'lar ve commit SHA'ları (kısa)

### Phase 1 — Foundation (5 task) — önceki session
### Phase 2 — Backend (6 task + 1 skip) — önceki session
### Phase 3 — Popup UI (9 task) — önceki session
**Phase 1-3 detayı için:** git log'a bak, ya da eski active_context git history'de (HEAD~5 civarı).

### Phase 4 — Integration (3 task) — bu session

| # | Task | Commit |
|---|---|---|
| 22 | PersonaChip component | `99179d2` |
| 23 | Homepage hero persona-aware + PersonaAxes removal | `06a2abf` |
| 24 | Chatbot context injection | `90a3058` |

### Ek: ADR-006 Sanity removal (docs-only)

- Commit: `079f357`
- ADR: `docs/decisions/ADR-006-remove-sanity.md`
- CLAUDE.md §4/§7/§9 güncellendi
- `docs/10-content-model-sanity.md` silindi
- 7 diğer doc'ta Sanity ref'leri statik içerik alternatifleriyle güncellendi

**Son commit (HEAD):** `079f357`
**Total commit bu session:** 4 (Phase 4 + Sanity docs)
**Test sayısı:** 88/88 yeşil (+6 Phase 4'ten)

---

## Yarın / yeni session buradan devam

### Phase 5 — E2E + a11y (Task 25-26) sırası

Plan dosyası: `docs/superpowers/plans/2026-04-17-entry-popup-plan.md`

#### Task 25 — Playwright E2E happy path
- **Files:** `tests/e2e/entry-popup.spec.ts` (CREATE)
- **Sorumluluk:** Full popup flow (Stage 1 → 2 → 3 → contact submit). Cookie clear, 4s trigger, persona select, problem select (3), action select, form fill, submit, success state. Plan'da verbatim test kodu var.
- **Dependency:** Playwright config'in mevcut olduğunu verify et — `playwright.config.ts` var mı? Yoksa kurulum ilk adım.
- **Ek scenario'lar:** PersonaChip → popup yeniden açılır (plan'da var, line 3417 civarı).

#### Task 26 — A11y audit
- **Files:** `tests/e2e/entry-popup.a11y.spec.ts`
- **Sorumluluk:** @axe-core/playwright ile popup'ın tüm stage'lerinde axe scan. Focus management, keyboard nav, aria labels.
- **Dependency:** `@axe-core/playwright` package yüklü mü? `playwright` peer dep'i.

### Phase 6 — docs + hardening (Task 27-31 + biriken backlog)

Bu session'da biriken **Phase 6 backlog** (review'lerden + ADR-006 follow-up):

**Entry popup review debt:**
- Task 22: chip `aria-label` redundancy, `neutral-*` token migration (popup modülü geneli)
- Task 23 M2: Hydration flash mitigation (middleware SSR opsiyonu)
- Task 23 M3: `readCurrentPersona` runtime PersonaSlug validation
- Task 23 M4: `HomeHeroSection` test'inde buyume-pazarlar variant copy assertion ekle
- Task 23 M5: `i18n-parity.test.ts` → `home.hero.*` namespace'ı kapsayacak şekilde genişlet
- Task 23: `(_outcome)` → `()` cleanup in `home-hero-section.tsx:47`
- Task 24 I1: `readPopupContext` persona enum guard (tampered cookie koruması)
- Task 24 I2: Chatbot UI wire-up'ta `/api/agent` POST body'sine `locale` eklenmesi (henüz client yok)
- Task 24: `buildPopupContextBlock`'taki hardcoded TR/EN persona label'larını i18n'a çıkar
- Docs: `docs/07-ai-agent-spec.md` → cookie outcome asimetrisi (hero "any persona", agent "completed only") dokümante edilmeli

**ADR-006 source code cleanup (önemli — bundle etkisi var):**
- `package.json` deps: `sanity`, `@sanity/image-url`, `@sanity/vision`, `@sanity/webhook`, `next-sanity` kaldır. `sanity:typegen` script sil.
- `sanity/sanity.config.ts` sil
- `src/app/studio/[[...tool]]/page.tsx` sil
- `src/app/api/webhooks/sanity/route.ts` sil
- `src/lib/sanity/client.ts`, `src/lib/sanity/queries.ts` sil
- `src/lib/content/types.ts` Sanity-specific type'ları temizle
- `src/app/(admin)/admin/page.tsx` — Sanity query import'ları temizle/pages sadeleştir
- `src/app/(auth)/app/brief/yeni/page.tsx` — aynı
- `src/server/db/schema.ts` + `seed.ts` + migrations'taki Sanity doc id ref'leri kaldır
- `.env` ve SST secret'larından `SANITY_*` kaldır
- CSP policy'sinden Sanity domain'leri kaldır
- **Not:** Bu cleanup, source code'u build-breakable yapabilir (Sanity import eden pages'ler). Adım adım, her silmeden sonra `tsc --noEmit` + `vitest run`.

**Full-homepage persona adaptivity (phased rollout — user kararı):**
- Şimdi: sadece hero (Task 23'de yapıldı)
- Phase 6'dan sonra / Faz 2: `PillarsSection`, `ProofSection`, `PackagesSection`, `FinalCTASection` — persona'ya göre content adapt eder. Her biri ayrı task olacak. Copy + client wrapper + i18n parity gerekiyor her birinde.
- `ClientLogosMarquee` ve `ManifestoSection` default/nötr kalır (kullanıcı kararı).

**Orijinal plan Phase 6 task'ları (27-31):**
- Task 27: Cal.com booking flow (ADR-004 1 saat booking süresi) — Cal.com kullanılıyorsa
- Task 28: quick-book guest path (ADR-005) — Cal.com kullanılıyorsa
- Task 29: Rate limit + retention cron
- Task 30: KVKK aydınlatma sayfası (şimdi static markdown ile — ADR-006 sonrası)
- Task 31: Popup dismiss fidelity (mid-form dismiss doğru stage kaydı)

### Final (Phase 6 sonrası)

- `indoles-responsive-quality` skill ile 4-viewport Chrome live test + full Playwright suite
- Lighthouse + PostHog funnel doğrulaması
- Launch readiness checklist

Yaklaşık kalan: **~10 orjinal task + ~15 follow-up item.** Bir çalışma günü + 1 günlük polish.

---

## Kritik kararlar ve deviation'lar (yeni session için önemli)

### Bu session'da alınan kararlar

1. **Task 23 architecture:** Option B surgical — `EditorialHero` untouched, yeni `HomeHeroSection` client wrapper. Persona değişince `home.hero.personas.{slug}` i18n subtree kullanılır. Default persona=null SSR'da teslim edilir (SEO korundu). Hydration flash kabul edildi.
2. **Task 23 i18n namespace:** Mevcut `home.hero.*` genişletildi (`personas.*` subtree eklendi). Plan'ın önerdiği paralel `homepage.hero.*` namespace reddedildi.
3. **Task 23 PersonaAxes:** Component + `home.hero.axis.*` tamamen silindi. "İki eksen yan yana" kalıbı persona-driven hero'ya dönüştü.
4. **Task 24 file org:** `buildPopupContextBlock` + `PopupAgentContext` mevcut `src/lib/ai/prompts/indoles-agent.ts`'e eklendi. Plan'ın önerdiği yeni `src/lib/ai/system-prompt.ts` dosyası oluşturulmadı.
5. **Task 24 persona identifier:** Mevcut `Persona = "industrial" | "commerce" | "unknown"` type **korundu**. Yeni `PopupPersonaSlug = "donusum-teknoloji" | "buyume-pazarlar"` parallel olarak eklendi. Mapping `buildPopupContextBlock` içinde slug→human label olarak yapılıyor.
6. **Cookie lifecycle asimetrisi (kasıtlı):** HomeHeroSection "any persona" cookie'de varsa adapt eder; agent route "outcome: completed" ister. Hero için soft signal, agent için hard signal. Phase 6 docs'ta açıklanacak.
7. **ADR-006 Sanity kaldırıldı.** İçerik git'te statik TS + MDX olarak tutulur. Source code cleanup Phase 6'ya bırakıldı (build şu an kırık değil — Sanity import'ları hâlâ kodda).
8. **Full-homepage persona adaptivity phased.** Şimdi sadece hero. Diğer section'lar Phase 6 sonrası ayrı task serisi.

### Önceki session kararları (hâlâ geçerli)

- **Cal.com SKIP** — Task 7 skip edildi (`CAL_COM_API_KEY` yok). Popup submission tRPC router booking path'ı sadece DB + lead email (contact ile aynı davranış).
- **DATABASE_URL yok** — tüm testler mock'lu. Phase 6 smoke test için Docker postgres açılabilir.
- **tRPC export ismi `trpc`**, `api` değil (plan `api.popup.submit.useMutation()` diyordu, gerçek `trpc.popup.submit.useMutation()`).
- **Inngest functions barrel** Task 10'da oluşturuldu.
- **personaLabel** helper `src/lib/popup/personas.ts → getPersonaLocalizedLabel(slug, locale)`.
- **React 19 text encoding** apostrof'u HTML entity'ye dönüştürüyor — email template testleri `decodeEntities` helper ile assert ediyor.

---

## Yeni session başlatma

### 1. Oku + durumu doğrula

```
Read /Users/burakardaozgul/Documents/AA - Claude/INDOLES - Yeni/indoles-web/active_context.md
cd "/Users/burakardaozgul/Documents/AA - Claude/INDOLES - Yeni/indoles-web"
git log --oneline | head -5       # HEAD: 079f357
corepack pnpm vitest run 2>&1 | tail -5   # 88/88
corepack pnpm tsc --noEmit                 # temiz
```

### 2. Subagent-driven akışa devam et

Bana söylemen yeterli: **"active_context.md'yi oku, Task 25'ten Phase 5'e devam et"**

Model kuralı:
- Orchestrator (ben) + reviewer'lar → **Opus**
- Implementer'lar → **Sonnet**
- Her task sonrası 2 aşamalı review (spec + quality)
- Phase sonu integration review + final reviewer

### 3. Task 25 başlatmadan önce (kritik kontrol)

Playwright setup'ı var mı?

```bash
ls tests/e2e/ 2>/dev/null                   # var mı?
ls playwright.config.ts 2>/dev/null         # var mı?
cat package.json | grep -iE "playwright|axe"
```

Yoksa Task 25'in ilk adımı Playwright init + config.

### 4. Açık soru (Task 25 başında)

- Playwright test'ler `corepack pnpm test:e2e` gibi bir script altında mı çalışacak, yoksa `corepack pnpm playwright test` direkt mi?
- E2E için dev server mı kullanılacak (`pnpm dev` in background), yoksa production build mi? Plan verbatim code `page.goto("/tr")` diyor — localhost:3000 varsayıyor.
- Mock tRPC / DB: Playwright'te gerçek DB olmadan çalışacak mı? Task 12'de tRPC mock pattern Phase 3 test'lerinde var mı bakılmalı.

---

## Git state

```
Branch: main
HEAD: 079f357 docs: remove Sanity CMS, content moves to static TS + MDX (ADR-006)
Uncommitted: 0
Remote: YOK (local-only)
```

---

## Kısa cevap: yarın ne yapacağız?

**Task 25 (Playwright E2E) → Task 26 (a11y) → Phase 6 hardening (Task 27-31 + biriken backlog + ADR-006 code cleanup) → Final verification.**

Toplamda yaklaşık 2-3 implementer dispatch + 4-6 reviewer + ADR-006 code cleanup dispatch + final Chrome + Playwright + Lighthouse verification.

Tahmin: 1-2 çalışma günü.
