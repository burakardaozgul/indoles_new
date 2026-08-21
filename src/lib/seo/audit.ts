import * as cheerio from "cheerio";

export type Finding = {
  rule: string;
  level: "fail" | "warn";
  detail: string;
};

export type Expectations = {
  /** Sayfa metninde açık isimle geçmesi beklenen varlıklar. */
  entities: string[];
  minInternalLinks: number;
  minSiblingLinks: number;
  /** Komşu hizmet yolları — en az `minSiblingLinks` tanesi bulunmalı. */
  siblingHrefs: string[];
};

const TITLE_MAX = 60;
const DESC_MIN = 80;
const DESC_MAX = 160;
const REQUIRED_LD_TYPES = ["Service", "BreadcrumbList", "FAQPage"];

/**
 * Render edilmiş bir hizmet detay sayfasının SEO ve GEO denetimi.
 *
 * Saf fonksiyon: ağ ve dosya sistemi erişimi yok, HTML fixture'ıyla test
 * edilebilir. CLI (`scripts/seo-audit.ts`) yalnız sayfayı çekip buraya verir.
 *
 * Öznitelik adları cheerio tarafından küçük harfe normalize edilir — Next
 * `hrefLang` olarak serialize ettiği için bu şart (HTML öznitelikleri harf
 * duyarsızdır, tarayıcı ve crawler sorun görmez ama string araması görür).
 */
export function auditHtml(html: string, expect: Expectations): Finding[] {
  const $ = cheerio.load(html);
  const findings: Finding[] = [];
  const fail = (rule: string, detail: string) =>
    findings.push({ rule, level: "fail", detail });

  // --- Başlık yapısı
  const h1Count = $("h1").length;
  if (h1Count !== 1) {
    fail("h1-count", `h1 sayısı ${h1Count}, tam 1 olmalı`);
  }

  const levels = $("h1,h2,h3,h4,h5,h6")
    .toArray()
    .map((el) => Number(($(el).prop("tagName") ?? "H1").slice(1)));
  for (let i = 1; i < levels.length; i++) {
    const prev = levels[i - 1]!;
    const cur = levels[i]!;
    if (cur > prev + 1) {
      fail("heading-order", `h${prev} sonrası h${cur} — seviye atlanmış`);
      break;
    }
  }

  // --- Meta
  const title = $("title").first().text().trim();
  if (title.length === 0 || title.length > TITLE_MAX) {
    fail("title-length", `title ${title.length} karakter (sınır ${TITLE_MAX})`);
  }

  const desc = ($("meta[name=description]").attr("content") ?? "").trim();
  if (desc.length < DESC_MIN || desc.length > DESC_MAX) {
    fail(
      "description-length",
      `description ${desc.length} karakter (${DESC_MIN}-${DESC_MAX} olmalı)`,
    );
  }

  if ($("link[rel=canonical]").length === 0) {
    fail("canonical", "canonical link yok");
  }

  const hreflangs = new Set(
    $("link[rel=alternate]")
      .toArray()
      .map((el) => ($(el).attr("hreflang") ?? "").toLowerCase())
      .filter(Boolean),
  );
  const missingLang = ["tr", "en", "x-default"].filter((l) => !hreflangs.has(l));
  if (missingLang.length > 0) {
    fail("hreflang", `eksik hreflang: ${missingLang.join(", ")}`);
  }

  // --- JSON-LD
  const types = new Set<string>();
  let parseFailed = false;
  $('script[type="application/ld+json"]').each((_, el) => {
    const raw = $(el).text();
    try {
      collectTypes(JSON.parse(raw), types);
    } catch {
      parseFailed = true;
    }
  });
  if (parseFailed) {
    fail("json-ld-parse", "JSON-LD parse edilemedi");
  }
  const missingLd = REQUIRED_LD_TYPES.filter((t) => !types.has(t));
  if (missingLd.length > 0) {
    fail("json-ld-types", `eksik JSON-LD düğümü: ${missingLd.join(", ")}`);
  }

  // --- GEO
  const bodyText = $("body").clone().find("script,style").remove().end().text();
  const normalized = bodyText.replace(/\s+/g, " ").toLocaleLowerCase("tr");
  const missingEntities = expect.entities.filter(
    (e) => !normalized.includes(e.toLocaleLowerCase("tr")),
  );
  if (missingEntities.length > 0) {
    fail("entities", `metinde geçmeyen varlık: ${missingEntities.join(", ")}`);
  }

  const personaNodes = $("[data-persona-variant]").length;
  if (personaNodes > 0) {
    fail(
      "persona-leak",
      `${personaNodes} persona varyantı bulundu — hizmet detay tek sesli olmalı`,
    );
  }

  // --- Bağlantılar ve görseller
  const hrefs = $("a[href]")
    .toArray()
    .map((el) => $(el).attr("href") ?? "");
  const internal = hrefs.filter((h) => h.startsWith("/"));
  if (internal.length < expect.minInternalLinks) {
    fail(
      "internal-links",
      `iç link ${internal.length}, en az ${expect.minInternalLinks} olmalı`,
    );
  }

  const siblingHits = expect.siblingHrefs.filter((s) =>
    internal.some((h) => h === s),
  ).length;
  if (siblingHits < expect.minSiblingLinks) {
    fail(
      "sibling-links",
      `komşu hizmet linki ${siblingHits}, en az ${expect.minSiblingLinks} olmalı`,
    );
  }

  const imgsWithoutAlt = $("img")
    .toArray()
    .filter((el) => {
      const $el = $(el);
      if ($el.attr("aria-hidden") === "true") return false;
      return ($el.attr("alt") ?? "").length === 0;
    }).length;
  if (imgsWithoutAlt > 0) {
    fail("img-alt", `${imgsWithoutAlt} görselde alt metni yok`);
  }

  return findings;
}

/** `@graph`, dizi ve iç içe nesneler dahil tüm `@type` değerlerini toplar. */
function collectTypes(node: unknown, into: Set<string>): void {
  if (Array.isArray(node)) {
    for (const n of node) collectTypes(n, into);
    return;
  }
  if (node === null || typeof node !== "object") return;

  const obj = node as Record<string, unknown>;
  const t = obj["@type"];
  if (typeof t === "string") into.add(t);
  if (Array.isArray(t)) for (const x of t) if (typeof x === "string") into.add(x);

  for (const v of Object.values(obj)) collectTypes(v, into);
}
