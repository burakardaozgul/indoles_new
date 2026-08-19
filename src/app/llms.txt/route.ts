export const dynamic = "force-static";

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
- Marka stratejisi ve pazarlama danışmanlığı
- Performans pazarlama
- CRO
- E-ticaret
- UI/UX tasarım

### Transform — Dijital ve İşletme Dönüşümü
- AI danışmanlığı
- Dijital dönüşüm
- İş otomasyonları
- İş zekası
- İşletme mühendisliği

### Build — Teknoloji ve Ürün
- Özel yazılım ve mobil uygulama
- Teknoloji ve altyapı danışmanlığı

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
- Brand strategy and marketing advisory
- Performance marketing
- CRO
- E-commerce
- UI/UX design

### Transform
- AI advisory
- Digital transformation
- Business automation
- Business intelligence
- Operations engineering

### Build
- Custom software and mobile apps
- Technology and infrastructure advisory

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
