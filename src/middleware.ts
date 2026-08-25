import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "@/lib/i18n/routing";
import { applyRegionCookie } from "@/lib/consent/middleware";

const handleI18n = createMiddleware(routing);

/**
 * next-intl'in locale yönlendirmesi + çerez onayı için bölge işareti.
 *
 * Bölge burada yazılır çünkü sayfalar SSG: sunucu HTML'i herkes için aynı,
 * ziyaretçiye özel tek bilgi kanalı istek başına çalışan bu katman.
 * next-intl'in ürettiği yanıt korunur, üzerine yalnız çerez eklenir.
 */
export default function middleware(request: NextRequest) {
  return applyRegionCookie(request.headers, handleI18n(request));
}

/**
 * Metadata dosya rotaları (`/icon`, `/apple-icon`, `/opengraph-image`) uzantı
 * taşımadığı için `.*\..*` elemesine takılmıyor, locale prefix'i alıyor ve
 * `/tr/icon` olarak 307 → 404 dönüyordu; favicon ve OG kartı bu yüzden hiç
 * yüklenmiyordu. Adları lookahead'e tam eşleşmeyle (`$`) eklendi — `$` olmadan
 * `/iconlar` gibi gerçek sayfalar da yanlışlıkla elenirdi.
 */
export const config = {
  matcher: [
    "/((?!api|_next|_vercel|icon$|apple-icon$|opengraph-image$|twitter-image$|.*\\..*).*)",
  ],
};
