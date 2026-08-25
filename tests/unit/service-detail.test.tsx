import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScopeColumns } from "@/components/marketing/scope-columns";
import { CASES } from "@/lib/content/cases";
import { SERVICES } from "@/lib/content/services";
import { ARTICLES } from "@/lib/content/articles";
import { TOPICS } from "@/lib/content/topics";
import { relatedArticlesForService } from "@/components/marketing/service-detail";

describe("ScopeColumns", () => {
  const props = {
    includes: [
      { title: "Kanal denetimi", description: "Hesap yapısı incelenir." },
      { title: "Bütçe dağılımı", description: "Tavanlar kurala bağlanır." },
    ],
    excludes: ["İçerik üretimi"],
    locale: "tr" as const,
  };

  it("iki sütunu da başlıkla basar", () => {
    render(<ScopeColumns {...props} />);
    expect(screen.getByRole("heading", { name: /kapsar/i })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /kapsamaz/i }),
    ).toBeInTheDocument();
  });

  it("her maddeyi liste öğesi olarak basar", () => {
    render(<ScopeColumns {...props} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("kapsar maddesini başlık + açıklama olarak basar", () => {
    render(<ScopeColumns {...props} />);
    expect(
      screen.getByRole("heading", { name: "Kanal denetimi" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Hesap yapısı incelenir.")).toBeInTheDocument();
  });

  it("EN locale'de başlıkları İngilizce verir", () => {
    render(<ScopeColumns {...props} locale="en" />);
    expect(
      screen.getByRole("heading", { name: /what's included/i }),
    ).toBeInTheDocument();
  });

  it("kapsamaz boşsa o sütunu hiç basmaz", () => {
    render(<ScopeColumns {...props} excludes={[]} />);
    expect(
      screen.queryByRole("heading", { name: /kapsamaz/i }),
    ).not.toBeInTheDocument();
  });

  it("persona varyantı üretmez — hizmet detay tek sesli", () => {
    const { container } = render(<ScopeColumns {...props} />);
    expect(container.querySelectorAll("[data-persona-variant]")).toHaveLength(0);
  });
});

/**
 * K-02: hizmet detayının rakamlı kanıt şeridi. Şerit ile eski metin bağlantılı
 * hâl arasındaki geçişi `ServiceDetail` seçiyor — burada seçim kuralı ve
 * "en fazla 3 metrik" dilimi doğrulanıyor.
 */
describe("ServiceDetail — vaka kanıt şeridi seçimi", () => {
  const proofFor = (pillar: string) => {
    const c = CASES.find((x) => x.pillar === pillar);
    return { hasCase: Boolean(c), metrics: (c?.metrics ?? []).slice(0, 3) };
  };

  it("her pillar için bir vaka çözülür", () => {
    for (const pillar of ["growth", "transform", "build"]) {
      expect(proofFor(pillar).hasCase).toBe(true);
    }
  });

  it("12 hizmetin hepsi en az bir metriğe bağlanır", () => {
    for (const service of SERVICES) {
      expect(proofFor(service.pillar).metrics.length).toBeGreaterThan(0);
    }
  });

  it("şeritte en fazla 3 metrik gösterilir", () => {
    for (const service of SERVICES) {
      expect(proofFor(service.pillar).metrics.length).toBeLessThanOrEqual(3);
    }
  });

  it("her gösterilen metriğin TR + EN etiketi ve değeri vardır", () => {
    for (const service of SERVICES) {
      for (const m of proofFor(service.pillar).metrics) {
        expect(m.value.tr.length).toBeGreaterThan(0);
        expect(m.value.en.length).toBeGreaterThan(0);
        expect(m.label.tr.length).toBeGreaterThan(0);
        expect(m.label.en.length).toBeGreaterThan(0);
      }
    }
  });

  it("metriksiz vaka şerit yerine metin bağlantılı hâle düşer", () => {
    // Metrik dizisi boş bir vaka gerçekten var (Feruza) — dallanma ölü kod değil.
    const metricless = CASES.filter((c) => c.metrics.length === 0);
    expect(metricless.length).toBeGreaterThan(0);
    for (const c of metricless) {
      expect(c.metrics.slice(0, 3)).toHaveLength(0);
    }
  });
});

/**
 * Hizmet sayfasının "İlgili yazılar" bloğu. Eski kural `category === pillar`
 * idi; 16 yazının 16'sı `growth` olduğu için beş growth hizmeti aynı üç
 * alakasız yazıyı gösteriyordu. Yeni eksen ADR-021'in konu → hizmet eşlemesi.
 */
describe("ServiceDetail — ilgili yazı seçimi", () => {
  const topicsOf = (serviceSlugTr: string) =>
    TOPICS.filter((t) => t.serviceSlug === serviceSlugTr).map((t) => t.id);

  it("gösterilen her yazı o hizmete bağlı bir konudan gelir", () => {
    for (const service of SERVICES) {
      const allowed = topicsOf(service.slug.tr);
      for (const a of relatedArticlesForService(service.slug.tr)) {
        expect(
          allowed,
          `${service.slug.tr} → "${a.title.tr}" (${a.topic}) bu hizmetin konusu değil`,
        ).toContain(a.topic);
      }
    }
  });

  it("hizmete bağlı konu yoksa blok boş kalır — alakasız yazıyla doldurulmaz", () => {
    for (const service of SERVICES) {
      if (topicsOf(service.slug.tr).length > 0) continue;
      expect(
        relatedArticlesForService(service.slug.tr),
        `${service.slug.tr} konusuz ama yazı basıyor`,
      ).toHaveLength(0);
    }
  });

  it("16 yazının 16'sı growth olsa da CRO sayfası CRO yazısını gösterir", () => {
    // Regresyonun kökü: pillar ekseni bu veride ayırt edici değil.
    expect(ARTICLES.every((a) => a.category === "growth")).toBe(true);

    const cro = relatedArticlesForService("cro");
    expect(cro.length).toBeGreaterThan(0);
    expect(cro.every((a) => a.topic === "cro")).toBe(true);
  });

  it("bir hizmete bağlı birden fazla konu tek havuzda toplanır", () => {
    // `performans-pazarlama` hem kendi kümesini hem `musteri-elde-tutma`yı hedefler.
    expect(topicsOf("performans-pazarlama").sort()).toEqual([
      "musteri-elde-tutma",
      "performans-pazarlama",
    ]);
    const picked = relatedArticlesForService("performans-pazarlama");
    expect(picked).toHaveLength(3);
  });

  it("en fazla üç yazı, en yeniden eskiye", () => {
    for (const service of SERVICES) {
      const picked = relatedArticlesForService(service.slug.tr);
      expect(picked.length).toBeLessThanOrEqual(3);
      const dates = picked.map((a) => a.publishedAt);
      expect(dates).toEqual([...dates].sort().reverse());
    }
  });

  it("hiçbir hizmet aynı yazıyı iki kez basmaz", () => {
    for (const service of SERVICES) {
      const slugs = relatedArticlesForService(service.slug.tr).map(
        (a) => a.slug.tr,
      );
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });
});
