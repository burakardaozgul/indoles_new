import { describe, it, expect } from "vitest";
import { checkLlmsTxt } from "@/lib/tools/geo/llms-txt";

describe("checkLlmsTxt", () => {
  it("yok → 0", () => expect(checkLlmsTxt(null).score).toBe(0));

  it("biçimli → 15", () =>
    expect(checkLlmsTxt("# X\n\n- [Ana sayfa](https://x.com): açıklama\n").score).toBe(15));

  it("biçimsiz düz metin → 10 partial", () => {
    const r = checkLlmsTxt("hakkımızda her şey burada");
    expect(r.score).toBe(10);
    expect(r.status).toBe("partial");
  });
});
