import * as cheerio from "cheerio";

export type Finding = {
  rule: string;
  level: "fail" | "warn";
  detail: string;
};

/**
 * Sayfa tipi profili.
 *
 * Kurallar sayfa tipine göre değişir — hepsini tek şablonla ölçmek iki yönde
 * de yanlış sonuç verir: hizmet detayında zorunlu olan `FAQPage` KVKK
 * sayfasında anlamsızdır, hizmet detayında ihlal olan persona varyantı ana
 * sayfada bilinçli mimaridir (ADR-014 / ADR-018).
 */
export type PageProfile =
  | "service"
  | "pillar"
  | "case"
  | "article"
  | "package"
  | "consultant"
  | "index"
  | "static"
  | "legal";

export type ProfileRules = {
  titleMin: number;
  titleMax: number;
  descMin: number;
  descMax: number;
  /** Sayfada bulunması beklenen JSON-LD `@type` değerleri. */
  requiredLdTypes: readonly string[];
  /**
   * Persona varyantları (`[data-persona-variant]`) bu profilde bilinçli
   * mimari mi, yoksa sızıntı mı.
   */
  personaVariants: "allowed" | "forbidden";
  /** Komşu hizmet linki kuralı yalnız hizmet detayında anlamlı. */
  siblingLinks: boolean;
  minInternalLinks: number;
  /** `<main>` içinde beklenen en az kelime — altı `warn`, ince sayfa uyarısı. */
  minWords: number;
  /**
   * `noindex` bu profilde bilinçli mi.
   *
   * Yalnız `legal` profilinde `true`: aydınlatma metni arama sonucunda yer
   * tutmasın diye `noindex, follow` alıyor (gizlilik-kvkk/page.tsx). Diğer
   * profillerde `noindex` her zaman ihlaldir — yanlış `NEXT_PUBLIC_APP_STAGE`
   * ile deploy edilen site sessizce indeks dışı kalıyordu (denetim LG-02).
   */
  allowNoindex: boolean;
};

/**
 * Profil × kural matrisi.
 *
 * `minWords` eşikleri bugünkü en zayıf gerçek sayfanın biraz altına konur:
 * amaç iyi sayfaları rahatsız etmek değil, bir şablonun içeriksiz
 * yayınlanmasını (boş vaka, tek paragraflık paket) yakalamaktır. Persona-aware
 * sayfalarda iki varyant da DOM'da olduğu için sayım şişer — eşiği aşağı
 * çekmek bu yüzden de doğru, sayım yalnız "çok ince" durumu ölçer.
 *
 * `titleMax` her profilde 60: bugünkü ölçümde makale başlıkları 61-109 karakter
 * (denetim raporu docs/17 §3.1), yani kural onları yakalamalı. `titleMin`
 * "INDOLES" şablon ekiyle bile dolmayan boş şablon başlığını yakalar.
 */
export const PROFILE_RULES: Record<PageProfile, ProfileRules> = {
  service: {
    titleMin: 15,
    titleMax: 60,
    descMin: 80,
    descMax: 160,
    requiredLdTypes: ["Organization", "BreadcrumbList", "Service", "FAQPage"],
    personaVariants: "forbidden",
    siblingLinks: true,
    minInternalLinks: 6,
    minWords: 400,
    allowNoindex: false,
  },
  pillar: {
    titleMin: 15,
    titleMax: 60,
    descMin: 80,
    descMax: 160,
    requiredLdTypes: ["Organization", "BreadcrumbList", "Service"],
    // Pillar persona-aware: `pillar-detail.tsx` üç yerde `PersonaText` kullanır
    // ve `pillars.ts` her pillar için ayrı `industrial:` metni taşır. Bu, hizmet
    // detayındaki tek seslilik kuralının (ADR-018 karar 2) istisnası değil
    // kardeşi: pillar seçim katmanıdır — ziyaretçi hangi eksende olduğunu burada
    // anlar; hizmet detayı ise tek cevap verir. `index`/`package` ile aynı
    // gerekçe (ADR-014, globals.css persona merceği).
    personaVariants: "allowed",
    siblingLinks: false,
    minInternalLinks: 6,
    minWords: 300,
    allowNoindex: false,
  },
  case: {
    titleMin: 15,
    titleMax: 60,
    descMin: 80,
    descMax: 160,
    // docs/08 §8.4: vaka → Article. Metrik taşıyan sayfalar yapılandırılmamış
    // kalıyordu (denetim G-07).
    requiredLdTypes: ["Organization", "BreadcrumbList", "Article"],
    personaVariants: "forbidden",
    siblingLinks: false,
    minInternalLinks: 4,
    minWords: 300,
    allowNoindex: false,
  },
  article: {
    titleMin: 15,
    titleMax: 60,
    descMin: 80,
    descMax: 160,
    requiredLdTypes: ["Organization", "BreadcrumbList", "Article", "Person"],
    personaVariants: "forbidden",
    siblingLinks: false,
    minInternalLinks: 3,
    minWords: 600,
    allowNoindex: false,
  },
  package: {
    titleMin: 15,
    titleMax: 60,
    descMin: 80,
    descMax: 160,
    requiredLdTypes: ["Organization", "BreadcrumbList"],
    // Paket detayı iki persona için ayrı kapsam anlatır (`paketler/[slug]`
    // `PersonaText`/`PersonaListItems` kullanır) — bilinçli.
    personaVariants: "allowed",
    siblingLinks: false,
    minInternalLinks: 4,
    minWords: 250,
    allowNoindex: false,
  },
  consultant: {
    titleMin: 15,
    titleMax: 60,
    descMin: 80,
    descMax: 160,
    requiredLdTypes: ["Organization", "BreadcrumbList", "Person"],
    personaVariants: "forbidden",
    siblingLinks: false,
    minInternalLinks: 3,
    minWords: 150,
    allowNoindex: false,
  },
  index: {
    titleMin: 15,
    titleMax: 60,
    descMin: 80,
    descMax: 160,
    // Ana sayfa ve liste sayfalarında breadcrumb yok — kök zaten kendisi.
    requiredLdTypes: ["Organization"],
    // Ana sayfa ve `/paketler`, `/hizmetler`, `/vakalar` listeleri persona
    // ekseninde konuşur (ADR-014, globals.css persona merceği).
    personaVariants: "allowed",
    siblingLinks: false,
    minInternalLinks: 5,
    minWords: 120,
    allowNoindex: false,
  },
  /**
   * Yasal metin (`/tr/gizlilik-kvkk`, `/en/privacy`).
   *
   * `static`ten tek farkı `allowNoindex`: aydınlatma metni arama sonucunda yer
   * tutmasın diye bilinçli `robots: { index: false, follow: true }` alır.
   * Ayrı profil, `static`i toptan gevşetmekten iyidir — "Hakkımızda"da beliren
   * bir noindex hâlâ FAIL olmalı (LG-02).
   */
  legal: {
    titleMin: 15,
    titleMax: 60,
    descMin: 80,
    descMax: 160,
    requiredLdTypes: ["Organization"],
    personaVariants: "forbidden",
    siblingLinks: false,
    minInternalLinks: 3,
    minWords: 150,
    allowNoindex: true,
  },
  static: {
    titleMin: 15,
    titleMax: 60,
    descMin: 80,
    descMax: 160,
    requiredLdTypes: ["Organization"],
    personaVariants: "forbidden",
    siblingLinks: false,
    minInternalLinks: 3,
    minWords: 150,
    allowNoindex: false,
  },
};

/**
 * Pillar anahtarları hizmet detaylarıyla aynı URL segmentini paylaşır
 * (`/hizmetler/{pillar}` ve `/hizmetler/{hizmet}`, ADR-018 karar 1), bu yüzden
 * URL'den ayırmanın tek yolu bu üç sabit anahtar. Locale'den bağımsızdır —
 * pillar key'i çevrilmez.
 */
const PILLAR_KEYS = new Set(["growth", "transform", "build"]);

/**
 * Yasal metin segmentleri. `/tr/gizlilik-kvkk` ve `/en/privacy` aynı route
 * dosyasının iki dildeki yüzü — path çevrildiği için ikisi de listede.
 */
const LEGAL_SEGMENTS = new Set(["gizlilik-kvkk", "privacy"]);

/** Çevrilen yol segmentleri (docs/08 §2, ADR-019, ADR-020). */
const SECTION_SEGMENTS: ReadonlyArray<{
  segments: ReadonlySet<string>;
  detail: PageProfile;
}> = [
  { segments: new Set(["hizmetler", "services"]), detail: "service" },
  { segments: new Set(["paketler", "packages"]), detail: "package" },
  { segments: new Set(["vakalar", "case-studies"]), detail: "case" },
  { segments: new Set(["yazilar", "articles"]), detail: "article" },
  { segments: new Set(["danismanlar", "consultants"]), detail: "consultant" },
];

/**
 * URL kalıbından sayfa tipi.
 *
 * Denetim aracının kapsamı `/sitemap.xml`ten gelir; profil de URL'den
 * çıkarılınca araç içerik katmanının şemasına hiç bağlanmaz. Tanınmayan yol
 * (iletişim, hakkımızda) `static`.
 */
export function profileFor(path: string): PageProfile {
  const seg = path.split("/").filter(Boolean);
  // seg[0] locale — `/tr`, `/en` tek başına ana sayfadır.
  if (seg.length <= 1) return "index";

  const section = seg[1]!;
  const slug = seg[2];

  if (LEGAL_SEGMENTS.has(section)) return "legal";

  for (const { segments, detail } of SECTION_SEGMENTS) {
    if (!segments.has(section)) continue;
    if (slug === undefined) return "index";
    if (detail === "service" && PILLAR_KEYS.has(slug)) return "pillar";
    return detail;
  }

  return "static";
}

export type Expectations = {
  /** Sayfa tipi — kural setini seçer. */
  profile: PageProfile;
  /**
   * Denetlenen sayfanın kendi adresi. `canonical-self` ve
   * `hreflang-reciprocal` bunu referans alır; mutlak ya da göreli olabilir,
   * karşılaştırma yalnız path üzerinden yapılır (lokal denetimde host
   * `localhost`, canonical'da `indoles.com.tr` olabilir).
   */
  pageUrl: string;
  /** `<html lang>` bununla uyumlu olmalı. Verilmezse `pageUrl`den türetilir. */
  locale?: "tr" | "en";
  /** Sayfa metninde açık isimle geçmesi beklenen varlıklar. Boşsa atlanır. */
  entities?: string[];
  minInternalLinks?: number;
  minSiblingLinks?: number;
  /** Komşu hizmet yolları — en az `minSiblingLinks` tanesi bulunmalı. */
  siblingHrefs?: string[];
  /** Profil varsayılanını ezer. */
  requiredLdTypes?: readonly string[];
  /** Profil varsayılanını ezer; 0 kuralı kapatır. */
  minWords?: number;
  /**
   * Preview/dev denetiminde `noindex` beklenir. Production denetiminde bu
   * `false` kalmalı — yanlış `NEXT_PUBLIC_APP_STAGE` ile deploy edilen site
   * sessizce indeks dışı kalıyordu (denetim LG-02). Profilin kendi
   * `allowNoindex`i (yalnız `legal`) bundan bağımsız çalışır; ikisinden biri
   * yeterlidir.
   */
  allowNoindex?: boolean;
};

/**
 * Bir zorunlu `@type`ı karşılayan daha özgül alt tipler.
 *
 * `/tr/iletisim` ve `/en/contact` `professionalServiceLd()` basar; o düğüm
 * `organizationLd()`i genişletir ve **aynı `@id`yi** taşır (json-ld.ts §
 * `professionalServiceLd` yorumu). Yani Organization varlığı grafikte
 * sağlanmış, yalnız tipi daha özgül — ayrıca `@id` çakışmaması için ikinci bir
 * Organization düğümü basmak yanlış olurdu. Kural "Organization yazan bir
 * düğüm" değil "organizasyon varlığı" arıyor.
 *
 * Liste schema.org hiyerarşisinden: `LocalBusiness` → `Organization`,
 * `ProfessionalService` → `LocalBusiness`.
 */
const TYPE_SUBSTITUTES: Readonly<Record<string, readonly string[]>> = {
  Organization: [
    "LocalBusiness",
    "ProfessionalService",
    "Corporation",
    "OnlineBusiness",
    "NGO",
    "EducationalOrganization",
  ],
};

/** Zorunlu tip ya doğrudan ya da daha özgül bir alt tipiyle karşılanır. */
function ldTypeSatisfied(required: string, present: ReadonlySet<string>): boolean {
  if (present.has(required)) return true;
  return (TYPE_SUBSTITUTES[required] ?? []).some((t) => present.has(t));
}

/** `<head>` içinde olması zorunlu etiketler — konum kontrolü için. */
const HEAD_ONLY_TAGS: ReadonlyArray<{ label: string; selector: string }> = [
  { label: "<title>", selector: "title" },
  { label: "meta[name=description]", selector: "meta[name=description]" },
  { label: "link[rel=canonical]", selector: "link[rel=canonical]" },
  { label: "meta[property^=og:]", selector: 'meta[property^="og:"]' },
];

/**
 * Render edilmiş bir sayfanın SEO ve GEO denetimi.
 *
 * Saf fonksiyon: ağ ve dosya sistemi erişimi yok, HTML fixture'ıyla test
 * edilebilir. CLI (`scripts/seo-audit.ts`) yalnız sayfayı çekip buraya verir.
 *
 * Öznitelik adları cheerio tarafından küçük harfe normalize edilir — Next
 * `hrefLang` olarak serialize ettiği için bu şart (HTML öznitelikleri harf
 * duyarsızdır, tarayıcı ve crawler sorun görmez ama string araması görür).
 *
 * cheerio parse5 ile HTML5 ağaç kurma algoritmasını uyguladığı için `<body>`
 * içine düşmüş bir `<title>`/`<meta>`/`<link>` orada kalır, sessizce `<head>`e
 * taşınmaz — `head-placement` kuralı bu davranışa dayanır.
 */
export function auditHtml(html: string, expect: Expectations): Finding[] {
  const $ = cheerio.load(html);
  const findings: Finding[] = [];
  const fail = (rule: string, detail: string) =>
    findings.push({ rule, level: "fail", detail });
  const warn = (rule: string, detail: string) =>
    findings.push({ rule, level: "warn", detail });

  const rules = PROFILE_RULES[expect.profile];
  const locale = expect.locale ?? localeOf(expect.pageUrl);
  const selfPath = pathOf(expect.pageUrl);

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

  // --- Metadata konumu
  //
  // İçeriğin doğru olması yetmez: Google `<body>` içindeki canonical ve
  // hreflang'i yok sayar, JS çalıştırmayan AI crawler'ları hiçbirini görmez
  // (denetim T-01). Kural etiketin varlığını değil, `<head>` içinde
  // olduğunu ölçer.
  const misplaced = HEAD_ONLY_TAGS.filter(
    (t) => $(t.selector).length > $(`head ${t.selector}`).length,
  ).map((t) => t.label);
  if (misplaced.length > 0) {
    fail(
      "head-placement",
      `<head> dışında basılmış: ${misplaced.join(", ")}`,
    );
  }

  // --- Meta
  const title = $("title").first().text().trim();
  if (title.length < rules.titleMin || title.length > rules.titleMax) {
    fail(
      "title-length",
      `title ${title.length} karakter (${expect.profile} profili: ${rules.titleMin}-${rules.titleMax})`,
    );
  }

  const desc = ($("meta[name=description]").attr("content") ?? "").trim();
  if (desc.length < rules.descMin || desc.length > rules.descMax) {
    fail(
      "description-length",
      `description ${desc.length} karakter (${expect.profile} profili: ${rules.descMin}-${rules.descMax})`,
    );
  }

  const canonicalHref = ($("link[rel=canonical]").first().attr("href") ?? "")
    .trim();
  if ($("link[rel=canonical]").length === 0) {
    fail("canonical", "canonical link yok");
  } else if (canonicalHref.length === 0) {
    fail("canonical", "canonical link href'i boş");
  } else {
    // Değer kontrolü: yalnız varlığa bakan eski kural, 12 URL'in ana sayfayı
    // kanonik göstermesini PASS saymıştı (denetim T-02).
    const canonicalPath = pathOf(canonicalHref);
    if (canonicalPath !== selfPath) {
      fail(
        "canonical-self",
        `canonical ${canonicalPath ?? canonicalHref} gösteriyor, sayfa ${selfPath}`,
      );
    }
  }

  // --- hreflang
  const alternates = $("link[rel=alternate]")
    .toArray()
    .map((el) => ({
      lang: ($(el).attr("hreflang") ?? "").toLowerCase(),
      href: ($(el).attr("href") ?? "").trim(),
    }))
    .filter((a) => a.lang.length > 0);

  const byLang = new Map(alternates.map((a) => [a.lang, a.href]));
  const missingLang = ["tr", "en", "x-default"].filter((l) => !byLang.has(l));
  if (missingLang.length > 0) {
    fail("hreflang", `eksik hreflang: ${missingLang.join(", ")}`);
  }

  const emptyHref = alternates.filter((a) => a.href.length === 0);
  if (emptyHref.length > 0) {
    fail(
      "hreflang-reciprocal",
      `href'i boş hreflang: ${emptyHref.map((a) => a.lang).join(", ")}`,
    );
  } else {
    const tr = byLang.get("tr");
    const xDefault = byLang.get("x-default");
    if (tr && xDefault && pathOf(tr) !== pathOf(xDefault)) {
      fail(
        "hreflang-reciprocal",
        `x-default ${pathOf(xDefault)} gösteriyor, TR alternatifi ${pathOf(tr)}`,
      );
    }
    const self = byLang.get(locale);
    if (self && pathOf(self) !== selfPath) {
      fail(
        "hreflang-reciprocal",
        `hreflang=${locale} kendi sayfasını göstermiyor: ${pathOf(self)} ≠ ${selfPath}`,
      );
    }
  }

  // --- Sosyal görsel
  const ogImage = metaContent($, 'meta[property="og:image"]');
  if (!ogImage) {
    fail("og-image", "og:image yok — paylaşım önizlemesi boş kart basar");
  }
  const twitterCard = metaContent($, 'meta[name="twitter:card"]');
  if (twitterCard === "summary_large_image") {
    const twitterImage =
      metaContent($, 'meta[name="twitter:image"]') ??
      metaContent($, 'meta[property="twitter:image"]');
    if (!twitterImage) {
      fail("og-image", "twitter:card=summary_large_image ama twitter:image yok");
    }
  }

  // --- İndekslenebilirlik
  const robotsContent = (metaContent($, "meta[name=robots]") ?? "").toLowerCase();
  // İki ayrı gerekçe, ikisi de "bu noindex bilinçli": profil (yasal metin,
  // her ortamda) ve çağıran (preview/dev denetimi, tüm site).
  const noindexExpected = expect.allowNoindex === true || rules.allowNoindex;
  if (robotsContent.includes("noindex") && !noindexExpected) {
    fail(
      "robots-meta",
      `meta robots "${robotsContent}" — sayfa indeks dışı`,
    );
  }

  // --- Dil
  const htmlLang = ($("html").attr("lang") ?? "").toLowerCase();
  if (htmlLang.split("-")[0] !== locale) {
    fail(
      "html-lang",
      `<html lang="${htmlLang || "(yok)"}"> — sayfa locale'i ${locale}`,
    );
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
  const requiredLd = expect.requiredLdTypes ?? rules.requiredLdTypes;
  const missingLd = requiredLd.filter((t) => !ldTypeSatisfied(t, types));
  if (missingLd.length > 0) {
    fail("json-ld-types", `eksik JSON-LD düğümü: ${missingLd.join(", ")}`);
  }

  // --- GEO
  const bodyText = textOf($, "body");
  const normalized = bodyText.replace(/\s+/g, " ").toLocaleLowerCase("tr");
  const missingEntities = (expect.entities ?? []).filter(
    (e) => !normalized.includes(e.toLocaleLowerCase("tr")),
  );
  if (missingEntities.length > 0) {
    fail("entities", `metinde geçmeyen varlık: ${missingEntities.join(", ")}`);
  }

  if (rules.personaVariants === "forbidden") {
    const personaNodes = $("[data-persona-variant]").length;
    if (personaNodes > 0) {
      fail(
        "persona-leak",
        `${personaNodes} persona varyantı bulundu — ${expect.profile} sayfası tek sesli olmalı`,
      );
    }
  }

  // --- İçerik hacmi
  //
  // `<main>` yoksa `<body>`ye düşer; nav ve footer metnini de sayar, bu yüzden
  // eşik yalnız gerçekten boş şablonu yakalayacak kadar düşük tutulur.
  const minWords = expect.minWords ?? rules.minWords;
  if (minWords > 0) {
    const scope = $("main").length > 0 ? "main" : "body";
    const words = textOf($, scope)
      .split(/\s+/)
      .filter((w) => /\p{L}|\p{N}/u.test(w)).length;
    if (words < minWords) {
      warn(
        "word-count",
        `<main> içinde ${words} kelime, ${expect.profile} profili için en az ${minWords} bekleniyor`,
      );
    }
  }

  // --- Bağlantılar ve görseller
  const hrefs = $("a[href]")
    .toArray()
    .map((el) => $(el).attr("href") ?? "");
  const internal = hrefs.filter((h) => h.startsWith("/"));
  const minInternal = expect.minInternalLinks ?? rules.minInternalLinks;
  if (internal.length < minInternal) {
    fail(
      "internal-links",
      `iç link ${internal.length}, en az ${minInternal} olmalı`,
    );
  }

  if (rules.siblingLinks) {
    const siblingHrefs = expect.siblingHrefs ?? [];
    const minSiblings = expect.minSiblingLinks ?? 0;
    const siblingHits = siblingHrefs.filter((s) =>
      internal.some((h) => h === s),
    ).length;
    if (siblingHits < minSiblings) {
      fail(
        "sibling-links",
        `komşu hizmet linki ${siblingHits}, en az ${minSiblings} olmalı`,
      );
    }
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

/** İlk eşleşen meta etiketinin dolu `content` değeri, yoksa `null`. */
function metaContent(
  $: cheerio.CheerioAPI,
  selector: string,
): string | null {
  const raw = ($(selector).first().attr("content") ?? "").trim();
  return raw.length > 0 ? raw : null;
}

/** Script ve style dışlanmış görünür metin. */
function textOf($: cheerio.CheerioAPI, selector: string): string {
  return $(selector)
    .clone()
    .find("script,style,noscript")
    .remove()
    .end()
    .text();
}

/**
 * URL veya yolun karşılaştırılabilir path'i.
 *
 * Host'u atar: lokal denetimde sayfa `localhost:3000`den çekilirken canonical
 * `indoles.com.tr`yi gösterir — ikisi kasıtlı olarak farklıdır, karşılaştırma
 * path üzerinden yapılmalı. Sondaki slash normalize edilir.
 */
function pathOf(url: string): string | null {
  try {
    const p = new URL(url, "https://audit.invalid").pathname;
    return p.length > 1 ? p.replace(/\/+$/, "") : p;
  } catch {
    return null;
  }
}

/** `/tr/...` → `tr`. Tanınmayan yol TR'ye düşer (varsayılan dil). */
function localeOf(url: string): "tr" | "en" {
  const seg = (pathOf(url) ?? "").split("/")[1];
  return seg === "en" ? "en" : "tr";
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
