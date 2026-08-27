import { buildLlmsTxtLocale } from "@/lib/seo/llms";
import { routing } from "@/lib/i18n/routing";
import type { Locale } from "@/lib/content/types";

/**
 * `/tr/llms.txt` ve `/en/llms.txt` — kök `/llms.txt`'in (iki dilli
 * birleşim) tek dilli karşılıkları. `docs/08-seo-i18n-strategy.md` §6 ve
 * `indoles-i18n-seo` skill'i bu iki dosyanın da yayınlanmasını bekliyordu;
 * hiç yazılmamıştı ve 404 dönüyordu (denetim G-11).
 *
 * Üretim mantığı `src/lib/seo/llms.ts`'te, kök route ile paylaşılıyor —
 * hizmet/vaka/yazı satırları içerik katmanından türetildiği için iki route
 * arasında kopyalanmış literal metin yok.
 *
 * Middleware notu: `src/middleware.ts`'in matcher'ı `.*\..*` deseniyle nokta
 * taşıyan tüm yolları (kök `/llms.txt` dahil) locale yönlendirmesinden
 * muaf tutuyor. `/tr/llms.txt` da bu deseni tetikliyor (path'te `.` var),
 * yani bu route da middleware'den GEÇMİYOR — ama bu zararsız: yol zaten
 * açık `tr`/`en` locale segmenti taşıyor, next-intl'in eksik-prefix
 * yönlendirmesine ihtiyacı yok. Next.js'in dosya tabanlı yönlendirmesi
 * `[locale]` segmentini middleware'den bağımsız çözer (docs/17 T-13'ün
 * `/icon` 404'ü farklı bir kök nedenden kaynaklanıyordu: o yollar nokta
 * TAŞIMIYORDU, dolayısıyla `.*\..*` istisnasına hiç girmiyor ve middleware
 * onları locale'e yönlendirmeye ÇALIŞIYORDU — `/tr/icon` gibi var olmayan
 * bir path'e 307 verip 404'e düşüyordu. Buradaki durum tam tersi: path
 * zaten nokta taşıdığı için middleware hiç devreye girmiyor).
 */

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(buildLlmsTxtLocale(locale as Locale), {
    // Kök `/llms.txt` ile aynı tip: dosya llmstxt.org biçiminde markdown
    // (başlıklar + `- [Ad](url): açıklama` bağlantıları). İki yüzeyin farklı
    // tip bildirmesi aynı belgenin iki sürümünü ayrıştırırdı.
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
}
