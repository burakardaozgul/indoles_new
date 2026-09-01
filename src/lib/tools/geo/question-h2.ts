/**
 * GEO kontrolü — Soru-H2: sayfa başlıklarının soru biçiminde kurulup
 * kurulmadığını ve görünür bir soru-cevap yapısı taşıyıp taşımadığını
 * ölçer. Üretken arama sistemleri soru biçimli başlıkları doğrudan
 * alıntılanabilir cevap adayı olarak önceliklendirir. Spec §2, Görev 6.
 *
 * Çözüm kuralı: H2 metinleri `/<h2[^>]*>([\s\S]*?)<\/h2>/gi` ile çıkarılır
 * (iç etiketler temizlenir). Soru oranı: `?` içeren H2 / toplam H2; oran
 * >= 0.5 → 15, altında `Math.round(15 * oran / 0.5)`. H2 hiç yoksa 0 puan +
 * bulgu. Görünür soru-cevap (10): sayfada `FAQPage` `@type` VEYA `<details>`
 * VEYA `?` ile biten en az 3 başlık (h2+h3) varsa 10, yoksa 0. `max` her
 * zaman 25'tir (15 + 10).
 */

import { Localized } from "@/lib/content/types";
import { GeoCheckResult, statusFor } from "@/lib/tools/geo/types";
import { extractJsonLdBlocks, collectTypes } from "@/lib/tools/geo/json-ld";

const MAX_SCORE = 25;
const RATIO_MAX_SCORE = 15;
const VISIBLE_QA_SCORE = 10;
const RATIO_THRESHOLD = 0.5;
const MIN_QUESTION_HEADINGS = 3;

const H2_REGEX = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
const H3_REGEX = /<h3[^>]*>([\s\S]*?)<\/h3>/gi;
const DETAILS_REGEX = /<details[^>]*>/i;

/** Verilen başlık regex'iyle sayfadan metinleri çıkarır — iç etiketler temizlenir. */
function extractHeadingTexts(html: string, headingRegex: RegExp): string[] {
  const texts: string[] = [];
  const regex = new RegExp(headingRegex);
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    const raw = match[1] ?? "";
    texts.push(raw.replace(/<[^>]+>/g, "").trim());
  }
  return texts;
}

/** Sayfadaki JSON-LD bloklarından herhangi birinde `FAQPage` @type'ı var mı. */
function hasFaqPageType(pageHtml: string): boolean {
  const blocks = extractJsonLdBlocks(pageHtml);
  return blocks.some((block) => collectTypes(block.parsed).includes("FAQPage"));
}

export function checkQuestionH2(pageHtml: string): GeoCheckResult {
  const h2Texts = extractHeadingTexts(pageHtml, H2_REGEX);
  const h3Texts = extractHeadingTexts(pageHtml, H3_REGEX);

  const findings: Array<Localized<string>> = [];

  let ratioScore: number;
  if (h2Texts.length === 0) {
    ratioScore = 0;
    findings.push({
      tr: "Doküman: sayfada hiç H2 başlığı yok; soru odaklı yapı ölçülemedi.",
      en: "Document: the page has no H2 headings; question-oriented structure could not be measured.",
    });
  } else {
    const questionCount = h2Texts.filter((text) => text.includes("?")).length;
    const ratio = questionCount / h2Texts.length;
    ratioScore =
      ratio >= RATIO_THRESHOLD
        ? RATIO_MAX_SCORE
        : Math.round((RATIO_MAX_SCORE * ratio) / RATIO_THRESHOLD);
    if (ratioScore < RATIO_MAX_SCORE) {
      findings.push({
        tr: "Doküman: H2 başlıklarının en az yarısı soru biçiminde değil; soru oranı düşük.",
        en: "Document: fewer than half of the H2 headings are phrased as questions; the question ratio is low.",
      });
    }
  }

  const faqPagePresent = hasFaqPageType(pageHtml);
  const detailsPresent = DETAILS_REGEX.test(pageHtml);
  const questionHeadingCount = [...h2Texts, ...h3Texts].filter((text) => text.endsWith("?")).length;
  const threeQuestionHeadingsPresent = questionHeadingCount >= MIN_QUESTION_HEADINGS;
  const visibleQaPresent = faqPagePresent || detailsPresent || threeQuestionHeadingsPresent;
  const visibleQaScore = visibleQaPresent ? VISIBLE_QA_SCORE : 0;

  if (!visibleQaPresent) {
    findings.push({
      tr: "Doküman: görünür bir soru-cevap yapısı yok — FAQPage şeması, detay/accordion öğesi veya en az 3 soru başlığı bulunamadı.",
      en: "Document: no visible question-and-answer structure exists — no FAQPage schema, details/accordion element, or at least 3 question headings were found.",
    });
  }

  const score = ratioScore + visibleQaScore;

  const summary: Localized<string> = {
    tr: `Soru biçimli başlıklar ve görünür soru-cevap yapısı, üretken arama sistemlerinin doğrudan alıntılanabilir cevap üretmesini destekler: soru oranı puanı ${ratioScore}/${RATIO_MAX_SCORE}, görünür soru-cevap puanı ${visibleQaScore}/${VISIBLE_QA_SCORE}.`,
    en: `Question-phrased headings and a visible question-and-answer structure help generative search systems produce directly quotable answers: question-ratio score ${ratioScore}/${RATIO_MAX_SCORE}, visible Q&A score ${visibleQaScore}/${VISIBLE_QA_SCORE}.`,
  };

  return {
    id: "question-h2",
    score,
    max: MAX_SCORE,
    status: statusFor(score, MAX_SCORE),
    summary,
    findings,
  };
}
