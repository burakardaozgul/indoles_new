/**
 * GEO kontrolü — LLMs.txt erişimi: LLMs.txt dosyasının varlığını ve
 * biçimini ölçer. Spec §2, Görev 3.
 *
 * Çözüm kuralı: null veya boş/whitespace-only → 0 fail. Metin var + en az bir
 * markdown bağlantı satırı (regex `/^\s*-\s*\[[^\]]+\]\([^)]+\)/m`) → 15 pass.
 * Var ama biçimsiz → 10 partial.
 */

import { Localized } from "@/lib/content/types";
import { GeoCheckResult, statusFor } from "@/lib/tools/geo/types";

const MAX_SCORE = 15;

/** Markdown link satırı regex'i: `- [text](url)` */
const MARKDOWN_LINK_REGEX = /^\s*-\s*\[[^\]]+\]\([^)]+\)/m;

export function checkLlmsTxt(llmsTxt: string | null): GeoCheckResult {
  if (llmsTxt === null || llmsTxt.trim() === "") {
    const summary: Localized<string> = {
      tr: "llms.txt bulunamadı; üretken arama sistemleri kuralları tanımlanmamış.",
      en: "No llms.txt was found; generative search systems rules are not defined.",
    };
    const findings: Array<Localized<string>> = [
      {
        tr: "llms.txt yok: üretken arama sistemlerine yönelik niyet belgelenmemiş.",
        en: "No llms.txt exists to state your intent toward generative search systems.",
      },
    ];
    return {
      id: "llms-txt",
      score: 0,
      max: MAX_SCORE,
      status: statusFor(0, MAX_SCORE),
      summary,
      findings,
    };
  }

  // Metin varsa, markdown bağlantı satırı kontrol et
  const hasMarkdownLink = MARKDOWN_LINK_REGEX.test(llmsTxt);

  if (hasMarkdownLink) {
    const summary: Localized<string> = {
      tr: "llms.txt bulundu ve biçimli markdown bağlantılar içeriyor.",
      en: "llms.txt was found and contains properly formatted markdown links.",
    };
    const findings: Array<Localized<string>> = [
      {
        tr: "Doküman: üretken arama sistemlerine erişim izinleri tanımlanmış.",
        en: "Document: access permissions for generative search systems are defined.",
      },
    ];
    return {
      id: "llms-txt",
      score: MAX_SCORE,
      max: MAX_SCORE,
      status: statusFor(MAX_SCORE, MAX_SCORE),
      summary,
      findings,
    };
  }

  // Biçimsiz: metin var ama markdown bağlantı yok
  const summary: Localized<string> = {
    tr: "llms.txt bulundu ama markdown bağlantı satırları eksik.",
    en: "llms.txt was found but lacks properly formatted markdown link lines.",
  };
  const findings: Array<Localized<string>> = [
    {
      tr: "Doküman: metin var ama üretken arama sistemi referansı biçimsiz.",
      en: "Document: text exists but generative search systems references lack proper formatting.",
    },
  ];
  return {
    id: "llms-txt",
    score: 10,
    max: MAX_SCORE,
    status: statusFor(10, MAX_SCORE),
    summary,
    findings,
  };
}
