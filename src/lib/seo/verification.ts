import type { Metadata } from "next";

/**
 * Arama motoru sahiplik doğrulaması.
 *
 * Strateji §3 kalem 6 Bing'i "ChatGPT'nin arama altyapısı" olduğu için
 * Google kadar kritik sayıyor; kod tarafında hiçbir doğrulama alanı yoktu.
 * Kodlar `NEXT_PUBLIC_*` değişkenlerinden gelir ve Vercel'de tanımlanır —
 * repoya yazılmazlar, çünkü bir doğrulama kodu o mülkün kontrolünü kanıtlar.
 *
 * Boş nesne DÖNMEZ: `verification: {}` Next'e boş `<meta>` etiketleri
 * bastırıyor. Kod yoksa alan hiç tanımlanmaz.
 */
export type VerificationCodes = {
  google?: string | undefined;
  bing?: string | undefined;
};

export function buildVerification(
  codes: VerificationCodes,
): Metadata["verification"] {
  // Panelden kopyalanan kodlar sıklıkla boşluk taşıyor.
  const google = codes.google?.trim();
  const bing = codes.bing?.trim();

  const hasGoogle = Boolean(google);
  const hasBing = Boolean(bing);
  if (!hasGoogle && !hasBing) return undefined;

  return {
    ...(hasGoogle ? { google } : {}),
    // Next'in tipinde Bing için ayrı alan yok; Bing `msvalidate.01` bekliyor.
    ...(hasBing ? { other: { "msvalidate.01": bing! } } : {}),
  };
}
