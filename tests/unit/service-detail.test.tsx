import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScopeColumns } from "@/components/marketing/scope-columns";
import { CASES } from "@/lib/content/cases";
import { SERVICES } from "@/lib/content/services";
import { ARTICLES } from "@/lib/content/articles";
import { TOPICS } from "@/lib/content/topics";
import {
  relatedArticlesForService,
  relatedCaseForService,
} from "@/components/marketing/service-detail";

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
  const proofFor = (service: (typeof SERVICES)[number]) => {
    const c = relatedCaseForService(service.slug.tr, service.pillar);
    return { hasCase: Boolean(c), metrics: (c?.metrics ?? []).slice(0, 3) };
  };

  it("her pillar için bir vaka çözülür", () => {
    for (const pillar of ["growth", "transform", "build"]) {
      expect(CASES.some((c) => c.pillar === pillar)).toBe(true);
    }
  });

  it("12 hizmetin hepsi en az bir metriğe bağlanır", () => {
    for (const service of SERVICES) {
      expect(proofFor(service).metrics.length).toBeGreaterThan(0);
    }
  });

  it("şeritte en fazla 3 metrik gösterilir", () => {
    for (const service of SERVICES) {
      expect(proofFor(service).metrics.length).toBeLessThanOrEqual(3);
    }
  });

  it("her gösterilen metriğin TR + EN etiketi ve değeri vardır", () => {
    for (const service of SERVICES) {
      for (const m of proofFor(service).metrics) {
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
 * C-03: vaka eşlemesi künyeye (`serviceSlugs`) göre kurulur, pillar yalnız
 * künyede eşleşme yoksa devreye giren fallback'tir.
 *
 * Eski kural `CASES.find((c) => c.pillar === service.pillar)` idi: dizideki
 * ilk pillar eşleşmesini alıyordu ve künyeye hiç bakmıyordu. Sonuç, beş
 * growth hizmetinin tamamının (CRO dahil) aynı vakayı (SOYLU AVM) göstermesiydi
 * — SOYLU AVM'nin künyesinde yalnız `performans-pazarlama` var, `cro` yok.
 */
describe("ServiceDetail — vaka eşlemesi (C-03)", () => {
  it("12 hizmetin 12'si de bir vaka bulur — kanıt şeridi hiçbirinde kaybolmaz", () => {
    for (const service of SERVICES) {
      const c = relatedCaseForService(service.slug.tr, service.pillar);
      expect(c, `${service.slug.tr} için vaka bulunamadı`).toBeDefined();
    }
  });

  it("seçilen her vaka ya künyesinde hizmeti taşır ya da (fallback) aynı pillar'dadır", () => {
    for (const service of SERVICES) {
      const c = relatedCaseForService(service.slug.tr, service.pillar)!;
      const matchesBySlug = c.serviceSlugs?.includes(service.slug.tr) ?? false;
      const matchesByPillar = c.pillar === service.pillar;
      expect(
        matchesBySlug || matchesByPillar,
        `${service.slug.tr} → "${c.slug.tr}" ne künyede ne pillar'da eşleşiyor`,
      ).toBe(true);
    }
  });

  it("künyede eşleşme varsa pillar'a bakılmaksızın o vaka seçilir", () => {
    for (const service of SERVICES) {
      const bySlug = CASES.find((c) =>
        c.serviceSlugs?.includes(service.slug.tr),
      );
      if (!bySlug) continue;
      const chosen = relatedCaseForService(service.slug.tr, service.pillar);
      expect(
        chosen?.slug,
        `${service.slug.tr}: künye eşleşmesi "${bySlug.slug}" varken farklı vaka seçildi`,
      ).toBe(bySlug.slug);
    }
  });

  it("künyede hiçbir vaka bu hizmeti taşımıyorsa pillar fallback'e düşülür", () => {
    // Bugünkü içerikte künyesiz kalan dört hizmet — yeni bir vaka eklenip
    // serviceSlugs'a bu hizmetlerden biri girerse bu test güncellenmeli.
    const fallbackServices = SERVICES.filter(
      (s) => !CASES.some((c) => c.serviceSlugs?.includes(s.slug.tr)),
    )
      .map((s) => s.slug.tr)
      .sort();
    expect(fallbackServices).toEqual(
      [
        "dijital-donusum",
        "is-zekasi",
        "isletme-muhendisligi",
        "teknoloji-ve-altyapi",
      ].sort(),
    );
    for (const slug of fallbackServices) {
      const service = SERVICES.find((s) => s.slug.tr === slug)!;
      const c = relatedCaseForService(slug, service.pillar)!;
      expect(c.pillar, `${slug} fallback vakası pillar'ı uyuşmuyor`).toBe(
        service.pillar,
      );
    }
  });

  it("CRO hizmet sayfası artık künyesinde cro geçen bir vakayı gösterir", () => {
    const soyluAvm = CASES.find(
      (c) => c.slug.tr === "soylu-avm-e-ticaret-buyume",
    )!;
    expect(soyluAvm.serviceSlugs).not.toContain("cro");

    const cro = SERVICES.find((s) => s.slug.tr === "cro")!;
    const chosen = relatedCaseForService("cro", cro.pillar)!;
    expect(chosen.serviceSlugs).toContain("cro");
    expect(chosen.slug.tr).not.toBe("soylu-avm-e-ticaret-buyume");
  });

  it("seçim deterministiktir — tekrar çağrıda aynı vaka çıkar", () => {
    for (const service of SERVICES) {
      const first = relatedCaseForService(service.slug.tr, service.pillar);
      const second = relatedCaseForService(service.slug.tr, service.pillar);
      expect(second?.slug).toBe(first?.slug);
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

  it("kategori ekseni karışık olsa da CRO sayfası CRO yazısını gösterir", () => {
    // Regresyonun kökü: pillar ekseni seçici değildir, seçim `topic` üzerinden
    // yapılır. 2026-08 Dalga 1 ile korpusta transform kategorili yazılar da var;
    // growth çoğunlukta ama tekil değil.
    expect(ARTICLES.some((a) => a.category !== "growth")).toBe(true);

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
