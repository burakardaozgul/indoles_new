import { describe, it, expect } from "vitest";
import { localeHref } from "../locale-href";

describe("localeHref", () => {
  it("çevrilmiş ilk segmenti hedef dile map eder", () => {
    expect(localeHref("/hizmetler", "en")).toBe("/en/services");
    expect(localeHref("/services", "tr")).toBe("/tr/hizmetler");
    expect(localeHref("/yazilar", "en")).toBe("/en/articles");
  });

  it("detay sayfalarında slug'ı korur — slug'lar iki dilde ortaktır", () => {
    expect(localeHref("/hizmetler/veri-altyapisi", "en")).toBe(
      "/en/services/veri-altyapisi",
    );
    expect(localeHref("/case-studies/abc", "tr")).toBe("/tr/vakalar/abc");
  });

  it("haritada olmayan route'u çevirmeden taşır", () => {
    // `/v2` `routing.pathnames`'te yok; ham locale ön eki doğru davranıştır.
    expect(localeHref("/v2", "en")).toBe("/en/v2");
  });

  it("ana sayfada yalnız locale ön ekini döndürür", () => {
    expect(localeHref("/", "en")).toBe("/en");
    expect(localeHref("", "tr")).toBe("/tr");
  });
});
