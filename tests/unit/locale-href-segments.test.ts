import { describe, it, expect } from "vitest";
import {
  LOCALE_SEGMENTS,
  localizedHref,
  segmentKindOf,
  segmentRoot,
  translateSegment,
  type SegmentKind,
  type SegmentLocale,
} from "@/lib/i18n/segments";
import { localeHref } from "@/lib/i18n/locale-href";
import { routing } from "@/lib/i18n/routing";
import { buildAlternates } from "@/lib/seo/alternates";
import { EN_SEGMENT_REDIRECTS } from "@/lib/seo/legacy-redirects";
import { ARTICLES } from "@/lib/content/articles";
import { CASES } from "@/lib/content/cases";
import { SERVICES } from "@/lib/content/services";
import { PACKAGES } from "@/lib/content/packages";
import { BOOKABLE_CONSULTANTS } from "@/lib/content/consultants";
import { publishedTools } from "@/lib/content/tools";
import { PILLARS } from "@/lib/content/pillars";

/**
 * Locale segment sözlüğü ve ondan türeyen href'ler (ADR-039).
 *
 * Bu testin varlık sebebi somut bir regresyon: EN sayfalarda TR segmentli
 * href'ler üretiliyordu (`/en/hizmetler/build`, `/en/danismanlar/mert-kaplan`,
 * `/en/yazilar/<slug>`) ve GSC'de gösterim alıyorlardı. Kaynak, sözlüğün
 * yedi ayrı yerde kopyalanmış olması ve bazı şablonların çeviriyi hiç
 * yapmamasıydı. Sözlük tek kaynağa alındı; bu test kaynağın tutarlılığını ve
 * her içerik kaydının iki dildeki yolunun sözlüğe uyduğunu denetler.
 */

const LOCALES: SegmentLocale[] = ["tr", "en"];
const KINDS = Object.keys(LOCALE_SEGMENTS) as SegmentKind[];

/** TR segmentlerinin tamamı — EN yolda hiçbiri görünmemeli. */
const TR_SEGMENTS = KINDS.map((k) => LOCALE_SEGMENTS[k].tr);

describe("segment sözlüğü", () => {
  it("her türün TR ve EN yazımı farklıdır", () => {
    // Aynı olsaydı `EN_SEGMENT_REDIRECTS` kendine yönlendiren bir kural
    // üretir, Next de sonsuz döngü sayardı.
    for (const kind of KINDS) {
      const pair = LOCALE_SEGMENTS[kind];
      expect(pair.tr, kind).not.toBe(pair.en);
    }
  });

  it("hiçbir segment yazımı iki türde birden geçmez", () => {
    const all = KINDS.flatMap((k) => [
      LOCALE_SEGMENTS[k].tr,
      LOCALE_SEGMENTS[k].en,
    ]);
    expect(new Set(all).size).toBe(all.length);
  });

  it("ters arama her iki dilin yazımını tanır", () => {
    for (const kind of KINDS) {
      expect(segmentKindOf(LOCALE_SEGMENTS[kind].tr)).toBe(kind);
      expect(segmentKindOf(LOCALE_SEGMENTS[kind].en)).toBe(kind);
    }
    expect(segmentKindOf("rezervasyon")).toBeNull();
  });

  it("sözlükte olmayan segment çevrilmeden geçer", () => {
    expect(translateSegment("rezervasyon", "en")).toBe("rezervasyon");
    expect(translateSegment("v2", "tr")).toBe("v2");
  });

  it("localizedHref locale ön ekini ve segmenti birlikte kurar", () => {
    expect(localizedHref("en", "services", "build")).toBe("/en/services/build");
    expect(localizedHref("tr", "cases", "gymwolves-12-kat-satis")).toBe(
      "/tr/vakalar/gymwolves-12-kat-satis"
    );
    expect(segmentRoot("en", "cases")).toBe("/en/case-studies");
    expect(
      localizedHref("en", "tools", "geo-visibility-checker", "result", "42")
    ).toBe("/en/tools/geo-visibility-checker/result/42");
  });
});

describe("routing.pathnames sözlükten türer", () => {
  const pathnames = routing.pathnames as Record<
    string,
    string | Record<SegmentLocale, string>
  >;

  it("her yol çiftinin ilk segmenti sözlükteki karşılığıdır", () => {
    for (const [key, value] of Object.entries(pathnames)) {
      if (typeof value === "string") continue;
      const trHead = value.tr.split("/")[1]!;
      const enHead = value.en.split("/")[1]!;
      const kind = segmentKindOf(trHead);
      expect(kind, key).not.toBeNull();
      expect(LOCALE_SEGMENTS[kind!].tr, key).toBe(trHead);
      expect(LOCALE_SEGMENTS[kind!].en, key).toBe(enHead);
    }
  });

  it("localeHref ile pathnames ilk segmentte aynı çeviriyi verir", () => {
    // `localeHref` bilinçli olarak YALNIZ ilk segmenti çevirir: araç
    // slug'ları (`geo-gorunurluk-denetleyicisi` ↔ `geo-visibility-checker`)
    // bir sözlük maddesi değil, `pathnames`teki tam-yol çiftidir ve doğru
    // karşılığı sayfanın kendi hreflang alternate'i beyan eder.
    for (const value of Object.values(pathnames)) {
      if (typeof value === "string") continue;
      expect(localeHref(value.tr, "en").split("/").slice(0, 3).join("/")).toBe(
        `/en/${value.en.split("/")[1]}`
      );
      expect(localeHref(value.en, "tr").split("/").slice(0, 3).join("/")).toBe(
        `/tr/${value.tr.split("/")[1]}`
      );
    }
  });
});

/**
 * Her içerik kaydının iki dildeki yolu + hreflang çifti.
 *
 * `kind` sözlük anahtarı, `slug` locale başına slug. Danışman ve pillar
 * kayıtlarının slug'ı locale'den bağımsızdır (ad ve anahtar) — ikisi de
 * aynı kuralla geçer.
 */
type Record2 = {
  label: string;
  kind: SegmentKind;
  slug: Record<SegmentLocale, string>;
};

const RECORDS: Record2[] = [
  ...SERVICES.map((s) => ({
    label: `hizmet ${s.slug.tr}`,
    kind: "services" as const,
    slug: { tr: s.slug.tr, en: s.slug.en },
  })),
  ...PILLARS.map((p) => ({
    label: `pillar ${p.key}`,
    kind: "services" as const,
    slug: { tr: p.key, en: p.key },
  })),
  ...PACKAGES.map((p) => ({
    label: `paket ${p.slug.tr}`,
    kind: "packages" as const,
    slug: { tr: p.slug.tr, en: p.slug.en },
  })),
  ...CASES.map((c) => ({
    label: `vaka ${c.slug.tr}`,
    kind: "cases" as const,
    slug: { tr: c.slug.tr, en: c.slug.en },
  })),
  ...ARTICLES.map((a) => ({
    label: `yazı ${a.slug.tr}`,
    kind: "articles" as const,
    slug: { tr: a.slug.tr, en: a.slug.en },
  })),
  ...publishedTools().map((t) => ({
    label: `araç ${t.slug.tr}`,
    kind: "tools" as const,
    slug: { tr: t.slug.tr, en: t.slug.en },
  })),
  ...BOOKABLE_CONSULTANTS.map((c) => ({
    label: `danışman ${c.slug}`,
    kind: "consultants" as const,
    slug: { tr: c.slug, en: c.slug },
  })),
];

describe("içerik kayıtlarının iki dilli href'leri", () => {
  it("kayıt havuzu boş değil", () => {
    expect(RECORDS.length).toBeGreaterThan(50);
  });

  it.each(RECORDS.map((r) => [r.label, r] as const))(
    "%s — her iki yol da kendi dilinin segmentini taşır",
    (_label, record) => {
      for (const locale of LOCALES) {
        const href = localizedHref(locale, record.kind, record.slug[locale]);
        expect(href).toBe(
          `/${locale}/${LOCALE_SEGMENTS[record.kind][locale]}/${record.slug[locale]}`
        );
      }
    }
  );

  it.each(RECORDS.map((r) => [r.label, r] as const))(
    "%s — EN yolunda hiçbir TR segmenti geçmez",
    (_label, record) => {
      const enHref = localizedHref("en", record.kind, record.slug.en);
      const head = enHref.split("/")[2]!;
      expect(TR_SEGMENTS).not.toContain(head);
    }
  );

  it.each(RECORDS.map((r) => [r.label, r] as const))(
    "%s — hreflang alternatifi karşı dilin doğru slug'ını gösterir",
    (_label, record) => {
      const paths = {
        tr: localizedHref("tr", record.kind, record.slug.tr),
        en: localizedHref("en", record.kind, record.slug.en),
      };
      for (const locale of LOCALES) {
        const alternates = buildAlternates(paths, locale);
        const languages = alternates.languages!;
        expect(alternates.canonical).toBe(paths[locale]);
        expect(languages.tr).toBe(paths.tr);
        expect(languages.en).toBe(paths.en);
        // x-default TR'yi gösterir (docs/08 §3) — birincil pazar.
        expect(languages["x-default"]).toBe(paths.tr);
      }
      // Karşı dilin yolu gerçekten karşı dilin slug'ını taşır: aynı slug iki
      // dilde de geçerliyse (danışman, pillar) bu zaten sağlanır.
      expect(paths.en.endsWith(`/${record.slug.en}`)).toBe(true);
      expect(paths.tr.endsWith(`/${record.slug.tr}`)).toBe(true);
    }
  );
});

describe("EN_SEGMENT_REDIRECTS", () => {
  it("her TR segmenti için bir kalıcı kural üretir", () => {
    for (const kind of KINDS) {
      const pair = LOCALE_SEGMENTS[kind];
      const rule = EN_SEGMENT_REDIRECTS.find(
        (r) => r.source === `/en/${pair.tr}/:path*`
      );
      expect(rule, kind).toBeTruthy();
      expect(rule!.destination).toBe(`/en/${pair.en}/:path*`);
      // 308 — 307 Google'a imza olmuyor, eski adres indekste kalıyordu.
      expect(rule!.permanent).toBe(true);
    }
  });

  it("hiçbir kural kendine yönlendirmez", () => {
    for (const rule of EN_SEGMENT_REDIRECTS) {
      expect(rule.source, rule.source).not.toBe(rule.destination);
    }
  });

  it("araç slug'ı joker kuraldan önce gelir", () => {
    const toolsWildcard = EN_SEGMENT_REDIRECTS.findIndex(
      (r) => r.source === `/en/${LOCALE_SEGMENTS.tools.tr}/:path*`
    );
    const geoRule = EN_SEGMENT_REDIRECTS.findIndex((r) =>
      r.source.includes("geo-gorunurluk-denetleyicisi")
    );
    expect(geoRule).toBeGreaterThanOrEqual(0);
    expect(geoRule).toBeLessThan(toolsWildcard);
  });
});
