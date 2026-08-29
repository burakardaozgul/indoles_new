import { describe, it, expect } from "vitest";
import { CASES } from "@/lib/content/cases";
import { SERVICES } from "@/lib/content/services";
import { TOPICS } from "@/lib/content/topics";
import { relatedArticlesForCase } from "@/lib/content/related-articles";
import { relatedArticlesForService } from "@/components/marketing/service-detail";

/**
 * C-09 (vaka yönü): vaka künyesindeki `serviceSlugs`ten geriye, o
 * hizmetleri hedefleyen konuların yazılarına. Yazı → hizmet yönünün
 * (`relatedArticlesForService`, service-detail.tsx) aynasıdır.
 */
describe("relatedArticlesForCase", () => {
  it("serviceSlugs boşsa boş dizi döner", () => {
    expect(relatedArticlesForCase(undefined)).toEqual([]);
    expect(relatedArticlesForCase([])).toEqual([]);
  });

  it("hiçbir konu hedeflemeyen bir hizmet slug'ında boş dizi döner", () => {
    // `topics.ts`te hiçbir konu bu hizmeti `serviceSlug` olarak taşımıyor.
    const untargeted = SERVICES.filter(
      (s) => !TOPICS.some((t) => t.serviceSlug === s.slug.tr),
    ).map((s) => s.slug.tr);
    expect(untargeted.length).toBeGreaterThan(0);
    for (const slug of untargeted) {
      expect(relatedArticlesForCase([slug]), slug).toEqual([]);
    }
  });

  it("tek hizmetli künyede yazı → hizmet yönüyle (relatedArticlesForService) aynı sonucu verir", () => {
    for (const service of SERVICES) {
      const viaCase = relatedArticlesForCase([service.slug.tr]);
      const viaService = relatedArticlesForService(service.slug.tr);
      expect(viaCase.map((a) => a.slug.tr)).toEqual(
        viaService.map((a) => a.slug.tr),
      );
    }
  });

  it("birden fazla hizmet slug'ı tek havuzda toplanır", () => {
    // cro + e-ticaret: ikisinin de kendi konusu var, havuz ikisini de içerir.
    const pooled = relatedArticlesForCase(["cro", "e-ticaret"]);
    const cro = relatedArticlesForService("cro");
    const eTicaret = relatedArticlesForService("e-ticaret");
    const union = new Set([
      ...cro.map((a) => a.slug.tr),
      ...eTicaret.map((a) => a.slug.tr),
    ]);
    for (const a of pooled) {
      expect(union.has(a.slug.tr), a.slug.tr).toBe(true);
    }
  });

  it("en fazla 3 yazı, en yeniden eskiye sıralı", () => {
    for (const c of CASES) {
      const picked = relatedArticlesForCase(c.serviceSlugs);
      expect(picked.length).toBeLessThanOrEqual(3);
      const dates = picked.map((a) => a.publishedAt);
      expect(dates).toEqual([...dates].sort().reverse());
    }
  });

  it("hiçbir vaka aynı yazıyı iki kez basmaz", () => {
    for (const c of CASES) {
      const slugs = relatedArticlesForCase(c.serviceSlugs).map(
        (a) => a.slug.tr,
      );
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });

  it("gösterilen her yazı, künyedeki hizmetlerden en az birini hedefleyen bir konudan gelir", () => {
    for (const c of CASES) {
      const allowedTopics = TOPICS.filter(
        (t) => t.serviceSlug !== null && c.serviceSlugs?.includes(t.serviceSlug),
      ).map((t) => t.id);
      for (const a of relatedArticlesForCase(c.serviceSlugs)) {
        expect(
          allowedTopics,
          `${c.slug.tr} → "${a.title.tr}" (${a.topic}) künyedeki hizmetlerin konusu değil`,
        ).toContain(a.topic);
      }
    }
  });

  it("gerçek içerikte en az bir vaka İlgili yazılar bloğunu doldurur", () => {
    // Regresyon: bu, blok her zaman boş kalıp render edilmeyen ölü kod
    // olmadığını doğrular.
    const withArticles = CASES.filter(
      (c) => relatedArticlesForCase(c.serviceSlugs).length > 0,
    );
    expect(withArticles.length).toBeGreaterThan(0);
  });
});
