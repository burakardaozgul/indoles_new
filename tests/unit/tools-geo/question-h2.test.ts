import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { checkQuestionH2 } from "@/lib/tools/geo/question-h2";

const fx = (n: string) => readFileSync(`tests/fixtures/geo/${n}`, "utf8");

describe("checkQuestionH2", () => {
  it("page-qa: 5 H2'nin 3'ü soru (oran 0.6 >= 0.5 → 15) + görünür SSS (<details>) → 25/25", () => {
    const r = checkQuestionH2(fx("page-qa.html"));
    expect(r.score).toBe(25);
    expect(r.max).toBe(25);
    expect(r.status).toBe("pass");
  });

  it("page-flat: soru yok, SSS yok → 0 + 0 = 0 fail", () => {
    const r = checkQuestionH2(fx("page-flat.html"));
    expect(r.score).toBe(0);
    expect(r.status).toBe("fail");
    expect(r.findings.length).toBeGreaterThan(0);
  });

  it("H2 hiç yoksa 0 + bulgu", () => {
    const html = `<html><body><h1>Başlık</h1><p>H2 yok.</p></body></html>`;
    const r = checkQuestionH2(html);
    expect(r.score).toBe(0);
    expect(r.findings.some((f) => f.tr.includes("H2"))).toBe(true);
  });

  it("soru oranı >= 0.5 altında orantılı puanlanır (Math.round(15 * oran / 0.5))", () => {
    // 4 H2, 1 tanesi soru → oran 0.25 → round(15*0.25/0.5) = round(7.5) = 8
    const html = `
      <h2>Soru mu bu?</h2>
      <h2>Başlık bir</h2>
      <h2>Başlık iki</h2>
      <h2>Başlık üç</h2>
    `;
    const r = checkQuestionH2(html);
    expect(r.score).toBe(8);
  });

  it("FAQPage @type varsa görünür soru-cevap puanı verilir (<details> ve 3 soru başlığı olmasa bile)", () => {
    const html = `
      <html><head>
        <script type="application/ld+json">
          {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[]}
        </script>
      </head><body>
        <h2>Başlık bir</h2>
        <h2>Başlık iki</h2>
      </body></html>
    `;
    const r = checkQuestionH2(html);
    // oran 0/2 = 0 → 0 ; görünür SSS FAQPage ile 10 → toplam 10
    expect(r.score).toBe(10);
  });

  it("3 soru başlığı (h2+h3) görünür SSS sayılır — FAQPage veya <details> olmadan", () => {
    const html = `
      <h2>Bu bir soru mu?</h2>
      <h2>Başlık iki</h2>
      <h3>Bu da soru mu?</h3>
      <h3>Üçüncü soru mu?</h3>
    `;
    const r = checkQuestionH2(html);
    // oran 1/2 = 0.5 >= 0.5 → 15 ; görünür SSS: 3 soru başlığı → 10 → toplam 25
    expect(r.score).toBe(25);
  });
});
