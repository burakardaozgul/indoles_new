import { defineRouting } from "next-intl/routing";
import { LOCALE_SEGMENTS as S } from "./segments";

/**
 * Segment adları `segments.ts`ten gelir (ADR-039) — tablo artık sözlüğün
 * ikinci bir kopyası değil, türevi. `as const` sayesinde değerler literal
 * kalır; next-intl'in `Link href` çıkarımı buna dayanıyor.
 */
export const routing = defineRouting({
  locales: ["tr", "en"],
  defaultLocale: "tr",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/hizmetler": { tr: `/${S.services.tr}`, en: `/${S.services.en}` },
    "/hizmetler/[slug]": {
      tr: `/${S.services.tr}/[slug]`,
      en: `/${S.services.en}/[slug]`,
    },
    "/paketler": { tr: `/${S.packages.tr}`, en: `/${S.packages.en}` },
    "/paketler/[slug]": {
      tr: `/${S.packages.tr}/[slug]`,
      en: `/${S.packages.en}/[slug]`,
    },
    "/vakalar": { tr: `/${S.cases.tr}`, en: `/${S.cases.en}` },
    "/vakalar/[slug]": {
      tr: `/${S.cases.tr}/[slug]`,
      en: `/${S.cases.en}/[slug]`,
    },
    "/yazilar": { tr: `/${S.articles.tr}`, en: `/${S.articles.en}` },
    "/yazilar/[slug]": {
      tr: `/${S.articles.tr}/[slug]`,
      en: `/${S.articles.en}/[slug]`,
    },
    // Araçlar ailesi — next-intl dinamik segment DEĞERİNİ çevirmez, bu yüzden
    // her araç için tam-yol çifti STATİK yazılır (dinamik `[id]` aynen taşınır).
    "/araclar": { tr: `/${S.tools.tr}`, en: `/${S.tools.en}` },
    "/araclar/geo-gorunurluk-denetleyicisi": {
      tr: `/${S.tools.tr}/geo-gorunurluk-denetleyicisi`,
      en: `/${S.tools.en}/geo-visibility-checker`,
    },
    "/araclar/geo-gorunurluk-denetleyicisi/sonuc/[id]": {
      tr: `/${S.tools.tr}/geo-gorunurluk-denetleyicisi/sonuc/[id]`,
      en: `/${S.tools.en}/geo-visibility-checker/result/[id]`,
    },
    "/araclar/diagnoo": {
      tr: `/${S.tools.tr}/diagnoo`,
      en: `/${S.tools.en}/diagnoo`,
    },
    "/araclar/diagnoo/rapor/[id]": {
      tr: `/${S.tools.tr}/diagnoo/rapor/[id]`,
      en: `/${S.tools.en}/diagnoo/report/[id]`,
    },
    "/danismanlar": { tr: `/${S.consultants.tr}`, en: `/${S.consultants.en}` },
    "/danismanlar/[slug]": {
      tr: `/${S.consultants.tr}/[slug]`,
      en: `/${S.consultants.en}/[slug]`,
    },
    "/iletisim": { tr: `/${S.contact.tr}`, en: `/${S.contact.en}` },
    "/hakkimizda": { tr: `/${S.about.tr}`, en: `/${S.about.en}` },
    // Yasal sayfa `pathnames`'te yoktu: EN'de `/en/gizlilik-kvkk` olarak
    // yayınlanıyor ve sitemap'e hiç girmiyordu. Migrasyonla birlikte eklendi.
    "/gizlilik-kvkk": { tr: `/${S.privacy.tr}`, en: `/${S.privacy.en}` },
  },
});

export type Locale = (typeof routing.locales)[number];
