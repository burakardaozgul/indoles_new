import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["tr", "en"],
  defaultLocale: "tr",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/hizmetler": { tr: "/hizmetler", en: "/services" },
    "/hizmetler/[slug]": { tr: "/hizmetler/[slug]", en: "/services/[slug]" },
    "/paketler": { tr: "/paketler", en: "/packages" },
    "/paketler/[slug]": { tr: "/paketler/[slug]", en: "/packages/[slug]" },
    "/vakalar": { tr: "/vakalar", en: "/case-studies" },
    "/vakalar/[slug]": { tr: "/vakalar/[slug]", en: "/case-studies/[slug]" },
    "/yazilar": { tr: "/yazilar", en: "/articles" },
    "/yazilar/[slug]": { tr: "/yazilar/[slug]", en: "/articles/[slug]" },
    "/danismanlar": { tr: "/danismanlar", en: "/consultants" },
    "/danismanlar/[slug]": {
      tr: "/danismanlar/[slug]",
      en: "/consultants/[slug]",
    },
    "/iletisim": { tr: "/iletisim", en: "/contact" },
    "/hakkimizda": { tr: "/hakkimizda", en: "/about" },
    // Yasal sayfa `pathnames`'te yoktu: EN'de `/en/gizlilik-kvkk` olarak
    // yayınlanıyor ve sitemap'e hiç girmiyordu. Migrasyonla birlikte eklendi.
    "/gizlilik-kvkk": { tr: "/gizlilik-kvkk", en: "/privacy" },
  },
});

export type Locale = (typeof routing.locales)[number];
