import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import { V2PageHeader } from "@/components/v2/chrome/V2PageHeader";
import { routing } from "@/lib/i18n/routing";
import type { Locale } from "@/lib/content/types";

/**
 * Locale içindeki 404 — marka chrome'unun (nav + footer) içinde.
 *
 * `notFound()` `[locale]` altında HERHANGİ bir sayfadan (bu dosyanın kardeşi
 * `[...rest]/page.tsx`, `hizmetler/[slug]/page.tsx`, `danismanlar/[slug]/
 * page.tsx`, vb.) fırlatıldığında Next.js bu dosyayı kullanır — İSTEMCİ TARAFI
 * geçişte de, JS'siz İLK HTML'de de. Next.js'in metadata çözümleyicisi
 * (`resolve-metadata.ts` `collectMetadata`) `errorConvention` set olduğunda
 * fırlatan sayfanın KENDİ `generateMetadata`'sını değil, üstündeki layout'ların
 * metadata'sını + BU dosyanın (`not-found.tsx`) `generateMetadata`'sını
 * kullanır (layout'unkini ezerek) — bu yüzden `title`/`robots`/`alternates`
 * BURADA tanımlı olmak zorunda (denetim T-08b). `[...rest]/page.tsx`'teki
 * eski `generateMetadata` bu nedenle fiilen ölü koddu: sayfa her zaman
 * `notFound()`'a düşüyor, kendi metadata'sı hiç tüketilmiyor.
 *
 * `<html lang>` ayrı ve BURADAN düzeltilemeyen bir kısıt: `notFound()`
 * render sırasında fırlatıldığında Next.js kök `layout.tsx`'i hiç render
 * etmiyor, kendi sentetik `<html id="__next_error__">` (lang'siz) kabuğunu
 * kullanıyor (`app-render.js` `getErrorRSCPayload`). Next 15.5'in deneysel
 * `experimental.globalNotFound` + `app/global-not-found.tsx` özelliği BUNU
 * çözmüyor: Next dokümantasyonu bu dosyayı "handled at the routing level"
 * diye tanımlıyor — yalnız YÖNLENDİRME düzeyinde hiç eşleşmeyen URL'leri
 * kapsıyor (`getRSCPayload`, `is404` bayrağı), `notFound()` çağrısını değil
 * (`getErrorRSCPayload`, ayrı ve `global-not-found`den habersiz kod yolu).
 * Denendi ve doğrulandı: `experimental.globalNotFound` açıkken bile bu
 * sayfanın (component-level `notFound()`) ürettiği ilk HTML birebir aynı
 * kaldı — deneme repoda tutulmadı (gereksiz deneysel bayrak + ek font
 * yükü, ölçülebilir kazanç yok). Sonuç: sayfa metni, başlığı ve robots'u
 * doğru, ama `<html>` etiketinin `lang` özniteliği İLK HTML'de hâlâ eksik —
 * bilinen, kod tarafından kapatılamayan bir Next 15.5 sınırı (bkz. final
 * rapor "açık sorular").
 *
 * Kök `src/app/not-found.tsx` duruyor ve duracak: locale dışı yollar
 * (`/olmayan-sey` gibi, hiçbir `[locale]` segmentine girmeyen istekler) oraya
 * düşüyor. Bu dosya yalnız `/tr/*` ve `/en/*` altındaki 404'leri karşılar.
 *
 * Gerekçe kurtarma: `next.config.ts` politikası gereği karşılığı olmayan eski
 * URL'ler bilinçli olarak 404'e düşüyor (denetim T-06/T-08). O hâlde 404 bir
 * çıkmaz değil, dış bağlantıdan gelen okuru siteye bağlayan yüzeydir — dört
 * ana bölüme buradan girilir.
 *
 * Gövde metninin dilini `getLocale()` verir: Next.js `not-found.tsx`'e
 * `params` geçirmiyor. Değer, 404'ü fırlatan sayfanın `setRequestLocale`
 * çağrısından gelir (yakalayıcı rota dahil), yoksa `routing.defaultLocale`'e
 * düşer.
 */

const TITLE = {
  tr: "Sayfa bulunamadı",
  en: "Page not found",
} as const;

const DESCRIPTION = {
  tr: "Bu adreste bir sayfa yok. Hizmetler, vakalar, yazılar ve iletişim bağlantılarından devam edebilirsiniz.",
  en: "There is no page at this address. Continue from the services, case studies, articles or contact links.",
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const loc = (routing.locales as readonly string[]).includes(locale)
    ? (locale as Locale)
    : routing.defaultLocale;

  return {
    title: TITLE[loc],
    description: DESCRIPTION[loc],
    // `robots: {}` (BOŞ nesne, alan tamamen YOK değil): Next.js metadata
    // alanları üzerine yazar, derin birleştirmez — boş bırakırsak kök
    // `layout.tsx`nin `robots: { index: production, follow: production }`ı
    // miras kalıp production'da "index, follow" basıyor, buradaki `noindex`
    // ile ÇELİŞEN ikinci bir <meta name="robots"> oluşuyordu (denetim
    // T-08b'nin yakaladığı tam olarak buydu). `{}` mirası keser ve kendisi
    // hiçbir directive basmaz; tek `<meta name="robots" content="noindex">`
    // Next.js'in `res.statusCode > 400` için otomatik eklediği `NonIndex`
    // bileşeninden gelir (app-render.js) — bilinçli tek kaynak.
    robots: {},
    // `alternates: {}` bilinçli: vermezsek `[locale]/layout.tsx`'in
    // `canonical: /${loc}` + hreflang üçlüsü miras kalır ve 404, ana sayfayı
    // kanonik gösterir (denetim T-15). 404'ün kendi kanonik hedefi yok.
    alternates: {},
  };
}

const COPY = {
  tr: {
    eyebrow: "404",
    title: "Bu adreste bir sayfa yok.",
    lede: "Bağlantı eski olabilir ya da adres yanlış yazılmış olabilir. Aradığınız içerik büyük olasılıkla aşağıdaki başlıklardan birinde duruyor.",
    home: "Anasayfaya dön",
    heading: "Buradan devam edin",
    links: [
      {
        href: "/tr/hizmetler",
        label: "Hizmetler",
        note: "On iki hizmet, üç disiplin altında toplanmış.",
      },
      {
        href: "/tr/vakalar",
        label: "Vakalar",
        note: "Yapılan işler; yöntemi ve ölçülen sonucuyla.",
      },
      {
        href: "/tr/yazilar",
        label: "Bilgi Kütüphanesi",
        note: "Yöntemi tek tek anlatan yazılar.",
      },
      {
        href: "/tr/iletisim",
        label: "İletişim",
        note: "Sorunuzu doğrudan sorun; 24 saat içinde dönüyoruz.",
      },
    ],
  },
  en: {
    eyebrow: "404",
    title: "There is no page at this address.",
    lede: "The link may be outdated, or the address may be mistyped. What you are looking for is most likely under one of the headings below.",
    home: "Back to home",
    heading: "Continue from here",
    links: [
      {
        href: "/en/services",
        label: "Services",
        note: "Twelve services, grouped under three disciplines.",
      },
      {
        href: "/en/case-studies",
        label: "Case studies",
        note: "The work, with its method and its measured result.",
      },
      {
        href: "/en/articles",
        label: "Knowledge Library",
        note: "Writing that explains the method, one piece at a time.",
      },
      {
        href: "/en/contact",
        label: "Contact",
        note: "Ask directly; we answer within 24 hours.",
      },
    ],
  },
} as const;

export default async function LocaleNotFound() {
  const locale = (await getLocale()) as Locale;
  const t = COPY[locale] ?? COPY.tr;
  const home = locale === "en" ? "/en" : "/tr";

  return (
    <>
      <V2PageHeader eyebrow={t.eyebrow} title={t.title} lede={t.lede} />

      <section className="v2-surface">
        <div className="ds-container py-24 md:py-32">
          <h2 className="typography-label uppercase tracking-widest text-ink-500">
            {t.heading}
          </h2>

          <nav aria-label={t.heading}>
            <ul className="mt-8 grid grid-cols-1 gap-px md:grid-cols-2 v2-surface-2 border border-surface-2 rounded-2xl overflow-hidden">
              {t.links.map((link) => (
                <li key={link.href} className="v2-surface">
                  <Link
                    href={link.href}
                    className="group block h-full p-8 transition-colors hover:bg-white/60"
                  >
                    <span className="typography-h3 block text-ink-900 group-hover:text-brand-800 transition-colors">
                      {link.label}
                    </span>
                    <span className="typography-body mt-3 block max-w-[36ch] text-ink-600">
                      {link.note}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-10">
            <Link href={home} className="v2-btn v2-btn-primary">
              {t.home}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
