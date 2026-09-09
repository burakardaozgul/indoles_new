import type { NextResponse } from "next/server";
import { isConsentRequired } from "./region";
import { REGION_COOKIE_NAME } from "./cookie";

/**
 * Cloudflare'in coğrafi konum başlığı (ADR-024: dağıtım Cloudflare Workers).
 *
 * Burada `x-vercel-ip-country` yazıyordu ve ADR-024 ile Vercel'den çıkıldığı
 * hâlde güncellenmemişti: başlık hiç gelmediği için her ziyaretçiye `other`
 * yazılıyor, EEA ziyaretçilerine şerit hiç çıkmıyordu. Sessiz bir uyum
 * hatasıydı — hiçbir istisna üretmediği için fark edilmedi.
 */
export const COUNTRY_HEADER = "cf-ipcountry";

/**
 * Vercel başlığı yedek olarak korunuyor: önizleme dağıtımları ya da olası
 * bir geri dönüşte tek satırlık bir fark yüzünden aynı hatayı tekrar
 * yaşamamak için. Sıra önemli değil, ikisi aynı anda gelmiyor.
 */
export const COUNTRY_HEADER_FALLBACK = "x-vercel-ip-country";

/**
 * Ziyaretçinin bölgesini çereze yazar.
 *
 * NEDEN ÇEREZ
 * -----------
 * Şerit istemci bileşeni ve sayfalar SSG — sunucu HTML'i herkes için aynı.
 * Bölge bilgisi istemciye ancak istek başına çalışan bir katmandan
 * geçebilir; middleware CDN önbelleğinden önce çalıştığı için statik
 * sayfalarda bile `Set-Cookie` ekleyebilir.
 *
 * BAŞARISIZLIK YÖNÜ
 * -----------------
 * Başlık yoksa `other` yazılır. ADR-033 sonrası bunun anlamı daraldı:
 * şerit artık her ziyaretçiye çıktığı için bölge yalnız şeridin NE
 * sorduğunu belirliyor (EEA'da analitik de sorulur, diğer bölgelerde
 * yalnız pazarlama). Yani başlık kaybolursa pazarlama rızası yine
 * sorulur — kaybedilen tek şey EEA ziyaretçisine analitiği de sorma
 * imkânı olur ve `gtag`in kendi bölgesel varsayılanı orada devrede kalır.
 *
 * Yanıt nesnesi değiştirilerek döner, yenisi üretilmez: next-intl'in
 * ürettiği locale yönlendirmesi ve başlıkları korunmalı.
 */
export function applyRegionCookie(
  headers: Headers,
  response: NextResponse,
): NextResponse {
  const country = headers.get(COUNTRY_HEADER) ?? headers.get(COUNTRY_HEADER_FALLBACK);
  response.cookies.set(REGION_COOKIE_NAME, isConsentRequired(country) ? "eea" : "other", {
    path: "/",
    sameSite: "lax",
  });
  return response;
}
