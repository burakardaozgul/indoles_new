import type { Locale } from "@/lib/content/types";

/**
 * Diagnoo paylaşım metadata'sı — OG kart yolu tek yerde (ADR-031).
 *
 * Kart derleme zamanında üretilir (`pnpm og:diagnoo`,
 * `scripts/generate-og-diagnoo.ts`) ve `public/og/diagnoo/{tr,en}/tool.png`
 * olarak repoya girer. İstek başına üretim yok: `@vercel/og` + `fontkit`
 * Worker paketini 3 MB plan sınırının üstüne taşıyordu (ADR-024).
 *
 * GEO'dan tek yapısal fark kart SAYISI. GEO skoru paylaşımın kendisi olduğu
 * için skor başına bir kart üretiliyor (`ogImagePath(score, locale)`);
 * Diagnoo'nun rapor sayfaları özel ve `noindex` (kilitli rapor, kişiye özel
 * bağlantı), yani paylaşıma açık tek yüzey araç sayfasıdır. Kova başına kart
 * üretmek karşılığı olmayan bir varlık yığını olurdu.
 */
export function diagnooOgImagePath(locale: Locale): string {
  return `/og/diagnoo/${locale}/tool.png`;
}

/**
 * Kartın alt metni. Aracın adı iki dilde de "Diagnoo" — tek başına ne
 * gösterdiğini anlatmıyor; alt metin sayfanın dilinde ne olduğunu söyler
 * (`og-image-alt.test.ts` kuralı: alt metin sayfanın dilinde olmalı).
 */
export const OG_DIAGNOO_ALT: Record<Locale, string> = {
  tr: "Diagnoo — ücretsiz e-ticaret site analizi",
  en: "Diagnoo — free e-commerce site analysis",
};
