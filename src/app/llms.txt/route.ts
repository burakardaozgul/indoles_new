import { buildLlmsTxtRoot } from "@/lib/seo/llms";

export const dynamic = "force-static";

/**
 * Üretim mantığı `src/lib/seo/llms.ts`'te — bu route hem kök hem per-locale
 * (`src/app/(marketing)/[locale]/llms.txt/route.ts`) dosyanın paylaştığı
 * tek kaynaktır. İki dilli: EN sürüm ayrı bir dosya değil, aynı belgenin
 * ikinci bölümü (`docs/08-seo-i18n-strategy.md` §6 — root TR'yi ana olarak
 * gösterir). Önceki hâli yalnız Türkçeydi ve yalnız TR URL'lerini
 * veriyordu — EN sayfalar ajanlara hiç görünmüyordu
 * (docs/15-content-audit.md §F4). Brief bağlantısı da kaldırılmış
 * `/app/brief/yeni` route'unu gösteriyordu (§E1).
 */
export function GET() {
  return new Response(buildLlmsTxtRoot(), {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
}
