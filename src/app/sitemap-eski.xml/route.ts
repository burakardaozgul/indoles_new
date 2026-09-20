import { legacySitemapPaths } from "@/lib/seo/legacy-redirects";
import { SITE_URL } from "@/lib/seo/site";

export const dynamic = "force-static";

/**
 * Eski WordPress URL'lerinin geçici sitemap'i (indeks denetimi 2026-09-18).
 *
 * Neden var: cutover'dan 20 gün sonra Google eski hizmet URL'lerini
 * (`/cro-donusum-orani-optimizasyonu/` vb.) hâlâ indeksli tutuyor ve
 * hiçbirini yeniden taramamıştı — 301'leri görmediği için yeni sayfalar
 * "URL Google tarafından bilinmiyor" durumundaydı. Google'ın site taşıma
 * kılavuzu tam bu durum için eski URL'leri ayrı bir sitemap'te sunmayı
 * önerir: Googlebot listeyi tarar, yönlendirmeyi görür, sinyali yeni adrese
 * taşır.
 *
 * Kurallar:
 * - `robots.txt`e YAZILMAZ; GSC'de elle gönderilir (işlenme durumu orada
 *   izlenir) ve yönlendirmeler indekse işlendiğinde GSC'den kaldırılır.
 * - `lastmod` yok: bu adresler değişmedi, yönlendirildi. Uydurma tarih
 *   sinyali vermekten kaçınılır.
 * - Kaynak `legacy-redirects.ts` — listeyi burada elle tutmak iki listenin
 *   kopmasına yol açardı; eklenen her 301 buraya kendiliğinden düşer.
 * - 2026-09-20'den beri liste WordPress adreslerinin yanında 2026-08-29
 *   öncesi TR-slug'lı EN vaka adreslerini de taşır: GSC URL Inspection o
 *   adresleri hâlâ kanonik gösteriyordu, yani 308'ler taranmamıştı.
 */
export function GET() {
  const urls = legacySitemapPaths()
    .map((p) => `  <url><loc>${SITE_URL}${p}</loc></url>`)
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, {
    headers: { "content-type": "application/xml; charset=utf-8" },
  });
}
