import { describe, it, expect } from "vitest";
import { buildPopupContextBlock } from "../indoles-agent";

describe("buildPopupContextBlock", () => {
  it("ctx null ise boş string", () => {
    expect(buildPopupContextBlock(null, "tr")).toBe("");
  });

  it("TR persona + problems bloğu üretir (donusum-teknoloji)", () => {
    const block = buildPopupContextBlock(
      { persona: "donusum-teknoloji", problems: ["Manuel süreç yavaşlatıyor.", "Verim ölçümü yok."] },
      "tr"
    );
    expect(block).toContain("Dönüşüm ve Teknoloji");
    expect(block).toContain("Manuel süreç yavaşlatıyor.");
    expect(block).toContain("methodical");
  });

  it("EN ticaret persona dinamik ton (buyume-pazarlar)", () => {
    const block = buildPopupContextBlock(
      { persona: "buyume-pazarlar", problems: ["ROAS düştü."] },
      "en"
    );
    expect(block).toContain("Growth & New Markets");
    expect(block).toContain("dynamic");
  });
});
