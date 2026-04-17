# Active Context — Entry Popup Implementation

> **Son güncelleme:** 2026-04-17 (Phase 3 bitiminde)
> **Yeniden başlatırken:** Bu dosyayı ilk oku, sonra `docs/superpowers/plans/2026-04-17-entry-popup-plan.md`'deki Phase 4'ten devam et.

---

## Neredeyiz?

**Phase 3 — Popup UI tamamlandı.** 21 task içinden 20 bitmiş durumda (Task 7 Cal.com skip edildi). **Phase 4 — Integration** sırada (3 task: 22, 23, 24).

### Hızlı kontrol komutları

```bash
cd "/Users/burakardaozgul/Documents/AA - Claude/INDOLES - Yeni/indoles-web"
git log --oneline | head -40        # Commit geçmişi
pnpm vitest run 2>&1 | tail -10     # 79/79 test yeşil olmalı
pnpm tsc --noEmit                   # Hatasız çıkmalı
```

---

## Bitmiş task'lar ve commit SHA'ları

### Phase 1 — Foundation (5 task)
| # | Task | Commit |
|---|---|---|
| 1 | Git init + baseline | `b3f2dfc` |
| 2 | Types + persona config | `5d8b3f9` + `6ebefa7` (getPersonaDef test fix) |
| 3 | Problem taxonomy (20) | `35f9b46` + `92dd226` (readonly + miss case test) |
| 4 | i18n messages TR+EN | `316a698` |
| 5 | DB schema popup_submissions | `ae4e357` + `2b61ac4` (enum + FK + indexes fix) |

### Phase 2 — Backend (6 task + 1 skip)
| # | Task | Commit |
|---|---|---|
| 6 | Zod schemas | `d86ebe7` + `f701df9` (narrow enum + phone refine) |
| 7 | Cal.com quick-book | **SKIP** — kullanıcı kararı, ADR-005'te deferred |
| 8 | Lead notification email | `37e3ee4` + `83843c8` (vitest plugin → scoped helper refactor) |
| 9 | Lead confirmation email | `a5cfedd` + `85e7ee7` (decodeEntities extract + null-URL test) |
| 10 | Inngest handler | `3c6910c` + `8abde6a` (serve route fix) + `8bf96f2` (step split + idempotencyKey) |
| 11 | resolveProblemText | `2e4a2da` |
| 12 | tRPC popup router | `3223b7d` + `6aae182` (personaLabel extract) |

### Phase 3 — Popup UI (9 task)
| # | Task | Commit |
|---|---|---|
| 13 | Cookie + useEntryPopup | `43cf0cf` |
| 14 | Analytics helpers | `80d8c23` + `313ccba` (type narrowing + SSR guard) |
| 15 | ProgressIndicator | `336b6ef` |
| 16 | Stage1Persona | `cbc3099` + `add41e0` (a11y aria-label fix) |
| 17 | Stage2Problems (FIFO) | `d5c0901` |
| 18 | Stage3Actions | `d0db932` |
| 19 | LeadFieldsForm + wrappers | `05694da` + `75673a7` (a11y fix) |
| 20 | SuccessState | `5408a99` |
| 21 | EntryPopup container | `f6f2762` |

**Son commit (HEAD):** `f6f2762`
**Total commit:** ~30
**Test sayısı:** 79/79 yeşil

---

## Yarın buradan devam

### Phase 4 — Integration (Task 22-24) sırası

Plan dosyası: `docs/superpowers/plans/2026-04-17-entry-popup-plan.md`

#### Task 22 — PersonaChip component
- **Files:** `src/components/marketing/entry-popup/PersonaChip.tsx` + test
- **Sorumluluk:** Hero'da küçük persona indicator chip (örn. "Seçim: Büyüme ve Yeni Pazarlar · değiştir"), `onReopen` callback'i ile popup'ı yeniden açar
- **Dependency:** Bitmiş — tüm altyapı hazır. Straight-forward implementer dispatch.

#### Task 23 — Homepage hero refactor
- **Dependency risk:** Mevcut hero component path'i plan'da exact olarak belli değil. İlk adım:
  ```bash
  grep -rln "Sanayi" src/app/ src/components/ 2>/dev/null
  grep -rln "hero\|Hero" src/app/\(marketing\)/ 2>/dev/null
  ls src/app/\(marketing\)/\[locale\]/
  ```
- **Hedef:** Mevcut "iki eksen yan yana" hero'yu **tek-versiyon** hero'ya refactor et. Üstünde `PersonaChip` (Task 22'den), EntryPopup component'ini mount et (`useEntryPopup` hook kullanır).
- **i18n:** `messages/tr.json` ve `en.json`'a `homepage.hero.{headline,body,cta}` namespace'i eklenecek (TR ve EN parite). Plan'da exact content var.

#### Task 24 — Chatbot context injection
- **Dependency risk:** Chatbot agent entry point path'ini bulmak gerekecek:
  ```bash
  grep -rln "createDataStreamResponse\|streamText\|POST.*agent" src/app/api/ 2>/dev/null
  ls src/app/api/agent/ src/app/api/chat/ 2>/dev/null
  ls src/lib/ai/ 2>/dev/null
  ```
- **Hedef:** Agent route'ta server-side cookie oku (`indoles_popup_state`), persona+problems'ı system prompt'a `buildPopupContextBlock` helper'ı ile inject et. `src/lib/ai/system-prompt.ts` oluştur/genişlet.
- **Plan'da verbatim code var.** Test mocked.

---

## Kritik kararlar ve deviation'lar (yarın için önemli)

### Projeye özel kararlar (plan'daki gap'leri doldurmuş)

1. **Cal.com SKIP** — User kararı. Task 7 hiç implement edilmedi. Task 12 tRPC router booking path'ı Cal.com çağırmıyor — iletişim formu ile aynı davranış (DB + lead email). Gelecekte `CAL_COM_API_KEY` + event type configure edilince `createQuickBooking` eklenebilir (note inline at `src/server/routers/popup.ts`).
2. **DATABASE_URL yok** — Migration (`src/server/db/migrations/0000_handy_lockjaw.sql`) generate edildi, **apply edilmedi**. Tüm testler DB mock'lu. Yarın Phase 4 için DB gerekmiyor. Phase 6 smoke test için user Docker açabilir: `docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=dev postgres:16`.
3. **vitest.config.ts** — Task 2'de co-located test pattern eklendi (`src/**/__tests__/**/*.{test,spec}.{ts,tsx}`). Task 8'de kısa süre React Email decode için Vite plugin ekleyip sonra geri alındı (`decodeEntities` helper'a çevrildi — `src/lib/email/templates/__tests__/test-utils.ts`).
4. **tRPC export ismi `trpc`, `api` değil** — Plan'da `api.popup.submit.useMutation()` yazıyor, gerçekte `trpc.popup.submit.useMutation()`. Task 21'de EntryPopup düzeltildi. Task 22-24'te de dikkat.
5. **Inngest `functions/index.ts` barrel** — Task 10 sırasında yoktu, oluşturuldu. Hem `briefTriage` hem `popupLeadCreatedFn` export eder. Serve route (`src/app/api/webhooks/inngest/route.ts`) barrel'ı consume eder.
6. **personaLabel** helper'ı `src/lib/popup/personas.ts`'de `getPersonaLocalizedLabel(slug, locale)` olarak yaşıyor — Task 23'teki hero hem EntryPopup hem Inngest handler bunu kullanacak.
7. **React 19 text encoding** — React 19 text node'larda apostrof'u HTML entity olarak encode ediyor. Email template testleri `decodeEntities` helper'ı ile assert ediyor (`src/lib/email/templates/__tests__/test-utils.ts`).

### Non-blocking follow-up'lar (Phase 6 hardening'de toparlanacak)

- Cookie'ye `Secure` flag (prod'da)
- EntryPopup dismiss stage fidelity (mid-form dismiss → şu an stage3 olarak işaretleniyor)
- EntryPopup `as any` cast'i (discriminated union narrowing)
- Radix Dialog sr-only Title/Description şu an `stage1.*` hard-coded — stage başına güncellenebilir
- Stage3Actions `aria-label` redundant (helper text accessible name dışında kalıyor)

### Spec'te açık kararlar (Phase 6'da addressed)

- ADR-004 (1 saat booking süresi) — Task 27
- ADR-005 (quick-book guest path) — Task 28
- KVKK aydınlatma sayfası (Sanity PortableText ile güvenli render — HTML-injection yok) — Task 30
- Rate limit + retention cron — Task 31

---

## Kalan task dağılımı

| Phase | Task'lar | Durum |
|---|---|---|
| 4 — Integration | 22-24 | **Sırada (yarın başla)** |
| 5 — E2E + a11y | 25-26 | Pending |
| 6 — Docs + hardening | 27-31 | Pending |
| Final | — | `indoles-responsive-quality` skill ile 4-viewport Chrome live test + full Playwright suite |

Yaklaşık kalan: **~13 task** + final verification.

---

## Yarın başlamak için

### 1. Session'ı yeniden aç
Claude Code'u açtığında bu dosyayı ilk oku:
```
Read /Users/burakardaozgul/Documents/AA - Claude/INDOLES - Yeni/indoles-web/active_context.md
```

### 2. Durumu doğrula
```bash
cd "/Users/burakardaozgul/Documents/AA - Claude/INDOLES - Yeni/indoles-web"
git log --oneline | head -5              # Son commit f6f2762 olmalı
pnpm vitest run 2>&1 | tail -5           # 79/79
pnpm tsc --noEmit                        # Temiz
```

### 3. Subagent-driven akışa devam et
Bana söylemen yeterli: **"active_context.md'yi oku, Task 22'den Phase 4'e devam et"**

Model kuralı korundu:
- Ben (orchestrator) + reviewer'lar → **Opus**
- Implementer'lar → **Sonnet**
- Her task sonrası **2 aşamalı review** (spec + quality)
- Her faz sonrası checkpoint

### 4. Referans dosyalar
- **Plan:** `docs/superpowers/plans/2026-04-17-entry-popup-plan.md` (31 task)
- **Spec:** `docs/superpowers/specs/2026-04-17-entry-popup-design.md` (18 bölüm)
- **Proje talimatları:** `CLAUDE.md` (repo root)
- **Brainstorm session artifacts:** `.superpowers/brainstorm/` (gitignored, silinebilir)

### 5. Özel durumlar

- **Homepage hero dosyası (Task 23 blocker):** İlk iş grep ile bul. Mevcut yapı: `src/app/(marketing)/[locale]/` altında homepage `page.tsx` olabilir. `HomepageHero.tsx` component `src/components/marketing/` altında olabilir ya da inline.
- **Chatbot agent entry (Task 24 blocker):** `src/app/api/agent/` veya `src/app/api/chat/` olabilir. `src/lib/ai/` alt yapısı var. Reach out — implementer bulur.

---

## Git state

```
Branch: main
HEAD: f6f2762 feat(popup): EntryPopup container with state machine
Uncommitted: 0 (tamamı commit'li)
Remote: YOK (local-only şu an)
```

Eğer remote'a push etmek istiyorsan ayrı bir karar — şimdi gerekmiyor.

---

## Kısa cevap: yarın ne yapacağız?

**Phase 4 (Task 22-24) → Phase 5 (Task 25-26 E2E) → Phase 6 (Task 27-31 hardening + docs) → Final Chrome + Playwright verification.**

Toplamda yaklaşık 13 implementer dispatch + 26 reviewer (spec+quality per task) + ufak fix loopları. Tahmin: bir çalışma günü içinde bitirilebilir.
