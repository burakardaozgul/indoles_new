# GEO Aracı UI/UX Yeniden Tasarımı — Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** GEO Görünürlük Denetleyicisi'nin sayfa üstünü tek sayfa / üç durumlu (giriş → tarama → sonuç) bir ürün yüzeyine dönüştürmek: dev giriş çubuğu, görünür tarama sahnesi, ölçekli skor kartı, ağırlıklı sinyal satırları, görünür kilit ve öncelik sıralı düzeltme listesi, skor taşıyan paylaşım kartı.

**Architecture:** Sayfa üstü tek istemci adası (`GeoTool`) durum makinesidir; alt bileşenler prop-güdümlü ve çoğu saftır. API sözleşmeleri (`/api/tools/geo-scan`, `/api/tools/geo-report`) değişmez; üç küçük arka uç dokunuşu var (`findingsCount`, `target-blocked`, `MIN_FILL_MS` dışa açma). Paylaşım sayfası aynı adayı sunucudan gelen veriyle `result` durumunda açar. OG kartları derleme zamanında Playwright ile üretilip repoya girer (Worker paketi büyümez).

**Tech Stack:** Next.js 15 App Router (RSC + istemci adaları), React 19, Tailwind v4 (`@theme` token'ları), Vitest + Testing Library (jsdom), Playwright (e2e + OG üretimi), `tsx` (script'ler), Cloudflare Workers + OpenNext.

**Spec:** `docs/superpowers/specs/2026-09-02-geo-araci-yeniden-tasarim-design.md`

## Global Constraints

- **Türkçe iletişim, İngilizce teknik terim** — kod yorumları Türkçe; değişken/tip adları İngilizce. Kod yorumlarında ve dokümanlarda emoji yok.
- **Design token disiplini** — ham hex/px/easing bileşene yazılmaz; sıra `docs/04 → tokens.ts → globals.css → bileşen`. Yeni token: `--container-tool: 760px`, `--size-scanbar: 72px`, `--size-scanbar-mobile: 60px`, `--shadow-float`. Süreler `anim-config.ts`'te: `TOOL_SCAN = { enterStaggerMs: 400, resolveStaggerMs: 150, morphMs: 500 }`, `TOOL_SCORE = { countMs: 800 }`.
- **Light zeminde birincil aksiyon siyahtır** (`.btn .btn-primary`, docs/04 §3). `Button` bileşeninin `primary` varyantı (teal) araç yüzeyinde kullanılmaz.
- **Bulgu metni mail kapısının arkasında** — public yüzeyler (`geo-scan` yanıtı, paylaşım sayfası) `stripFindings`ten geçer; yalnız `findingsCount` sayısı public'tir.
- **Yanıt gelmeden hiçbir tarama satırı sonuç göstermez** — tarama sahnesi sahte veri üretmez.
- **`prefers-reduced-motion`** — her animasyon (kadans, sayaç, çubuk dolgusu, kaydırma) `usePrefersReducedMotion()` (`src/lib/v2/use-mouse.ts`) ile kapatılır.
- **Erişilebilirlik** — tam olarak bir `h1`; her etkileşimli öğe klavye erişilebilir, `aria-label`/`aria-busy`/`aria-live` belirtildiği gibi; dokunma hedefi ≥ 44 px.
- **Kopya kuralları** — TR/EN parite (typecheck + testler); EN İngiliz imlası (`en-spelling.test.ts`); ünlem yok, hype yok; `keyword-coverage.test.ts` `TARGETS_TOOLS` çiftleri ("geo denetimi", "ai görünürlük testi", "llms txt kontrolü") `toolSurface` yüzeyinde kalır.
- **Motor mantığı değişmez** — `src/lib/tools/geo/*` içinde yalnız metin sabitleri ve `findingsCount` alanı değişir; puan/eşik/durum hesabı aynı kalır.
- **Worker paketi < 3 MB gzip** — runtime'a yeni bağımlılık eklenmez; OG üretimi build-time script'tir.
- **Kapılar (her görev sonunda ilgili olanlar, Görev 13'te hepsi):** `pnpm typecheck` · `pnpm test` · `pnpm build && pnpm seo:audit` (0 FAIL) · `pnpm cf:build` sonrası gzip boyutu.
- **Commit** — her görev kendi commit'iyle biter; mesaj `<type>(tools): …` biçiminde, sonunda `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.
- **Worktree** — tüm komutlar `indoles-web/.claude/worktrees/geo-araci` içinden çalışır; `git stash` kullanılmaz.

---

## Dosya yapısı

| Dosya | Sorumluluk | Görev |
|---|---|---|
| `src/lib/tools/geo/types.ts` | `BAND_THRESHOLDS`, `BAND_ORDER`, `findingsCount?` | 1 |
| `src/lib/tools/geo/findings.ts` | `stripFindings` sayıyı korur | 1 |
| `src/lib/tools/geo/engine.ts` | `findingsCount` doldurur | 1 |
| `src/lib/security/anti-spam.ts` | `MIN_FILL_MS` export | 1 |
| `src/lib/design/tokens.ts`, `src/styles/globals.css`, `src/styles/v2.css`, `src/lib/v2/anim-config.ts`, `docs/04` §5 | token, sınıf, süre | 2 |
| `src/lib/tools/geo/{ai-access,llms-txt,json-ld,lang-signals,question-h2}.ts` | metin sabitleri | 3 |
| `src/lib/content/tools.ts`, `src/components/tools/copy.ts` | içerik + UI kopyası | 4 |
| `src/components/tools/band-scale.tsx`, `score-card.tsx` | ölçek + skor kartı | 5 |
| `src/components/tools/signal-rows.tsx` | sinyal satırları | 6 |
| `src/components/tools/scan-bar.tsx` | giriş çubuğu + anti-spam | 7 |
| `src/components/tools/scan-stage.tsx` | tarama sahnesi | 8 |
| `src/components/tools/report-gate.tsx`, `findings-list.tsx` | kilit + düzeltme listesi | 9 |
| `src/components/tools/geo-tool.tsx`, `tool-hero.tsx`, `araclar/geo-gorunurluk-denetleyicisi/page.tsx` | durum makinesi + sayfa | 10 |
| `araclar/.../sonuc/[id]/page.tsx`, `araclar/page.tsx`, `src/lib/popup/popup-context.tsx`, `src/lib/tools/geo/safe-fetch.ts`, `src/app/api/tools/geo-scan/route.ts` | paylaşım, dizin, popup, engellenen site | 11 |
| `scripts/generate-og-geo.ts`, `scripts/og/geo-card.tsx`, `public/og/geo/**`, `src/lib/seo/metadata.ts`, `docs/decisions/ADR-031-*.md`, `docs/08` | OG kartları | 12 |
| `tests/e2e/geo-tool.spec.ts`, `tests/e2e/no-horizontal-overflow.spec.ts`, docs senkronu | e2e + görsel tur + dokümanlar | 13 |

Silinenler (Görev 10): `src/components/tools/geo-scan-form.tsx`, `geo-result.tsx`, `geo-report-form.tsx`, `src/components/tools/__tests__/geo-report-form.test.tsx`, `tests/unit/tools-geo/geo-scan-form.test.tsx`, `tests/unit/tools-geo/geo-result.test.tsx`.

---

### Task 1: Veri sözleşmesi — bant eşikleri, `findingsCount`, `MIN_FILL_MS`

**Files:**
- Modify: `src/lib/tools/geo/types.ts`
- Modify: `src/lib/tools/geo/findings.ts`
- Modify: `src/lib/tools/geo/engine.ts`
- Modify: `src/lib/security/anti-spam.ts:24`
- Test: `tests/unit/tools-geo/types.test.ts`, `src/lib/tools/geo/__tests__/findings.test.ts`, `tests/unit/tools-geo/engine.test.ts`

**Interfaces:**
- Produces: `BAND_THRESHOLDS: { readonly "gelismeye-acik": 40; readonly iyi: 70; readonly oncu: 90 }`, `BAND_ORDER: readonly GeoBand[]` (`["zayif","gelismeye-acik","iyi","oncu"]`), `GeoCheckResult.findingsCount?: number`, `stripFindings(checks): GeoCheckResult[]` (her öğede `findings: []`, `findingsCount` dolu), `MIN_FILL_MS = 2000` (named export).

- [ ] **Step 1: Başarısız testleri yaz**

`tests/unit/tools-geo/types.test.ts` dosyasının sonuna ekle:

```ts
import { BAND_ORDER, BAND_THRESHOLDS, bandFor } from "@/lib/tools/geo/types";

describe("BAND_THRESHOLDS — bandFor ile tek kaynak", () => {
  it("eşikler sıralı ve bandFor ile tutarlı", () => {
    expect(BAND_ORDER).toEqual(["zayif", "gelismeye-acik", "iyi", "oncu"]);
    expect(bandFor(BAND_THRESHOLDS["gelismeye-acik"] - 1)).toBe("zayif");
    expect(bandFor(BAND_THRESHOLDS["gelismeye-acik"])).toBe("gelismeye-acik");
    expect(bandFor(BAND_THRESHOLDS.iyi - 1)).toBe("gelismeye-acik");
    expect(bandFor(BAND_THRESHOLDS.iyi)).toBe("iyi");
    expect(bandFor(BAND_THRESHOLDS.oncu - 1)).toBe("iyi");
    expect(bandFor(BAND_THRESHOLDS.oncu)).toBe("oncu");
    expect(bandFor(100)).toBe("oncu");
  });
});
```

`src/lib/tools/geo/__tests__/findings.test.ts` içindeki `describe` bloğuna ekle:

```ts
  it("findings boşalır ama findingsCount SAYIYI korur (kilit önizlemesi)", () => {
    const result = stripFindings(checks);
    expect(result[0]?.findings).toEqual([]);
    expect(result[0]?.findingsCount).toBe(1);
    expect(result[1]?.findingsCount).toBe(0);
  });

  it("kayıt zaten findingsCount taşıyorsa (D1 eski kayıt: taşımaz) findings.length'ten türetir", () => {
    const legacy: GeoCheckResult[] = [{ ...checks[0]!, findingsCount: undefined }];
    expect(stripFindings(legacy)[0]?.findingsCount).toBe(1);
  });
```

`tests/unit/tools-geo/engine.test.ts` içindeki mevcut `describe` bloğuna ekle (dosyadaki `runGeoScan` çağrı desenini kullan — `r` mevcut sonucu tutan değişken adıdır; dosyada farklıysa o adı kullan):

```ts
  it("her check findingsCount taşır ve findings.length ile eşittir", () => {
    for (const c of r.checks) {
      expect(c.findingsCount).toBe(c.findings.length);
    }
  });
```

- [ ] **Step 2: Testleri çalıştır, başarısız olduklarını gör**

Run: `pnpm vitest run tests/unit/tools-geo/types.test.ts src/lib/tools/geo/__tests__/findings.test.ts tests/unit/tools-geo/engine.test.ts`
Expected: FAIL — `BAND_THRESHOLDS` export yok; `findingsCount` `undefined`.

- [ ] **Step 3: `types.ts` — eşikler ve alan**

`bandFor` fonksiyonunu ve `GeoCheckResult`'ı şu şekilde değiştir:

```ts
export type GeoCheckResult = {
  id: GeoCheckId;
  score: number;
  max: number;
  status: GeoCheckStatus;
  summary: Localized<string>;
  findings: Array<Localized<string>>;
  /**
   * `findings.length` — public yüzeyde (`stripFindings` sonrası) metin
   * silinir ama SAYI kalır: kilit kartı "n bulgu" önizlemesi için. İsteğe
   * bağlı: D1'deki eski kayıtlar alanı taşımaz; `stripFindings` o durumda
   * `findings.length`ten türetir.
   */
  findingsCount?: number;
};

/** Bant sırası — ölçek ve OG kartı bu sırayla çizer. */
export const BAND_ORDER: readonly GeoBand[] = ["zayif", "gelismeye-acik", "iyi", "oncu"];

/**
 * Bant alt eşikleri (dahil). `zayif` 0'dan başlar. `bandFor`, ölçek
 * (`BandScale`) ve OG şablonu TEK kaynaktan okur — eşik burada değişirse
 * hepsi birlikte değişir.
 */
export const BAND_THRESHOLDS = {
  "gelismeye-acik": 40,
  iyi: 70,
  oncu: 90,
} as const;

export function bandFor(total: number): GeoBand {
  if (total < BAND_THRESHOLDS["gelismeye-acik"]) return "zayif";
  if (total < BAND_THRESHOLDS.iyi) return "gelismeye-acik";
  if (total < BAND_THRESHOLDS.oncu) return "iyi";
  return "oncu";
}
```

- [ ] **Step 4: `findings.ts` ve `engine.ts`**

`findings.ts`:

```ts
export function stripFindings(checks: GeoCheckResult[]): GeoCheckResult[] {
  return checks.map((check) => ({
    ...check,
    findings: [],
    findingsCount: check.findingsCount ?? check.findings.length,
  }));
}
```

`engine.ts` içinde `const checks = [...]` satırından sonra, `totalScore` hesabından önce:

```ts
  // Public yüzey findings metnini siler (stripFindings) ama sayı kalır —
  // motor sayıyı burada, kaynağında doldurur.
  const checks = rawChecks.map((check) => ({ ...check, findingsCount: check.findings.length }));
```

(Mevcut diziyi `const rawChecks = [ ... ]` olarak yeniden adlandır.)

- [ ] **Step 5: `anti-spam.ts` — sabiti dışa aç**

`const MIN_FILL_MS = 2000;` satırını `export const MIN_FILL_MS = 2000;` yap ve üstündeki yorum bloğuna ekle: "İstemci (`ScanBar`) aynı sabiti okuyup gönderimi bu süreye kadar bekletir — tuzak bozulmaz, hızlı insan hata görmez."

- [ ] **Step 6: Testleri çalıştır**

Run: `pnpm vitest run tests/unit/tools-geo src/lib/tools/geo && pnpm typecheck`
Expected: PASS (mevcut fixture'lar `findingsCount` olmadan da geçer — alan isteğe bağlı).

- [ ] **Step 7: Commit**

```bash
git add src/lib/tools/geo/types.ts src/lib/tools/geo/findings.ts src/lib/tools/geo/engine.ts src/lib/security/anti-spam.ts tests/unit/tools-geo/types.test.ts tests/unit/tools-geo/engine.test.ts src/lib/tools/geo/__tests__/findings.test.ts
git commit -m "feat(tools): bant eşikleri tek kaynak, findingsCount public sayı, MIN_FILL_MS export"
```

---

### Task 2: Design token'ları, CSS sınıfları, motion blokları

**Files:**
- Modify: `src/lib/design/tokens.ts` (`shadow`, `containers`, yeni `controls`)
- Modify: `src/styles/globals.css` (`@theme` bloğu: container, elevation, yeni size)
- Modify: `src/styles/v2.css` (`.tool-hero` bloğu + yeni `.scan-bar`, `.tool-stage`, `.signal-row`, `.gate-skeleton` sınıfları)
- Modify: `src/lib/v2/anim-config.ts` (`BLOB_TOOL_HERO`, yeni `TOOL_SCAN`, `TOOL_SCORE`)
- Modify: `docs/04-design-system-principles.md` §5 Elevation tablosu
- Test: `tests/unit/tool-design-tokens.test.ts` (yeni)

**Interfaces:**
- Produces: CSS değişkenleri `--container-tool`, `--size-scanbar`, `--size-scanbar-mobile`, `--shadow-float`; Tailwind utility'leri `max-w-tool` (container), `shadow-float`; sınıflar `.scan-bar`, `.scan-bar-input`, `.scan-bar-submit`, `.tool-stage`, `.tool-stage-row`, `.signal-row`, `.signal-bar`, `.signal-bar-fill`, `.gate-skeleton`; `TOOL_SCAN`, `TOOL_SCORE` sabitleri.

- [ ] **Step 1: Başarısız testi yaz**

`tests/unit/tool-design-tokens.test.ts`:

```ts
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { containers, controls, shadow } from "@/lib/design/tokens";
import { TOOL_SCAN, TOOL_SCORE } from "@/lib/v2/anim-config";

/**
 * Araç yüzeyi token'ları — `tokens.ts` ↔ `globals.css` @theme senkronu.
 * Değişiklik sırası docs/04 §11: docs → tokens.ts → globals.css → bileşen.
 */
const css = readFileSync(path.join(process.cwd(), "src/styles/globals.css"), "utf8");

describe("araç yüzeyi token'ları", () => {
  it("container ve size token'ları globals.css'te aynı değerle var", () => {
    expect(css).toContain(`--container-tool: ${containers.tool};`);
    expect(css).toContain(`--size-scanbar: ${controls.scanBar};`);
    expect(css).toContain(`--size-scanbar-mobile: ${controls.scanBarMobile};`);
  });

  it("shadow-float çok katmanlı ve teal tonlu", () => {
    expect(css).toContain("--shadow-float:");
    expect(shadow.float.split(",").length).toBeGreaterThanOrEqual(3);
    expect(shadow.float).toContain("44,85,102");
  });

  it("tarama ve skor süreleri anim-config'te", () => {
    expect(TOOL_SCAN).toEqual({ enterStaggerMs: 400, resolveStaggerMs: 150, morphMs: 500 });
    expect(TOOL_SCORE).toEqual({ countMs: 800 });
  });
});
```

- [ ] **Step 2: Çalıştır, başarısız gör**

Run: `pnpm vitest run tests/unit/tool-design-tokens.test.ts`
Expected: FAIL — `containers.tool`, `controls`, `shadow.float`, `TOOL_SCAN` yok.

- [ ] **Step 3: `tokens.ts`**

`shadow` objesine (`'3d'` satırından sonra):

```ts
  /** Yüzen kontrol (araç giriş çubuğu): kontak + iki ambient katman, kremden ayrılır ama modal gibi kalkmaz */
  float: '0 1px 2px rgba(15,28,35,.06), 0 12px 32px -8px rgba(15,28,35,.14), 0 24px 56px -16px rgba(44,85,102,.22)',
```

`containers` objesine:

```ts
  /** Araç sayfası kolonu — ortalı ürün yüzeyi (docs/04 §12.10 araç istisnası) */
  tool: '760px',
```

`containers`'dan sonra yeni blok:

```ts
/** Kontrol yükseklikleri — araç giriş çubuğu (docs/04 §12.10) */
export const controls = {
  scanBar: '72px',
  scanBarMobile: '60px',
} as const;
```

`tokens` toplama objesine `controls` ekle.

- [ ] **Step 4: `globals.css` @theme**

Container bloğuna `--container-tool: 760px;`; elevation bloğuna `--shadow-float: 0 1px 2px rgba(15, 28, 35, 0.06), 0 12px 32px -8px rgba(15, 28, 35, 0.14), 0 24px 56px -16px rgba(44, 85, 102, 0.22);`; container bloğundan sonra yeni bölüm:

```css
  /* --- Kontrol boyutları (araç yüzeyi) ---------------------------------- */
  --size-scanbar: 72px;
  --size-scanbar-mobile: 60px;
```

Testin `toContain` dizgeleri tam eşleşir: `--container-tool: 760px;` / `--size-scanbar: 72px;` / `--size-scanbar-mobile: 60px;`.

- [ ] **Step 5: `v2.css` — araç sınıfları**

Mevcut `.tool-hero` bloğunu şu şekilde değiştir ve altına yenilerini ekle:

```css
/* ============================================================================
   Araç yüzeyi (docs/04 §12.10 araç istisnası + spec 2026-09-02)
   Ortalı ürün kompozisyonu: hero metni, giriş çubuğu, tarama sahnesi ve skor
   kartı aynı 760px kolonda. Blob (z-10) çubuğun arkasında; metin z-20.
   ============================================================================ */
.tool-hero {
  position: relative;
  z-index: 20;
  padding-top: clamp(96px, 12vw, 160px);
  text-align: center;
}
.tool-hero .eyebrow { justify-content: center; }

.scan-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  height: var(--size-scanbar);
  padding: 8px 8px 8px 24px;
  border-radius: 999px;
  background: var(--color-bg-pure);
  border: 1px solid var(--color-ink-200);
  box-shadow: var(--shadow-float);
  transition: box-shadow 0.4s var(--ease-out), border-color 0.4s var(--ease-out);
}
.scan-bar:focus-within { border-color: var(--color-teal-500); }
.scan-bar[data-invalid="true"] { border-color: var(--color-danger-500); }
.scan-bar-input {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: 0;
  background: transparent;
  font-family: var(--font-body);
  font-size: 18px;
  color: var(--color-ink-900);
}
.scan-bar-input::placeholder { color: var(--color-ink-400); }
.scan-bar-input:focus { outline: none; }
.scan-bar-submit { height: 100%; border-radius: 999px; }
@media (max-width: 767px) {
  .scan-bar { height: var(--size-scanbar-mobile); padding-left: 18px; }
  .scan-bar-input { font-size: 16px; }
  .scan-bar-submit { width: 44px; padding: 0; justify-content: center; }
  .scan-bar-submit .scan-bar-submit-label { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
}

.tool-stage { display: flex; flex-direction: column; gap: 10px; text-align: left; }
.tool-stage-row {
  display: grid;
  grid-template-columns: 20px 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-radius: var(--radius-xl);
  background: rgb(255 255 255 / 0.55);
  border: 1px solid rgb(255 255 255 / 0.6);
  color: var(--color-ink-500);
  transition: color 0.4s var(--ease-out), background 0.4s var(--ease-out);
}
.tool-stage-row[data-state="reading"] { color: var(--color-ink-900); }
.tool-stage-row[data-state="done"] { color: var(--color-ink-900); background: rgb(255 255 255 / 0.8); }
.tool-stage-dot {
  width: 10px; height: 10px; border-radius: 999px;
  border: 1.5px solid currentColor; background: transparent;
}
.tool-stage-row[data-state="reading"] .tool-stage-dot { background: var(--color-teal-700); border-color: var(--color-teal-700); animation: tool-stage-pulse 1s ease-in-out infinite; }
.tool-stage-row[data-state="done"] .tool-stage-dot { background: currentColor; }
@keyframes tool-stage-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
@media (prefers-reduced-motion: reduce) {
  .tool-stage-row[data-state="reading"] .tool-stage-dot { animation: none; }
}

.signal-row {
  display: grid;
  grid-template-columns: minmax(140px, 200px) 1fr auto auto;
  align-items: center;
  gap: 16px;
  min-height: 44px;
  padding: 12px 0;
  border-top: 1px solid var(--color-ink-100);
  text-align: left;
}
.signal-row:first-child { border-top: 0; }
.signal-bar { height: 8px; border-radius: 999px; background: var(--color-ink-100); overflow: hidden; }
.signal-bar-fill {
  height: 100%; border-radius: inherit;
  width: var(--fill, 0%);
  transition: width var(--tool-count-ms, 800ms) var(--ease-out);
}
@media (prefers-reduced-motion: reduce) { .signal-bar-fill { transition: none; } }
@media (max-width: 767px) {
  .signal-row { grid-template-columns: 1fr auto; grid-template-areas: "name status" "bar bar" "points points"; }
  .signal-row > [data-part="name"] { grid-area: name; }
  .signal-row > [data-part="bar"] { grid-area: bar; }
  .signal-row > [data-part="points"] { grid-area: points; }
  .signal-row > [data-part="status"] { grid-area: status; }
}

.gate-skeleton {
  height: 10px; border-radius: 999px;
  background: linear-gradient(90deg, var(--color-ink-100), var(--color-ink-200), var(--color-ink-100));
  background-size: 200% 100%;
  animation: gate-shimmer 2.4s linear infinite;
}
@keyframes gate-shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
@media (prefers-reduced-motion: reduce) { .gate-skeleton { animation: none; } }
```

- [ ] **Step 6: `anim-config.ts`**

`BLOB_TOOL_HERO` içinde `y: -0.12` → `y: -0.28`, `opacity: 0.55` → `opacity: 0.85`; yorumları güncelle: "Çekirdek giriş çubuğunun arkasında ('camın altındaki küre'); başlık ve lede yumuşak üst kenarın üstünde. 0.85 ölçümle doğrulanır (Görev 13, docs/04 §12.10 protokolü)". `mobile.opacity` 0.4 → 0.55. `BLOB_TOOL_HERO`'dan sonra ekle:

```ts
/**
 * Tarama sahnesi kadansı (spec §4). Satırlar `enterStaggerMs` arayla
 * "okunuyor"a girer; yanıt gelince `resolveStaggerMs` arayla çözülür; sahne
 * `morphMs`te skor kartına dönüşür. Yanıt gelmeden hiçbir satır sonuç
 * göstermez — bu sayılar sahte ilerleme değil, gerçek sonucun ritmidir.
 * `prefers-reduced-motion`: hepsi 0 sayılır.
 */
export const TOOL_SCAN = {
  enterStaggerMs: 400,
  resolveStaggerMs: 150,
  morphMs: 500,
} as const;

/** Skor sayacı ve sinyal çubuğu dolgusu — aynı sürede biter. */
export const TOOL_SCORE = {
  countMs: 800,
} as const;
```

- [ ] **Step 7: docs/04 §5 Elevation tablosuna satır**

`| shadow-3d | ... |` satırından sonra: `| \`shadow-float\` | Yüzen kontrol — araç giriş çubuğu; kontak + iki ambient katman, modal kadar kalkmaz |`

- [ ] **Step 8: Testleri çalıştır**

Run: `pnpm vitest run tests/unit/tool-design-tokens.test.ts && pnpm typecheck && pnpm exec next build --no-lint 2>&1 | tail -3`
Expected: test PASS; build başarılı (CSS söz dizimi hatası yok). Build 2-3 dk sürer; CSS'i hızlı doğrulamak için `pnpm vitest run tests/unit/tool-design-tokens.test.ts` yeterli, build Görev 13'te zorunlu.

- [ ] **Step 9: Commit**

```bash
git add src/lib/design/tokens.ts src/styles/globals.css src/styles/v2.css src/lib/v2/anim-config.ts docs/04-design-system-principles.md tests/unit/tool-design-tokens.test.ts
git commit -m "feat(design): araç yüzeyi token'ları, scan-bar/stage/signal-row sınıfları, TOOL_SCAN ve TOOL_SCORE"
```

---

### Task 3: Motor metin sabitleri — kullanıcı diline çeviri

**Files:**
- Modify: `src/lib/tools/geo/ai-access.ts`, `llms-txt.ts`, `json-ld.ts`, `lang-signals.ts`, `question-h2.ts` (yalnız `tr`/`en` dizgeleri)
- Test: `tests/unit/tools-geo/copy-rules.test.ts` (yeni); mevcut motor testleri (metin assert'i yok, geçmeye devam eder); `tests/unit/en-spelling.test.ts` (geçmeli)

**Interfaces:**
- Consumes: `checkAiAccess(robotsTxt, urlPath)`, `checkLlmsTxt(llmsTxt)`, `checkJsonLd(pageHtml)`, `checkLangSignals(pageHtml, url)`, `checkQuestionH2(pageHtml)` — imzalar değişmez.
- Produces: Aynı imzalar; `summary` tek cümle (TR ≤ 22, EN ≤ 26 kelime), `findings` "ne eksik + neden önemli" tek cümle; hiçbir dizge "Doküman:"/"Document:" ile başlamaz; `summary` içinde `n/m` puan parçası yok.

- [ ] **Step 1: Kural testini yaz**

`tests/unit/tools-geo/copy-rules.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { checkAiAccess } from "@/lib/tools/geo/ai-access";
import { checkLlmsTxt } from "@/lib/tools/geo/llms-txt";
import { checkJsonLd } from "@/lib/tools/geo/json-ld";
import { checkLangSignals } from "@/lib/tools/geo/lang-signals";
import { checkQuestionH2 } from "@/lib/tools/geo/question-h2";
import type { GeoCheckResult } from "@/lib/tools/geo/types";

/**
 * Motor metinleri kullanıcıya konuşur (spec §8): kaynak öneki yok, puan
 * parçası yok, tek cümle. Fixture'lar her kalemin pass / partial / fail
 * dallarını gezer ki HER dizge kurala girsin.
 */
const HTML_EMPTY = "<html><body><p>merhaba</p></body></html>";
const HTML_RICH = `<html lang="tr"><head>
<link rel="canonical" href="https://ornek.com.tr/">
<link rel="alternate" hreflang="tr" href="https://ornek.com.tr/tr">
<link rel="alternate" hreflang="en" href="https://ornek.com.tr/en">
<link rel="alternate" hreflang="x-default" href="https://ornek.com.tr/">
<script type="application/ld+json">{"@type":"Organization","name":"X"}</script>
<script type="application/ld+json">{"@type":"FAQPage"}</script>
</head><body><h2>Neden?</h2><h2>Nasıl?</h2><h2>Ne zaman?</h2><details></details></body></html>`;
const HTML_BROKEN_LD = `<html><head><script type="application/ld+json">{bozuk</script></head><body><h2>Başlık</h2><h2>Neden?</h2></body></html>`;

const results: GeoCheckResult[] = [
  checkAiAccess(null, "/"),
  checkAiAccess("User-agent: GPTBot\nDisallow: /\n", "/"),
  checkAiAccess("User-agent: *\nAllow: /\n", "/"),
  checkLlmsTxt(null),
  checkLlmsTxt("# Site\nSadece metin"),
  checkLlmsTxt("# Site\n- [Ana sayfa](https://ornek.com.tr): özet"),
  checkJsonLd(HTML_EMPTY),
  checkJsonLd(HTML_RICH),
  checkJsonLd(HTML_BROKEN_LD),
  checkLangSignals(HTML_EMPTY, "https://ornek.com.tr/"),
  checkLangSignals(HTML_RICH, "https://ornek.com.tr/"),
  checkQuestionH2(HTML_EMPTY),
  checkQuestionH2(HTML_RICH),
  checkQuestionH2(HTML_BROKEN_LD),
];

const words = (s: string): number => s.trim().split(/\s+/).length;
const sentences = (s: string): number => (s.match(/[.!?](\s|$)/g) ?? []).length;

describe("motor metin kuralları (spec §8)", () => {
  it.each(results.map((r) => [r.id, r] as const))("%s — özet ve bulgular kullanıcı dilinde", (_id, r) => {
    for (const loc of ["tr", "en"] as const) {
      const s = r.summary[loc];
      expect(s, `${r.id}/${loc} özet önek`).not.toMatch(/^(Doküman|Document|Sayfa|Page):/);
      expect(s, `${r.id}/${loc} özet puan parçası`).not.toMatch(/\b\d+\s*\/\s*\d+\b/);
      expect(sentences(s), `${r.id}/${loc} özet tek cümle`).toBe(1);
      expect(words(s), `${r.id}/${loc} özet uzunluk`).toBeLessThanOrEqual(loc === "tr" ? 22 : 26);
      for (const f of r.findings) {
        expect(f[loc], `${r.id}/${loc} bulgu önek`).not.toMatch(/^(Doküman|Document|Sayfa|Page):/);
        expect(sentences(f[loc]), `${r.id}/${loc} bulgu tek cümle`).toBe(1);
        expect(f[loc].trim().length, `${r.id}/${loc} bulgu boş`).toBeGreaterThan(20);
      }
    }
  });
});
```

- [ ] **Step 2: Çalıştır, başarısız gör**

Run: `pnpm vitest run tests/unit/tools-geo/copy-rules.test.ts`
Expected: FAIL — "Doküman:" önekleri, `0/15` parçaları, `question-h2` özeti 2 cümle.

- [ ] **Step 3: Dizgeleri değiştir**

`ai-access.ts`:
- robots yok özeti: TR `robots.txt yok; bu, bütün AI botlarına açık erişim demektir.` EN `There is no robots.txt, which means every AI bot may read this page.`
- robots yok bulgusu: TR `Erişim açık ama beyansız: botlara yönelik niyetinizi bir robots.txt ile belgelemeniz güven verir.` EN `Access is open but undeclared; stating your intent toward crawlers in a robots.txt builds trust.`
- sayısal özet: TR `` `${AI_CRAWLERS.length} bilinen AI botundan ${allowedCount} tanesi bu sayfayı okuyabiliyor${blockedSuffixTr}.` `` EN `` `${allowedCount} of ${AI_CRAWLERS.length} known AI bots can read this page${blockedSuffixEn}.` `` — `blockedSuffixTr` `; ${blocked.join(", ")} engelli` biçimi kalır.
- engelli bulgusu: TR `` `${blocked.join(", ")} engelli; bu motorlar sayfanızı alıntı için kullanamaz.` `` EN `` `${blocked.join(", ")} blocked; these engines cannot use your page for citations.` ``

`llms-txt.ts`:
- yok özeti: TR `llms.txt bulunamadı; cevap motorlarına hangi içeriğin öncelikli olduğunu söyleyen dosya yok.` EN `No llms.txt was found; nothing tells answer engines which content matters most.`
- yok bulgusu: TR `Site kökünde llms.txt yok; öncelikli sayfaları ve özetleri işaret eden kısa bir markdown dosyası ekleyin.` EN `There is no llms.txt at the site root; add a short markdown file that points to your key pages and summaries.`
- tam özeti: TR `llms.txt bulundu ve biçimli markdown bağlantılar içeriyor.` EN `llms.txt was found and contains well-formed markdown links.`
- tam bulgusu: TR `Cevap motorlarına yönelik niyet belgelenmiş; dosyayı yeni içerikle güncel tutun.` EN `Your intent toward answer engines is documented; keep the file current as content changes.`
- biçimsiz özeti: TR `llms.txt bulundu ama markdown bağlantı satırı içermiyor.` EN `llms.txt was found but contains no markdown link lines.`
- biçimsiz bulgusu: TR `Dosyada metin var ama bağlantı biçimi eksik; her sayfayı "- [Başlık](URL): özet" satırıyla listeleyin.` EN `The file has text but no link format; list each page as "- [Title](URL): summary".`

`json-ld.ts`:
- blok yok özeti: TR `Sayfada JSON-LD bloğu yok; cevap motorları için yapısal veri bulunmuyor.` EN `The page has no JSON-LD block, so answer engines find no structured data.`
- blok yok bulgusu: TR `JSON-LD şeması yok; Organization ve Article gibi tanınan türler makine tarafından okunamıyor.` EN `No JSON-LD schema exists; recognised types such as Organization and Article cannot be read by machines.`
- geçerli özet: TR `` `Sayfada ${validBlocks.length} geçerli JSON-LD bloğu var${typeList ? `; tanınan tipler: ${typeList}` : ""}${hasFaq ? "; FAQPage şeması mevcut" : ""}.` `` EN `` `The page has ${validBlocks.length} valid JSON-LD block(s)${typeList ? `; recognised types: ${typeList}` : ""}${hasFaq ? "; FAQPage schema present" : ""}.` ``
- çözümlenemedi özeti: TR `Sayfadaki JSON-LD blokları çözümlenemedi; geçerli yapısal veri yok.` EN `The JSON-LD blocks on the page could not be parsed; no valid structured data exists.`
- bozuk bulgusu: TR `` `${brokenCount} JSON-LD bloğu geçersiz söz dizimi yüzünden çözümlenemiyor; bloğu bir JSON doğrulayıcıdan geçirin.` `` EN `` `${brokenCount} JSON-LD block(s) fail to parse because of invalid syntax; run the block through a JSON validator.` ``
- tanınan tür yok bulgusu: TR `Bloklarda tanınan bir @type yok; Organization, WebPage veya Article gibi bir tür ekleyin.` EN `The blocks carry no recognised @type; add a type such as Organization, WebPage or Article.`

`lang-signals.ts`:
- tek dilli bulgusu: TR `Tek dilli site; hreflang beklenmedi ve puan 10 üzerinden ölçülüp 15'e ölçeklendi.` EN `Single-language site; hreflang was not expected and the score was measured out of 10 and scaled to 15.`
- lang bulgusu: TR `html etiketinde lang özniteliği yok; motorlar sayfanın dilini tahmin etmek zorunda kalıyor.` EN `The html tag has no lang attribute, so engines must guess the page language.`
- canonical bulgusu: TR `Canonical bağlantı yok veya girilen adresle eşleşmiyor; motor hangi sürümün asıl olduğunu bilemiyor.` EN `The canonical link is missing or does not match the entered address, so engines cannot tell which version is primary.`
- hreflang bulgusu: TR `hreflang seti eksik; en az iki dil ve x-default gerekir.` EN `The hreflang set is incomplete; at least two languages and x-default are required.`
- özet: TR `` `html lang ${langOk ? "var" : "yok"}, canonical ${canonicalOk ? "eşleşiyor" : "eşleşmiyor"}, hreflang ${hreflangStateTr}.` `` EN `` `html lang ${langOk ? "present" : "missing"}, canonical ${canonicalOk ? "matches" : "does not match"}, hreflang ${hreflangStateEn}.` ``

`question-h2.ts`:
- H2 yok bulgusu: TR `Sayfada hiç H2 başlığı yok; soru odaklı yapı ölçülemedi.` EN `The page has no H2 headings, so question-oriented structure could not be measured.`
- oran bulgusu: TR `H2 başlıklarının yarısından azı soru biçiminde; motorlar soru başlığını doğrudan alıntılar.` EN `Fewer than half of the H2 headings are questions; engines quote question headings directly.`
- görünür SSS bulgusu: TR `Görünür bir soru-cevap yapısı yok; FAQPage şeması, details ögesi veya en az üç soru başlığı ekleyin.` EN `There is no visible question-and-answer structure; add a FAQPage schema, a details element or at least three question headings.`
- özet (tek cümle, puan parçası yok): şu ifadelerden seç:
  ```ts
  const ratioOk = ratioScore === RATIO_MAX_SCORE;
  const summary: Localized<string> = {
    tr: ratioOk && visibleQaPresent
      ? "Başlıkların çoğu soru biçiminde ve görünür bir soru-cevap bloğu var."
      : ratioOk
        ? "Başlıkların çoğu soru biçiminde ama görünür bir soru-cevap bloğu yok."
        : visibleQaPresent
          ? "Görünür bir soru-cevap bloğu var ama başlıkların çoğu soru biçiminde değil."
          : "Başlıkların çoğu soru biçiminde değil ve görünür bir soru-cevap bloğu yok.",
    en: ratioOk && visibleQaPresent
      ? "Most headings are questions and a visible question-and-answer block exists."
      : ratioOk
        ? "Most headings are questions but there is no visible question-and-answer block."
        : visibleQaPresent
          ? "A visible question-and-answer block exists but most headings are not questions."
          : "Most headings are not questions and there is no visible question-and-answer block.",
  };
  ```

- [ ] **Step 4: Testleri çalıştır**

Run: `pnpm vitest run tests/unit/tools-geo tests/unit/en-spelling.test.ts src/lib/tools/geo`
Expected: PASS. `en-spelling` bir ABD imlası yakalarsa (ör. `recognized`) İngiliz imlasına çevir (`recognised`).

- [ ] **Step 5: Commit**

```bash
git add src/lib/tools/geo/ai-access.ts src/lib/tools/geo/llms-txt.ts src/lib/tools/geo/json-ld.ts src/lib/tools/geo/lang-signals.ts src/lib/tools/geo/question-h2.ts tests/unit/tools-geo/copy-rules.test.ts
git commit -m "refactor(tools): motor özet ve bulgu metinleri kullanıcı dilinde — önek ve puan parçası yok"
```

---

### Task 4: İçerik katmanı — `tools.ts` alanları ve `copy.ts` UI kopyası

**Files:**
- Modify: `src/lib/content/tools.ts` (`ToolContent` tipi + `TOOLS[0]`)
- Create: `src/components/tools/copy.ts`
- Modify: `tests/unit/tools-content.test.ts:41-45` (SSS sayısı ≥ 6)
- Test: `tests/unit/tools-geo/copy.test.ts` (yeni), `tests/unit/tools-content.test.ts`, `tests/unit/keyword-coverage.test.ts`

**Interfaces:**
- Produces (`tools.ts`): `ToolContent.bands: Record<GeoBand, Localized<string>>`, `ToolContent.proof: Array<Localized<string>>` (4 öğe), `ToolContent.inputHelp: Localized<string>`; `lede` tek cümle; `faq` 7 öğe.
- Produces (`copy.ts`): `TOOL_UI: Record<Locale, ToolUiCopy>`, `type ToolUiCopy`, `type ScanErrorKind = "invalidUrl" | "rateLimited" | "unreachable" | "blocked" | "turnstile" | "unavailable" | "generic"`, `SCAN_ERROR_MAP: Record<string, ScanErrorKind>`, `type ReportErrorKind`, `REPORT_ERROR_MAP`, `BAND_LABELS: Record<GeoBand, Localized<string>>`, `STATUS_LABELS: Record<GeoCheckStatus, Localized<string>>`, `fill(template: string, vars: Record<string, string | number>): string` (`{n}` yer tutucularını doldurur).

- [ ] **Step 1: Başarısız testleri yaz**

`tests/unit/tools-geo/copy.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { BAND_LABELS, REPORT_ERROR_MAP, SCAN_ERROR_MAP, STATUS_LABELS, TOOL_UI, fill } from "@/components/tools/copy";
import { TOOLS } from "@/lib/content/tools";
import { BAND_ORDER } from "@/lib/tools/geo/types";

function keysDeep(o: unknown, prefix = ""): string[] {
  if (typeof o !== "object" || o === null) return [prefix];
  return Object.entries(o).flatMap(([k, v]) => keysDeep(v, prefix ? `${prefix}.${k}` : k));
}

describe("araç UI kopyası", () => {
  it("TR ve EN aynı anahtar ağacını taşır", () => {
    expect(keysDeep(TOOL_UI.en).sort()).toEqual(keysDeep(TOOL_UI.tr).sort());
  });

  it("hata eşlemeleri her rota kodunu kapsar", () => {
    expect(SCAN_ERROR_MAP).toMatchObject({
      "invalid-url": "invalidUrl",
      "invalid-request": "generic",
      "rate-limited": "rateLimited",
      "target-unreachable": "unreachable",
      "target-blocked": "blocked",
      "turnstile-failed": "turnstile",
      misconfigured: "unavailable",
    });
    expect(REPORT_ERROR_MAP).toMatchObject({
      "rate-limited": "rateLimited",
      "not-found": "notFound",
      "turnstile-failed": "turnstile",
      "mail-failed": "mailFailed",
      misconfigured: "unavailable",
      invalid: "generic",
    });
    for (const kind of Object.values(SCAN_ERROR_MAP)) {
      expect(TOOL_UI.tr.errors[kind]).toBeTruthy();
      expect(TOOL_UI.en.errors[kind]).toBeTruthy();
    }
  });

  it("bant ve durum etiketleri iki dilde dolu", () => {
    for (const b of BAND_ORDER) {
      expect(BAND_LABELS[b].tr).toBeTruthy();
      expect(BAND_LABELS[b].en).toBeTruthy();
      expect(TOOLS[0]!.bands[b].tr).toBeTruthy();
      expect(TOOLS[0]!.bands[b].en).toBeTruthy();
    }
    expect(Object.keys(STATUS_LABELS)).toEqual(["pass", "partial", "fail"]);
  });

  it("fill yer tutucuları doldurur", () => {
    expect(fill("{n} bulgu", { n: 3 })).toBe("3 bulgu");
    expect(fill("Tarama tamamlandı, skor {score}", { score: 55 })).toBe("Tarama tamamlandı, skor 55");
  });

  it("içerik: kanıt şeridi 4 öğe, lede tek cümle, yardım satırı var", () => {
    const t = TOOLS[0]!;
    expect(t.proof).toHaveLength(4);
    expect((t.lede.tr.match(/[.!?](\s|$)/g) ?? []).length).toBe(1);
    expect(t.inputHelp.tr).toContain("yalnız");
  });
});
```

`tests/unit/tools-content.test.ts` içinde `it("her araç tam 6 SSS taşır"` → `it("her araç en az 6 SSS taşır"` ve `expect(t.faq.length, t.slug.tr).toBe(6)` → `toBeGreaterThanOrEqual(6)`.

- [ ] **Step 2: Çalıştır, başarısız gör**

Run: `pnpm vitest run tests/unit/tools-geo/copy.test.ts`
Expected: FAIL — modül yok.

- [ ] **Step 3: `tools.ts` — tip ve içerik**

`ToolContent` tipine (`lede` alanından sonra):

```ts
  /** Bant başına tek cümle — skor kartında sayının yanında. İçerik katmanı konuşur, motor değil. */
  bands: Record<GeoBand, Localized<string>>;
  /** Kanıt şeridi — hero'da 4 kısa öğe (mono, büyük harf). */
  proof: Array<Localized<string>>;
  /** Giriş çubuğunun altındaki yardım satırı — kapsam uyarısı. */
  inputHelp: Localized<string>;
```

(`GeoBand` tipini `@/lib/tools/geo/types`'tan içe aktar.) `lede` doc yorumunu "Hero girişi — TEK cümle" yap. `TOOLS[0]` içinde:

```ts
    lede: {
      tr: "Cevap motorları sitenizi okuyabiliyor mu? GEO denetimi beş sinyalde ölçer ve her sinyalde ne düzelteceğinizi söyler.",
      en: "Can answer engines read your site? The GEO audit measures five signals and tells you what to fix in each one.",
    },
    bands: {
      zayif: {
        tr: "Cevap motorları sitenizi büyük ölçüde göremiyor.",
        en: "Answer engines can barely see your site.",
      },
      "gelismeye-acik": {
        tr: "Cevap motorları sitenizi okuyor ama alıntılayacak yapı bulamıyor.",
        en: "Answer engines read your site but find little structure to quote.",
      },
      iyi: {
        tr: "Temel yapı yerinde; birkaç sinyal sizi öne geçirir.",
        en: "The foundations are in place; a few signals would put you ahead.",
      },
      oncu: {
        tr: "Cevap motorları için örnek bir yapı.",
        en: "A model structure for answer engines.",
      },
    },
    proof: [
      { tr: "5 sinyal", en: "5 signals" },
      { tr: "100 puan", en: "100 points" },
      { tr: "Saniyeler içinde", en: "Within seconds" },
      { tr: "Ücretsiz", en: "Free" },
    ],
    inputHelp: {
      tr: "Denetim yalnız girdiğiniz sayfa içindir; başka bir sayfa için yeniden çalıştırın.",
      en: "The audit covers only the page you enter; run it again for another page.",
    },
```

`faq` dizisine 7. öğe (mevcut `footnote` alanı kalır, sayfada yalnız bu cevap içinde geçer):

```ts
      {
        question: {
          tr: "Türkiye'nin ilk GEO denetim aracı mı?",
          en: "Is this the first Turkish GEO audit tool?",
        },
        answer: {
          tr: "Eylül 2026 itibarıyla Türkçe pazarda benzer kapsamda kamuya açık bir GEO denetim aracı tespit etmedik; iddia bu tarihle sınırlıdır ve yeni bir araç çıktığında güncellenir. Araç, INDOLES'in kendi sitesinde uyguladığı GEO pratiğinin ölçülebilir hâlidir: llms txt kontrolü, robots.txt izinleri, yapısal veri ve soru başlıkları aynı kurallarla puanlanır.",
          en: "As of September 2026 we found no comparable, publicly available GEO audit tool for the Turkish-language market; the claim is tied to that date and will be updated if a new tool appears. The tool is the measurable form of the GEO practice INDOLES applies on its own site: the llms.txt check, robots.txt permissions, structured data and question headings are scored by the same rules.",
        },
      },
```

`seo.description` içindeki "100 puan üzerinden" ifadesi sayfada `proof` ile geçmeye devam eder (tools-content testi "her rakam sayfada geçer" şartı).

- [ ] **Step 4: `copy.ts`**

```ts
import type { Locale } from "@/lib/content/types";
import type { GeoBand, GeoCheckStatus } from "@/lib/tools/geo/types";
import type { Localized } from "@/lib/content/types";

/**
 * Araç yüzeyinin UI kopyası — tek kaynak (spec §3-7). İçerik (`tools.ts`)
 * aracı anlatır; burası düğme, etiket, hata ve durum metinleridir. TR/EN
 * anahtar ağacı `copy.test.ts` ile eşitlenir.
 */
export type ScanErrorKind =
  | "invalidUrl" | "rateLimited" | "unreachable" | "blocked" | "turnstile" | "unavailable" | "generic";
export type ReportErrorKind =
  | "rateLimited" | "notFound" | "turnstile" | "mailFailed" | "unavailable" | "generic";

export const SCAN_ERROR_MAP: Record<string, ScanErrorKind> = {
  "invalid-url": "invalidUrl",
  "invalid-request": "generic",
  "rate-limited": "rateLimited",
  "target-unreachable": "unreachable",
  "target-blocked": "blocked",
  "turnstile-failed": "turnstile",
  misconfigured: "unavailable",
};

export const REPORT_ERROR_MAP: Record<string, ReportErrorKind> = {
  "rate-limited": "rateLimited",
  "not-found": "notFound",
  "turnstile-failed": "turnstile",
  "mail-failed": "mailFailed",
  misconfigured: "unavailable",
  invalid: "generic",
};

export const BAND_LABELS: Record<GeoBand, Localized<string>> = {
  zayif: { tr: "Zayıf", en: "Weak" },
  "gelismeye-acik": { tr: "Gelişmeye açık", en: "Developing" },
  iyi: { tr: "İyi", en: "Good" },
  oncu: { tr: "Öncü", en: "Leading" },
};

export const STATUS_LABELS: Record<GeoCheckStatus, Localized<string>> = {
  pass: { tr: "Geçti", en: "Pass" },
  partial: { tr: "Kısmen", en: "Partial" },
  fail: { tr: "Kaldı", en: "Fail" },
};

/** `{n}` biçimli yer tutucuları doldurur. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ""));
}

export type ToolUiCopy = {
  urlLabel: string;
  urlPlaceholder: string;
  submit: string;
  submitting: string;
  emptyUrl: string;
  turnstileLoading: string;
  turnstileUnavailable: string;
  stage: { reading: string; waiting: string; done: string; live: string; completed: string };
  result: {
    eyebrow: string; scannedAddress: string; caption: string; outOf: string;
    newScan: string; copyLink: string; copied: string; scaleAria: string;
  };
  signals: { points: string; details: string };
  gate: {
    title: string; locked: string; findingsCount: string; passedNotes: string;
    formTitle: string; formLede: string; emailLabel: string; emailPlaceholder: string;
    submit: string; submitting: string; kvkkPrefix: string; kvkkLink: string; kvkkHref: string;
    consentRequired: string; unlockedLede: string; passedGroup: string; showNotes: string;
    ctaLede: string; ctaButton: string;
    errors: Record<ReportErrorKind, string>;
  };
  errors: Record<ScanErrorKind, string>;
  share: { banner: string; scanOwn: string };
};

export const TOOL_UI: Record<Locale, ToolUiCopy> = {
  tr: {
    urlLabel: "Site adresi",
    urlPlaceholder: "sirketiniz.com.tr",
    submit: "Denetle",
    submitting: "Taranıyor…",
    emptyUrl: "Denetlemek istediğiniz adresi yazın.",
    turnstileLoading: "Güvenlik doğrulaması yükleniyor…",
    turnstileUnavailable: "Güvenlik doğrulaması yüklenemedi. Sayfayı yenileyip yeniden deneyin.",
    stage: {
      reading: "okunuyor…",
      waiting: "bekliyor",
      done: "tamam",
      live: "Tarama sürüyor",
      completed: "Tarama tamamlandı, skor {score}",
    },
    result: {
      eyebrow: "Sonuç",
      scannedAddress: "Taranan adres",
      caption: "GEO hazırlık skoru",
      outOf: "/100",
      newScan: "Yeni tarama",
      copyLink: "Bağlantıyı kopyala",
      copied: "Kopyalandı",
      scaleAria: "Skor ölçeği: {score} / 100, {band} bandında",
    },
    signals: { points: "puan", details: "Ayrıntı" },
    gate: {
      title: "Düzeltme listesi",
      locked: "Kilitli",
      findingsCount: "{n} bulgu",
      passedNotes: "Geçen {n} sinyalin notları",
      formTitle: "Raporu e-postayla alın",
      formLede: "Kalem kalem bulgular ve öncelikli aksiyonlar e-postanıza gelsin; liste hemen burada da açılır.",
      emailLabel: "E-posta adresi",
      emailPlaceholder: "siz@sirketiniz.com.tr",
      submit: "Raporu gönder",
      submitting: "Gönderiliyor…",
      kvkkPrefix: "KVKK kapsamında verilerimin işlenmesini kabul ediyorum.",
      kvkkLink: "Aydınlatma metni",
      kvkkHref: "/tr/gizlilik-kvkk",
      consentRequired: "Devam etmek için KVKK onayını işaretleyin.",
      unlockedLede: "Raporun kopyası e-postanızda.",
      passedGroup: "Geçen sinyaller ({n})",
      showNotes: "Notları göster",
      ctaLede: "Bu listeyi uzmanımızla birlikte önceliklendirin.",
      ctaButton: "Görüşme planlayın",
      errors: {
        rateLimited: "Çok fazla talep gönderildi. Bir süre sonra tekrar deneyin.",
        notFound: "Bu tarama bulunamadı. Yeni bir tarama başlatıp tekrar deneyin.",
        turnstile: "Güvenlik doğrulaması geçmedi; sayfayı yenileyip tekrar deneyin.",
        mailFailed: "Rapor şu an gönderilemedi, birazdan tekrar deneyin.",
        unavailable: "Araç şu an yanıt veremiyor, birazdan tekrar deneyin.",
        generic: "Bir sorun oluştu, birazdan tekrar deneyin.",
      },
    },
    errors: {
      invalidUrl: "Geçerli bir site adresi girin (örneğin sirketiniz.com.tr).",
      rateLimited: "Çok fazla tarama yapıldı. Bir süre sonra tekrar deneyin.",
      unreachable: "Bu adrese ulaşılamadı. Adresi kontrol edip tekrar deneyin.",
      blocked: "Bu site otomatik istekleri engelliyor. Bu koruma büyük ihtimalle GPTBot ve ClaudeBot'u da engelliyor; başlı başına bir GEO bulgusu.",
      turnstile: "Güvenlik doğrulaması geçmedi; sayfayı yenileyip tekrar deneyin.",
      unavailable: "Araç şu an yanıt veremiyor, birazdan tekrar deneyin.",
      generic: "Tarama şu an tamamlanamadı, birazdan tekrar deneyin.",
    },
    share: { banner: "Paylaşılan sonuç", scanOwn: "Kendi sitenizi tarayın" },
  },
  en: {
    urlLabel: "Site address",
    urlPlaceholder: "yourcompany.com",
    submit: "Audit",
    submitting: "Scanning…",
    emptyUrl: "Type the address you want to audit.",
    turnstileLoading: "Loading the security check…",
    turnstileUnavailable: "The security check did not load. Refresh the page and try again.",
    stage: {
      reading: "reading…",
      waiting: "waiting",
      done: "done",
      live: "Scan in progress",
      completed: "Scan complete, score {score}",
    },
    result: {
      eyebrow: "Result",
      scannedAddress: "Scanned address",
      caption: "GEO readiness score",
      outOf: "/100",
      newScan: "New scan",
      copyLink: "Copy link",
      copied: "Copied",
      scaleAria: "Score scale: {score} out of 100, in the {band} band",
    },
    signals: { points: "points", details: "Details" },
    gate: {
      title: "Fix list",
      locked: "Locked",
      findingsCount: "{n} findings",
      passedNotes: "Notes on the {n} passing signals",
      formTitle: "Get the report by email",
      formLede: "Item-by-item findings and priority actions land in your inbox; the list also opens right here.",
      emailLabel: "Email address",
      emailPlaceholder: "you@yourcompany.com",
      submit: "Send the report",
      submitting: "Sending…",
      kvkkPrefix: "I consent to processing my data per KVKK.",
      kvkkLink: "Privacy notice",
      kvkkHref: "/en/privacy",
      consentRequired: "Tick the KVKK consent to continue.",
      unlockedLede: "A copy of the report is in your inbox.",
      passedGroup: "Passing signals ({n})",
      showNotes: "Show notes",
      ctaLede: "Prioritise this list with one of our specialists.",
      ctaButton: "Book a call",
      errors: {
        rateLimited: "Too many requests for now. Please try again later.",
        notFound: "This scan was not found. Start a new scan and try again.",
        turnstile: "The security check did not pass; refresh the page and try again.",
        mailFailed: "The report could not be sent right now. Try again shortly.",
        unavailable: "The tool cannot respond right now. Try again shortly.",
        generic: "Something went wrong. Try again shortly.",
      },
    },
    errors: {
      invalidUrl: "Enter a valid site address (for example yourcompany.com).",
      rateLimited: "Too many scans for now. Please try again later.",
      unreachable: "We could not reach that address. Check it and try again.",
      blocked: "This site blocks automated requests. That protection most likely blocks GPTBot and ClaudeBot too; a GEO finding in itself.",
      turnstile: "The security check did not pass; refresh the page and try again.",
      unavailable: "The tool cannot respond right now. Try again shortly.",
      generic: "The scan could not finish right now. Try again shortly.",
    },
    share: { banner: "Shared result", scanOwn: "Scan your own site" },
  },
};
```

- [ ] **Step 5: Testleri çalıştır**

Run: `pnpm vitest run tests/unit/tools-geo/copy.test.ts tests/unit/tools-content.test.ts tests/unit/keyword-coverage.test.ts tests/unit/en-spelling.test.ts && pnpm typecheck`
Expected: PASS. Typecheck şu an `page.tsx`'te hata VERMEZ (eski bileşenler `ToolContent`'in yeni alanlarını okumaz). `keyword-coverage`: "geo denetimi" lede'de, "ai görünürlük testi" ve "llms txt kontrolü" SSS'de kalır.

- [ ] **Step 6: Commit**

```bash
git add src/lib/content/tools.ts src/components/tools/copy.ts tests/unit/tools-geo/copy.test.ts tests/unit/tools-content.test.ts
git commit -m "feat(tools): içerik katmanına bant cümleleri, kanıt şeridi ve yardım satırı; UI kopyası tek kaynakta"
```

---

### Task 5: `BandScale` (SVG ölçek) ve `ScoreCard`

**Files:**
- Create: `src/components/tools/band-scale.tsx`
- Create: `src/components/tools/score-card.tsx`
- Test: `tests/unit/tools-geo/band-scale.test.tsx`, `tests/unit/tools-geo/score-card.test.tsx`

**Interfaces:**
- Consumes: `BAND_ORDER`, `BAND_THRESHOLDS`, `bandFor` (Task 1); `semantic`, `teal`, `neutral` (`tokens.ts`); `TOOL_SCORE` (Task 2); `TOOL_UI`, `BAND_LABELS`, `fill` (Task 4); `ToolContent.bands` (Task 4); `usePrefersReducedMotion` (`@/lib/v2/use-mouse`).
- Produces: `bandSegments(): Array<{ band: GeoBand; from: number; to: number }>`; `BAND_COLORS: Record<GeoBand, { soft: string; strong: string }>`; `BandScale({ score, labels, ariaLabel })` (saf, SVG `viewBox="0 0 1000 60"`); `ScoreCard({ result, tool, locale, shareUrl, onNewScan?, newScanHref? })` (istemci).

- [ ] **Step 1: Başarısız testleri yaz**

`tests/unit/tools-geo/band-scale.test.tsx`:

```tsx
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BAND_COLORS, BandScale, bandSegments } from "@/components/tools/band-scale";
import { BAND_LABELS } from "@/components/tools/copy";
import { BAND_THRESHOLDS } from "@/lib/tools/geo/types";

const labels = { zayif: "zayıf", "gelismeye-acik": "gelişmeye açık", iyi: "iyi", oncu: "öncü" };

describe("bandSegments", () => {
  it("dört bölme, eşiklerle bitişik, 0'dan 100'e", () => {
    expect(bandSegments()).toEqual([
      { band: "zayif", from: 0, to: BAND_THRESHOLDS["gelismeye-acik"] },
      { band: "gelismeye-acik", from: BAND_THRESHOLDS["gelismeye-acik"], to: BAND_THRESHOLDS.iyi },
      { band: "iyi", from: BAND_THRESHOLDS.iyi, to: BAND_THRESHOLDS.oncu },
      { band: "oncu", from: BAND_THRESHOLDS.oncu, to: 100 },
    ]);
  });
});

describe("BandScale", () => {
  it("işaretçi skor konumunda, aktif bölme güçlü renkte, diğerleri yumuşak", () => {
    const { container } = render(<BandScale score={55} labels={labels} ariaLabel="Skor ölçeği" />);
    const marker = container.querySelector('[data-part="marker"]');
    expect(marker?.getAttribute("cx")).toBe("550");
    const segs = container.querySelectorAll('rect[data-band]');
    expect(segs).toHaveLength(4);
    expect(segs[1]?.getAttribute("fill")).toBe(BAND_COLORS["gelismeye-acik"].strong);
    expect(segs[0]?.getAttribute("fill")).toBe(BAND_COLORS.zayif.soft);
    expect(segs[2]?.getAttribute("fill")).toBe(BAND_COLORS.iyi.soft);
  });

  it("bölme genişlikleri eşik oranlarında (40/30/20/10)", () => {
    const { container } = render(<BandScale score={0} labels={labels} ariaLabel="x" />);
    const widths = [...container.querySelectorAll("rect[data-band]")].map((r) => Number(r.getAttribute("width")));
    // 1000 birimlik viewBox, bölmeler arası 4 birim boşluk düşülür
    expect(widths.map((w) => Math.round((w + 4) / 10))).toEqual([40, 30, 20, 10]);
  });

  it("erişilebilir: role=img ve aria-label; bant adları metin olarak var", () => {
    const { getByRole, getByText } = render(<BandScale score={95} labels={labels} ariaLabel="Skor ölçeği" />);
    expect(getByRole("img", { name: "Skor ölçeği" })).toBeInTheDocument();
    expect(getByText(BAND_LABELS.oncu.tr.toLowerCase())).toBeInTheDocument();
  });
});
```

`tests/unit/tools-geo/score-card.test.tsx`:

```tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { ScoreCard } from "@/components/tools/score-card";
import { TOOLS } from "@/lib/content/tools";
import type { GeoScanResult } from "@/lib/tools/geo/types";

const { reducedMotion } = vi.hoisted(() => ({ reducedMotion: { value: true } }));
vi.mock("@/lib/v2/use-mouse", () => ({ usePrefersReducedMotion: () => reducedMotion.value }));

const RESULT: GeoScanResult = {
  id: "scan-1",
  url: "https://www.migros.com.tr",
  totalScore: 55,
  band: "gelismeye-acik",
  scannedAt: "2026-09-02T00:00:00.000Z",
  checks: [],
};

describe("ScoreCard", () => {
  beforeEach(() => {
    reducedMotion.value = true;
  });

  it("skoru, bandı ve bant cümlesini basar; reduced-motion'da sayaç anında biter", () => {
    render(<ScoreCard result={RESULT} tool={TOOLS[0]!} locale="tr" shareUrl="https://x/y" />);
    expect(screen.getByText("55", { selector: "[data-part='score']" })).toBeInTheDocument();
    expect(screen.getByText("Gelişmeye açık")).toBeInTheDocument();
    expect(screen.getByText(TOOLS[0]!.bands["gelismeye-acik"].tr)).toBeInTheDocument();
    expect(screen.getByText("https://www.migros.com.tr")).toBeInTheDocument();
  });

  it("bağlantıyı panoya kopyalar ve düğme metni geçici olarak değişir", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    render(<ScoreCard result={RESULT} tool={TOOLS[0]!} locale="tr" shareUrl="https://x/y" />);
    fireEvent.click(screen.getByRole("button", { name: "Bağlantıyı kopyala" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Kopyalandı" })).toBeInTheDocument());
    expect(writeText).toHaveBeenCalledWith("https://x/y");
  });

  it("onNewScan verilirse düğme, newScanHref verilirse link basar", () => {
    const onNewScan = vi.fn();
    const { rerender } = render(
      <ScoreCard result={RESULT} tool={TOOLS[0]!} locale="tr" shareUrl="u" onNewScan={onNewScan} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Yeni tarama" }));
    expect(onNewScan).toHaveBeenCalledTimes(1);
    rerender(<ScoreCard result={RESULT} tool={TOOLS[0]!} locale="tr" shareUrl="u" newScanHref="/tr/araclar/geo" />);
    expect(screen.getByRole("link", { name: "Yeni tarama" })).toHaveAttribute("href", "/tr/araclar/geo");
  });

  it("sayaç animasyonluyken de son değere ulaşır", async () => {
    reducedMotion.value = false;
    render(<ScoreCard result={RESULT} tool={TOOLS[0]!} locale="tr" shareUrl="u" />);
    await waitFor(
      () => expect(screen.getByText("55", { selector: "[data-part='score']" })).toBeInTheDocument(),
      { timeout: 2000 },
    );
  });
});
```

- [ ] **Step 2: Çalıştır, başarısız gör**

Run: `pnpm vitest run tests/unit/tools-geo/band-scale.test.tsx tests/unit/tools-geo/score-card.test.tsx`
Expected: FAIL — modüller yok.

- [ ] **Step 3: `band-scale.tsx`**

```tsx
import { neutral, semantic, teal } from "@/lib/design/tokens";
import { BAND_ORDER, BAND_THRESHOLDS, bandFor, type GeoBand } from "@/lib/tools/geo/types";

/**
 * Dört bantlı skor ölçeği — SVG, satır içi renk ve geometri.
 *
 * Tailwind sınıfı BİLİNÇLİ olarak yok: aynı bileşen sayfada (`ScoreCard`) ve
 * OG kartı şablonunda (`scripts/og/geo-card.tsx`, `renderToStaticMarkup`)
 * çizilir; şablonun Tailwind CSS'i yoktur. Renkler `tokens.ts`'ten okunur —
 * ham hex burada da yazılmaz (docs/04 §11). Eşikler `BAND_THRESHOLDS`'tan
 * gelir; eşik değişirse ölçek ve kart birlikte değişir.
 */
export const BAND_COLORS: Record<GeoBand, { soft: string; strong: string }> = {
  zayif: { soft: semantic.danger[50], strong: semantic.danger[500] },
  "gelismeye-acik": { soft: semantic.warning[50], strong: semantic.warning[500] },
  iyi: { soft: semantic.success[50], strong: semantic.success[500] },
  oncu: { soft: teal[100], strong: teal[700] },
};

export function bandSegments(): Array<{ band: GeoBand; from: number; to: number }> {
  const starts = [0, BAND_THRESHOLDS["gelismeye-acik"], BAND_THRESHOLDS.iyi, BAND_THRESHOLDS.oncu];
  return BAND_ORDER.map((band, i) => ({ band, from: starts[i]!, to: starts[i + 1] ?? 100 }));
}

const VIEW_W = 1000;
const VIEW_H = 60;
const TRACK_Y = 10;
const TRACK_H = 12;
const GAP = 4;
const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace";

export function BandScale({
  score,
  labels,
  ariaLabel,
}: {
  score: number;
  labels: Record<GeoBand, string>;
  ariaLabel: string;
}) {
  const active = bandFor(score);
  const cx = Math.max(0, Math.min(100, score)) * (VIEW_W / 100);
  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      width="100%"
      role="img"
      aria-label={ariaLabel}
      style={{ display: "block", overflow: "visible" }}
    >
      {bandSegments().map(({ band, from, to }) => {
        const x = from * (VIEW_W / 100) + (from === 0 ? 0 : GAP / 2);
        const w = (to - from) * (VIEW_W / 100) - (from === 0 ? GAP / 2 : GAP) + (to === 100 ? GAP / 2 : 0);
        return (
          <g key={band}>
            <rect
              data-band={band}
              x={x}
              y={TRACK_Y}
              width={w}
              height={TRACK_H}
              rx={TRACK_H / 2}
              fill={band === active ? BAND_COLORS[band].strong : BAND_COLORS[band].soft}
            />
            <text
              x={x + w / 2}
              y={VIEW_H - 8}
              textAnchor="middle"
              fontFamily={MONO}
              fontSize={18}
              letterSpacing={1.5}
              fill={band === active ? neutral.ink[900] : neutral.ink[500]}
            >
              {labels[band].toLowerCase()}
            </text>
          </g>
        );
      })}
      <circle
        data-part="marker"
        cx={cx}
        cy={TRACK_Y + TRACK_H / 2}
        r={10}
        fill={neutral.ink[900]}
        stroke={neutral.bgPure}
        strokeWidth={3}
      />
    </svg>
  );
}
```

`neutral` objesinin `ink` alt anahtarları `tokens.ts:51`'de `ink: { 900: ..., 500: ... }` biçimindedir; alan adı farklıysa (ör. `neutral.ink900`) o adı kullan ve test dosyasına dokunma (test yalnız `fill` değerlerini `BAND_COLORS` üzerinden okur).

Genişlik testi: `from === 0` bölmesi `w = 400 - 2`, ortadakiler `300 - 4`, `200 - 4`, sonuncu `100 - 4 + 2` → `Math.round((w + 4) / 10)` = 40/30/20/10.

- [ ] **Step 4: `score-card.tsx`**

```tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { BandScale } from "@/components/tools/band-scale";
import { BAND_LABELS, TOOL_UI, fill } from "@/components/tools/copy";
import { TOOL_SCORE } from "@/lib/v2/anim-config";
import { usePrefersReducedMotion } from "@/lib/v2/use-mouse";
import { BAND_ORDER } from "@/lib/tools/geo/types";
import type { ToolContent } from "@/lib/content/tools";
import type { Locale } from "@/lib/content/types";
import type { GeoBand, GeoScanResult } from "@/lib/tools/geo/types";

/**
 * Skor kartı (spec §5): sayı + bant + bant cümlesi + dört bantlı ölçek.
 * Sayaç `TOOL_SCORE.countMs`te 0'dan skora sayar; reduced-motion'da anında.
 * Ekran okuyucu ara değerleri duymaz: görünen sayı `aria-hidden`, gerçek
 * değer `sr-only`.
 */
const BAND_TONE: Record<GeoBand, string> = {
  zayif: "border-danger-500 bg-danger-50 text-danger-700",
  "gelismeye-acik": "border-warning-500 bg-warning-50 text-warning-700",
  iyi: "border-success-500 bg-success-50 text-success-700",
  oncu: "border-teal-500 bg-teal-50 text-teal-700",
};

function useCountUp(target: number, durationMs: number, instant: boolean): number {
  const [value, setValue] = React.useState(instant ? target : 0);
  React.useEffect(() => {
    if (instant) {
      setValue(target);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs, instant]);
  return value;
}

export function ScoreCard({
  result,
  tool,
  locale,
  shareUrl,
  onNewScan,
  newScanHref,
}: {
  result: GeoScanResult;
  tool: ToolContent;
  locale: Locale;
  shareUrl: string;
  onNewScan?: () => void;
  newScanHref?: string;
}) {
  const c = TOOL_UI[locale];
  const reduced = usePrefersReducedMotion();
  const shown = useCountUp(result.totalScore, TOOL_SCORE.countMs, reduced);
  const [copied, setCopied] = React.useState(false);
  const copyTimeout = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  React.useEffect(() => () => {
    if (copyTimeout.current !== undefined) clearTimeout(copyTimeout.current);
  }, []);

  async function onCopy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      if (copyTimeout.current !== undefined) clearTimeout(copyTimeout.current);
      copyTimeout.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      /* pano reddedildi — düğme tekrar denenebilir */
    }
  }

  const labels = Object.fromEntries(BAND_ORDER.map((b) => [b, BAND_LABELS[b][locale]])) as Record<GeoBand, string>;

  return (
    <section aria-labelledby="score-heading" className="v2-surface border border-surface-2 rounded-2xl p-6 md:p-10 text-left">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="eyebrow-bare mono text-ink-500 min-w-0">
          <span className="uppercase tracking-widest">{c.result.eyebrow}</span>
          <span aria-hidden="true"> · </span>
          <span className="sr-only">{c.result.scannedAddress}: </span>
          <span className="break-all normal-case tracking-normal">{result.url}</span>
        </p>
        <div className="flex items-center gap-2">
          {newScanHref ? (
            <Link href={newScanHref} className="btn btn-ghost">{c.result.newScan}</Link>
          ) : onNewScan ? (
            <button type="button" onClick={onNewScan} className="btn btn-ghost">{c.result.newScan}</button>
          ) : null}
          <button type="button" onClick={onCopy} className="btn btn-ghost" aria-live="polite">
            {copied ? c.result.copied : c.result.copyLink}
          </button>
        </div>
      </div>

      <h2 id="score-heading" className="sr-only">{c.result.caption}</h2>

      <div className="mt-8 grid gap-6 md:grid-cols-[auto_1fr] md:items-end">
        <div className="flex items-baseline gap-2">
          <span data-part="score" aria-hidden="true" className="typography-display-xl tabular text-ink-900 leading-none">
            {shown}
          </span>
          <span className="sr-only">{result.totalScore}</span>
          <span className="typography-body-lg text-ink-500">{c.result.outOf}</span>
        </div>
        <div>
          <span className={`typography-label inline-flex items-center rounded-full border px-3 py-1 uppercase tracking-widest ${BAND_TONE[result.band]}`}>
            {BAND_LABELS[result.band][locale]}
          </span>
          <p className="typography-body-lg text-ink-700 mt-3">{tool.bands[result.band][locale]}</p>
        </div>
      </div>

      <div className="mt-8">
        <BandScale
          score={result.totalScore}
          labels={labels}
          ariaLabel={fill(c.result.scaleAria, { score: result.totalScore, band: BAND_LABELS[result.band][locale] })}
        />
      </div>
      <p className="typography-caption text-ink-500 mt-3">{c.result.caption}</p>
    </section>
  );
}
```

- [ ] **Step 5: Testleri çalıştır**

Run: `pnpm vitest run tests/unit/tools-geo/band-scale.test.tsx tests/unit/tools-geo/score-card.test.tsx && pnpm typecheck`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/tools/band-scale.tsx src/components/tools/score-card.tsx tests/unit/tools-geo/band-scale.test.tsx tests/unit/tools-geo/score-card.test.tsx
git commit -m "feat(tools): BandScale SVG ölçeği ve sayaçlı ScoreCard"
```

---

### Task 6: `SignalRows` — ağırlıklı çubuk satırları

**Files:**
- Create: `src/components/tools/signal-rows.tsx`
- Modify: `src/styles/v2.css` (`.signal-bar-fill` için `@starting-style`)
- Test: `tests/unit/tools-geo/signal-rows.test.tsx`

**Interfaces:**
- Consumes: `STATUS_LABELS`, `TOOL_UI` (Task 4); `ToolSignal[]`; `GeoCheckResult[]`.
- Produces: `SignalRows({ checks, signals, locale })` (saf); `barWidthPercent(max, heaviest): number`; `fillPercent(score, max): number`.

- [ ] **Step 1: Başarısız testi yaz**

`tests/unit/tools-geo/signal-rows.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SignalRows, barWidthPercent, fillPercent } from "@/components/tools/signal-rows";
import { TOOLS } from "@/lib/content/tools";
import type { GeoCheckResult } from "@/lib/tools/geo/types";

const SIGNALS = TOOLS[0]!.signals;
const CHECKS: GeoCheckResult[] = [
  { id: "ai-access", score: 25, max: 25, status: "pass", summary: { tr: "Tüm botlar okuyabiliyor.", en: "All bots can read." }, findings: [] },
  { id: "llms-txt", score: 10, max: 15, status: "partial", summary: { tr: "llms.txt biçimsiz.", en: "llms.txt unformatted." }, findings: [] },
  { id: "json-ld", score: 0, max: 20, status: "fail", summary: { tr: "JSON-LD yok.", en: "No JSON-LD." }, findings: [] },
  { id: "lang-signals", score: 15, max: 15, status: "pass", summary: { tr: "Dil tam.", en: "Language complete." }, findings: [] },
  { id: "question-h2", score: 0, max: 25, status: "fail", summary: { tr: "Soru yok.", en: "No questions." }, findings: [] },
];

describe("oran yardımcıları", () => {
  it("çubuk genişliği ağırlığa, dolgu puana orantılı", () => {
    expect(barWidthPercent(25, 25)).toBe(100);
    expect(barWidthPercent(15, 25)).toBe(60);
    expect(fillPercent(10, 15)).toBeCloseTo(66.67, 1);
    expect(fillPercent(0, 20)).toBe(0);
  });
});

describe("SignalRows", () => {
  it("beş satır, sinyal sırası, durum etiketi ve puan", () => {
    render(<SignalRows checks={CHECKS} signals={SIGNALS} locale="tr" />);
    const rows = screen.getAllByRole("listitem");
    expect(rows).toHaveLength(5);
    expect(rows[0]).toHaveTextContent("AI erişimi");
    expect(rows[0]).toHaveTextContent("25 / 25 puan");
    expect(rows[0]).toHaveTextContent("Geçti");
    expect(rows[2]).toHaveTextContent("Kaldı");
  });

  it("çubuk genişliği ve dolgusu stil değişkenleriyle verilir", () => {
    const { container } = render(<SignalRows checks={CHECKS} signals={SIGNALS} locale="tr" />);
    const bars = container.querySelectorAll('[data-part="bar"]');
    expect((bars[1] as HTMLElement).style.width).toBe("60%");
    const fills = container.querySelectorAll(".signal-bar-fill");
    expect((fills[1] as HTMLElement).style.getPropertyValue("--fill")).toBe("66.67%");
    expect(fills[2]?.className).toContain("bg-danger-500");
    expect(fills[0]?.className).toContain("bg-success-500");
  });

  it("özet cümlesi açılır ayrıntıda", () => {
    render(<SignalRows checks={CHECKS} signals={SIGNALS} locale="tr" />);
    expect(screen.getByText("llms.txt biçimsiz.")).toBeInTheDocument();
    expect(screen.getAllByText("Ayrıntı")).toHaveLength(5);
  });
});
```

- [ ] **Step 2: Çalıştır, başarısız gör**

Run: `pnpm vitest run tests/unit/tools-geo/signal-rows.test.tsx`
Expected: FAIL — modül yok.

- [ ] **Step 3: `signal-rows.tsx`**

```tsx
import type { CSSProperties } from "react";
import { STATUS_LABELS, TOOL_UI } from "@/components/tools/copy";
import type { ToolSignal } from "@/lib/content/tools";
import type { Locale } from "@/lib/content/types";
import type { GeoCheckResult, GeoCheckStatus } from "@/lib/tools/geo/types";

/**
 * Sinyal satırları (spec §5): çubuk uzunluğu ağırlığı, dolgusu puanı
 * gösterir; 25 puanlık sinyal 15 puanlıktan uzun. Saf bileşen — dolgu
 * animasyonu CSS'te (`@starting-style`), reduced-motion CSS'te kapanır.
 * Sıra `signals` sırasıdır ("Ne ölçüyoruz" bölümüyle aynı).
 */
const FILL_TONE: Record<GeoCheckStatus, string> = {
  pass: "bg-success-500",
  partial: "bg-warning-500",
  fail: "bg-danger-500",
};
const PILL_TONE: Record<GeoCheckStatus, string> = {
  pass: "bg-success-50 text-success-700",
  partial: "bg-warning-50 text-warning-700",
  fail: "bg-danger-50 text-danger-700",
};

export function barWidthPercent(max: number, heaviest: number): number {
  return heaviest > 0 ? Math.round((max / heaviest) * 100) : 0;
}

export function fillPercent(score: number, max: number): number {
  return max > 0 ? Math.round((score / max) * 10000) / 100 : 0;
}

export function SignalRows({
  checks,
  signals,
  locale,
}: {
  checks: GeoCheckResult[];
  signals: ToolSignal[];
  locale: Locale;
}) {
  const c = TOOL_UI[locale];
  const heaviest = Math.max(...checks.map((ch) => ch.max), 0);
  const ordered = signals
    .map((s) => checks.find((ch) => ch.id === s.id))
    .filter((ch): ch is GeoCheckResult => Boolean(ch));

  return (
    <ul className="mt-8 flex flex-col">
      {ordered.map((check) => {
        const signal = signals.find((s) => s.id === check.id);
        return (
          <li key={check.id}>
            <details className="group">
              <summary className="signal-row cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <h3 data-part="name" className="typography-body-md font-medium text-ink-900">
                  {signal ? signal.title[locale] : check.id}
                </h3>
                <div data-part="bar" className="signal-bar" style={{ width: `${barWidthPercent(check.max, heaviest)}%` }}>
                  <div
                    className={`signal-bar-fill ${FILL_TONE[check.status]}`}
                    style={{ "--fill": `${fillPercent(check.score, check.max)}%` } as CSSProperties}
                  />
                </div>
                <span data-part="points" className="mono tabular text-ink-500 whitespace-nowrap">
                  {check.score} / {check.max} {c.signals.points}
                </span>
                <span data-part="status" className={`typography-label rounded-full px-2.5 py-1 uppercase tracking-widest ${PILL_TONE[check.status]}`}>
                  {STATUS_LABELS[check.status][locale]}
                </span>
              </summary>
              <div className="pb-4 pl-0 md:pl-[calc(minmax(140px,200px)+16px)]">
                <span className="typography-caption text-ink-500">{c.signals.details}</span>
                <p className="typography-body-md text-ink-700 mt-1">{check.summary[locale]}</p>
              </div>
            </details>
          </li>
        );
      })}
    </ul>
  );
}
```

`md:pl-[calc(...)]` Tailwind'de `minmax` çözümlenmez; ayrıntı girintisi için `md:pl-[216px]` yerine `v2.css`'e `.signal-detail { padding-left: 0 } @media (min-width: 768px) { .signal-detail { padding-left: 216px } }` ekle ve `div`e `signal-detail` sınıfını ver (ham px bileşende değil CSS'te; `216 = 200 + 16` satır ızgarasının ilk kolonu + boşluğu).

`v2.css`'e (`.signal-bar-fill` bloğundan sonra):

```css
@starting-style { .signal-bar-fill { width: 0; } }
.signal-detail { padding-left: 0; }
@media (min-width: 768px) { .signal-detail { padding-left: 216px; } }
```

- [ ] **Step 4: Testleri çalıştır**

Run: `pnpm vitest run tests/unit/tools-geo/signal-rows.test.tsx && pnpm typecheck`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/tools/signal-rows.tsx src/styles/v2.css tests/unit/tools-geo/signal-rows.test.tsx
git commit -m "feat(tools): ağırlıklı SignalRows — çubuk ağırlığı, dolgu puanı, açılır özet"
```

---

### Task 7: `ScanBar` — dev giriş çubuğu, anti-spam, süre tuzağı beklemesi

**Files:**
- Create: `src/components/tools/scan-bar.tsx`
- Test: `tests/unit/tools-geo/scan-bar.test.tsx`

**Interfaces:**
- Consumes: `TOOL_UI`, `ScanErrorKind` (Task 4); `MIN_FILL_MS` (Task 1).
- Produces: `type ScanSubmission = { url: string; website: string; elapsedMs: number; turnstileToken?: string }`; `normalizeUrlInput(raw: string): string`; `ScanBar({ locale, value, onChange, onSubmit, busy, error })` — `error: ScanErrorKind | null`; boş gönderim çubuğun kendi `emptyUrl` uyarısıdır.

- [ ] **Step 1: Başarısız testleri yaz**

`tests/unit/tools-geo/scan-bar.test.tsx`:

```tsx
import * as React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ScanBar, normalizeUrlInput } from "@/components/tools/scan-bar";
import { MIN_FILL_MS } from "@/lib/security/anti-spam";

describe("normalizeUrlInput", () => {
  it("şema yoksa https:// ekler, boşlukları kırpar, mevcut şemayı korur", () => {
    expect(normalizeUrlInput("  migros.com.tr ")).toBe("https://migros.com.tr");
    expect(normalizeUrlInput("http://ornek.com")).toBe("http://ornek.com");
    expect(normalizeUrlInput("HTTPS://Ornek.com/yol")).toBe("HTTPS://Ornek.com/yol");
    expect(normalizeUrlInput("")).toBe("");
  });
});

function Harness({ onSubmit, error = null, busy = false }: { onSubmit: (s: unknown) => void; error?: null | "unreachable"; busy?: boolean }) {
  const [v, setV] = React.useState("");
  return <ScanBar locale="tr" value={v} onChange={setV} onSubmit={onSubmit} busy={busy} error={error} />;
}

describe("ScanBar", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("boş gönderimde onSubmit çağrılmaz, uyarı basılır", () => {
    const onSubmit = vi.fn();
    render(<Harness onSubmit={onSubmit} />);
    fireEvent.submit(screen.getByRole("form"));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent("Denetlemek istediğiniz adresi yazın.");
  });

  it("süre tuzağı: 2 sn dolmadan gönderim kalan süreyi bekler, sonra normalize URL ile gider", () => {
    const onSubmit = vi.fn();
    render(<Harness onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText("Site adresi"), { target: { value: "migros.com.tr" } });
    act(() => { vi.advanceTimersByTime(500); });
    fireEvent.submit(screen.getByRole("form"));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Denetle" })).toHaveAttribute("aria-busy", "true");
    act(() => { vi.advanceTimersByTime(MIN_FILL_MS); });
    expect(onSubmit).toHaveBeenCalledTimes(1);
    const sub = onSubmit.mock.calls[0]![0] as { url: string; website: string; elapsedMs: number };
    expect(sub.url).toBe("https://migros.com.tr");
    expect(sub.website).toBe("");
    expect(sub.elapsedMs).toBeGreaterThanOrEqual(MIN_FILL_MS);
  });

  it("2 sn geçmişse hemen gönderir", () => {
    const onSubmit = vi.fn();
    render(<Harness onSubmit={onSubmit} />);
    act(() => { vi.advanceTimersByTime(MIN_FILL_MS + 10); });
    fireEvent.change(screen.getByLabelText("Site adresi"), { target: { value: "https://ornek.com" } });
    fireEvent.submit(screen.getByRole("form"));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("hata prop'u çubuğu geçersiz işaretler ve mesajı basar", () => {
    render(<Harness onSubmit={vi.fn()} error="unreachable" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Bu adrese ulaşılamadı.");
    expect(screen.getByLabelText("Site adresi")).toHaveAttribute("aria-invalid", "true");
  });

  it("busy iken düğme 'Taranıyor…' ve alan kilitli", () => {
    render(<Harness onSubmit={vi.fn()} busy />);
    expect(screen.getByRole("button", { name: "Taranıyor…" })).toBeDisabled();
    expect(screen.getByLabelText("Site adresi")).toBeDisabled();
  });
});
```

- [ ] **Step 2: Çalıştır, başarısız gör**

Run: `pnpm vitest run tests/unit/tools-geo/scan-bar.test.tsx`
Expected: FAIL — modül yok.

- [ ] **Step 3: `scan-bar.tsx`**

Turnstile yardımcıları mevcut `geo-scan-form.tsx`'ten birebir taşınır (`TURNSTILE_ENABLED`, `TURNSTILE_POLL_MS`, `TURNSTILE_POLL_LIMIT`, `TURNSTILE_TOKEN_TIMEOUT_MS`, `TurnstileApi`, `turnstileApi()`, render/poll `useEffect`'i, bekçi `useEffect`'i, `clearTurnstileToken`). Bileşen:

```tsx
"use client";

import * as React from "react";
import { TOOL_UI, type ScanErrorKind } from "@/components/tools/copy";
import { MIN_FILL_MS } from "@/lib/security/anti-spam";
import type { Locale } from "@/lib/content/types";

/**
 * Giriş çubuğu (spec §3): sayfanın en büyük öğesi. Anti-spam sözleşmesi
 * `ContactForm` ile birebir (ADR-028): bayrak açıksa Turnstile, her zaman
 * bal küpü + süre tuzağı. Yenilik: süre tuzağına takılacak hızlı gönderim
 * SUNUCUYA GİTMEDEN çubukta bekletilir (kalan süre `aria-busy` içinde
 * geçer), sonra gerçek `elapsedMs` ile gönderilir — tuzak bozulmaz, hızlı
 * insan "tamamlanamadı" görmez.
 */
export type ScanSubmission = {
  url: string;
  website: string;
  elapsedMs: number;
  turnstileToken?: string;
};

export function normalizeUrlInput(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed === "") return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

// … Turnstile sabitleri ve turnstileApi() — geo-scan-form.tsx'ten birebir …

export function ScanBar({
  locale,
  value,
  onChange,
  onSubmit,
  busy,
  error,
}: {
  locale: Locale;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (submission: ScanSubmission) => void;
  busy: boolean;
  error: ScanErrorKind | null;
}) {
  const c = TOOL_UI[locale];
  const uid = React.useId();
  const [localError, setLocalError] = React.useState<"emptyUrl" | null>(null);
  const [waiting, setWaiting] = React.useState(false);
  const [website, setWebsite] = React.useState("");
  const mountedAtRef = React.useRef<number>(Date.now());
  const waitTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // … turnstileToken / turnstileStatus state'i ve effect'leri (birebir) …

  React.useEffect(() => () => {
    if (waitTimer.current !== undefined) clearTimeout(waitTimer.current);
  }, []);

  function fire(): void {
    onSubmit({
      url: normalizeUrlInput(value),
      website,
      elapsedMs: Date.now() - mountedAtRef.current,
      ...(TURNSTILE_ENABLED ? { turnstileToken } : {}),
    });
  }

  function handleSubmit(e: React.FormEvent): void {
    e.preventDefault();
    if (busy || waiting) return;
    if (normalizeUrlInput(value) === "") {
      setLocalError("emptyUrl");
      return;
    }
    setLocalError(null);
    const remaining = MIN_FILL_MS - (Date.now() - mountedAtRef.current);
    if (remaining > 0) {
      setWaiting(true);
      waitTimer.current = setTimeout(() => {
        setWaiting(false);
        fire();
      }, remaining);
      return;
    }
    fire();
  }

  const inputId = `${uid}-url`;
  const isBusy = busy || waiting;
  const tokenBlocking = TURNSTILE_ENABLED && !turnstileToken;
  const message = localError ? c.emptyUrl : error ? c.errors[error] : null;
  let hint: string | null = null;
  if (!isBusy && TURNSTILE_ENABLED) {
    if (turnstileStatus === "unavailable") hint = c.turnstileUnavailable;
    else if (!turnstileToken) hint = c.turnstileLoading;
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label={c.urlLabel} className="text-left">
      <label htmlFor={inputId} className="sr-only">{c.urlLabel}</label>
      <div className="scan-bar" data-invalid={message ? "true" : undefined}>
        <input
          id={inputId}
          className="scan-bar-input"
          type="url"
          inputMode="url"
          autoComplete="url"
          placeholder={c.urlPlaceholder}
          value={value}
          onChange={(e) => { onChange(e.target.value); if (localError) setLocalError(null); }}
          disabled={isBusy}
          aria-invalid={message ? true : undefined}
          aria-describedby={message ? `${uid}-msg` : undefined}
        />
        <button
          type="submit"
          className="btn btn-primary scan-bar-submit"
          aria-label={isBusy ? c.submitting : c.submit}
          aria-busy={isBusy ? "true" : undefined}
          disabled={isBusy || tokenBlocking}
        >
          <span className="scan-bar-submit-label">{isBusy ? c.submitting : c.submit}</span>
          <svg className="arrow" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M3 7 H11 M7 3 L11 7 L7 11" stroke="currentColor" strokeWidth="1.4" fill="none" />
          </svg>
        </button>
      </div>

      {/* Bal küpü — ContactForm ile birebir; kullanıcıya hiç görünmez. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
        <label>
          Web sitesi (boş bırak)
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>
      </div>

      {TURNSTILE_ENABLED ? <div ref={turnstileRef} className="cf-turnstile" /> : null}

      <div role="status" aria-live="polite">
        {hint ? <p className="typography-caption text-ink-500 mt-3">{hint}</p> : null}
      </div>

      {message ? (
        <p id={`${uid}-msg`} role="alert" className="typography-body-sm text-danger-700 mt-3 flex items-start gap-2">
          <svg viewBox="0 0 16 16" className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true">
            <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.3" />
            <path d="M8 4.5v4M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>{message}</span>
        </p>
      ) : null}
    </form>
  );
}
```

`getByRole("form")` için `<form>`'un erişilebilir adı gerekir — `aria-label={c.urlLabel}` bunu sağlar.

- [ ] **Step 4: Testleri çalıştır**

Run: `pnpm vitest run tests/unit/tools-geo/scan-bar.test.tsx && pnpm typecheck`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/tools/scan-bar.tsx tests/unit/tools-geo/scan-bar.test.tsx
git commit -m "feat(tools): ScanBar — dev giriş çubuğu, şema tamamlama, süre tuzağı beklemesi"
```

---

### Task 8: `ScanStage` — tarama sahnesi

**Files:**
- Create: `src/components/tools/scan-stage.tsx`
- Test: `tests/unit/tools-geo/scan-stage.test.tsx`

**Interfaces:**
- Consumes: `TOOL_SCAN` (Task 2); `TOOL_UI`, `STATUS_LABELS`, `fill` (Task 4); `usePrefersReducedMotion`.
- Produces: `ScanStage({ signals, locale, checks, onResolved })` — `checks: GeoCheckResult[] | null` (yanıt gelince dolar); `onResolved` tüm satırlar çözülüp `morphMs` geçince bir kez çağrılır.

- [ ] **Step 1: Başarısız testi yaz**

`tests/unit/tools-geo/scan-stage.test.tsx`:

```tsx
import { render, screen, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ScanStage } from "@/components/tools/scan-stage";
import { TOOLS } from "@/lib/content/tools";
import { TOOL_SCAN } from "@/lib/v2/anim-config";
import type { GeoCheckResult } from "@/lib/tools/geo/types";

const { reducedMotion } = vi.hoisted(() => ({ reducedMotion: { value: false } }));
vi.mock("@/lib/v2/use-mouse", () => ({ usePrefersReducedMotion: () => reducedMotion.value }));

const SIGNALS = TOOLS[0]!.signals;
const CHECKS: GeoCheckResult[] = SIGNALS.map((s) => ({
  id: s.id, score: s.weight, max: s.weight, status: "pass",
  summary: { tr: "x", en: "x" }, findings: [],
}));

function rows() {
  return [...document.querySelectorAll(".tool-stage-row")].map((r) => r.getAttribute("data-state"));
}

describe("ScanStage", () => {
  beforeEach(() => { vi.useFakeTimers(); reducedMotion.value = false; });
  afterEach(() => vi.useRealTimers());

  it("satırlar enterStaggerMs arayla okunuyor'a girer; yanıt gelmeden hiçbiri done olmaz", () => {
    render(<ScanStage signals={SIGNALS} locale="tr" checks={null} onResolved={vi.fn()} />);
    expect(rows()).toEqual(["reading", "waiting", "waiting", "waiting", "waiting"]);
    act(() => { vi.advanceTimersByTime(TOOL_SCAN.enterStaggerMs * 2); });
    expect(rows()).toEqual(["reading", "reading", "reading", "waiting", "waiting"]);
    act(() => { vi.advanceTimersByTime(TOOL_SCAN.enterStaggerMs * 10); });
    expect(rows().every((s) => s === "reading")).toBe(true);
    expect(screen.getByRole("status")).toHaveTextContent("Tarama sürüyor");
  });

  it("checks gelince satırlar resolveStaggerMs arayla çözülür, morphMs sonra onResolved", () => {
    const onResolved = vi.fn();
    const { rerender } = render(<ScanStage signals={SIGNALS} locale="tr" checks={null} onResolved={onResolved} />);
    act(() => { vi.advanceTimersByTime(TOOL_SCAN.enterStaggerMs * 5); });
    rerender(<ScanStage signals={SIGNALS} locale="tr" checks={CHECKS} onResolved={onResolved} />);
    act(() => { vi.advanceTimersByTime(TOOL_SCAN.resolveStaggerMs * 2 + 1); });
    expect(rows().filter((s) => s === "done")).toHaveLength(2);
    act(() => { vi.advanceTimersByTime(TOOL_SCAN.resolveStaggerMs * 3); });
    expect(rows().every((s) => s === "done")).toBe(true);
    expect(screen.getAllByText("25 / 25 · Geçti").length).toBeGreaterThan(0);
    expect(onResolved).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(TOOL_SCAN.morphMs); });
    expect(onResolved).toHaveBeenCalledTimes(1);
  });

  it("reduced-motion: kadans yok, checks gelince hepsi anında done ve onResolved hemen", () => {
    reducedMotion.value = true;
    const onResolved = vi.fn();
    const { rerender } = render(<ScanStage signals={SIGNALS} locale="tr" checks={null} onResolved={onResolved} />);
    expect(rows().every((s) => s === "reading")).toBe(true);
    rerender(<ScanStage signals={SIGNALS} locale="tr" checks={CHECKS} onResolved={onResolved} />);
    act(() => { vi.advanceTimersByTime(0); });
    expect(rows().every((s) => s === "done")).toBe(true);
    expect(onResolved).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Çalıştır, başarısız gör**

Run: `pnpm vitest run tests/unit/tools-geo/scan-stage.test.tsx`
Expected: FAIL — modül yok.

- [ ] **Step 3: `scan-stage.tsx`**

```tsx
"use client";

import * as React from "react";
import { STATUS_LABELS, TOOL_UI } from "@/components/tools/copy";
import { TOOL_SCAN } from "@/lib/v2/anim-config";
import { usePrefersReducedMotion } from "@/lib/v2/use-mouse";
import type { ToolSignal } from "@/lib/content/tools";
import type { Locale } from "@/lib/content/types";
import type { GeoCheckResult } from "@/lib/tools/geo/types";

/**
 * Tarama sahnesi (spec §4). Satırlar sırayla "okunuyor"a girer; `checks`
 * (gerçek yanıt) gelince sırayla çözülür. Yanıt gelmeden hiçbir satır
 * sonuç göstermez. Süreler `TOOL_SCAN`; reduced-motion'da hepsi sıfır.
 */
type RowState = "waiting" | "reading" | "done";

export function ScanStage({
  signals,
  locale,
  checks,
  onResolved,
}: {
  signals: ToolSignal[];
  locale: Locale;
  checks: GeoCheckResult[] | null;
  onResolved: () => void;
}) {
  const c = TOOL_UI[locale];
  const reduced = usePrefersReducedMotion();
  const total = signals.length;
  const [entered, setEntered] = React.useState(reduced ? total : 1);
  const [resolved, setResolved] = React.useState(0);
  const resolvedRef = React.useRef(false);

  // Giriş kadansı
  React.useEffect(() => {
    if (reduced || entered >= total) return;
    const t = setTimeout(() => setEntered((n) => Math.min(total, n + 1)), TOOL_SCAN.enterStaggerMs);
    return () => clearTimeout(t);
  }, [entered, total, reduced]);

  // Çözülme kadansı — yalnız gerçek yanıt geldikten sonra
  React.useEffect(() => {
    if (!checks) return;
    if (resolved >= total) {
      if (resolvedRef.current) return;
      resolvedRef.current = true;
      const t = setTimeout(onResolved, reduced ? 0 : TOOL_SCAN.morphMs);
      return () => clearTimeout(t);
    }
    if (reduced) {
      setEntered(total);
      setResolved(total);
      return;
    }
    setEntered(total);
    const t = setTimeout(() => setResolved((n) => n + 1), TOOL_SCAN.resolveStaggerMs);
    return () => clearTimeout(t);
  }, [checks, resolved, total, reduced, onResolved]);

  return (
    <div className="mt-6">
      <p role="status" aria-live="polite" className="sr-only">{c.stage.live}</p>
      <ol className="tool-stage" aria-hidden="true">
        {signals.map((signal, i) => {
          const state: RowState = i < resolved ? "done" : i < entered ? "reading" : "waiting";
          const check = checks?.find((ch) => ch.id === signal.id);
          return (
            <li key={signal.id} className="tool-stage-row" data-state={state}>
              <span className="tool-stage-dot" />
              <span className="typography-body-md">{signal.title[locale]}</span>
              <span className="mono tabular text-ink-500">
                {state === "done" && check
                  ? `${check.score} / ${check.max} · ${STATUS_LABELS[check.status][locale]}`
                  : state === "reading"
                    ? c.stage.reading
                    : c.stage.waiting}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
```

`onResolved` çağıran parent (`GeoTool`, Task 10) fonksiyonu `useCallback` ile sabitler; sabitlemezse effect her render'da yeniden kurulur ve zamanlayıcı sıfırlanır.

- [ ] **Step 4: Testleri çalıştır**

Run: `pnpm vitest run tests/unit/tools-geo/scan-stage.test.tsx && pnpm typecheck`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/tools/scan-stage.tsx tests/unit/tools-geo/scan-stage.test.tsx
git commit -m "feat(tools): ScanStage — kadanslı tarama sahnesi, sahte veri yok, reduced-motion"
```

---

### Task 9: `ReportGate` (kilit kartı) ve `FindingsList` (düzeltme listesi)

**Files:**
- Create: `src/components/tools/findings-list.tsx`
- Create: `src/components/tools/report-gate.tsx`
- Test: `tests/unit/tools-geo/findings-list.test.tsx`, `tests/unit/tools-geo/report-gate.test.tsx`

**Interfaces:**
- Consumes: `TOOL_UI`, `STATUS_LABELS`, `REPORT_ERROR_MAP`, `fill` (Task 4); `findingsCount` (Task 1); `PopupCTAButton`; Turnstile yardımcıları (Task 7 ile aynı kalıp).
- Produces: `orderForFixList(checks, signals): { todo: GeoCheckResult[]; passed: GeoCheckResult[] }` (todo: `status !== "pass"`, `max - score` azalan, eşitlikte `signals` sırası); `FindingsList({ checks, signals, locale, ctaSlot? })` (saf); `ReportGate({ scanId, band, locale, checks, signals })` (istemci; `POST /api/tools/geo-report`; 200 gövdesindeki `checks` ile `FindingsList` açar; `track("tool_report_requested")`).

- [ ] **Step 1: Başarısız testleri yaz**

`tests/unit/tools-geo/findings-list.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FindingsList, orderForFixList } from "@/components/tools/findings-list";
import { TOOLS } from "@/lib/content/tools";
import type { GeoCheckResult } from "@/lib/tools/geo/types";

const SIGNALS = TOOLS[0]!.signals;
const CHECKS: GeoCheckResult[] = [
  { id: "ai-access", score: 25, max: 25, status: "pass", summary: { tr: "a", en: "a" }, findings: [{ tr: "AI notu", en: "AI note" }] },
  { id: "llms-txt", score: 10, max: 15, status: "partial", summary: { tr: "b", en: "b" }, findings: [{ tr: "llms bulgusu", en: "llms finding" }] },
  { id: "json-ld", score: 0, max: 20, status: "fail", summary: { tr: "c", en: "c" }, findings: [{ tr: "JSON-LD bulgusu", en: "JSON-LD finding" }] },
  { id: "lang-signals", score: 15, max: 15, status: "pass", summary: { tr: "d", en: "d" }, findings: [] },
  { id: "question-h2", score: 0, max: 25, status: "fail", summary: { tr: "e", en: "e" }, findings: [{ tr: "Soru bulgusu 1", en: "Q1" }, { tr: "Soru bulgusu 2", en: "Q2" }] },
];

describe("orderForFixList", () => {
  it("kalan/kısmen önce, kaybedilen puan azalan; geçenler ayrı", () => {
    const { todo, passed } = orderForFixList(CHECKS, SIGNALS);
    expect(todo.map((c) => c.id)).toEqual(["question-h2", "json-ld", "llms-txt"]);
    expect(passed.map((c) => c.id)).toEqual(["ai-access", "lang-signals"]);
  });
});

describe("FindingsList", () => {
  it("numaralı düzeltme listesi, geçenler katlı grupta, CTA yuvası basılır", () => {
    render(<FindingsList checks={CHECKS} signals={SIGNALS} locale="tr" ctaSlot={<button type="button">Görüşme planlayın</button>} />);
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("01");
    expect(items[0]).toHaveTextContent("Soru başlıkları");
    expect(items[0]).toHaveTextContent("0 / 25");
    expect(screen.getByText("Soru bulgusu 2")).toBeInTheDocument();
    expect(screen.getByText("Geçen sinyaller (2)")).toBeInTheDocument();
    expect(screen.getByText("AI notu")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Görüşme planlayın" })).toBeInTheDocument();
  });
});
```

`tests/unit/tools-geo/report-gate.test.tsx` — mevcut `src/components/tools/__tests__/geo-report-form.test.tsx`'in senaryoları yeni bileşene taşınır:

```tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ReportGate } from "@/components/tools/report-gate";
import { TOOLS } from "@/lib/content/tools";
import type { GeoCheckResult } from "@/lib/tools/geo/types";

vi.mock("@/components/marketing/PopupCTAButton", () => ({
  PopupCTAButton: ({ children }: { children: React.ReactNode }) => <button type="button">{children}</button>,
}));
const { trackMock } = vi.hoisted(() => ({ trackMock: vi.fn() }));
vi.mock("@/lib/analytics/ga", () => ({ track: trackMock }));

const SIGNALS = TOOLS[0]!.signals;
const STRIPPED: GeoCheckResult[] = [
  { id: "ai-access", score: 25, max: 25, status: "pass", summary: { tr: "a", en: "a" }, findings: [], findingsCount: 0 },
  { id: "json-ld", score: 0, max: 20, status: "fail", summary: { tr: "c", en: "c" }, findings: [], findingsCount: 1 },
  { id: "question-h2", score: 0, max: 25, status: "fail", summary: { tr: "e", en: "e" }, findings: [], findingsCount: 2 },
];
const FULL: GeoCheckResult[] = STRIPPED.map((c) => ({
  ...c,
  findings: Array.from({ length: c.findingsCount ?? 0 }, (_, i) => ({ tr: `${c.id} bulgu ${i + 1}`, en: `${c.id} finding ${i + 1}` })),
}));

function renderGate() {
  return render(<ReportGate scanId="scan-1" band="zayif" locale="tr" checks={STRIPPED} signals={SIGNALS} />);
}

describe("ReportGate", () => {
  beforeEach(() => { trackMock.mockReset(); });
  afterEach(() => { vi.unstubAllGlobals(); });

  it("kilitli önizleme: kalan sinyaller bulgu sayısıyla, geçenler tek satırda", () => {
    renderGate();
    expect(screen.getByText("Soru başlıkları")).toBeInTheDocument();
    expect(screen.getByText("2 bulgu")).toBeInTheDocument();
    expect(screen.getByText("1 bulgu")).toBeInTheDocument();
    expect(screen.getByText("Geçen 1 sinyalin notları")).toBeInTheDocument();
    expect(screen.getByText("Kilitli")).toBeInTheDocument();
  });

  it("rızasız gönderim istek atmaz, uyarı basar", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    renderGate();
    fireEvent.change(screen.getByLabelText("E-posta adresi"), { target: { value: "a@b.co" } });
    fireEvent.click(screen.getByRole("button", { name: "Raporu gönder" }));
    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent("KVKK onayını işaretleyin");
  });

  it("rızalı gönderim: yanıttaki checks ile düzeltme listesi açılır, olay atılır", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true, checks: FULL }) }));
    renderGate();
    fireEvent.change(screen.getByLabelText("E-posta adresi"), { target: { value: "a@b.co" } });
    fireEvent.click(screen.getByLabelText(/KVKK kapsamında/));
    fireEvent.click(screen.getByRole("button", { name: "Raporu gönder" }));
    await waitFor(() => expect(screen.getByText("question-h2 bulgu 2")).toBeInTheDocument());
    expect(screen.getByText("Raporun kopyası e-postanızda.")).toBeInTheDocument();
    expect(trackMock).toHaveBeenCalledWith({ name: "tool_report_requested", properties: { slug: "geo-gorunurluk-denetleyicisi", band: "zayif", locale: "tr" } });
    const body = JSON.parse((fetch as unknown as { mock: { calls: [unknown, { body: string }][] } }).mock.calls[0]![1].body);
    expect(body).toMatchObject({ scanId: "scan-1", email: "a@b.co", kvkkConsent: true, locale: "tr", website: "" });
  });

  it("mail-failed → hata satırı, kilit kapalı kalır", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, json: async () => ({ error: "mail-failed" }) }));
    renderGate();
    fireEvent.change(screen.getByLabelText("E-posta adresi"), { target: { value: "a@b.co" } });
    fireEvent.click(screen.getByLabelText(/KVKK kapsamında/));
    fireEvent.click(screen.getByRole("button", { name: "Raporu gönder" }));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Rapor şu an gönderilemedi"));
    expect(screen.queryByText("json-ld bulgu 1")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Çalıştır, başarısız gör**

Run: `pnpm vitest run tests/unit/tools-geo/findings-list.test.tsx tests/unit/tools-geo/report-gate.test.tsx`
Expected: FAIL — modüller yok.

- [ ] **Step 3: `findings-list.tsx`**

```tsx
import { STATUS_LABELS, TOOL_UI, fill } from "@/components/tools/copy";
import type { ToolSignal } from "@/lib/content/tools";
import type { Locale } from "@/lib/content/types";
import type { GeoCheckResult } from "@/lib/tools/geo/types";

/**
 * Düzeltme listesi (spec §6, kilit açık): önce kalanlar, kaybedilen puana
 * göre azalan — "öncelikli aksiyonlar" vaadinin karşılığı. Geçenler altta
 * katlı. Saf bileşen; bulgular rota yanıtından gelir.
 */
export function orderForFixList(
  checks: GeoCheckResult[],
  signals: ToolSignal[],
): { todo: GeoCheckResult[]; passed: GeoCheckResult[] } {
  const order = new Map(signals.map((s, i) => [s.id, i]));
  const byOrder = (a: GeoCheckResult, b: GeoCheckResult) => (order.get(a.id) ?? 99) - (order.get(b.id) ?? 99);
  const todo = checks
    .filter((c) => c.status !== "pass")
    .sort((a, b) => (b.max - b.score) - (a.max - a.score) || byOrder(a, b));
  const passed = checks.filter((c) => c.status === "pass").sort(byOrder);
  return { todo, passed };
}

export function FindingsList({
  checks,
  signals,
  locale,
  ctaSlot,
}: {
  checks: GeoCheckResult[];
  signals: ToolSignal[];
  locale: Locale;
  ctaSlot?: React.ReactNode;
}) {
  const c = TOOL_UI[locale];
  const { todo, passed } = orderForFixList(checks, signals);
  const title = (check: GeoCheckResult) => signals.find((s) => s.id === check.id)?.title[locale] ?? check.id;

  return (
    <div className="text-left">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="typography-h3 text-ink-900">{c.gate.title}</h3>
        <p className="typography-body-sm text-success-700">{c.gate.unlockedLede}</p>
      </div>

      <ol className="mt-6 flex flex-col gap-6">
        {todo.map((check, i) => (
          <li key={check.id} className="grid grid-cols-[2.5rem_1fr] gap-3">
            <span className="mono text-ink-400" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h4 className="typography-body-md font-medium text-ink-900">{title(check)}</h4>
                <span className="mono tabular text-ink-500">{check.score} / {check.max}</span>
                <span className="typography-label uppercase tracking-widest text-ink-500">{STATUS_LABELS[check.status][locale]}</span>
              </div>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                {check.findings.map((f, j) => (
                  <li key={j} className="typography-body-sm text-ink-700">{f[locale]}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>

      {passed.length > 0 ? (
        <details className="mt-8 group">
          <summary className="cursor-pointer typography-body-md text-ink-700 list-none [&::-webkit-details-marker]:hidden">
            <span className="text-success-700 mr-2" aria-hidden="true">✓</span>
            {fill(c.gate.passedGroup, { n: passed.length })}
            <span className="ml-2 typography-caption text-ink-500">{c.gate.showNotes}</span>
          </summary>
          <ul className="mt-4 flex flex-col gap-4">
            {passed.map((check) => (
              <li key={check.id}>
                <h4 className="typography-body-md font-medium text-ink-900">{title(check)}</h4>
                {check.findings.length > 0 ? (
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    {check.findings.map((f, j) => (
                      <li key={j} className="typography-body-sm text-ink-700">{f[locale]}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </details>
      ) : null}

      {ctaSlot ? (
        <div className="v2-surface-3 rounded-xl p-6 mt-10 flex flex-col items-start gap-4">
          <p className="typography-body-md text-ink-700">{c.gate.ctaLede}</p>
          {ctaSlot}
        </div>
      ) : null}
    </div>
  );
}
```

`✓` karakteri emoji değil, Unicode işareti (U+2713) — UI'da işlevsel ikon olarak izinli.

- [ ] **Step 4: `report-gate.tsx`**

Turnstile yardımcıları Task 7'deki gibi (birebir kalıp). Bileşen:

```tsx
"use client";

import * as React from "react";
import { FindingsList } from "@/components/tools/findings-list";
import { REPORT_ERROR_MAP, TOOL_UI, fill, type ReportErrorKind } from "@/components/tools/copy";
import { PopupCTAButton } from "@/components/marketing/PopupCTAButton";
import { track } from "@/lib/analytics/ga";
import type { ToolSignal } from "@/lib/content/tools";
import type { Locale } from "@/lib/content/types";
import type { GeoBand, GeoCheckResult } from "@/lib/tools/geo/types";

const SLUG = "geo-gorunurluk-denetleyicisi";
// … TURNSTILE_* sabitleri, TurnstileApi, turnstileApi() — Task 7 ile aynı …

/**
 * Kilit kartı (spec §6): solda değer (kilitli önizleme — bulgu SAYILARI,
 * metin yok), sağda e-posta + KVKK formu. 200 yanıtındaki `checks` (tam
 * findings) ile `FindingsList` açılır; başlangıç `checks` prop'u public
 * yüzeydir ve findings taşımaz (Görev 12b).
 */
export function ReportGate({
  scanId,
  band,
  locale,
  checks,
  signals,
}: {
  scanId: string;
  band: GeoBand;
  locale: Locale;
  checks: GeoCheckResult[];
  signals: ToolSignal[];
}) {
  const c = TOOL_UI[locale];
  const uid = React.useId();
  const [email, setEmail] = React.useState("");
  const [consent, setConsent] = React.useState(false);
  const [state, setState] = React.useState<"idle" | "submitting" | "error" | "unlocked">("idle");
  const [errorKind, setErrorKind] = React.useState<ReportErrorKind | "consent">("generic");
  const [unlocked, setUnlocked] = React.useState<GeoCheckResult[]>(checks);
  const [website, setWebsite] = React.useState("");
  const mountedAtRef = React.useRef<number>(Date.now());
  // … turnstile state + effect'ler + clearTurnstileToken (Task 7 kalıbı) …

  async function onSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (state === "submitting") return;
    if (!consent) {
      setErrorKind("consent");
      setState("error");
      return;
    }
    setState("submitting");
    try {
      const res = await fetch("/api/tools/geo-report", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          scanId,
          email: email.trim(),
          kvkkConsent: true,
          locale,
          website,
          elapsedMs: Date.now() - mountedAtRef.current,
          ...(TURNSTILE_ENABLED ? { turnstileToken } : {}),
        }),
      });
      if (res.ok) {
        const body = (await res.json().catch(() => null)) as { ok?: boolean; checks?: GeoCheckResult[] } | null;
        if (body?.checks) setUnlocked(body.checks);
        track({ name: "tool_report_requested", properties: { slug: SLUG, band, locale } });
        setState("unlocked");
        return;
      }
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      setErrorKind(REPORT_ERROR_MAP[body?.error ?? ""] ?? "generic");
      setState("error");
      clearTurnstileToken();
    } catch {
      setErrorKind("generic");
      setState("error");
      clearTurnstileToken();
    }
  }

  if (state === "unlocked") {
    return (
      <section aria-label={c.gate.title} className="v2-surface border border-surface-2 rounded-2xl p-6 md:p-10 mt-8">
        <FindingsList
          checks={unlocked}
          signals={signals}
          locale={locale}
          ctaSlot={<PopupCTAButton source="tool-geo-report" className="btn btn-primary">{c.gate.ctaButton}</PopupCTAButton>}
        />
      </section>
    );
  }

  const todo = checks.filter((ch) => ch.status !== "pass").sort((a, b) => (b.max - b.score) - (a.max - a.score));
  const passedCount = checks.length - todo.length;
  const emailId = `${uid}-email`;
  const kvkkId = `${uid}-kvkk`;
  const submitting = state === "submitting";
  const tokenBlocking = TURNSTILE_ENABLED && !turnstileToken;
  const message = state === "error" ? (errorKind === "consent" ? c.gate.consentRequired : c.gate.errors[errorKind]) : null;
  let hint: string | null = null;
  if (!submitting && TURNSTILE_ENABLED) {
    if (turnstileStatus === "unavailable") hint = c.turnstileUnavailable;
    else if (!turnstileToken) hint = c.turnstileLoading;
  }

  return (
    <section aria-label={c.gate.title} className="v2-surface border border-surface-2 rounded-2xl p-6 md:p-10 mt-8 grid gap-8 md:grid-cols-2 text-left">
      <div>
        <div className="flex items-center justify-between gap-3">
          <h3 className="typography-h3 text-ink-900">{c.gate.title}</h3>
          <span className="typography-label inline-flex items-center gap-1.5 rounded-full border border-ink-200 px-2.5 py-1 uppercase tracking-widest text-ink-500">
            <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true"><rect x="2" y="5" width="8" height="6" rx="1" fill="currentColor" /><path d="M4 5V3.5a2 2 0 0 1 4 0V5" stroke="currentColor" strokeWidth="1.2" fill="none" /></svg>
            {c.gate.locked}
          </span>
        </div>
        <ul className="mt-6 flex flex-col gap-4">
          {todo.map((check) => {
            const n = check.findingsCount ?? check.findings.length;
            if (n === 0) return null;
            return (
              <li key={check.id}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="typography-body-md text-ink-900">{signals.find((s) => s.id === check.id)?.title[locale] ?? check.id}</span>
                  <span className="mono text-ink-500">{fill(c.gate.findingsCount, { n })}</span>
                </div>
                <div className="gate-skeleton mt-2" style={{ width: `${Math.min(100, 55 + n * 15)}%` }} />
              </li>
            );
          })}
          {passedCount > 0 ? (
            <li>
              <span className="typography-body-sm text-ink-500">{fill(c.gate.passedNotes, { n: passedCount })}</span>
              <div className="gate-skeleton mt-2" style={{ width: "40%" }} />
            </li>
          ) : null}
        </ul>
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <h3 className="typography-h3 text-ink-900">{c.gate.formTitle}</h3>
          <p className="typography-body-md text-ink-700 mt-2">{c.gate.formLede}</p>
        </div>
        <div>
          <label htmlFor={emailId} className="typography-label text-ink-700">{c.gate.emailLabel}</label>
          <input
            id={emailId}
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder={c.gate.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={state === "error" ? true : undefined}
            className="mt-2 w-full rounded-xl border border-ink-200 bg-pure px-4 py-3 typography-body-md text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-teal-500 aria-invalid:border-danger-500"
          />
        </div>
        <label htmlFor={kvkkId} className="flex items-start gap-3 typography-body-sm text-ink-700 cursor-pointer py-2">
          <input id={kvkkId} type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} aria-required className="h-5 w-5 mt-0.5 shrink-0 accent-teal-700 cursor-pointer" />
          <span>
            {c.gate.kvkkPrefix}{" "}
            <a href={c.gate.kvkkHref} onClick={(e) => e.stopPropagation()} className="underline decoration-teal-300 hover:decoration-teal-500">{c.gate.kvkkLink}</a>
          </span>
        </label>
        <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
          <label>
            Web sitesi (boş bırak)
            <input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </label>
        </div>
        {TURNSTILE_ENABLED ? <div ref={turnstileRef} className="cf-turnstile" /> : null}
        <button type="submit" className="btn btn-primary" aria-busy={submitting ? "true" : undefined} disabled={submitting || tokenBlocking || email.trim().length === 0}>
          {submitting ? c.gate.submitting : c.gate.submit}
        </button>
        <div role="status" aria-live="polite">{hint ? <p className="typography-caption text-ink-500">{hint}</p> : null}</div>
        {message ? <p role="alert" className="typography-body-sm text-danger-700">{message}</p> : null}
      </form>
    </section>
  );
}
```

E-posta alanı `Input` bileşenini (`fieldVariants`) kullanabilir — yukarıdaki sınıf zinciri `fieldVariants` ile aynıdır; tekrar yazmamak için `import { Input } from "@/components/ui/input"` tercih edilir.

- [ ] **Step 5: Testleri çalıştır**

Run: `pnpm vitest run tests/unit/tools-geo/findings-list.test.tsx tests/unit/tools-geo/report-gate.test.tsx && pnpm typecheck`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/tools/findings-list.tsx src/components/tools/report-gate.tsx tests/unit/tools-geo/findings-list.test.tsx tests/unit/tools-geo/report-gate.test.tsx
git commit -m "feat(tools): ReportGate kilit kartı (sayılı önizleme + form) ve öncelik sıralı FindingsList"
```

---

### Task 10: `ToolHero`, `GeoTool` durum makinesi ve araç sayfası

**Files:**
- Create: `src/components/tools/tool-hero.tsx`
- Create: `src/components/tools/geo-tool.tsx`
- Modify: `src/app/(marketing)/[locale]/araclar/geo-gorunurluk-denetleyicisi/page.tsx`
- Modify: `src/styles/v2.css` (`.tool-hero .v2-crumbs ol { justify-content: center; }`)
- Delete: `src/components/tools/geo-scan-form.tsx`, `src/components/tools/geo-result.tsx`, `src/components/tools/geo-report-form.tsx`, `src/components/tools/__tests__/geo-report-form.test.tsx`, `tests/unit/tools-geo/geo-scan-form.test.tsx`, `tests/unit/tools-geo/geo-result.test.tsx`
- Test: `tests/unit/tools-geo/geo-tool.test.tsx`

**Interfaces:**
- Consumes: `ScanBar`/`ScanSubmission` (7), `ScanStage` (8), `ScoreCard` (5), `SignalRows` (6), `ReportGate` (9), `TOOL_UI`/`SCAN_ERROR_MAP` (4), `ToolContent.proof/inputHelp` (4), `getPathname` (`@/lib/i18n/navigation`), `absoluteUrl` (`@/lib/seo/site`), `track`, `usePrefersReducedMotion`.
- Produces: `ToolHero({ tool, locale, compact })`; `GeoTool({ locale, tool, initialResult?, mode })` — `mode: "tool" | "share"`; `RESULT_PATHNAME = "/araclar/geo-gorunurluk-denetleyicisi/sonuc/[id]"`, `TOOL_PATHNAME = "/araclar/geo-gorunurluk-denetleyicisi"`, `resultPathname(id, locale)`, `toolPathname(locale)` (named export'lar, Task 11 paylaşım sayfası kullanır).

- [ ] **Step 1: Başarısız testi yaz**

`tests/unit/tools-geo/geo-tool.test.tsx`:

```tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GeoTool } from "@/components/tools/geo-tool";
import { TOOLS } from "@/lib/content/tools";
import type { GeoScanResult } from "@/lib/tools/geo/types";

const { trackMock } = vi.hoisted(() => ({ trackMock: vi.fn() }));
vi.mock("@/lib/analytics/ga", () => ({ track: trackMock }));
vi.mock("@/lib/v2/use-mouse", () => ({ usePrefersReducedMotion: () => true }));
vi.mock("@/lib/i18n/navigation", () => ({
  getPathname: ({ href, locale }: { href: string | { pathname: string; params: { id: string } }; locale: string }) =>
    typeof href === "string"
      ? `/${locale}/araclar/geo-gorunurluk-denetleyicisi`
      : `/${locale}/araclar/geo-gorunurluk-denetleyicisi/sonuc/${href.params.id}`,
}));
vi.mock("@/components/marketing/PopupCTAButton", () => ({
  PopupCTAButton: ({ children }: { children: React.ReactNode }) => <button type="button">{children}</button>,
}));

const TOOL = TOOLS[0]!;
const RESULT: GeoScanResult = {
  id: "scan-abc",
  url: "https://ornek.com.tr",
  totalScore: 72,
  band: "iyi",
  scannedAt: "2026-09-02T00:00:00.000Z",
  checks: TOOL.signals.map((s) => ({
    id: s.id, score: s.weight, max: s.weight, status: "pass" as const,
    summary: { tr: "özet", en: "summary" }, findings: [], findingsCount: 0,
  })),
};

async function submit(url = "https://ornek.com.tr") {
  fireEvent.change(screen.getByLabelText("Site adresi"), { target: { value: url } });
  // Süre tuzağı: ScanBar 2 sn'ye kadar bekler — sahte zamanlayıcı yok, mountedAt geri alınır
  await new Promise((r) => setTimeout(r, 0));
  fireEvent.submit(screen.getByRole("form", { name: "Site adresi" }));
}

describe("GeoTool", () => {
  let replaceState: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    trackMock.mockReset();
    replaceState = vi.spyOn(window.history, "replaceState").mockImplementation(() => undefined);
    Element.prototype.scrollIntoView = vi.fn();
  });
  afterEach(() => { vi.unstubAllGlobals(); replaceState.mockRestore(); });

  it("idle: tam olarak bir h1, kanıt şeridi ve giriş çubuğu", () => {
    render(<GeoTool locale="tr" tool={TOOL} mode="tool" />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByText("5 sinyal")).toBeInTheDocument();
    expect(screen.getByLabelText("Site adresi")).toBeInTheDocument();
    expect(screen.getByText(TOOL.inputHelp.tr)).toBeInTheDocument();
  });

  it("başarılı tarama: sahne → skor kartı, URL güncellenir, olaylar atılır, sayfa karta kayar", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ id: RESULT.id, result: RESULT }) }));
    render(<GeoTool locale="tr" tool={TOOL} mode="tool" />);
    // MIN_FILL_MS beklemesini atlamak için: gerçek zamanlayıcı ile 2 sn beklemek yerine
    // ScanBar'ın mountedAt'ı geçmişe alınamaz; bu yüzden waitFor uzun zaman aşımıyla bekler.
    await submit();
    await waitFor(() => expect(screen.getByText("72", { selector: "[data-part='score']" })).toBeInTheDocument(), { timeout: 4000 });
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(replaceState).toHaveBeenCalledWith(null, "", "/tr/araclar/geo-gorunurluk-denetleyicisi/sonuc/scan-abc");
    expect(trackMock).toHaveBeenCalledWith({ name: "tool_used", properties: { slug: "geo-gorunurluk-denetleyicisi", locale: "tr" } });
    expect(trackMock).toHaveBeenCalledWith({ name: "tool_scan_completed", properties: { slug: "geo-gorunurluk-denetleyicisi", band: "iyi", locale: "tr" } });
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
    expect(screen.getByText("Düzeltme listesi")).toBeInTheDocument();
  });

  it("target-blocked → engellenen site mesajı, giriş durumunda kalır", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, json: async () => ({ error: "target-blocked" }) }));
    render(<GeoTool locale="tr" tool={TOOL} mode="tool" />);
    await submit();
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("otomatik istekleri engelliyor"), { timeout: 4000 });
    expect(screen.getByLabelText("Site adresi")).toBeEnabled();
  });

  it("share modu: initialResult ile doğrudan skor kartı, 'Yeni tarama' araç sayfasına link", () => {
    render(<GeoTool locale="tr" tool={TOOL} mode="share" initialResult={RESULT} />);
    expect(screen.getByText("72", { selector: "[data-part='score']" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Yeni tarama" })).toHaveAttribute("href", "/tr/araclar/geo-gorunurluk-denetleyicisi");
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("'Yeni tarama' düğmesi giriş durumuna döner ve URL'i araç sayfasına çeker", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ id: RESULT.id, result: RESULT }) }));
    render(<GeoTool locale="tr" tool={TOOL} mode="tool" />);
    await submit();
    await waitFor(() => expect(screen.getByRole("button", { name: "Yeni tarama" })).toBeInTheDocument(), { timeout: 4000 });
    fireEvent.click(screen.getByRole("button", { name: "Yeni tarama" }));
    expect(screen.getByLabelText("Site adresi")).toHaveValue("");
    expect(replaceState).toHaveBeenLastCalledWith(null, "", "/tr/araclar/geo-gorunurluk-denetleyicisi");
  });
});
```

`submit()` gerçek zamanlayıcıyla 2 sn bekler (ScanBar süre tuzağı); `waitFor` zaman aşımı 4 sn bu yüzden. Test süresi ~10 sn kabul edilir; istenirse `vi.useFakeTimers({ shouldAdvanceTime: true })` ile kısaltılabilir.

- [ ] **Step 2: Çalıştır, başarısız gör**

Run: `pnpm vitest run tests/unit/tools-geo/geo-tool.test.tsx`
Expected: FAIL — modül yok.

- [ ] **Step 3: `tool-hero.tsx`**

```tsx
import type { ToolContent } from "@/lib/content/tools";
import type { Locale } from "@/lib/content/types";

/**
 * Araç hero'su (spec §3): eyebrow + h1 + tek cümle lede. `compact` tarama
 * sırasında lede'i gizler; `hidden` sonuç durumunda başlığı sr-only bırakır
 * (sayfada her durumda tam olarak bir h1).
 */
export function ToolHero({
  tool,
  locale,
  variant = "full",
}: {
  tool: ToolContent;
  locale: Locale;
  variant?: "full" | "compact" | "hidden";
}) {
  if (variant === "hidden") {
    return <h1 id="tool-h1" className="sr-only">{tool.name[locale]}</h1>;
  }
  return (
    <div>
      <span className="eyebrow">{tool.eyebrow[locale]}</span>
      <h1 id="tool-h1" className="typography-h1 text-ink-900 mt-4">{tool.name[locale]}</h1>
      {variant === "full" ? (
        <p className="typography-body-lg text-ink-700 mt-5 mx-auto max-w-[40ch]">{tool.lede[locale]}</p>
      ) : null}
    </div>
  );
}
```

`max-w-[40ch]` yerine `globals.css`'te varsa `max-w-prose-editorial`'ın daha dar bir kardeşi yoksa `[40ch]` kabul (ch birimi tipografik ölçü, ham px değil).

- [ ] **Step 4: `geo-tool.tsx`**

```tsx
"use client";

import * as React from "react";
import { ReportGate } from "@/components/tools/report-gate";
import { ScanBar, type ScanSubmission } from "@/components/tools/scan-bar";
import { ScanStage } from "@/components/tools/scan-stage";
import { ScoreCard } from "@/components/tools/score-card";
import { SignalRows } from "@/components/tools/signal-rows";
import { ToolHero } from "@/components/tools/tool-hero";
import { SCAN_ERROR_MAP, type ScanErrorKind } from "@/components/tools/copy";
import { track } from "@/lib/analytics/ga";
import { getPathname } from "@/lib/i18n/navigation";
import { absoluteUrl } from "@/lib/seo/site";
import { usePrefersReducedMotion } from "@/lib/v2/use-mouse";
import type { ToolContent } from "@/lib/content/tools";
import type { Locale } from "@/lib/content/types";
import type { GeoScanResult } from "@/lib/tools/geo/types";

/**
 * Araç adası — durum makinesi (spec §2):
 *   idle ──submit──▶ scanning ──200──▶ resolving ──sahne biter──▶ result
 *     ▲                 │
 *     └──── error ◀─────┘
 * Yanıt `pending`te bekler; sahne satırları çözülünce `scan` olur. Sayfa
 * geçişi yok; URL `history.replaceState` ile paylaşım linkine güncellenir.
 */
export const SLUG = "geo-gorunurluk-denetleyicisi";
export const TOOL_PATHNAME = "/araclar/geo-gorunurluk-denetleyicisi";
export const RESULT_PATHNAME = "/araclar/geo-gorunurluk-denetleyicisi/sonuc/[id]";

export function resultPathname(id: string, locale: Locale): string {
  return getPathname({ href: { pathname: RESULT_PATHNAME, params: { id } }, locale });
}
export function toolPathname(locale: Locale): string {
  return getPathname({ href: TOOL_PATHNAME, locale });
}

type Phase = "idle" | "scanning" | "resolving" | "result";

export function GeoTool({
  locale,
  tool,
  initialResult,
  mode,
}: {
  locale: Locale;
  tool: ToolContent;
  initialResult?: GeoScanResult;
  mode: "tool" | "share";
}) {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = React.useState<Phase>(initialResult ? "result" : "idle");
  const [url, setUrl] = React.useState("");
  const [error, setError] = React.useState<ScanErrorKind | null>(null);
  const [pending, setPending] = React.useState<GeoScanResult | null>(null);
  const [scan, setScan] = React.useState<GeoScanResult | null>(initialResult ?? null);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const shouldScrollRef = React.useRef(false);

  async function onSubmit(sub: ScanSubmission): Promise<void> {
    setError(null);
    setPhase("scanning");
    track({ name: "tool_used", properties: { slug: SLUG, locale } });
    try {
      const res = await fetch("/api/tools/geo-scan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(sub),
      });
      if (res.ok) {
        const body = (await res.json().catch(() => null)) as { id?: string; result?: GeoScanResult } | null;
        if (!body?.id || !body.result) {
          setError("generic");
          setPhase("idle");
          return;
        }
        setPending({ ...body.result, id: body.id });
        setPhase("resolving");
        return;
      }
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(SCAN_ERROR_MAP[body?.error ?? ""] ?? "generic");
      setPhase("idle");
    } catch {
      setError("generic");
      setPhase("idle");
    }
  }

  const onResolved = React.useCallback(() => {
    setPending((p) => {
      if (!p) return p;
      setScan(p);
      track({ name: "tool_scan_completed", properties: { slug: SLUG, band: p.band, locale } });
      window.history.replaceState(null, "", resultPathname(p.id, locale));
      shouldScrollRef.current = true;
      setPhase("result");
      return null;
    });
  }, [locale]);

  React.useEffect(() => {
    if (phase !== "result" || !shouldScrollRef.current) return;
    shouldScrollRef.current = false;
    cardRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }, [phase, reduced]);

  function onNewScan(): void {
    setScan(null);
    setPending(null);
    setUrl("");
    setError(null);
    setPhase("idle");
    window.history.replaceState(null, "", toolPathname(locale));
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }

  if (phase === "result" && scan) {
    return (
      <div ref={cardRef} className="scroll-mt-28">
        <ToolHero tool={tool} locale={locale} variant="hidden" />
        <ScoreCard
          result={scan}
          tool={tool}
          locale={locale}
          shareUrl={absoluteUrl(resultPathname(scan.id, locale))}
          onNewScan={mode === "tool" ? onNewScan : undefined}
          newScanHref={mode === "share" ? toolPathname(locale) : undefined}
        />
        <SignalRows checks={scan.checks} signals={tool.signals} locale={locale} />
        <ReportGate scanId={scan.id} band={scan.band} locale={locale} checks={scan.checks} signals={tool.signals} />
      </div>
    );
  }

  const busy = phase === "scanning" || phase === "resolving";
  return (
    <div>
      <ToolHero tool={tool} locale={locale} variant={busy ? "compact" : "full"} />
      <div className="mt-10">
        <ScanBar locale={locale} value={url} onChange={setUrl} onSubmit={onSubmit} busy={busy} error={error} />
        {!busy ? (
          <p className="typography-caption text-ink-500 mt-3">{tool.inputHelp[locale]}</p>
        ) : (
          <ScanStage
            signals={tool.signals}
            locale={locale}
            checks={phase === "resolving" && pending ? pending.checks : null}
            onResolved={onResolved}
          />
        )}
      </div>
      {!busy ? (
        <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 mono text-ink-500 uppercase tracking-widest text-[11px]" aria-label={locale === "tr" ? "Kanıt" : "Proof"}>
          {tool.proof.map((p) => (
            <li key={p.tr}>{p[locale]}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
```

`text-[11px]` yerine `.eyebrow`'un mono ölçüsünü taşıyan mevcut `typography-label` sınıfını kullan (`globals.css`'te tanımlı); ham px yazma.

- [ ] **Step 5: `page.tsx` yeniden yapı**

- `GeoScanForm` içe aktarımı ve `SCAN_FORM_LABELS` silinir; `COPY` içinde `formTitle` kalkar.
- Hero + giriş bölümü tek `section` olur:

```tsx
      <section aria-labelledby="tool-h1" className="tool-hero">
        <div className="ds-container">
          <div className="mx-auto max-w-tool">
            <nav aria-label="Breadcrumb" className="v2-crumbs">
              <ol>
                <li><Link href={`/${loc}`}>INDOLES</Link><span aria-hidden="true">/</span></li>
                <li><Link href={localeHref("/araclar", loc)}>{c.tools}</Link><span aria-hidden="true">/</span></li>
                <li><span aria-current="page">{tool.name[loc]}</span></li>
              </ol>
            </nav>
            <GeoTool locale={loc} tool={tool} mode="tool" />
          </div>
        </div>
      </section>
```

- Eski "Giriş alanı" `section` (`scan-heading`) ve `tool.footnote` satırı kaldırılır. "Nasıl çalışır / Ne ölçüyoruz / SSS / Devamı" bölümleri aynen kalır, yalnız `max-w-prose-editorial` → `max-w-tool` ve ilk bölümün üst boşluğu `pt-24`.
- `v2.css`: `.tool-hero .v2-crumbs ol { justify-content: center; }`.
- Eski bileşenler ve testleri `git rm` ile silinir.

- [ ] **Step 6: Testleri çalıştır**

Run: `pnpm vitest run tests/unit/tools-geo tests/unit/page-metadata.test.ts tests/unit/keyword-coverage.test.ts && pnpm typecheck && pnpm lint`
Expected: PASS; `page-metadata` araç sayfasını hâlâ görür (`PATHS` sabiti yerinde).

- [ ] **Step 7: Commit**

```bash
git add -A src/components/tools src/app/\(marketing\)/\[locale\]/araclar/geo-gorunurluk-denetleyicisi/page.tsx src/styles/v2.css tests/unit/tools-geo
git commit -m "feat(tools): GeoTool durum makinesi — hero, giriş çubuğu, tarama sahnesi ve skor kartı tek adada; eski form/sonuç bileşenleri kaldırıldı"
```

---

### Task 11: Paylaşım sayfası, araçlar dizini, popup bastırma, engellenen site kodu

**Files:**
- Create: `src/lib/tools/geo/share-meta.ts`
- Modify: `src/app/(marketing)/[locale]/araclar/geo-gorunurluk-denetleyicisi/sonuc/[id]/page.tsx`
- Modify: `src/app/(marketing)/[locale]/araclar/page.tsx`
- Modify: `src/lib/popup/popup-context.tsx:23-29,73`
- Modify: `src/lib/tools/geo/safe-fetch.ts` (`fetchScanTargets`), `src/app/api/tools/geo-scan/route.ts` (`GeoScanErrorCode`, catch bloğu)
- Test: `tests/unit/tools-geo/share-meta.test.ts`, `src/lib/popup/__tests__/popup-context.test.tsx` (ek), `tests/unit/tools-geo/safe-fetch.test.ts` (ek), `src/app/api/tools/geo-scan/__tests__/route.test.ts` (ek)

**Interfaces:**
- Produces: `shareTitle(score: number, url: string, locale: Locale): string` ("GEO skoru 55/100 · migros.com.tr" / "GEO score 55/100 · migros.com.tr"); `shareHost(url: string): string` (`www.` düşer); `isAutoPopupSuppressed(pathname: string): boolean` (popup-context.tsx'ten named export); `class TargetBlockedError extends Error` (`name = "TargetBlockedError"`, mesaj `"target-blocked"`); rota hata kodu `"target-blocked"` (HTTP 400).

- [ ] **Step 1: Başarısız testleri yaz**

`tests/unit/tools-geo/share-meta.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { shareHost, shareTitle } from "@/lib/tools/geo/share-meta";

describe("share-meta", () => {
  it("host www. olmadan, şemasız", () => {
    expect(shareHost("https://www.migros.com.tr/tr/kampanya")).toBe("migros.com.tr");
    expect(shareHost("http://ornek.com")).toBe("ornek.com");
    expect(shareHost("bozuk")).toBe("bozuk");
  });
  it("başlık iki dilde skor ve host taşır", () => {
    expect(shareTitle(55, "https://www.migros.com.tr", "tr")).toBe("GEO skoru 55/100 · migros.com.tr");
    expect(shareTitle(55, "https://www.migros.com.tr", "en")).toBe("GEO score 55/100 · migros.com.tr");
  });
});
```

`src/lib/popup/__tests__/popup-context.test.tsx` sonuna:

```tsx
import { isAutoPopupSuppressed } from "../popup-context";

describe("isAutoPopupSuppressed — araç rotaları (spec §7)", () => {
  it("iletişim ve araç rotalarında otomatik tetik yok, diğerlerinde var", () => {
    expect(isAutoPopupSuppressed("/tr/iletisim")).toBe(true);
    expect(isAutoPopupSuppressed("/tr/araclar")).toBe(true);
    expect(isAutoPopupSuppressed("/tr/araclar/geo-gorunurluk-denetleyicisi")).toBe(true);
    expect(isAutoPopupSuppressed("/en/tools/geo-visibility-checker/result/abc")).toBe(true);
    expect(isAutoPopupSuppressed("/tr/hizmetler")).toBe(false);
    expect(isAutoPopupSuppressed("/tr")).toBe(false);
  });
});
```

`tests/unit/tools-geo/safe-fetch.test.ts` içindeki `fetchScanTargets` `describe` bloğuna (mevcut "sayfa 200 değilse target-unreachable" testinin yanına; dosyadaki sahte `fetcher` yardımcı desenini kullan):

```ts
  it.each([401, 403, 429])("sayfa %s dönerse TargetBlockedError fırlatılır (bot koruması, erişilemez DEĞİL)", async (status) => {
    const fetcher = vi.fn(async (u: URL) =>
      u.pathname === "/" ? new Response("engel", { status, headers: { "content-type": "text/html" } })
        : new Response("", { status: 404 }),
    ) as unknown as typeof fetch;
    await expect(fetchScanTargets(new URL("https://ornek.com/"), fetcher)).rejects.toBeInstanceOf(TargetBlockedError);
  });

  it("robots.txt 403 dönerse tarama DÜŞMEZ (yalnız sayfa engeli sert hata)", async () => {
    const fetcher = vi.fn(async (u: URL) =>
      u.pathname === "/robots.txt" ? new Response("", { status: 403 })
        : new Response("<html lang='tr'></html>", { status: 200, headers: { "content-type": "text/html" } }),
    ) as unknown as typeof fetch;
    const t = await fetchScanTargets(new URL("https://ornek.com/"), fetcher);
    expect(t.robotsTxt).toBeNull();
  });
```

`src/app/api/tools/geo-scan/__tests__/route.test.ts` içine (mutlu yol kurulumunu kullanan mevcut desenle; `fetchScanTargets` zaten `vi.fn()`):

```ts
  it("hedef bot korumasıyla engelliyse → 400 target-blocked (kullanıcıyı suçlamaz)", async () => {
    vi.mocked(fetchScanTargets).mockRejectedValueOnce(new TargetBlockedError());
    const res = await POST(makeRequest({ url: "https://www.hepsiburada.com", website: "", elapsedMs: 5000 }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "target-blocked" });
  });
```

(`makeRequest` dosyadaki mevcut istek yardımcısının adıdır; farklıysa o adı kullan. `TargetBlockedError` `@/lib/tools/geo/safe-fetch`ten içe aktarılır — dosya `importActual` ile gerçek modülü koruyor.)

- [ ] **Step 2: Çalıştır, başarısız gör**

Run: `pnpm vitest run tests/unit/tools-geo/share-meta.test.ts src/lib/popup/__tests__/popup-context.test.tsx tests/unit/tools-geo/safe-fetch.test.ts src/app/api/tools/geo-scan/__tests__/route.test.ts`
Expected: FAIL — export'lar yok.

- [ ] **Step 3: `share-meta.ts`**

```ts
import type { Locale } from "@/lib/content/types";

/** Paylaşım metadata yardımcıları — başlık ve (Görev 12) OG yolu tek yerde. */
export function shareHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function shareTitle(score: number, url: string, locale: Locale): string {
  const label = locale === "tr" ? "GEO skoru" : "GEO score";
  return `${label} ${score}/100 · ${shareHost(url)}`;
}
```

- [ ] **Step 4: Paylaşım sayfası**

`sonuc/[id]/page.tsx`: `V2PageHeader` içe aktarımı ve `COPY` kaldırılır; `GeoTool`, `TOOL_UI`, `shareTitle`, `toolPathname`/`localeHref` içe aktarılır. `generateMetadata`:

```ts
  const base = buildMetadata({
    title: shareTitle(result.totalScore, result.url, loc),
    description: tool.seo.description[loc],
    paths: resultPaths(id),
    locale: loc,
  });
  return { ...base, robots: { index: false, follow: true } };
```

Gövde:

```tsx
  const ui = TOOL_UI[loc];
  return (
    <section aria-label={ui.share.banner} className="tool-hero">
      <div className="ds-container">
        <div className="mx-auto max-w-tool">
          <nav aria-label="Breadcrumb" className="v2-crumbs">
            <ol>
              <li><Link href={`/${loc}`}>INDOLES</Link><span aria-hidden="true">/</span></li>
              <li><Link href={localeHref("/araclar", loc)}>{c.tools}</Link><span aria-hidden="true">/</span></li>
              <li><Link href={TOOL_PATH[loc]}>{tool.name[loc]}</Link><span aria-hidden="true">/</span></li>
              <li><span aria-current="page">{c.resultCrumb}</span></li>
            </ol>
          </nav>
          <div className="v2-surface-3 rounded-xl px-4 py-3 mb-8 flex flex-wrap items-center justify-between gap-3">
            <span className="eyebrow-bare mono text-ink-500 uppercase tracking-widest">{ui.share.banner}</span>
            <Link href={TOOL_PATH[loc]} className="btn btn-ghost">
              {ui.share.scanOwn}
              <svg className="arrow" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 11 L11 3 M5 3 H11 V9" stroke="currentColor" strokeWidth="1.4" fill="none" /></svg>
            </Link>
          </div>
          <GeoTool locale={loc} tool={tool} mode="share" initialResult={result} />
        </div>
      </div>
    </section>
  );
```

`c` yalnız `tools` ve `resultCrumb` anahtarlarını taşıyan küçük bir yerel sözlük olarak kalır (`{ tr: { tools: "Araçlar", resultCrumb: "Sonuç" }, en: { tools: "Tools", resultCrumb: "Result" } }`). `TOOL_PATH` sabiti mevcut. `runtime`/`dynamic` export'ları ve `loadScan` aynen kalır.

- [ ] **Step 5: Araçlar dizini**

`araclar/page.tsx` liste bölümü:

```tsx
      <section aria-label={h.tools} className="ds-container py-16">
        <ul className={TOOLS.length === 1 ? "grid grid-cols-1" : "grid grid-cols-1 md:grid-cols-2 gap-6"}>
          {TOOLS.map((t) => (
            <li key={t.slug.tr}>
              <Link href={localeHref(`/araclar/${t.slug[loc]}`, loc)} className="group block v2-surface border border-surface-2 rounded-2xl p-8 md:p-12 h-full">
                <span className="eyebrow">{t.eyebrow[loc]}</span>
                <h2 className="typography-h2 text-ink-900 mt-4">{t.name[loc]}</h2>
                <p className="typography-body-lg text-ink-700 mt-3 max-w-prose-editorial">{t.lede[loc]}</p>
                <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 typography-label mono text-ink-500 uppercase tracking-widest">
                  {t.proof.map((p) => <li key={p.tr}>{p[loc]}</li>)}
                </ul>
                <span className="btn btn-primary mt-8">
                  {h.open}
                  <svg className="arrow" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 11 L11 3 M5 3 H11 V9" stroke="currentColor" strokeWidth="1.4" fill="none" /></svg>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
```

- [ ] **Step 6: Popup bastırma**

`popup-context.tsx`: `CONTACT_PATHNAMES` tanımından sonra:

```ts
/**
 * Araç rotaları (spec 2026-09-02 §7, Burak kararı): araç kendi lead kapısını
 * taşır (e-posta + KVKK); URL yazan ziyaretçinin önüne popup çıkmaz. Önek
 * eşleşmesi: dizin, araç sayfası ve paylaşım sayfası birlikte kapsanır.
 */
const TOOL_PATHNAME_PREFIXES: readonly string[] = (() => {
  const entry = routing.pathnames["/araclar"];
  return routing.locales.map((locale) => {
    const segment = typeof entry === "string" ? entry : entry[locale];
    return `/${locale}${segment}`;
  });
})();

export function isAutoPopupSuppressed(pathname: string): boolean {
  if (CONTACT_PATHNAMES.includes(pathname)) return true;
  return TOOL_PATHNAME_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
```

Effect içindeki `if (pathname && CONTACT_PATHNAMES.includes(pathname)) return;` → `if (pathname && isAutoPopupSuppressed(pathname)) return;`.

- [ ] **Step 7: Engellenen site**

`safe-fetch.ts`, `fetchScanTargets`'tan önce:

```ts
/**
 * Bot koruması (WAF/CDN) sayfayı 401/403/429 ile kapatıyor — site ERİŞİLEBİLİR,
 * bizi (ve büyük ihtimalle GPTBot/ClaudeBot'u) engelliyor. "Adrese
 * ulaşılamadı" demek kullanıcıyı suçlar; rota ayrı kod döner. Yalnız hedef
 * SAYFA için: robots/llms'te aynı durum "yok say"dır.
 */
const BLOCKED_STATUSES = new Set([401, 403, 429]);

export class TargetBlockedError extends Error {
  constructor() {
    super("target-blocked");
    this.name = "TargetBlockedError";
  }
}
```

`fetchScanTargets` içinde `if (!pageRes || pageRes.status !== 200 || ...)` satırından ÖNCE:

```ts
  if (pageRes && BLOCKED_STATUSES.has(pageRes.status)) {
    throw new TargetBlockedError();
  }
```

`geo-scan/route.ts`: `GeoScanErrorCode` birliğine `| "target-blocked"` (yorum: "hedef bot korumasıyla kapalı — 400, kullanıcı hatası değil ama yeniden deneme anlamsız"); `TargetBlockedError` içe aktarılır; catch bloğu:

```ts
  } catch (err) {
    if (err instanceof TargetBlockedError) {
      return errorResponse("target-blocked", 400);
    }
    reportError(err, { route: "tools/geo-scan", step: "fetch" });
    return errorResponse("target-unreachable", 502);
  }
```

- [ ] **Step 8: Testleri çalıştır**

Run: `pnpm vitest run tests/unit/tools-geo src/lib/popup src/app/api/tools && pnpm typecheck && pnpm lint`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/lib/tools/geo/share-meta.ts "src/app/(marketing)/[locale]/araclar" src/lib/popup/popup-context.tsx src/lib/tools/geo/safe-fetch.ts src/app/api/tools/geo-scan/route.ts tests/unit/tools-geo/share-meta.test.ts src/lib/popup/__tests__/popup-context.test.tsx tests/unit/tools-geo/safe-fetch.test.ts src/app/api/tools/geo-scan/__tests__/route.test.ts
git commit -m "feat(tools): paylaşım sayfası aynı ada, araç dizini öne çıkan kart, araç rotalarında popup yok, target-blocked kodu"
```

---

### Task 12: OG kartları — derleme zamanı üretim (ADR-031)

**Files:**
- Modify: `src/components/tools/band-scale.tsx` (`score: number | null` — işaretçisiz kart)
- Modify: `src/lib/tools/geo/share-meta.ts` (`ogImagePath`, `toolOgImagePath`, `OG_GEO_ALT`)
- Modify: `src/lib/seo/metadata.ts` (`PageSeoInput.image?`)
- Create: `scripts/og/geo-card.tsx`, `scripts/generate-og-geo.ts`
- Create: `public/og/geo/{tr,en}/{0..100}.png`, `public/og/geo/{tr,en}/tool.png` (script çıktısı, commit edilir)
- Modify: `package.json` (`"og:geo": "tsx scripts/generate-og-geo.ts"`), `sonuc/[id]/page.tsx` ve araç `page.tsx` `generateMetadata` (`image`)
- Create: `docs/decisions/ADR-031-og-kartlari-derleme-zamani.md`; Modify: `docs/08-seo-i18n-strategy.md` §7.2, `README.md` (tek satır)
- Test: `tests/unit/tools-geo/og-card.test.tsx`, `tests/unit/tools-geo/share-meta.test.ts` (ek), `tests/unit/tools-geo/band-scale.test.tsx` (ek)

**Interfaces:**
- Produces: `ogImagePath(score: number, locale: Locale): string` → `/og/geo/${locale}/${n}.png` (`n` 0-100'e kırpılmış tam sayı); `toolOgImagePath(locale)` → `/og/geo/${locale}/tool.png`; `OG_GEO_ALT: Record<Locale, string>` ("GEO hazırlık skoru {score}/100" / "GEO readiness score {score}/100"); `GeoCard({ score, locale })` ve `ToolCard({ locale })` (`scripts/og/geo-card.tsx`, `React.ReactElement` döner); `buildMetadata({ ..., image?: { url; alt; width?; height? } })`.

- [ ] **Step 1: Başarısız testleri yaz**

`tests/unit/tools-geo/share-meta.test.ts` sonuna:

```ts
import { ogImagePath, toolOgImagePath } from "@/lib/tools/geo/share-meta";

describe("ogImagePath", () => {
  it("skoru 0-100'e kırpıp tam sayıya yuvarlar, locale klasörüne gider", () => {
    expect(ogImagePath(55, "tr")).toBe("/og/geo/tr/55.png");
    expect(ogImagePath(54.6, "en")).toBe("/og/geo/en/55.png");
    expect(ogImagePath(101, "tr")).toBe("/og/geo/tr/100.png");
    expect(ogImagePath(-3, "tr")).toBe("/og/geo/tr/0.png");
    expect(toolOgImagePath("en")).toBe("/og/geo/en/tool.png");
  });
});
```

`tests/unit/tools-geo/band-scale.test.tsx` sonuna:

```tsx
  it("score null ise işaretçi çizilmez, hiçbir bölme güçlü renkte değil", () => {
    const { container } = render(<BandScale score={null} labels={labels} ariaLabel="x" />);
    expect(container.querySelector('[data-part="marker"]')).toBeNull();
    expect(container.querySelectorAll("rect[data-band]")[1]?.getAttribute("fill")).toBe(BAND_COLORS["gelismeye-acik"].soft);
  });
```

`tests/unit/tools-geo/og-card.test.tsx`:

```tsx
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GeoCard, ToolCard } from "../../../scripts/og/geo-card";

describe("OG kart şablonu", () => {
  it("skor kartı: skor, bant etiketi, ölçek ve işaretçi; adres YOK", () => {
    const html = renderToStaticMarkup(<GeoCard score={55} locale="tr" />);
    expect(html).toContain(">55<");
    expect(html).toContain("Gelişmeye açık");
    expect((html.match(/data-band=/g) ?? []).length).toBe(4);
    expect(html).toContain('data-part="marker"');
    expect(html).toContain("GEO Görünürlük Denetleyicisi");
    expect(html).not.toContain("http");
    expect(html).toContain("width:1200px");
  });

  it("araç kartı: ad, lede, kanıt şeridi; işaretçi yok", () => {
    const html = renderToStaticMarkup(<ToolCard locale="en" />);
    expect(html).toContain("GEO Visibility Checker");
    expect(html).toContain("5 signals");
    expect(html).not.toContain('data-part="marker"');
  });
});
```

`html).not.toContain("http")` şablonun font `<link>`i `<head>` içinde `GeoCard`ın DIŞINDA (script'in sardığı kabukta) olduğu için geçer — kart bileşeni yalnız `<body>` içeriğini döner.

- [ ] **Step 2: Çalıştır, başarısız gör**

Run: `pnpm vitest run tests/unit/tools-geo/share-meta.test.ts tests/unit/tools-geo/band-scale.test.tsx tests/unit/tools-geo/og-card.test.tsx`
Expected: FAIL.

- [ ] **Step 3: `BandScale` — `score: number | null`**

`band-scale.tsx`: prop tipi `score: number | null`; `const active = score === null ? null : bandFor(score);`; `cx` yalnız `score !== null` iken hesaplanır; `<circle data-part="marker" …/>` `score !== null ? … : null`. Task 5 testleri değişmeden geçer.

- [ ] **Step 4: `share-meta.ts` ekleri ve `metadata.ts`**

```ts
export function ogImagePath(score: number, locale: Locale): string {
  const n = Math.max(0, Math.min(100, Math.round(score)));
  return `/og/geo/${locale}/${n}.png`;
}
export function toolOgImagePath(locale: Locale): string {
  return `/og/geo/${locale}/tool.png`;
}
export const OG_GEO_ALT: Record<Locale, string> = {
  tr: "GEO hazırlık skoru {score}/100",
  en: "GEO readiness score {score}/100",
};
```

`metadata.ts`: `PageSeoInput`'a `image?: { url: string; alt: string; width?: number; height?: number }`; `buildMetadata` içinde:

```ts
  const og = image
    ? { url: image.url, width: image.width ?? OG_IMAGE.width, height: image.height ?? OG_IMAGE.height, alt: image.alt }
    : ogImage(locale);
  // openGraph.images: [og]  ·  twitter.images: [og.url]
```

Modül üstü yorum güncellenir: "Sayfa başına farklı OG görseli DERLEME ZAMANINDA üretilip `public/`e konur (ADR-031); worker'da üretim yok."

- [ ] **Step 5: `scripts/og/geo-card.tsx`**

```tsx
import * as React from "react";
import { BandScale } from "@/components/tools/band-scale";
import { BAND_LABELS } from "@/components/tools/copy";
import { TOOLS } from "@/lib/content/tools";
import { neutral, teal } from "@/lib/design/tokens";
import { BAND_ORDER, bandFor, type GeoBand } from "@/lib/tools/geo/types";
import type { Locale } from "@/lib/content/types";

/**
 * OG kartı şablonu (ADR-031) — 1200×630, satır içi stil (Tailwind yok;
 * Playwright boş bir sayfada basar). Taranan adres kartta YOK: `og:title`
 * taşır, böylece 101 kart yeter. Renkler tokens.ts'ten.
 */
const W = 1200;
const H = 630;
const DISPLAY = "'Lexend', 'Inter', system-ui, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: W, height: H, background: neutral.bg, color: neutral.ink[900], fontFamily: DISPLAY, padding: 64, boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative" }}>
      {children}
      <div style={{ position: "absolute", left: 64, bottom: 56, fontFamily: MONO, fontSize: 20, letterSpacing: 4, textTransform: "uppercase", color: neutral.ink[500] }}>
        INDOLES · indoles.com.tr
      </div>
    </div>
  );
}

export function GeoCard({ score, locale }: { score: number; locale: Locale }) {
  const tool = TOOLS[0]!;
  const band: GeoBand = bandFor(score);
  const labels = Object.fromEntries(BAND_ORDER.map((b) => [b, BAND_LABELS[b][locale]])) as Record<GeoBand, string>;
  return (
    <Shell>
      <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 5, textTransform: "uppercase", color: teal[700] }}>
        {tool.name[locale]}
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 32 }}>
        <div style={{ fontSize: 260, fontWeight: 600, lineHeight: 0.85, letterSpacing: -12 }}>{score}</div>
        <div style={{ paddingBottom: 18 }}>
          <div style={{ fontSize: 44, color: neutral.ink[500] }}>/100</div>
          <div style={{ marginTop: 16, display: "inline-block", padding: "10px 22px", borderRadius: 999, border: `2px solid ${teal[700]}`, fontFamily: MONO, fontSize: 24, letterSpacing: 4, textTransform: "uppercase" }}>
            {BAND_LABELS[band][locale]}
          </div>
        </div>
      </div>
      <div style={{ width: 1072, marginBottom: 48 }}>
        <BandScale score={score} labels={labels} ariaLabel="" />
      </div>
    </Shell>
  );
}

export function ToolCard({ locale }: { locale: Locale }) {
  const tool = TOOLS[0]!;
  const labels = Object.fromEntries(BAND_ORDER.map((b) => [b, BAND_LABELS[b][locale]])) as Record<GeoBand, string>;
  return (
    <Shell>
      <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 5, textTransform: "uppercase", color: teal[700] }}>{tool.eyebrow[locale]}</div>
      <div>
        <div style={{ fontSize: 88, fontWeight: 600, lineHeight: 1.02, letterSpacing: -3, maxWidth: 1000 }}>{tool.name[locale]}</div>
        <div style={{ marginTop: 20, fontSize: 30, lineHeight: 1.35, color: neutral.ink[700], maxWidth: 960, fontFamily: "'Inter', system-ui, sans-serif" }}>{tool.lede[locale]}</div>
        <div style={{ marginTop: 28, display: "flex", gap: 36, fontFamily: MONO, fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: neutral.ink[500] }}>
          {tool.proof.map((p) => <span key={p.tr}>{p[locale]}</span>)}
        </div>
      </div>
      <div style={{ width: 1072, marginBottom: 48 }}>
        <BandScale score={null} labels={labels} ariaLabel="" />
      </div>
    </Shell>
  );
}
```

`neutral.ink[700]` gibi alt anahtarlar `tokens.ts:51` yapısına göre uyarlanır (Task 5 notu).

- [ ] **Step 6: `scripts/generate-og-geo.ts`**

```ts
/**
 * OG kartları — derleme zamanı üretim (ADR-031). Worker'da üretim yok:
 * `@vercel/og` paketi 3 MB plan sınırını aşıyordu (ADR-024). Bu script
 * geliştirme makinesinde çalışır, çıktı repoya girer; şablon değişmedikçe
 * yeniden çalıştırılmaz. Çalıştırma: `pnpm og:geo`
 */
import { mkdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { GeoCard, ToolCard } from "./og/geo-card";

const OUT = path.join(process.cwd(), "public", "og", "geo");
const LOCALES = ["tr", "en"] as const;
const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Lexend:wght@600&family=Inter:wght@400;500&family=JetBrains+Mono:wght@500&display=block";
const SIZE_WARN_BYTES = 40 * 1024;

function shell(body: string): string {
  return `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="${FONT_LINK}"><style>html,body{margin:0;padding:0;background:#FAFAF7}</style></head><body>${body}</body></html>`;
}

async function main(): Promise<void> {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  let oversized = 0;

  async function shoot(file: string, element: ReturnType<typeof createElement>): Promise<void> {
    await page.setContent(shell(renderToStaticMarkup(element)), { waitUntil: "networkidle" });
    await page.evaluate(() => (document as unknown as { fonts: { ready: Promise<void> } }).fonts.ready);
    const png = await page.screenshot({ type: "png", clip: { x: 0, y: 0, width: 1200, height: 630 } });
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, png);
    if (statSync(file).size > SIZE_WARN_BYTES) oversized += 1;
  }

  for (const locale of LOCALES) {
    for (let score = 0; score <= 100; score += 1) {
      await shoot(path.join(OUT, locale, `${score}.png`), createElement(GeoCard, { score, locale }));
    }
    await shoot(path.join(OUT, locale, "tool.png"), createElement(ToolCard, { locale }));
    console.log(`[og:geo] ${locale}: 102 kart yazıldı`);
  }

  await browser.close();
  if (oversized > 0) {
    console.warn(`[og:geo] ${oversized} kart 40 KB üstünde — spec §12: JPEG kalite 85 değerlendirilir`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

`package.json` scripts: `"og:geo": "tsx scripts/generate-og-geo.ts"`. `tsx` JSX'i `tsconfig.json`daki `"jsx": "preserve"` ile derleyemezse `scripts/og/tsconfig.json` oluştur: `{ "extends": "../../tsconfig.json", "compilerOptions": { "jsx": "react-jsx" } }` ve script'i `tsx --tsconfig scripts/og/tsconfig.json scripts/generate-og-geo.ts` olarak çalıştır. `@/` takma adı `tsconfig.json` `paths`inden çözülür (tsx destekler).

- [ ] **Step 7: Üret ve doğrula**

Run: `pnpm og:geo && ls public/og/geo/tr | wc -l && ls public/og/geo/en | wc -l && du -sh public/og/geo`
Expected: iki klasörde 102'şer dosya; toplam ≲ 8 MB. Örnek kartı gözle kontrol et: `open public/og/geo/tr/55.png` — skor, bant pill'i, ölçek işaretçisi 55'te, fontlar yüklü (fallback sans değil). Fontlar yüklenmemişse `document.fonts.ready` beklemesinden sonra `await page.waitForTimeout(300)` ekle.

- [ ] **Step 8: Sayfaların metadata'sı**

`sonuc/[id]/page.tsx` `generateMetadata`: `buildMetadata({ …, image: { url: ogImagePath(result.totalScore, loc), alt: fill(OG_GEO_ALT[loc], { score: result.totalScore }) } })`. Araç `page.tsx`: `image: { url: toolOgImagePath(loc), alt: tool.name[loc] }`.

- [ ] **Step 9: ADR-031, docs/08 §7.2, README**

`docs/decisions/ADR-031-og-kartlari-derleme-zamani.md` (ADR-030 başlık biçimiyle):

```markdown
# ADR-031 — OG kartları derleme zamanında üretilir

- **Statü:** Kabul edildi
- **Tarih:** 2026-09-02
- **Karar veren:** Burak Arda Özgül
- **Bağlam:** `docs/superpowers/specs/2026-09-02-geo-araci-yeniden-tasarim-design.md` §9
- **İlgili:** ADR-024 (Cloudflare Workers, 3 MB paket sınırı; `@vercel/og` kaldırıldı) · ADR-030 (`/araclar`)
- **Etkilenen dosyalar:** `scripts/generate-og-geo.ts`, `scripts/og/geo-card.tsx`, `public/og/geo/**`, `src/lib/seo/metadata.ts`, `src/lib/tools/geo/share-meta.ts`, `docs/08-seo-i18n-strategy.md`

## Bağlam
Paylaşılan GEO skoru PR hikâyesinin kendisidir; sosyal kartta skorun görünmesi gerekir. İstek başına üretim (`@vercel/og` + `fontkit`, ~2,2 MB) Worker paketini 3 MB plan sınırının üstüne taşıyordu (ADR-024).

## Karar
Kartlar derleme zamanında, geliştirme makinesinde Playwright ile (`pnpm og:geo`) üretilir ve `public/og/geo/{tr,en}/{0..100}.png` + `tool.png` olarak repoya girer. Statik varlıklar Worker paketine sayılmaz. Taranan adres kartta yoktur; `og:title` taşır — böylece skor başına tek kart yeter (202 + 2 dosya). Şablon (`scripts/og/geo-card.tsx`) sayfadaki `BandScale` bileşenini kullanır; eşikler ve renkler tek kaynaktan gelir.

## Sonuçlar
- Artı: Worker boyutu değişmez; kart üretim maliyeti sıfır; şablon sayfayla aynı geometriyi çizer.
- Eksi: Şablon değişince script yeniden çalıştırılıp çıktı commit edilmeli; ~6-8 MB statik varlık.
- Yeni araç veya yeni skor ölçeği geldiğinde aynı yol izlenir; istek başına üretim yalnız plan sınırı değişirse yeniden değerlendirilir.
```

`docs/08` §7.2 başlığı "OG görselleri — derleme zamanı üretim (ADR-031)" olur; içerik: site geneli tek marka kartı (`public/opengraph-image.png`), araç ve paylaşım sayfaları için `public/og/geo/**` (script, komut, kural: şablon değişince yeniden üret). `README.md`'ye script tablosuna tek satır: `pnpm og:geo — GEO paylaşım kartlarını üretir (şablon değişince)`.

- [ ] **Step 10: Testler ve kapılar**

Run: `pnpm vitest run tests/unit/tools-geo tests/unit/page-metadata.test.ts && pnpm typecheck && pnpm lint`
Expected: PASS.

- [ ] **Step 11: Commit**

```bash
git add scripts/generate-og-geo.ts scripts/og public/og/geo src/lib/seo/metadata.ts src/lib/tools/geo/share-meta.ts src/components/tools/band-scale.tsx "src/app/(marketing)/[locale]/araclar" package.json docs/decisions/ADR-031-og-kartlari-derleme-zamani.md docs/08-seo-i18n-strategy.md README.md tests/unit/tools-geo
git commit -m "feat(seo): GEO skor OG kartları derleme zamanında üretilir (ADR-031) — 202 kart + araç kartı"
```

---

### Task 13: Uçtan uca testler, görsel tur, blob kontrast ölçümü, doküman senkronu, kapılar

**Files:**
- Modify: `tests/e2e/geo-tool.spec.ts`, `tests/e2e/no-horizontal-overflow.spec.ts:16-27`
- Modify: `docs/04-design-system-principles.md` §12.10 (araç hero tablosu + kontrast tablosu), `docs/12-analytics-measurement.md:65-67`, `CLAUDE.md` §7 (`components/tools/` satırı), `docs/strateji/INDOLES-Organik-Strateji-SEO-GEO-v1.md` (v1.12 changelog), `active_context.md`
- Modify (gerekirse, ölçüme göre): `src/lib/v2/anim-config.ts` `BLOB_TOOL_HERO`

**Interfaces:**
- Consumes: Task 10-12'nin tamamı; `tests/e2e/geo-tool.spec.ts`'teki mevcut mock kurulumu (`SCAN_RESULT`, `REPORT_CHECKS`, `beforeEach` route'ları).

- [ ] **Step 1: E2E spec'i yeni akışa göre yeniden yaz**

`tests/e2e/geo-tool.spec.ts` — üst mock kurulumu kalır (`SCAN_CHECKS`'e her kaleme `findingsCount: 1` ekle), testler:

```ts
test("tarama → sahne → skor kartı: URL güncellenir, kart görünür alana kayar, bağlantı kopyalanır", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto(TOOL_PATH);
  await page.getByLabel("Site adresi").fill("indoles.com.tr");
  await page.waitForTimeout(2100); // süre tuzağı: çubuk 2 sn'ye kadar bekler
  await page.getByRole("button", { name: "Denetle" }).click();

  // Tarama sahnesi satırları göründü (yanıt mock'lu olsa da satırlar çözülerek geçer)
  await expect(page.locator(".tool-stage-row").first()).toBeVisible();

  const score = page.locator("[data-part='score']");
  await expect(score).toHaveText(`${TOTAL_SCORE}`, { timeout: 10_000 });
  await expect(page.getByText("İyi", { exact: true })).toBeVisible();
  await expect(page.locator("section[aria-labelledby='score-heading']")).toBeInViewport();
  await expect(page).toHaveURL(new RegExp(`${SHARE_PATH}$`));

  for (const title of ["AI erişimi", "llms.txt", "Yapısal veri", "Dil sinyalleri", "Soru başlıkları"]) {
    await expect(page.getByRole("heading", { name: title, level: 3 })).toBeVisible();
  }

  await page.getByRole("button", { name: "Bağlantıyı kopyala" }).click();
  await expect(page.getByRole("button", { name: "Kopyalandı" })).toBeVisible();
  const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboardText.endsWith(SHARE_PATH)).toBe(true);
});

test("kilit kartı: rızasız gönderim uyarır, rızalı gönderim düzeltme listesini açar — kalanlar önce", async ({ page }) => {
  await page.goto(TOOL_PATH);
  await page.getByLabel("Site adresi").fill("https://www.indoles.com.tr/tr");
  await page.waitForTimeout(2100);
  await page.getByRole("button", { name: "Denetle" }).click();
  await expect(page.locator("[data-part='score']")).toHaveText(`${TOTAL_SCORE}`, { timeout: 10_000 });

  await expect(page.getByText("Kilitli")).toBeVisible();
  const reportSubmit = page.getByRole("button", { name: "Raporu gönder" });
  await page.getByLabel("E-posta adresi", { exact: true }).fill("burak@indoles.com.tr");

  let reportRequests = 0;
  page.on("request", (req) => { if (req.url().includes("/api/tools/geo-report")) reportRequests += 1; });
  await reportSubmit.click();
  await expect(page.getByRole("alert")).toContainText("KVKK onayını işaretleyin");
  expect(reportRequests).toBe(0);

  await page.getByLabel(/KVKK kapsamında verilerimin işlenmesini kabul ediyorum/).check();
  await reportSubmit.click();
  await expect(page.getByRole("heading", { name: "Düzeltme listesi" })).toBeVisible();
  await expect(page.getByText("Raporun kopyası e-postanızda.")).toBeVisible();
  // İlk madde en çok puan kaybettiren kalem: question-h2 (15/25 → 10 kayıp)
  const first = page.getByRole("list").filter({ hasText: "01" }).getByRole("listitem").first();
  await expect(first).toContainText("Soru başlıkları");
  await expect(page.getByText("question-h2 için öncelikli aksiyon.")).toBeVisible();
  expect(reportRequests).toBe(1);
});

test("engellenen site: target-blocked mesajı, kullanıcıyı suçlamaz", async ({ page }) => {
  await page.route("**/api/tools/geo-scan", (route) =>
    route.fulfill({ status: 400, contentType: "application/json", body: JSON.stringify({ error: "target-blocked" }) }),
  );
  await page.goto(TOOL_PATH);
  await page.getByLabel("Site adresi").fill("hepsiburada.com");
  await page.waitForTimeout(2100);
  await page.getByRole("button", { name: "Denetle" }).click();
  await expect(page.getByRole("alert")).toContainText("otomatik istekleri engelliyor");
  await expect(page.getByLabel("Site adresi")).toBeEnabled();
});

test("araç rotasında persona popup'ı otomatik açılmaz", async ({ page }) => {
  await page.goto(TOOL_PATH);
  await page.waitForTimeout(6000);
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
```

Mevcut `test.skip("paylaşım URL'i doğrudan ziyaret …")` aynen kalır (D1 dev-harness boşluğu değişmedi). `no-horizontal-overflow.spec.ts` `ROUTES` dizisine `"/tr/araclar"` ve `"/tr/araclar/geo-gorunurluk-denetleyicisi"` eklenir.

Run: `pnpm test:e2e tests/e2e/geo-tool.spec.ts tests/e2e/no-horizontal-overflow.spec.ts`
Expected: PASS (`next dev` 3100'de otomatik kalkar).

- [ ] **Step 2: Üretim önizlemesi ve görsel tur**

Run (arka planda): `pnpm cf:build && npx wrangler dev --port 3200` (`.dev.vars` mevcut; Turnstile bayrağı kapalı — canlı konfigürasyon).

Ekran görüntüsü turu: `.superpowers/ux-review/shots.spec.mjs` (mevcut, izlenmeyen dosya) `SCAN_TARGET=https://www.migros.com.tr MOCK_SCAN=… MOCK_CHECKS=…` ile çalıştırılır; 1440 / 768 / 390 çıktıları incelenir. Ek olarak 375 ve 1536 için `page.setViewportSize` ile iki fold görüntüsü daha alınır. Kontrol listesi: giriş çubuğu fold'da ve sayfanın en büyük öğesi; blob çekirdeği çubuğun arkasında, başlık temiz kremde; sahne satırları hizalı; skor kartı sonuç anında görünür alanda; 5 satır çubuk uzunlukları 25/15/20/15/25 oranında; kilit kartı iki sütun (≥768) / tek sütun (390); paylaşım sayfası araç sayfasıyla aynı dil; hiçbir viewport'ta yatay taşma.

Her bulgu bu görevde düzeltilir (CSS/anim-config); bileşen mantığı değişiyorsa ilgili birim testi güncellenir.

- [ ] **Step 3: Blob kontrast ölçümü (docs/04 §12.10 protokolü)**

Playwright script'i (`.superpowers/ux-review/contrast.spec.mjs`, izlenmez): her viewport'ta (375, 768, 1280, 1536) sayfayı açar, `document.querySelectorAll('.tool-hero *:not(canvas)')` öğelerine `visibility:hidden` verir (canvas kalır), ekran görüntüsünü alır; ardından hero metin dikdörtgenlerini (`#tool-h1`, `.eyebrow`, lede `p`, kanıt şeridi `ul`, `.scan-bar` altındaki yardım satırı) ölçer. Görüntüyü `page.setContent('<img src="data:image/png;base64,…">')` ile yeni sayfaya yükleyip `<canvas>` `getImageData` ile her dikdörtgenin en koyu pikselinin bağıl parlaklığını hesaplar; metin rengiyle (ink-900 `#000000`, ink-700 `#1A1A1A`, teal-700 `#2C5566`, ink-500 `#6B7880`) kontrast oranı = (L1 + 0.05) / (L2 + 0.05). Eşik 4.5:1. Karşılanmıyorsa `BLOB_TOOL_HERO.opacity` 0.05 adımlarla düşürülür veya `y` çekirdek çubuğun arkasına gelecek şekilde kaydırılır; ölçüm yinelenir. Sonuç tablosu `docs/04` §12.10'a yazılır (tarih 2026-09-02): araç hero tablosunda opaklık 0.55 → ölçülen değer, "camın altındaki küre" açıklaması, sonuç durumu satırı ("skor kartı `.v2-surface` — blob 0.85'te kartın arkasında, kart metni opak beyaz kuyuda değil yarı saydam yüzeyde: kart içi en düşük kontrast da tabloya girer").

- [ ] **Step 4: Doküman senkronu**

- `docs/12` tablo: `tool_used`/`tool_scan_completed` kaynağı `components/tools/geo-tool.tsx`, `tool_report_requested` kaynağı `components/tools/report-gate.tsx`.
- `CLAUDE.md` §7: `components/tools/` satırı → "GEO araç adası (geo-tool · scan-bar · scan-stage · score-card · band-scale · signal-rows · report-gate · findings-list · copy) — ADR-030/031".
- Strateji changelog `v1.12` (2026-09-02): "Araç ④ UI v2 — tek sayfa üç durum, skor kartı ve ölçek, kilitli düzeltme listesi, derleme zamanı OG skor kartları (ADR-031), araç rotalarında popup yok; hedef kelimeler değişmedi (`TARGETS_TOOLS` yeşil)". Başlık ve "Sürüm" satırı v1.12.
- `active_context.md` başına yeni durum bloğu: ne değişti, hangi kapılar geçti, deploy bekliyor (yalnız Burak sinyaliyle).
- `docs/04` §12.10 (Step 3 ölçümüyle birlikte).

- [ ] **Step 5: Kapılar**

Run: `pnpm typecheck && pnpm lint && pnpm test && pnpm build && pnpm seo:audit && pnpm cf:build && npx wrangler deploy --dry-run --outdir /tmp/wrangler-dry 2>&1 | tail -5`
Expected: typecheck/lint temiz · test tamamı yeşil · build başarılı · `seo:audit` 0 FAIL (araç ve paylaşım sayfalarında `og:image` yeni yollar) · worker gzip < 3 MB (`cf:build` çıktısındaki "Total Upload" satırı) · dry-run exit 0.

- [ ] **Step 6: Commit**

```bash
git add tests/e2e/geo-tool.spec.ts tests/e2e/no-horizontal-overflow.spec.ts docs/04-design-system-principles.md docs/12-analytics-measurement.md CLAUDE.md docs/strateji/INDOLES-Organik-Strateji-SEO-GEO-v1.md active_context.md src/lib/v2/anim-config.ts
git commit -m "test(tools): araç UI v2 uçtan uca akış, görsel tur ve blob kontrast ölçümü; doküman senkronu (docs/04 §12.10, docs/12, strateji v1.12)"
```

---

## Plan öz-denetimi (yazar notu)

- **Spec kapsaması:** §2 (Task 10), §3 (2, 4, 7, 10), §4 (8), §5 (5, 6), §6 (9, 1), §7 (11), §8 (3), §9 (12), §10 (2, 12, 13), §11 (her görev + 13), §12 açık noktalar (12 Step 7 boyut uyarısı; "~5 saniye" yerine kanıt şeridinde "Saniyeler içinde" seçildi — ölçüm ihtiyacı kalktı).
- **Tip tutarlılığı:** `ScanSubmission` (7 → 10), `ScanErrorKind`/`SCAN_ERROR_MAP` (4 → 7, 10), `findingsCount` (1 → 9), `BAND_ORDER`/`BAND_THRESHOLDS` (1 → 5, 12), `BandScale.score: number | null` (5, 12'de genişletilir), `resultPathname`/`toolPathname` (10 → 11), `shareTitle`/`ogImagePath` (11 → 12), `TOOL_UI` anahtarları (4 → 5-11).
- **Sıralama bağımlılığı:** 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 13; 3 ve 4 birbirinden bağımsızdır, 5-9 yalnız 1-4'e bağlıdır (paralel dağıtılabilir), 10 hepsine bağlıdır.
