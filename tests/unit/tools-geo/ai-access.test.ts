import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { checkAiAccess, AI_CRAWLERS } from "@/lib/tools/geo/ai-access";

const fx = (n: string) => readFileSync(`tests/fixtures/geo/${n}`, "utf8");

describe("checkAiAccess", () => {
  it("robots yoksa tam puan + beyansız notu", () => {
    const r = checkAiAccess(null, "/");
    expect(r.score).toBe(25);
    expect(r.status).toBe("pass");
    expect(r.findings.some((f) => f.tr.includes("beyansız"))).toBe(true);
  });

  it("tümü açık → 25", () =>
    expect(checkAiAccess(fx("robots-open.txt"), "/").score).toBe(25));

  it("tümü engelli → 0 fail", () => {
    const r = checkAiAccess(fx("robots-blocked.txt"), "/blog/x");
    expect(r.score).toBe(0);
    expect(r.status).toBe("fail");
    expect(r.findings.length).toBeGreaterThanOrEqual(1); // engelli botlar listelenir
  });

  it("karışık: GPTBot engelli, ClaudeBot /private dışında izinli → 9/10 izinli = 23", () => {
    const r = checkAiAccess(fx("robots-mixed.txt"), "/blog/x");
    expect(r.score).toBe(Math.round((25 * 9) / 10));
    expect(r.findings.some((f) => f.tr.includes("GPTBot"))).toBe(true);
  });

  it("en-uzun-eşleşme: ClaudeBot /private/a'da engelli", () => {
    const r = checkAiAccess(fx("robots-mixed.txt"), "/private/a");
    expect(r.score).toBe(Math.round((25 * 8) / 10));
  });

  it("AI_CRAWLERS 10 bilinen bot içerir", () => {
    expect(AI_CRAWLERS.length).toBe(10);
  });

  it("boş Disallow → kısıt yok, tümü izinli, skor 25", () => {
    const r = checkAiAccess("User-agent: *\nDisallow:", "/blog/x");
    expect(r.score).toBe(25);
    expect(r.status).toBe("pass");
  });
});
