import { describe, it, expect } from "vitest";
import {
  auditHtml,
  profileFor,
  PROFILE_RULES,
  type Expectations,
  type Finding,
  type PageProfile,
} from "@/lib/seo/audit";

const SELF = "/tr/hizmetler/performans-pazarlama";
const SELF_ABS = `https://indoles.com.tr${SELF}`;
const EN_ABS = "https://indoles.com.tr/en/services/performance-marketing";

const EXPECT: Expectations = {
  profile: "service",
  pageUrl: SELF,
  locale: "tr",
  entities: ["INDOLES", "performans pazarlama"],
  minInternalLinks: 6,
  minSiblingLinks: 3,
  siblingHrefs: [
    "/tr/hizmetler/cro",
    "/tr/hizmetler/marka-stratejisi",
    "/tr/hizmetler/e-ticaret",
  ],
  // Fixture gövdesi kasten kısa tutuluyor; kelime eşiği kendi bloğunda ölçülür.
  minWords: 0,
};

/**
 * Her profilin zorunlu düğümünü kapsayan graf — tek fixture ile profil matrisi
 * denenebilsin diye birleşik tutuluyor.
 */
const VALID_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", name: "INDOLES" },
    { "@type": "BreadcrumbList", itemListElement: [] },
    { "@type": "Service", name: "Performans pazarlama" },
    { "@type": "FAQPage", mainEntity: [] },
    { "@type": "Article", headline: "Kanal ekonomisi" },
    { "@type": "Person", name: "Burak Arda Özgül" },
  ],
});

type PageOverrides = {
  title?: string;
  description?: string;
  canonical?: string | null;
  alternates?: Array<[string, string]> | null;
  jsonLd?: string | null;
  body?: string;
  htmlLang?: string;
  ogImage?: string | null;
  twitterCard?: string | null;
  twitterImage?: string | null;
  robots?: string | null;
  /** Metadata etiketlerini `<head>` yerine `<body>`ye bas — T-01 senaryosu. */
  metaInBody?: boolean;
};

function page(o: PageOverrides = {}) {
  const d = {
    title: "Performans pazarlama — INDOLES",
    description: "x".repeat(120),
    canonical: SELF_ABS,
    alternates: [
      ["tr", SELF_ABS],
      ["en", EN_ABS],
      ["x-default", SELF_ABS],
    ] as Array<[string, string]>,
    jsonLd: VALID_LD,
    htmlLang: "tr",
    ogImage: "https://indoles.com.tr/opengraph-image",
    twitterCard: "summary_large_image",
    twitterImage: "https://indoles.com.tr/opengraph-image",
    robots: null as string | null,
    body: [
      "/tr/hizmetler/cro",
      "/tr/hizmetler/marka-stratejisi",
      "/tr/hizmetler/e-ticaret",
      "/tr/paketler/buyume-sprinti",
      "/tr/vakalar/ornek",
      "/tr/iletisim",
    ]
      .map((h) => `<a href="${h}">bağlantı</a>`)
      .join(""),
    ...o,
  };

  const meta = [
    `<title>${d.title}</title>`,
    `<meta name="description" content="${d.description}">`,
    d.canonical === null ? "" : `<link rel="canonical" href="${d.canonical}">`,
    ...(d.alternates ?? []).map(
      ([lang, href]) =>
        `<link rel="alternate" hrefLang="${lang}" href="${href}">`,
    ),
    d.ogImage === null
      ? ""
      : `<meta property="og:image" content="${d.ogImage}">`,
    d.twitterCard === null
      ? ""
      : `<meta name="twitter:card" content="${d.twitterCard}">`,
    d.twitterImage === null
      ? ""
      : `<meta name="twitter:image" content="${d.twitterImage}">`,
    d.robots === null ? "" : `<meta name="robots" content="${d.robots}">`,
  ].join("\n    ");

  const ldTag = d.jsonLd
    ? `<script type="application/ld+json">${d.jsonLd}</script>`
    : "";

  return `<!doctype html><html lang="${d.htmlLang}"><head>
    <meta charset="utf-8">
    ${d.metaInBody ? "" : meta}
    ${ldTag}
  </head><body>
    <main>
      <h1>Performans pazarlama</h1>
      <p>INDOLES performans pazarlama ekibi kanal ekonomisi kurar.</p>
      ${d.body}
      ${d.metaInBody ? meta : ""}
    </main>
  </body></html>`;
}

const rules = (f: Finding[]) => f.map((x) => x.rule);
const audit = (html: string, over: Partial<Expectations> = {}) =>
  auditHtml(html, { ...EXPECT, ...over });

// `exactOptionalPropertyTypes` açık: bir alanı "profil varsayılanına bırak"
// demek onu `undefined` geçmek değil, nesneden çıkarmaktır.
const { minWords: _mw, ...WITHOUT_MIN_WORDS } = EXPECT;
const { locale: _loc, ...WITHOUT_LOCALE } = EXPECT;
const {
  minInternalLinks: _mil,
  entities: _ent,
  ...PROFILE_BASE
} = EXPECT;

/** Hizmete özgü beklentileri düşürüp verilen profile geçer. */
const forProfile = (
  profile: PageProfile,
  over: Partial<Expectations> = {},
): Expectations => ({ ...PROFILE_BASE, profile, ...over });

const ALL_PROFILES = Object.keys(PROFILE_RULES) as PageProfile[];

describe("auditHtml — temiz sayfa", () => {
  it("kusursuz sayfada hiç bulgu üretmez", () => {
    expect(audit(page())).toEqual([]);
  });

  it.each(ALL_PROFILES)("%s profilinde de temiz geçer", (profile) => {
    expect(rules(auditHtml(page(), forProfile(profile)))).toEqual([]);
  });
});

describe("auditHtml — başlık yapısı", () => {
  it("iki h1'i yakalar", () => {
    const html = page({ body: "<h1>ikinci</h1>" });
    expect(rules(audit(html))).toContain("h1-count");
  });

  it("h1 yokluğunu yakalar", () => {
    const html = page().replace(/<h1>.*?<\/h1>/, "");
    expect(rules(audit(html))).toContain("h1-count");
  });

  it("h2 atlayıp h4'e geçen sırayı yakalar", () => {
    const html = page({ body: "<h2>A</h2><h4>B</h4>" });
    expect(rules(audit(html))).toContain("heading-order");
  });

  it("h2 → h3 sırasını sorun saymaz", () => {
    const html = page({ body: "<h2>A</h2><h3>B</h3>" });
    expect(rules(audit(html))).not.toContain("heading-order");
  });
});

describe("auditHtml — metadata konumu (head-placement)", () => {
  it("<body>'ye basılmış metadata'yı yakalar", () => {
    // T-01: etiketlerin içeriği doğruydu, konumu yanlıştı — eski araç
    // tüm dokümanı tarayıp 24/24 PASS vermişti.
    const f = audit(page({ metaInBody: true }));
    expect(rules(f)).toContain("head-placement");
    const detail = f.find((x) => x.rule === "head-placement")!.detail;
    for (const tag of [
      "<title>",
      "meta[name=description]",
      "link[rel=canonical]",
      "meta[property^=og:]",
    ]) {
      expect(detail).toContain(tag);
    }
  });

  it("konum hatası başka kuralı tetiklemez — içerik hâlâ doğru", () => {
    expect(rules(audit(page({ metaInBody: true })))).toEqual([
      "head-placement",
    ]);
  });

  it("etiketler <head>'deyken sessiz", () => {
    expect(rules(audit(page()))).not.toContain("head-placement");
  });
});

describe("auditHtml — meta", () => {
  it("60 karakteri aşan title'ı yakalar", () => {
    expect(rules(audit(page({ title: "x".repeat(75) })))).toContain(
      "title-length",
    );
  });

  it("boş title'ı yakalar", () => {
    expect(rules(audit(page({ title: "" })))).toContain("title-length");
  });

  it("makale profilinde 61-109 karakterlik bugünkü başlıkları yakalar", () => {
    // docs/17 §3: makale başlıkları bugün 61-109 karakter.
    for (const len of [61, 85, 109]) {
      const f = auditHtml(page({ title: "x".repeat(len) }), forProfile("article"));
      expect(rules(f)).toContain("title-length");
    }
  });

  it("160 karakteri aşan description'ı yakalar", () => {
    expect(rules(audit(page({ description: "x".repeat(200) })))).toContain(
      "description-length",
    );
  });

  it("vaka profilinde 185-399 karakterlik bugünkü açıklamaları yakalar", () => {
    for (const len of [185, 399]) {
      const f = auditHtml(page({ description: "x".repeat(len) }), forProfile("case"));
      expect(rules(f)).toContain("description-length");
    }
  });

  it("80 karakterden kısa description'ı yakalar", () => {
    expect(rules(audit(page({ description: "kısa" })))).toContain(
      "description-length",
    );
  });

  it("eksik canonical'ı yakalar", () => {
    expect(rules(audit(page({ canonical: null })))).toContain("canonical");
  });

  it("href'i boş canonical'ı yakalar", () => {
    expect(rules(audit(page({ canonical: "" })))).toContain("canonical");
  });
});

describe("auditHtml — canonical-self", () => {
  it("ana sayfayı gösteren canonical'ı yakalar", () => {
    // 12 URL bugün ana sayfayı kanonik gösteriyordu; eski kural yalnız
    // etiketin varlığına baktığı için hepsi PASS almıştı (T-02).
    const f = audit(page({ canonical: "https://indoles.com.tr/tr" }));
    expect(rules(f)).toContain("canonical-self");
    expect(f.find((x) => x.rule === "canonical-self")!.detail).toContain("/tr");
  });

  it("host farkını ihlal saymaz — lokal denetimde canonical production host'u", () => {
    const f = auditHtml(page(), { ...EXPECT, pageUrl: `http://localhost:3000${SELF}` });
    expect(rules(f)).not.toContain("canonical-self");
  });

  it("sondaki slash farkını ihlal saymaz", () => {
    const f = audit(page({ canonical: `${SELF_ABS}/` }));
    expect(rules(f)).not.toContain("canonical-self");
  });
});

describe("auditHtml — hreflang", () => {
  it("eksik x-default hreflang'i yakalar", () => {
    const f = audit(
      page({
        alternates: [
          ["tr", SELF_ABS],
          ["en", EN_ABS],
        ],
      }),
    );
    expect(rules(f)).toContain("hreflang");
  });

  it("href'i boş hreflang'i yakalar", () => {
    const f = audit(
      page({
        alternates: [
          ["tr", SELF_ABS],
          ["en", ""],
          ["x-default", SELF_ABS],
        ],
      }),
    );
    expect(rules(f)).toContain("hreflang-reciprocal");
  });

  it("TR'yi göstermeyen x-default'u yakalar", () => {
    const f = audit(
      page({
        alternates: [
          ["tr", SELF_ABS],
          ["en", EN_ABS],
          ["x-default", EN_ABS],
        ],
      }),
    );
    expect(rules(f)).toContain("hreflang-reciprocal");
  });

  it("kendi dilini başka sayfaya bağlayan hreflang'i yakalar", () => {
    const f = audit(
      page({
        alternates: [
          ["tr", "https://indoles.com.tr/tr"],
          ["en", EN_ABS],
          ["x-default", "https://indoles.com.tr/tr"],
        ],
      }),
    );
    expect(rules(f)).toContain("hreflang-reciprocal");
  });
});

describe("auditHtml — sosyal görsel", () => {
  it("og:image yokluğunu yakalar", () => {
    // Bugün hiçbir sayfada og:image yoktu; kural bile tanımlı değildi (T-03).
    expect(rules(audit(page({ ogImage: null })))).toContain("og-image");
  });

  it("summary_large_image kartında eksik twitter:image'ı yakalar", () => {
    expect(rules(audit(page({ twitterImage: null })))).toContain("og-image");
  });

  it("summary kartında twitter:image aramaz", () => {
    const f = audit(page({ twitterCard: "summary", twitterImage: null }));
    expect(rules(f)).not.toContain("og-image");
  });
});

describe("auditHtml — indekslenebilirlik", () => {
  it("noindex sızıntısını yakalar", () => {
    // Yanlış NEXT_PUBLIC_APP_STAGE ile tüm site noindex çıkıyordu; eski araç
    // 24/24 PASS verirdi (LG-02).
    expect(rules(audit(page({ robots: "noindex, nofollow" })))).toContain(
      "robots-meta",
    );
  });

  it("preview denetiminde noindex beklenir", () => {
    const f = audit(page({ robots: "noindex, nofollow" }), {
      allowNoindex: true,
    });
    expect(rules(f)).not.toContain("robots-meta");
  });

  it("yasal metinde bilinçli noindex ihlal değil", () => {
    // `/tr/gizlilik-kvkk` ve `/en/privacy` bilerek `index: false, follow: true`
    // alıyor (gizlilik-kvkk/page.tsx generateMetadata).
    const f = auditHtml(page({ robots: "noindex, follow" }), forProfile("legal"));
    expect(rules(f)).not.toContain("robots-meta");
  });

  it("static profilinde noindex hâlâ ihlal — gevşeme yalnız legal'de", () => {
    const f = auditHtml(page({ robots: "noindex, follow" }), forProfile("static"));
    expect(rules(f)).toContain("robots-meta");
  });

  it("index,follow'u sorun saymaz", () => {
    expect(rules(audit(page({ robots: "index, follow" })))).not.toContain(
      "robots-meta",
    );
  });
});

describe("auditHtml — html lang", () => {
  it("locale ile uyuşmayan lang'i yakalar", () => {
    expect(rules(audit(page({ htmlLang: "en" })))).toContain("html-lang");
  });

  it("eksik lang'i yakalar", () => {
    const html = page().replace(' lang="tr"', "");
    expect(rules(audit(html))).toContain("html-lang");
  });

  it("bölgeli etiketi (tr-TR) kabul eder", () => {
    expect(rules(audit(page({ htmlLang: "tr-TR" })))).not.toContain("html-lang");
  });

  it("locale'i pageUrl'den türetir", () => {
    const f = auditHtml(page({ htmlLang: "en" }), {
      ...WITHOUT_LOCALE,
      pageUrl: "/en/services/performance-marketing",
      // EN sayfasında TR fixture'ının canonical/hreflang'i doğal olarak şaşar;
      // burada yalnız html-lang ilgilendiriyor.
    });
    expect(rules(f)).not.toContain("html-lang");
  });
});

describe("auditHtml — JSON-LD", () => {
  it("geçersiz JSON-LD'yi yakalar", () => {
    expect(rules(audit(page({ jsonLd: "{bozuk" })))).toContain("json-ld-parse");
  });

  it("eksik Service düğümünü yakalar", () => {
    const partial = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "Organization" },
        { "@type": "BreadcrumbList" },
        { "@type": "FAQPage" },
      ],
    });
    const f = audit(page({ jsonLd: partial }));
    expect(rules(f)).toContain("json-ld-types");
    expect(f.find((x) => x.rule === "json-ld-types")!.detail).toContain(
      "Service",
    );
  });

  it("JSON-LD hiç yoksa yakalar", () => {
    expect(rules(audit(page({ jsonLd: null })))).toContain("json-ld-types");
  });

  it("profil başına farklı düğüm bekler — statik sayfada Service aranmaz", () => {
    const orgOnly = JSON.stringify({ "@type": "Organization" });
    const f = auditHtml(page({ jsonLd: orgOnly }), forProfile("static"));
    expect(rules(f)).not.toContain("json-ld-types");
  });

  it("ProfessionalService Organization gereksinimini karşılar", () => {
    // `/tr/iletisim` ve `/en/contact` `professionalServiceLd()` basıyor: düğüm
    // `organizationLd()`i genişletiyor ve aynı `@id`yi taşıyor, yani
    // organizasyon varlığı grafikte var — yalnız tipi daha özgül.
    const contactLd = JSON.stringify({
      "@graph": [
        { "@type": "ProfessionalService", "@id": "https://indoles.com.tr/#organization" },
        { "@type": "BreadcrumbList" },
      ],
    });
    const f = auditHtml(page({ jsonLd: contactLd }), forProfile("static"));
    expect(rules(f)).not.toContain("json-ld-types");
  });

  it("LocalBusiness da Organization yerine geçer", () => {
    const ld = JSON.stringify({ "@type": "LocalBusiness" });
    const f = auditHtml(page({ jsonLd: ld }), forProfile("static"));
    expect(rules(f)).not.toContain("json-ld-types");
  });

  it("ilgisiz bir tip Organization yerine geçmez", () => {
    // Gevşemenin sınırı: yalnız Organization alt tipleri sayılır.
    const ld = JSON.stringify({ "@type": "WebPage" });
    const f = auditHtml(page({ jsonLd: ld }), forProfile("static"));
    expect(rules(f)).toContain("json-ld-types");
  });

  it("alt tip yalnız kendi gereksinimini karşılar — Service hâlâ aranır", () => {
    const ld = JSON.stringify({
      "@graph": [{ "@type": "ProfessionalService" }, { "@type": "BreadcrumbList" }],
    });
    const f = auditHtml(page({ jsonLd: ld }), forProfile("pillar"));
    expect(f.find((x) => x.rule === "json-ld-types")!.detail).toContain(
      "Service",
    );
  });

  it("vaka profilinde Article bekler", () => {
    const noArticle = JSON.stringify({
      "@graph": [{ "@type": "Organization" }, { "@type": "BreadcrumbList" }],
    });
    const f = auditHtml(page({ jsonLd: noArticle }), forProfile("case"));
    expect(f.find((x) => x.rule === "json-ld-types")!.detail).toContain(
      "Article",
    );
  });
});

describe("auditHtml — GEO", () => {
  it("metinde geçmeyen varlığı yakalar", () => {
    const f = audit(page(), { entities: ["INDOLES", "iş zekası"] });
    expect(f.find((x) => x.rule === "entities")!.detail).toContain("iş zekası");
  });

  it("varlık listesi boşsa kuralı atlar", () => {
    expect(rules(audit(page(), { entities: [] }))).not.toContain("entities");
  });
});

describe("auditHtml — persona profil matrisi", () => {
  const html = page({
    body: '<span data-persona-variant="commerce">CAC düşer</span>',
  });

  it("hizmet detayına sızmış persona metnini yakalar", () => {
    // Hizmet detay tek sesli (ADR-018 karar 2); bir bileşen sessizce
    // PersonaText kullanırsa metin ikiye katlanır ve FAQPage şeması görünen
    // metinle ayrışır.
    expect(rules(audit(html))).toContain("persona-leak");
  });

  it("ana sayfa ve liste sayfalarında persona varyantı ihlal değil", () => {
    // globals.css persona merceği: `index` profili iki varyantı da basar.
    const f = auditHtml(html, forProfile("index"));
    expect(rules(f)).not.toContain("persona-leak");
  });

  it("paket detayında persona varyantı ihlal değil", () => {
    const f = auditHtml(html, forProfile("package"));
    expect(rules(f)).not.toContain("persona-leak");
  });

  it("pillar sayfasında persona varyantı ihlal değil", () => {
    // `pillar-detail.tsx` üç yerde `PersonaText` kullanıyor, `pillars.ts` her
    // pillar için `industrial:` metni taşıyor — pillar seçim katmanı, kasıtlı
    // persona-aware. Altı pillar URL'i bu yüzden FAIL veriyordu.
    const f = auditHtml(html, forProfile("pillar"));
    expect(rules(f)).not.toContain("persona-leak");
  });

  it("hizmet detayında persona hâlâ ihlal — pillar gevşemesi oraya sızmaz", () => {
    // Kalibrasyonun sınırı: ADR-018 karar 2 yalnız hizmet detayını bağlar.
    expect(rules(auditHtml(html, forProfile("service")))).toContain(
      "persona-leak",
    );
  });

  it.each(ALL_PROFILES)("%s profili matriste tanımlı davranır", (profile) => {
    const f = auditHtml(html, forProfile(profile));
    const leaked = rules(f).includes("persona-leak");
    expect(leaked).toBe(PROFILE_RULES[profile].personaVariants === "forbidden");
  });
});

describe("auditHtml — içerik hacmi", () => {
  it("ince hizmet sayfasını uyarı olarak işaretler", () => {
    const f = auditHtml(page(), WITHOUT_MIN_WORDS);
    const wc = f.find((x) => x.rule === "word-count");
    expect(wc).toBeDefined();
    expect(wc!.level).toBe("warn");
  });

  it("eşiği aşan sayfada uyarı yok", () => {
    const filler = Array.from({ length: 500 }, (_, i) => `kelime${i}`).join(" ");
    const html = page({ body: `<p>${filler}</p>` });
    const f = auditHtml(html, { ...WITHOUT_MIN_WORDS, minInternalLinks: 0 });
    expect(rules(f)).not.toContain("word-count");
  });

  it("minWords: 0 kuralı kapatır", () => {
    expect(rules(audit(page(), { minWords: 0 }))).not.toContain("word-count");
  });
});

describe("auditHtml — bağlantılar ve görseller", () => {
  it("yetersiz iç link sayısını yakalar", () => {
    expect(rules(audit(page({ body: "" })))).toContain("internal-links");
  });

  it("eksik komşu hizmet linklerini yakalar", () => {
    const body = Array.from(
      { length: 6 },
      (_, i) => `<a href="/tr/yazilar/y${i}">yazı</a>`,
    ).join("");
    expect(rules(audit(page({ body })))).toContain("sibling-links");
  });

  it("komşu linki kuralı yalnız hizmet detayında işler", () => {
    const body = Array.from(
      { length: 6 },
      (_, i) => `<a href="/tr/yazilar/y${i}">yazı</a>`,
    ).join("");
    const f = auditHtml(page({ body }), forProfile("article"));
    expect(rules(f)).not.toContain("sibling-links");
  });

  it("alt'sız görseli yakalar", () => {
    expect(rules(audit(page({ body: '<img src="/a.png">' })))).toContain(
      "img-alt",
    );
  });

  it("aria-hidden görselde alt aramaz", () => {
    const html = page({ body: '<img src="/a.png" aria-hidden="true">' });
    expect(rules(audit(html))).not.toContain("img-alt");
  });
});

describe("profileFor — URL kalıbından sayfa tipi", () => {
  const cases: Array<[string, PageProfile]> = [
    ["/tr", "index"],
    ["/en", "index"],
    ["/tr/hizmetler", "index"],
    ["/en/services", "index"],
    ["/tr/hizmetler/growth", "pillar"],
    ["/en/services/transform", "pillar"],
    ["/tr/hizmetler/build", "pillar"],
    ["/tr/hizmetler/performans-pazarlama", "service"],
    ["/en/services/performance-marketing", "service"],
    ["/tr/paketler", "index"],
    ["/tr/paketler/buyume-sprinti", "package"],
    ["/en/packages/growth-sprint", "package"],
    ["/tr/vakalar", "index"],
    ["/tr/vakalar/ornek", "case"],
    ["/en/case-studies/example", "case"],
    ["/tr/yazilar", "index"],
    ["/tr/yazilar/bir-yazi", "article"],
    ["/en/articles/an-article", "article"],
    ["/tr/danismanlar", "index"],
    ["/tr/danismanlar/burak-arda-ozgul", "consultant"],
    ["/en/consultants/burak-arda-ozgul", "consultant"],
    ["/tr/iletisim", "static"],
    ["/en/about", "static"],
    ["/tr/gizlilik-kvkk", "legal"],
    ["/en/privacy", "legal"],
  ];

  it.each(cases)("%s → %s", (path, profile) => {
    expect(profileFor(path)).toBe(profile);
  });

  it("sondaki slash sonucu değiştirmez", () => {
    expect(profileFor("/tr/hizmetler/")).toBe("index");
  });
});
