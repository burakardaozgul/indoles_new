import { describe, it, expect } from "vitest";
import { buildVerification } from "../verification";

describe("buildVerification", () => {
  it("hiçbir kod tanımlı değilse alan hiç basılmaz", () => {
    // Boş `verification` nesnesi Next'e boş etiketler bastırır;
    // tanımsız bırakmak doğru davranış.
    expect(buildVerification({})).toBeUndefined();
  });

  it("Google kodunu tek başına taşır", () => {
    expect(buildVerification({ google: "abc123" })).toEqual({ google: "abc123" });
  });

  it("Bing kodunu msvalidate.01 olarak taşır", () => {
    // Next'in `verification` tipinde Bing için ayrı alan yok; Bing'in
    // beklediği meta adı `msvalidate.01`.
    expect(buildVerification({ bing: "BING999" })).toEqual({
      other: { "msvalidate.01": "BING999" },
    });
  });

  it("ikisini birden taşır", () => {
    expect(buildVerification({ google: "g", bing: "b" })).toEqual({
      google: "g",
      other: { "msvalidate.01": "b" },
    });
  });

  it("boş dizeyi tanımsız sayar", () => {
    // Vercel'de tanımlanmış ama boş bırakılmış değişken, tanımsızla aynı.
    expect(buildVerification({ google: "", bing: "" })).toBeUndefined();
  });

  it("baştaki ve sondaki boşluğu temizler", () => {
    // Panelden kopyalanan kodlar sıklıkla boşlukla geliyor.
    expect(buildVerification({ google: "  abc  " })).toEqual({ google: "abc" });
  });
});
