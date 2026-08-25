import { SITE_URL } from "@/lib/seo/site";
import { SERVICES } from "@/lib/content/services";
import { CASES } from "@/lib/content/cases";
import { ARTICLES } from "@/lib/content/articles";
import type { Pillar } from "@/lib/content/types";

export const dynamic = "force-static";

/**
 * Bir pillar'ın hizmetlerini llmstxt.org biçiminde
 * "- [Ad](URL): açıklama" satırları olarak yazar.
 *
 * Önceki hâl hizmetleri yalnız ADIYLA sayıyordu, hiçbirine link vermiyordu:
 * ajan hizmetin varlığını görüyor ama sayfasını bulamıyordu
 * (spec §8.5). URL'ler `SERVICES`ten türetilir — slug değişirse llms.txt
 * sessizce eskimez.
 */
function serviceLines(pillar: Pillar, locale: "tr" | "en"): string {
  const root = locale === "tr" ? "hizmetler" : "services";
  return SERVICES.filter((s) => s.pillar === pillar)
    .map(
      (s) =>
        `- [${s.name[locale]}](${SITE_URL}/${locale}/${root}/${s.slug[locale]}): ${s.seo.description[locale]}`,
    )
    .join("\n");
}

/**
 * Vaka satırları: müşteri adı + başlık + URL. Ajanın "INDOLES kimlerle
 * çalışmış, ne sonuç almış" sorusuna liste sayfasını gezmeden cevap
 * bulabilmesi için başlık metrik taşır (spec §8.5 ile aynı gerekçe).
 */
function caseLines(locale: "tr" | "en"): string {
  const root = locale === "tr" ? "vakalar" : "case-studies";
  return CASES.map(
    (c) =>
      `- [${c.clientName[locale]} — ${c.title[locale]}](${SITE_URL}/${locale}/${root}/${c.slug})`,
  ).join("\n");
}

/** Yazı satırları: başlık + URL; güncellenen yazı güncelleme yılını taşır. */
function articleLines(locale: "tr" | "en"): string {
  const root = locale === "tr" ? "yazilar" : "articles";
  return ARTICLES.map((a) => {
    const updated = a.updatedAt
      ? locale === "tr"
        ? ` (${a.updatedAt.slice(0, 4)}'da güncellendi)`
        : ` (updated ${a.updatedAt.slice(0, 4)})`
      : "";
    return `- [${a.title[locale]}](${SITE_URL}/${locale}/${root}/${a.slug[locale]})${updated}: ${a.excerpt[locale]}`;
  }).join("\n");
}

/**
 * İki dilli: EN sürüm ayrı bir dosya değil, aynı belgenin ikinci bölümü.
 * Önceki hâli yalnız Türkçeydi ve yalnız TR URL'lerini veriyordu — EN sayfalar
 * ajanlara hiç görünmüyordu (docs/15-content-audit.md §F4). Brief bağlantısı
 * da kaldırılmış `/app/brief/yeni` route'unu gösteriyordu (§E1).
 */
const body = `# INDOLES

> Türkiye merkezli iş geliştirme danışmanlık şirketi. Sanayi şirketlerine teknoloji dönüşümü, ticaret ve perakende markalarına agresif büyüme.

## Kimiz
- İsim: İndoles Yazılım A.Ş.
- Konum: İstanbul, Türkiye
- Dil: TR / EN
- Yaklaşım: teşhis olmadan reçete yok — iş önce anlaşılır, teknoloji sonra çağrılır

## Üç disiplin

### Growth — Agresif Büyüme
${serviceLines("growth", "tr")}

### Transform — Dijital ve İşletme Dönüşümü
${serviceLines("transform", "tr")}

### Build — Teknoloji ve Ürün
${serviceLines("build", "tr")}

## Vaka çalışmaları
${caseLines("tr")}

## Yazılar
${articleLines("tr")}

## İletişim
- [Görüşme ve brief](${SITE_URL}/tr/iletisim)
- E-posta: hello@indoles.com.tr

## Kaynaklar
- [Hizmetler](${SITE_URL}/tr/hizmetler)
- [Paketler](${SITE_URL}/tr/paketler)
- [Vaka çalışmaları](${SITE_URL}/tr/vakalar)
- [Yazılar](${SITE_URL}/tr/yazilar)
- [Site haritası](${SITE_URL}/sitemap.xml)

---

# INDOLES (English)

> A business-building studio based in Turkey. Technology transformation for industrial companies, aggressive growth for commerce and retail brands.

## Who we are
- Legal name: İndoles Yazılım A.Ş.
- Location: Istanbul, Turkey
- Languages: TR / EN
- Approach: no prescription without diagnosis — the business is understood first, technology is called second

## Three disciplines

### Growth
${serviceLines("growth", "en")}

### Transform
${serviceLines("transform", "en")}

### Build
${serviceLines("build", "en")}

## Case studies
${caseLines("en")}

## Articles
${articleLines("en")}

## Contact
- [Calls and briefs](${SITE_URL}/en/contact)
- Email: hello@indoles.com.tr

## Resources
- [Services](${SITE_URL}/en/services)
- [Packages](${SITE_URL}/en/packages)
- [Case studies](${SITE_URL}/en/case-studies)
- [Articles](${SITE_URL}/en/articles)
- [Sitemap](${SITE_URL}/sitemap.xml)
`;

export function GET() {
  return new Response(body, {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
}
