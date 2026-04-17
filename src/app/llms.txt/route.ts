export const dynamic = "force-static";

const body = `# INDOLES

> Türkiye merkezli iş geliştirme danışmanlık şirketi. Sanayi şirketlerine teknoloji dönüşümü, ticaret ve perakende markalarına agresif büyüme.

## Kimiz
- İsim: İndoles Yazılım A.Ş.
- Konum: İstanbul, Türkiye
- Dil: TR / EN

## Pillar'lar

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
- Rezervasyon: https://indoles.com.tr/tr/iletisim
- Brief: https://indoles.com.tr/app/brief/yeni

## Kaynaklar
- Vaka çalışmaları: https://indoles.com.tr/tr/vakalar
- Paketler: https://indoles.com.tr/tr/paketler
- Yazılar: https://indoles.com.tr/tr/yazilar
- Site haritası: https://indoles.com.tr/sitemap.xml
`;

export function GET() {
  return new Response(body, {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
}
