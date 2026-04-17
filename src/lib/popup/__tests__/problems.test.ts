import { describe, it, expect } from "vitest";
import { PROBLEMS, getProblemsForPersona, getProblemBySlug, getAllProblemSlugs } from "../problems";

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
