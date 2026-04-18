## Simplification Migration — durum: ADR-014 tamamlandı (2026-04-18)

- Branch: `feat/simplification-migration` (main'den 48 commit ileri)
- Spec: `docs/superpowers/specs/2026-04-17-simplification-design.md`

### Tamamlandı

- Phase 0–7: Tüm simplification migration fazları (önceki session'lar)
- **ADR-014 (Dual-Persona Adaptivity):** Tüm marketing section ve page component'ları `industrial` / `commerce` persona sistemine geçirildi.
  - `usePersona` hook + `PersonaText` + `PersonaListItems` client islands
  - `messages/tr.json` + `messages/en.json` `_personas` subtree'leri eklendi
  - 14 component + 4 page wired. `hizmetler/[slug]` orta ton (ADR-014 kuralı)
  - `docs/decisions/ADR-014-full-persona-adaptivity.md` oluşturuldu
- **UX Audit 2026-04-18:** `ux-audit-2026` skill ile 3 sayfa (ana sayfa, hizmetler listesi, paketler listesi) denetlendi.
  - Sonuç: **71/100 (B grade)**
  - Rapor: `docs/ux-audit-2026-04-18.md`

### Burak'ın onayıyla yapılacak

- Phase 5.2: Vercel proje setup + env migration (interactive, Vercel account)
- Phase 8: Remote push + `gh pr create` + review + merge + prod deploy

---

## Bir Sonraki Priorite: UX Audit Düzeltmeleri

`docs/ux-audit-2026-04-18.md` dosyasındaki sprint planına göre:

### Sprint 1 — Quick Wins (< 1 hafta, ~1 gün toplam)

| # | Issue | Dosya / Konum | Effort |
|---|-------|---------------|--------|
| C1 | Skip navigation link ekle | `src/app/(marketing)/[locale]/layout.tsx` — `<body>` ilk child | XS |
| I2 | `manifest.json` oluştur | `/public/manifest.json` + root layout `<link rel="manifest">` | XS |
| I3 | `vh` → `dvh` değiştir | `grep -r "min-h-screen\|100vh"` ile bul | XS |
| I4 | `autocomplete` brief form'a ekle | `/app/brief/yeni` form inputs | XS |
| C3 | FOIC: PersonaText'e `transition-opacity` ekle | `src/components/marketing/persona-text.tsx` | S |

### Sprint 2 — Medium Impact

| # | Issue | Effort |
|---|-------|--------|
| C2 | Mobile navigation drawer | M (1-2 gün) |
| I1 | Schema.org JSON-LD (Service, Offer, Organization, BreadcrumbList) | S–M |
| I5 | Speculation Rules API | XS–S |
| I6 | Custom focus indicators | S |

---

## Teknik borçlar (önceki session'lardan devam)

- `@vitejs/plugin-react` kaldırılamadı; vitest konfig migrasyonuyla çözülür
- Design token leak 33 offender (`w-[1440px]`, hex renkler); `it.skip` ile duruyor
- Phase 5.2 + Phase 8: Vercel deploy (Burak sinyali gerekiyor)

---

## Git state

```
Branch: feat/simplification-migration
HEAD: 84cb908 feat(popup): EntryPopup persona-aware güncellemeler
Uncommitted: 0 (clean)
Remote: YOK (local-only)
Son 7 commit: ADR-014 persona sistemi + UX audit docs
```

---

## Hızlı kontrol komutları

```bash
cd "/Users/burakardaozgul/Documents/AA - Claude/INDOLES - Yeni/indoles-web"
git log --oneline | head -10
corepack pnpm tsc --noEmit
corepack pnpm vitest run 2>&1 | tail -5
```

---

## Yeni session başlatma

"active_context.md'yi oku, UX audit Sprint 1 düzeltmelerinden başla" — bu kadar yeterli.
