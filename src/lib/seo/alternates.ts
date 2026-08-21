import type { Metadata } from "next";
import type { Locale } from "@/lib/content/types";

/** Aynı sayfanın iki dildeki yolu. Yollar göreli ve `/{locale}` ile başlar. */
export type LocalizedPath = { tr: string; en: string };

/**
 * canonical + hreflang üçlüsü.
 *
 * Göreli yol döner; Next `metadataBase` ile mutlaklaştırır. Her locale
 * kendini de listeler (self-hreflang, Google gereği) ve `x-default` her
 * zaman TR'yi gösterir — birincil pazar (docs/08 §3).
 *
 * Dönüş tipi `NonNullable`: `Metadata["alternates"]` null kabul ediyor ama
 * bu fonksiyon her çağrıda nesne üretiyor. Nullable bırakmak her çağıranı
 * ve her testi gereksiz `!` koymaya zorluyordu.
 */
export function buildAlternates(
  paths: LocalizedPath,
  locale: Locale,
): NonNullable<Metadata["alternates"]> {
  return {
    canonical: paths[locale],
    languages: {
      tr: paths.tr,
      en: paths.en,
      "x-default": paths.tr,
    },
  };
}
