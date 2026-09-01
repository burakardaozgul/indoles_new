/**
 * GEO kontrolü — Yapısal veri (JSON-LD): sayfadaki `application/ld+json`
 * bloklarının varlığını, geçerliliğini ve tanınan `@type` çeşitliliğini
 * ölçer. Spec §2, Görev 4.
 *
 * Çözüm kuralı: hiç blok yok → 0 fail. En az bir GEÇERLİ (parse edilebilen)
 * blok → taban 8 puan. `@graph` içindeki düğümler düzleştirilip `@type`
 * değerleri toplanır; tanınan küme (`Organization|WebSite|WebPage|Article|
 * Service|Product|BreadcrumbList|LocalBusiness|Person`) içindeki benzersiz
 * tür sayısı 4'e kadar × 2 puan (+8 tavan) ekler. `FAQPage` varsa ayrıca +4.
 * Bozuk (parse edilemeyen) blok varsa bulguya yazılır; bu durumda status
 * `statusFor` "pass" dese bile en fazla "partial"a düşürülür — çünkü bir
 * blok kırıksa sayfa tam uyumlu sayılamaz.
 */

import { Localized } from "@/lib/content/types";
import { GeoCheckResult, statusFor } from "@/lib/tools/geo/types";

const MAX_SCORE = 20;
const BASE_SCORE = 8;
const MAX_TYPE_DIVERSITY = 4;
const FAQ_BONUS = 4;

/** Puanlamada çeşitlilik katkısı sayılan tanınan `@type` kümesi (FAQPage ayrı bonusludur). */
const RECOGNIZED_TYPES = new Set([
  "Organization",
  "WebSite",
  "WebPage",
  "Article",
  "Service",
  "Product",
  "BreadcrumbList",
  "LocalBusiness",
  "Person",
]);

/** `<script type="application/ld+json">...</script>` bloklarını yakalar. */
const JSON_LD_BLOCK_REGEX =
  /<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

/**
 * HTML içindeki tüm JSON-LD bloklarını çıkarır ve her birini ayrıştırmayı
 * dener. Parse başarısızsa `parsed` `null` olur — blok yine de listede kalır
 * (bulgularda "bozuk blok" olarak raporlanabilsin diye).
 */
export function extractJsonLdBlocks(html: string): Array<{ raw: string; parsed: unknown | null }> {
  const blocks: Array<{ raw: string; parsed: unknown | null }> = [];
  const regex = new RegExp(JSON_LD_BLOCK_REGEX);
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    const raw = (match[1] ?? "").trim();
    let parsed: unknown | null;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = null;
    }
    blocks.push({ raw, parsed });
  }
  return blocks;
}

/**
 * Bir bloğun ayrıştırılmış içeriğinden `@type` değerlerini toplar.
 *
 * `@graph` içindeki düğümler düzleştirilir (spec ifadesi birebir). Düğümün
 * kendi iç alanlarına (ör. `author`, `mainEntity`) inilmez — çeşitlilik
 * skoru yalnız grafiğin üst düzey düğümlerini sayar.
 */
export function collectTypes(parsed: unknown): string[] {
  const types: string[] = [];

  const visit = (node: unknown): void => {
    if (!node || typeof node !== "object" || Array.isArray(node)) return;
    const obj = node as Record<string, unknown>;

    if (Array.isArray(obj["@graph"])) {
      for (const child of obj["@graph"]) visit(child);
    }

    const type = obj["@type"];
    if (typeof type === "string") {
      types.push(type);
    } else if (Array.isArray(type)) {
      for (const t of type) if (typeof t === "string") types.push(t);
    }
  };

  if (Array.isArray(parsed)) {
    for (const item of parsed) visit(item);
  } else {
    visit(parsed);
  }

  return types;
}

export function checkJsonLd(pageHtml: string): GeoCheckResult {
  const blocks = extractJsonLdBlocks(pageHtml);

  if (blocks.length === 0) {
    const summary: Localized<string> = {
      tr: "Sayfada application/ld+json bloğu bulunamadı; üretken arama sistemleri için yapısal veri yok.",
      en: "No application/ld+json block was found on the page; there is no structured data for generative search systems.",
    };
    const findings: Array<Localized<string>> = [
      {
        tr: "JSON-LD şeması yok: Organization, Article gibi tanınan @type değerleri makine tarafından okunamıyor.",
        en: "No JSON-LD schema exists: recognised @type values such as Organization and Article cannot be read by machines.",
      },
    ];
    return {
      id: "json-ld",
      score: 0,
      max: MAX_SCORE,
      status: statusFor(0, MAX_SCORE),
      summary,
      findings,
    };
  }

  const validBlocks = blocks.filter((b) => b.parsed !== null);
  const brokenCount = blocks.length - validBlocks.length;

  const types = validBlocks.flatMap((b) => collectTypes(b.parsed));
  const recognizedTypes = new Set(types.filter((t) => RECOGNIZED_TYPES.has(t)));
  const hasFaq = types.includes("FAQPage");

  const baseScore = validBlocks.length > 0 ? BASE_SCORE : 0;
  const diversityScore = Math.min(recognizedTypes.size, MAX_TYPE_DIVERSITY) * 2;
  const faqScore = hasFaq ? FAQ_BONUS : 0;
  const score = Math.min(baseScore + diversityScore + faqScore, MAX_SCORE);

  // Bozuk blok varsa "pass" durumu bilerek "partial"a çekilir — kırık bir
  // blok varken sayfa tam uyumlu sayılamaz (statusFor bu tavanı bilmez).
  let status = statusFor(score, MAX_SCORE);
  if (brokenCount > 0 && status === "pass") status = "partial";

  const typeList = Array.from(recognizedTypes).sort().join(", ");
  const summary: Localized<string> =
    validBlocks.length > 0
      ? {
          tr: `Sayfada ${validBlocks.length} geçerli JSON-LD bloğu bulundu${
            typeList ? `; tanınan tipler: ${typeList}` : ""
          }${hasFaq ? "; FAQPage şeması mevcut" : ""}.`,
          en: `${validBlocks.length} valid JSON-LD block(s) found on the page${
            typeList ? `; recognised types: ${typeList}` : ""
          }${hasFaq ? "; FAQPage schema present" : ""}.`,
        }
      : {
          tr: "Sayfadaki JSON-LD blokları çözümlenemedi; geçerli yapısal veri bulunamadı.",
          en: "The JSON-LD blocks on the page could not be parsed; no valid structured data was found.",
        };

  const findings: Array<Localized<string>> = [];
  if (brokenCount > 0) {
    findings.push({
      tr: `Bozuk JSON-LD bloğu bulundu: ${brokenCount} blok çözümlenemedi (geçersiz JSON söz dizimi).`,
      en: `Broken JSON-LD block found: ${brokenCount} block(s) could not be parsed (invalid JSON syntax).`,
    });
  }
  if (validBlocks.length > 0 && recognizedTypes.size === 0 && !hasFaq) {
    findings.push({
      tr: "Doküman: bulunan bloklarda tanınan @type kümesinden hiçbir tür yok.",
      en: "Document: none of the blocks contain a type from the recognised @type set.",
    });
  }

  return {
    id: "json-ld",
    score,
    max: MAX_SCORE,
    status,
    summary,
    findings,
  };
}
