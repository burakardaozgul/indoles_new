import { describe, it, expect } from "vitest";
import { PROBLEMS, getProblemsForPersona, getProblemBySlug, getAllProblemSlugs } from "../problems";
import { resolveProblemText } from "../problems";
import tr from "../../../../messages/tr.json";
import en from "../../../../messages/en.json";

describe("problems", () => {
  it("toplam 20 problem tanımlar", () => {
    expect(PROBLEMS.length).toBe(20);
  });

  it("her persona için tam 10 problem vardır", () => {
    expect(getProblemsForPersona("donusum-teknoloji").length).toBe(10);
    expect(getProblemsForPersona("buyume-pazarlar").length).toBe(10);
  });

  it("her problem unique slug'a sahiptir", () => {
    const slugs = PROBLEMS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("her problem en az bir service ve pillar taşır", () => {
    for (const p of PROBLEMS) {
      expect(p.services.length).toBeGreaterThanOrEqual(1);
      expect(p.pillars.length).toBeGreaterThanOrEqual(1);
      expect(p.i18nKey).toMatch(/^popup\.problems\./);
    }
  });

  it("slug ile problem bulunabilir", () => {
    const p = getProblemBySlug("reklam-maliyeti-artisi");
    expect(p?.persona).toBe("buyume-pazarlar");
  });

  it("getAllProblemSlugs tüm slug'ları döner", () => {
    const slugs = getAllProblemSlugs();
    expect(slugs.length).toBe(20);
    expect(new Set(slugs).size).toBe(20);
  });

  it("getProblemBySlug bilinmeyen slug için undefined döner", () => {
    expect(getProblemBySlug("nonexistent-slug")).toBeUndefined();
  });
});

describe("resolveProblemText", () => {
  it("TR metni döner", () => {
    const expected = (tr as unknown as { popup: { problems: Record<string, string> } }).popup.problems["manuel-surec-yavaslatiyor"];
    expect(resolveProblemText("manuel-surec-yavaslatiyor", "tr")).toBe(expected);
  });

  it("EN metni döner", () => {
    const expected = (en as unknown as { popup: { problems: Record<string, string> } }).popup.problems["reklam-maliyeti-artisi"];
    expect(resolveProblemText("reklam-maliyeti-artisi", "en")).toBe(expected);
  });

  it("bilinmeyen slug için slug'ı döner (fallback)", () => {
    expect(resolveProblemText("unknown-xxx", "tr")).toBe("unknown-xxx");
  });
});
