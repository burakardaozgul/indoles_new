import Link from "next/link";
import { getLocale } from "next-intl/server";
import { V2PageHeader } from "@/components/v2/chrome/V2PageHeader";
import type { Locale } from "@/lib/content/types";

/**
 * Locale içindeki 404 — marka chrome'unun (nav + footer) içinde.
 *
 * Kök `src/app/not-found.tsx` duruyor ve duracak: locale dışı yollar
 * (`/olmayan-sey`, metadata rotaları) oraya düşüyor. Bu dosya yalnız
 * `/tr/*` ve `/en/*` altındaki 404'leri karşılar.
 *
 * Gerekçe kurtarma: `next.config.ts` politikası gereği karşılığı olmayan eski
 * URL'ler bilinçli olarak 404'e düşüyor (denetim T-06/T-08). O hâlde 404 bir
 * çıkmaz değil, dış bağlantıdan gelen okuru siteye bağlayan yüzeydir — dört
 * ana bölüme buradan girilir.
 *
 * Metin dilini `getLocale()` verir: Next.js `not-found.tsx`'e `params`
 * geçirmiyor. Değer, 404'ü fırlatan sayfanın `setRequestLocale` çağrısından
 * gelir (yakalayıcı rota dahil), yoksa `routing.defaultLocale`'e düşer.
 */

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
