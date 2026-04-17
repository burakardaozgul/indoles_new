import { describe, it, expect } from "vitest";
import { PERSONAS, isPersonaSlug, getPersonaLabel } from "../personas";

describe("personas", () => {
  it("tam olarak iki persona tanımlar", () => {
    expect(PERSONAS.length).toBe(2);
    expect(PERSONAS.map((p) => p.slug)).toEqual([
      "donusum-teknoloji",
      "buyume-pazarlar",
    ]);
  });

  it("her persona'nın pillar mapping'i vardır", () => {
    const donusum = PERSONAS.find((p) => p.slug === "donusum-teknoloji")!;
    expect(donusum.pillars).toEqual(["transform", "build"]);
    const buyume = PERSONAS.find((p) => p.slug === "buyume-pazarlar")!;
    expect(buyume.pillars).toEqual(["growth"]);
  });

  it("isPersonaSlug type guard gibi çalışır", () => {
    expect(isPersonaSlug("donusum-teknoloji")).toBe(true);
    expect(isPersonaSlug("buyume-pazarlar")).toBe(true);
    expect(isPersonaSlug("random")).toBe(false);
  });

  it("getPersonaLabel i18n key döner", () => {
    expect(getPersonaLabel("donusum-teknoloji")).toBe("popup.persona.donusum-teknoloji.label");
  });
});
