import { describe, it, expect } from "vitest";
import { serviceViewEvent, pillarViewEvent, packageViewEvent, caseViewEvent } from "../view-events";
import { SERVICES } from "@/lib/content/services";
import { PILLARS } from "@/lib/content/pillars";
import { PACKAGES } from "@/lib/content/packages";
import { CASES } from "@/lib/content/cases";

describe("serviceViewEvent", () => {
  const cro = SERVICES.find((s) => s.slug.tr === "cro")!;

  it("TR slug'ını taşır — iki dilin verisi tek kimlikte birleşsin", () => {
    // EN sayfada `slug.en` gönderilseydi aynı hizmet GA4'te iki ayrı
    // satır olurdu ve hizmet bazlı toplam okunamazdı.
    expect(serviceViewEvent(cro, "en").properties.slug).toBe("cro");
  });

  it("sayfanın dilini ayrı bir boyut olarak taşır", () => {
    expect(serviceViewEvent(cro, "en").properties.locale).toBe("en");
    expect(serviceViewEvent(cro, "tr").properties.locale).toBe("tr");
  });

  it("hizmetin pillar'ını içerikten okur", () => {
    expect(serviceViewEvent(cro, "tr").properties.pillar).toBe("growth");
  });

  it("12 hizmetin tamamı için geçerli olay üretir", () => {
    for (const s of SERVICES) {
      const e = serviceViewEvent(s, "tr");
      expect(e.name).toBe("service_viewed");
      expect(e.properties.slug.length).toBeGreaterThan(0);
    }
  });
});

describe("pillarViewEvent", () => {
  it("pillar anahtarını ve dili taşır", () => {
    const growth = PILLARS.find((p) => p.key === "growth")!;
    expect(pillarViewEvent(growth, "tr")).toEqual({
      name: "pillar_viewed",
      properties: { pillar: "growth", locale: "tr" },
    });
  });
});

describe("packageViewEvent", () => {
  const aiPilot = PACKAGES.find((p) => p.slug.tr === "ai-pilot")!;

  it("fiyatı içerikten okur — elle yazılmaz", () => {
    // Fiyat `packages.ts`te değişince olay da değişmeli; sabit yazılsaydı
    // gelir raporu sessizce eskirdi.
    expect(packageViewEvent(aiPilot).properties.price).toBe(aiPilot.pricing.TRY);
  });

  it("para birimini TRY olarak bildirir", () => {
    expect(packageViewEvent(aiPilot).properties.currency).toBe("TRY");
  });

  it("TR slug'ını kimlik olarak kullanır", () => {
    expect(packageViewEvent(aiPilot).properties.packageSlug).toBe("ai-pilot");
  });

  it("4 paketin tamamı için pozitif fiyat üretir", () => {
    for (const p of PACKAGES) {
      expect(packageViewEvent(p).properties.price).toBeGreaterThan(0);
    }
  });
});

describe("caseViewEvent", () => {
  it("problem tipini ve pillar'ı taşır", () => {
    const c = CASES[0]!;
    expect(caseViewEvent(c)).toEqual({
      name: "case_study_viewed",
      properties: { slug: c.slug, problemType: c.problemType, pillar: c.pillar },
    });
  });

  it("9 vakanın tamamı için geçerli olay üretir", () => {
    for (const c of CASES) {
      const e = caseViewEvent(c);
      expect(e.name).toBe("case_study_viewed");
      expect(e.properties.problemType.length).toBeGreaterThan(0);
    }
  });
});
