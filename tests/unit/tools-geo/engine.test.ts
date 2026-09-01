import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { runGeoScan } from "@/lib/tools/geo/engine";
import { bandFor } from "@/lib/tools/geo/types";

const fx = (n: string) => readFileSync(`tests/fixtures/geo/${n}`, "utf8");

describe("runGeoScan", () => {
  it("toplam skor kalemlerin toplamıdır ve bant doğru", () => {
    const r = runGeoScan({ url: "https://x.com/a", pageHtml: fx("page-qa.html"), robotsTxt: null, llmsTxt: null });
    expect(r.checks).toHaveLength(5);
    expect(r.totalScore).toBe(r.checks.reduce((s, c) => s + c.score, 0));
    expect(r.band).toBe(bandFor(r.totalScore));
  });

  it("checks sırası: ai-access, llms-txt, json-ld, lang-signals, question-h2", () => {
    const r = runGeoScan({ url: "https://x.com/a", pageHtml: fx("page-flat.html"), robotsTxt: null, llmsTxt: null });
    expect(r.checks.map((c) => c.id)).toEqual(["ai-access", "llms-txt", "json-ld", "lang-signals", "question-h2"]);
  });

  it("ai-access kontrolüne new URL(input.url).pathname geçirilir", () => {
    const robotsTxt = "User-agent: GPTBot\nDisallow: /private$\n";
    const openResult = runGeoScan({
      url: "https://x.com/public",
      pageHtml: fx("page-flat.html"),
      robotsTxt,
      llmsTxt: null,
    });
    const blockedResult = runGeoScan({
      url: "https://x.com/private",
      pageHtml: fx("page-flat.html"),
      robotsTxt,
      llmsTxt: null,
    });
    const openScore = openResult.checks.find((c) => c.id === "ai-access")!.score;
    const blockedScore = blockedResult.checks.find((c) => c.id === "ai-access")!.score;
    expect(blockedScore).toBeLessThan(openScore);
  });

  it("id ve scannedAt alanları döndürülmez", () => {
    const r = runGeoScan({ url: "https://x.com/a", pageHtml: fx("page-flat.html"), robotsTxt: null, llmsTxt: null });
    expect(r).not.toHaveProperty("id");
    expect(r).not.toHaveProperty("scannedAt");
  });

  it("CPU bütçesi: 500 KB fixture < 50 ms", () => {
    const big = fx("page-qa.html").repeat(200).slice(0, 500_000);
    const t0 = performance.now();
    runGeoScan({ url: "https://x.com/a", pageHtml: big, robotsTxt: null, llmsTxt: null });
    expect(performance.now() - t0).toBeLessThan(50);
  });
});
