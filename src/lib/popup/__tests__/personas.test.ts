import { describe, it, expect } from "vitest";
import { PERSONAS, isPersonaSlug, getPersonaLabel, getPersonaDef, getPersonaLocalizedLabel } from "../personas";

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

describe("getPersonaDef", () => {
  it("returns full def for valid slug", () => {
    const def = getPersonaDef("donusum-teknoloji");
    expect(def.slug).toBe("donusum-teknoloji");
    expect(def.pillars).toEqual(["transform", "build"]);
    expect(def.i18nKey).toBe("popup.persona.donusum-teknoloji");
    expect(def.labelKey).toBe("popup.persona.donusum-teknoloji.label");
    expect(def.descriptionKey).toBe("popup.persona.donusum-teknoloji.description");
  });

  it("throws on unknown slug", () => {
    expect(() =>
      // @ts-expect-error — intentional invalid input for runtime contract
      getPersonaDef("nonexistent")
    ).toThrow(/Unknown persona slug/);
  });
});

describe("getPersonaLocalizedLabel", () => {
  it("TR donusum-teknoloji label döner", () => {
    expect(getPersonaLocalizedLabel("donusum-teknoloji", "tr")).toBe("Dönüşüm ve Teknoloji");
  });

  it("EN donusum-teknoloji label döner", () => {
    expect(getPersonaLocalizedLabel("donusum-teknoloji", "en")).toBe("Transformation & Technology");
  });

  it("TR buyume-pazarlar label döner", () => {
    expect(getPersonaLocalizedLabel("buyume-pazarlar", "tr")).toBe("Büyüme ve Yeni Pazarlar");
  });

  it("EN buyume-pazarlar label döner", () => {
    expect(getPersonaLocalizedLabel("buyume-pazarlar", "en")).toBe("Growth & New Markets");
  });
});
