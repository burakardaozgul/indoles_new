---
name: indoles-i18n-seo
description: >
  INDOLES'in çok dilli SEO ve AI SEO denetleyicisi. Yeni route, sayfa, generateMetadata,
  layout, sitemap, robots, llms.txt veya statik içerik katmanı (`src/lib/content/*.ts`,
  MDX) değişikliği yapıldığında ZORUNLU çağrılır. docs/08-seo-i18n-strategy.md ve docs/02-information-architecture.md'yi
  authoritative kabul eder. Keyword hedefi, küme önceliği ve GEO taktiği için docs/strateji/INDOLES-Organik-Strateji-SEO-GEO-v1.md
  authoritative. Kontrol kapsamı: path-based i18n (`/tr/*`, `/en/*`), URL segment
  translation (`/hizmetler` ↔ `/services`), self-canonical, hreflang triplet (tr + en +
  x-default), per-locale sitemap (`/tr/sitemap.xml`, `/en/sitemap.xml`) + index, dynamic
  per-page title/description (60/160 char), OG image dynamic generation, schema.org JSON-LD
  (Organization, Service, Article, BreadcrumbList, FAQPage), llms.txt + llms-full.txt
  (TR + EN), AI SEO patterns (citation-friendly content, semantic markup, Q&A H2/H3,
  conversational answer blocks), TR ↔ EN content parity, EN-without-TR launch yasağı,
  PostHog event tagging (locale + persona), preview-disallow, Core Web Vitals tie-in.
  Tetikleyici: "yeni sayfa ekle", "metadata yaz", "SEO kontrol", "hreflang", "sitemap",
  "llms.txt", "structured data", "JSON-LD", "i18n", "TR/EN parite", "AI SEO", "ChatGPT
  citation", "robots.txt", "OG image", "keyword hedefi", "SERP", "rakip analizi".
---

# INDOLES i18n + SEO + AI SEO Skill

Çok dilli arama görünürlüğü ve AI crawler'lara karşı pozisyon, INDOLES launch'ının tek seferlik öğrenme penceresidir. Bu skill her route, metadata ve içerik değişikliğini docs/08'in kuralından geçirir.

## Adım 0 — Otorite Kaynakları Yükle

Her tetiklenmede aç:

1. `docs/08-seo-i18n-strategy.md` — Tüm SEO/i18n kararları (authority)
2. `docs/02-information-architecture.md` — Sayfa map'i, URL segment çevirisi
3. `src/lib/content/*.ts` + `content/` (MDX) — İçerik katmanı ve iki dilli slug yapısı (Sanity YOK — ADR-006)
4. `src/lib/seo/` — Mevcut helper'lar (`generateAlternates.ts`, `jsonLd.ts`)
5. `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/llms.txt/route.ts` — Mevcut SEO endpoint'leri
6. `src/lib/i18n/` + `lib/i18n/locale-href.ts` — next-intl routing, segment çevirisi
7. `docs/strateji/INDOLES-Organik-Strateji-SEO-GEO-v1.md` — keyword hedefleri (§2), launch-gate (§3), GEO taktikleri (§5), 301 (Ek A); rakip eşikleri: `docs/strateji/Rakip-Analizi-P0-SERP.md`; hacim verisi: `docs/strateji/Keyword-Planner/keyword-hacim-birlesik.csv`

## Adım 1 — Path / URL Disiplini

| Kontrol | Geçer | Düşer |
|---------|-------|-------|
| Path-based i18n | `/tr/{slug}`, `/en/{slug}` | Subdomain (`tr.`), query param (`?lang=`) |
| Segment translation | `/tr/hizmetler` ↔ `/en/services`, `/tr/paketler` ↔ `/en/packages` | Aynı segment iki dilde (`/tr/services`) |
| Locale slug | TR ve EN slug ayrı (içerik objesinde `slug: { tr, en }`) | Aynı slug iki dilde |
| Default redirect | `/` → 301 → `/tr` | Default'a 200 cevap |
| İndekslenmeyecek yüzey | `/api/*` robots disallow. (Auth/admin/studio launch'ta YOK — ADR-008; eklenirse locale prefix'siz + disallow) | Locale içine alınmış api/auth path |

`next-intl` `pathnames` config'i bu eşleşmenin tek kaynağı olmalı.

## Adım 2 — Metadata (Per-Page)

Her sayfa için `generateMetadata` zorunlu çıktıları:

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const { locale, slug } = params;
  const data = await fetchPageData(slug, locale);

  return {
    title: `${data.title} — INDOLES`,                    // max 60 char
    description: data.description,                        // max 160 char
    alternates: {
      canonical: `https://indoles.com.tr/${locale}/...`,
      languages: {
        tr: 'https://indoles.com.tr/tr/...',
        en: 'https://indoles.com.tr/en/...',
        'x-default': 'https://indoles.com.tr/tr/...',     // her zaman TR
      },
    },
    openGraph: {
      title: data.title,
      description: data.description,
      url: `https://indoles.com.tr/${locale}/...`,
      siteName: 'INDOLES',
      locale: locale === 'tr' ? 'tr_TR' : 'en_US',
      images: [{ url: `/api/og?type=...&slug=${slug}&locale=${locale}` }],
      type: 'website',  // veya 'article'
    },
    twitter: {
      card: 'summary_large_image',
      site: '@indoles',
    },
    robots: { index: true, follow: true },
  };
}
```

### Metadata Lint

| Kontrol | Kural |
|---------|-------|
| `title` | ≤ 60 char, sonu " — INDOLES" |
| `description` | ≤ 160 char, ana vaat + 1 sosyal kanıt veya outcome |
| `canonical` | Self, mutlak URL, locale dahil |
| `languages` | tr + en + x-default ÜÇÜ DE — biri eksikse FAIL (ancak slug karşılığı yoksa kasıtlı eksik OK, bkz. docs/08 §3) |
| `x-default` | Her zaman TR'ye gider |
| OG image | `/api/og?...` dynamic — locale + slug + type parametreleri |
| `og:locale` | `tr_TR` veya `en_US` (underscore, dash değil) |
| `robots` | Production'da `index, follow`; preview'da `noindex` (env-aware) |
| Auth/admin/studio sayfa | `robots: { index: false, follow: false }` |

## Adım 3 — hreflang Doğruluk Matrisi

```html
<link rel="alternate" hreflang="tr" href="https://indoles.com.tr/tr/{slug-tr}" />
<link rel="alternate" hreflang="en" href="https://indoles.com.tr/en/{slug-en}" />
<link rel="alternate" hreflang="x-default" href="https://indoles.com.tr/tr/{slug-tr}" />
```

| Kural | Açıklama |
|-------|----------|
| Self-hreflang | Her locale kendini de listeler (Google gereği) |
| Karşılıklılık | TR sayfası EN'i, EN sayfası TR'yi gösterir; tek yön kabul edilmez |
| Eksik translation | Slug karşılığı yoksa o locale hreflang'e GİRMEZ — yarım hreflang yasak |
| Mutlak URL | Relative path yasak |
| Trailing slash | Tutarlı (sitenin standardına göre, mix yok) |
| Auth sayfa | Hreflang yok (zaten noindex) |

Helper: `src/lib/seo/generateAlternates.ts` — bu skill'in onayından geçen tek implementation.

## Adım 4 — Sitemap

```
/sitemap.xml          → sitemap index
├── /tr/sitemap.xml   → TR sayfaları
└── /en/sitemap.xml   → EN sayfaları
```

| Kontrol | Kural |
|---------|-------|
| Index dosyası | İki child sitemap'i listeler |
| Per-locale sitemap | Sadece o locale'in indexable sayfalarını içerir |
| `lastmod` | İçerik katmanındaki tarih alanı (varsa) veya build zamanı |
| `priority` / `changefreq` | docs/08 §4.3 tablosundan |
| `<xhtml:link rel="alternate">` | Her URL için karşı locale alternate (Google önerisi) |
| Exclude | `/api/*`, yayınlanmamış içerik |
| Preview | Sitemap üretilir ama robots disallow ile cover edilir |
| Güncelleme | SSG — içerik değişikliği build/deploy ile sitemap'e yansır (webhook/ISR yok) |

Implementation: `src/app/sitemap.ts` (Next.js convention, dinamik).

## Adım 5 — robots.txt

| Ortam | Kural |
|-------|-------|
| **Production** | `Allow: /`, ama `/api/` disallow + sitemap link |
| **Preview** | `User-agent: *` `Disallow: /` (TÜM disallow) |
| **AI crawler ban?** | YOK — INDOLES opting in. GPTBot, ClaudeBot, vb. ban'lanmaz |

`src/app/robots.ts` env-aware — `process.env.VERCEL_ENV === 'preview'` veya SST stage check.

## Adım 6 — llms.txt + llms-full.txt (AI SEO Core)

### `/llms.txt` (root + per-locale)

Curated içerik haritası, AI crawler'lara markalı bilgi sunma. Şablon: docs/08 §6.

Yayın:
- `https://indoles.com.tr/llms.txt` (TR'ye redirect veya TR ana içerik)
- `https://indoles.com.tr/tr/llms.txt`
- `https://indoles.com.tr/en/llms.txt`

Implementation: `src/app/llms.txt/route.ts` (root) + `src/app/[locale]/llms.txt/route.ts` (per-locale).

### `/llms-full.txt` (Genişletilmiş — AI Citation İçin)

Daha detaylı, full-content AI export. İçerik:

```markdown
# INDOLES — Full Knowledge Export

## About INDOLES
{şirket tanımı, misyon, vizyon — docs/01'den}

## Services (Full Detail)

### Growth Pillar
#### Marka Stratejisi ve Pazarlama Danışmanlığı
{tam hizmet açıklaması, kapsam, deliverable, target outcome}
- Source URL: https://indoles.com.tr/tr/growth/marka-stratejisi
- Industry application: ...

#### Performans Pazarlama
...

## Packages
{her paket: ad, kapsam, süre, fiyat aralığı, target outcome}

## Case Studies (Public)
{her vaka: müşteri tipi, problem, çözüm, sonuç metriği}

## FAQ (Conversational)
Q: Dijital dönüşüm nereden başlar?
A: {INDOLES yaklaşımı, kısa, kanıtlı}

Q: AI danışmanlığı için ideal şirket büyüklüğü nedir?
A: ...

## Contact
- Booking: https://indoles.com.tr/tr/rezervasyon
- Contact: https://indoles.com.tr/tr/iletisim
- Email: hello@indoles.com.tr
```

Üretim: statik içerik katmanı (`src/lib/content/*.ts` + MDX) + şablon, build-time.

### Lint

| Kontrol | Kural |
|---------|-------|
| llms.txt root erişilebilir | curl kontrolü |
| Per-locale variant'lar | TR + EN ikisi de |
| Markdown syntax valid | parser'dan geçer |
| Link'ler canlı | Hiçbiri 404 değil |
| TR + EN paritesi | İçerik eşdeğer (birebir çeviri değil, anlam paritesi) |

## Adım 7 — Structured Data (JSON-LD)

`src/lib/seo/jsonLd.ts` üzerinden tip-bazlı generator'lar. Her sayfa için:

| Sayfa Tipi | JSON-LD Şeması | Ek |
|-----------|----------------|-----|
| Root layout (her sayfa) | `Organization` | sameAs (LinkedIn, X), address, contactPoint |
| Pillar landing | `Service` | provider, areaServed, availableLanguage |
| Hizmet detay | `Service` + `BreadcrumbList` | offers (paket reference) |
| Paket detay | `Service` + `Offer` + `BreadcrumbList` | price, priceCurrency, validFrom |
| Vaka çalışması | `Article` + `BreadcrumbList` | author=Organization, about=Service |
| Blog yazısı | `Article` + `BreadcrumbList` | author=Person, datePublished, dateModified |
| Danışman profil | `Person` + `BreadcrumbList` | jobTitle, worksFor=Organization, knowsAbout |
| FAQ section (paket, pillar) | `FAQPage` | mainEntity[] |
| Homepage | `Organization` + `WebSite` (with `SearchAction`) | potentialAction |

### Lint

| Kontrol | Kural |
|---------|-------|
| Schema validator | https://validator.schema.org veya Google Rich Results Test geçer |
| Required field'lar dolu | Tip-bazlı zorunlu alanlar |
| `inLanguage` set | TR sayfa `tr-TR`, EN sayfa `en-US` |
| `url` mutlak | Relative yasak |
| Duplicate JSON-LD yok | Aynı tip iki kez basılmaz |
| Inline `<script type="application/ld+json">` | Next.js `<Script>` veya manuel script tag |

## Adım 8 — AI SEO (ChatGPT/Claude/Perplexity Citation Optimization)

Geleneksel SEO + AI search için ek pattern'ler.

### 8a. İçerik Yapısı — Citation-Friendly

| Pattern | Uygulama |
|---------|----------|
| **Cevap-önce paragraf** | İlk 2-3 cümle direkt cevap, sonra detay (LLM extract patterns) |
| **Q&A formatı H2/H3'lerde** | "Dijital dönüşüm nereden başlar?" (soru başlık) → cevap body |
| **Tanım blokları** | "X nedir?" → 1-2 cümlelik öz tanım, sonra örnek |
| **Sayısal claim'ler** | Spesifik metrik + kaynak ("müşterilerimizde ortalama %18") |
| **Karşılaştırma tabloları** | LLM'ler tablo extract'a çok iyi, comparison content kritik |
| **TL;DR section** | Uzun içerik başında 3-4 madde özet |
| **Citation-ready statement** | "INDOLES'in iş inşası yaklaşımı, X = Y olduğunda kullanılır." (tek cümle, attributable) |

### 8b. Semantic HTML

| Element | Kullanım |
|---------|----------|
| `<article>` | Blog yazısı, vaka çalışması wrapper |
| `<section>` | Mantıksal içerik bölümü |
| `<aside>` | Marginalia, ilgili içerik |
| `<figure>` + `<figcaption>` | Görseller, data viz |
| `<dl>`, `<dt>`, `<dd>` | Tanım listeleri (LLM tanım çıkarımı için ideal) |
| `<time datetime="...">` | Tarihler, gün/saat |
| `<address>` | İletişim bilgisi |
| `<cite>` | Alıntı kaynağı |

`<div>` salatası yasak — semantic HTML AI'nın anlamasını kolaylaştırır.

### 8c. Robots Meta — AI Specific

```html
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
```

Ek olarak gerekirse:
```html
<!-- Spesifik AI policy: tüm AI'lar için açık -->
<meta name="ChatGPT-User" content="index" />
<meta name="GPTBot" content="index" />
<meta name="Claude-Web" content="index" />
```

INDOLES kararı: opting in, opt-out yapılmaz (docs/08 §5).

### 8d. AI-Readable Page Summary

Her önemli sayfada başında veya altında JSON-LD `description` + ek `WebPage` schema:

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "...",
  "description": "...",
  "primaryImageOfPage": "...",
  "datePublished": "...",
  "dateModified": "...",
  "inLanguage": "tr-TR",
  "isPartOf": { "@type": "WebSite", "url": "https://indoles.com.tr" }
}
```

## Adım 9 — Performance (SEO ile Bağ)

| Metrik | Hedef | docs/05 §10 ref |
|--------|-------|-----------------|
| LCP | < 1.8s | Google ranking factor |
| INP | < 150ms | 2024 sonrası ranking factor |
| CLS | < 0.05 | Ranking factor |
| TTFB | < 600ms | RSC + edge ile |

SEO yan kontrolleri:
- Image: `width` + `height` attribute, `loading="lazy"` (hero hariç), `fetchpriority="high"` hero için
- Font: `font-display: swap`, preload variable font dosyası
- Third-party: PostHog, Cal embed → `strategy="lazyOnload"` veya delayed mount

## Adım 10 — Analytics + Search Console Bağı

| Servis | Action |
|--------|--------|
| Google Search Console | Domain property verify, sitemap submit (her iki locale) |
| Bing Webmaster | Verify + sitemap submit |
| Yandex Webmaster | Opsiyonel, TR pazarı için |
| PostHog | URL tag'inde `locale` + `persona` (cookie'den) — SEO landing page funnel analizi |
| GA4 | Yok — PostHog yeter (docs/12) |

## Adım 11 — TR ↔ EN Parity Lint

Her yeni sayfa/içerik için:

| Kontrol | Geçer |
|---------|-------|
| TR + EN ikisi de yayınlanmış | Evet — eksikse launch'a gönderilmez (docs/08 §12.1 kuralı) |
| hreflang çift yön | Karşılıklı tanım |
| Slug iki dilde de var | İçerik objesinde `slug.tr` ve `slug.en` |
| Title + description her dilde unique | Kopyala-yapıştır değil |
| OG image her dilde generate olur | `/api/og?locale=tr|en` |
| Schema.org `inLanguage` doğru | tr-TR / en-US |

## Adım 12 — Çıktı Raporu

```markdown
## SEO + i18n Audit — {ROUTE veya FEATURE}

### Path / URL
- [x] Path-based i18n
- [x] Segment translation doğru
- [x] Default redirect
- [ ] {FAIL: ...}

### Metadata
| Field | TR | EN | Status |
|-------|----|----|--------|
| title | "..." (52 char) | "..." (49 char) | OK |
| description | "..." | "..." | OK |
| canonical | ... | ... | OK |
| hreflang | tr+en+x-default | tr+en+x-default | OK |

### Sitemap / Robots / llms
- [x] Sitemap index update
- [x] Per-locale sitemap entry eklendi
- [x] llms.txt güncel
- [x] llms-full.txt güncel
- [x] Robots production allow / preview disallow

### Structured Data
- [x] Organization (root layout)
- [x] {Service / Article / ...}
- [x] BreadcrumbList
- [x] Schema validator geçti

### AI SEO
- [x] Cevap-önce paragraflar
- [x] Q&A H2/H3
- [x] Semantic HTML
- [x] AI robots meta

### Parity
- [x] TR + EN ikisi de hazır
- [x] hreflang karşılıklı

### Performance / SEO
- LCP: 1.4s (target < 1.8s) — OK
- CLS: 0.02 (target < 0.05) — OK

### Açık Sorular
- {bağımsız değerlendirme gerekli yer}
```

## Notlar

- Yeni bir route veya içerik türü eklendiğinde `src/app/sitemap.ts`'in onu kapsadığını doğrula (`pnpm seo:audit` varsa çalıştır)
- `/api/og` endpoint'i değiştiğinde tüm OG cache'leri invalidate (Open Graph re-scrape: Facebook Sharing Debugger, LinkedIn Post Inspector)
- llms-full.txt build size'i kontrol et — çok büyürse paginate veya sectional split

## Subagent Kullanımı

`indoles-seo-i18n-auditor` ajanı her route/metadata değişikliğinde bu skill'i çağırır ve raporu Burak'a iletir.
