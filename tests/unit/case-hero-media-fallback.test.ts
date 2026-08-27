import { describe, it, expect } from "vitest";
import { resolveHeroMedia } from "@/app/(marketing)/[locale]/vakalar/[slug]/page";
import { CASES, getCaseBySlug } from "@/lib/content/cases";
import type { CaseMedia } from "@/lib/content/types";

/**
 * Hero medya fallback (denetim paketi §1) — `heroMedia` doldurulmamış
 * vakada sayfa başlıktan doğrudan koyu metrik bandına düşüyordu, görsel
 * çapa yoktu. `resolveHeroMedia` saf bir çözümleyici: `heroMedia` varsa
 * dokunmaz, yoksa kart kapağını (`cover`) hero konumuna taşır.
 */

const cover: CaseMedia = {
  type: "image",
  src: "/work/ornek/kapak.jpg",
  width: 2048,
  height: 2560,
  alt: { tr: "Kapak alt metni", en: "Cover alt text" },
};

const heroMedia: CaseMedia = {
  type: "image",
  src: "/work/ornek/vitrin.jpg",
  width: 1665,
  height: 1040,
  alt: { tr: "Hero alt metni", en: "Hero alt text" },
  caption: { tr: "Hero altyazısı", en: "Hero caption" },
};

describe("resolveHeroMedia", () => {
  it("heroMedia doluysa aynen döner, cover'a dokunmaz", () => {
    const result = resolveHeroMedia({ heroMedia, cover });
    expect(result).toBe(heroMedia);
  });

  it("heroMedia yoksa cover'dan üretir", () => {
    const result = resolveHeroMedia({ cover });
    expect(result).toEqual(cover);
    // Kopya döner — kaynak referansla aynı nesne değildir.
    expect(result).not.toBe(cover);
  });

  it("cover'ın alt metnini korur (FIG.00 altyazı sözleşmesi CaseHeroMedia'da kalır)", () => {
    const result = resolveHeroMedia({ cover });
    expect(result?.alt.tr).toBe("Kapak alt metni");
    expect(result?.alt.en).toBe("Cover alt text");
  });

  it("ikisi de yoksa undefined döner", () => {
    const result = resolveHeroMedia({});
    expect(result).toBeUndefined();
  });

  it("gerçek içerikte heroMedia'sız her vaka için cover'dan bir hero üretir", () => {
    const withoutHero = CASES.filter((c) => !c.heroMedia);
    expect(withoutHero.length).toBeGreaterThan(0);
    for (const c of withoutHero) {
      const result = resolveHeroMedia(c);
      expect(result).toEqual(c.cover);
    }
  });

  it("gerçek içerikte heroMedia'lı vakalarda davranış değişmez", () => {
    const withHero = CASES.filter((c) => c.heroMedia);
    expect(withHero.length).toBeGreaterThan(0);
    for (const c of withHero) {
      const result = resolveHeroMedia(c);
      expect(result).toBe(c.heroMedia);
    }
  });

  it("örnek slug (gymwolves-12-kat-satis, heroMedia yok) cover'dan hero üretir", () => {
    const c = getCaseBySlug("gymwolves-12-kat-satis");
    expect(c).toBeDefined();
    expect(c?.heroMedia).toBeUndefined();
    const result = resolveHeroMedia(c!);
    expect(result).toBeDefined();
    expect(result).toEqual(c?.cover);
  });
});
