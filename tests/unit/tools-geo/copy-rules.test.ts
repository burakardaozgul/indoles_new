import { describe, expect, it } from "vitest";
import { checkAiAccess } from "@/lib/tools/geo/ai-access";
import { checkLlmsTxt } from "@/lib/tools/geo/llms-txt";
import { checkJsonLd } from "@/lib/tools/geo/json-ld";
import { checkLangSignals } from "@/lib/tools/geo/lang-signals";
import { checkQuestionH2 } from "@/lib/tools/geo/question-h2";
import type { GeoCheckResult } from "@/lib/tools/geo/types";

/**
 * Motor metinleri kullanıcıya konuşur (spec §8): kaynak öneki yok, puan
 * parçası yok, tek cümle. Fixture'lar her kalemin pass / partial / fail
 * dallarını gezer ki HER dizge kurala girsin.
 */
const HTML_EMPTY = "<html><body><p>merhaba</p></body></html>";
const HTML_RICH = `<html lang="tr"><head>
<link rel="canonical" href="https://ornek.com.tr/">
<link rel="alternate" hreflang="tr" href="https://ornek.com.tr/tr">
<link rel="alternate" hreflang="en" href="https://ornek.com.tr/en">
<link rel="alternate" hreflang="x-default" href="https://ornek.com.tr/">
<script type="application/ld+json">{"@type":"Organization","name":"X"}</script>
<script type="application/ld+json">{"@type":"FAQPage"}</script>
</head><body><h2>Neden?</h2><h2>Nasıl?</h2><h2>Ne zaman?</h2><details></details></body></html>`;
const HTML_BROKEN_LD = `<html><head><script type="application/ld+json">{bozuk</script></head><body><h2>Başlık</h2><h2>Neden?</h2></body></html>`;

const results: GeoCheckResult[] = [
  checkAiAccess(null, "/"),
  checkAiAccess("User-agent: GPTBot\nDisallow: /\n", "/"),
  checkAiAccess("User-agent: *\nAllow: /\n", "/"),
  checkLlmsTxt(null),
  checkLlmsTxt("# Site\nSadece metin"),
  checkLlmsTxt("# Site\n- [Ana sayfa](https://ornek.com.tr): özet"),
  checkJsonLd(HTML_EMPTY),
  checkJsonLd(HTML_RICH),
  checkJsonLd(HTML_BROKEN_LD),
  checkLangSignals(HTML_EMPTY, "https://ornek.com.tr/"),
  checkLangSignals(HTML_RICH, "https://ornek.com.tr/"),
  checkQuestionH2(HTML_EMPTY),
  checkQuestionH2(HTML_RICH),
  checkQuestionH2(HTML_BROKEN_LD),
];

const words = (s: string): number => s.trim().split(/\s+/).length;
const sentences = (s: string): number => (s.match(/[.!?](\s|$)/g) ?? []).length;

describe("motor metin kuralları (spec §8)", () => {
  it.each(results.map((r) => [r.id, r] as const))("%s — özet ve bulgular kullanıcı dilinde", (_id, r) => {
    for (const loc of ["tr", "en"] as const) {
      const s = r.summary[loc];
      expect(s, `${r.id}/${loc} özet önek`).not.toMatch(/^(Doküman|Document|Sayfa|Page):/);
      expect(s, `${r.id}/${loc} özet puan parçası`).not.toMatch(/\b\d+\s*\/\s*\d+\b/);
      expect(sentences(s), `${r.id}/${loc} özet tek cümle`).toBe(1);
      expect(words(s), `${r.id}/${loc} özet uzunluk`).toBeLessThanOrEqual(loc === "tr" ? 22 : 26);
      for (const f of r.findings) {
        expect(f[loc], `${r.id}/${loc} bulgu önek`).not.toMatch(/^(Doküman|Document|Sayfa|Page):/);
        expect(sentences(f[loc]), `${r.id}/${loc} bulgu tek cümle`).toBe(1);
        expect(f[loc].trim().length, `${r.id}/${loc} bulgu boş`).toBeGreaterThan(20);
      }
    }
  });
});
