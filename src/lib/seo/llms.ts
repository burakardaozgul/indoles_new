import { SITE_URL } from "@/lib/seo/site";
import { SERVICES } from "@/lib/content/services";
import { CASES } from "@/lib/content/cases";
import { ARTICLES } from "@/lib/content/articles";
import type { Locale, Pillar } from "@/lib/content/types";

/**
 * `llms.txt` üretim mantığı — hem kök `/llms.txt` (iki dilli birleşim,
 * `src/app/llms.txt/route.ts`) hem per-locale `/tr/llms.txt` ve
 * `/en/llms.txt` (`src/app/(marketing)/[locale]/llms.txt/route.ts`) bu
 * modülü çağırır. Önceden bu üretim mantığı yalnız kök route dosyasının
 * içindeydi ve per-locale route hiç yazılmamıştı — `docs/08-seo-i18n-strategy.md`
 * §6'nın beklediği `/tr/llms.txt` ve `/en/llms.txt` 404 dönüyordu (denetim
 * G-11). Servis/vaka/yazı satırları içerik katmanından türetildiği için iki
 * dosya arasında kopyalanmış literal metin yok; slug değişirse ikisi de
 * aynı anda güncel kalır.
 *
 * `export const dynamic = "force-static"` burada DEĞİL, bu modülü çağıran
 * her route dosyasında ayrı ayrı tanımlanır — bu export yalnız route
 * segment dosyalarında (route.ts) etkilidir, paylaşılan bir kütüphane
 * modülünde hiçbir işlevi yoktur.
 */

/**
 * Bir pillar'ın hizmetlerini llmstxt.org biçiminde
 * "- [Ad](URL): açıklama" satırları olarak yazar.
 *
 * Önceki hâl hizmetleri yalnız ADIYLA sayıyordu, hiçbirine link vermiyordu:
 * ajan hizmetin varlığını görüyor ama sayfasını bulamıyordu
 * (spec §8.5). URL'ler `SERVICES`ten türetilir — slug değişirse llms.txt
 * sessizce eskimez.
 */
function serviceLines(pillar: Pillar, locale: Locale): string {
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
function caseLines(locale: Locale): string {
  const root = locale === "tr" ? "vakalar" : "case-studies";
  return CASES.map(
    (c) =>
      `- [${c.clientName[locale]} — ${c.title[locale]}](${SITE_URL}/${locale}/${root}/${c.slug})`,
  ).join("\n");
}

/** Yazı satırları: başlık + URL; güncellenen yazı güncelleme yılını taşır. */
function articleLines(locale: Locale): string {
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
 * Bir dilin llms.txt bölümünü üretir — H1, kısa tanım, kimlik, üç disiplin,
 * vaka çalışmaları, yazılar, iletişim ve kaynaklar.
 *
 * `heading` parametrik: kök route'ta EN bölümü TR'den ayırt etmek için
 * "# INDOLES (English)" taşır (aynı belgede iki H1 art arda geldiği için
 * ayrım gerekir), ama tek dilli `/en/llms.txt` dosyasında bu ayrım gereksiz
 * — URL zaten İngilizce olduğunu söylüyor, başlıkta tekrarı llmstxt.org'un
 * beklediği tek-H1 sadeliğini bozar.
 *
 * `extraResourceLines` yalnız kök route'ta kullanılır: birleşik dosyayı
 * okuyan bir ajana tek dilli sürümlerin de var olduğunu söyleyen ekstra
 * `Kaynaklar`/`Resources` satırları (bkz. `buildLlmsTxtRoot`). Tek dilli
 * dosyalar (`buildLlmsTxtLocale`) bunu boş bırakır — görev kısıtı kendi
 * dilinin dışında hiçbir bağlantı taşımamaları.
 */
function trSection(heading: string, extraResourceLines = ""): string {
  return `${heading}

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
- [Site haritası](${SITE_URL}/sitemap.xml)${extraResourceLines}`;
}

function enSection(heading: string, extraResourceLines = ""): string {
  return `${heading}

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
- [Sitemap](${SITE_URL}/sitemap.xml)${extraResourceLines}`;
}

/**
 * Kök `/llms.txt`: iki dilli birleşim (TR birincil, EN ikinci bölüm —
 * docs/08-seo-i18n-strategy.md §6: "root `/llms.txt` TR'yi ana olarak
 * gösterir"). Tek kasıtlı yeni davranış: her iki bölümün `Kaynaklar`/
 * `Resources` listesine tek dilli sürümlere işaret eden birer çift satır
 * eklendi — G-11 kapanışının doğal sonucu, birleşik dosyayı okuyan bir
 * ajan tek dilli karşılıklarının var olduğunu bilsin diye. Bunun dışında
 * çıktı önceki sürümle byte-byte aynıdır (bkz. denetim notu, build kanıtı).
 */
export function buildLlmsTxtRoot(): string {
  const tr = trSection(
    "# INDOLES",
    `\n- [Yalnız Türkçe sürüm](${SITE_URL}/tr/llms.txt)\n- [Yalnız İngilizce sürüm](${SITE_URL}/en/llms.txt)`,
  );
  const en = enSection(
    "# INDOLES (English)",
    `\n- [Turkish-only version](${SITE_URL}/tr/llms.txt)\n- [English-only version](${SITE_URL}/en/llms.txt)`,
  );
  return `${tr}\n\n---\n\n${en}\n`;
}

/**
 * Per-locale `/tr/llms.txt` veya `/en/llms.txt`: kök dosyadaki iki dilli
 * birleşimin tek-dil hâli. Yalnız kendi dilinin URL'lerini taşır, karşı
 * dile hiçbir bağlantı vermez — kendi başına bir belge, birleşik dosyanın
 * yarısının aynen kopyası değil (docs/08 §6'nın ayrı yayın beklentisi,
 * denetim G-11).
 */
export function buildLlmsTxtLocale(locale: Locale): string {
  return locale === "tr"
    ? `${trSection("# INDOLES")}\n`
    : `${enSection("# INDOLES")}\n`;
}
