# 08 — SEO ve i18n Stratejisi

> **Amaç:** INDOLES web platformunun arama görünürlüğünü, çok dilli yapısını ve AI crawler'lara karşı tutumunu tek referansta sabitlemek.
>
> **Bağlı belgeler:** `02-information-architecture.md`, `05-tech-architecture.md`, `10-content-model-sanity.md`.

---

## 1. Temel Kararlar

| Alan | Karar | Gerekçe |
|---|---|---|
| i18n mimarisi | Path-based: `/tr/*`, `/en/*` | Açık, cachelenebilir, SEO-dostu; subdomain/param-based'e tercih |
| Kütüphane | `next-intl` | App Router uyumlu, RSC-first, middleware native |
| Default locale | `tr` | Türkiye merkezli, birincil pazar |
| Locale detection | Path → cookie → Accept-Language header → default `tr` | Middleware'de 3 basamaklı |
| Canonical URL | Her sayfada self-canonical | Duplicate content riski engelleme |
| hreflang | Her lokalize sayfada TR + EN çiftleri + `x-default` | Google önerisi |
| Sitemap | Dynamic generation (`/sitemap.xml`) + per-locale `/tr/sitemap.xml`, `/en/sitemap.xml` | Sanity + app router sayfaları birleştirir |
| Robots | `/robots.txt` — production'da allow; preview'da disallow | Preview'larda index edilmesin |
| llms.txt | Yayınlanacak, curated | AI crawler'lara net içerik haritası |
| Structured data | JSON-LD: Organization, Service, Article, CaseStudy, BreadcrumbList, FAQPage | Rich results için |
| Open Graph | Her sayfada custom OG image (dinamik generation) | Sosyal paylaşımda markalı görünüm |

---

## 2. Path Yapısı

```
/                                 → 301 → /tr
/tr                               → TR homepage (persona-aware)
/en                               → EN homepage (persona-aware)
/tr/hizmetler                     → Pillar overview (TR)
/en/services                      → Pillar overview (EN)
/tr/hizmetler/growth              → Growth pillar (TR)
/en/services/growth               → Growth pillar (EN)
/tr/paketler                      → Package catalog (TR)
/en/packages                      → Package catalog (EN)
/tr/paketler/[slug]               → Package detail (TR)
/en/packages/[slug]               → Package detail (EN)
/tr/vakalar                       → Case studies (TR)
/en/case-studies                  → Case studies (EN)
/tr/vakalar/[slug]                → Case study detail (TR)
/en/case-studies/[slug]           → Case study detail (EN)
/tr/yazilar                       → Blog (TR)
/en/articles                      → Blog (EN)
/tr/yazilar/[slug]                → Article (TR)
/en/articles/[slug]               → Article (EN)
/tr/danismanlar                   → Consultant directory (TR)
/en/consultants                   → Consultant directory (EN)
/tr/danismanlar/[slug]            → Consultant profile (TR)
/en/consultants/[slug]            → Consultant profile (EN)
/tr/iletisim                      → Contact (TR)
/en/contact                       → Contact (EN)
/tr/hakkimizda                    → About (TR)
/en/about                         → About (EN)
```

**Segment translation:** URL segment'leri de çevrilir (`/hizmetler` ↔ `/services`, `/paketler` ↔ `/packages`). `next-intl`'in `pathnames` config'i ile yapılır.

**Slug davranışı:** Content slug'ları (case study, paket, yazı) locale başına farklı olabilir (`/tr/paketler/buyume-sprinti` ↔ `/en/packages/growth-sprint`). Sanity `slug.current.tr` / `slug.current.en` ile yönetilir.

---

## 3. hreflang Stratejisi

Her lokalize sayfa `<head>`'ine:

```html
<link rel="alternate" hreflang="tr" href="https://indoles.com.tr/tr/hizmetler/growth" />
<link rel="alternate" hreflang="en" href="https://indoles.com.tr/en/services/growth" />
<link rel="alternate" hreflang="x-default" href="https://indoles.com.tr/tr/hizmetler/growth" />
```

**Kurallar:**
- `x-default` her zaman TR versiyonuna gider (birincil pazar).
- Her locale kendini de listeler (self-hreflang, Google gereği).
- Slug karşılığı olmayan sayfalarda hreflang çift yönlü olmaz — eksik locale hreflang'e girmez.
- Admin, dashboard, studio gibi auth-gated sayfalarda hreflang yok (index'lenmez).

Implementasyon: `src/lib/seo/generateAlternates.ts` helper'ı; her RSC sayfasında `generateMetadata`'da çağrılır.

---

## 4. Sitemap

### 4.1 Yapı

```
/sitemap.xml                      → sitemap index
├── /tr/sitemap.xml               → TR sayfaları
└── /en/sitemap.xml               → EN sayfaları
```

### 4.2 Üretim

Next.js `sitemap.ts` file convention ile dynamic:

```typescript
// src/app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await collectStaticRoutes();        // static app routes
  const sanityDocs = await fetchIndexableDocs();    // case studies, articles, packages
  return [...pages, ...sanityDocs].map(entry => ({
    url: entry.url,
    lastModified: entry.lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
    alternates: entry.alternates, // hreflang
  }));
}
```

### 4.3 Priority rehberi

| Sayfa | Priority | Change frequency |
|---|---|---|
| Homepage | 1.0 | weekly |
| Pillar landing (`/hizmetler/growth`) | 0.9 | weekly |
| Paket detay | 0.8 | monthly |
| Case study | 0.8 | monthly |
| Danışman profili | 0.7 | monthly |
| Blog/yazı | 0.7 | weekly |
| Hakkımızda, iletişim | 0.5 | yearly |
| Auth-gated, studio, /api | — | exclude |

### 4.4 Preview davranışı
Preview deployment'larda sitemap üretilir ama `robots.txt` `Disallow: /` olduğundan crawl edilmez; yanlışlıkla index'lenirse bile `noindex` meta tag'i vardır.

---

## 5. robots.txt

**Production (`indoles.com.tr`):**
```
User-agent: *
Allow: /

# AI crawler'lar için açık (llms.txt'ye yönlendir)
Sitemap: https://indoles.com.tr/sitemap.xml

# Disallow
Disallow: /app/
Disallow: /admin/
Disallow: /studio/
Disallow: /api/
Disallow: /*?draft=true
```

**Preview (`{stage}.indoles.com.tr`):**
```
User-agent: *
Disallow: /
```

**Stratejik not:** Hiçbir user-agent özel olarak ban'lanmaz (ör. GPTBot). INDOLES AI crawler'lara karşı **opak değil, şeffaf** pozisyon alır — bilgi öne çıkarmak istiyoruz (llms.txt ile curated).

---

## 6. llms.txt

Site kökünde `/llms.txt` — AI crawler'lara sitenin özetini ve anlamlı içerik noktalarını gösterir. Next.js'te `src/app/llms.txt/route.ts` ile dinamik üretilir; production'a özel.

**İçerik şablonu:**

```markdown
# INDOLES

> Türkiye merkezli iş geliştirme danışmanlık şirketi. Sanayi şirketlerine teknoloji dönüşümü, ticaret ve perakende markalarına agresif büyüme danışmanlığı sunar.

## Kimiz
- İsim: İndoles Yazılım A.Ş.
- Konum: İstanbul, Türkiye
- Dil: TR / EN

## Ana Hizmet Pillar'ları

### Growth — Agresif Büyüme
- Marka stratejisi ve pazarlama danışmanlığı
- Performans pazarlama
- CRO (dönüşüm oranı optimizasyonu)
- E-ticaret
- UI/UX tasarım

### Transform — Dijital ve İşletme Dönüşümü
- AI danışmanlığı
- Dijital dönüşüm
- İş otomasyonları
- İş zekası
- İşletme mühendisliği

### Build — Teknoloji ve Ürün
- Özel yazılım ve mobil uygulama geliştirme
- Teknoloji ve altyapı danışmanlığı

## İletişim
- Rezervasyon: https://indoles.com.tr/tr/iletisim
- Brief: https://indoles.com.tr/app/brief/yeni

## Kaynaklar
- Vaka çalışmaları: https://indoles.com.tr/tr/vakalar
- Paketler: https://indoles.com.tr/tr/paketler
- Blog / yazılar: https://indoles.com.tr/tr/yazilar
- Site haritası: https://indoles.com.tr/sitemap.xml
```

Hem TR hem EN sürüm (`/tr/llms.txt`, `/en/llms.txt`) yayınlanır; root `/llms.txt` TR'yi ana olarak gösterir.

---

## 7. Meta Tag Stratejisi

### 7.1 Zorunlu meta'lar (her sayfa)

```html
<title>{Sayfa başlığı} — INDOLES</title>
<meta name="description" content="{150-160 char}" />
<link rel="canonical" href="{self}" />
<meta name="robots" content="index, follow" />
<link rel="alternate" hreflang="tr" href="..." />
<link rel="alternate" hreflang="en" href="..." />
<link rel="alternate" hreflang="x-default" href="..." />

<!-- Open Graph -->
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="https://indoles.com.tr/api/og?slug=..." />
<meta property="og:type" content="website | article" />
<meta property="og:locale" content="tr_TR | en_US" />
<meta property="og:site_name" content="INDOLES" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@indoles" />
```

### 7.2 OG image dinamik generation

`src/app/api/og/route.ts` — `@vercel/og` (veya eşdeğeri) ile on-the-fly SVG→PNG. Parametreler: `?type=caseStudy&slug=...&locale=tr`. Tasarım: editorial-minimal, INDOLES monogram, başlık + "INDOLES".

### 7.3 Per-page title + description pattern

| Sayfa | Title pattern | Description kuralı |
|---|---|---|
| Homepage TR | "INDOLES — Sanayi için teknoloji dönüşümü, ticaret için agresif büyüme." | Ana vaat + 1 sosyal kanıt |
| Homepage EN | "INDOLES — Technology transformation for industry, aggressive growth for commerce." | Ana vaat + 1 sosyal kanıt |
| Pillar | "{Pillar adı} — INDOLES" | Pillar vaadi + hizmet listesi |
| Paket detay | "{Paket adı} — {pillar} paketi — INDOLES" | Paket outcome + süre |
| Case study | "{Müşteri} — {outcome özeti} — INDOLES" | Problem + sonuç metriği |
| Yazı | "{Yazı başlığı} — INDOLES" | Yazı lede'si (ilk 160 char) |
| Danışman | "{İsim}, {uzmanlık} — INDOLES" | Biyografi ilk cümlesi |

**Title max:** 60 char (Google SERP kesim).
**Description max:** 160 char.

---

## 8. Structured Data (JSON-LD)

Her sayfa tipine uygun schema.org JSON-LD.

### 8.1 Organization (her sayfada root layout'ta)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "INDOLES",
  "legalName": "İndoles Yazılım A.Ş.",
  "url": "https://indoles.com.tr",
  "logo": "https://indoles.com.tr/logo.svg",
  "sameAs": [
    "https://www.linkedin.com/company/indoles",
    "https://twitter.com/indoles"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "TR"
  }
}
```

### 8.2 Service (pillar ve hizmet sayfalarında)

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Dijital Dönüşüm Danışmanlığı",
  "provider": { "@type": "Organization", "name": "INDOLES" },
  "areaServed": "TR",
  "availableLanguage": ["tr", "en"]
}
```

### 8.3 Article (blog yazılarında)

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "...",
  "datePublished": "...",
  "dateModified": "...",
  "author": { "@type": "Person", "name": "..." },
  "publisher": { "@type": "Organization", "name": "INDOLES" },
  "image": "..."
}
```

### 8.4 CaseStudy → Article + custom fields

Google'da "CaseStudy" için standart schema yok; `Article` + `about` alanı ile Service referansı.

### 8.5 BreadcrumbList

Her iç sayfada sayfa hiyerarşisini gösterir.

### 8.6 FAQPage

Paket ve pillar sayfalarında FAQ varsa.

Helper: `src/lib/seo/jsonLd.ts` — tip bazlı generator'lar.

---

## 9. Performance + Core Web Vitals ile SEO

`05-tech-architecture.md` §10'daki hedefler SEO için de kritik:

- **LCP < 1.8s** — Google ranking faktörü.
- **INP < 150ms** — 2024 sonrası ranking faktörü.
- **CLS < 0.05** — ranking faktörü.

Ek SEO-odaklı teknikler:
- Image'lara `width + height` attribute → CLS sıfır.
- Hero image `fetchpriority="high"` + `preload`.
- Font `font-display: swap`.
- 3rd party script'ler `strategy="lazyOnload"` (PostHog, Cal embed, vb.).

---

## 10. Internal Linking Stratejisi

| Link tipi | Nereden → Nereye | Amaç |
|---|---|---|
| Homepage → Pillar | Hero CTA | Ana yönlendirme |
| Pillar → Paket | Pillar sayfasında paket grid | Aynı pillar'dan satışa |
| Pillar → Case study | "İlgili vakalar" section | Kanıt |
| Case study → Paket | "Benzer sorunu çözdüğümüz paket" | Conversion |
| Yazı → Pillar/Paket | Yazı body içinde contextual | SEO + conversion |
| Danışman → Pillar | Profil'de uzmanlık area'sı | Keşif |

Kural: her indexable sayfadan 3-5 diğer indexable sayfaya link ver; orphan sayfa yok.

---

## 11. Analytics ve Search Console

- **Google Search Console:** Her iki domain variant'ı verify edilir (root + www); property olarak domain property tercih.
- **Bing Webmaster Tools:** Verify + sitemap submit.
- **Yandex Webmaster:** TR pazarı için verify (opsiyonel, rank etki minimum).
- **PostHog URL tracking:** Her sayfa view'i locale + persona ile tag'lanır; SEO landing page analizi PostHog'ta yapılır.
- **GA4:** Kullanılmayacak — PostHog yeter (Bölüm 12).

---

## 12. Çoklu Dil Workflow

### 12.1 İçerik eklenirken
1. Sanity Studio'da TR versiyonu yayınlanır.
2. EN çeviri aynı doküman üzerinde locale field'larında (document-level i18n, `10-content-model-sanity.md` §3) doldurulur.
3. Her iki locale de yayına alınır.
4. Webhook tetiklenir → ISR revalidate.

**Kural:** EN yayına alınmadan TR canlı olmaz (hreflang bütünlüğü için). Launch'ta 2 dil hazır; sonraki içerikler de 2 dil birlikte.

### 12.2 URL geçişi
Kullanıcı dil switch'ini kullandığında: `next-intl` aynı content'in karşı locale'deki slug'ına navigate eder. Slug yoksa → locale homepage'ine düşürür.

### 12.3 Locale-specific content farkı
Bazı içerikler sadece bir locale'de olabilir (ör. TR'ye özel yazı). O zaman:
- Sitemap sadece o locale altında listeler.
- hreflang sadece kendine self-ref'lar, karşı dil alternate yok.
- `x-default` o dile gider.

---

## 13. AI Search ve ChatGPT Citations

INDOLES AI search'e karşı pozisyonlanır (shutting out yerine opting in + curated):
- `llms.txt` ile net içerik haritası.
- Sayfa içeriklerinde net headline + özet first paragraph → LLM'lerin extract ederken markalı bilgi çekmesi kolay.
- Schema.org JSON-LD zengin → yapısal anlama kolay.
- Blog yazılarında H2/H3'ler Q&A-style yazılır (ör. "Dijital dönüşüm nereden başlar?") → conversational search uyumlu.

---

## 14. Açık Sorular

| # | Soru | Önerilen v1 cevabı | Ne zaman |
|---|---|---|---|
| 1 | AMP ihtiyacı var mı? | Hayır (modern Core Web Vitals yeter) | — |
| 2 | GA4 yanına koyulsun mu? | Hayır, PostHog yeterli | Müşteri/yatırımcı talebi gelirse revisit |
| 3 | Schema.org custom extension (Case Study için) | Hayır, standart Article ile başla | Schema evolve ederse |
| 4 | Multi-tenant hreflang (ileride DE, FR) | v3 kapsamında | Expansion kararı |
| 5 | Bing, Yandex, Baidu için özel optimization | Sadece Search Console submit + sitemap | TR pazarında performance metriklerine bak |
