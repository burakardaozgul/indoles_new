import { describe, it, expect } from "vitest";
import { GET } from "../route";

/**
 * Regresyon testi: `src/app/llms.txt/route.ts` `src/lib/seo/llms.ts`e
 * taşındıktan sonra (denetim G-11'in per-locale route'ları eklemesiyle
 * birlikte) kök dosyanın hâlâ iki dilli, `text/markdown` içerikli ve 200
 * döndüğünü doğrular. İçerik detayı `src/lib/seo/__tests__/llms.test.ts`te.
 */
describe("GET /llms.txt", () => {
  it("200, text/markdown ve iki dili birlikte döner", async () => {
    const res = GET();
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe(
      "text/markdown; charset=utf-8",
    );
    const body = await res.text();
    expect(body).toContain("# INDOLES");
    expect(body).toContain("# INDOLES (English)");
  });
});
