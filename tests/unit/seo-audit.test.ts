import { describe, it, expect } from "vitest";
import { auditHtml, type Expectations } from "@/lib/seo/audit";

const EXPECT: Expectations = {
  entities: ["INDOLES", "performans pazarlama"],
  minInternalLinks: 6,
  minSiblingLinks: 3,
  siblingHrefs: [
    "/tr/hizmetler/cro",
    "/tr/hizmetler/marka-stratejisi",
    "/tr/hizmetler/e-ticaret",
  ],
};

const VALID_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Service", name: "Performans pazarlama" },
    { "@type": "BreadcrumbList", itemListElement: [] },
    { "@type": "FAQPage", mainEntity: [] },
  ],
});

function page(
  overrides: {
    title?: string;
    description?: string;
    h1?: string[];
    jsonLd?: string | null;
    body?: string;
  } = {},
) {
  const d = {
    title: "Performans pazarlama — INDOLES",
    description: "x".repeat(120),
    h1: ["Performans pazarlama"],
    jsonLd: VALID_LD,
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
    ...overrides,
  };

  return `<!doctype html><html lang="tr"><head>
    <title>${d.title}</title>
    <meta name="description" content="${d.description}">
    <link rel="canonical" href="https://indoles.com.tr/tr/hizmetler/performans-pazarlama">
    <link rel="alternate" hrefLang="tr" href="https://indoles.com.tr/tr/hizmetler/performans-pazarlama">
    <link rel="alternate" hrefLang="en" href="https://indoles.com.tr/en/services/performance-marketing">
    <link rel="alternate" hrefLang="x-default" href="https://indoles.com.tr/tr/hizmetler/performans-pazarlama">
    ${d.jsonLd ? `<script type="application/ld+json">${d.jsonLd}</script>` : ""}
  </head><body>
    ${d.h1.map((h) => `<h1>${h}</h1>`).join("")}
    <p>INDOLES performans pazarlama ekibi kanal ekonomisi kurar.</p>
    ${d.body}
  </body></html>`;
}

const rules = (f: Array<{ rule: string }>) => f.map((x) => x.rule);

describe("auditHtml — temiz sayfa", () => {
  it("kusursuz sayfada hiç bulgu üretmez", () => {
    expect(auditHtml(page(), EXPECT)).toEqual([]);
  });
});

describe("auditHtml — başlık yapısı", () => {
  it("iki h1'i yakalar", () => {
    expect(rules(auditHtml(page({ h1: ["A", "B"] }), EXPECT))).toContain(
      "h1-count",
    );
  });

  it("h1 yokluğunu yakalar", () => {
    expect(rules(auditHtml(page({ h1: [] }), EXPECT))).toContain("h1-count");
  });

  it("h2 atlayıp h4'e geçen sırayı yakalar", () => {
    const html = page({ body: "<h2>A</h2><h4>B</h4>" });
    expect(rules(auditHtml(html, EXPECT))).toContain("heading-order");
  });

  it("h2 → h3 sırasını sorun saymaz", () => {
    const html = page({ body: "<h2>A</h2><h3>B</h3>" });
    expect(rules(auditHtml(html, EXPECT))).not.toContain("heading-order");
  });
});

describe("auditHtml — meta", () => {
  it("60 karakteri aşan title'ı yakalar", () => {
    expect(rules(auditHtml(page({ title: "x".repeat(75) }), EXPECT))).toContain(
      "title-length",
    );
  });

  it("160 karakteri aşan description'ı yakalar", () => {
    expect(
      rules(auditHtml(page({ description: "x".repeat(200) }), EXPECT)),
    ).toContain("description-length");
  });

  it("80 karakterden kısa description'ı yakalar", () => {
    expect(
      rules(auditHtml(page({ description: "kısa" }), EXPECT)),
    ).toContain("description-length");
  });

  it("eksik canonical'ı yakalar", () => {
    const html = page().replace(/<link rel="canonical"[^>]*>/, "");
    expect(rules(auditHtml(html, EXPECT))).toContain("canonical");
  });

  it("eksik x-default hreflang'i yakalar", () => {
    const html = page().replace(
      /<link rel="alternate" hrefLang="x-default"[^>]*>/,
      "",
    );
    expect(rules(auditHtml(html, EXPECT))).toContain("hreflang");
  });
});

describe("auditHtml — JSON-LD", () => {
  it("geçersiz JSON-LD'yi yakalar", () => {
    expect(rules(auditHtml(page({ jsonLd: "{bozuk" }), EXPECT))).toContain(
      "json-ld-parse",
    );
  });

  it("eksik Service düğümünü yakalar", () => {
    const partial = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [{ "@type": "BreadcrumbList" }, { "@type": "FAQPage" }],
    });
    const f = auditHtml(page({ jsonLd: partial }), EXPECT);
    expect(rules(f)).toContain("json-ld-types");
    expect(f.find((x) => x.rule === "json-ld-types")?.detail).toContain(
      "Service",
    );
  });

  it("JSON-LD hiç yoksa yakalar", () => {
    expect(rules(auditHtml(page({ jsonLd: null }), EXPECT))).toContain(
      "json-ld-types",
    );
  });
});

describe("auditHtml — GEO", () => {
  it("metinde geçmeyen varlığı yakalar", () => {
    const f = auditHtml(page(), {
      ...EXPECT,
      entities: ["INDOLES", "iş zekası"],
    });
    expect(f.find((x) => x.rule === "entities")?.detail).toContain("iş zekası");
  });

  it("sayfaya sızmış persona metnini yakalar", () => {
    // Hizmet detay tek sesli; bir bileşen sessizce PersonaText kullanırsa
    // metin ikiye katlanır ve FAQPage şeması görünen metinle ayrışır.
    const html = page({
      body: '<span data-persona-variant="commerce">CAC düşer</span>',
    });
    expect(rules(auditHtml(html, EXPECT))).toContain("persona-leak");
  });
});

describe("auditHtml — bağlantılar ve görseller", () => {
  it("yetersiz iç link sayısını yakalar", () => {
    expect(rules(auditHtml(page({ body: "" }), EXPECT))).toContain(
      "internal-links",
    );
  });

  it("eksik komşu hizmet linklerini yakalar", () => {
    const body = Array.from(
      { length: 6 },
      (_, i) => `<a href="/tr/yazilar/y${i}">yazı</a>`,
    ).join("");
    expect(rules(auditHtml(page({ body }), EXPECT))).toContain("sibling-links");
  });

  it("alt'sız görseli yakalar", () => {
    const html = page({ body: '<img src="/a.png">' });
    expect(rules(auditHtml(html, EXPECT))).toContain("img-alt");
  });

  it("aria-hidden görselde alt aramaz", () => {
    const html = page({ body: '<img src="/a.png" aria-hidden="true">' });
    expect(rules(auditHtml(html, EXPECT))).not.toContain("img-alt");
  });
});
