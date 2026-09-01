import { describe, it, expect } from "vitest";
import { checkLangSignals } from "@/lib/tools/geo/lang-signals";

describe("checkLangSignals", () => {
  const single = `<html lang="tr"><head><link rel="canonical" href="https://x.com/a"/></head><body/></html>`;
  it("tek dilli, lang+canonical doğru → 15 (normalize)", () =>
    expect(checkLangSignals(single, "https://x.com/a").score).toBe(15));

  it("lang yok → normalize 8", () => {
    const html = `<html><head><link rel="canonical" href="https://x.com/a"/></head></html>`;
    expect(checkLangSignals(html, "https://x.com/a").score).toBe(Math.round((5 * 15) / 10));
  });

  const multi = `<html lang="tr"><head><link rel="canonical" href="https://x.com/a"/>
<link rel="alternate" hreflang="tr" href="https://x.com/a"/>
<link rel="alternate" hreflang="en" href="https://x.com/en/a"/>
<link rel="alternate" hreflang="x-default" href="https://x.com/a"/></head></html>`;
  it("tam hreflang seti → 15/15 normalizesiz", () =>
    expect(checkLangSignals(multi, "https://x.com/a").score).toBe(15));

  it("hreflang var ama x-default yok → 10", () => {
    // Not: brief'teki orijinal regex `[^/]*\/>` kullanır. href değeri
    // "https://x.com/a" kendi içinde "/" taşıdığı için `[^/]*` bu karakter
    // sınıfını hiç aşamaz ve "/>" ile hiçbir konumda eşleşmez — sonuçta
    // `.replace(...)` eşleşme bulamaz, `noDefault === multi` kalır (node ile
    // doğrulandı) ve test amacını (x-default satırını çıkarmak) sağlamaz.
    // `[^>]*` ile düzeltildi — niyet (x-default satırının kaldırılması)
    // korunuyor, davranış değişmiyor.
    const noDefault = multi.replace(/<link rel="alternate" hreflang="x-default"[^>]*\/>/, "");
    expect(checkLangSignals(noDefault, "https://x.com/a").score).toBe(10);
  });
});
