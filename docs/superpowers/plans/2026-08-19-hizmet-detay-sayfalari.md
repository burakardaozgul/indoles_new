# 12 Hizmet Detay Sayfası — Implementasyon Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** INDOLES sitesindeki 12 hizmetin her biri için, v2 tasarım diline uygun, SEO ve GEO açısından denetlenmiş bir detay sayfası yayınlamak.

**Architecture:** Hizmet içeriği `src/lib/content/services/` altında hizmet başına bir dosyada durur ve `ServiceContent` tipini uygular. `src/app/(marketing)/[locale]/hizmetler/[slug]/page.tsx` ince bir çözücüye dönüşür: slug önce pillar, sonra hizmet olarak aranır; iki ayrı şablon bileşeni render edilir. SEO/GEO katmanı (`src/lib/seo/`) içerik katmanını bilmeyen saf fonksiyonlardan oluşur — çağıran sayfa veriyi hazırlayıp verir.

**Tech Stack:** Next.js 15 App Router (RSC), TypeScript, next-intl v3, Tailwind + v2 CSS katmanı, Vitest (unit/integration), Playwright (e2e), pnpm.

**Spec:** `docs/superpowers/specs/2026-08-19-hizmet-detay-sayfalari-design.md`

## Global Constraints

- **Dil:** Kod yorumları ve testler Türkçe yazılır (mevcut kod tabanı kuralı). Yorum *ne* değil *neden* anlatır.
- **Persona sınırı:** Hizmet detay sayfasında persona **yok** — sayfa baştan sona orta ton, tek ses (docs/03 §1 ton tablosu, ADR-014). `shortDescription` persona-aware kalır ama yalnız `/hizmetler` listesinde ve anasayfa kartında render edilir. Detay sayfasında `[data-persona-variant]` bulunması audit FAIL'idir.
- **Uydurma yok:** Hizmet düzeyinde performans metriği (ROAS, CAC, yüzde artış) yazılmaz (spec §5.6, §14).
- **Pilot gate revizyonu (2026-08-20):** Taahhüt bloğu ve `commitments` alanı kaldırıldı. Kapsam ve teslim maddeleri başlık + açıklama çifti (`{title, description}`). Ton KOBİ alıcısına göre sade: kısa cümle, para/satış somutluğu, jargon ilk geçtiği yerde günlük dille açıklanır. Hero tek kolon akış + "teşhis föyü" (V2PageHeader kullanılmaz); şablon 8 blok. Task 6-8'deki hizmetler BU kalıpla yazılır — pilotun revize hâli tek referanstır.
- **EN copy çeviri değil, yeniden yazımdır** (docs/03 §7).
- **Karakter sınırı:** `seo.title` ≤60, `seo.description` ≤160 — TR ve EN ayrı ayrı.
- **Mevcut metne dokunma:** Faz 1-4 boyunca `pillars.ts` yalnız okunur. Refactor Task 9'da (spec §4.4).
- **Accent rengi tek:** ADR-015 — pillar'lar renkle değil geometriyle ayrışır (`PillarMark`, `ServiceIllustration`).
- **Git:** Commit adımları planda yazılıdır, ancak `git commit` **Burak'ın açık onayı olmadan çalıştırılmaz** (proje kuralı). Onay yoksa adım "değişiklikleri çalışma ağacında bırak" olarak geçilir.
- **Deploy yok:** Vercel/PR/prod hiçbir aşamada tetiklenmez.
- **Doğrulama komutları:** `pnpm typecheck`, `pnpm test`, `pnpm lint`, `pnpm test:e2e`.

---

## Dosya Yapısı

| Dosya | Sorumluluk |
|---|---|
| `src/lib/seo/site.ts` | `SITE_URL` tek kaynağı; `metadataBase` ile sitemap/robots'u hizalar |
| `src/lib/seo/alternates.ts` | canonical + hreflang üretimi. İçerik bilmez |
| `src/lib/seo/metadata.ts` | `Metadata` nesnesi kurar (title/description/OG/twitter/alternates) |
| `src/lib/seo/json-ld.ts` | `Service`, `BreadcrumbList`, `FAQPage`, `WebPage`, `Organization` düğümleri |
| `src/lib/seo/JsonLd.tsx` | `@graph`'i tek `<script>` olarak basar |
| `src/lib/content/services/index.ts` | `SERVICES`, `SERVICE_ORDER`, `getService`, `getServicesByPillar` |
| `src/lib/content/services/<slug>.ts` | Tek hizmetin tüm içeriği (12 dosya) |
| `src/components/marketing/service-detail.tsx` | 9 bloklu hizmet şablonu |
| `src/components/marketing/pillar-detail.tsx` | Mevcut pillar şablonu (page.tsx'ten taşınır) |
| `src/components/marketing/scope-columns.tsx` | Kapsar / Kapsamaz iki sütun |
| `src/lib/seo/audit.ts` | SEO+GEO denetim kuralları — saf fonksiyon, fixture ile test edilir |
| `scripts/seo-audit.ts` | CLI: sayfayı çeker, `auditHtml`e verir, PASS/FAIL basar |

---

### Task 1: SEO temeli — site URL'i ve alternates

Bu task iki iş yapıyor çünkü ikisi aynı hatayı düzeltiyor: `SITE_URL`'in iki farklı varsayılanı var.

**Bulgu:** `src/app/robots.ts:6` ve `src/app/sitemap.ts` `https://indoles.com.tr`'ye düşerken `src/app/layout.tsx:27` `metadataBase` `http://localhost:3000`'e düşüyor. `NEXT_PUBLIC_APP_URL` production build'de tanımsızsa **her canonical ve OG URL'i `localhost:3000` olur** — sitemap doğru, sayfalar yanlış. 12 yeni sayfa bu hatanın üzerine kurulacak.

**Files:**
- Create: `src/lib/seo/site.ts`
- Create: `src/lib/seo/alternates.ts`
- Modify: `src/app/layout.tsx:27-29`
- Modify: `src/app/robots.ts:5-7`
- Modify: `src/app/sitemap.ts:60-62`
- Test: `tests/unit/seo-alternates.test.ts`

**Interfaces:**
- Produces: `SITE_URL: string`, `absoluteUrl(path: string): string`, `type LocalizedPath = { tr: string; en: string }`, `buildAlternates(paths: LocalizedPath, locale: Locale): Metadata["alternates"]`

- [ ] **Step 1: Failing test yaz**

`tests/unit/seo-alternates.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { buildAlternates } from "@/lib/seo/alternates";
import { SITE_URL, absoluteUrl } from "@/lib/seo/site";

const PATHS = { tr: "/tr/hizmetler/cro", en: "/en/services/cro" };

describe("buildAlternates", () => {
  it("canonical'ı çağıran locale'e ayarlar", () => {
    expect(buildAlternates(PATHS, "tr").canonical).toBe("/tr/hizmetler/cro");
    expect(buildAlternates(PATHS, "en").canonical).toBe("/en/services/cro");
  });

  it("her iki locale'i de listeler — self-hreflang Google gereği", () => {
    const langs = buildAlternates(PATHS, "en").languages!;
    expect(langs.tr).toBe("/tr/hizmetler/cro");
    expect(langs.en).toBe("/en/services/cro");
  });

  it("x-default'u TR'ye bağlar — birincil pazar", () => {
    expect(buildAlternates(PATHS, "en").languages!["x-default"]).toBe(
      "/tr/hizmetler/cro",
    );
  });
});

describe("SITE_URL", () => {
  it("protokol içerir ve sonda slash bırakmaz", () => {
    expect(SITE_URL).toMatch(/^https?:\/\//);
    expect(SITE_URL.endsWith("/")).toBe(false);
  });

  it("absoluteUrl göreli yolu tam URL'e çevirir", () => {
    expect(absoluteUrl("/tr/hizmetler")).toBe(`${SITE_URL}/tr/hizmetler`);
  });

  it("absoluteUrl çift slash üretmez", () => {
    expect(absoluteUrl("tr/hizmetler")).toBe(`${SITE_URL}/tr/hizmetler`);
  });
});
```

- [ ] **Step 2: Testi çalıştır, başarısız olduğunu gör**

Run: `pnpm vitest run tests/unit/seo-alternates.test.ts`
Expected: FAIL — "Failed to resolve import @/lib/seo/site"

- [ ] **Step 3: `src/lib/seo/site.ts` yaz**

```ts
/**
 * Sitenin mutlak adresi — tek kaynak.
 *
 * Önceden üç yerde ayrı ayrı türetiliyordu ve varsayılanları uyuşmuyordu:
 * `robots.ts` ve `sitemap.ts` production adresine düşerken `layout.tsx`
 * `metadataBase`i `localhost:3000`e düşürüyordu. `NEXT_PUBLIC_APP_URL`
 * tanımsız bir production build'de sitemap doğru adresi, sayfaların
 * canonical ve OG etiketleri `localhost`u gösterirdi — sessiz ve ağır bir
 * SEO hatası. Varsayılan tek yerde duruyor.
 */
const FALLBACK = "https://indoles.com.tr";

export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL ?? FALLBACK).replace(
  /\/+$/,
  "",
);

/** Göreli yolu mutlak URL'e çevirir. Baştaki slash'ı garanti eder. */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}/${path.replace(/^\/+/, "")}`;
}
```

- [ ] **Step 4: `src/lib/seo/alternates.ts` yaz**

```ts
import type { Metadata } from "next";
import type { Locale } from "@/lib/content/types";

/** Aynı sayfanın iki dildeki yolu. Yollar göreli ve `/{locale}` ile başlar. */
export type LocalizedPath = { tr: string; en: string };

/**
 * canonical + hreflang üçlüsü.
 *
 * Göreli yol döner; Next `metadataBase` ile mutlaklaştırır. Her locale
 * kendini de listeler (self-hreflang, Google gereği) ve `x-default` her
 * zaman TR'yi gösterir — birincil pazar (docs/08 §3).
 */
export function buildAlternates(
  paths: LocalizedPath,
  locale: Locale,
): Metadata["alternates"] {
  return {
    canonical: paths[locale],
    languages: {
      tr: paths.tr,
      en: paths.en,
      "x-default": paths.tr,
    },
  };
}
```

- [ ] **Step 5: Testi çalıştır, geçtiğini gör**

Run: `pnpm vitest run tests/unit/seo-alternates.test.ts`
Expected: PASS — 6 test

- [ ] **Step 6: Üç tüketiciyi tek kaynağa bağla**

`src/app/layout.tsx` — `metadataBase` satırını değiştir:

```ts
import { SITE_URL } from "@/lib/seo/site";
// ...
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // ... kalan alanlar değişmez
```

`src/app/robots.ts` — yerel `baseUrl` türetmesini sil, `SITE_URL` kullan:

```ts
import { SITE_URL } from "@/lib/seo/site";
// baseUrl yerine SITE_URL
```

`src/app/sitemap.ts` — aynı şekilde:

```ts
import { SITE_URL } from "@/lib/seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;
  // ... gövde değişmez
```

- [ ] **Step 7: Tam doğrulama**

Run: `pnpm typecheck && pnpm test`
Expected: typecheck temiz, tüm testler PASS (mevcut 123 + 6 yeni)

- [ ] **Step 8: Commit** *(Burak onayı gerekli — yoksa atla)*

```bash
git add src/lib/seo/site.ts src/lib/seo/alternates.ts src/app/layout.tsx src/app/robots.ts src/app/sitemap.ts tests/unit/seo-alternates.test.ts
git commit -m "fix(seo): site URL'ini tek kaynağa bağla, alternates helper'ı ekle"
```

---

### Task 2: Metadata ve JSON-LD üreticileri

**Files:**
- Create: `src/lib/seo/metadata.ts`
- Create: `src/lib/seo/json-ld.ts`
- Create: `src/lib/seo/JsonLd.tsx`
- Test: `tests/unit/seo-metadata.test.ts`
- Test: `tests/unit/seo-json-ld.test.ts`

**Interfaces:**
- Consumes: `buildAlternates`, `LocalizedPath`, `absoluteUrl` (Task 1)
- Produces:
  - `buildMetadata(input: PageSeoInput): Metadata`
  - `type PageSeoInput = { title: string; description: string; paths: LocalizedPath; locale: Locale; ogType?: "website" | "article" }`
  - `organizationLd(): object`
  - `breadcrumbLd(items: Array<{ name: string; path?: string }>): object`
  - `faqLd(items: Array<{ question: string; answer: string }>): object`
  - `webPageLd(input: { name: string; description: string; path: string; locale: Locale }): object`
  - `serviceLd(input: ServiceLdInput): object`
  - `type ServiceLdInput = { name: string; description: string; serviceType: string; path: string; offers: Array<{ name: string; priceTRY: number; durationWeeks: number; path: string }> }` — `locale` almaz: `availableLanguage` her zaman iki dili birden listeler, hizmet iki dilde de sunuluyor
  - `<JsonLd graph={object[]} />`

- [ ] **Step 1: metadata failing test yaz**

`tests/unit/seo-metadata.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { buildMetadata } from "@/lib/seo/metadata";

const BASE = {
  title: "Performans pazarlama",
  description: "Google, LinkedIn ve Meta kanallarında B2B ve e-ticaret alıcısına ulaşan performans pazarlama yönetimi.",
  paths: { tr: "/tr/hizmetler/performans-pazarlama", en: "/en/services/performance-marketing" },
  locale: "tr" as const,
};

describe("buildMetadata", () => {
  it("title ve description'ı aynen taşır", () => {
    const m = buildMetadata(BASE);
    expect(m.title).toBe("Performans pazarlama");
    expect(m.description).toBe(BASE.description);
  });

  it("canonical'ı çağıran locale'e bağlar", () => {
    expect(buildMetadata(BASE).alternates?.canonical).toBe(
      "/tr/hizmetler/performans-pazarlama",
    );
  });

  it("OG locale'ini TR için tr_TR, EN için en_US yapar", () => {
    expect(buildMetadata(BASE).openGraph?.locale).toBe("tr_TR");
    expect(buildMetadata({ ...BASE, locale: "en" }).openGraph?.locale).toBe("en_US");
  });

  it("OG url'ini canonical ile aynı tutar — çelişen sinyal vermez", () => {
    const m = buildMetadata(BASE);
    expect(m.openGraph?.url).toBe(m.alternates?.canonical);
  });

  it("twitter kartını summary_large_image yapar", () => {
    expect(buildMetadata(BASE).twitter?.card).toBe("summary_large_image");
  });

  it("varsayılan og:type website'tır", () => {
    expect(buildMetadata(BASE).openGraph?.type).toBe("website");
  });
});
```

- [ ] **Step 2: Testi çalıştır, başarısız olduğunu gör**

Run: `pnpm vitest run tests/unit/seo-metadata.test.ts`
Expected: FAIL — modül yok

- [ ] **Step 3: `src/lib/seo/metadata.ts` yaz**

```ts
import type { Metadata } from "next";
import type { Locale } from "@/lib/content/types";
import { buildAlternates, type LocalizedPath } from "./alternates";

export type PageSeoInput = {
  /** `layout.tsx`'teki "%s — INDOLES" şablonuna girer; markayı tekrarlama. */
  title: string;
  /** ≤160 karakter. Kesme yapılmaz — çağıran doğru uzunlukta verir. */
  description: string;
  paths: LocalizedPath;
  locale: Locale;
  ogType?: "website" | "article";
};

const OG_LOCALE: Record<Locale, string> = { tr: "tr_TR", en: "en_US" };
const ALT_LOCALE: Record<Locale, string> = { tr: "en_US", en: "tr_TR" };

/**
 * Sayfa metadata'sı — tek giriş noktası.
 *
 * `openGraph.url` bilinçli olarak canonical ile aynı: ikisi ayrıştığında
 * sosyal paylaşım ve arama motoru farklı sayfayı kanonik sayar.
 */
export function buildMetadata({
  title,
  description,
  paths,
  locale,
  ogType = "website",
}: PageSeoInput): Metadata {
  const alternates = buildAlternates(paths, locale);
  const canonical = paths[locale];

  return {
    title,
    description,
    alternates,
    openGraph: {
      type: ogType,
      siteName: "INDOLES",
      title,
      description,
      locale: OG_LOCALE[locale],
      alternateLocale: ALT_LOCALE[locale],
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      site: "@indoles",
      title,
      description,
    },
  };
}
```

- [ ] **Step 4: Testi çalıştır, geçtiğini gör**

Run: `pnpm vitest run tests/unit/seo-metadata.test.ts`
Expected: PASS — 6 test

- [ ] **Step 5: JSON-LD failing test yaz**

`tests/unit/seo-json-ld.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  organizationLd,
  breadcrumbLd,
  faqLd,
  webPageLd,
  serviceLd,
} from "@/lib/seo/json-ld";
import { SITE_URL } from "@/lib/seo/site";

describe("organizationLd", () => {
  it("Organization tipinde ve yasal adı taşır", () => {
    const ld = organizationLd() as Record<string, unknown>;
    expect(ld["@type"]).toBe("Organization");
    expect(ld.legalName).toBe("İndoles Yazılım A.Ş.");
  });
});

describe("breadcrumbLd", () => {
  it("position'ları 1'den başlatır ve sırayla artırır", () => {
    const ld = breadcrumbLd([
      { name: "INDOLES", path: "/tr" },
      { name: "Hizmetler", path: "/tr/hizmetler" },
      { name: "CRO" },
    ]) as { itemListElement: Array<Record<string, unknown>> };
    expect(ld.itemListElement.map((i) => i.position)).toEqual([1, 2, 3]);
  });

  it("son öğeye item vermez — mevcut sayfa kendine link olmaz", () => {
    const ld = breadcrumbLd([
      { name: "INDOLES", path: "/tr" },
      { name: "CRO" },
    ]) as { itemListElement: Array<Record<string, unknown>> };
    expect(ld.itemListElement[0].item).toBe(`${SITE_URL}/tr`);
    expect(ld.itemListElement[1].item).toBeUndefined();
  });
});

describe("faqLd", () => {
  it("her soruyu Question, her cevabı Answer olarak sarar", () => {
    const ld = faqLd([{ question: "Ne kadar sürer?", answer: "Dört hafta." }]) as {
      mainEntity: Array<Record<string, any>>;
    };
    expect(ld["@type" as keyof typeof ld]).toBe("FAQPage");
    expect(ld.mainEntity[0]["@type"]).toBe("Question");
    expect(ld.mainEntity[0].acceptedAnswer["@type"]).toBe("Answer");
    expect(ld.mainEntity[0].acceptedAnswer.text).toBe("Dört hafta.");
  });

  it("soru yoksa null döner — boş FAQPage geçersiz şemadır", () => {
    expect(faqLd([])).toBeNull();
  });
});

describe("serviceLd", () => {
  const INPUT = {
    name: "CRO",
    description: "Dönüşüm oranı optimizasyonu.",
    serviceType: "Dönüşüm oranı optimizasyonu danışmanlığı",
    path: "/tr/hizmetler/cro",
    offers: [
      { name: "Büyüme Sprinti", priceTRY: 240000, durationWeeks: 4, path: "/tr/paketler/buyume-sprinti" },
    ],
  };

  it("Service tipinde ve sağlayıcıyı INDOLES'e bağlar", () => {
    const ld = serviceLd(INPUT) as Record<string, any>;
    expect(ld["@type"]).toBe("Service");
    expect(ld.provider["@type"]).toBe("Organization");
    expect(ld.areaServed).toBe("TR");
  });

  it("paketleri hasOfferCatalog altında gerçek fiyatla listeler", () => {
    const ld = serviceLd(INPUT) as Record<string, any>;
    const offer = ld.hasOfferCatalog.itemListElement[0];
    expect(offer.priceSpecification.price).toBe(240000);
    expect(offer.priceSpecification.priceCurrency).toBe("TRY");
  });

  it("paket yoksa hasOfferCatalog koymaz — boş katalog yanlış sinyal", () => {
    const ld = serviceLd({ ...INPUT, offers: [] }) as Record<string, any>;
    expect(ld.hasOfferCatalog).toBeUndefined();
  });
});

describe("webPageLd", () => {
  it("inLanguage'ı locale'den alır", () => {
    const ld = webPageLd({
      name: "CRO", description: "x", path: "/tr/hizmetler/cro", locale: "tr",
    }) as Record<string, unknown>;
    expect(ld.inLanguage).toBe("tr-TR");
  });
});
```

- [ ] **Step 6: Testi çalıştır, başarısız olduğunu gör**

Run: `pnpm vitest run tests/unit/seo-json-ld.test.ts`
Expected: FAIL — modül yok

- [ ] **Step 7: `src/lib/seo/json-ld.ts` yaz**

```ts
import type { Locale } from "@/lib/content/types";
import { SITE_URL, absoluteUrl } from "./site";

const ORG_ID = `${SITE_URL}/#organization`;

const IN_LANGUAGE: Record<Locale, string> = { tr: "tr-TR", en: "en-US" };

/** Organization — `@id` ile diğer düğümlerden referans alınır, tekrar edilmez. */
export function organizationLd() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: "INDOLES",
    legalName: "İndoles Yazılım A.Ş.",
    url: SITE_URL,
    logo: absoluteUrl("/logo.svg"),
    address: { "@type": "PostalAddress", addressCountry: "TR" },
  };
}

/**
 * BreadcrumbList.
 *
 * Son öğe `item` almaz: mevcut sayfa kendine link vermez, Google bunu
 * "son kırıntı = bulunduğun yer" olarak okur.
 */
export function breadcrumbLd(items: Array<{ name: string; path?: string }>) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.path ? { item: absoluteUrl(item.path) } : {}),
    })),
  };
}

/**
 * FAQPage.
 *
 * Boş listede `null` döner — soru içermeyen FAQPage geçersiz ve
 * Search Console'da uyarı üretir. Çağıran `.filter(Boolean)` ile eler.
 */
export function faqLd(items: Array<{ question: string; answer: string }>) {
  if (items.length === 0) return null;
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function webPageLd({
  name,
  description,
  path,
  locale,
}: {
  name: string;
  description: string;
  path: string;
  locale: Locale;
}) {
  return {
    "@type": "WebPage",
    "@id": absoluteUrl(path),
    url: absoluteUrl(path),
    name,
    description,
    inLanguage: IN_LANGUAGE[locale],
    isPartOf: { "@id": ORG_ID },
  };
}

export type ServiceLdInput = {
  name: string;
  description: string;
  serviceType: string;
  path: string;
  offers: Array<{
    name: string;
    priceTRY: number;
    durationWeeks: number;
    path: string;
  }>;
};

/**
 * Service.
 *
 * `hasOfferCatalog` yalnız gerçek paket varsa eklenir; fiyatlar
 * `packages.ts`ten birebir gelir. Boş katalog "hizmet var ama satın
 * alınamıyor" sinyali verir.
 */
export function serviceLd({
  name,
  description,
  serviceType,
  path,
  offers,
}: ServiceLdInput) {
  return {
    "@type": "Service",
    name,
    description,
    serviceType,
    url: absoluteUrl(path),
    provider: { "@type": "Organization", "@id": ORG_ID, name: "INDOLES" },
    areaServed: "TR",
    availableLanguage: ["tr", "en"],
    ...(offers.length > 0
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name,
            itemListElement: offers.map((o) => ({
              "@type": "Offer",
              name: o.name,
              url: absoluteUrl(o.path),
              priceSpecification: {
                "@type": "PriceSpecification",
                price: o.priceTRY,
                priceCurrency: "TRY",
              },
            })),
          },
        }
      : {}),
  };
}
```

- [ ] **Step 8: `src/lib/seo/JsonLd.tsx` yaz**

```tsx
/**
 * JSON-LD basıcı.
 *
 * Tüm düğümler tek `@graph` altında toplanır: sayfada birden çok
 * `<script type="application/ld+json">` bulunması geçerli olsa da,
 * `@id` referanslarının (ör. Organization) çözülmesi tek grafikte
 * garanti. `null` düğümler elenir — `faqLd` soru yoksa null döner.
 */
export function JsonLd({ graph }: { graph: Array<object | null> }) {
  const nodes = graph.filter(Boolean);
  if (nodes.length === 0) return null;

  return (
    <script
      type="application/ld+json"
      // İçerik build-time'da bizim ürettiğimiz nesne; kullanıcı girdisi yok.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": nodes }),
      }}
    />
  );
}
```

- [ ] **Step 9: Testleri çalıştır, geçtiğini gör**

Run: `pnpm vitest run tests/unit/seo-json-ld.test.ts tests/unit/seo-metadata.test.ts`
Expected: PASS — 15 test

- [ ] **Step 10: Tam doğrulama**

Run: `pnpm typecheck && pnpm test && pnpm lint`
Expected: hepsi temiz

- [ ] **Step 11: Commit** *(Burak onayı gerekli)*

```bash
git add src/lib/seo tests/unit/seo-metadata.test.ts tests/unit/seo-json-ld.test.ts
git commit -m "feat(seo): metadata ve JSON-LD üreticilerini ekle"
```

---

### Task 3: `ServiceContent` tipi + pilot içerik (performans pazarlama)

Tip ve ilk içerik dosyası birlikte: tip tek başına test edilemez, içerik tipsiz yazılamaz.

**Files:**
- Modify: `src/lib/content/types.ts` (dosya sonuna ekle — `PillarContent` bu task'ta değişmez)
- Create: `src/lib/content/services/index.ts`
- Create: `src/lib/content/services/performans-pazarlama.ts`
- Test: `tests/unit/services-content.test.ts`

**Interfaces:**
- Produces:
  - `type ServiceContent` (spec §4.2'deki alanların tamamı)
  - `type ServiceDeliverableKind = "document" | "system" | "training" | "access"`
  - `SERVICES: ServiceContent[]`
  - `SERVICE_ORDER: string[]` — TR slug'ları, anasayfa kart sırası
  - `getService(slug: string, locale: Locale): ServiceContent | null` — her iki locale slug'ıyla da bulur
  - `getServicesByPillar(pillar: Pillar): ServiceContent[]`
  - `PILLAR_KEYS: readonly Pillar[]`

- [ ] **Step 1: Failing test yaz**

`tests/unit/services-content.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  SERVICES,
  SERVICE_ORDER,
  getService,
  getServicesByPillar,
} from "@/lib/content/services";
import { PILLARS } from "@/lib/content/pillars";

const LOCALES = ["tr", "en"] as const;

describe("SERVICES bütünlüğü", () => {
  it("her hizmetin iki dilde de slug'ı var", () => {
    for (const s of SERVICES) {
      for (const loc of LOCALES) {
        expect(s.slug[loc], `${s.slug.tr} → ${loc}`).toBeTruthy();
      }
    }
  });

  it("slug'lar locale içinde benzersiz", () => {
    for (const loc of LOCALES) {
      const slugs = SERVICES.map((s) => s.slug[loc]);
      expect(new Set(slugs).size, `${loc} slug çakışması`).toBe(slugs.length);
    }
  });

  it("hiçbir slug pillar anahtarını gölgelemiyor", () => {
    // Route çözümü pillar-önce: aynı adlı bir hizmet sessizce erişilemez olur.
    const pillarKeys = PILLARS.map((p) => p.key) as string[];
    for (const s of SERVICES) {
      for (const loc of LOCALES) {
        expect(pillarKeys, `${s.slug[loc]} pillar anahtarıyla çakışıyor`)
          .not.toContain(s.slug[loc]);
      }
    }
  });

  it("SERVICE_ORDER, SERVICES ile birebir örtüşür", () => {
    // Diyagram indeksi buradan seçiliyor; sıra kayarsa görseller sessizce kayar.
    expect([...SERVICE_ORDER].sort()).toEqual(
      SERVICES.map((s) => s.slug.tr).sort(),
    );
  });

  it("relatedServices kendine referans vermez", () => {
    for (const s of SERVICES) {
      for (const ref of s.relatedServices) {
        expect(ref, `${s.slug.tr} kendine referans veriyor`).not.toBe(s.slug.tr);
      }
    }
  });

  it("relatedServices üç komşu belirtir", () => {
    for (const s of SERVICES) {
      expect(s.relatedServices.length, s.slug.tr).toBe(3);
    }
  });

  // Bütünlük kontrolü küme tamamlanınca açılır: içerik dosyaları sırayla
  // yazılıyor ve komşu referansları henüz yazılmamış hizmetleri gösteriyor.
  // Kontrolün sessizce kapalı kalması mümkün değil — SERVICE_ORDER'ın 12
  // hizmet içerdiğini ayrı bir test doğruluyor (Task 8).
  it("küme tamamlandığında relatedServices var olan slug'lara işaret eder", () => {
    if (SERVICES.length < 12) return;
    const known = new Set(SERVICES.map((s) => s.slug.tr));
    for (const s of SERVICES) {
      for (const ref of s.relatedServices) {
        expect(known, `${s.slug.tr} → ${ref}`).toContain(ref);
      }
    }
  });

  it("pillar'ı bilinen bir pillar'dır", () => {
    const keys = PILLARS.map((p) => p.key);
    for (const s of SERVICES) expect(keys).toContain(s.pillar);
  });
});

describe("SEO alan sınırları", () => {
  it("seo.title her dilde ≤60 karakter", () => {
    for (const s of SERVICES) {
      for (const loc of LOCALES) {
        expect(s.seo.title[loc].length, `${s.slug.tr}/${loc}`).toBeLessThanOrEqual(60);
      }
    }
  });

  it("seo.description her dilde ≤160 ve ≥80 karakter", () => {
    for (const s of SERVICES) {
      for (const loc of LOCALES) {
        const len = s.seo.description[loc].length;
        expect(len, `${s.slug.tr}/${loc} kısa`).toBeGreaterThanOrEqual(80);
        expect(len, `${s.slug.tr}/${loc} uzun`).toBeLessThanOrEqual(160);
      }
    }
  });
});

describe("içerik blokları dolu", () => {
  it("kapsam iki sütunu da doludur", () => {
    for (const s of SERVICES) {
      for (const loc of LOCALES) {
        expect(s.scope.includes[loc].length, `${s.slug.tr}/${loc}`).toBeGreaterThanOrEqual(6);
        expect(s.scope.excludes[loc].length, `${s.slug.tr}/${loc}`).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it("yöntem 4 adımdır ve her adımın çıktısı vardır", () => {
    for (const s of SERVICES) {
      expect(s.method.length, s.slug.tr).toBe(4);
      for (const m of s.method) {
        for (const loc of LOCALES) expect(m.output[loc], s.slug.tr).toBeTruthy();
      }
    }
  });

  it("SSS 4-6 sorudur", () => {
    for (const s of SERVICES) {
      expect(s.faq.length, s.slug.tr).toBeGreaterThanOrEqual(4);
      expect(s.faq.length, s.slug.tr).toBeLessThanOrEqual(6);
    }
  });

  it("SSS cevapları kendine yeter — anafora içermez", () => {
    // GEO: pasaj bağlamından koparıldığında anlamını korumalı (spec §8.1).
    const anaphora = /^(bu|bunu|bunlar|o |onu |yukarıda|ayrıca|ancak)/i;
    for (const s of SERVICES) {
      for (const f of s.faq) {
        for (const loc of LOCALES) {
          expect(anaphora.test(f.answer[loc].trim()), `${s.slug.tr}: "${f.question[loc]}"`)
            .toBe(false);
          expect(f.answer[loc].split(/\s+/).length, `${s.slug.tr}: "${f.question[loc]}" kısa`)
            .toBeGreaterThanOrEqual(40);
        }
      }
    }
  });

  it("taahhüt şeridi 3 olgudur", () => {
    for (const s of SERVICES) expect(s.commitments.length, s.slug.tr).toBe(3);
  });

  it("çıktılar 5-7 kalemdir", () => {
    for (const s of SERVICES) {
      expect(s.deliverables.length, s.slug.tr).toBeGreaterThanOrEqual(5);
      expect(s.deliverables.length, s.slug.tr).toBeLessThanOrEqual(7);
    }
  });

  it("kimin-için 3 sinyaldir, her dilde", () => {
    for (const s of SERVICES) {
      for (const loc of LOCALES) {
        expect(s.signals[loc].length, `${s.slug.tr}/${loc}`).toBe(3);
      }
    }
  });
});

describe("getService", () => {
  it("TR slug'ıyla bulur", () => {
    expect(getService("performans-pazarlama", "tr")?.pillar).toBe("growth");
  });

  it("EN slug'ıyla bulur", () => {
    expect(getService("performance-marketing", "en")?.slug.tr).toBe("performans-pazarlama");
  });

  it("bilinmeyen slug'da null döner", () => {
    expect(getService("olmayan-hizmet", "tr")).toBeNull();
  });
});

describe("getServicesByPillar", () => {
  it("SERVICE_ORDER sırasını korur", () => {
    const growth = getServicesByPillar("growth").map((s) => s.slug.tr);
    const expected = SERVICE_ORDER.filter((slug) =>
      SERVICES.find((s) => s.slug.tr === slug)?.pillar === "growth",
    );
    expect(growth).toEqual(expected);
  });
});
```

- [ ] **Step 2: Testi çalıştır, başarısız olduğunu gör**

Run: `pnpm vitest run tests/unit/services-content.test.ts`
Expected: FAIL — "@/lib/content/services" çözülemiyor

- [ ] **Step 3: Tipi ekle**

`src/lib/content/types.ts` sonuna:

```ts
export type ServiceDeliverableKind = "document" | "system" | "training" | "access";

/**
 * Bir hizmetin detay sayfasını taşıyan içerik.
 *
 * Ton orta, ses tek: hizmet detay sayfaları docs/03 §1 ton tablosunda
 * "orta ton, tek versiyon" olarak sabitlenmiş (ADR-014). Yalnız
 * `shortDescription` iki varyantlı ve o da bu sayfada değil, listede
 * kullanılıyor.
 *
 * Gerekçe iki yönlü: belge bakım yükünü ve ton tekrarını gösteriyor,
 * GEO tarafı da aynı yere çıkıyor — `PersonaText` her iki varyantı da
 * DOM'a bastığı için (globals.css → persona merceği) persona-aware bir
 * detay sayfası indekslenebilir metni şişirir ve `FAQPage` şemasını
 * görünen metinle uyumsuz kılar (spec §6).
 */
export type ServiceContent = {
  slug: Localized<string>;
  pillar: Pillar;
  name: Localized<string>;

  /**
   * Anasayfa/liste kartı metni. `pillars.ts`'ten kopyalandı.
   *
   * Persona-aware KALIR — ama detay sayfasında değil, `/hizmetler`
   * listesinde ve anasayfa kartında render edilir. docs/03 o iki yüzeyi
   * persona-aware sayıyor, hizmet detayını orta ton.
   */
  shortDescription: PersonaText;

  /** Hero lede — iki cümle, tek ses. */
  lede: Localized<string>;

  /** "Bu üç durumdan biri sizdeyse" — tam 3 madde, tek ses. */
  signals: Localized<string[]>;

  scope: {
    /** 6-8 madde. */
    includes: Localized<string[]>;
    /** 3-4 madde. Beklenti hizalar, GEO'da ayrıştırıcı sinyal üretir. */
    excludes: Localized<string[]>;
  };

  /** Tam 4 adım. Pillar yönteminden miras alınmaz — hizmete özeldir. */
  method: Array<{
    step: string;
    title: Localized<string>;
    description: Localized<string>;
    /** Bu adımın sonunda müşterinin elinde ne olur. */
    output: Localized<string>;
  }>;

  /** 5-7 kalem. */
  deliverables: Array<{
    kind: ServiceDeliverableKind;
    label: Localized<string>;
  }>;

  /**
   * Üç olgusal taahhüt: tipik süre, ekip şekli, giriş paketi.
   * Performans metriği DEĞİL — hizmet düzeyinde doğrulanabilir veri yok
   * ve uydurma sayı GEO'da yanlış atfa yol açıyor (spec §5.6).
   */
  commitments: Array<{
    value: Localized<string>;
    label: Localized<string>;
  }>;

  /** 4-6 soru. Tek sesli olmak zorunda — `FAQPage` görünen metinle eşleşir. */
  faq: Array<{
    question: Localized<string>;
    answer: Localized<string>;
  }>;

  seo: {
    /** ≤60 karakter. "— INDOLES" eki layout şablonundan gelir. */
    title: Localized<string>;
    /** 80-160 karakter. */
    description: Localized<string>;
    /** Sayfada açık isimle geçmesi gereken varlıklar — audit kontrol listesi. */
    entities: Localized<string[]>;
  };

  /** Paket slug'ı (TR). Boşsa pillar eşlemesine düşülür. */
  relatedPackages: string[];
  /** Komşu hizmet slug'ı (TR), 3 adet. */
  relatedServices: string[];
};
```

- [ ] **Step 4: Pilot içerik dosyasını yaz**

`src/lib/content/services/performans-pazarlama.ts` — `ServiceContent` tipini uygulayan tam nesne.

**Copy kaynakları (yeni iddia üretilmez):**
- `shortDescription`: `pillars.ts:84-97`'den **birebir kopyala**
- Ton ve söz dağarcığı: `docs/03-brand-voice-tone.md`
- Kanal/kapsam gerçekleri: `docs/01-vision-positioning.md`, `PACKAGES` içindeki `buyume-sprinti` ve `growth-engine` scope listeleri
- Eski site referansı: `indoles_eski/sayfalar/dijital-pazarlama-hizmetleri/`

**Alan brief'i:**

| Alan | İçerik |
|---|---|
| `slug` | `{ tr: "performans-pazarlama", en: "performance-marketing" }` |
| `pillar` | `"growth"` |
| `lede` | Tek cümle, kanonik: performans pazarlamanın INDOLES'te ne olduğu. Kanal adı geçer (Google, Meta, LinkedIn) |
| `signals` | 3 durum cümlesi, "…isteniyorsa" değil "…oluyorsa" kipinde — teşhis, temenni değil. Hem sanayi hem ticaret alıcısının tanıyacağı durumlar; biri seçilip diğeri dışarıda bırakılmaz |
| `scope.includes` | 6-8: kanal denetimi, hesap yapısı, audience segmentasyonu, creative test döngüsü, bütçe dağılımı, ölçüm/attribution kurulumu, raporlama ritmi |
| `scope.excludes` | 3-4: içerik üretimi (ayrı hizmet), organik SEO (ayrı), marka kimliği tasarımı (`marka-stratejisi`), influencer sözleşme yönetimi |
| `method` | 01 Hesap ve veri denetimi · 02 Kanal hipotezi ve bütçe · 03 Test döngüsü · 04 Ölçek ve devir. Her adımın `output`'u somut bir artefakt |
| `deliverables` | 5-7: kanal denetim raporu (`document`), ölçüm/attribution kurulumu (`system`), test takvimi (`document`), performans paneli (`system`), iç ekip devir oturumu (`training`), reklam hesabı sahipliği (`access`) |
| `commitments` | `{ tipik süre: "4-12 hafta" }`, `{ ekip: "1 stratejist + 1 kanal uzmanı + 1 analist" }`, `{ giriş paketi: "Büyüme Sprinti" }` |
| `faq` | 5 soru. Örnek: "Ne kadar sürede sonuç görürüz?", "Reklam bütçesi hizmet bedeline dahil mi?", "Mevcut ajansımızla çalışabilir misiniz?", "Hangi kanallarda çalışıyorsunuz?", "Reklam hesaplarının sahibi kim olur?" |
| `seo.title` | TR: `Performans pazarlama yönetimi` · EN: `Performance marketing management` (≤60) |
| `seo.description` | 80-160, ne + kime + ayrıştırıcı |
| `seo.entities` | TR: `["INDOLES", "performans pazarlama", "Google Ads", "Meta", "LinkedIn", "ROAS", "müşteri edinim maliyeti"]` |
| `relatedPackages` | `["buyume-sprinti"]` (mevcut slug'ı `packages.ts`'ten doğrula) |
| `relatedServices` | `["cro", "marka-stratejisi", "e-ticaret"]` |

**Yazım kuralları (Global Constraints'e ek):**
- Her `faq.answer` ≥40 kelime ve ilk cümlesi soruyu tam yanıtlar
- `faq.answer` "Bu…", "Bunu…", "Yukarıda…", "Ayrıca…" ile **başlamaz**
- Cevapta hizmet adı veya "INDOLES" en az bir kez açık isimle geçer
- EN metin TR'nin çevirisi değil; EN arama niyetine göre yeniden yazılır

- [ ] **Step 5: `src/lib/content/services/index.ts` yaz**

```ts
import type { Locale, Pillar, ServiceContent } from "../types";
import { performansPazarlama } from "./performans-pazarlama";

/**
 * Hizmetlerin kanonik sırası.
 *
 * Açık dizi olmak zorunda: `ServiceIllustration` diyagramını bu sıradaki
 * indeksle seçiyor. `SERVICES`ten türetilirse bir hizmet eklendiğinde
 * 12 sayfanın görseli sessizce kayar.
 *
 * Task 6-8'de her yeni hizmet buraya ve `SERVICES`e eklenir; testler
 * ikisinin örtüştüğünü doğrular.
 */
export const SERVICE_ORDER: string[] = ["performans-pazarlama"];

export const SERVICES: ServiceContent[] = [performansPazarlama];

/** İki locale slug'ıyla da bulur — EN sayfada EN slug gelir. */
export function getService(slug: string, locale: Locale): ServiceContent | null {
  return SERVICES.find((s) => s.slug[locale] === slug) ?? null;
}

/** Pillar'ın hizmetleri, `SERVICE_ORDER` sırasında. */
export function getServicesByPillar(pillar: Pillar): ServiceContent[] {
  return SERVICE_ORDER.map(
    (slug) => SERVICES.find((s) => s.slug.tr === slug)!,
  ).filter((s) => s.pillar === pillar);
}

/** `SERVICE_ORDER` içindeki konum — diyagram seçer. -1 = bilinmeyen. */
export function serviceOrderIndex(slug: string): number {
  return SERVICE_ORDER.indexOf(slug);
}
```

- [ ] **Step 6: Testleri çalıştır, geçtiğini gör**

Run: `pnpm vitest run tests/unit/services-content.test.ts`
Expected: PASS — tüm assertion'lar tek hizmet üzerinde geçer

- [ ] **Step 7: Tam doğrulama**

Run: `pnpm typecheck && pnpm test`
Expected: temiz

- [ ] **Step 8: Commit** *(Burak onayı gerekli)*

```bash
git add src/lib/content/types.ts src/lib/content/services tests/unit/services-content.test.ts
git commit -m "feat(content): ServiceContent tipi ve performans pazarlama içeriği"
```

---

### Task 4: Hizmet detay şablonu ve route çözücü

**Files:**
- Create: `src/components/marketing/scope-columns.tsx`
- Create: `src/components/marketing/service-detail.tsx`
- Create: `src/components/marketing/pillar-detail.tsx`
- Modify: `src/app/(marketing)/[locale]/hizmetler/[slug]/page.tsx` (tamamen yeniden yazılır)
- Test: `tests/unit/service-detail.test.tsx`

**Interfaces:**
- Consumes: `getService`, `getServicesByPillar`, `SERVICE_ORDER` (Task 3); `buildMetadata`, `JsonLd`, `serviceLd`, `breadcrumbLd`, `faqLd`, `webPageLd` (Task 1-2); mevcut `V2PageHeader`, `PersonaText`, `PersonaListItems`, `PersonaSwitch`, `ServiceIllustration`, `ContactCallout`, `PopupCTAButton`
- Produces: `<ServiceDetail service={ServiceContent} locale={Locale} />`, `<PillarDetail pillar={PillarContent} locale={Locale} />`, `<ScopeColumns includes={string[]} excludes={string[]} locale={Locale} />`

- [ ] **Step 1: Failing test yaz**

`tests/unit/service-detail.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScopeColumns } from "@/components/marketing/scope-columns";

describe("ScopeColumns", () => {
  const props = {
    includes: ["Kanal denetimi", "Bütçe dağılımı"],
    excludes: ["İçerik üretimi"],
    locale: "tr" as const,
  };

  it("iki sütunu da başlıkla basar", () => {
    render(<ScopeColumns {...props} />);
    expect(screen.getByRole("heading", { name: /kapsar/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /kapsamaz/i })).toBeInTheDocument();
  });

  it("her maddeyi liste öğesi olarak basar", () => {
    render(<ScopeColumns {...props} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("EN locale'de başlıkları İngilizce verir", () => {
    render(<ScopeColumns {...props} locale="en" />);
    expect(screen.getByRole("heading", { name: /what's included/i })).toBeInTheDocument();
  });

  it("kapsamaz boşsa o sütunu hiç basmaz", () => {
    render(<ScopeColumns {...props} excludes={[]} />);
    expect(screen.queryByRole("heading", { name: /kapsamaz/i })).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Testi çalıştır, başarısız olduğunu gör**

Run: `pnpm vitest run tests/unit/service-detail.test.tsx`
Expected: FAIL — modül yok

- [ ] **Step 3: `scope-columns.tsx` yaz**

```tsx
import * as React from "react";
import type { Locale } from "@/lib/content/types";

const LABELS = {
  tr: { includes: "Kapsar", excludes: "Kapsamaz" },
  en: { includes: "What's included", excludes: "What's not included" },
} as const;

/**
 * Kapsam — iki sütun.
 *
 * "Kapsamaz" sütunu satış öncesi beklenti hizalar; ayrıca rakip hizmet
 * sayfalarında bulunmadığı için AI motorlarının alıntılamaya yatkın
 * olduğu ayrıştırıcı cümleleri üretir (spec §5.3, §8.7).
 */
export function ScopeColumns({
  includes,
  excludes,
  locale,
}: {
  includes: string[];
  excludes: string[];
  locale: Locale;
}) {
  const t = LABELS[locale];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
      <div className="md:col-span-7">
        <h3 className="typography-label uppercase tracking-widest text-ink-500">
          {t.includes}
        </h3>
        <ul className="mt-6 border-t border-surface-2">
          {includes.map((item) => (
            <li
              key={item}
              className="flex items-start gap-4 py-4 border-b border-surface-2 typography-body-md text-ink-700"
            >
              <span
                aria-hidden="true"
                className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {excludes.length > 0 ? (
        <div className="md:col-span-5">
          <h3 className="typography-label uppercase tracking-widest text-ink-500">
            {t.excludes}
          </h3>
          <ul className="mt-6 border-t border-surface-2">
            {excludes.map((item) => (
              <li
                key={item}
                className="flex items-start gap-4 py-4 border-b border-surface-2 typography-body-sm text-ink-500"
              >
                <span aria-hidden="true" className="mt-1 shrink-0">
                  —
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 4: Testi çalıştır, geçtiğini gör**

Run: `pnpm vitest run tests/unit/service-detail.test.tsx`
Expected: PASS — 4 test

- [ ] **Step 5: `service-detail.tsx` yaz**

Dokuz blok, spec §5 sırasına birebir uyar. Yapı kuralları:

- Sayfada **tek `h1`** — `V2PageHeader`'ın `title`'ı. Blok başlıkları `h2`, alt başlıklar `h3`. Atlama yok.
- Bölüm sırası: Hero → Kimin için → Kapsam → Yöntem → Çıktılar → Taahhüt → SSS → İlgili → CTA
- Persona **hiç yok**: `PersonaText`, `PersonaListItems` ve `PersonaSwitch` bu şablonda kullanılmaz. Değişecek metin yokken persona anahtarı sunmak ziyaretçiyi yanıltır
- Yöntem `<ol>`, çıktılar `<dl>`, kapsam `<ul>` (ScopeColumns)
- SSS `<details>`/`<summary>` — `paketler/[slug]/page.tsx:186-200`'deki desenin aynısı
- Hero aside: yalnız `<ServiceIllustration index={serviceOrderIndex(service.slug.tr)} />`
- İlgili bölümü dört grup: paket → vaka → komşu 3 hizmet → yazı. Komşu hizmet linkleri `service.relatedServices`'ten, `getService(slug, "tr")` ile çözülüp **çağıran locale'in slug'ıyla** linklenir
- Her bölüm `aria-labelledby` ile başlığına bağlanır
- CTA: mevcut `<ContactCallout locale={locale} />`

Bölüm sınıfları mevcut desenden alınır: `className="border-b border-surface-2"` ve dönüşümlü `v2-surface`; iç kap `<div className="ds-container py-24 md:py-32">`.

- [ ] **Step 6: `pillar-detail.tsx` yaz**

`src/app/(marketing)/[locale]/hizmetler/[slug]/page.tsx`'in mevcut gövdesini (metrics → methodology → services → packages → featured case → CTA) **davranışını değiştirmeden** bileşene taşı. İmza `params` yerine `{ pillar, locale }` alır; gövde aynen kalır.

**`getServicesByPillar`a burada geçilmez.** Plan başlangıçta bu geçişi buraya koyuyordu; hatalıydı. `SERVICES` bu noktada yalnız pilot hizmeti içerdiği için Growth pillar sayfası beş hizmet yerine bir hizmet gösterirdi — Task 8'e kadar süren bir regresyon. Hizmet listesi `pillar.services`ten okunmaya devam eder; geçiş 12 içerik dosyası tamamlandıktan sonra Task 9'da yapılır (spec §4.4'teki geçici çoğullama penceresi tam olarak bunun içindir).

- [ ] **Step 7: `page.tsx`'i ince çözücüye indirge**

```tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getPillar, PILLARS } from "@/lib/content/pillars";
import { getService, SERVICES } from "@/lib/content/services";
import { PillarDetail } from "@/components/marketing/pillar-detail";
import { ServiceDetail } from "@/components/marketing/service-detail";
import { buildMetadata } from "@/lib/seo/metadata";
import type { Locale } from "@/lib/content/types";

const LOCALES = ["tr", "en"] as const;

/** `/hizmetler` TR'de, `/services` EN'de — locale başına ayrı taban. */
function servicePaths(service: { slug: { tr: string; en: string } }) {
  return {
    tr: `/tr/hizmetler/${service.slug.tr}`,
    en: `/en/services/${service.slug.en}`,
  };
}

function pillarPaths(key: string) {
  return { tr: `/tr/hizmetler/${key}`, en: `/en/services/${key}` };
}

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => [
    ...PILLARS.map((p) => ({ locale, slug: p.key })),
    ...SERVICES.map((s) => ({ locale, slug: s.slug[locale] })),
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const loc = locale as Locale;

  // Çözüm sırası pillar-önce: aynı adlı bir hizmet pillar'ı gölgelerdi.
  // `services-content.test.ts` bu çakışmayı build'den önce yakalıyor.
  const pillar = getPillar(slug);
  if (pillar) {
    return buildMetadata({
      title: pillar.name[loc],
      description: pillar.heroLede[loc].slice(0, 160),
      paths: pillarPaths(pillar.key),
      locale: loc,
    });
  }

  const service = getService(slug, loc);
  if (!service) return {};

  return buildMetadata({
    title: service.seo.title[loc],
    description: service.seo.description[loc],
    paths: servicePaths(service),
    locale: loc,
  });
}

export default async function ServicesSlugPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const pillar = getPillar(slug);
  if (pillar) return <PillarDetail pillar={pillar} locale={loc} />;

  const service = getService(slug, loc);
  if (service) return <ServiceDetail service={service} locale={loc} />;

  notFound();
}
```

- [ ] **Step 8: JSON-LD'yi `ServiceDetail` içine bağla**

`ServiceDetail`'in en üstünde, `V2PageHeader`'dan önce. Önce yerel değişkenler:

```tsx
const servicesRoot = `/${locale}/${locale === "tr" ? "hizmetler" : "services"}`;
const paths = {
  tr: `/tr/hizmetler/${service.slug.tr}`,
  en: `/en/services/${service.slug.en}`,
};
const pillar = PILLARS.find((p) => p.key === service.pillar)!;
const relatedPackages = service.relatedPackages.length > 0
  ? PACKAGES.filter((p) => service.relatedPackages.includes(p.slug.tr))
  : PACKAGES.filter((p) => p.pillar === service.pillar);
```

```tsx
<JsonLd
  graph={[
    organizationLd(),
    webPageLd({
      name: service.name[locale],
      description: service.seo.description[locale],
      path: paths[locale],
      locale,
    }),
    breadcrumbLd([
      { name: "INDOLES", path: `/${locale}` },
      { name: locale === "tr" ? "Hizmetler" : "Services", path: servicesRoot },
      { name: pillar.name[locale], path: `${servicesRoot}/${pillar.key}` },
      { name: service.name[locale] },
    ]),
    serviceLd({
      name: service.name[locale],
      description: service.seo.description[locale],
      serviceType: service.seo.title[locale],
      path: paths[locale],
      offers: relatedPackages.map((p) => ({
        name: p.name[locale],
        priceTRY: p.pricing.TRY,
        durationWeeks: p.durationWeeks,
        path: `/${locale}/${locale === "tr" ? "paketler" : "packages"}/${p.slug[locale]}`,
      })),
    }),
    faqLd(
      service.faq.map((f) => ({
        question: f.question[locale],
        answer: f.answer[locale],
      })),
    ),
  ]}
/>
```

- [ ] **Step 9: Dev sunucuda gör**

Run: `pnpm dev` (arka planda), sonra tarayıcıda:
- `http://localhost:3000/tr/hizmetler/performans-pazarlama` — 9 blok görünür
- `http://localhost:3000/en/services/performance-marketing` — EN içerik
- `http://localhost:3000/tr/hizmetler/growth` — pillar sayfası **bozulmamış**
- `http://localhost:3000/tr/hizmetler/olmayan` — 404

Expected: dördü de doğru. Konsol hatası yok.

- [ ] **Step 10: Tam doğrulama**

Run: `pnpm typecheck && pnpm test && pnpm lint`
Expected: temiz

- [ ] **Step 11: Commit** *(Burak onayı gerekli)*

```bash
git add src/components/marketing/scope-columns.tsx src/components/marketing/service-detail.tsx src/components/marketing/pillar-detail.tsx "src/app/(marketing)/[locale]/hizmetler/[slug]/page.tsx" tests/unit/service-detail.test.tsx
git commit -m "feat(hizmetler): hizmet detay şablonu ve route çözücü"
```

---

### Task 5: SEO + GEO audit script'i

**Files:**
- Create: `src/lib/seo/audit.ts` — saf denetim kuralları
- Create: `scripts/seo-audit.ts` — CLI (fetch + rapor)
- Create: `tests/unit/seo-audit.test.ts`
- Modify: `package.json` (script girdisi + devDependency)
- Create: `docs/16-service-pages-seo-audit.md`

**Interfaces:**
- Produces:
  - `auditHtml(html: string, expectations: Expectations): Finding[]`
  - `type Finding = { rule: string; level: "fail" | "warn"; detail: string }`
  - `type Expectations = { entities: string[]; minInternalLinks: number; minSiblingLinks: number; siblingHrefs: string[] }`

**Neden `src/lib/seo/audit.ts`, `scripts/*.mjs` değil:** denetim mantığı `.mjs` içinde kalsaydı `.ts` testten import edilince `tsc --noEmit` "declaration file bulunamadı" hatası verirdi. Kurallar tipli TypeScript olarak `src/` altında durur ve vitest doğrudan test eder; `scripts/seo-audit.ts` yalnız fetch + rapor yapan ince bir CLI ve `tsx` ile koşar.

- [ ] **Step 1: Failing test yaz**

`tests/unit/seo-audit.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { auditHtml } from "@/lib/seo/audit";

const EXPECT = {
  entities: ["INDOLES", "performans pazarlama"],
  minInternalLinks: 6,
  minSiblingLinks: 3,
  siblingHrefs: ["/tr/hizmetler/cro", "/tr/hizmetler/marka-stratejisi", "/tr/hizmetler/e-ticaret"],
};

function page(overrides = {}) {
  const d = {
    title: "Performans pazarlama — INDOLES",
    description: "x".repeat(120),
    h1: ["Performans pazarlama"],
    ...overrides,
  };
  return `<!doctype html><html lang="tr"><head>
    <title>${d.title}</title>
    <meta name="description" content="${d.description}">
    <link rel="canonical" href="https://indoles.com.tr/tr/hizmetler/performans-pazarlama">
    <link rel="alternate" hreflang="tr" href="https://indoles.com.tr/tr/hizmetler/performans-pazarlama">
    <link rel="alternate" hreflang="en" href="https://indoles.com.tr/en/services/performance-marketing">
    <link rel="alternate" hreflang="x-default" href="https://indoles.com.tr/tr/hizmetler/performans-pazarlama">
  </head><body>
    ${d.h1.map((h) => `<h1>${h}</h1>`).join("")}
    <p>INDOLES performans pazarlama ekibi.</p>
  </body></html>`;
}

const rules = (f: Array<{ rule: string }>) => f.map((x) => x.rule);

describe("auditHtml", () => {
  it("tek h1 olan sayfada h1 kuralı geçer", () => {
    expect(rules(auditHtml(page(), EXPECT))).not.toContain("h1-count");
  });

  it("iki h1'i yakalar", () => {
    const f = auditHtml(page({ h1: ["A", "B"] }), EXPECT);
    expect(rules(f)).toContain("h1-count");
  });

  it("h1 yokluğunu yakalar", () => {
    expect(rules(auditHtml(page({ h1: [] }), EXPECT))).toContain("h1-count");
  });

  it("60 karakteri aşan title'ı yakalar", () => {
    const f = auditHtml(page({ title: "x".repeat(75) }), EXPECT);
    expect(rules(f)).toContain("title-length");
  });

  it("160 karakteri aşan description'ı yakalar", () => {
    const f = auditHtml(page({ description: "x".repeat(200) }), EXPECT);
    expect(rules(f)).toContain("description-length");
  });

  it("eksik x-default hreflang'i yakalar", () => {
    const html = page().replace(/<link rel="alternate" hreflang="x-default"[^>]*>/, "");
    expect(rules(auditHtml(html, EXPECT))).toContain("hreflang");
  });

  it("eksik canonical'ı yakalar", () => {
    const html = page().replace(/<link rel="canonical"[^>]*>/, "");
    expect(rules(auditHtml(html, EXPECT))).toContain("canonical");
  });

  it("metinde geçmeyen varlığı yakalar", () => {
    const f = auditHtml(page(), { ...EXPECT, entities: ["INDOLES", "iş zekası"] });
    const finding = f.find((x) => x.rule === "entities");
    expect(finding?.detail).toContain("iş zekası");
  });

  it("h2 atlayıp h4'e geçen başlık sırasını yakalar", () => {
    const html = page().replace("</body>", "<h2>A</h2><h4>B</h4></body>");
    expect(rules(auditHtml(html, EXPECT))).toContain("heading-order");
  });

  it("alt'sız görseli yakalar", () => {
    const html = page().replace("</body>", '<img src="/a.png"></body>');
    expect(rules(auditHtml(html, EXPECT))).toContain("img-alt");
  });

  it("aria-hidden görselde alt aramaz", () => {
    const html = page().replace("</body>", '<img src="/a.png" aria-hidden="true"></body>');
    expect(rules(auditHtml(html, EXPECT))).not.toContain("img-alt");
  });

  it("geçersiz JSON-LD'yi yakalar", () => {
    const html = page().replace(
      "</head>",
      '<script type="application/ld+json">{bozuk</script></head>',
    );
    expect(rules(auditHtml(html, EXPECT))).toContain("json-ld-parse");
  });

  it("eksik Service düğümünü yakalar", () => {
    expect(rules(auditHtml(page(), EXPECT))).toContain("json-ld-types");
  });

  it("sayfaya sızmış persona metnini yakalar", () => {
    // Hizmet detay tek sesli; bir bileşen sessizce PersonaText kullanırsa
    // metin ikiye katlanır ve FAQPage şeması görünen metinle ayrışır.
    const html = page().replace(
      "</body>",
      '<span data-persona-variant="commerce">CAC düşer</span></body>',
    );
    expect(rules(auditHtml(html, EXPECT))).toContain("persona-leak");
  });

  it("yetersiz iç link sayısını yakalar", () => {
    expect(rules(auditHtml(page(), EXPECT))).toContain("internal-links");
  });
});
```

- [ ] **Step 2: Testi çalıştır, başarısız olduğunu gör**

Run: `pnpm vitest run tests/unit/seo-audit.test.ts`
Expected: FAIL — `@/lib/seo/audit` çözülemiyor

- [ ] **Step 3: `src/lib/seo/audit.ts` yaz**

Saf fonksiyon: HTML girer, `Finding[]` çıkar. Ağ erişimi ve dosya sistemi yok — fixture ile test edilebilir olmasının şartı bu.

Kurallar — her biri `Finding` üretir, `rule` alanı testteki adlarla **birebir** aynı:

| `rule` | Kontrol |
|---|---|
| `h1-count` | `<h1>` sayısı tam 1 değilse |
| `title-length` | `<title>` >60 karakter |
| `description-length` | `meta[name=description]` >160 veya <80 |
| `canonical` | `link[rel=canonical]` yok |
| `hreflang` | tr, en, x-default üçünden biri eksik veya self yok |
| `heading-order` | Başlık seviyesi 1'den fazla atlıyorsa |
| `json-ld-parse` | `application/ld+json` içeriği parse edilemiyorsa |
| `json-ld-types` | `Service`, `BreadcrumbList`, `FAQPage`'ten biri yoksa |
| `faq-answer` | Cevap <40 kelime veya anafora kalıbıyla başlıyorsa |
| `internal-links` | Site içi `<a href>` sayısı `minInternalLinks`'in altındaysa |
| `sibling-links` | `siblingHrefs`'ten `minSiblingLinks` kadarı yoksa |
| `persona-leak` | Sayfada `[data-persona-variant]` bulunuyorsa — hizmet detay tek sesli olmalı |
| `img-alt` | `aria-hidden` olmayan `<img>`de `alt` yoksa |
| `entities` | `expectations.entities` maddelerinden biri gövde metninde geçmiyorsa |

**Parser kararı:** `cheerio` eklenir. Regex ile başlık sırası ve persona metin oranı güvenilir ölçülemez — ikisi de DOM ağacı gerektiriyor. jsdom test ortamında var ama script'te ağır kalıyor.

- [ ] **Step 3b: `scripts/seo-audit.ts` (CLI) yaz**

```
pnpm seo:audit <slug> [--base http://localhost:3000]
```

Her iki locale'i de çeker (`/tr/hizmetler/<trSlug>`, `/en/services/<enSlug>`), `SERVICES` verisinden `entities` ve `siblingHrefs` beklentilerini kurar, PASS/FAIL basar. Bir `fail` varsa çıkış kodu 1.

- [ ] **Step 4: Bağımlılıkları ekle**

Run: `pnpm add -D cheerio tsx`

- [ ] **Step 5: Testleri çalıştır, geçtiğini gör**

Run: `pnpm vitest run tests/unit/seo-audit.test.ts`
Expected: PASS — 15 test

- [ ] **Step 6: package.json script'i ekle**

```json
"seo:audit": "tsx scripts/seo-audit.ts"
```

- [ ] **Step 7: Pilot sayfada koş**

Run: `pnpm dev` arka planda, sonra `pnpm seo:audit performans-pazarlama`
Expected: TR ve EN için rapor. **FAIL varsa Task 4'e dön ve düzelt, sonra tekrar koş.**

- [ ] **Step 8: Lighthouse — yalnız pilot**

Chrome DevTools ile `http://localhost:3000/tr/hizmetler/performans-pazarlama` üzerinde performans / erişilebilirlik / SEO denetimi. 390px ve 1440px görsel doğrulama.

- [ ] **Step 9: Audit raporunu başlat**

`docs/16-service-pages-seo-audit.md` — sayfa başına bir bölüm: URL (TR/EN), audit tarihi, bulgular, uygulanan düzeltmeler, son durum. Pilot sayfayla doldur.

- [ ] **Step 10: Commit** *(Burak onayı gerekli)*

```bash
git add src/lib/seo/audit.ts scripts/seo-audit.ts tests/unit/seo-audit.test.ts package.json pnpm-lock.yaml docs/16-service-pages-seo-audit.md
git commit -m "feat(seo): audit script'i ve pilot sayfa raporu"
```

---

### GATE: Burak onayı

Task 6'ya geçmeden **dur**. Burak'a sun:

- Pilot sayfanın TR ve EN hâli (tarayıcıda)
- Audit çıktısı
- Lighthouse skorları

Onaylanması gereken: **copy tonu, blok sırası, sayfa uzunluğu, EN'in çeviri gibi okunmadığı.** Onay gelmeden kalan 11 hizmet yazılmaz — bu gate'in tek amacı 11 sayfanın yanlış tonda üretilmesini önlemek.

Ton değişikliği isteniyorsa pilot düzeltilir, audit tekrar koşulur, gate tekrar sunulur.

---

### Task 6: Growth — kalan 4 hizmet

**Files:**
- Create: `src/lib/content/services/marka-stratejisi.ts`
- Create: `src/lib/content/services/cro.ts`
- Create: `src/lib/content/services/e-ticaret.ts`
- Create: `src/lib/content/services/ui-ux-tasarim.ts`
- Modify: `src/lib/content/services/index.ts` (import + `SERVICES` + `SERVICE_ORDER`)

**Interfaces:**
- Consumes: `ServiceContent` (Task 3), onaylanan pilot dosya kalıbı
- Produces: `SERVICE_ORDER` 5 elemana çıkar; sıra `pillars.ts`'teki growth sırasıdır: `marka-stratejisi`, `performans-pazarlama`, `cro`, `e-ticaret`, `ui-ux-tasarim`

- [ ] **Step 1: `marka-stratejisi.ts` yaz**

Pilot dosyanın alan alan kalıbını izle. Bu hizmete özel içerik:

- `slug`: `{ tr: "marka-stratejisi", en: "brand-strategy" }`
- `shortDescription`: `pillars.ts:67-83`'ten **birebir kopyala**
- `scope.excludes`: reklam kampanyası yönetimi (`performans-pazarlama`), arayüz tasarımı (`ui-ux-tasarim`), matbaa/prodüksiyon işleri
- `relatedServices`: `["performans-pazarlama", "ui-ux-tasarim", "e-ticaret"]`
- `relatedPackages`: `packages.ts`'te `pillar === "growth"` olanlardan uygun olan
- `commitments`: tipik süre, ekip şekli, giriş paketi — uydurma metrik yok
- Kaynak: `docs/03-brand-voice-tone.md`, eski site `indoles_eski/sayfalar/kreatif-hizmetler/`

- [ ] **Step 2: `cro.ts` yaz**

- `slug`: `{ tr: "cro", en: "cro" }` — kısaltma iki pazarda da aranıyor
- `shortDescription`: `pillars.ts:98-114`'ten birebir
- `scope.excludes`: trafik satın alma (`performans-pazarlama`), altyapı/hız optimizasyonu (`teknoloji-ve-altyapi`), yeniden tasarım projesi (`ui-ux-tasarim`)
- `relatedServices`: `["performans-pazarlama", "ui-ux-tasarim", "e-ticaret"]`
- Kaynak: eski site `indoles_eski/sayfalar/cro-donusum-orani-optimizasyonu/` ve `donusum-optimizasyonu-yontemleri/`
- `seo.entities` TR: `["INDOLES", "dönüşüm oranı optimizasyonu", "A/B testi", "sepet terk", "checkout"]`

- [ ] **Step 3: `e-ticaret.ts` yaz**

- `slug`: `{ tr: "e-ticaret", en: "e-commerce" }`
- `shortDescription`: `pillars.ts:115-128`'den birebir
- `scope.excludes`: reklam yönetimi, depo/lojistik operasyonu, ürün fotoğrafı prodüksiyonu
- `relatedServices`: `["cro", "performans-pazarlama", "ozel-yazilim-ve-mobil"]`
- Kaynak: eski site `indoles_eski/sayfalar/e-ticaret-danismanligi/`

- [ ] **Step 4: `ui-ux-tasarim.ts` yaz**

- `slug`: `{ tr: "ui-ux-tasarim", en: "ui-ux-design" }`
- `shortDescription`: `pillars.ts:129-142`'den birebir
- `scope.excludes`: frontend implementasyonu (`ozel-yazilim-ve-mobil`), marka kimliği oluşturma (`marka-stratejisi`), illüstrasyon/motion prodüksiyonu
- `relatedServices`: `["marka-stratejisi", "cro", "ozel-yazilim-ve-mobil"]`

- [ ] **Step 5: `index.ts`'i güncelle**

```ts
export const SERVICE_ORDER: string[] = [
  "marka-stratejisi",
  "performans-pazarlama",
  "cro",
  "e-ticaret",
  "ui-ux-tasarim",
];

export const SERVICES: ServiceContent[] = [
  markaStratejisi,
  performansPazarlama,
  cro,
  eTicaret,
  uiUxTasarim,
];
```

- [ ] **Step 6: İçerik testlerini çalıştır**

Run: `pnpm vitest run tests/unit/services-content.test.ts`
Expected: PASS — 5 hizmetin tümü için sınırlar geçer. FAIL varsa ilgili içerik dosyası düzeltilir (test gevşetilmez).

- [ ] **Step 7: Dört sayfayı ayrı ayrı denetle**

Run (her biri için):
```
pnpm seo:audit marka-stratejisi
pnpm seo:audit cro
pnpm seo:audit e-ticaret
pnpm seo:audit ui-ux-tasarim
```
Expected: her biri TR+EN PASS. FAIL → düzelt → tekrar koş.

- [ ] **Step 8: Bulguları rapora işle**

`docs/16-service-pages-seo-audit.md`'ye dört bölüm ekle.

- [ ] **Step 9: Tam doğrulama**

Run: `pnpm typecheck && pnpm test && pnpm lint`
Expected: temiz

- [ ] **Step 10: Commit** *(Burak onayı gerekli)*

```bash
git add src/lib/content/services docs/16-service-pages-seo-audit.md
git commit -m "feat(content): Growth hizmet sayfaları (4 hizmet)"
```

---

### Task 7: Transform — 5 hizmet

**Files:**
- Create: `src/lib/content/services/ai-danismanlik.ts`
- Create: `src/lib/content/services/dijital-donusum.ts`
- Create: `src/lib/content/services/is-otomasyonlari.ts`
- Create: `src/lib/content/services/is-zekasi.ts`
- Create: `src/lib/content/services/isletme-muhendisligi.ts`
- Modify: `src/lib/content/services/index.ts`

**Interfaces:**
- Consumes: `ServiceContent`, onaylanan kalıp
- Produces: `SERVICE_ORDER` 10 elemana çıkar; transform sırası `pillars.ts`'teki gibi

- [ ] **Step 1: `ai-danismanlik.ts` yaz**
`{ tr: "ai-danismanlik", en: "ai-consulting" }` · `shortDescription`: `pillars.ts:221-234` birebir · `excludes`: model eğitimi/araştırma, veri etiketleme operasyonu, GPU altyapı işletmesi · `relatedServices`: `["is-otomasyonlari", "is-zekasi", "dijital-donusum"]`

- [ ] **Step 2: `dijital-donusum.ts` yaz**
`{ tr: "dijital-donusum", en: "digital-transformation" }` · `shortDescription`: `pillars.ts:235-248` birebir · `excludes`: ERP lisans satışı, donanım tedariki, kurum içi değişim yönetimi eğitimi (ayrı kapsam) · `relatedServices`: `["is-otomasyonlari", "isletme-muhendisligi", "teknoloji-ve-altyapi"]`
Not: `dijital-donusum` EN slug'ı `digital-transformation` — pillar anahtarı `transform` ile çakışmaz, test doğrular.

- [ ] **Step 3: `is-otomasyonlari.ts` yaz**
`{ tr: "is-otomasyonlari", en: "business-automation" }` · `shortDescription`: `pillars.ts:249-262` birebir · `excludes`: fiziksel robotik/OT donanımı, üçüncü parti yazılım lisansı, sürekli operasyon personeli · `relatedServices`: `["dijital-donusum", "ai-danismanlik", "is-zekasi"]`

- [ ] **Step 4: `is-zekasi.ts` yaz**
`{ tr: "is-zekasi", en: "business-intelligence" }` · `shortDescription`: `pillars.ts:263-276` birebir · `excludes`: veri ambarı donanımı, günlük raporlama operasyonu, veri girişi temizliği (kaynak sistemde) · `relatedServices`: `["is-otomasyonlari", "ai-danismanlik", "isletme-muhendisligi"]`

- [ ] **Step 5: `isletme-muhendisligi.ts` yaz**
`{ tr: "isletme-muhendisligi", en: "business-engineering" }` · `shortDescription`: `pillars.ts:277-290` birebir · `excludes`: fabrika yerleşim projelendirmesi, İSG danışmanlığı, kalite belgelendirme denetimi · `relatedServices`: `["dijital-donusum", "is-zekasi", "is-otomasyonlari"]`

- [ ] **Step 6: `index.ts`'i güncelle** — 10 hizmet, `SERVICE_ORDER` pillar sırasında

- [ ] **Step 7: İçerik testleri**

Run: `pnpm vitest run tests/unit/services-content.test.ts`
Expected: PASS

- [ ] **Step 8: Beş sayfayı ayrı ayrı denetle**

Run: `pnpm seo:audit ai-danismanlik`, `dijital-donusum`, `is-otomasyonlari`, `is-zekasi`, `isletme-muhendisligi`
Expected: her biri TR+EN PASS

- [ ] **Step 9: Rapora işle, tam doğrulama**

Run: `pnpm typecheck && pnpm test && pnpm lint`

- [ ] **Step 10: Commit** *(Burak onayı gerekli)*

```bash
git add src/lib/content/services docs/16-service-pages-seo-audit.md
git commit -m "feat(content): Transform hizmet sayfaları (5 hizmet)"
```

---

### Task 8: Build — 2 hizmet

**Files:**
- Create: `src/lib/content/services/ozel-yazilim-ve-mobil.ts`
- Create: `src/lib/content/services/teknoloji-ve-altyapi.ts`
- Modify: `src/lib/content/services/index.ts`

**Interfaces:**
- Produces: `SERVICE_ORDER` **12 elemana** çıkar — bu, `pillars.ts`'teki tüm hizmetleri kapsar ve Task 9'un refactor'unu mümkün kılar

- [ ] **Step 1: `ozel-yazilim-ve-mobil.ts` yaz**
`{ tr: "ozel-yazilim-ve-mobil", en: "custom-software-development" }` · `shortDescription`: `pillars.ts:369-385` birebir · `excludes`: app store pazarlaması (`performans-pazarlama`), süresiz bakım sözleşmesi (ayrı anlaşma), üçüncü parti API lisans bedelleri · `relatedServices`: `["teknoloji-ve-altyapi", "ui-ux-tasarim", "e-ticaret"]` · Kaynak: eski site `indoles_eski/sayfalar/mobil-uygulama-ve-yazilim-cozumleri/`

- [ ] **Step 2: `teknoloji-ve-altyapi.ts` yaz**
`{ tr: "teknoloji-ve-altyapi", en: "technology-infrastructure" }` · `shortDescription`: `pillars.ts:386-400` birebir · `excludes`: 7/24 yönetilen hizmet operasyonu, donanım tedariki, bulut sağlayıcı lisans bedelleri · `relatedServices`: `["ozel-yazilim-ve-mobil", "dijital-donusum", "is-otomasyonlari"]`

- [ ] **Step 3: `index.ts`'i 12 hizmete tamamla**

`SERVICE_ORDER` tam sıra — `pillars.ts`'teki `SERVICE_ORDER` ile **birebir aynı** olmalı, çünkü `ServiceIllustration` indeksleri buna bağlı:

```ts
export const SERVICE_ORDER: string[] = [
  "marka-stratejisi", "performans-pazarlama", "cro", "e-ticaret", "ui-ux-tasarim",
  "ai-danismanlik", "dijital-donusum", "is-otomasyonlari", "is-zekasi", "isletme-muhendisligi",
  "ozel-yazilim-ve-mobil", "teknoloji-ve-altyapi",
];
```

- [ ] **Step 4: Sıranın eskiyle aynı olduğunu doğrulayan test ekle**

`tests/unit/services-content.test.ts`'e:

```ts
import { SERVICE_ORDER as LEGACY_ORDER } from "@/lib/content/pillars";

it("yeni sıra pillars.ts'teki eski sırayla birebir aynı", () => {
  // ServiceIllustration diyagramları indeksle seçiliyor; sıra kayarsa
  // 12 sayfanın görseli sessizce değişir ve kimse fark etmez.
  expect(SERVICE_ORDER).toEqual(LEGACY_ORDER);
});
```

- [ ] **Step 5: Testleri çalıştır**

Run: `pnpm vitest run tests/unit/services-content.test.ts`
Expected: PASS — 12 hizmet, sıra eşleşiyor

- [ ] **Step 6: İki sayfayı denetle**

Run: `pnpm seo:audit ozel-yazilim-ve-mobil`, `pnpm seo:audit teknoloji-ve-altyapi`
Expected: TR+EN PASS

- [ ] **Step 7: Rapora işle, tam doğrulama**

Run: `pnpm typecheck && pnpm test && pnpm lint`

- [ ] **Step 8: Commit** *(Burak onayı gerekli)*

```bash
git add src/lib/content/services tests/unit/services-content.test.ts docs/16-service-pages-seo-audit.md
git commit -m "feat(content): Build hizmet sayfaları — 12 hizmet tamam"
```

---

### Task 9: `pillars.ts` refactor ve tüketicilerin bağlanması

Bu task spec §4.4'teki geçici çoğullamayı kapatır. **Task 8 bitmeden yapılamaz** — `SERVICES` 12 hizmeti kapsamıyorsa tüketiciler eksik liste görür.

**Files:**
- Modify: `src/lib/content/types.ts` (`PillarContent.services` alanı kaldırılır)
- Modify: `src/lib/content/pillars.ts` (satır içi `services` dizileri ve `SERVICE_ORDER`/`serviceIndex` silinir)
- Modify: `src/components/v2/sections/ServicesScroll.tsx`
- Modify: `src/app/(marketing)/[locale]/hizmetler/page.tsx`
- Modify: `src/components/marketing/pillar-detail.tsx`
- Test: `tests/unit/services-content.test.ts` (legacy karşılaştırma testi kaldırılır)

**Interfaces:**
- Consumes: `getServicesByPillar`, `serviceOrderIndex`, `SERVICE_ORDER` (Task 3-8)
- Produces: `PILLARS` artık `services` alanı taşımaz; `pillars.ts` `serviceIndex`'i `services/index.ts`'e devreder

- [ ] **Step 1: Sıra testini kalıcı hâle getir**

Task 8 Step 4'teki legacy karşılaştırma testi artık kaldırılacak (kaynak siliniyor). Yerine `SERVICE_ORDER`'ı **donduran** bir test:

```ts
it("SERVICE_ORDER kanonik sırayı korur — diyagram indeksi buna bağlı", () => {
  expect(SERVICE_ORDER).toEqual([
    "marka-stratejisi", "performans-pazarlama", "cro", "e-ticaret", "ui-ux-tasarim",
    "ai-danismanlik", "dijital-donusum", "is-otomasyonlari", "is-zekasi", "isletme-muhendisligi",
    "ozel-yazilim-ve-mobil", "teknoloji-ve-altyapi",
  ]);
});
```

- [ ] **Step 2: Testi çalıştır — hâlâ geçmeli**

Run: `pnpm vitest run tests/unit/services-content.test.ts`
Expected: PASS

- [ ] **Step 3: `ServicesScroll.tsx`'i bağla**

`PILLARS.flatMap(...)` yerine `SERVICES` + `SERVICE_ORDER`. Kart linki **hizmete** gider:

```tsx
const services = React.useMemo(
  () =>
    SERVICE_ORDER.map((slug) => SERVICES.find((s) => s.slug.tr === slug)!).map((s) => {
      const pillar = PILLARS.find((p) => p.key === s.pillar)!;
      return {
        slug: s.slug[locale],
        pillarName: pillar.name[locale],
        name: s.name[locale],
        desc: {
          industrial: s.shortDescription.industrial[locale],
          commerce: s.shortDescription.commerce[locale],
        },
      };
    }),
  [locale],
);
```

Link satırı (`ServicesScroll.tsx:214`) — pillar yerine hizmet:

```tsx
<Link
  href={`/${locale}/${locale === "tr" ? "hizmetler" : "services"}/${s.slug}`}
  className="v2-svc-link mono"
  data-cursor="hover"
>
```

Bu, planın çözdüğü asıl problemin kapandığı satır: anasayfadaki 12 kart artık hizmete gidiyor.

- [ ] **Step 4: `hizmetler/page.tsx`'i bağla**

`p.services.map(...)` yerine `getServicesByPillar(p.key)`. Hizmet adları `<h3>` içinde kalır ama artık **link** olur; `serviceIndex(s.slug)` → `serviceOrderIndex(s.slug.tr)`.

- [ ] **Step 5: `pillar-detail.tsx`'i bağla**

Task 4 Step 6'da zaten `getServicesByPillar` kullanıyor; `import` yolunu doğrula, `pillar.services` kalıntısı kalmadığını kontrol et.

- [ ] **Step 6: `pillars.ts` ve `types.ts`'i temizle**

- `PillarContent`'ten `services` alanını sil
- `pillars.ts`'teki 12 satır içi hizmet nesnesini sil (~180 satır)
- `pillars.ts`'teki `SERVICE_ORDER` ve `serviceIndex`'i sil — tek kaynak `services/index.ts`

- [ ] **Step 7: Kalıntı arama**

Run: `grep -rn "\.services\b\|serviceIndex" src/ --include=*.ts --include=*.tsx`
Expected: yalnız `services/index.ts` ve yeni import'lar. `pillar.services` kalıntısı yok.

- [ ] **Step 8: Tam doğrulama**

Run: `pnpm typecheck && pnpm test && pnpm lint`
Expected: temiz. `typecheck` `PillarContent.services` kullanan kalan yeri yakalar.

- [ ] **Step 9: Tarayıcıda doğrula**

- `/tr` anasayfa — 12 kart, diyagramlar **doğru sırada**, her kart doğru hizmete gidiyor
- `/tr/hizmetler` — 3 pillar, 12 hizmet linkli
- `/tr/hizmetler/growth` — 5 hizmet linkli
- Aynısı `/en` tarafında

- [ ] **Step 10: Commit** *(Burak onayı gerekli)*

```bash
git add src/lib/content src/components src/app tests/unit/services-content.test.ts
git commit -m "refactor(content): hizmet listesini tek kaynağa bağla, kartları hizmet sayfasına yönlendir"
```

---

### Task 10: Sitemap, llms.txt ve eski URL yönlendirmeleri

**Files:**
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/llms.txt/route.ts`
- Modify: `next.config.ts`
- Test: `tests/unit/sitemap.test.ts`

**Interfaces:**
- Consumes: `SERVICES`, `SERVICE_ORDER` (Task 8), `SITE_URL` (Task 1), `PILLARS`
- Produces: sitemap 15 yeni route içerir (12 hizmet + 3 pillar)

- [ ] **Step 1: Failing test yaz**

`tests/unit/sitemap.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import sitemap from "@/app/sitemap";
import { SERVICES } from "@/lib/content/services";
import { PILLARS } from "@/lib/content/pillars";
import { SITE_URL } from "@/lib/seo/site";

const entries = sitemap();
const urls = entries.map((e) => e.url);

describe("sitemap", () => {
  it("12 hizmetin TR ve EN URL'ini içerir", () => {
    for (const s of SERVICES) {
      expect(urls).toContain(`${SITE_URL}/tr/hizmetler/${s.slug.tr}`);
      expect(urls).toContain(`${SITE_URL}/en/services/${s.slug.en}`);
    }
  });

  it("3 pillar'ın iki dildeki URL'ini içerir", () => {
    for (const p of PILLARS) {
      expect(urls).toContain(`${SITE_URL}/tr/hizmetler/${p.key}`);
      expect(urls).toContain(`${SITE_URL}/en/services/${p.key}`);
    }
  });

  it("her girdide hreflang alternatifleri vardır", () => {
    for (const e of entries) {
      expect(e.alternates?.languages?.tr, e.url).toBeTruthy();
      expect(e.alternates?.languages?.en, e.url).toBeTruthy();
      expect(e.alternates?.languages?.["x-default"], e.url).toBeTruthy();
    }
  });

  it("hizmet detayına 0.8, pillar'a 0.9 priority verir", () => {
    const svc = entries.find((e) => e.url.endsWith("/tr/hizmetler/cro"));
    const pil = entries.find((e) => e.url.endsWith("/tr/hizmetler/growth"));
    expect(svc?.priority).toBe(0.8);
    expect(pil?.priority).toBe(0.9);
  });

  it("URL'ler benzersizdir", () => {
    expect(new Set(urls).size).toBe(urls.length);
  });
});
```

- [ ] **Step 2: Testi çalıştır, başarısız olduğunu gör**

Run: `pnpm vitest run tests/unit/sitemap.test.ts`
Expected: FAIL — hizmet URL'leri yok

- [ ] **Step 3: `sitemap.ts`'i genişlet**

Mevcut `STATIC_ROUTES` döngüsünden sonra iki blok ekle: pillar'lar (priority 0.9, `changeFrequency: "weekly"`) ve hizmetler (priority 0.8, `"monthly"`). Her ikisi de `alternates.languages` üçlüsünü taşır. Girdi kurucusunu tek yardımcı fonksiyona çıkar — üç yerde tekrarlanmasın.

- [ ] **Step 4: Testi çalıştır, geçtiğini gör**

Run: `pnpm vitest run tests/unit/sitemap.test.ts`
Expected: PASS — 5 test

- [ ] **Step 5: `llms.txt`'e 24 hizmet URL'i ekle**

Mevcut dosya 12 hizmeti **isim olarak** sayıyor ama hiçbirine link vermiyor (spec §8.5) — AI motoru adı görüyor, sayfayı bulamıyor. Her pillar bölümündeki madde işaretlerini linke çevir:

```
### Growth — Agresif Büyüme
- Marka stratejisi: https://indoles.com.tr/tr/hizmetler/marka-stratejisi
- Performans pazarlama: https://indoles.com.tr/tr/hizmetler/performans-pazarlama
...
```

EN bölümünde `/en/services/<enSlug>`. URL'ler `SERVICES` verisinden **türetilir**, elle yazılmaz — slug değişirse llms.txt sessizce eskimemeli.

- [ ] **Step 6: llms.txt'i doğrula**

Run: `pnpm dev` arka planda, `curl -s localhost:3000/llms.txt | grep -c "hizmetler/\|services/"`
Expected: en az 24

- [ ] **Step 7: Eski site 301'lerini ekle**

`next.config.ts` içine `redirects()` (spec §3.4'teki 7 satır, `permanent: true` → 308):

```ts
async redirects() {
  return [
    { source: "/dijital-pazarlama-hizmetleri", destination: "/tr/hizmetler/performans-pazarlama", permanent: true },
    { source: "/cro-donusum-orani-optimizasyonu", destination: "/tr/hizmetler/cro", permanent: true },
    { source: "/donusum-optimizasyonu-yontemleri", destination: "/tr/hizmetler/cro", permanent: true },
    { source: "/e-ticaret-danismanligi", destination: "/tr/hizmetler/e-ticaret", permanent: true },
    { source: "/kreatif-hizmetler", destination: "/tr/hizmetler/ui-ux-tasarim", permanent: true },
    { source: "/mobil-uygulama-ve-yazilim-cozumleri", destination: "/tr/hizmetler/ozel-yazilim-ve-mobil", permanent: true },
    { source: "/our-services", destination: "/en/services", permanent: true },
  ];
}
```

- [ ] **Step 8: Yönlendirmeleri doğrula**

Run: `curl -sI localhost:3000/e-ticaret-danismanligi | head -3`
Expected: `308` ve `location: /tr/hizmetler/e-ticaret`

- [ ] **Step 9: Tam doğrulama**

Run: `pnpm typecheck && pnpm test && pnpm lint`

- [ ] **Step 10: Commit** *(Burak onayı gerekli)*

```bash
git add src/app/sitemap.ts src/app/llms.txt/route.ts next.config.ts tests/unit/sitemap.test.ts
git commit -m "feat(seo): sitemap, llms.txt ve eski URL yönlendirmeleri"
```

---

### Task 11: `/hizmetler` ve pillar sayfalarına metadata

Kümenin tepesi metadata'sız kalırsa 12 yaprak sayfa bağlamsız kalır (spec §7.2).

**Files:**
- Modify: `src/app/(marketing)/[locale]/hizmetler/page.tsx` (`generateMetadata` + JSON-LD)
- Modify: `src/components/marketing/pillar-detail.tsx` (JSON-LD)

**Interfaces:**
- Consumes: `buildMetadata`, `JsonLd`, `breadcrumbLd`, `webPageLd`, `organizationLd`, `serviceLd` (Task 1-2)

- [ ] **Step 1: `/hizmetler`'e `generateMetadata` ekle**

```tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  const t = await getTranslations({ locale, namespace: "pages.services" });

  return buildMetadata({
    title: loc === "tr" ? "Hizmetler" : "Services",
    description: t("industrial.lede").slice(0, 160),
    paths: { tr: "/tr/hizmetler", en: "/en/services" },
    locale: loc,
  });
}
```

`description` 160'ı aşarsa `messages/` içindeki metin kısaltılır — `slice` ile kelime ortasından kesilmemeli. Uzunluğu doğrula, gerekirse `pages.services.metaDescription` anahtarı ekle.

- [ ] **Step 2: `/hizmetler`'e JSON-LD ekle**

`organizationLd()` + `breadcrumbLd([{INDOLES}, {Hizmetler}])` + `webPageLd(...)`. `ItemList` ile 12 hizmeti listele — küme tepesinin yaprakları göstermesi GEO'da bağlamı kuruyor.

- [ ] **Step 3: Pillar sayfasına JSON-LD ekle**

`pillar-detail.tsx` içine: `organizationLd()` + `webPageLd` + `breadcrumbLd([{INDOLES}, {Hizmetler}, {Pillar}])` + `serviceLd` (pillar düzeyinde, `offers` = o pillar'ın paketleri). Pillar'da `FAQPage` **yok** — SSS verisi pillar'da bulunmuyor, boş şema koyulmaz.

- [ ] **Step 4: Üç sayfayı denetle**

Run: `pnpm seo:audit` yerine doğrudan kontrol (bu sayfalar hizmet değil, `entities` beklentisi yok):

```
curl -s localhost:3000/tr/hizmetler | grep -c "application/ld+json"
curl -s localhost:3000/tr/hizmetler/growth | grep -o '<title>[^<]*</title>'
```
Expected: JSON-LD var; title `Hizmetler — INDOLES` / `Growth — INDOLES`

- [ ] **Step 5: Tam doğrulama**

Run: `pnpm typecheck && pnpm test && pnpm lint`

- [ ] **Step 6: Commit** *(Burak onayı gerekli)*

```bash
git add "src/app/(marketing)/[locale]/hizmetler/page.tsx" src/components/marketing/pillar-detail.tsx
git commit -m "feat(seo): hizmet listesi ve pillar sayfalarına metadata ve JSON-LD"
```

---

### Task 12: Uçtan uca doğrulama, ADR ve kapanış raporu

**Files:**
- Create: `tests/e2e/hizmet-detay.spec.ts`
- Create: `docs/decisions/ADR-018-service-detail-pages.md`
- Modify: `docs/16-service-pages-seo-audit.md` (özet bölümü)
- Modify: `docs/02-information-architecture.md` (yeni sayfa tipi)
- Modify: `docs/08-seo-i18n-strategy.md` (`lib/seo` artık var — "planlanıyor" ifadeleri güncellenir)

**Interfaces:**
- Consumes: tüm önceki task'ların çıktısı

- [ ] **Step 1: e2e testi yaz**

`tests/e2e/hizmet-detay.spec.ts`:

```ts
import { test, expect } from "@playwright/test";
import { SERVICES } from "../../src/lib/content/services";

for (const service of SERVICES) {
  test(`TR hizmet sayfası açılır: ${service.slug.tr}`, async ({ page }) => {
    const res = await page.goto(`/tr/hizmetler/${service.slug.tr}`);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText(service.name.tr);
  });

  test(`EN hizmet sayfası açılır: ${service.slug.en}`, async ({ page }) => {
    const res = await page.goto(`/en/services/${service.slug.en}`);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText(service.name.en);
  });
}

test("bilinmeyen slug 404 döner", async ({ page }) => {
  const res = await page.goto("/tr/hizmetler/olmayan-hizmet");
  expect(res?.status()).toBe(404);
});

test("pillar sayfası bozulmadı", async ({ page }) => {
  const res = await page.goto("/tr/hizmetler/growth");
  expect(res?.status()).toBe(200);
  await expect(page.locator("h1")).toHaveText("Growth");
});

test("anasayfa hizmet kartı doğru hizmet sayfasına gider", async ({ page }) => {
  await page.goto("/tr");
  const first = page.locator(".v2-svc").first().getByRole("link");
  await expect(first).toHaveAttribute("href", "/tr/hizmetler/marka-stratejisi");
});
```

- [ ] **Step 2: e2e'yi çalıştır**

Run: `pnpm test:e2e tests/e2e/hizmet-detay.spec.ts`
Expected: 27 test PASS (12×2 + 3)

- [ ] **Step 3: 24 URL'in tamamını yeniden denetle**

Run: `for s in marka-stratejisi performans-pazarlama cro e-ticaret ui-ux-tasarim ai-danismanlik dijital-donusum is-otomasyonlari is-zekasi isletme-muhendisligi ozel-yazilim-ve-mobil teknoloji-ve-altyapi; do pnpm seo:audit "$s"; done`
Expected: 12 hizmetin TR+EN hâli PASS. Task 9'un refactor'u sonrası regresyon olup olmadığını burası yakalar.

- [ ] **Step 4: Production build**

Run: `pnpm build`
Expected: başarılı. `generateStaticParams` 30 sayfa üretmeli — çıktıda `/[locale]/hizmetler/[slug]` satırında sayfa sayısını doğrula.

- [ ] **Step 5: Görsel doğrulama**

390px ve 1440px'te üç sayfa: bir Growth, bir Transform, bir Build hizmeti. Kontrol: taşma yok, persona anahtarı çalışıyor, SSS açılıp kapanıyor, komşu hizmet linkleri doğru.

- [ ] **Step 6: ADR-018'i yaz**

`docs/decisions/ADR-018-service-detail-pages.md` — `ADR-template.md` biçiminde. Kayda geçecek kararlar:
- Düz URL + locale başına slug
- Persona'nın iki slota daraltılması ve gerekçesi (indekslenebilir metin, FAQPage geçerliliği)
- Hizmet metriği yerine olgusal taahhüt
- `PillarContent.services`'in kaldırılması, tek kaynağın `services/index.ts` olması
- `SITE_URL` tek kaynağı ve düzeltilen `metadataBase` hatası

- [ ] **Step 7: Kapanış raporunu yaz**

`docs/16-service-pages-seo-audit.md` özet bölümü: 12 sayfanın son audit durumu, kalan uyarılar, sonraki iş için not (paket/vaka/yazı sayfalarına aynı `lib/seo`'nun uygulanması, dinamik OG görseli).

- [ ] **Step 8: Doküman senkronu**

- `docs/02-information-architecture.md`: hizmet detay sayfa tipini ekle
- `docs/08-seo-i18n-strategy.md`: `lib/seo` artık var; "planlanacak" ifadelerini gerçekleşen hâle çevir. Kapsam dışı kalanları (dinamik OG, per-locale sitemap) açıkça işaretle

- [ ] **Step 9: Son tam doğrulama**

Run: `pnpm typecheck && pnpm lint && pnpm test && pnpm test:e2e && pnpm build`
Expected: beşi de temiz

- [ ] **Step 10: Commit** *(Burak onayı gerekli)*

```bash
git add tests/e2e/hizmet-detay.spec.ts docs/
git commit -m "test(hizmetler): e2e kapsama, ADR-018 ve audit kapanış raporu"
```

---

## Bilinen Kapsam Sınırları

Bu plan aşağıdakileri **bilinçli olarak yapmıyor** — sessiz eksik değil, kayıtlı karar:

- **Copy metinleri planda yazılı değil.** Task 3'te tam alan brief'i ve yazım kuralları var; metnin kendisi üretim sırasında yazılıyor. 12 hizmetin copy'sini plana gömmek, planı işin kendisiyle karıştırırdı. Kalite kapısı: içerik testleri (uzunluk, sayı, anafora) + audit script'i + Task 5 sonrası Burak gate'i.
- **Paket / vaka / yazı / danışman sayfaları metadata'sız kalıyor.** `lib/seo` genel yazıldı, uygulanması ayrı iş (spec §1.4).
- **Dinamik OG görseli yok.** Statik OG kullanılıyor; `/api/og` docs/08 §7.2'de planlı, ayrı iş.
- **Hizmet düzeyinde performans metriği yok.** Burak metrikleri sonra verecek (spec §14); geldiğinde `commitments` içeriği değişir, yapı değişmez.
- **`git commit` adımları onay bekliyor.** Global Constraints.
