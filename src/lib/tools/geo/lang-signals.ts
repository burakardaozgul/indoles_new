/**
 * GEO kontrolü — Dil sinyalleri: `html lang`, canonical URL eşleşmesi ve
 * hreflang setinin tamlığını ölçer. Üretken arama sistemleri bu üç sinyali
 * kullanarak bir sayfanın hangi dilde/hangi kanonik sürümde indekslenmesi
 * gerektiğine karar verir; sinyaller eksikse yanlış dil/sürüm önerilebilir.
 * Spec §2, Görev 5.
 *
 * Çözüm kuralı: `html lang` var (5) + `link rel="canonical"` href'i verilen
 * URL ile aynı origin+path (sondaki `/` toleranslı) (5) + hreflang setinde en
 * az 2 dil VE `x-default` (5) → toplam 15.
 *
 * Normalizasyon: sayfada TEK BİR `link rel="alternate" hreflang` bile yoksa
 * (tek dilli site varsayımı) kalem yalnız 10 üzerinden (lang+canonical)
 * ölçülür ve `score = Math.round(raw * 15 / 10)` ile 15'e ölçeklenir;
 * bulgulara bilgilendirici bir not eklenir. hreflang etiketleri MEVCUT ama
 * set eksikse (2'den az dil veya `x-default` yok) normalizasyon UYGULANMAZ —
 * kalem doğrudan 15 üzerinden hesaplanır ve hreflang payı 0 sayılır. `max`
 * her zaman 15'tir (`statusFor(score, 15)` çağrılır).
 */

import { Localized } from "@/lib/content/types";
import { GeoCheckResult, statusFor } from "@/lib/tools/geo/types";

const MAX_SCORE = 15;
const LANG_SCORE = 5;
const CANONICAL_SCORE = 5;
const HREFLANG_SCORE = 5;
const RAW_MAX_WITHOUT_HREFLANG = LANG_SCORE + CANONICAL_SCORE;
const MIN_HREFLANG_LANGUAGES = 2;

type LinkTag = { rel: string | null; href: string | null; hreflang: string | null };

const LINK_TAG_REGEX = /<link\b[^>]*>/gi;
const HTML_TAG_REGEX = /<html\b[^>]*>/i;

/** Bir etiket metninden tek bir özniteliğin değerini çıkarır (tırnak içi). */
function readAttr(tag: string, name: string): string | null {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, "i"));
  return match?.[1] ?? null;
}

/** `rel` özniteliği boşlukla ayrılmış birden çok değer taşıyabilir. */
function relHas(rel: string | null, value: string): boolean {
  if (!rel) return false;
  return rel
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .includes(value);
}

/** Sayfadaki tüm `<link>` etiketlerini rel/href/hreflang alanlarıyla çıkarır. */
function extractLinkTags(html: string): LinkTag[] {
  const tags = html.match(LINK_TAG_REGEX) ?? [];
  return tags.map((tag) => ({
    rel: readAttr(tag, "rel"),
    href: readAttr(tag, "href"),
    hreflang: readAttr(tag, "hreflang")?.toLowerCase() ?? null,
  }));
}

/** `<html lang="...">` özniteliğinin var ve boş olmadığını kontrol eder. */
function hasHtmlLang(html: string): boolean {
  const htmlTag = html.match(HTML_TAG_REGEX)?.[0];
  if (!htmlTag) return false;
  const lang = readAttr(htmlTag, "lang");
  return !!lang && lang.trim() !== "";
}

/** origin+path karşılaştırması — sondaki `/` toleranslı (kök path `/` hariç). */
function sameOriginAndPath(a: URL, b: URL): boolean {
  const normalizePath = (path: string) => (path.length > 1 ? path.replace(/\/$/, "") : path);
  return a.origin === b.origin && normalizePath(a.pathname) === normalizePath(b.pathname);
}

/** canonical linkinin verilen URL ile origin+path bazında eşleşip eşleşmediğini döner. */
function canonicalMatches(links: LinkTag[], url: string): boolean {
  const canonical = links.find((l) => relHas(l.rel, "canonical") && l.href);
  if (!canonical || !canonical.href) return false;
  try {
    const targetUrl = new URL(url);
    const hrefUrl = new URL(canonical.href, targetUrl);
    return sameOriginAndPath(hrefUrl, targetUrl);
  } catch {
    return false;
  }
}

export function checkLangSignals(pageHtml: string, url: string): GeoCheckResult {
  const links = extractLinkTags(pageHtml);
  const langOk = hasHtmlLang(pageHtml);
  const canonicalOk = canonicalMatches(links, url);

  const hreflangTags = links.filter((l) => relHas(l.rel, "alternate") && !!l.hreflang);
  const languages = new Set(hreflangTags.map((t) => t.hreflang!).filter((h) => h !== "x-default"));
  const hasXDefault = hreflangTags.some((t) => t.hreflang === "x-default");
  const hreflangComplete = languages.size >= MIN_HREFLANG_LANGUAGES && hasXDefault;

  const langScore = langOk ? LANG_SCORE : 0;
  const canonicalScore = canonicalOk ? CANONICAL_SCORE : 0;

  const findings: Array<Localized<string>> = [];
  let score: number;

  if (hreflangTags.length === 0) {
    // Tek dilli site varsayımı: hreflang hiç yoksa kalem 10 üzerinden
    // ölçülür ve 15'e normalize edilir.
    const raw = langScore + canonicalScore;
    score = Math.round((raw * MAX_SCORE) / RAW_MAX_WITHOUT_HREFLANG);
    findings.push({
      tr: "Tek dilli site; hreflang beklenmedi ve puan 10 üzerinden ölçülüp 15'e ölçeklendi.",
      en: "Single-language site; hreflang was not expected and the score was measured out of 10 and scaled to 15.",
    });
  } else {
    const hreflangScore = hreflangComplete ? HREFLANG_SCORE : 0;
    score = langScore + canonicalScore + hreflangScore;
  }

  if (!langOk) {
    findings.push({
      tr: "html etiketinde lang özniteliği yok; motorlar sayfanın dilini tahmin etmek zorunda kalıyor.",
      en: "The html tag has no lang attribute, so engines must guess the page language.",
    });
  }
  if (!canonicalOk) {
    findings.push({
      tr: "Canonical bağlantı yok veya girilen adresle eşleşmiyor; motor hangi sürümün asıl olduğunu bilemiyor.",
      en: "The canonical link is missing or does not match the entered address, so engines cannot tell which version is primary.",
    });
  }
  if (hreflangTags.length > 0 && !hreflangComplete) {
    findings.push({
      tr: "hreflang seti eksik; en az iki dil ve x-default gerekir.",
      en: "The hreflang set is incomplete; at least two languages and x-default are required.",
    });
  }

  const hreflangStateTr = hreflangTags.length === 0 ? "yok" : hreflangComplete ? "tam" : "eksik";
  const hreflangStateEn = hreflangTags.length === 0 ? "absent" : hreflangComplete ? "complete" : "incomplete";
  const summary: Localized<string> = {
    tr: `html lang ${langOk ? "var" : "yok"}, canonical ${
      canonicalOk ? "eşleşiyor" : "eşleşmiyor"
    }, hreflang ${hreflangStateTr}.`,
    en: `html lang ${langOk ? "present" : "missing"}, canonical ${
      canonicalOk ? "matches" : "does not match"
    }, hreflang ${hreflangStateEn}.`,
  };

  return {
    id: "lang-signals",
    score,
    max: MAX_SCORE,
    status: statusFor(score, MAX_SCORE),
    summary,
    findings,
  };
}
