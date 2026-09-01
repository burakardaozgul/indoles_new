# GEO Görünürlük Denetleyicisi Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** URL girilen, 5 kalemde 100 puanlık GEO hazırlık skoru üreten, basit sonucu herkese açık, detaylı raporu e-posta karşılığı gönderen public araç — `/tr/araclar/geo-gorunurluk-denetleyicisi`.

**Architecture:** Worker-native: saf kural motoru (`src/lib/tools/geo/`, fetch'ten ayrık, fixture'la test edilir) + SSRF-korumalı fetch katmanı + D1 kalıcılık (paylaşım URL'i, lead, hız sayacı) + SMTP rapor. Tam DOM parse yok — hedefli regex/`JSON.parse` (ücretsiz Workers ~10 ms CPU sınırı).

**Tech Stack:** Next.js 15 App Router (SSG + route handlers), Cloudflare Workers + D1, worker-mailer + React Email, Turnstile, Vitest + Playwright.

**Spec:** `docs/superpowers/specs/2026-09-01-geo-gorunurluk-denetleyicisi-design.md` (bu plan spec'ten argüman alır; uygulayıcı ikisini birlikte okur).

## Global Constraints

- **Yeni npm bağımlılığı YOK.** id üretimi `crypto.randomUUID()`; parse hedefli regex + `JSON.parse`. cheerio runtime'a girmez.
- **Kullanıcıya görünen her TR/EN metin** üretilirken `indoles-brand-voice` skill'i çağrılır; ünlem/emoji/hype yasak; EN metin İngiliz imlası (`optimisation`) — tek istisna kanonik terim `generative engine optimization` (test korumalı).
- **İçerikteki iç linkler kanonik TR path** ile yazılır (`/araclar/...`, `/hizmetler/...`, `/yazilar/...`, `/vakalar/...`); locale çözümü `resolveInlineHref`/`localeHref` yapar.
- **TR+EN parite zorunlu** — her `Localized<string>` iki dili birlikte taşır (typecheck zorlar).
- Worker gzip bütçesi ~3 MB (ücretsiz plan); her görev sonunda `pnpm typecheck && pnpm test` yeşil; commit mesajları Türkçe `<type>: <açıklama>` + `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>` footer'ı.
- Rezervasyon dosyalarına (`src/lib/booking/`, `emails/Booking*`, mevcut migration'lar) dokunulmaz; D1 aynı veritabanı, YENİ migration dosyası.
- KVKK: ham IP saklanmaz (SHA-256 + gizli tuz); e-posta yalnız açık rızayla alınır (`z.literal(true)`).

## Dosya Haritası

```
src/lib/tools/geo/
  types.ts        — tip sözleşmesi + bant fonksiyonu (Görev 1)
  ai-access.ts    — robots.txt AI erişim kalemi (Görev 2)
  llms-txt.ts     — llms.txt kalemi (Görev 3)
  json-ld.ts      — yapısal veri kalemi (Görev 4)
  lang-signals.ts — dil sinyalleri kalemi (Görev 5)
  question-h2.ts  — soru-H2 kalemi (Görev 6)
  engine.ts       — runGeoScan birleştirici (Görev 6)
  safe-fetch.ts   — SSRF korumalı fetch (Görev 7)
  repository.ts   — D1 erişimi + hız sayacı (Görev 8)
tests/unit/tools-geo/*.test.ts (görevlerle birlikte)
tests/fixtures/geo/*.html|txt (Görev 2-6)
migrations/0003_tool_scans.sql (Görev 8)
src/app/api/tools/geo-scan/route.ts (Görev 9)
src/app/api/tools/geo-report/route.ts (Görev 12)
src/app/(marketing)/[locale]/araclar/page.tsx (Görev 10)
src/app/(marketing)/[locale]/araclar/geo-gorunurluk-denetleyicisi/page.tsx (Görev 10)
src/app/(marketing)/[locale]/araclar/geo-gorunurluk-denetleyicisi/sonuc/[id]/page.tsx (Görev 11)
src/components/tools/geo-scan-form.tsx + geo-result.tsx + geo-report-form.tsx (Görev 10-12)
src/lib/content/tools.ts — araç sayfası copy katmanı (Görev 10)
emails/GeoReportEmail.tsx (Görev 12)
docs/decisions/ADR-030-araclar-worker-native.md (Görev 14)
```

---

### Görev 1: Motor tip sözleşmesi ve skor bandı

**Files:**
- Create: `src/lib/tools/geo/types.ts`
- Test: `tests/unit/tools-geo/types.test.ts`

**Interfaces:**
- Consumes: `Localized<string>` (`src/lib/content/types.ts`)
- Produces (sonraki TÜM görevler buna dayanır):

```ts
export type GeoCheckId = "ai-access" | "llms-txt" | "json-ld" | "lang-signals" | "question-h2";
export type GeoCheckStatus = "pass" | "partial" | "fail";
export type GeoBand = "zayif" | "gelismeye-acik" | "iyi" | "oncu";
export type GeoCheckResult = {
  id: GeoCheckId; score: number; max: number; status: GeoCheckStatus;
  summary: Localized<string>; findings: Array<Localized<string>>;
};
export type GeoScanInput = { url: string; pageHtml: string; robotsTxt: string | null; llmsTxt: string | null };
export type GeoScanResult = {
  id: string; url: string; totalScore: number; band: GeoBand;
  checks: GeoCheckResult[]; scannedAt: string;
};
export function bandFor(total: number): GeoBand; // 0-39 zayif · 40-69 gelismeye-acik · 70-89 iyi · 90+ oncu
export function statusFor(score: number, max: number): GeoCheckStatus; // 0 → fail · ==max → pass · arası partial
```

- [ ] **Adım 1: Düşen testi yaz** — `tests/unit/tools-geo/types.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { bandFor, statusFor } from "@/lib/tools/geo/types";

describe("bandFor", () => {
  it.each([[0,"zayif"],[39,"zayif"],[40,"gelismeye-acik"],[69,"gelismeye-acik"],[70,"iyi"],[89,"iyi"],[90,"oncu"],[100,"oncu"]] as const)(
    "%i → %s", (n, band) => expect(bandFor(n)).toBe(band)
  );
});
describe("statusFor", () => {
  it("0 → fail, tavan → pass, arası → partial", () => {
    expect(statusFor(0, 25)).toBe("fail");
    expect(statusFor(25, 25)).toBe("pass");
    expect(statusFor(10, 25)).toBe("partial");
  });
});
```

- [ ] **Adım 2:** `pnpm vitest run tests/unit/tools-geo/types.test.ts` → FAIL (modül yok)
- [ ] **Adım 3:** `types.ts`'i yukarıdaki tiplerle + iki fonksiyonun minimal implementasyonuyla yaz (dosya başına Türkçe yorum: sözleşmenin taşınabilirlik amacı — spec §2)
- [ ] **Adım 4:** Testi çalıştır → PASS; `pnpm typecheck` temiz
- [ ] **Adım 5:** Commit: `feat(tools): GEO motoru tip sözleşmesi ve skor bantları`

---

### Görev 2: AI erişimi kalemi (robots.txt çözümü) — 25 puan

**Files:**
- Create: `src/lib/tools/geo/ai-access.ts` · `tests/fixtures/geo/robots-*.txt` (4 fixture)
- Test: `tests/unit/tools-geo/ai-access.test.ts`

**Interfaces:**
- Produces: `checkAiAccess(robotsTxt: string | null, urlPath: string): GeoCheckResult` · `export const AI_CRAWLERS = ["GPTBot","OAI-SearchBot","ChatGPT-User","ClaudeBot","Claude-User","PerplexityBot","Perplexity-User","Google-Extended","Applebot-Extended","CCBot"] as const;`

**Çözüm kuralı (robots standardı, basitleştirilmiş-deterministik):** robots.txt satır satır ayrıştırılır → `User-agent` grupları (ardışık UA satırları tek grup). Her crawler için: adı birebir (case-insensitive) geçen grup varsa o, yoksa `*` grubu. Grup içinde `urlPath` için **en uzun eşleşen** `Allow`/`Disallow` kuralı kazanır (uzunluk eşitse Allow); hiçbir kural eşleşmezse izinli. `$` ve `*` joker desteklenir (regex'e çevrilir, diğer karakterler escape edilir).

**Puan:** izinli bot sayısı `k` → `score = Math.round(25 * k / 10)`. `robotsTxt === null` → 25 + findings'e "izinli ama beyansız" notu.

- [ ] **Adım 1: Fixture'ları yaz**
  - `robots-none` → testte `null` geçilir
  - `robots-open.txt`: `User-agent: *\nAllow: /`
  - `robots-blocked.txt`: 10 crawler'ın her birine `Disallow: /` bloğu
  - `robots-mixed.txt`: `User-agent: GPTBot\nDisallow: /\n\nUser-agent: ClaudeBot\nDisallow: /private/\nAllow: /\n\nUser-agent: *\nAllow: /`
- [ ] **Adım 2: Düşen testleri yaz**

```ts
import { readFileSync } from "node:fs";
import { checkAiAccess, AI_CRAWLERS } from "@/lib/tools/geo/ai-access";
const fx = (n: string) => readFileSync(`tests/fixtures/geo/${n}`, "utf8");

it("robots yoksa tam puan + beyansız notu", () => {
  const r = checkAiAccess(null, "/");
  expect(r.score).toBe(25); expect(r.status).toBe("pass");
  expect(r.findings.some(f => f.tr.includes("beyansız"))).toBe(true);
});
it("tümü açık → 25", () => expect(checkAiAccess(fx("robots-open.txt"), "/").score).toBe(25));
it("tümü engelli → 0 fail", () => {
  const r = checkAiAccess(fx("robots-blocked.txt"), "/blog/x");
  expect(r.score).toBe(0); expect(r.status).toBe("fail");
  expect(r.findings.length).toBeGreaterThanOrEqual(1); // engelli botlar listelenir
});
it("karışık: GPTBot engelli, ClaudeBot /private dışında izinli → 9/10 izinli = 23", () => {
  const r = checkAiAccess(fx("robots-mixed.txt"), "/blog/x");
  expect(r.score).toBe(Math.round(25 * 9 / 10));
  expect(r.findings.some(f => f.tr.includes("GPTBot"))).toBe(true);
});
it("en-uzun-eşleşme: ClaudeBot /private/a'da engelli", () => {
  const r = checkAiAccess(fx("robots-mixed.txt"), "/private/a");
  expect(r.score).toBe(Math.round(25 * 8 / 10));
});
```

- [ ] **Adım 3:** Çalıştır → FAIL · **Adım 4:** `ai-access.ts`'i çözüm kuralına göre yaz; `summary`/`findings` TR+EN (brand-voice: teşhis dili, ör. tr: "10 bilinen AI botundan 9'u bu sayfaya erişebiliyor; GPTBot engelli."). **Adım 5:** PASS + typecheck · **Adım 6:** Commit `feat(tools): AI erişim kalemi — robots.txt çözümü`

---

### Görev 3: llms.txt kalemi — 15 puan

**Files:** Create `src/lib/tools/geo/llms-txt.ts` · Test `tests/unit/tools-geo/llms-txt.test.ts`

**Interfaces:** Produces `checkLlmsTxt(llmsTxt: string | null): GeoCheckResult`

**Kural:** `null` → 0 fail. Metin var + en az bir markdown bağlantı satırı (`/^\s*-\s*\[[^\]]+\]\([^)]+\)/m`) → 15 pass. Var ama biçimsiz → 10 partial.

- [ ] **Adım 1: Düşen test**

```ts
import { checkLlmsTxt } from "@/lib/tools/geo/llms-txt";
it("yok → 0", () => expect(checkLlmsTxt(null).score).toBe(0));
it("biçimli → 15", () =>
  expect(checkLlmsTxt("# X\n\n- [Ana sayfa](https://x.com): açıklama\n").score).toBe(15));
it("biçimsiz düz metin → 10 partial", () => {
  const r = checkLlmsTxt("hakkımızda her şey burada");
  expect(r.score).toBe(10); expect(r.status).toBe("partial");
});
```

- [ ] **Adım 2-4:** FAIL → implement → PASS · **Adım 5:** Commit `feat(tools): llms.txt kalemi`

---

### Görev 4: Yapısal veri kalemi (JSON-LD) — 20 puan

**Files:** Create `src/lib/tools/geo/json-ld.ts` · Fixture `tests/fixtures/geo/page-rich.html`, `page-broken-ld.html`, `page-bare.html` · Test `tests/unit/tools-geo/json-ld.test.ts`

**Interfaces:** Produces `checkJsonLd(pageHtml: string): GeoCheckResult` · iç yardımcı `extractJsonLdBlocks(html: string): Array<{raw: string; parsed: unknown | null}>`

**Çıkarım:** `/<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi`. `@graph` içi düğümler düzleştirilir; `@type` değerleri toplanır.

**Puan:** hiç blok yok → 0. En az bir GEÇERLİ JSON bloğu → 8. Tanınan `@type` çeşitliliği (`Organization|WebSite|WebPage|Article|Service|Product|BreadcrumbList|LocalBusiness|Person` kümesinden benzersiz sayı, 4'e kadar × 2 puan) → +8'e kadar. `FAQPage` varsa → +4. Bozuk (parse edilemeyen) blok varsa findings'e yazılır ve status en fazla `partial` olur.

- [ ] **Adım 1: Fixture'lar** — `page-rich.html`: Organization + Article + FAQPage tek `@graph`'ta (gerçekçi, sitedeki grafiğe benzer minimal örnek) · `page-broken-ld.html`: bir geçerli Organization + bir `{bozuk json` bloğu · `page-bare.html`: hiç ld+json yok
- [ ] **Adım 2: Düşen test**

```ts
it("zengin graf: 8 + 3 tip*2 + FAQ 4 = 18+", () => {
  const r = checkJsonLd(fx("page-rich.html"));
  expect(r.score).toBeGreaterThanOrEqual(16); expect(r.max).toBe(20);
});
it("hiç yok → 0 fail", () => expect(checkJsonLd(fx("page-bare.html")).status).toBe("fail"));
it("bozuk blok → partial + bulgu", () => {
  const r = checkJsonLd(fx("page-broken-ld.html"));
  expect(r.status).toBe("partial");
  expect(r.findings.some(f => f.tr.includes("çözümlenemedi") || f.tr.includes("bozuk"))).toBe(true);
});
```

- [ ] **Adım 3-4:** FAIL → implement → PASS · **Adım 5:** Commit `feat(tools): JSON-LD kalemi`

---

### Görev 5: Dil sinyalleri kalemi — 15 puan (normalizasyonlu)

**Files:** Create `src/lib/tools/geo/lang-signals.ts` · Test `tests/unit/tools-geo/lang-signals.test.ts`

**Interfaces:** Produces `checkLangSignals(pageHtml: string, url: string): GeoCheckResult`

**Kural:** `html lang` var (5) + `link rel="canonical"` href'i verilen URL'le aynı origin+path (sondaki `/` toleranslı) (5) + hreflang: `link rel="alternate" hreflang` setinde en az 2 dil VE `x-default` (5). **Normalizasyon:** hreflang hiç yoksa kalem 10 üzerinden ölçülür, `score = Math.round(raw * 15 / 10)`, findings'e "tek dilli site — hreflang beklenmedi" bilgi notu; `max` her zaman 15.

- [ ] **Adım 1: Düşen test**

```ts
const single = `<html lang="tr"><head><link rel="canonical" href="https://x.com/a"/></head><body/></html>`;
it("tek dilli, lang+canonical doğru → 15 (normalize)", () =>
  expect(checkLangSignals(single, "https://x.com/a").score).toBe(15));
it("lang yok → normalize 8", () => {
  const html = `<html><head><link rel="canonical" href="https://x.com/a"/></head></html>`;
  expect(checkLangSignals(html, "https://x.com/a").score).toBe(Math.round(5 * 15 / 10));
});
const multi = `<html lang="tr"><head><link rel="canonical" href="https://x.com/a"/>
<link rel="alternate" hreflang="tr" href="https://x.com/a"/>
<link rel="alternate" hreflang="en" href="https://x.com/en/a"/>
<link rel="alternate" hreflang="x-default" href="https://x.com/a"/></head></html>`;
it("tam hreflang seti → 15/15 normalizesiz", () =>
  expect(checkLangSignals(multi, "https://x.com/a").score).toBe(15));
it("hreflang var ama x-default yok → 10", () => {
  const noDefault = multi.replace(/<link rel="alternate" hreflang="x-default"[^/]*\/>/, "");
  expect(checkLangSignals(noDefault, "https://x.com/a").score).toBe(10);
});
```

- [ ] **Adım 2-4:** FAIL → implement → PASS · **Adım 5:** Commit `feat(tools): dil sinyalleri kalemi`

---

### Görev 6: Soru-H2 kalemi (25) + `runGeoScan` birleştirici

**Files:** Create `src/lib/tools/geo/question-h2.ts`, `src/lib/tools/geo/engine.ts` · Fixture `tests/fixtures/geo/page-qa.html` (5 H2'nin 3'ü soru + `<details>` SSS'li), `page-flat.html` (3 H2, hiçbiri soru, SSS yok) · Test `tests/unit/tools-geo/question-h2.test.ts`, `tests/unit/tools-geo/engine.test.ts`

**Interfaces:**
- Produces `checkQuestionH2(pageHtml: string): GeoCheckResult`
- Produces `runGeoScan(input: GeoScanInput): Omit<GeoScanResult, "id" | "scannedAt">` — beş kalemi sırayla çalıştırır (`ai-access` için `new URL(input.url).pathname` geçirir), toplar, `bandFor` uygular.

**Kural (question-h2):** H2 metinleri `/<h2[^>]*>([\s\S]*?)<\/h2>/gi` ile çıkarılır (iç etiketler temizlenir). Soru oranı: `?` içeren H2 / toplam; `>= 0.5` → 15, altı `Math.round(15 * oran / 0.5)`. H2 hiç yoksa 0 + bulgu. Görünür soru-cevap (10): sayfada `FAQPage` `@type` VEYA `<details>` VEYA `?` ile biten en az 3 başlık (h2+h3) → 10, yoksa 0.

- [ ] **Adım 1: Düşen testler** (fixture'larla: `page-qa` → 15'e yakın + 10; `page-flat` → 0+0 fail; engine testi: fixture kombinasyonuyla `totalScore` = kalemlerin toplamı, `checks` uzunluğu 5, `band` doğru)

```ts
it("toplam skor kalemlerin toplamıdır ve bant doğru", () => {
  const r = runGeoScan({ url: "https://x.com/a", pageHtml: fx("page-qa.html"), robotsTxt: null, llmsTxt: null });
  expect(r.checks).toHaveLength(5);
  expect(r.totalScore).toBe(r.checks.reduce((s, c) => s + c.score, 0));
  expect(r.band).toBe(bandFor(r.totalScore));
});
it("CPU bütçesi: 500 KB fixture < 50 ms", () => {
  const big = fx("page-qa.html").repeat(200).slice(0, 500_000);
  const t0 = performance.now();
  runGeoScan({ url: "https://x.com/a", pageHtml: big, robotsTxt: null, llmsTxt: null });
  expect(performance.now() - t0).toBeLessThan(50);
});
```

- [ ] **Adım 2-4:** FAIL → implement → PASS · **Adım 5:** Commit `feat(tools): soru-H2 kalemi ve runGeoScan birleştirici`

---

### Görev 7: SSRF korumalı fetch katmanı

**Files:** Create `src/lib/tools/geo/safe-fetch.ts` · Test `tests/unit/tools-geo/safe-fetch.test.ts`

**Interfaces:**
- Produces `validateTargetUrl(raw: string): { ok: true; url: URL } | { ok: false; reason: Localized<string> }`
- Produces `fetchScanTargets(url: URL, fetcher?: typeof fetch): Promise<{ pageHtml: string; robotsTxt: string | null; llmsTxt: string | null }>` — sayfa + `origin/robots.txt` + `origin/llms.txt` paralel; robots/llms 200 değilse `null`; sayfa 200 değilse `Error("target-unreachable")`.

**Reddetme matrisi (`validateTargetUrl`):** protokol `http/https` değil · host IP-literal (v4/v6) · `localhost`/`*.local`/`*.internal` · `indoles.com.tr` altındaki `/api/` yolları (döngü koruması; site kökü serbest). **Fetch sınırları:** her istek `AbortSignal.timeout(10_000)` · `redirect: "follow"` + yanıt `res.url` yeniden `validateTargetUrl`'den geçer · sayfa `content-type` `text/html` içermeli · gövde stream okunur, 2 MB'ta kesilir (`ReadableStream` reader döngüsü) · `User-Agent: "INDOLES-GEO-Denetleyici/1.0 (+https://www.indoles.com.tr/tr/araclar/geo-gorunurluk-denetleyicisi)"`.

- [ ] **Adım 1: Düşen testler**

```ts
it.each(["ftp://x.com", "http://127.0.0.1/a", "http://[::1]/", "http://localhost:3000", "http://10.0.0.5/x", "http://gizli.internal/"])(
  "reddedilir: %s", (u) => expect(validateTargetUrl(u).ok).toBe(false)
);
it("kendi API'miz reddedilir, kökümüz serbest", () => {
  expect(validateTargetUrl("https://www.indoles.com.tr/api/contact").ok).toBe(false);
  expect(validateTargetUrl("https://www.indoles.com.tr/tr").ok).toBe(true);
});
it("2 MB sınırı: dev yanıt kesilir", async () => {
  const fake = ((input: RequestInfo | URL) => Promise.resolve(new Response("x".repeat(3_000_000),
    { headers: { "content-type": "text/html" } }))) as typeof fetch;
  const out = await fetchScanTargets(new URL("https://x.com/a"), fake);
  expect(out.pageHtml.length).toBeLessThanOrEqual(2_000_000);
});
it("robots 404 → null, tarama düşmez", async () => {
  const fake = ((input: RequestInfo | URL) => {
    const u = String(input instanceof Request ? input.url : input);
    return Promise.resolve(u.endsWith("robots.txt") || u.endsWith("llms.txt")
      ? new Response("", { status: 404 })
      : new Response("<html lang=\"tr\"></html>", { headers: { "content-type": "text/html" } }));
  }) as typeof fetch;
  const out = await fetchScanTargets(new URL("https://x.com/a"), fake);
  expect(out.robotsTxt).toBeNull(); expect(out.pageHtml).toContain("<html");
});
```

- [ ] **Adım 2-4:** FAIL → implement → PASS · **Adım 5:** Commit `feat(tools): SSRF korumalı tarama fetch katmanı`

---

### Görev 8: D1 migration + repository (kayıt, lead, hız sayacı)

**Files:**
- Create: `migrations/0003_tool_scans.sql`, `src/lib/tools/geo/repository.ts`
- Test: `tests/unit/tools-geo/repository.test.ts` (rezervasyonun `src/lib/booking/__tests__/repository.test.ts` D1-mock desenini birebir izle — better-sqlite3 tabanlı test yardımcısı oradadır, kopyala/uyarED)

**Interfaces:**
- Produces:

```ts
export async function insertScan(db: D1Database, r: { id: string; url: string; totalScore: number; band: string; checksJson: string; clientIpHash: string }): Promise<void>;
export async function getScan(db: D1Database, id: string): Promise<{ url: string; totalScore: number; band: GeoBand; checks: GeoCheckResult[]; scannedAt: string } | null>;
export async function insertLead(db: D1Database, r: { scanId: string; email: string; clientIpHash: string }): Promise<void>;
export async function countScansSince(db: D1Database, ipHash: string | null, sinceIso: string): Promise<number>; // ipHash null → global sayım
export async function countLeadsSince(db: D1Database, ipHash: string, sinceIso: string): Promise<number>;
export async function hashClientIp(ip: string, salt: string): Promise<string>; // SHA-256(ip + salt) hex — WebCrypto
```

- [ ] **Adım 1: Migration'ı yaz**

```sql
-- 0003: GEO araç taramaları ve lead'leri. Ham IP saklanmaz (KVKK) — SHA-256 + gizli tuz.
CREATE TABLE tool_scans (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  total_score INTEGER NOT NULL,
  band TEXT NOT NULL,
  checks_json TEXT NOT NULL,
  client_ip_hash TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX idx_tool_scans_ip ON tool_scans (client_ip_hash, created_at);
CREATE INDEX idx_tool_scans_time ON tool_scans (created_at);
CREATE TABLE tool_leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  scan_id TEXT NOT NULL REFERENCES tool_scans(id),
  email TEXT NOT NULL,
  kvkk_consent INTEGER NOT NULL CHECK (kvkk_consent = 1),
  client_ip_hash TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX idx_tool_leads_ip ON tool_leads (client_ip_hash, created_at);
```

- [ ] **Adım 2: Düşen repo testleri** (insert→get gidiş-dönüşü `checks` JSON'ının parse edilmiş döndüğünü, `countScansSince`'in pencere dışını saymadığını, `hashClientIp`'in deterministik + tuz-duyarlı olduğunu asserte eder)
- [ ] **Adım 3-4:** FAIL → implement → PASS
- [ ] **Adım 5:** `wrangler.jsonc`'a dokunma (D1 binding zaten var); `TOOL_IP_SALT` için `.dev.vars`/secret adımını README-runbook'a not düş (Görev 14'te dokümante edilir). Commit: `feat(tools): D1 tool_scans/tool_leads + hız sayacı repository`

---

### Görev 9: `POST /api/tools/geo-scan` route'u

**Files:**
- Create: `src/app/api/tools/geo-scan/route.ts`, `src/lib/schemas/tools.ts`
- Test: `src/app/api/tools/geo-scan/__tests__/route.test.ts` (desen: `src/app/api/contact/__tests__/route.test.ts` — Turnstile mock'u, env mock'u oradan)

**Interfaces:**
- Consumes: Görev 6 `runGeoScan` · Görev 7 `validateTargetUrl`/`fetchScanTargets` · Görev 8 repository · contact route'un Turnstile doğrulama yardımcı deseni (`src/app/api/contact/route.ts` içinden — aynı yardımcı fonksiyon yeniden kullanılabilir hale getirilir, davranış değişmez)
- Produces: `{ id: string; result: GeoScanResult }` (200) · hata gövdesi `{ error: "invalid-url" | "rate-limited" | "target-unreachable" | "turnstile-failed" }` (400/429/502)
- Schema (`tools.ts`): `geoScanSchema = z.object({ url: z.string().url().max(2048), turnstileToken: z.string().min(1) })`

**Akış:** Turnstile → IP hash (`request.headers.get("cf-connecting-ip")`, yoksa `"unknown"`) → limitler: IP/saat 10, global/24s 500 (`countScansSince`) → `validateTargetUrl` → `fetchScanTargets` → `runGeoScan` → `id = crypto.randomUUID()` → `insertScan` → 200.

- [ ] **Adım 1: Düşen route testleri** — geçersiz URL 400 · limit aşımı 429 (repo mock'u 10 döndürür) · hedef ulaşılamaz 502 · mutlu yol 200 + D1 insert çağrısı + `result.checks` uzunluğu 5 · Turnstile düşerse 400
- [ ] **Adım 2-4:** FAIL → implement → PASS (`export const runtime` vb. mevcut API route'larının konfigürasyonunu aynen izle)
- [ ] **Adım 5:** Commit `feat(tools): geo-scan API — Turnstile, hız sınırı, SSRF zinciri`

---

### Görev 10: Routing + içerik katmanı + araç sayfası + `/araclar` indeksi

**Files:**
- Modify: `src/lib/i18n/routing.ts` — pathnames'e STATİK tam-yol çiftleri (next-intl dinamik segment değeri çevirmez; araç başına bir satır eklenir):
  `"/araclar": { en: "/tools" }` · `"/araclar/geo-gorunurluk-denetleyicisi": { en: "/tools/geo-visibility-checker" }` · `"/araclar/geo-gorunurluk-denetleyicisi/sonuc/[id]": { en: "/tools/geo-visibility-checker/result/[id]" }` (dinamik `[id]` değeri çevrilmez, aynen taşınır — mevcut girdilerin biçimini izle)
- Create: `src/lib/content/tools.ts`, `src/app/(marketing)/[locale]/araclar/page.tsx`, `src/app/(marketing)/[locale]/araclar/geo-gorunurluk-denetleyicisi/page.tsx`, `src/components/tools/geo-scan-form.tsx`
- Test: `tests/unit/tools-content.test.ts`

**İçerik katmanı (`tools.ts`)** — `ToolContent` tipi + `TOOLS` dizisi (tek eleman). Alanlar: `slug: Localized`, `name`, `lede`, `steps` (3 adım), `faq` (6 giriş — cevaplar ≥40 kelime/dil, anafora yasak), `seo { title, description }`, `footnote` (iddia dipnotu). **Copy uygulamada `indoles-brand-voice` skill'i çağrılarak yazılır**; hedefler sabit:
- `seo.title.tr`: `"GEO denetim aracı — AI görünürlük testi"` (40 kr) · `seo.title.en`: `"GEO audit tool — AI visibility test"` (36 kr)
- `seo.description`: 140-160, TR'de `"llms.txt kontrolü"` ikincilini taşır; description'daki her rakam sayfada geçer
- H1 (`name.tr`): `"GEO Görünürlük Denetleyicisi"` · eyebrow: `"Türkiye'nin ilk GEO denetim aracı"` · `footnote.tr`: `"Eylül 2026 itibarıyla Türkçe pazarda benzer kapsamda kamuya açık bir GEO denetim aracı tespit etmedik."` (+ EN karşılıkları, EN'de "the first Turkish GEO audit tool")
- FAQ soruları (cevaplar uygulamada yazılır): "GEO denetimi neyi ölçer?" · "AI görünürlük testi hangi botları kontrol eder?" · "llms.txt kontrolü neden önemli?" · "Skor kaç olmalı?" · "Detaylı raporda ne var?" · "Verilerim ne oluyor?" (KVKK)

**Araç sayfası:** SSG + `generateMetadata` (`buildMetadata`, hreflang üçlüsü) · JSON-LD: `Organization` + `WebPage` + `BreadcrumbList` + `FAQPage` + **`SoftwareApplication`** (`applicationCategory: "SEOApplication"` benzeri değil — `"WebApplication"` kullan; `offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" }`) — üreticiyi `src/lib/seo/json-ld.ts`'e `softwareApplicationLd()` olarak ekle · Bölümler: hero + form (`GeoScanForm` client bileşeni: URL girişi, görünmez Turnstile — `ContactForm`'un Turnstile entegrasyon desenini izle) + "nasıl çalışır" 3 adım + 5 kalem tanıtımı + SSS (`FaqAccordion`, native `details`) + üçgen linkler bloğu (`/hizmetler/ai-danismanlik` + üç GEO yazısı) + `ContactCallout`. Tasarım: mevcut primitives (`.eyebrow`, `.ds-container`, kart desenleri) — `indoles-design-tokens` skill'i çağrılır, ham hex/px yazılmaz.

**`/araclar` indeksi:** başlık + `TOOLS` listesi kart olarak (tek kart — yapı gelecek araçlara hazır) + `ItemList` JSON-LD (yazılar liste sayfası deseni).

- [ ] **Adım 1: Düşen içerik testi** — `tests/unit/tools-content.test.ts`: FAQ cevapları her dilde ≥40 kelime + anafora regex'i (articles-content'teki güncel regex'i kopyala) + `seo.title` ≤50 + description 140-160 + iki dilde slug/name dolu
- [ ] **Adım 2:** FAIL → `tools.ts` copy'siyle yaz (brand-voice) → PASS
- [ ] **Adım 3:** Routing + sayfalar + form bileşeni; `pnpm build` ile iki locale'de statik üretimi doğrula; `curl localhost:3000/tr/araclar/geo-gorunurluk-denetleyicisi` H1 + ld+json içerir
- [ ] **Adım 4:** `pnpm test` + typecheck → yeşil
- [ ] **Adım 5:** Commit `feat(tools): /araclar ailesi — GEO denetleyici sayfası, içerik katmanı, SoftwareApplication şeması`

---

### Görev 11: Sonuç ekranı + paylaşım sayfası + GA4 olayları

**Files:**
- Create: `src/components/tools/geo-result.tsx`, `src/app/(marketing)/[locale]/araclar/geo-gorunurluk-denetleyicisi/sonuc/[id]/page.tsx`
- Modify: `src/components/tools/geo-scan-form.tsx` (sonucu gösterme + `history.replaceState`) · `src/lib/analytics/events.ts` (+3 olay)
- Test: `tests/unit/tools-geo/geo-result.test.tsx` (render: skor, bant etiketi, 5 rozet, kalem `summary` cümleleri; `findings` render EDİLMEZ — o rapora ait)

**Davranış:** `GeoScanForm` başarılı yanıtla `GeoResult`'ı basar, URL'i `/araclar/geo-gorunurluk-denetleyicisi/sonuc/<id>` yapar (`history.replaceState` — locale'e göre `localeHref`), "sonucu paylaş" düğmesi `navigator.clipboard.writeText`. Paylaşım sayfası: sunucuda `getScan` (D1 binding'e `getCloudflareContext` ile erişim — rezervasyon route'larının desenini izle) → yoksa `notFound()` → `GeoResult` + araca dönüş CTA'sı; `metadata`: `robots: { index: false, follow: true }` + araç sayfasını işaret eden güçlü link (canonical self, spec §4). GA4: `tool_used` (form submit), `tool_scan_completed` (yanıtla, `band` parametresiyle), taksonomiye `docs/12` güncellemesi Görev 14'te. Olay kimliği kuralı: `slug` her zaman TR (`view-events` disiplini).

- [ ] **Adım 1:** Düşen render testleri → **Adım 2-3:** implement → PASS · **Adım 4:** `pnpm build` + yerel smoke: tarama akışı elle bir kez (dev'de Turnstile test anahtarı) · **Adım 5:** Commit `feat(tools): sonuç ekranı, paylaşım sayfası (noindex,follow), GA4 olayları`

---

### Görev 12: Rapor akışı — e-posta şablonu + `POST /api/tools/geo-report` + kilit açma

**Files:**
- Create: `emails/GeoReportEmail.tsx`, `src/app/api/tools/geo-report/route.ts`, `src/components/tools/geo-report-form.tsx`
- Modify: `src/lib/schemas/tools.ts` (+`geoReportSchema = z.object({ scanId: z.string().uuid(), email: z.string().email(), kvkkConsent: z.literal(true), turnstileToken: z.string().min(1) })`) · `GeoResult` (rapor formu + kilit açılınca `findings` listesi) · rezervasyon CTA union'ına `"tool-geo-report"` (kapalı `BookingCtaSource` — derleyici eksik yeri gösterir)
- Test: `src/app/api/tools/geo-report/__tests__/route.test.ts` + `emails/__tests__/geo-report-email.test.tsx` (mevcut e-posta test deseni)

**E-posta şablonu:** mevcut React Email şablonlarının (emails/ dizini) görsel dilini izler. İçerik: skor + bant → kalem başına `findings` listesi → "öncelikli 3 aksiyon" (en düşük skorlu 3 kalemin ilk bulgusu) → ilgili rehber linkleri (kanonik TR URL'ler: GEO rehberi, llms.txt, AI Overviews yazıları) → rezervasyon CTA'sı (site rezervasyon sayfası linki). Dil: taranan sayfanın istendiği locale (form hangi locale sayfasından geldiyse o dil).

**Route akışı:** şema → Turnstile → IP hash → lead limiti (IP/saat 3, `countLeadsSince`) → `getScan` (yoksa 404) → `insertLead` → kullanıcıya rapor maili + satışa lead bildirimi (contact route'un alıcı listesi + hata davranışı: satış bildirimi düşerse 500, kullanıcı maili düşerse yutulur + log) → 200 `{ ok: true }`. GA4 `tool_report_requested` istemcide başarılı yanıtla atılır.

- [ ] **Adım 1:** Düşen route + e-posta render testleri (rapor: skor ve en az bir bulgu satırı render olur; route: rıza `false` → 400, limit → 429, scan yok → 404, mutlu yol → iki mail çağrısı + lead insert)
- [ ] **Adım 2-4:** FAIL → implement → PASS · **Adım 5:** Commit `feat(tools): e-posta raporu ve lead akışı — KVKK rızalı, çift bildirimli`

---

### Görev 13: SEO entegrasyonu — sitemap, llms.txt, audit profili, keyword regresyonu, üçgen linkler

**Files:**
- Modify: `src/app/sitemap.ts` (araç indeksi 0.8 + araç sayfası 0.8, hreflang çiftleri; sonuç sayfaları sitemap'e GİRMEZ) · `src/lib/seo/llms.ts` (TOOLS kaynağı + "Araçlar"/"Tools" bölümü — kök + per-locale) · `src/lib/seo/audit.ts` (yeni `tool` profili: title ≤60, description 140-160, zorunlu `SoftwareApplication`+`FAQPage`, `personaVariants: "forbidden"`, min 6 SSS) · `tests/unit/keyword-coverage.test.ts` (+`TARGETS_TOOLS`: `["geo-gorunurluk-denetleyicisi","geo denetimi"]`, `[..., "ai görünürlük testi"]`, `[..., "llms txt kontrolü"]`) · `scripts/cf-smoke.sh` (+2 kontrol: TR araç sayfası 200 + EN tools 200)
- Modify (üçgen linkler): `src/lib/content/articles.ts` — ÜÇ GEO yazısına (`yapay-zeka-aramalarinda-nasil-one-cikarsiniz`, `google-ai-overviews-da-yer-almak`, `llms-txt-nedir`) gövde sonuna 1'er paragraf araç köprüsü: `"...[GEO Görünürlük Denetleyicisi](/araclar/geo-gorunurluk-denetleyicisi) ile sitenizi şimdi test edin..."` kalıbında, brand-voice'la yazılmış doğal cümle (TR+EN aynı kanonik TR path); `resolveInlineHref`'e `araclar` dalı (SERVICES/ARTICLES/CASES dallarının birebir deseni — araç slug'ları locale başına farklı)
- Test: mevcut süit + `pnpm seo:audit` (yerel prod sunucuyla) → yeni sayfalar 0 FAIL

- [ ] **Adım 1:** llms/sitemap/audit değişiklikleri + testleri (llms testine "Araçlar bölümü var + araç linki markdown biçimli" assertion'ı)
- [ ] **Adım 2:** keyword-coverage `TARGETS_TOOLS` bloğu (araç yüzey fonksiyonu: name+lede+steps+faq+seo) → önce FAIL (copy'de kelime eksikse Görev 10 copy'sine ekle) → PASS
- [ ] **Adım 3:** Üç yazıya araç köprüsü + resolver dalı; `updatedAt` bump ETME (tek paragraf ek — güncelleme rozeti abartı olur; karar: dokunulan yazılarda yalnız gövde eki)
- [ ] **Adım 4:** `pnpm build` + `pnpm start -p 3100` + `pnpm seo:audit --base http://localhost:3100` → araç sayfaları PASS, toplam 0 FAIL · **Adım 5:** Commit `feat(tools): SEO entegrasyonu — sitemap, llms araç bölümü, audit tool profili, üçgen linkler`

---

### Görev 14: Karar kayıtları ve doküman senkronu

**Files:**
- Create: `docs/decisions/ADR-030-araclar-worker-native.md`
- Modify: `CLAUDE.md` (§6 satır: `İnteraktif teşhis araçları (/araclar) | Launch kapsamı dışı; Faz 2` → `~~...~~ ADR-030 ile açıldı (2026-09): /araclar ailesi canlı; motor Worker-native`) — **Burak onayı 2026-09-01 tasarım onayıyla alındı** · `docs/02-information-architecture.md` (route haritasına `/araclar`, `/araclar/[slug]`, sonuç sayfası noindex notu) · `docs/12-analytics-measurement.md` (+`tool_used`, `tool_scan_completed`, `tool_report_requested` — parametreleriyle) · `docs/strateji/INDOLES-Organik-Strateji-SEO-GEO-v1.md` (changelog v1.11: araç ④ canlıda, kelime hedefleri, Diagnoo erteleme gerekçesi) · `docs/strateji/Off-Site-Otorite-ve-Arac-Plani.md` (§4 açık-iş 1 ve 3 işaretlenir; PostHog→GA4 ve Cal.com→rezervasyon düzeltme notu) · `docs/runbooks/cutover-www-indoles.md` veya yeni kısa runbook satırı: `TOOL_IP_SALT` secret'ının `wrangler secret put` adımı

**ADR-030 içeriği:** Karar (kapsam-dışından çıkış + Worker-native motor), bağlam (Off-Site planı ④, Diagnoo deploy edilmemiş), alternatifler (Diagnoo modülü — ertelendi; Workers Paid + cheerio — gereksiz), sonuçlar (taşınabilir `GeoScanInput/GeoScanResult` sözleşmesi; D1 ortak veritabanı; ücretsiz plan CPU disiplini), geri alma yolu.

- [ ] **Adım 1:** ADR-030 yaz · **Adım 2:** beş dokümanı güncelle · **Adım 3:** `pnpm test` (doc değişikliği test kırmaz — doğrulama) · **Adım 4:** Commit `docs(tools): ADR-030 + CLAUDE.md, docs/02, docs/12, strateji v1.11 senkronu`

---

### Görev 15: Duyuru yazısı ("Türkiye'nin ilk GEO denetim aracı")

**Files:**
- Modify: `src/lib/content/articles.ts` (+1 kısa yazı) — `slug: { tr: "turkiyenin-ilk-geo-denetim-araci", en: "turkiyes-first-geo-audit-tool" }`, `topic: "geo"`, `category: "growth"`, `authorSlug: "burak-ozgul"`, `publishedAt`: yayın günü
- Test: mevcut articles-content kuralları otomatik kapsar

**İçerik hedefi (uygulamada brand-voice ile):** 600-900 kelime gövde (duyuru — 1.500 kuralı "rehber" iddialı yazılar içindir, bu duyuru formatı; docs/03 §6a.1 rehber şartıyla çelişmez) + neden yaptık (GEO ölçülemiyordu) + 5 kalemin tek paragraf özeti + dürüst sınırlar ("skor sıralama garantisi değildir") + tarih damgalı ilklik iddiası + araca ve GEO rehberine linkler + 10 SSS'ten kısa seri (mevcut kurallar: ≥40 kelime, anafora yasağı, H2/SSS tekrar yasağı). `seo.title.tr`: `"Türkiye'nin ilk GEO denetim aracı yayında"` (41 kr).

- [ ] **Adım 1:** Yazıyı ekle (brand-voice) · **Adım 2:** `pnpm test` — SSS/parite/anafora kuralları yeşil · **Adım 3:** Commit `feat(icerik): GEO denetim aracı duyuru yazısı`

---

### Görev 16: E2E akış + final doğrulama

**Files:**
- Create: `tests/e2e/geo-tool.spec.ts` (Playwright — mevcut e2e konfigürasyon desenini izle)

**Senaryo:** araç sayfası açılır → URL girilir (test hedefi: `https://www.indoles.com.tr/tr` veya dev'de mock'lu yerel hedef; Turnstile test anahtarı) → skor ekranı görünür (5 rozet) → paylaşım URL'i açılır (yeni sekme/`goto`) aynı skoru gösterir → rapor formu rızasız submit reddedilir → rızalı submit "rapor gönderildi" durumu.

- [ ] **Adım 1:** Spec'i yaz, yerelde çalıştır → PASS
- [ ] **Adım 2: Final kapı:** `pnpm typecheck && pnpm test && pnpm build && pnpm seo:audit` (0 FAIL) + `pnpm exec wrangler deploy --dry-run` (boyut raporu — 3 MB altı)
- [ ] **Adım 3:** Commit `test(tools): GEO aracı uçtan uca akış + final doğrulama`
- [ ] **Adım 4 (deploy — YALNIZ Burak sinyaliyle):** `pnpm cf:deploy` (IndexNow otomatik) · GSC'de 2 araç URL'i + duyuru yazısına indeksleme talebi · `TOOL_IP_SALT` secret'ının prod'a girildiğini doğrula
