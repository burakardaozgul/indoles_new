import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/lib/i18n/routing";

/**
 * Locale altındaki eşleşmeyen yolların yakalayıcısı.
 *
 * Bu dosya olmadan `/tr/olmayan-sayfa` hiçbir route'a düşmüyor ve Next.js
 * doğrudan **kök** `not-found.tsx`'i basıyor: marka chrome'u yok, başlık yok,
 * metin her iki dilde de Türkçe (denetim T-08). Yakalayıcı yolu kendi
 * segmentine bağlayınca `[locale]/not-found.tsx` devreye girer — nav, footer
 * ve doğru dil ile.
 *
 * `notFound()` gerçek 404 durum kodunu korur; sayfa hiçbir zaman içerik
 * döndürmez.
 */

const TITLE = {
  tr: "Sayfa bulunamadı",
  en: "Page not found",
} as const;

const DESCRIPTION = {
  tr: "Bu adreste bir sayfa yok. Hizmetler, vakalar, yazılar ve iletişim bağlantılarından devam edebilirsiniz.",
  en: "There is no page at this address. Continue from the services, case studies, articles or contact links.",
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = (routing.locales as readonly string[]).includes(locale)
    ? (locale as "tr" | "en")
    : routing.defaultLocale;

  return {
    title: TITLE[loc],
    description: DESCRIPTION[loc],
    // 404 hiçbir koşulda indekslenmez; hreflang de verilmez — karşı dilde
    // eşdeğeri olmayan bir hata yüzeyi için alternate beyanı yanlış sinyaldir.
    robots: { index: false, follow: true },
  };
}

export default async function LocaleCatchAll({
  params,
}: {
  params: Promise<{ locale: string; rest: string[] }>;
}) {
  const { locale } = await params;

  // `not-found.tsx`'e `params` geçmiyor; dilini `getLocale()` ile okuyor.
  // O çağrının doğru değeri döndürmesi buradaki `setRequestLocale`e bağlı.
  if ((routing.locales as readonly string[]).includes(locale)) {
    setRequestLocale(locale);
  }

  notFound();
}
