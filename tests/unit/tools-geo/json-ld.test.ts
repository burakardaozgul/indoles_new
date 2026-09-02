import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { checkJsonLd } from "@/lib/tools/geo/json-ld";

const fx = (n: string) => readFileSync(`tests/fixtures/geo/${n}`, "utf8");

describe("checkJsonLd", () => {
  it("zengin graf: 8 + 3 tip*2 + FAQ 4 = 18+", () => {
    const r = checkJsonLd(fx("page-rich.html"));
    expect(r.score).toBeGreaterThanOrEqual(16);
    expect(r.max).toBe(20);
  });

  it("hiç yok → 0 fail", () => expect(checkJsonLd(fx("page-bare.html")).status).toBe("fail"));

  it("bozuk blok → partial + bulgu", () => {
    const r = checkJsonLd(fx("page-broken-ld.html"));
    expect(r.status).toBe("partial");
    expect(r.findings.some((f) => f.tr.includes("çözümlenemiyor") || f.tr.includes("geçersiz söz dizimi"))).toBe(true);
  });
});
