# 10 — Sanity İçerik Modeli

> **Amaç:** INDOLES'in pazarlama ve danışman içeriklerinin Sanity'deki şema, singleton, i18n ve preview stratejisini sabitlemek.
>
> **Bağlı belgeler:** `02-information-architecture.md`, `03-brand-voice-tone.md`, `06-data-model.md`, `08-seo-i18n-strategy.md`.
> **Konum:** `sanity/` klasörü; Studio `src/app/studio/[[...tool]]/page.tsx` altında embedded.

---

## 1. Temel Kararlar

| Alan | Karar | Gerekçe |
|---|---|---|
| Sanity tipi | Hosted (Sanity Cloud) | Ops yükü yok, CDN native |
| Studio | Embedded (Next.js içinde `/studio`) | Tek deployment, tek auth |
| Auth | Sanity SSO + Clerk (app auth ile uyumlu) | Tek kapı |
| i18n | Document-level (slug + alanlar locale başına) | Slug farkları, locale'e özel ek alanlar |
| Preview | Sanity Presentation + Next.js draft mode | Canlı preview, cookie-based |
| Image | Sanity image pipeline + `next-sanity-image` | AVIF/WebP auto, LQIP |
| Portable Text | Custom serializer (React Email + RSC) | Editorial stil sadakat |
| Webhook | Doküman publish → Next.js revalidate | ISR consistency |

---

## 2. Şema Hiyerarşisi

### 2.1 Singleton dokümanlar (tekil)

| Schema | Amaç | Path etkisi |
|---|---|---|
| `siteSettings` | Site adı, logo, default OG, sosyal medya link'leri, iletişim bilgileri | Her sayfada footer + metadata |
| `navigation` | Header + footer nav linkleri, pillar order | `<Header>`, `<Footer>` |
| `homepageConfig` | Hero copy, persona eksen metinleri, öne çıkan case studies/packages | `/tr`, `/en` anasayfa |
| `legal` | KVKK, gizlilik, kullanım şartları | `/legal/*` |
| `llmsConfig` | llms.txt content | `/llms.txt` |

### 2.2 Doküman tipleri (liste)

| Schema | Açıklama | Path |
|---|---|---|
| `pillar` | Growth / Transform / Build pillar sayfaları (3 adet) | `/[locale]/hizmetler/[slug]` |
| `service` | 12 hizmet dokümanı | Pillar içinde section olarak render; ayrı sayfa v2 |
| `package` | Ürünleşmiş paketler | `/[locale]/paketler/[slug]` |
| `caseStudy` | Vaka çalışmaları | `/[locale]/vakalar/[slug]` |
| `article` | Blog yazıları | `/[locale]/yazilar/[slug]` |
| `consultantProfile` | Danışman profili (Sanity tarafında zengin metin, Neon tarafında state) | `/[locale]/danismanlar/[slug]` |
| `personaAxis` | Industrial / Commerce eksen metadata (ton, renk aksanı, CTA varyantları) | Hero + chatbot persona data |
| `page` | Generic static page (about, iletişim, faq) | `/[locale]/[slug]` |
| `faq` | Sık sorulan soru + cevap | Homepage + pillar + paket sayfalarında embed |
| `testimonial` | Müşteri yorumu | Case study veya paket sayfasında embed |

### 2.3 Object tipleri (embed edilen)

| Object | Amaç |
|---|---|
| `richText` | Portable Text — başlık, paragraf, liste, link, quote, figure |
| `cta` | Buton (label, href, variant, analytics event) |
| `metric` | Sayısal KPI kartı (value, label, source) — case study'de |
| `imageWithAlt` | Image + alt text + caption + focal point |
| `seoMeta` | Sayfa başına SEO override'ı (title, description, og image) |
| `localeString` | `{ tr: string, en: string }` — i18n için |
| `localeRichText` | `{ tr: richText, en: richText }` |
| `localeSlug` | `{ tr: slug, en: slug }` |

---

## 3. i18n Stratejisi

### 3.1 Model
**Document-level i18n** — her doküman iki locale için ayrı field'lar barındırır. Başka kütüphane (ör. `@sanity/document-internationalization`) kullanılabilir ama custom localeString/localeRichText yaklaşımı v1 için yeterli.

**Örnek `package` şeması:**
```typescript
defineType({
  name: "package",
  title: "Paket",
  type: "document",
  fields: [
    defineField({ name: "title", type: "localeString", validation: r => r.required() }),
    defineField({ name: "slug", type: "localeSlug", validation: r => r.required() }),
    defineField({ name: "pillar", type: "string", options: {
      list: [{ title: "Growth", value: "growth" }, { title: "Transform", value: "transform" }, { title: "Build", value: "build" }],
    }, validation: r => r.required() }),
    defineField({ name: "outcome", type: "localeString" }),
    defineField({ name: "description", type: "localeRichText" }),
    defineField({ name: "durationWeeks", type: "number" }),
    defineField({ name: "priceTRY", type: "number" }),
    defineField({ name: "priceEUR", type: "number" }),
    defineField({ name: "priceUSD", type: "number" }),
    defineField({ name: "heroImage", type: "imageWithAlt" }),
    defineField({ name: "includedItems", type: "array", of: [{ type: "localeString" }] }),
    defineField({ name: "faq", type: "array", of: [{ type: "reference", to: [{ type: "faq" }] }] }),
    defineField({ name: "relatedCaseStudies", type: "array", of: [{ type: "reference", to: [{ type: "caseStudy" }] }] }),
    defineField({ name: "seo", type: "seoMeta" }),
    defineField({ name: "active", type: "boolean", initialValue: true }),
  ],
});
```

### 3.2 Slug kuralları
- TR ve EN slug'lar farklı olabilir (`buyume-sprinti` ↔ `growth-sprint`).
- Sanity `localeSlug` object — her iki dil zorunlu (publish edilmeden önce validation).
- Slug generator: TR ↔ EN çeviri otomatik değil; editör elle yazar.

### 3.3 Locale fallback
- Eğer EN alan boşsa ama TR doluysa → TR gösterilmez, 404 (hreflang bütünlüğü için). Launch'ta 2 dil birlikte yayınlanır kuralı (`08-seo-i18n-strategy.md` §12.1).

---

## 4. Şema Detayları

### 4.1 `pillar`

| Alan | Tip | Not |
|---|---|---|
| `name` | `localeString` | Growth / Transform / Build |
| `slug` | `localeSlug` | URL |
| `tagline` | `localeString` | 1 cümle vaat |
| `heroDescription` | `localeRichText` | Hero altındaki açıklama |
| `services` | `array<reference(service)>` | Pillar'a bağlı hizmetler |
| `featuredCaseStudies` | `array<reference(caseStudy)>` | 3-6 case |
| `featuredPackages` | `array<reference(package)>` | 2-4 paket |
| `kpis` | `array<metric>` | Pillar'a özel sayılar (ör. "ortalama ROI") |
| `tonAxis` | `reference(personaAxis)` | Hangi ton ekseni baskın |
| `seo` | `seoMeta` | SEO override |

### 4.2 `service`

| Alan | Tip | Not |
|---|---|---|
| `name` | `localeString` | — |
| `slug` | `localeSlug` | — |
| `pillar` | `reference(pillar)` | Hangi pillar |
| `shortDescription` | `localeString` | 1-2 cümle |
| `longDescription` | `localeRichText` | Detay |
| `processSteps` | `array<{title: localeString, description: localeString}>` | 3-5 adım |
| `relatedPackages` | `array<reference(package)>` | — |
| `tags` | `array<string>` | Filtreleme için |

### 4.3 `caseStudy`

| Alan | Tip | Not |
|---|---|---|
| `clientName` | `string` | Şirket adı (anonimse "Sanayi Şirketi A") |
| `clientSector` | `string` | Sektör |
| `clientLogo` | `imageWithAlt` | Opsiyonel |
| `title` | `localeString` | — |
| `slug` | `localeSlug` | — |
| `problemType` | `string` | `efficiency_loss`, `cost_optimization`, `market_expansion`, `digital_transformation`, `customer_acquisition` — CLAUDE.md §5'deki filtre |
| `pillar` | `reference(pillar)` | — |
| `lead` | `localeRichText` | Özet — 2-3 paragraf |
| `challenge` | `localeRichText` | Problem detay |
| `approach` | `localeRichText` | Çözüm yaklaşımı |
| `outcome` | `localeRichText` | Sonuç |
| `metrics` | `array<metric>` | 3-5 KPI |
| `testimonial` | `reference(testimonial)` | Opsiyonel |
| `images` | `array<imageWithAlt>` | — |
| `duration` | `string` | "6 hafta", "3 ay" |
| `consultantsInvolved` | `array<reference(consultantProfile)>` | Kim çalıştı |
| `publishedAt` | `datetime` | — |
| `seo` | `seoMeta` | — |

### 4.4 `article`

| Alan | Tip | Not |
|---|---|---|
| `title` | `localeString` | — |
| `slug` | `localeSlug` | — |
| `excerpt` | `localeString` | 150-200 char özet |
| `body` | `localeRichText` | Portable Text |
| `coverImage` | `imageWithAlt` | — |
| `author` | `reference(consultantProfile)` | — |
| `category` | `string` | `growth`, `transform`, `build`, `industry` |
| `tags` | `array<string>` | — |
| `readingTimeMinutes` | `number` | Otomatik hesap (body'den) |
| `publishedAt` | `datetime` | — |
| `seo` | `seoMeta` | — |

### 4.5 `consultantProfile`

| Alan | Tip | Not |
|---|---|---|
| `name` | `string` | — |
| `slug` | `string` | Neon `consultants.slug` ile eşleşir |
| `title` | `localeString` | "AI Danışmanı", "Büyüme Direktörü" |
| `shortBio` | `localeString` | 1-2 cümle |
| `longBio` | `localeRichText` | Detay |
| `headshot` | `imageWithAlt` | — |
| `expertise` | `array<string>` | Tag'ler |
| `pillars` | `array<string>` | Growth / Transform / Build — birden fazla |
| `linkedinUrl` | `url` | — |
| `featuredCaseStudies` | `array<reference(caseStudy)>` | Kendi case'leri |
| `featuredArticles` | `array<reference(article)>` | Kendi yazıları |
| `active` | `boolean` | Vitrinde görünsün mü |

### 4.6 `personaAxis`

| Alan | Tip | Not |
|---|---|---|
| `key` | `string` | `industrial` veya `commerce` |
| `displayName` | `localeString` | "Sanayi için Teknoloji Dönüşümü", "Ticaret için Agresif Büyüme" |
| `heroHeadline` | `localeString` | — |
| `heroSubhead` | `localeString` | — |
| `ctaLabel` | `localeString` | — |
| `ctaHref` | `string` | — |
| `toneKeywords` | `array<string>` | AI agent'a inject edilecek ton kelimeleri |
| `accentColor` | `string` | Tasarım overlay rengi (opsiyonel, v2) |

### 4.7 `faq`

| Alan | Tip | Not |
|---|---|---|
| `question` | `localeString` | — |
| `answer` | `localeRichText` | — |
| `category` | `string` | `general`, `package`, `pillar`, `process` |
| `relatedTo` | `reference` | Opsiyonel bağ |

### 4.8 `testimonial`

| Alan | Tip | Not |
|---|---|---|
| `authorName` | `string` | — |
| `authorTitle` | `localeString` | "CEO, Acme Industries" |
| `authorPhoto` | `imageWithAlt` | Opsiyonel |
| `quote` | `localeRichText` | — |
| `associatedCaseStudy` | `reference(caseStudy)` | Opsiyonel |

### 4.9 `page` (generic)

| Alan | Tip | Not |
|---|---|---|
| `title` | `localeString` | — |
| `slug` | `localeSlug` | — |
| `body` | `localeRichText` | — |
| `sections` | `array` | Modular blocks (hero, CTA, columns) |
| `seo` | `seoMeta` | — |

---

## 5. Object Tipleri

### 5.1 `richText` (Portable Text)

Block'lar:
- `paragraph`
- `heading` (h2, h3, h4 — h1 sayfa başlığı için rezerve)
- `blockquote`
- `list` (bullet, ordered)
- `codeBlock` (teknik yazılarda)

Inline marks:
- `bold`, `italic`, `underline`, `strikethrough`
- `link` (url, internal ref, target)
- `footnote`

Custom block'lar:
- `figure` — image + caption + focal point
- `calloutBox` — bilgi/uyarı kutusu (type: info/warning/success)
- `quote` — büyük editorial quote
- `metricRow` — 2-4 KPI kartı inline
- `embed` — Youtube/Vimeo/Figma (whitelisted)
- `ctaBlock` — inline CTA

### 5.2 `imageWithAlt`

```typescript
{
  asset: reference,
  alt: localeString,     // zorunlu — a11y
  caption: localeString, // opsiyonel
  focalPoint: { x: number, y: number },  // Sanity hotspot
  credit: string,        // fotoğrafçı/kaynak
}
```

### 5.3 `cta`

```typescript
{
  label: localeString,
  href: string,                  // internal: /tr/paketler/xxx veya ref
  variant: "primary" | "secondary" | "ghost" | "link",
  analyticsEvent: string,         // PostHog event adı
  icon: string,                   // optional Lucide icon name
}
```

### 5.4 `metric`

```typescript
{
  value: string,                  // "3x", "%42", "€120K"
  label: localeString,            // "dönüşüm artışı"
  source: localeString,           // "6 aylık ölçüm, internal"
}
```

### 5.5 `seoMeta`

```typescript
{
  title: localeString,            // override
  description: localeString,      // override
  ogImage: imageWithAlt,          // override, yoksa dinamik OG
  noIndex: boolean,
}
```

---

## 6. Editorial Rehberi (Studio içinden)

Sanity Studio'da her doküman tipinin yanında **Editor Notes** (Sanity `description`) olacak. Örn:

**`caseStudy.problemType`:**
> "Bu case hangi problem tipine çözüm üretti? Sektör değil — problem-tipi. Filtreleme bu alana göre. `03-brand-voice-tone.md`'deki kural geçerli: sanayici persona için 'verim kaybı' / 'dönüşüm', ticaret persona için 'pazar payı' / 'müşteri edinimi'."

**`article.category`:**
> "Yazı hangi pillar'a ait? Cross-pillar yazılar için 'industry' kategori."

Pattern: Her doküman şemasında bir `description` verilir; Studio'da ne yapılacağı net.

---

## 7. Preview ve Draft Mode

### 7.1 Sanity Presentation
`sanity.config.ts` içinde Presentation tool aktif:
```typescript
import { presentationTool } from "sanity/presentation";

export default defineConfig({
  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: {
        origin: process.env.NEXT_PUBLIC_SANITY_PREVIEW_URL,
        draftMode: { enable: "/api/draft-mode/enable" },
      },
    }),
  ],
});
```

### 7.2 Draft mode endpoint
`/api/draft-mode/enable` — cookie'ye draft flag set eder; bir sonraki fetch'te Sanity CDN yerine canlı API çekilir.

### 7.3 Live preview
Editör Studio'da doküman açar → "Open Presentation" → paralel pencerede site açılır → edit'ler real-time reflect eder.

---

## 8. Webhook → Revalidate

### 8.1 Sanity webhook konfigürasyonu
Sanity dashboard'da webhook oluşturulur:
- URL: `https://indoles.com.tr/api/webhooks/sanity`
- Trigger: `Create, Update, Delete`
- Filter: `_type in ["pillar", "service", "package", "caseStudy", "article", "consultantProfile", "homepageConfig", "siteSettings"]`
- Secret: `SANITY_WEBHOOK_SECRET` (SST Secret).

### 8.2 Handler logic

`/api/webhooks/sanity/route.ts`:

```typescript
import { NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";

export async function POST(req: NextRequest) {
  const signature = req.headers.get(SIGNATURE_HEADER_NAME);
  const body = await req.text();

  if (!isValidSignature(body, signature!, process.env.SANITY_WEBHOOK_SECRET!)) {
    return new Response("Invalid signature", { status: 401 });
  }

  const { _type, slug, _id } = JSON.parse(body);
  const pathsToRevalidate = mapDocTypeToPaths(_type, slug);

  for (const path of pathsToRevalidate) {
    revalidatePath(path);
  }
  revalidateTag(`sanity:${_type}`);

  return Response.json({ revalidated: true, paths: pathsToRevalidate });
}

function mapDocTypeToPaths(type: string, slug: { tr: string; en: string }): string[] {
  const map: Record<string, (s: typeof slug) => string[]> = {
    pillar: (s) => [`/tr/hizmetler/${s.tr}`, `/en/services/${s.en}`, "/tr", "/en"],
    package: (s) => [`/tr/paketler/${s.tr}`, `/en/packages/${s.en}`, "/tr/paketler", "/en/packages"],
    caseStudy: (s) => [`/tr/vakalar/${s.tr}`, `/en/case-studies/${s.en}`, "/tr/vakalar", "/en/case-studies"],
    article: (s) => [`/tr/yazilar/${s.tr}`, `/en/articles/${s.en}`, "/tr/yazilar", "/en/articles"],
    consultantProfile: (s) => [`/tr/danismanlar/${s.tr}`, `/en/consultants/${s.en}`, "/tr/danismanlar", "/en/consultants"],
    homepageConfig: () => ["/tr", "/en"],
    siteSettings: () => ["/", "/tr", "/en"],
  };
  return map[type]?.(slug) ?? [];
}
```

### 8.3 Tag stratejisi
Fetch'lerde `next: { tags: [`sanity:${type}`] }` verilir; webhook `revalidateTag` ile toplu invalidate eder.

---

## 9. Studio Customizations

### 9.1 Structure (custom menu)
`sanity/structure.ts` — Studio sol panelde:
```
- Site Ayarları (singleton)
- Anasayfa (singleton)
- Navigation (singleton)
- Pillar'lar
- Hizmetler
- Paketler
- Vaka Çalışmaları
- Yazılar
- Danışmanlar
- FAQ
- Testimonial'lar
- Sayfalar (generic)
- Persona Axis
```

### 9.2 Input component'leri
- Portable Text için custom toolbar (editorial style: block types, mark'lar).
- Image input'ta alt text preview.
- Slug input'ta locale başına generator.

### 9.3 Desk actions
- "Duplicate for locale" — TR'den EN'a kopyala (empty field'lar).
- "Publish both locales" — tek tıkla iki locale.

---

## 10. GROQ Query Pattern'leri

### 10.1 Pillar detail
```groq
*[_type == "pillar" && slug.current.{$locale} == $slug][0] {
  "name": name.{$locale},
  "tagline": tagline.{$locale},
  "heroDescription": heroDescription.{$locale},
  services[]-> {
    "name": name.{$locale},
    "slug": slug.current.{$locale},
    "shortDescription": shortDescription.{$locale}
  },
  featuredCaseStudies[]-> { ... },
  featuredPackages[]-> { ... },
  seo { ... }
}
```

### 10.2 Case study list by problem type
```groq
*[_type == "caseStudy" && problemType == $problemType] | order(publishedAt desc) [0...$limit] {
  "title": title.{$locale},
  "slug": slug.current.{$locale},
  clientName,
  "lead": lead.{$locale},
  metrics[0...3]
}
```

### 10.3 Homepage config
```groq
*[_type == "homepageConfig"][0] {
  "heroPersonaAxes": heroPersonaAxes[]-> {
    key,
    "displayName": displayName.{$locale},
    "heroHeadline": heroHeadline.{$locale}
  },
  featuredCaseStudies[]-> {...}
}
```

Query'ler `src/lib/sanity/queries.ts`'de versiyonlu string olarak tutulur; type generation `sanity typegen` ile yapılır.

---

## 11. Versioning ve Content Lifecycle

- **Draft → Publish:** Sanity default workflow.
- **Scheduled publishing:** Sanity Schedule Publishing feature (enterprise tier, v2).
- **Content history:** Sanity doküman history (30 gün default, upgrade ile 365).
- **Backup:** `sanity export` haftalık S3 (Inngest cron).

---

## 12. Açık Sorular

| # | Soru | Önerilen v1 cevabı | Ne zaman |
|---|---|---|---|
| 1 | `service` ayrı sayfa mı yoksa pillar içinde section mi? | Pillar içinde section (v1); ayrı sayfa v2 | SEO impact'e göre |
| 2 | Document-level vs field-level i18n | Document-level (field level `localeString`) | Şu an için yeterli |
| 3 | Sanity Studio EN çeviri otomatik (AI ile)? | Hayır, elle yazılır | v2'de translation memory |
| 4 | Case study'ye video embed desteği | Evet, Portable Text `embed` block ile (YouTube/Vimeo) | — |
| 5 | Sanity asset CDN'den gelen image'ler için Next Image optimize mi, Sanity'nin kendi transform'u mu? | `next-sanity-image` — Sanity transform + Next optimize | — |
| 6 | Preview URL protection (public deployment'a preview link gizli olsun mu)? | Sanity secret query param + cookie | Production preview için |
