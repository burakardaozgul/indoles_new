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
  },
});

export type Locale = (typeof routing.locales)[number];
