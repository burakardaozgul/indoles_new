import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { ScopeColumns } from "@/components/marketing/scope-columns";
import { CASES } from "@/lib/content/cases";
import { SERVICES } from "@/lib/content/services";
import { ARTICLES } from "@/lib/content/articles";
import { TOPICS } from "@/lib/content/topics";
import { localizedHref } from "@/lib/i18n/segments";
import {
  ServiceDetail,
  relatedArticlesForService,
  relatedCasesForService,
} from "@/components/marketing/service-detail";

/*
 * `ServiceDetail`i jsdom'da basabilmek için iki yaprak taklit ediliyor:
 * `ContactCallout` async sunucu bileşeni (istemci render'ı desteklemez),
 * `PopupCTAButton` ise `PopupProvider` ister. İkisinin de "İlgili yazılar"
 * şeridiyle ilgisi yok.
 */
vi.mock("@/components/marketing/contact-callout", () => ({
  ContactCallout: () => null,
}));
vi.mock("@/components/marketing/PopupCTAButton", () => ({
  PopupCTAButton: ({ children }: { children: React.ReactNode }) => (
    <button type="button">{children}</button>
  ),
}));

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
  /** Şeridin ilk kartı — eski tek-vaka sözleşmesinin bugünkü karşılığı. */
  const firstCaseFor = (service: (typeof SERVICES)[number]) =>
    relatedCasesForService(
      service.slug.tr,
      service.pillar,
      2,
      service.featuredCaseSlugs ?? [],
    )[0];

  const proofFor = (service: (typeof SERVICES)[number]) => {
    const c = firstCaseFor(service);
    return { hasCase: Boolean(c), metrics: (c?.metrics ?? []).slice(0, 3) };
  };

  it("her pillar için bir vaka çözülür", () => {
    for (const pillar of ["growth", "transform", "build"]) {
      expect(CASES.some((c) => c.pillar === pillar)).toBe(true);
    }
  });

  it("13 hizmetin hepsi en az bir metriğe bağlanır", () => {
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
  const casesFor = (service: (typeof SERVICES)[number]) =>
    relatedCasesForService(
      service.slug.tr,
      service.pillar,
      2,
      service.featuredCaseSlugs ?? [],
    );

  it("13 hizmetin 13'ü de en az bir vaka bulur — kanıt şeridi hiçbirinde kaybolmaz", () => {
    for (const service of SERVICES) {
      expect(
        casesFor(service).length,
        `${service.slug.tr} için vaka bulunamadı`,
      ).toBeGreaterThan(0);
    }
  });

  it("seçilen her vaka ya künyesinde hizmeti taşır, ya elle seçilmiştir, ya da (fallback) aynı pillar'dadır", () => {
    for (const service of SERVICES) {
      for (const c of casesFor(service)) {
        const matchesBySlug = c.serviceSlugs?.includes(service.slug.tr) ?? false;
        const matchesByPillar = c.pillar === service.pillar;
        const featured = (service.featuredCaseSlugs ?? []).includes(c.slug.tr);
        expect(
          matchesBySlug || matchesByPillar || featured,
          `${service.slug.tr} → "${c.slug.tr}" ne künyede ne pillar'da eşleşiyor`,
        ).toBe(true);
      }
    }
  });

  it("künye eşleşmeleri pillar'a bakılmaksızın ve CASES sırasıyla öne geçer", () => {
    for (const service of SERVICES) {
      if ((service.featuredCaseSlugs ?? []).length > 0) continue;
      const bySlug = CASES.filter((c) =>
        c.serviceSlugs?.includes(service.slug.tr),
      ).slice(0, 2);
      if (bySlug.length === 0) continue;
      const chosen = casesFor(service).slice(0, bySlug.length);
      expect(
        chosen.map((c) => c.slug.tr),
        `${service.slug.tr}: künye eşleşmeleri sırayı belirlemedi`,
      ).toEqual(bySlug.map((c) => c.slug.tr));
    }
  });

  it("künye ikiye tamamlamıyorsa kalan yer pillar eşleşmesiyle dolar", () => {
    // `teknoloji-ve-altyapi` künyesiz bir `build` hizmeti: iki kart da
    // pillar fallback'inden gelir.
    const service = SERVICES.find((s) => s.slug.tr === "teknoloji-ve-altyapi")!;
    const picked = casesFor(service);
    expect(picked).toHaveLength(2);
    for (const c of picked) expect(c.pillar).toBe("build");
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
      const picked = casesFor(service);
      expect(picked.length, `${slug} kanıt şeridi boş kaldı`).toBeGreaterThan(0);
      for (const c of picked) {
        expect(c.pillar, `${slug} fallback vakası pillar'ı uyuşmuyor`).toBe(
          service.pillar,
        );
      }
    }
  });

  it("tek vakalı pillar'da şerit tek kartla döner — uydurma vakayla doldurulmaz", () => {
    // `transform` pillar'ında bugün tek vaka var (Meccanotecnica Umbra);
    // künyesiz üç transform hizmeti bu yüzden iki karta tamamlanamaz.
    const transformCases = CASES.filter((c) => c.pillar === "transform");
    expect(transformCases).toHaveLength(1);
    const onlyTransform = transformCases[0]!;
    for (const slug of ["dijital-donusum", "is-zekasi", "isletme-muhendisligi"]) {
      const service = SERVICES.find((s) => s.slug.tr === slug)!;
      expect(casesFor(service).map((c) => c.slug.tr)).toEqual([
        onlyTransform.slug.tr,
      ]);
    }
  });

  it("hiçbir hizmet aynı vakayı iki kez basmaz", () => {
    for (const service of SERVICES) {
      const slugs = casesFor(service).map((c) => c.slug.tr);
      expect(new Set(slugs).size, service.slug.tr).toBe(slugs.length);
    }
  });

  it("limit aşılmaz", () => {
    for (const service of SERVICES) {
      expect(casesFor(service).length, service.slug.tr).toBeLessThanOrEqual(2);
      expect(
        relatedCasesForService(service.slug.tr, service.pillar, 1).length,
        service.slug.tr,
      ).toBeLessThanOrEqual(1);
    }
  });

  it("CRO hizmet sayfası künyesinde cro geçen iki vakayı gösterir", () => {
    const soyluAvm = CASES.find(
      (c) => c.slug.tr === "soylu-avm-e-ticaret-buyume",
    )!;
    expect(soyluAvm.serviceSlugs).not.toContain("cro");

    const cro = SERVICES.find((s) => s.slug.tr === "cro")!;
    const picked = casesFor(cro);
    expect(picked).toHaveLength(2);
    for (const c of picked) expect(c.serviceSlugs).toContain("cro");
    expect(picked.map((c) => c.slug.tr)).not.toContain(
      "soylu-avm-e-ticaret-buyume",
    );
  });

  it("featuredCaseSlugs sırayı belirler — CRO'da GYMWOLVES, sonra OdorGo", () => {
    // Burak kararı (2026-09-18): MKComputer künyesinde `cro` taşısa da
    // kanıt anlatısı otomasyon; elle seçim onu üçüncü sıraya iter.
    const cro = SERVICES.find((s) => s.slug.tr === "cro")!;
    expect(cro.featuredCaseSlugs).toEqual([
      "gymwolves-12-kat-satis",
      "odorgo-kategori-yaratma",
    ]);
    expect(casesFor(cro).map((c) => c.slug.tr)).toEqual([
      "gymwolves-12-kat-satis",
      "odorgo-kategori-yaratma",
    ]);
    expect(
      relatedCasesForService("cro", cro.pillar, 2).map((c) => c.slug.tr),
    ).toEqual(["gymwolves-12-kat-satis", "mkcomputer-dropshipping-otomasyonu"]);
  });

  it("e-ticaret şeridi elle seçimle OdorGo, sonra Meccanotecnica Umbra'yı gösterir", () => {
    // Burak kararı (2026-10-02): OdorGo tüketici tarafının, Meccanotecnica
    // B2B teklif portalının kanıtı. Meccanotecnica künyesinde `e-ticaret`
    // taşımaz (pillar `transform`) — şeride yalnız elle seçimle girer.
    const eTicaret = SERVICES.find((s) => s.slug.tr === "e-ticaret")!;
    const picked = [
      "odorgo-kategori-yaratma",
      "meccanotecnica-umbra-teklif-portali",
    ];
    expect(eTicaret.featuredCaseSlugs).toEqual(picked);
    expect(casesFor(eTicaret).map((c) => c.slug.tr)).toEqual(picked);

    const mecca = CASES.find((c) => c.slug.tr === picked[1])!;
    expect(mecca.serviceSlugs).not.toContain("e-ticaret");
    // İki vakanın da şeride girecek metriği var — metin bağlantılı hâle düşmez.
    for (const c of casesFor(eTicaret)) expect(c.metrics.length).toBeGreaterThan(0);

    // Elle seçim olmasa künye sırası SOYLU AVM + MKComputer verirdi.
    expect(
      relatedCasesForService("e-ticaret", eTicaret.pillar, 2).map((c) => c.slug.tr),
    ).toEqual(["soylu-avm-e-ticaret-buyume", "mkcomputer-dropshipping-otomasyonu"]);
  });

  it("elle seçim listeyi doldurmuyorsa kalan yer otomatik eşlemeyle tamamlanır", () => {
    const picked = relatedCasesForService("cro", "growth", 2, [
      "odorgo-kategori-yaratma",
    ]);
    expect(picked.map((c) => c.slug.tr)).toEqual([
      "odorgo-kategori-yaratma",
      "gymwolves-12-kat-satis",
    ]);
  });

  it("bilinmeyen featuredCaseSlugs kaydı şeridi boşaltmaz — otomatik eşleme sürer", () => {
    // Tip ve `services-content.test.ts` bunu içerik tarafında yakalar; burada
    // çalışma zamanı davranışı donduruluyor.
    const picked = relatedCasesForService("cro", "growth", 2, ["olmayan-vaka"]);
    expect(picked.map((c) => c.slug.tr)).toEqual([
      "gymwolves-12-kat-satis",
      "mkcomputer-dropshipping-otomasyonu",
    ]);
  });

  it("seçim deterministiktir — tekrar çağrıda aynı vakalar aynı sırada çıkar", () => {
    for (const service of SERVICES) {
      expect(casesFor(service).map((c) => c.slug.tr)).toEqual(
        casesFor(service).map((c) => c.slug.tr),
      );
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
    const pool = ARTICLES.filter((a) =>
      ["performans-pazarlama", "musteri-elde-tutma"].includes(a.topic),
    );
    expect(picked).toHaveLength(pool.length);
    expect(new Set(picked.map((a) => a.topic))).toEqual(
      new Set(["performans-pazarlama", "musteri-elde-tutma"]),
    );
  });

  it("konuya bağlı yazıların hiçbiri düşmez — havuzun tamamı döner", () => {
    // Burak (2026-10-02): "İlgili yazılarda düşme olmasın." Eski kural en
    // yeni üçü alıyordu; büyüyen kümede eski karar yazıları bloktan düşüyordu.
    for (const service of SERVICES) {
      const topics = topicsOf(service.slug.tr);
      const pool = ARTICLES.filter((a) => topics.includes(a.topic))
        .map((a) => a.slug.tr)
        .sort();
      expect(
        relatedArticlesForService(service.slug.tr)
          .map((a) => a.slug.tr)
          .sort(),
        service.slug.tr,
      ).toEqual(pool);
    }
  });

  it("ai-danismanlik üçten fazla yazı döndürür, 12 soru yazısı dahil", () => {
    const picked = relatedArticlesForService("ai-danismanlik");
    expect(picked.length).toBeGreaterThanOrEqual(5);
    expect(picked.map((a) => a.slug.tr)).toContain(
      "ai-danismani-secerken-sorulacak-12-soru",
    );
  });

  it("en yeniden eskiye sıralı", () => {
    for (const service of SERVICES) {
      const dates = relatedArticlesForService(service.slug.tr).map(
        (a) => a.publishedAt,
      );
      expect(dates).toEqual([...dates].sort().reverse());
    }
  });

  it("aynı gün yayımlananlar ARTICLES sırasını korur — sıralama kararlı", () => {
    for (const service of SERVICES) {
      const picked = relatedArticlesForService(service.slug.tr);
      for (let i = 1; i < picked.length; i++) {
        const prev = picked[i - 1]!;
        const cur = picked[i]!;
        if (prev.publishedAt !== cur.publishedAt) continue;
        expect(
          ARTICLES.indexOf(prev),
          `${service.slug.tr}: ${prev.slug.tr} / ${cur.slug.tr}`,
        ).toBeLessThan(ARTICLES.indexOf(cur));
      }
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

/**
 * Kanıt şeridinin sayfadaki karşılığı — e-ticaret sayfası iki vakayı,
 * künyesi ve metrikleriyle basıyor (TR + EN).
 */
describe("ServiceDetail — e-ticaret kanıt şeridi", () => {
  const eTicaret = SERVICES.find((s) => s.slug.tr === "e-ticaret")!;
  const expected = [
    "odorgo-kategori-yaratma",
    "meccanotecnica-umbra-teklif-portali",
  ].map((slug) => CASES.find((c) => c.slug.tr === slug)!);

  for (const locale of ["tr", "en"] as const) {
    it(`${locale}: iki vaka, künye bağlantısı ve ilk metrikleriyle basılır`, () => {
      render(<ServiceDetail service={eTicaret} locale={locale} />);
      const heading = screen.getByRole("heading", {
        level: 3,
        name: locale === "tr" ? "Bu işlerin sonucu" : "What the work produced",
      });
      const strip = heading.parentElement!;

      const hrefs = within(strip)
        .getAllByRole("link")
        .map((a) => a.getAttribute("href"));
      expect(hrefs).toEqual(
        expected.map((c) => localizedHref(locale, "cases", c.slug[locale])),
      );
      for (const c of expected) {
        expect(
          within(strip).getByRole("link", {
            name: `${c.clientName[locale]} — ${c.title[locale]}`,
          }),
        ).toBeInTheDocument();
        expect(within(strip).getByText(c.lead[locale])).toBeInTheDocument();
        expect(
          within(strip).getByText(c.metrics[0]!.value[locale]),
        ).toBeInTheDocument();
      }
    });
  }
});

/**
 * Şeridin sayfadaki karşılığı — `ServiceDetail` gerçekten basılıyor. Kartlar
 * ve bağlantıları sunucu HTML'inde olmalı (SSG, iç bağlantı değeri); jsdom
 * düzen hesaplamadığı için kaydırma düğmeleri burada `hidden` kalır, bu da
 * JS'siz / taşmasız hâlin sözleşmesidir.
 */
describe("ServiceDetail — İlgili yazılar şeridi", () => {
  const serviceBySlug = (slug: string) =>
    SERVICES.find((s) => s.slug.tr === slug)!;

  it("üçten fazla konu yazısı olan hizmette hepsi kart olarak basılır (ai-danismanlik)", () => {
    const service = serviceBySlug("ai-danismanlik");
    const expected = relatedArticlesForService("ai-danismanlik");
    expect(expected.length).toBeGreaterThan(3);

    render(<ServiceDetail service={service} locale="tr" />);
    const region = screen.getByRole("region", {
      name: "Bu hizmetle ilgili yazılar",
    });
    expect(region).toHaveAttribute("aria-roledescription", "karusel");

    const list = within(region).getByRole("list", { name: "İlgili yazılar" });
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(expected.length);

    const hrefs = within(list)
      .getAllByRole("link")
      .map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual(
      expected.map((a) => localizedHref("tr", "articles", a.slug.tr)),
    );
    // Para sorgusu taşıyan eski karar yazısı artık düşmüyor.
    expect(hrefs).toContain(
      localizedHref("tr", "articles", "ai-danismani-secerken-sorulacak-12-soru"),
    );
    for (const a of expected) {
      expect(
        within(list).getByRole("heading", { level: 4, name: a.title.tr }),
      ).toBeInTheDocument();
    }
  });

  it("EN sayfada İngilizce başlık, bağlantı ve etiketlerle basılır", () => {
    const service = serviceBySlug("ai-danismanlik");
    const expected = relatedArticlesForService("ai-danismanlik");

    render(<ServiceDetail service={service} locale="en" />);
    const region = screen.getByRole("region", {
      name: "Articles related to this service",
    });
    expect(region).toHaveAttribute("aria-roledescription", "carousel");
    const hrefs = within(region)
      .getAllByRole("link")
      .map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual(
      expected.map((a) => localizedHref("en", "articles", a.slug.en)),
    );
  });

  it("düğmeler erişilebilir adla basılır ve şeridi denetler (TR + EN)", () => {
    const service = serviceBySlug("ai-danismanlik");

    const { unmount } = render(<ServiceDetail service={service} locale="tr" />);
    let region = screen.getByRole("region", {
      name: "Bu hizmetle ilgili yazılar",
    });
    const listId = within(region).getByRole("list").id;
    const prev = within(region).getByRole("button", {
      name: "Önceki yazılar",
      hidden: true,
    });
    const next = within(region).getByRole("button", {
      name: "Sonraki yazılar",
      hidden: true,
    });
    expect(prev).toHaveAttribute("aria-controls", listId);
    expect(next).toHaveAttribute("aria-controls", listId);
    unmount();

    render(<ServiceDetail service={service} locale="en" />);
    region = screen.getByRole("region", {
      name: "Articles related to this service",
    });
    expect(
      within(region).getByRole("button", {
        name: "Previous articles",
        hidden: true,
      }),
    ).toBeInTheDocument();
    expect(
      within(region).getByRole("button", { name: "Next articles", hidden: true }),
    ).toBeInTheDocument();
  });

  it("konusu olmayan hizmette şerit hiç basılmaz", () => {
    const untargeted = SERVICES.filter(
      (s) => !TOPICS.some((t) => t.serviceSlug === s.slug.tr),
    );
    expect(untargeted.length).toBeGreaterThan(0);
    for (const service of untargeted) {
      const { unmount } = render(
        <ServiceDetail service={service} locale="tr" />,
      );
      expect(
        screen.queryByRole("region", { name: "Bu hizmetle ilgili yazılar" }),
        service.slug.tr,
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("heading", { name: "İlgili yazılar" }),
        service.slug.tr,
      ).not.toBeInTheDocument();
      unmount();
    }
  });

  it("tek yazılı hizmette şerit tek kartla basılır", () => {
    const single = SERVICES.find(
      (s) => relatedArticlesForService(s.slug.tr).length === 1,
    );
    expect(single).toBeDefined();
    render(<ServiceDetail service={single!} locale="tr" />);
    const region = screen.getByRole("region", {
      name: "Bu hizmetle ilgili yazılar",
    });
    expect(within(region).getAllByRole("listitem")).toHaveLength(1);
  });
});
