import { SITE_URL } from "@/lib/seo/site";
import { SERVICES } from "@/lib/content/services";
import type { Pillar } from "@/lib/content/types";

export const dynamic = "force-static";

/**
 * Bir pillar'ın hizmetlerini "- Ad: URL" satırları olarak yazar.
 *
 * Önceki hâl hizmetleri yalnız ADIYLA sayıyordu, hiçbirine link vermiyordu:
 * ajan hizmetin varlığını görüyor ama sayfasını bulamıyordu
 * (spec §8.5). URL'ler `SERVICES`ten türetilir — slug değişirse llms.txt
 * sessizce eskimez.
 */
function serviceLines(pillar: Pillar, locale: "tr" | "en"): string {
  const root = locale === "tr" ? "hizmetler" : "services";
  return SERVICES.filter((s) => s.pillar === pillar)
    .map((s) => `- ${s.name[locale]}: ${SITE_URL}/${locale}/${root}/${s.slug[locale]}`)
    .join("\n");
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

## İletişim
- Görüşme ve brief: https://indoles.com.tr/tr/iletisim
- E-posta: hello@indoles.com.tr

## Kaynaklar
- Hizmetler: https://indoles.com.tr/tr/hizmetler
- Paketler: https://indoles.com.tr/tr/paketler
- Vaka çalışmaları: https://indoles.com.tr/tr/vakalar
- Yazılar: https://indoles.com.tr/tr/yazilar
- Site haritası: https://indoles.com.tr/sitemap.xml

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

## Contact
- Calls and briefs: https://indoles.com.tr/en/contact
- Email: hello@indoles.com.tr

## Resources
- Services: https://indoles.com.tr/en/services
- Packages: https://indoles.com.tr/en/packages
- Case studies: https://indoles.com.tr/en/case-studies
- Articles: https://indoles.com.tr/en/articles
- Sitemap: https://indoles.com.tr/sitemap.xml
`;

export function GET() {
  return new Response(body, {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
}
