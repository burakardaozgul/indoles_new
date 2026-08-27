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
 * segmentine bağlayınca `[locale]/not-found.tsx` devreye girer.
 *
 * `notFound()` gerçek 404 durum kodunu korur; sayfa hiçbir zaman içerik
 * döndürmez.
 *
 * **Metadata nereden geliyor:** `notFound()` fırlatıldığında Next.js bu
 * dosyanın `generateMetadata`'sını değil, `[locale]/not-found.tsx`'inkini
 * tüketiyor (`errorConvention` yolu). Aşağıdaki tanım bu yüzden yalnız
 * istemci tarafı geçişte devreye giriyor; ilk HTML'in başlığı ve robots'u
 * kardeş dosyada tanımlı. İkisi bilinçli olarak aynı metni taşıyor — biri
 * değişirse diğeri de değişmeli.
 *
 * `alternates: {}` bilinçli: boş bırakılmazsa `[locale]/layout.tsx`'in
 * `canonical: /${loc}` + hreflang üçlüsü miras kalıyor ve 404 kendini ana
 * sayfaya "kanonikleştiriyor" (denetim T-15).
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
    // Next.js metadata alanları nesne düzeyinde ÜZERİNE YAZAR, derin
    // birleştirmez: boş `{}` vermezsek `[locale]/layout.tsx`'in
    // `canonical: /${loc}` + hreflang üçlüsü miras kalır ve 404, ana sayfayı
    // kanonik gösterir (denetim T-15).
    alternates: {},
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
