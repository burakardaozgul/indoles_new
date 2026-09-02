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

  // Final review C2a — ReDoS. Review'un ölçtüğü PoC: 12 jokerli 26 baytlık
  // TEK bir Disallow satırı, 60 karakterlik bir path'e karşı `regex.test()`
  // başına ~110 ms tutuyordu (`isAllowed` bunu crawler BAŞINA — 10 kez —
  // çalıştırır). Kural artık DERLENMEDEN yok sayılır: aynı payload artık
  // milisaniyeler içinde döner ve kısıt uygulamaz (tüm botlar izinli, 25).
  it("ReDoS payload'ı (12 joker) artık hızlı döner ve kural yok sayılır", () => {
    const robots = "User-agent: *\nDisallow: /a*a*a*a*a*a*a*a*a*a*a*a*b\n";
    const longPath = "/" + "a".repeat(60);
    const t0 = performance.now();
    const r = checkAiAccess(robots, longPath);
    const elapsed = performance.now() - t0;
    expect(elapsed).toBeLessThan(50);
    expect(r.score).toBe(25);
  });

  it("kural başına joker tavanı: tam 4 joker kabul edilir (derlenir ve uygulanır)", () => {
    // "/a*a*a*a*a" → 4 "*" (aralarında 5 "a"). "/aaaaa" bu kalıpla eşleşir.
    const pattern = "/a*a*a*a*a";
    expect((pattern.match(/\*/g) ?? []).length).toBe(4);
    const r = checkAiAccess(`User-agent: *\nDisallow: ${pattern}\n`, "/aaaaa");
    expect(r.score).toBe(0);
  });

  it("kural başına joker tavanı: 5 joker aşar, kural DERLENMEZ (kısıt uygulanmaz)", () => {
    // "/a*a*a*a*a*a" → 5 "*". Derlenseydi "/aaaaaa" ile de eşleşirdi — skor
    // farkı yalnızca tavanın devreye girmesinden kaynaklanır.
    const pattern = "/a*a*a*a*a*a";
    expect((pattern.match(/\*/g) ?? []).length).toBe(5);
    const r = checkAiAccess(`User-agent: *\nDisallow: ${pattern}\n`, "/aaaaaa");
    expect(r.score).toBe(25);
  });

  it("grup başına kural tavanı: 1000'i aşan satırlar hızlıca yok sayılır", () => {
    // 4 haneli sabit-genişlikte kimlikler: "path-1150" hiçbir "path-0xyz"
    // kuralının ÖNEKİ (prefix) olmasın diye — robots.txt eşleşmesi öneke
    // dayanır (Disallow'un `$` çıpası yoksa), aksi halde yanlış bir kural
    // tesadüfen eşleşip testi anlamsızlaştırabilirdi.
    const lines = ["User-agent: *"];
    for (let i = 0; i < 1200; i++) lines.push(`Disallow: /path-${String(i).padStart(4, "0")}`);
    const robots = lines.join("\n");
    const t0 = performance.now();
    const r = checkAiAccess(robots, "/path-1150");
    const elapsed = performance.now() - t0;
    expect(elapsed).toBeLessThan(50);
    // 1150. kural (index 1150, 1151. satır) tavanın (1000) ÜZERİNDE —
    // derlenmedi, bu path'i engellemez.
    expect(r.score).toBe(25);
  });

  it("grup başına kural tavanı: 1000 sınırının İÇİNDEKİ bir kural yine uygulanır", () => {
    const lines = ["User-agent: *"];
    for (let i = 0; i < 1200; i++) lines.push(`Disallow: /path-${String(i).padStart(4, "0")}`);
    const robots = lines.join("\n");
    const r = checkAiAccess(robots, "/path-0500");
    expect(r.score).toBe(0);
  });
});
