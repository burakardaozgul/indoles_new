import type { NextResponse } from "next/server";
import { isConsentRequired } from "./region";
import { REGION_COOKIE_NAME } from "./cookie";

/** Vercel'in coğrafi konum başlığı (ADR-012: dağıtım Vercel). */
export const COUNTRY_HEADER = "x-vercel-ip-country";

/**
 * Ziyaretçinin bölgesini çereze yazar.
 *
 * NEDEN ÇEREZ
 * -----------
 * Şerit istemci bileşeni ve sayfalar SSG — sunucu HTML'i herkes için aynı.
 * Bölge bilgisi istemciye ancak istek başına çalışan bir katmandan
 * geçebilir; middleware Vercel'de CDN önbelleğinden önce çalıştığı için
 * statik sayfalarda bile `Set-Cookie` ekleyebilir.
 *
 * BAŞARISIZLIK YÖNÜ
 * -----------------
 * Başlık yoksa `other` yazılır ve banner çıkmaz. Bu bilinçli: `gtag`in
 * kendi `region` varsayılanı IP'ye Google tarafında bakar, yani bu çerez
 * yanılsa bile EEA ziyaretçisinin analitiği açılmaz. Kaybedilen yalnız
 * onay sorma imkânı — yani hata durumunda fazla ölçmüyoruz, az ölçüyoruz.
 *
 * Yanıt nesnesi değiştirilerek döner, yenisi üretilmez: next-intl'in
 * ürettiği locale yönlendirmesi ve başlıkları korunmalı.
 */
export function applyRegionCookie(
  headers: Headers,
  response: NextResponse,
): NextResponse {
  const country = headers.get(COUNTRY_HEADER);
  response.cookies.set(REGION_COOKIE_NAME, isConsentRequired(country) ? "eea" : "other", {
    path: "/",
    sameSite: "lax",
  });
  return response;
}
