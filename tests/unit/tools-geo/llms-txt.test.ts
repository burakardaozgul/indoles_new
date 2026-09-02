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

  it("boş string → 0 fail", () => {
    const r = checkLlmsTxt("");
    expect(r.score).toBe(0);
    expect(r.status).toBe("fail");
  });

  it("yalnız whitespace → 0 fail", () => {
    const r = checkLlmsTxt("   \n  ");
    expect(r.score).toBe(0);
    expect(r.status).toBe("fail");
  });

  // Final review C2b — ReDoS. `/^\s*-\s*\[[^\]]+\]\([^)]+\)/m` bütün gövde
  // üzerinde `/m` ile çalışınca, yalnız boşluk/yeni-satır içeren büyük bir
  // gövdede kuadratik davranıyordu (review ölçtü: 400 KB → 104 ms).
  // Satır-satır tarama bu sınıfı ortadan kaldırır — aynı boyuttaki (biçimsiz)
  // payload artık doğrusal sürede döner.
  it("ReDoS payload'ı (400 KB tamamen-newline, biçimsiz) artık hızlı döner", () => {
    const payload = "\n".repeat(400_000);
    const t0 = performance.now();
    const r = checkLlmsTxt(payload);
    const elapsed = performance.now() - t0;
    expect(elapsed).toBeLessThan(50);
    // Yalnız whitespace: `trim() === ""` dalı — 0 fail (mevcut davranış).
    expect(r.score).toBe(0);
  });

  it("ReDoS payload'ı whitespace-olmayan içerikle (400 KB, biçimsiz metin) de hızlı döner", () => {
    // trim() boş DEĞİL (whitespace-only kısa yolunu atlar) — satır-satır
    // tarama gerçekten çalışır, yine de doğrusal sürede biter.
    const payload = "x " + "\n".repeat(400_000);
    const t0 = performance.now();
    const r = checkLlmsTxt(payload);
    const elapsed = performance.now() - t0;
    expect(elapsed).toBeLessThan(50);
    expect(r.score).toBe(10); // biçimsiz: metin var, markdown link satırı yok
  });

  it("markdown link satırı MAX_LINES_SCANNED içindeyse yine bulunur (davranış korunur)", () => {
    const body = "\n".repeat(100) + "- [Ana sayfa](https://x.com): açıklama\n";
    expect(checkLlmsTxt(body).score).toBe(15);
  });
});
