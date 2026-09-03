# Diagnoo Faz 2 (SEO/GEO Katmanı + Lansman Hazırlığı + Cila) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Diagnoo'yu (ve araç ailesini) INDOLES'in SEO/GEO içerik ağına bağlamak, lansmanı tek bir bayrak çevirmeye indirgemek, GA4 ölçüm kurulumunu koda dökmek ve Faz 1'den ertelenen cila/canlı test bulgularını kapatmak.

**Architecture:** Tüm görünürlük yüzeyleri (`/araclar` indeksi, sitemap, llms.txt, hizmet sayfası araç bloğu, makale köprüleri, indeks META) `publishedTools()` tek kaynağından beslenir; Diagnoo `published: false` iken hiçbiri onu göstermez, lansman = bayrak + ilgili testlerin beklentisini çevirmek. Araç↔hizmet↔makale üçgeni `tools.ts`'e eklenen `relatedServices` ve `bridges` verisiyle kurulur (hizmet içerik katmanına dokunulmaz). GA4 kurulumu Admin API'yi çağıran idempotent bir script ile yapılır; funnel exploration API'de olmadığı için runbook'ta kalır.

**Tech Stack:** Next.js 15 (App Router, next-intl), TypeScript strict, vitest 2 + jsdom, Playwright (OG kartı üretimi — ADR-031 kalıbı), Zod ^3, Cloudflare D1 (migration 0007), GA4 Admin API v1beta + Data API v1beta (REST, `fetch`), GEO araç ailesi altyapısı (`src/lib/content/tools.ts`, `src/components/tools/*`).

**Spec:** `docs/superpowers/specs/2026-09-01-diagnoo-design.md` (§7 SEO/GEO mekaniği, §8 GA4 runbook, §12 Faz 2) — bağlayıcı otorite. Faz 1 ledger arşivi: `.superpowers/sdd/2026-09-01-diagnoo-faz1-arsiv/progress.md` (ertelenen minorlar + canlı test bulguları).

**Spec'ten bilinçli sapmalar (keşif 2026-09-03):**
1. §7 "GEO ölçüm rutinine Diagnoo prompt seti" → rutin (`GEO-Olcum-Rutini.md` §6–§7) araç/editoryal terimleri prompt setinin dışında tutmayı ve seriyi kırmamayı kural yapmış; GEO aracı için de prompt eklenmemiş. Bu planda prompt eklenmez; §7'ye "araç sayfaları K3/S3 atıf kolonundan izlenir" notu düşülür.
2. §7 `webApplicationLd` → mevcut `softwareApplicationLd` zaten kullanılıyor; yeni helper yok.
3. Hizmet→araç ilişkisi hizmet içerik dosyalarına değil `tools.ts`'e (`relatedServices`) yazılır — GEO için de aynı mekanizma geçerli olur (ilk kez kurulur).
4. Makale→araç köprüleri ve hizmet araç bloğu **`published` kapılıdır**: yayınlanmamış araca içerikten link verilmez (ziyaretçi anahtarsız araçta dürüst hatayla karşılaşırdı).

## Global Constraints

- pnpm 10.33.0, Node >= 22, TypeScript strict, alias `@` → `./src`; yeni runtime bağımlılığı YOK.
- Kapılar her task sonunda yeşil: `pnpm lint` (0 hata), `pnpm typecheck`, `pnpm test`, route/metadata/içerik dokunan task'larda `pnpm seo:audit` (0 FAIL).
- İçerik kuralları (`tests/unit/articles-content.test.ts`, `tests/unit/tools-content.test.ts`, `tests/unit/en-spelling.test.ts`): SSS 10 (7–15) × her cevap ≥40 kelime × TR+EN; anafora yasağı; soru tekrarı yok; `seo.title` 15–60 kar., `seo.description` 140–160 kar. ve içindeki her sayı metinde geçer; İngiliz imlası (istisna: "Generative Engine Optimization"); rehber yazı ≥1.500 kelime (docs/03 §6a.1); soru-H2 oranı ≥%70.
- Kullanıcıya görünen TR/EN metinler `indoles-brand-voice` skill'inden; UI `indoles-design-tokens`; route/metadata/sitemap/llms/içerik katmanı değişiklikleri `indoles-i18n-seo` skill'inden geçer (execution'da yüklenir).
- Diagnoo `published: false` kalır; yalnız Task 10 (Burak ön koşullu) çevirir. Yayınlanmamış araca hiçbir yüzey link vermez.
- Üretim komutları (`cf:deploy`, `wrangler secret put`, `d1 migrations apply --remote`, GA4 Admin API yazma çağrıları) task içinde ÇALIŞTIRILMAZ; controller/Burak koşar.
- Türkçe yorum, emoji yok (UI ikonları hariç), commit mesajları `<type>(kapsam): …`.

## Dosya Yapısı

| Dosya | Sorumluluk |
|---|---|
| `src/lib/content/tools.ts` | `ToolContent`'e `relatedServices: string[]` (TR hizmet slug'ları) ve `bridges: ToolBridge[]` (makale köprüleri); `toolsForService(slug)`, `bridgesForArticle(slug)` yardımcıları — `publishedTools()` filtresiyle |
| `src/components/tools/tool-service-callout.tsx` | Hizmet sayfasında "ücretsiz araç" bloğu (yayınlanmış araçlar) |
| `src/components/marketing/service-detail.tsx` | Callout'u render eder |
| `src/app/(marketing)/[locale]/yazilar/[slug]/page.tsx` | Gövde sonuna yayınlanmış araç köprü paragrafı |
| `src/app/(marketing)/[locale]/araclar/diagnoo/page.tsx` | `ToolHero` paritesi, `image`, related blok `relatedServices`'ten |
| `src/components/tools/diagnoo-tool.tsx` | Hero'yu `ToolHero` üzerinden alır |
| `scripts/og/diagnoo-card.tsx`, `scripts/generate-og-diagnoo.ts` | Derleme zamanı OG kartı (`public/og/diagnoo/{tr,en}/tool.png`) |
| `src/lib/tools/diagnoo/share-meta.ts` | `diagnooOgImagePath(locale)` |
| `tests/unit/keyword-coverage.test.ts` | `TARGETS_TOOLS` Diagnoo satırları |
| `docs/strateji/INDOLES-Organik-Strateji-SEO-GEO-v1.md`, `docs/strateji/GEO-Olcum-Rutini.md`, `docs/strateji/Off-Site-Otorite-ve-Arac-Plani.md` | v1.13 changelog, ölçüm notu, üçgen çift yön kapatıldı |
| `src/lib/content/articles.ts` | Yeni rehber: "E-ticaret sitesinde GAP analizi" (topic `cro`) |
| `src/lib/tools/diagnoo/unlock-cookie.ts`, `repository.ts`, `report.ts`, `schema.ts`, `migrations/0007_diagnoo_leads_ip_index.sql` | Cila A |
| `src/components/tools/tool-labels.ts`, `diagnoo-*.tsx`, `use-diagnoo-status.ts`, `use-turnstile.ts`, `src/app/manifest.ts`, `src/components/tools/robots-meta.tsx`, `scripts/cf-smoke.sh`, `tests/e2e/contact-form.spec.ts`, `src/components/marketing/ContactBookingScreen.tsx`, `src/components/marketing/entry-popup/EntryPopup.tsx` | Cila B |
| `scripts/ga4-setup.ts`, `scripts/ga4-verify.ts`, `src/lib/analytics/ga4-admin.ts`, `docs/runbooks/diagnoo-ga4-kurulum.md` | GA4 kurulum (Admin API) + doğrulama (Data API) |
| `src/app/(marketing)/[locale]/araclar/page.tsx` (META), `tests/unit/sitemap.test.ts`, `tests/unit/page-metadata.test.ts`, `docs/02`, `docs/runbooks/diagnoo-ga4-kurulum.md` | Task 10 lansman anahtarı |

---

### Task 1: Üçgenin eksik ayağı — `relatedServices` ve hizmet sayfasında araç bloğu

**Files:**
- Modify: `src/lib/content/tools.ts` (tip + iki kayıt + `toolsForService`), `src/components/marketing/service-detail.tsx`
- Create: `src/components/tools/tool-service-callout.tsx`
- Test: `tests/unit/tools-content.test.ts` (ekleme), `tests/unit/tool-service-callout.test.tsx`

**Interfaces:**
- Consumes: `ToolContent`, `TOOLS`, `publishedTools()` (`src/lib/content/tools.ts`); `SERVICES` (`src/lib/content/services`); `localeHref`.
- Produces:
  - `ToolContent.relatedServices: string[]` — TR hizmet slug'ları; GEO: `["ai-danismanlik"]`, Diagnoo: `["cro", "performans-pazarlama", "e-ticaret"]`.
  - `export function toolsForService(serviceSlugTr: string): ToolContent[]` — yalnız `published` araçlar.
  - `<ToolServiceCallout serviceSlugTr locale />` — araç yoksa `null` döner.

- [ ] **Step 1: Failing testler**

```ts
// tests/unit/tools-content.test.ts — eklenecek describe
import { SERVICES } from "@/lib/content/services";
import { TOOLS, toolsForService, DIAGNOO_TOOL, GEO_TOOL } from "@/lib/content/tools";

describe("relatedServices", () => {
  it("her araç en az bir hizmete bağlanır ve slug'lar gerçek hizmetlerdir", () => {
    const serviceSlugs = new Set(SERVICES.map((s) => s.slug.tr));
    for (const t of TOOLS) {
      expect(t.relatedServices.length).toBeGreaterThan(0);
      for (const s of t.relatedServices) expect(serviceSlugs.has(s)).toBe(true);
    }
  });
  it("toolsForService yalnız yayınlanmış araçları döndürür", () => {
    expect(toolsForService("ai-danismanlik").map((t) => t.slug.tr)).toEqual([GEO_TOOL.slug.tr]);
    expect(DIAGNOO_TOOL.published).toBe(false);
    expect(toolsForService("cro")).toEqual([]);
  });
});
```

```tsx
// tests/unit/tool-service-callout.test.tsx
import { render, screen } from "@testing-library/react";
import { ToolServiceCallout } from "@/components/tools/tool-service-callout";

describe("ToolServiceCallout", () => {
  it("yayınlanmış aracı olan hizmette kart basar (TR)", () => {
    render(<ToolServiceCallout serviceSlugTr="ai-danismanlik" locale="tr" />);
    expect(screen.getByRole("link", { name: /GEO Görünürlük Denetleyicisi/ })).toHaveAttribute(
      "href", "/tr/araclar/geo-gorunurluk-denetleyicisi",
    );
  });
  it("EN'de EN yolunu kullanır", () => {
    render(<ToolServiceCallout serviceSlugTr="ai-danismanlik" locale="en" />);
    expect(screen.getByRole("link", { name: /GEO Visibility Checker/ })).toHaveAttribute(
      "href", "/en/tools/geo-visibility-checker",
    );
  });
  it("yayınlanmış aracı olmayan hizmette hiçbir şey basmaz", () => {
    const { container } = render(<ToolServiceCallout serviceSlugTr="cro" locale="tr" />);
    expect(container).toBeEmptyDOMElement();
  });
});
```

- [ ] **Step 2: FAIL doğrula** — `pnpm vitest run tests/unit/tools-content.test.ts tests/unit/tool-service-callout.test.tsx`

- [ ] **Step 3: Uygula**

`tools.ts`: tipe `/** Aracın doğal bağlandığı hizmetler — TR slug; hizmet sayfası callout'u buradan okur (üçgenin hizmet→araç ayağı). */ relatedServices: string[];` ekle; GEO kaydına `relatedServices: ["ai-danismanlik"]`, Diagnoo kaydına `["cro", "performans-pazarlama", "e-ticaret"]`; yardımcı:

```ts
export function toolsForService(serviceSlugTr: string): ToolContent[] {
  return publishedTools().filter((t) => t.relatedServices.includes(serviceSlugTr));
}
```

`tool-service-callout.tsx` (sunucu bileşeni; design token primitive'leri, `.eyebrow`, `v2-surface`):

```tsx
import Link from "next/link";
import { toolsForService } from "@/lib/content/tools";
import type { Locale } from "@/lib/content/types";

const COPY = {
  tr: { eyebrow: "Ücretsiz araç", cta: "Aracı aç" },
  en: { eyebrow: "Free tool", cta: "Open the tool" },
} as const;

export function ToolServiceCallout({ serviceSlugTr, locale }: { serviceSlugTr: string; locale: Locale }) {
  const tools = toolsForService(serviceSlugTr);
  if (tools.length === 0) return null;
  const root = locale === "tr" ? "/tr/araclar" : "/en/tools";
  return (
    <aside aria-labelledby="tool-callout-heading" className="v2-surface rounded-2xl p-6 md:p-8">
      <p className="eyebrow">{COPY[locale].eyebrow}</p>
      <ul className="mt-4 space-y-4">
        {tools.map((t) => (
          <li key={t.slug.tr}>
            <h3 id="tool-callout-heading" className="typography-h4">{t.name[locale]}</h3>
            <p className="mt-1 text-ink-600">{t.lede[locale]}</p>
            <Link href={`${root}/${t.slug[locale]}`} className="btn btn-secondary mt-3">
              {t.name[locale]} — {COPY[locale].cta}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
```

`service-detail.tsx`: SSS/CTA bölümünden önce `<ToolServiceCallout serviceSlugTr={service.slug.tr} locale={locale} />` (mevcut bölüm sırasına ve kaplarına uyarak). Sınıf adları repoda yoksa `globals.css`'teki gerçek primitive'lerle değiştir (`grep -n "\.btn-secondary\|\.eyebrow\|typography-h4" src/styles/globals.css`).

- [ ] **Step 4: PASS + kapılar** — `pnpm test && pnpm typecheck && pnpm lint && pnpm seo:audit` (hizmet sayfaları iç link sayısı artar; audit 0 FAIL)

- [ ] **Step 5: Commit** — `feat(tools): hizmet sayfasında yayınlanmış araç bloğu (üçgenin hizmet→araç ayağı)`

---

### Task 2: Makale → araç köprüleri (`bridges`, yayın kapılı)

**Files:**
- Modify: `src/lib/content/tools.ts` (`ToolBridge`, `bridges`, `bridgesForArticle`), `src/app/(marketing)/[locale]/yazilar/[slug]/page.tsx`
- Test: `tests/unit/tools-content.test.ts` (ekleme), `tests/unit/article-tool-bridge.test.tsx`

**Interfaces:**
- Consumes: `ARTICLES` (slug listesi), `resolveInlineHref` (mevcut), `publishedTools()`.
- Produces:
  - `export type ToolBridge = { articleSlugTr: string; paragraph: Localized<string> }` — paragraf markdown-lite, aracın kanonik TR yolunu `[Ad](/araclar/<slug>)` biçiminde içerir.
  - `ToolContent.bridges: ToolBridge[]` — Diagnoo: `cro`/`performans-pazarlama`/`e-ticaret` topic'li mevcut 7 makale için birer paragraf (slug'lar `ARTICLES.filter(a => ["cro","performans-pazarlama","e-ticaret"].includes(a.topic))` ile çıkarılır ve plan uygulanırken listelenir); GEO: `[]` (köprüleri zaten gövdede inline).
  - `export function bridgesForArticle(articleSlugTr: string): Array<{ tool: ToolContent; paragraph: Localized<string> }>` — yalnız yayınlanmış araçlar.
  - Makale sayfası: gövde bloklarının sonuna, SSS'den önce, her köprü için `<p>` (aynı `resolveInlineHref` çözücüsüyle).

- [ ] **Step 1: Failing testler**

```ts
// tests/unit/tools-content.test.ts — eklenecek
it("bridges gerçek makale slug'larına işaret eder ve paragraf aracın TR yolunu içerir", () => {
  const slugs = new Set(ARTICLES.map((a) => a.slug.tr));
  for (const t of TOOLS) for (const b of t.bridges) {
    expect(slugs.has(b.articleSlugTr)).toBe(true);
    expect(b.paragraph.tr).toContain(`](/araclar/${t.slug.tr})`);
    expect(b.paragraph.en).toContain(`](/araclar/${t.slug.tr})`);
    expect(b.paragraph.tr.split(/\s+/).length).toBeGreaterThanOrEqual(25);
  }
});
it("Diagnoo yayınlanmamışken bridgesForArticle boş döner", () => {
  expect(bridgesForArticle(DIAGNOO_TOOL.bridges[0]!.articleSlugTr)).toEqual([]);
});
it("yayınlanmış araç için köprü döner (published bayrağı ile)", () => {
  const published = { ...DIAGNOO_TOOL, published: true };
  expect(bridgesForArticle(DIAGNOO_TOOL.bridges[0]!.articleSlugTr, [published])).toHaveLength(1);
});
```

`bridgesForArticle(slug, tools = TOOLS)` ikinci parametreyi test için alır (publishedTools da `tools` parametresi alıyor).

```tsx
// tests/unit/article-tool-bridge.test.tsx — makale sayfası render testi
// Mevcut tests/unit/page-* kalıbıyla makale sayfasını render edip:
//  (a) Diagnoo unpublished iken gövdede "/araclar/diagnoo" linki YOK;
//  (b) vi.mock("@/lib/content/tools") ile publishedTools → Diagnoo dahil → köprü paragrafı ve
//      TR'de "/tr/araclar/diagnoo", EN'de "/en/tools/diagnoo" href'i VAR.
```

- [ ] **Step 2: FAIL doğrula**

- [ ] **Step 3: Uygula** — `tools.ts`'e tip + alan + yardımcı; Diagnoo köprü paragrafları brand voice (eğitici, somut: yazının konusuyla aracın hangi sinyalini ölçtüğü arasında bağ; "ücretsiz", "URL'nizi girin", "Health Snapshot" ifadeleri; ünlem yok); makale sayfasında köprü render'ı:

```tsx
{bridgesForArticle(article.slug.tr).map(({ tool, paragraph }) => (
  <p key={tool.slug.tr} className="tool-bridge">{renderInline(paragraph[loc], loc)}</p>
))}
```
(`renderInline` = sayfadaki mevcut markdown-lite paragraf çözücüsü; adı farklıysa onu kullan.)

- [ ] **Step 4: PASS + kapılar** (seo:audit dahil) — [ ] **Step 5: Commit** — `feat(tools): makale→araç köprüleri, yayın kapılı`

---

### Task 3: Diagnoo landing paritesi (ToolHero, kap, kanıt şeridi, related)

**Files:**
- Modify: `src/app/(marketing)/[locale]/araclar/diagnoo/page.tsx`, `src/components/tools/diagnoo-tool.tsx`
- Test: `tests/unit/page-metadata.test.ts` (mevcut beklentiler), `src/components/tools/__tests__/diagnoo-tool.test.tsx` (hero render), `tests/e2e/responsive/diagnoo-tool-responsive.spec.ts` (yeni; GEO'nun `geo-tool-responsive.spec.ts` kalıbı)

**Interfaces:**
- Consumes: `ToolHero({ tool, locale, variant })` (`src/components/tools/tool-hero.tsx`), `max-w-tool`, GEO sayfasının bölüm/sınıf düzeni, `relatedServices` (Task 1).
- Produces: Diagnoo sayfası GEO v2 ile aynı kabuk: `ToolHero` (variant `"full"` idle fazında; snapshot/report fazında `"compact"`), kap `max-w-tool`, kanıt şeridi ortalı, giriş alanı hero içinde; `footnote` GEO ile aynı yerde (GEO basmıyorsa Diagnoo da basmaz — tutarlılık; iddia dipnotu FAQ'ta kalır); related blok `relatedServices` üzerinden üç hizmet + `cro`/`e-ticaret` topic'li 3 yazı.

- [ ] **Step 1:** Failing test: `diagnoo-tool.test.tsx`'e "idle fazında ToolHero başlığı ve 4 kanıt öğesi render eder" + responsive spec iskeleti (4 viewport ekran görüntüsü, touch ≥44px, `aria-hidden` muafiyeti GEO ile aynı)
- [ ] **Step 2:** FAIL — [ ] **Step 3:** Uygula (`indoles-design-tokens` + `indoles-responsive-quality` skill'leri) — [ ] **Step 4:** `pnpm test && pnpm typecheck && pnpm lint && pnpm seo:audit`; responsive spec `PLAYWRIGHT_BASE_URL` ile cf:preview'da 4 viewport ekran görüntüsü `tests/screenshots/diagnoo-tool-{375,768,1280,1536}.png` — [ ] **Step 5: Commit** — `feat(diagnoo): landing GEO v2 kabuğuyla parite — ToolHero, kanıt şeridi, related`

---

### Task 4: Diagnoo OG kartı (ADR-031 kalıbı)

**Files:**
- Create: `scripts/og/diagnoo-card.tsx`, `scripts/generate-og-diagnoo.ts`, `src/lib/tools/diagnoo/share-meta.ts`, `public/og/diagnoo/tr/tool.png`, `public/og/diagnoo/en/tool.png`
- Modify: `package.json` (`"og:diagnoo": "tsx scripts/generate-og-diagnoo.ts"`), `src/app/(marketing)/[locale]/araclar/diagnoo/page.tsx` (`image`)
- Test: `tests/unit/diagnoo-share-meta.test.ts`

**Interfaces:**
- Consumes: `scripts/generate-og-geo.ts` + `scripts/og/geo-card.tsx` kalıbı (Playwright ile 1200×630 render), `buildMetadata({ image })`.
- Produces: `export function diagnooOgImagePath(locale: "tr"|"en"): string` → `/og/diagnoo/${locale}/tool.png`; kart: marka çerçevesi + "Diagnoo" + lede + 4 sinyal ağırlığı çubuğu (25/25/30/20) + "ücretsiz" rozeti; yalnız araç kartı (rapor sayfaları noindex/özel — kova kartı YAGNI).

- [ ] **Step 1:** Failing test: `diagnooOgImagePath("tr") === "/og/diagnoo/tr/tool.png"`; `fs.existsSync(public/og/diagnoo/{tr,en}/tool.png)`; sayfa metadata testinde `openGraph.images[0].url` bu yolu içerir.
- [ ] **Step 2:** FAIL — [ ] **Step 3:** Şablon + script (GEO script'ini birebir örnek al; `pnpm og:diagnoo` üretir) + metadata — [ ] **Step 4:** kapılar + `pnpm og:diagnoo` çıktısı commit'e girer (PNG boyutu ≤150 KB; GEO kartlarıyla aynı optimizasyon adımı) — [ ] **Step 5: Commit** — `feat(seo): Diagnoo araç OG kartı derleme zamanında (ADR-031)`

---

### Task 5: Keyword hedefleri ve strateji senkronu

**Files:**
- Modify: `tests/unit/keyword-coverage.test.ts` (`TARGETS_TOOLS`), `src/lib/content/tools.ts` (Diagnoo yüzeyinde kelimeler geçmiyorsa `lede`/`steps`/`faq`/`seo`'da doğal kullanım), `docs/strateji/INDOLES-Organik-Strateji-SEO-GEO-v1.md` (v1.13 changelog + §5 araç satırı), `docs/strateji/GEO-Olcum-Rutini.md` (§7 not), `docs/strateji/Off-Site-Otorite-ve-Arac-Plani.md` (§4: üçgen çift yön kapandı — Task 1/2)

**Interfaces:**
- Produces: `TARGETS_TOOLS`'a `["diagnoo", "e-ticaret site analizi"]`, `["diagnoo", "cro analizi"]`, `["diagnoo", "dönüşüm oranı analizi"]`; strateji v1.13 satırı: Diagnoo araç niyeti kelimeleri (`e-ticaret site analizi`, `CRO analizi`, `dönüşüm oranı analizi`, `ücretsiz e-ticaret denetimi`) — bilgi niyeti (`dönüşüm optimizasyonu`, `cro ajansı`) hizmet/rehber sayfalarında kalır; ölçüm rutini notu.

- [ ] **Step 1:** Test satırlarını ekle → FAIL (yüzeyde geçmeyen kelime) — [ ] **Step 2:** Diagnoo kopyasında kelimeleri doğal yerlere işle (brand voice; `seo.description` 140–160 korunur; sayılar metinde geçer) → PASS — [ ] **Step 3:** Doküman satırları — [ ] **Step 4:** `pnpm test && pnpm seo:audit` — [ ] **Step 5: Commit** — `docs(strateji): Diagnoo araç niyeti kelimeleri, v1.13; keyword-coverage araç satırları`

---

### Task 6: Destek rehberi — "E-ticaret sitesinde GAP analizi: adım adım CRO denetimi" (topic `cro`)

**Files:**
- Modify: `src/lib/content/articles.ts` (yeni kayıt, dizinin sonuna), `src/lib/content/tools.ts` (Diagnoo `bridges`'e bu yazının slug'ı — Task 2 mekanizması)
- Test: mevcut `tests/unit/articles-content.test.ts`, `en-spelling.test.ts`, `keyword-coverage.test.ts` (`TARGETS_ARTICLES` satırı: `["e-ticaret-gap-analizi-cro-denetimi", "gap analizi"]`)

**Interfaces:**
- Produces: `slug: { tr: "e-ticaret-gap-analizi-cro-denetimi", en: "ecommerce-gap-analysis-cro-audit" }`, `topic: "cro"`, `category: "growth"`, `tags: ["cro", "gap-analizi", "e-ticaret-denetimi", "donusum-orani"]`, `publishedAt: "2026-09-03"`, `readingMinutes` = kelime/150 yuvarlanmış, `authorSlug: "burak-ozgul"` (mevcut kayıtlarla aynı), rehber formatı ≥1.500 kelime TR (+EN parite), H2'lerin ≥%70'i soru:
  1. GAP analizi nedir, CRO denetiminden farkı ne?
  2. Hangi yedi sayfa incelenir ve neden bu yedisi?
  3. Semantik tutarlılık nasıl ölçülür?
  4. UI/UX ve bilişsel yük neden dönüşümü düşürür?
  5. Sayfa hızı kaybı paraya nasıl çevrilir? (formül, aralık mantığı, ölçülen/tahmini ayrımı)
  6. Ölçüm altyapısı eksikleri (GA4, Meta Pixel) neyi maliyete dönüştürür?
  7. Öncelik nasıl verilir: etki × efor
  8. 90 günlük kapatma planı nasıl kurulur?
  SSS: tam 10 soru (H2 tekrarı yok; her cevap ≥40 kelime TR/EN). İç linkler: `/hizmetler/cro`, `/hizmetler/e-ticaret`, `/hizmetler/performans-pazarlama`, ilgili 2 mevcut cro/e-ticaret yazısı. **Araca doğrudan link yazının gövdesinde YOK** — köprü Task 2 mekanizmasıyla yayında görünür. `seo.description` içindeki sayılar (7 sayfa, 90 gün) metinde geçer.

- [ ] **Step 1:** `keyword-coverage` satırı + (varsa) makale sayısı testi → FAIL — [ ] **Step 2:** Yazıyı `indoles-brand-voice` ile yaz (TR önce, EN parite, İngiliz imlası) — [ ] **Step 3:** `pnpm test` (articles-content, en-spelling, keyword) + `pnpm seo:audit` (yeni 2 URL) — [ ] **Step 4:** Commit — `feat(icerik): E-ticaret GAP analizi rehberi (cro) — Diagnoo destek içeriği`

---

### Task 7: Cila A — backend/lib (Faz 1 ertelenenleri)

**Files:**
- Modify: `src/lib/tools/diagnoo/unlock-cookie.ts`, `src/lib/tools/diagnoo/repository.ts`, `src/lib/tools/diagnoo/report.ts`, `src/lib/tools/diagnoo/schema.ts`, `src/components/tools/use-turnstile.ts` (doc yorumu), `src/components/tools/use-diagnoo-status.ts`
- Create: `migrations/0007_diagnoo_leads_ip_index.sql`
- Test: ilgili `__tests__` dosyaları

**Interfaces / yapılacaklar (her biri kendi testiyle):**
1. `readUnlockToken` (veya eşdeğeri): `decodeURIComponent` `try/catch` → bozuk cookie `null`; test: `%` içeren cookie → null, 500 yok.
2. `0007`: `CREATE INDEX idx_diagnoo_leads_ip ON diagnoo_leads (client_ip_hash, created_at);` (Türkçe gerekçe); `d1-helper.ts` 0007'yi yükler.
3. `BenchmarkComparisonSchema` `source`/`asOf` `.default("")`? Hayır — doğru davranış: eski satır uyumu için `.default("Kaynak belirtilmedi")` ve `.default(BENCHMARKS_VERSION)`; test: alanlar eksik eski JSON parse edilir.
4. `report.ts`: `scaleImpact(range, factor)` tek yardımcı; `scaleRoadmapImpacts` ve `recomputeWithKnownMetrics` onu kullanır (davranış testleri değişmeden yeşil).
5. `hasLead` üretimde ölü → kaldır (testiyle birlikte) — `git grep hasLead` yalnız test.
6. `use-turnstile.ts` doc yorumu ADR-028 gerçeğine göre.
7. `use-diagnoo-status.ts`: `inFlight` guard (üst üste binen poll yok); test: yavaş cevap sırasında ikinci tick istek atmaz.

- [ ] Her madde: test → FAIL → uygula → PASS; tek commit — `fix(diagnoo): cila A — cookie guard, leads IP indeksi, benchmark default, ölçek yardımcısı, poll guard`

---

### Task 8: Cila B — UI/a11y/site (Faz 1 ertelenenleri + canlı test bulguları)

**Files:**
- Create: `src/components/tools/tool-labels.ts`, `src/components/tools/robots-meta.tsx`
- Modify: `src/components/tools/diagnoo-snapshot.tsx`, `diagnoo-report.tsx`, `diagnoo-unlock-form.tsx`, `diagnoo-form.tsx`, `diagnoo-tool.tsx`, `src/components/tools/geo-tool.tsx`, `src/app/manifest.ts`, `src/components/marketing/ContactBookingScreen.tsx`, `src/components/marketing/entry-popup/EntryPopup.tsx`, `scripts/cf-smoke.sh`, `tests/e2e/contact-form.spec.ts`
- Test: ilgili bileşen testleri; `tests/unit/manifest.test.ts` (yeni)

**Yapılacaklar:**
1. `tool-labels.ts`: `CATEGORY_LABELS`, `PRIORITY_LABELS`, `Chip` tek kaynak; snapshot + report oradan okur.
2. Snapshot kilit maskesi para birimi locale'e göre (`TRY` biçimlendiricinin sembolü: `Intl.NumberFormat(...).formatToParts` ile `currency` parçası) — EN'de `TRY ——`, TR'de `₺ ——`.
3. Unlock formu: `aria-invalid` yalnız `invalid` kodunda ve ilgili alanda; hata metni `aria-describedby` ile e-posta/şirket alanına bağlı; aynı düzeltme `diagnoo-form.tsx` URL alanı için.
4. Snapshot testi `<StrictMode>` içinde render → `tool_scan_completed` bir kez.
5. **Robots meta senkronu (her iki araç):** `robots-meta.tsx` — `useEffect` ile `document.querySelector('meta[name="robots"]')` içeriğini prop'a göre günceller (yoksa oluşturur) ve unmount'ta eski değeri geri yazar; `geo-tool.tsx` sonuç durumunda ve `diagnoo-tool.tsx` snapshot/report/failed fazlarında `<RobotsMeta content="noindex, follow" />` render eder; test: faz değişince meta içeriği değişir, idle'a dönünce eski değer.
6. `manifest.ts`: `src: "/apple-icon.png"`, `"/icon.png"` (dosya adlarıyla; `src/app/icon.*` gerçek dosya adını kontrol et); test: manifest ikon yolları `public`/`app` içindeki gerçek dosyalara işaret eder.
7. Ölü `data-sitekey` attr'ları (ContactBookingScreen, EntryPopup) kaldır; contact/popup testleri yeşil.
8. `scripts/cf-smoke.sh`: bash 3.2 boş dizi — `"${DOH[@]+"${DOH[@]}"}"` kalıbı; `bash scripts/cf-smoke.sh https://example.invalid` DOH bayraksız artık "unbound variable" vermez (script testi: `bash -n` + `CF_SMOKE_DOH` olmadan koşu çıktısında "unbound" yok).
9. `tests/e2e/contact-form.spec.ts`: seçici `form[aria-label*="İletişim"] input[name="email"]` gibi forma kapsanır (formun gerçek erişilebilir adını kontrol et); spec varsayılan harness'ta geçer.

- [ ] Her madde: test → FAIL → uygula → PASS; iki commit — `fix(tools): cila B — paylaşılan etiketler, a11y hata bağları, StrictMode testi, EN maske para birimi` ve `fix(site): robots meta senkronu, manifest ikon yolları, ölü data-sitekey, cf-smoke bash 3.2, contact e2e seçici`

---

### Task 9: GA4 kurulumu — Admin API script'i + doğrulama script'i + runbook

**Files:**
- Create: `src/lib/analytics/ga4-admin.ts`, `scripts/ga4-setup.ts`, `scripts/ga4-verify.ts`, `src/lib/analytics/__tests__/ga4-admin.test.ts`
- Modify: `package.json` (`"ga4:setup"`, `"ga4:verify"`), `docs/runbooks/diagnoo-ga4-kurulum.md`, `.env.example` (`GA4_PROPERTY_ID=`, `GOOGLE_ANALYTICS_REFRESH_TOKEN=`)

**Interfaces:**
- Consumes: mevcut `GOOGLE_OAUTH_CLIENT_ID`/`GOOGLE_OAUTH_CLIENT_SECRET` (aynı OAuth istemcisi; yeni scope için tek seferlik consent), GA4 Admin API v1beta REST, Data API v1beta REST; olay taksonomisi `src/lib/analytics/events.ts`.
- Produces (saf, `fetch` enjekte edilebilir — testte mock):
  - `getAccessToken({ clientId, clientSecret, refreshToken }, fetch): Promise<string>`
  - `ensureCustomDimension(ctx, { parameterName, displayName, scope: "EVENT" })` — varsa atlar (`customDimensions.list`), yoksa `POST /v1beta/properties/{id}/customDimensions`. Boyutlar: `slug`, `band`, `category`, `target_service`.
  - `ensureEventCreateRule(ctx, { streamId, destinationEvent: "diagnoo_report_requested", sourceEvent: "tool_report_requested", conditions: [{ field: "slug", comparisonType: "EQUALS", value: "diagnoo" }] })` — `properties.dataStreams.eventCreateRules` list → create.
  - `ensureKeyEvent(ctx, { eventName: "diagnoo_report_requested", countingMethod: "ONCE_PER_EVENT" })` — `keyEvents.list` → `create`.
  - `scripts/ga4-setup.ts`: env'den kimlik + `GA4_PROPERTY_ID`; `--dry-run` (yalnız planı yazar), `--auth-url` (consent URL üretir: scope `https://www.googleapis.com/auth/analytics.edit`, `access_type=offline`, `prompt=consent`), `--exchange <code>` (code → refresh token; ekrana basar, kaydetmez); varsayılan çalıştırmada üç `ensure*` sırayla, idempotent, özet tablo.
  - `scripts/ga4-verify.ts`: Data API `runReport` (son 7 gün, `eventName` in `tool_used|tool_scan_completed|tool_report_requested|tool_roadmap_item_expanded|tool_service_cta_clicked`, boyut `customEvent:slug`) → olay/slug sayım tablosu; `--realtime` ile `runRealtimeReport`. Scope `analytics.readonly` (aynı token `analytics.edit` kapsar).
  - Runbook: API yolu adımları (1: GCP'de Analytics Admin API + Data API etkin; 2: `pnpm ga4:setup --auth-url` → Burak tıklar → `--exchange`; 3: `pnpm ga4:setup` (dry-run sonra gerçek); 4: funnel exploration UI adımları aynen kalır; 5: `pnpm ga4:verify`), mevcut UI adımları "API yolu çalışmazsa" başlığına iner.

- [ ] **Step 1: Failing testler** — `getAccessToken` token uç noktasına doğru gövde; `ensureCustomDimension` mevcutsa POST yok, yoksa POST gövdesi `{ parameterName, displayName, scope: "EVENT" }`; `ensureEventCreateRule` koşul gövdesi; `ensureKeyEvent` idempotent; script `--dry-run` hiçbir yazma çağrısı yapmaz (fetch mock'ta POST sayısı 0).
- [ ] **Step 2:** FAIL — [ ] **Step 3:** Uygula (yazma çağrıları YALNIZ script gerçek modda; testler mock) — [ ] **Step 4:** `pnpm test && pnpm typecheck && pnpm lint`; `pnpm ga4:setup --dry-run` gerçek env olmadan anlamlı hata verir ("GA4_PROPERTY_ID yok") — [ ] **Step 5: Commit** — `feat(analytics): GA4 kurulum ve doğrulama script'leri (Admin/Data API) + runbook API yolu`

> Gerçek çalıştırma (consent + `ga4:setup` + `ga4:verify`) Burak ön koşulludur; controller Burak'la birlikte koşar, task içinde değil.

---

### Task 10: Lansman anahtarı (Burak ön koşullu — sırlar + gerçek anahtarla koşu sonrası)

**Files:**
- Modify: `src/lib/content/tools.ts` (`published: true`), `src/app/(marketing)/[locale]/araclar/page.tsx` (META iki araç), `tests/unit/sitemap.test.ts`, `tests/unit/page-metadata.test.ts`, `tests/unit/tools-content.test.ts` (Task 1–2 beklentileri: `toolsForService("cro")` artık Diagnoo; `bridgesForArticle` dolu), `docs/02-information-architecture.md`, `docs/runbooks/diagnoo-ga4-kurulum.md` (tamamlandı işareti), `docs/strateji/INDOLES-Organik-Strateji-SEO-GEO-v1.md` (v1.14: Diagnoo canlıda)

**Ön koşullar (controller doğrular, task başlamaz aksi hâlde):** üretimde `GEMINI_API_KEY`, `FIRECRAWL_API_KEY`, `PSI_API_KEY` sırları; gerçek bir mağazayla `cf:preview`'da tam koşu (snapshot → unlock → rapor) kanıtı; Task 9 GA4 kurulumu (en az key event) yapılmış.

- [ ] **Step 1:** Test beklentilerini çevir (sitemap'te Diagnoo VAR, noindex YOK, indeks kartı 2, callout `cro`'da Diagnoo, köprüler görünür) → FAIL — [ ] **Step 2:** `published: true` + META (brand voice) + docs — [ ] **Step 3:** `pnpm test && pnpm typecheck && pnpm lint && pnpm seo:audit` (≥146 sayfa, 0 FAIL; tool profili 4 URL) + `pnpm og:diagnoo` güncel — [ ] **Step 4: Commit** — `feat(diagnoo): lansman — published:true, indeks META, üçgen linkler açık`
- Deploy + canlı MCP testi controller tarafından (Faz 1 zinciriyle aynı: push → cf:deploy → `scripts/cf-smoke.sh` → tarayıcı testi: gerçek tarama → snapshot → unlock → rapor → GA4 `ga4:verify`).

---

## Kapsam Dışı (Faz 3)
GSC/Meta Ads entegrasyonları, rakip analizi bölümü, GA4 OAuth ile gerçek veri çekimi, CRM push, PDF export, GA4 `client_id` ↔ lead eşlemesi, kullanıcıya rapor e-postası, `ToolPageShell` çıkarımı (üçüncü araçta), "Araçlar" nav linki (Burak kararı — IA değişikliği, ayrı karar).
