import { describe, expect, it } from "vitest";
import { recipients } from "../client";

describe("recipients", () => {
  const FALLBACK = "digital@indoles.com.tr";

  it("virgülle ayrılmış listeyi diziye çevirir", () => {
    expect(
      recipients("digital@indoles.com.tr,burak@indoles.com.tr,b.a.ozgul@gmail.com", FALLBACK),
    ).toEqual(["digital@indoles.com.tr", "burak@indoles.com.tr", "b.a.ozgul@gmail.com"]);
  });

  it("boşlukları temizler — panelden yapıştırılan liste boşluklu gelir", () => {
    expect(recipients("a@x.com , b@y.com", FALLBACK)).toEqual(["a@x.com", "b@y.com"]);
  });

  it("tek adresi de dizi döndürür", () => {
    expect(recipients("a@x.com", FALLBACK)).toEqual(["a@x.com"]);
  });

  it("env tanımsızsa fallback'e düşer", () => {
    expect(recipients(undefined, FALLBACK)).toEqual([FALLBACK]);
  });

  it("boş veya yalnız virgülden oluşan değer sessizce kimseye gitmez, fallback'e düşer", () => {
    expect(recipients("", FALLBACK)).toEqual([FALLBACK]);
    expect(recipients(" , , ", FALLBACK)).toEqual([FALLBACK]);
  });
});
