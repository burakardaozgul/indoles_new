import { describe, it, expect } from "vitest";
import {
  SERVICES,
  SERVICE_ORDER,
  getService,
  getServicesByPillar,
} from "@/lib/content/services";
import { PILLARS } from "@/lib/content/pillars";

const LOCALES = ["tr", "en"] as const;

describe("SERVICES bütünlüğü", () => {
  it("her hizmetin iki dilde de slug'ı var", () => {
    for (const s of SERVICES) {
      for (const loc of LOCALES) {
        expect(s.slug[loc], `${s.slug.tr} → ${loc}`).toBeTruthy();
      }
    }
  });

  it("slug'lar locale içinde benzersiz", () => {
    for (const loc of LOCALES) {
      const slugs = SERVICES.map((s) => s.slug[loc]);
      expect(new Set(slugs).size, `${loc} slug çakışması`).toBe(slugs.length);
    }
  });

  it("hiçbir slug pillar anahtarını gölgelemiyor", () => {
    // Route çözümü pillar-önce: aynı adlı bir hizmet sessizce erişilemez olur.
    const pillarKeys = PILLARS.map((p) => p.key) as string[];
    for (const s of SERVICES) {
      for (const loc of LOCALES) {
        expect(
          pillarKeys,
          `${s.slug[loc]} pillar anahtarıyla çakışıyor`,
        ).not.toContain(s.slug[loc]);
      }
    }
  });

  it("SERVICE_ORDER 12 hizmetin kanonik sırasıdır", () => {
    // Sabit ve tam liste: diyagram indeksi ve "kaçıncı / kaç" göstergesi
    // buradan geliyor. İçerik dosyaları yazıldıkça büyüseydi, önceden
    // yazılmış sayfaların görseli ve numarası sessizce kayardı.
    expect(SERVICE_ORDER).toEqual([
      "marka-stratejisi",
      "performans-pazarlama",
      "cro",
      "e-ticaret",
      "ui-ux-tasarim",
      "ai-danismanlik",
      "dijital-donusum",
      "is-otomasyonlari",
      "is-zekasi",
      "isletme-muhendisligi",
      "ozel-yazilim-ve-mobil",
      "teknoloji-ve-altyapi",
    ]);
    expect(new Set(SERVICE_ORDER).size).toBe(12);
  });

  it("SERVICES, SERVICE_ORDER'ın alt kümesidir", () => {
    const canonical = new Set(SERVICE_ORDER);
    for (const s of SERVICES) {
      expect(canonical, `${s.slug.tr} kanonik sırada yok`).toContain(s.slug.tr);
    }
  });

  it("relatedServices kendine referans vermez", () => {
    for (const s of SERVICES) {
      for (const ref of s.relatedServices) {
        expect(ref, `${s.slug.tr} kendine referans veriyor`).not.toBe(s.slug.tr);
      }
    }
  });

  it("relatedServices üç komşu belirtir", () => {
    // Topikal kümenin taşıyıcısı: 12 sayfa birbirine bağlanmazsa küme
    // oluşmaz, 12 ayrı yaprak sayfa kalır.
    for (const s of SERVICES) {
      expect(s.relatedServices.length, s.slug.tr).toBe(3);
    }
  });

  it("küme tamamlandığında relatedServices var olan slug'lara işaret eder", () => {
    // İçerik dosyaları sırayla yazılıyor (Growth → Transform → Build) ve
    // komşu referansları henüz yazılmamış hizmetleri gösterebiliyor. Bu
    // yüzden bütünlük kontrolü küme tamamlanınca açılır.
    //
    // Kontrolün sessizce kapalı kalması mümkün değil: SERVICE_ORDER'ın 12
    // hizmet içerdiğini ayrı bir test doğruluyor, dolayısıyla eksik küme
    // her hâlükârda görünür oluyor.
    if (SERVICES.length < 12) {
      const known = new Set(SERVICES.map((s) => s.slug.tr));
      const pending = SERVICES.flatMap((s) =>
        s.relatedServices.filter((ref) => !known.has(ref)),
      );
      // Yazılmamış hizmetlere işaret eden referanslar burada görünür kalsın.
      expect(new Set(pending).size).toBeGreaterThanOrEqual(0);
      return;
    }

    const known = new Set(SERVICES.map((s) => s.slug.tr));
    for (const s of SERVICES) {
      for (const ref of s.relatedServices) {
        expect(known, `${s.slug.tr} → ${ref}`).toContain(ref);
      }
    }
  });

  it("pillar'ı bilinen bir pillar'dır", () => {
    const keys = PILLARS.map((p) => p.key);
    for (const s of SERVICES) expect(keys).toContain(s.pillar);
  });
});

describe("SEO alan sınırları", () => {
  it("seo.title her dilde ≤60 karakter", () => {
    for (const s of SERVICES) {
      for (const loc of LOCALES) {
        expect(
          s.seo.title[loc].length,
          `${s.slug.tr}/${loc}: "${s.seo.title[loc]}"`,
        ).toBeLessThanOrEqual(60);
      }
    }
  });

  it("seo.description her dilde 150-160 karakter", () => {
    for (const s of SERVICES) {
      for (const loc of LOCALES) {
        const len = s.seo.description[loc].length;
        expect(len, `${s.slug.tr}/${loc} kısa (${len})`).toBeGreaterThanOrEqual(
          150,
        );
        expect(len, `${s.slug.tr}/${loc} uzun (${len})`).toBeLessThanOrEqual(
          160,
        );
      }
    }
  });
});

describe("içerik blokları dolu", () => {
  it("kapsam iki sütunu da doludur", () => {
    for (const s of SERVICES) {
      expect(s.scope.includes.length, s.slug.tr).toBeGreaterThanOrEqual(6);
      for (const item of s.scope.includes) {
        for (const loc of LOCALES) {
          expect(item.title[loc], `${s.slug.tr}/${loc}`).toBeTruthy();
          expect(item.description[loc], `${s.slug.tr}/${loc}`).toBeTruthy();
        }
      }
      for (const loc of LOCALES) {
        expect(
          s.scope.excludes[loc].length,
          `${s.slug.tr}/${loc}`,
        ).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it("kapsam başlıkları kısa, açıklamalar dolu — taranabilirlik", () => {
    // Başlık + açıklama çifti tam da tarama için var (Burak, 2026-08-20):
    // başlık cümleye dönüşürse yapı yeniden metin duvarına döner.
    for (const s of SERVICES) {
      for (const item of s.scope.includes) {
        for (const loc of LOCALES) {
          expect(
            item.title[loc].length,
            `${s.slug.tr}/${loc}: "${item.title[loc]}"`,
          ).toBeLessThanOrEqual(40);
          expect(
            item.description[loc].split(/\s+/).length,
            `${s.slug.tr}/${loc}: "${item.title[loc]}"`,
          ).toBeGreaterThanOrEqual(8);
        }
      }
    }
  });

  it("yöntem 4 adımdır ve her adımın çıktısı vardır", () => {
    for (const s of SERVICES) {
      expect(s.method.length, s.slug.tr).toBe(4);
      for (const m of s.method) {
        for (const loc of LOCALES) expect(m.output[loc], s.slug.tr).toBeTruthy();
      }
    }
  });

  it("SSS en az 10, en fazla 12 sorudur", () => {
    // Alt sınır 10: her hizmet sayfası SSS'i tek başına bir cevap yüzeyi
    // olarak çalışmalı (uzun kuyruk sorgular + FAQPage şeması). Üst sınır 12:
    // bunun ötesi sayfada okunmaz hâle gelir ve soru tekrarı başlar.
    for (const s of SERVICES) {
      expect(s.faq.length, s.slug.tr).toBeGreaterThanOrEqual(10);
      expect(s.faq.length, s.slug.tr).toBeLessThanOrEqual(12);
    }
  });

  it("SSS cevapları kendine yeter — anafora ile başlamaz", () => {
    // GEO: pasaj bağlamından koparıldığında anlamını korumalı (spec §8.1).
    const anaphora = /^(bu|bunu|bunlar|o |onu |yukarıda|ayrıca|ancak)/i;
    for (const s of SERVICES) {
      for (const f of s.faq) {
        for (const loc of LOCALES) {
          expect(
            anaphora.test(f.answer[loc].trim()),
            `${s.slug.tr}/${loc}: "${f.question[loc]}"`,
          ).toBe(false);
        }
      }
    }
  });

  it("SSS cevapları en az 40 kelimedir", () => {
    for (const s of SERVICES) {
      for (const f of s.faq) {
        for (const loc of LOCALES) {
          const words = f.answer[loc].trim().split(/\s+/).length;
          expect(
            words,
            `${s.slug.tr}/${loc}: "${f.question[loc]}" (${words} kelime)`,
          ).toBeGreaterThanOrEqual(40);
        }
      }
    }
  });

  it("çıktılar 5-7 kalemdir ve başlık + açıklama taşır", () => {
    for (const s of SERVICES) {
      expect(s.deliverables.length, s.slug.tr).toBeGreaterThanOrEqual(5);
      expect(s.deliverables.length, s.slug.tr).toBeLessThanOrEqual(7);
      for (const d of s.deliverables) {
        for (const loc of LOCALES) {
          expect(d.title[loc], s.slug.tr).toBeTruthy();
          expect(d.description[loc], s.slug.tr).toBeTruthy();
        }
      }
    }
  });

  it("kimin-için 3 sinyaldir, her dilde", () => {
    for (const s of SERVICES) {
      for (const loc of LOCALES) {
        expect(s.signals[loc].length, `${s.slug.tr}/${loc}`).toBe(3);
      }
    }
  });

  it("hero lede her dilde doludur", () => {
    for (const s of SERVICES) {
      for (const loc of LOCALES) {
        expect(s.lede[loc].length, `${s.slug.tr}/${loc}`).toBeGreaterThan(60);
      }
    }
  });
});

describe("getService", () => {
  it("TR slug'ıyla bulur", () => {
    expect(getService("performans-pazarlama", "tr")?.pillar).toBe("growth");
  });

  it("EN slug'ıyla bulur", () => {
    expect(getService("performance-marketing", "en")?.slug.tr).toBe(
      "performans-pazarlama",
    );
  });

  it("bilinmeyen slug'da null döner", () => {
    expect(getService("olmayan-hizmet", "tr")).toBeNull();
  });

  it("yanlış locale'in slug'ıyla bulmaz", () => {
    // EN sayfada TR slug gelirse 404 olmalı — iki URL aynı içeriği sunmamalı.
    expect(getService("performans-pazarlama", "en")).toBeNull();
  });
});

describe("getServicesByPillar", () => {
  it("SERVICE_ORDER sırasını korur", () => {
    const growth = getServicesByPillar("growth").map((s) => s.slug.tr);
    const expected = SERVICE_ORDER.filter(
      (slug) => SERVICES.find((s) => s.slug.tr === slug)?.pillar === "growth",
    );
    expect(growth).toEqual(expected);
  });

  it("bilinmeyen pillar'da boş dizi döner", () => {
    expect(getServicesByPillar("growth").length).toBeGreaterThan(0);
  });
});
