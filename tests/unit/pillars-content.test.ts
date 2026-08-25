import { describe, it, expect } from "vitest";
import { PILLARS } from "@/lib/content/pillars";

const LOCALES = ["tr", "en"] as const;

/**
 * Pillar SSS'i (GEO).
 *
 * Üç disiplin sayfası sitemap'in en yüksek öncelikli bandında ve hizmet
 * sayfalarının üst düğümü; SSS'siz bir pillar, altındaki 12 hizmete trafik
 * gönderirken kendi sayfasında alıntılanabilir tek bir pasaj taşımıyordu.
 * Kalite eşiği hizmet ve vaka SSS'leriyle aynı.
 */
describe("PILLARS SSS", () => {
  it("her pillar'da en az 10 soru var", () => {
    for (const p of PILLARS) {
      expect(p.faq?.length ?? 0, `${p.key} SSS eksik`).toBeGreaterThanOrEqual(10);
    }
  });

  it("soru ve cevaplar iki dilde de dolu — TR/EN paritesi", () => {
    for (const p of PILLARS) {
      for (const f of p.faq ?? []) {
        for (const loc of LOCALES) {
          expect(f.question[loc]?.trim().length ?? 0, `${p.key}/${loc} soru boş`)
            .toBeGreaterThan(0);
          expect(
            f.answer[loc]?.trim().length ?? 0,
            `${p.key}/${loc}: "${f.question.tr}" cevabı boş`,
          ).toBeGreaterThan(0);
        }
      }
    }
  });

  it("soru tekrarı yok", () => {
    for (const p of PILLARS) {
      const qs = (p.faq ?? []).map((f) => f.question.tr);
      expect(new Set(qs).size, `${p.key} soru tekrarı`).toBe(qs.length);
    }
  });

  it("cevaplar kendine yeter — anafora ile başlamaz", () => {
    const anaphora = /^(bu|bunu|bunlar|o |onu |yukarıda|ayrıca|ancak)/i;
    for (const p of PILLARS) {
      for (const f of p.faq ?? []) {
        for (const loc of LOCALES) {
          expect(
            anaphora.test(f.answer[loc].trim()),
            `${p.key}/${loc}: "${f.question[loc]}"`,
          ).toBe(false);
        }
      }
    }
  });

  it("cevaplar en az 40 kelimedir", () => {
    for (const p of PILLARS) {
      for (const f of p.faq ?? []) {
        for (const loc of LOCALES) {
          const words = f.answer[loc].trim().split(/\s+/).length;
          expect(
            words,
            `${p.key}/${loc}: "${f.question[loc]}" (${words} kelime)`,
          ).toBeGreaterThanOrEqual(40);
        }
      }
    }
  });
});
