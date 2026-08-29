import { SITE_URL } from "@/lib/seo/site";
import { SERVICES } from "@/lib/content/services";
import { PILLARS } from "@/lib/content/pillars";
import { PACKAGES } from "@/lib/content/packages";
import { CASES } from "@/lib/content/cases";
import { ARTICLES } from "@/lib/content/articles";
import { BOOKABLE_CONSULTANTS } from "@/lib/content/consultants";
import type { Locale, Pillar } from "@/lib/content/types";

export const dynamic = "force-static";

/**
 * `/llms-full.txt` — `/llms.txt`'in genişletilmiş hâli.
 *
 * İkisi arasındaki iş bölümü net: `llms.txt` bir **harita**, ajanı doğru URL'e
 * yollar; bu dosya bir **döküm**, ajanın siteyi hiç gezmeden INDOLES'i doğru
 * anlatabilmesi için gereken gövdeyi taşır (denetim G-02). Aynı disiplinler
 * geçerli: her varlık llmstxt.org bağlantı biçiminde (`- [Ad](URL): açıklama`)
 * anılır ve her host `SITE_URL`den gelir — sabit yazılmış alan adı yok (G-03).
 *
 * `llms.txt`'ten kopyalanan bir satır yok: bu dosya içerik katmanının
 * kendisinden üretilir, dolayısıyla içerik değişince sessizce eskimez.
 */

const ROOT: Record<Locale, Record<string, string>> = {
  tr: {
    services: "hizmetler",
    packages: "paketler",
    cases: "vakalar",
    articles: "yazilar",
    consultants: "danismanlar",
    contact: "iletisim",
  },
  en: {
    services: "services",
    packages: "packages",
    cases: "case-studies",
    articles: "articles",
    consultants: "consultants",
    contact: "contact",
  },
};

function url(locale: Locale, section: string, slug?: string): string {
  const base = `${SITE_URL}/${locale}/${ROOT[locale][section]}`;
  return slug ? `${base}/${slug}` : base;
}

/** Madde listesi — boş dizide hiç satır basmaz (boş başlık bırakmamak için). */
function bullets(items: readonly string[]): string {
  return items.map((i) => `- ${i}`).join("\n");
}

function pillarName(key: Pillar, locale: Locale): string {
  return PILLARS.find((p) => p.key === key)?.name[locale] ?? key;
}

/* --- Hizmetler ------------------------------------------------------------ */

function serviceSection(locale: Locale, pillar: Pillar): string {
  const L = locale === "tr";
  return SERVICES.filter((s) => s.pillar === pillar)
    .map((s) => {
      const link = url(locale, "services", s.slug[locale]);
      return [
        `#### ${s.name[locale]}`,
        `- [${s.name[locale]}](${link}): ${s.seo.description[locale]}`,
        "",
        s.lede[locale],
        "",
        `**${L ? "Kapsam" : "Scope"}:**`,
        bullets(
          s.scope.includes.map(
            (i) => `${i.title[locale]} — ${i.description[locale]}`,
          ),
        ),
        "",
        `**${L ? "Kapsam dışı" : "Out of scope"}:**`,
        bullets(s.scope.excludes[locale]),
      ].join("\n");
    })
    .join("\n\n");
}

/* --- Paketler ------------------------------------------------------------- */

function packageSection(locale: Locale): string {
  const L = locale === "tr";
  return PACKAGES.map((p) => {
    const link = url(locale, "packages", p.slug[locale]);
    const price = `₺${p.pricing.TRY.toLocaleString("en-US")} · €${p.pricing.EUR.toLocaleString("en-US")} · $${p.pricing.USD.toLocaleString("en-US")}`;
    const weeks = L ? `${p.durationWeeks} hafta` : `${p.durationWeeks} weeks`;
    return [
      `### ${p.name[locale]}`,
      `- [${p.name[locale]}](${link}): ${p.descriptor[locale]}`,
      "",
      `- ${L ? "Disiplin" : "Discipline"}: ${pillarName(p.pillar, locale)}`,
      `- ${L ? "Süre" : "Duration"}: ${weeks}`,
      `- ${L ? "Sabit fiyat" : "Fixed price"}: ${price}`,
      "",
      `**${L ? "Sanayi alıcısı için kapsam" : "Scope for industrial buyers"}:**`,
      bullets(p.scope.industrial[locale]),
      "",
      `**${L ? "Ticaret alıcısı için kapsam" : "Scope for commerce buyers"}:**`,
      bullets(p.scope.commerce[locale]),
    ].join("\n");
  }).join("\n\n");
}

/* --- Vakalar -------------------------------------------------------------- */

function caseSection(locale: Locale): string {
  const L = locale === "tr";
  return CASES.map((c) => {
    const link = url(locale, "cases", c.slug[locale]);
    const period = c.period ? ` · ${c.period[locale]}` : "";
    return [
      `### ${c.clientName[locale]} — ${c.title[locale]}`,
      `- [${c.clientName[locale]} — ${c.title[locale]}](${link}): ${c.lead[locale]}`,
      "",
      `- ${L ? "Sektör" : "Sector"}: ${c.clientSector[locale]}`,
      `- ${L ? "Disiplin" : "Discipline"}: ${pillarName(c.pillar, locale)}`,
      `- ${L ? "Süre" : "Duration"}: ${c.durationWeeks} ${L ? "hafta" : "weeks"}${period}`,
      "",
      `**${L ? "Problem" : "Problem"}:**`,
      bullets(c.challenge[locale]),
      "",
      `**${L ? "Çözüm" : "Approach"}:**`,
      bullets(c.approach[locale]),
      "",
      `**${L ? "Sonuç" : "Outcome"}:**`,
      bullets(c.outcome[locale]),
      "",
      `**${L ? "Metrikler" : "Metrics"}:**`,
      // Metrik bağlamsız basılmaz: `context` varsa parantez içinde gider
      // (içerik dürüstlüğü, docs/04 §10). Ajan rakamı çerçevesiyle alıntılar.
      bullets(
        c.metrics.map((m) => {
          const ctx = m.context ? ` (${m.context[locale]})` : "";
          return `${m.value[locale]} — ${m.label[locale]}${ctx}`;
        }),
      ),
    ].join("\n");
  }).join("\n\n");
}

/* --- Yazılar -------------------------------------------------------------- */

function articleSection(locale: Locale): string {
  const L = locale === "tr";
  return ARTICLES.map((a) => {
    const link = url(locale, "articles", a.slug[locale]);
    const updated = a.updatedAt
      ? L
        ? `, ${a.updatedAt} tarihinde güncellendi`
        : `, updated ${a.updatedAt}`
      : "";
    const meta = L
      ? `${a.publishedAt} yayımlandı${updated} · ${a.readingMinutes} dk okuma`
      : `published ${a.publishedAt}${updated} · ${a.readingMinutes} min read`;
    return `- [${a.title[locale]}](${link}): ${a.excerpt[locale]} (${meta})`;
  }).join("\n");
}

/* --- Kadro ---------------------------------------------------------------- */

function consultantSection(locale: Locale): string {
  return BOOKABLE_CONSULTANTS.map((c) => {
    const link = url(locale, "consultants", c.slug);
    const pillars = c.pillars.map((p) => pillarName(p, locale)).join(", ");
    return `- [${c.name} — ${c.title[locale]}](${link}): ${c.shortBio[locale]} (${pillars})`;
  }).join("\n");
}

/* --- Belge ---------------------------------------------------------------- */

const body = `# INDOLES — tam içerik dökümü

> Bu dosya \`/llms.txt\`'in genişletilmiş hâlidir. Amaç: bir yapay zeka ajanının siteyi gezmeden INDOLES'in hizmetlerini, paketlerini, vakalarını ve kadrosunu doğru anlatabilmesi. Kısa harita için: [llms.txt](${SITE_URL}/llms.txt).

## Kimiz
- İsim: İndoles Yazılım A.Ş.
- Konum: İstanbul, Türkiye
- Dil: TR / EN
- Alan: iş geliştirme danışmanlığı — sanayi şirketlerine teknoloji dönüşümü, ticaret ve perakende markalarına agresif büyüme
- Yaklaşım: teşhis olmadan reçete yok — iş önce anlaşılır, teknoloji sonra çağrılır
- İletişim: [Görüşme ve brief](${url("tr", "contact")}) · digital@indoles.com.tr

## Üç disiplin

### Growth — ${PILLARS[0]!.seo?.title.tr ?? "Agresif Büyüme"}
${PILLARS[0]!.heroLede.tr}
- [Growth](${url("tr", "services", "growth")}): ${PILLARS[0]!.seo?.description.tr ?? PILLARS[0]!.heroLede.tr}

${serviceSection("tr", "growth")}

### Transform — ${PILLARS[1]!.seo?.title.tr ?? "Dijital ve İşletme Dönüşümü"}
${PILLARS[1]!.heroLede.tr}
- [Transform](${url("tr", "services", "transform")}): ${PILLARS[1]!.seo?.description.tr ?? PILLARS[1]!.heroLede.tr}

${serviceSection("tr", "transform")}

### Build — ${PILLARS[2]!.seo?.title.tr ?? "Teknoloji ve Ürün"}
${PILLARS[2]!.heroLede.tr}
- [Build](${url("tr", "services", "build")}): ${PILLARS[2]!.seo?.description.tr ?? PILLARS[2]!.heroLede.tr}

${serviceSection("tr", "build")}

## Paketler

Sabit kapsam, sabit süre, sabit fiyat. Fiyatlar KDV hariç liste fiyatıdır.

${packageSection("tr")}

## Vaka çalışmaları

${caseSection("tr")}

## Yazılar

${articleSection("tr")}

## Kadro

${consultantSection("tr")}

## Kaynaklar
- [Hizmetler](${url("tr", "services")})
- [Paketler](${url("tr", "packages")})
- [Vaka çalışmaları](${url("tr", "cases")})
- [Yazılar](${url("tr", "articles")})
- [Danışmanlar](${url("tr", "consultants")})
- [İletişim](${url("tr", "contact")})
- [Site haritası](${SITE_URL}/sitemap.xml)

---

# INDOLES — full content export (English)

> This file is the expanded form of \`/llms.txt\`. Its purpose: to let an AI agent describe INDOLES accurately — services, packages, case studies and team — without crawling the site. For the short map: [llms.txt](${SITE_URL}/llms.txt).

## Who we are
- Legal name: İndoles Yazılım A.Ş.
- Location: Istanbul, Turkey
- Languages: TR / EN
- Field: business development consultancy — technology transformation for industrial companies, aggressive growth for commerce and retail brands
- Approach: no prescription without diagnosis — the business is understood first, technology is called second
- Contact: [Calls and briefs](${url("en", "contact")}) · digital@indoles.com.tr

## Three disciplines

### Growth — ${PILLARS[0]!.seo?.title.en ?? "Growth"}
${PILLARS[0]!.heroLede.en}
- [Growth](${url("en", "services", "growth")}): ${PILLARS[0]!.seo?.description.en ?? PILLARS[0]!.heroLede.en}

${serviceSection("en", "growth")}

### Transform — ${PILLARS[1]!.seo?.title.en ?? "Transform"}
${PILLARS[1]!.heroLede.en}
- [Transform](${url("en", "services", "transform")}): ${PILLARS[1]!.seo?.description.en ?? PILLARS[1]!.heroLede.en}

${serviceSection("en", "transform")}

### Build — ${PILLARS[2]!.seo?.title.en ?? "Build"}
${PILLARS[2]!.heroLede.en}
- [Build](${url("en", "services", "build")}): ${PILLARS[2]!.seo?.description.en ?? PILLARS[2]!.heroLede.en}

${serviceSection("en", "build")}

## Packages

Fixed scope, fixed duration, fixed price. Prices are list prices, excluding VAT.

${packageSection("en")}

## Case studies

${caseSection("en")}

## Articles

${articleSection("en")}

## Team

${consultantSection("en")}

## Resources
- [Services](${url("en", "services")})
- [Packages](${url("en", "packages")})
- [Case studies](${url("en", "cases")})
- [Articles](${url("en", "articles")})
- [Consultants](${url("en", "consultants")})
- [Contact](${url("en", "contact")})
- [Sitemap](${SITE_URL}/sitemap.xml)
`;

export function GET() {
  return new Response(body, {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
}
