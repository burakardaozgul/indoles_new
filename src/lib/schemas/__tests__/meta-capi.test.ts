import { describe, it, expect } from "vitest";
import { metaCapiSchema } from "../meta-capi";

/**
 * `/api/meta/capi` şeması — suistimal yüzeyinin kilidi.
 *
 * Uç nokta herkese açık ve önündeki rıza çerezi ziyaretçinin kendi
 * yazabildiği bir değer, yani kimlik doğrulaması DEĞİL. Şemadan geçen her
 * şey doğrudan Meta veri kaynağına yazılabilecek şey demek; bu yüzden
 * testler "kabul ediyor mu" kadar **"reddediyor mu"**yu da kilitliyor
 * (güvenlik denetimi, 2026-09-09).
 */

const valid = {
  eventName: "ViewContent" as const,
  eventId: "abcd1234-efgh",
  eventSourceUrl: "https://www.indoles.com.tr/tr/hizmetler/cro",
  customData: {
    content_type: "service" as const,
    content_ids: ["cro"],
    content_category: "growth",
  },
};

describe("metaCapiSchema — gecerli yuk", () => {
  it("meta-events.ts'in urettigi ViewContent yukunu kabul eder", () => {
    expect(metaCapiSchema.safeParse(valid).success).toBe(true);
  });

  it("paket goruntulemesinin value/currency alanlarini kabul eder", () => {
    const r = metaCapiSchema.safeParse({
      ...valid,
      customData: {
        content_type: "package",
        content_ids: ["ai-pilot"],
        content_category: "transform",
        value: 480000,
        currency: "TRY",
      },
    });
    expect(r.success).toBe(true);
  });

  it("parametresiz Lead'i kabul eder", () => {
    const r = metaCapiSchema.safeParse({ eventName: "Lead", eventId: "abcd1234" });
    expect(r.success).toBe(true);
  });
});

describe("metaCapiSchema — kisisel veri hic kabul edilmiyor", () => {
  // Regresyon kilidi. Sema onceden `email`/`phone` kabul ediyordu ve route
  // bunlari hash'leyip ziyaretcinin IP/UA'siyla Meta'ya iletiyordu. Istemci
  // o alanlari HIC gondermiyor, yani yolu yalniz saldirgan kullanabilirdi:
  // ucuncu kisilerin e-postalarini `Lead` donusumu olarak yazdirabilirdi.
  it("email alanini reddeder", () => {
    expect(metaCapiSchema.safeParse({ ...valid, email: "kurban@ornek.com" }).success).toBe(false);
  });

  it("phone alanini reddeder", () => {
    expect(metaCapiSchema.safeParse({ ...valid, phone: "+905551112233" }).success).toBe(false);
  });
});

describe("metaCapiSchema — olay adi kapali kume", () => {
  it("tanimadigi olay adini reddeder", () => {
    expect(metaCapiSchema.safeParse({ ...valid, eventName: "Purchase" }).success).toBe(false);
  });
});

describe("metaCapiSchema — customData kapali kume", () => {
  it("tanimadigi anahtari reddeder", () => {
    // Onceden `z.record(z.string(), z.unknown())` idi: herhangi bir anahtar,
    // herhangi bir derinlik ve boyut Meta'ya oldugu gibi geciyordu.
    const r = metaCapiSchema.safeParse({
      ...valid,
      customData: { ...valid.customData, injected_field: "keyfi deger" },
    });
    expect(r.success).toBe(false);
  });

  it("ic ice nesne kabul etmez", () => {
    const r = metaCapiSchema.safeParse({
      ...valid,
      customData: { content_category: { derin: { daha_derin: true } } },
    });
    expect(r.success).toBe(false);
  });

  it("content_ids'i 10 ogeyle sinirlar", () => {
    const r = metaCapiSchema.safeParse({
      ...valid,
      customData: { content_ids: Array.from({ length: 11 }, (_, i) => `s${i}`) },
    });
    expect(r.success).toBe(false);
  });

  it("negatif value reddeder", () => {
    const r = metaCapiSchema.safeParse({ ...valid, customData: { value: -1, currency: "TRY" } });
    expect(r.success).toBe(false);
  });

  it("tanimadigi para birimini reddeder", () => {
    const r = metaCapiSchema.safeParse({ ...valid, customData: { value: 1, currency: "XXX" } });
    expect(r.success).toBe(false);
  });
});

describe("metaCapiSchema — eventSourceUrl yalniz kendi origin'imiz", () => {
  it("baska alan adini reddeder", () => {
    // Serbest birakildiginda saldirgan Meta raporlarina baska alan adlari
    // yazdirabilir ve "hangi sayfa donusturuyor" verisi kirlenirdi.
    const r = metaCapiSchema.safeParse({ ...valid, eventSourceUrl: "https://kotu-site.example/x" });
    expect(r.success).toBe(false);
  });

  it("URL olmayan degeri reddeder", () => {
    expect(metaCapiSchema.safeParse({ ...valid, eventSourceUrl: "javascript:alert(1)" }).success).toBe(false);
  });
});

describe("metaCapiSchema — govde kapali", () => {
  it("govdeye eklenen bilinmeyen alani reddeder", () => {
    const r = metaCapiSchema.safeParse({ ...valid, access_token: "sizdirma-denemesi" });
    expect(r.success).toBe(false);
  });

  it("cok kisa eventId reddeder — deduplication kimligi anlamli olmali", () => {
    expect(metaCapiSchema.safeParse({ ...valid, eventId: "abc" }).success).toBe(false);
  });
});
