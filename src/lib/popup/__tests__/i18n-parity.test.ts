import { describe, it, expect } from "vitest";
import tr from "../../../../messages/tr.json";
import en from "../../../../messages/en.json";
import { PROBLEMS } from "../problems";
import { PERSONAS } from "../personas";

function flatKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    return typeof v === "object" && v !== null && !Array.isArray(v)
      ? flatKeys(v as Record<string, unknown>, key)
      : [key];
  });
}

describe("i18n parity — popup namespace", () => {
  it("TR ve EN aynı popup.* key setine sahip", () => {
    const trKeys = flatKeys(tr).filter((k) => k.startsWith("popup."));
    const enKeys = flatKeys(en).filter((k) => k.startsWith("popup."));
    expect(trKeys.sort()).toEqual(enKeys.sort());
  });

  it("her problem için TR ve EN metni var", () => {
    const trKeys = new Set(flatKeys(tr));
    for (const p of PROBLEMS) {
      expect(trKeys.has(p.i18nKey)).toBe(true);
    }
  });

  it("her persona için label + description var", () => {
    const trKeys = new Set(flatKeys(tr));
    for (const persona of PERSONAS) {
      expect(trKeys.has(persona.labelKey)).toBe(true);
      expect(trKeys.has(persona.descriptionKey)).toBe(true);
    }
  });
});
