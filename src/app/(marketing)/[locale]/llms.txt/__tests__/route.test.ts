import { describe, it, expect } from "vitest";
import { GET, generateStaticParams } from "../route";

/**
 * Route seviyesinde doğrulama: denetim G-11 öncesi bu path'ler hiç
 * tanımlı değildi, `src/app/(marketing)/[locale]/[...rest]/page.tsx`
 * catch-all'a düşüp 404 dönüyordu. Üretim mantığı `src/lib/seo/llms.ts`'te
 * ayrı test edildiği için burada yalnız route kablolaması (status,
 * content-type, geçersiz locale, static param listesi) doğrulanır.
 */

function req(path: string): Request {
  return new Request(`http://localhost${path}`);
}

describe("GET /[locale]/llms.txt", () => {
  it("tr: 200 ve text/markdown döner", async () => {
    const res = await GET(req("/tr/llms.txt"), {
      params: Promise.resolve({ locale: "tr" }),
    });
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("text/markdown; charset=utf-8");
    const body = await res.text();
    expect(body).toContain("## Vaka çalışmaları");
  });

  it("en: 200 ve text/markdown döner", async () => {
    const res = await GET(req("/en/llms.txt"), {
      params: Promise.resolve({ locale: "en" }),
    });
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("text/markdown; charset=utf-8");
    const body = await res.text();
    expect(body).toContain("## Case studies");
  });

  it("desteklenmeyen locale: 404", async () => {
    const res = await GET(req("/de/llms.txt"), {
      params: Promise.resolve({ locale: "de" }),
    });
    expect(res.status).toBe(404);
  });
});

describe("generateStaticParams", () => {
  it("yalnız tr ve en için statik param üretir", () => {
    expect(generateStaticParams()).toEqual([
      { locale: "tr" },
      { locale: "en" },
    ]);
  });
});
