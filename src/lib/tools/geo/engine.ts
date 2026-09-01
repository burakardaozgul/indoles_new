/**
 * GEO motoru birleştirici — beş kalemi sırayla çalıştırır (ai-access,
 * llms-txt, json-ld, lang-signals, question-h2), toplam skoru ve skor
 * bandını hesaplar. `id` ve `scannedAt` bu katmanın sorumluluğunda değildir
 * (çağıran taraf tarama kaydı oluştururken ekler). Spec §2, Görev 6.
 */

import { checkAiAccess } from "@/lib/tools/geo/ai-access";
import { checkLlmsTxt } from "@/lib/tools/geo/llms-txt";
import { checkJsonLd } from "@/lib/tools/geo/json-ld";
import { checkLangSignals } from "@/lib/tools/geo/lang-signals";
import { checkQuestionH2 } from "@/lib/tools/geo/question-h2";
import { bandFor, GeoScanInput, GeoScanResult } from "@/lib/tools/geo/types";

export function runGeoScan(input: GeoScanInput): Omit<GeoScanResult, "id" | "scannedAt"> {
  const urlPath = new URL(input.url).pathname;

  const checks = [
    checkAiAccess(input.robotsTxt, urlPath),
    checkLlmsTxt(input.llmsTxt),
    checkJsonLd(input.pageHtml),
    checkLangSignals(input.pageHtml, input.url),
    checkQuestionH2(input.pageHtml),
  ];

  const totalScore = checks.reduce((sum, check) => sum + check.score, 0);

  return {
    url: input.url,
    totalScore,
    band: bandFor(totalScore),
    checks,
  };
}
