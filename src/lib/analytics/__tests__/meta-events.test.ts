import { describe, it, expect } from "vitest";
import { toMetaEvent } from "../meta-events";
import type { AnalyticsEvent } from "../events";

const ev = (name: string, properties: Record<string, unknown> = {}) =>
  ({ name, properties }) as unknown as AnalyticsEvent;

describe("toMetaEvent — dönüşümler", () => {
  it.each([
    "contact_form_submitted",
    "popup_booking_submitted",
    "popup_contact_submitted",
    "tool_report_requested",
  ])("%s -> Lead", (name) => {
    expect(toMetaEvent(ev(name))).toEqual({ name: "Lead" });
  });
});

describe("toMetaEvent — retargeting sinyalleri", () => {
  it("hizmet görüntülemeyi ViewContent'e çevirir", () => {
    expect(toMetaEvent(ev("service_viewed", { slug: "performans-pazarlama", pillar: "growth" })))
      .toEqual({
        name: "ViewContent",
        params: {
          content_type: "service",
          content_ids: ["performans-pazarlama"],
          content_category: "growth",
        },
      });
  });

  it("paket görüntülemede fiyatı değer olarak taşır", () => {
    // Değer bazlı kitleler ve ROAS raporları bunu kullanır.
    const out = toMetaEvent(ev("package_viewed", {
      packageSlug: "geo-baslangic", pillar: "growth", price: 45000, currency: "TRY",
    }));
    expect(out?.params).toMatchObject({ value: 45000, currency: "TRY" });
  });

  it("vaka görüntülemede problem tipini kategori yapar", () => {
    const out = toMetaEvent(ev("case_study_viewed", { slug: "meccanotecnica", problemType: "verim-kaybi" }));
    expect(out?.params).toMatchObject({ content_type: "case_study", content_category: "verim-kaybi" });
  });

  it("tamamlanan araç taramasını bandıyla birlikte taşır", () => {
    // En sıcak segment: sorunu ölçtü, sonucu gördü, rapor istemedi.
    const out = toMetaEvent(ev("tool_scan_completed", { slug: "geo", band: "orta" }));
    expect(out?.params).toMatchObject({ content_type: "tool", content_category: "orta" });
  });
});

describe("toMetaEvent — eşlenmeyenler", () => {
  it.each(["faq_opened", "persona_axis_clicked", "pillar_viewed", "tool_used"])(
    "%s Meta'ya taşınmaz",
    (name) => {
      // Mikro etkileşimler kitleleri seyreltir, reklam kararını değiştirmez.
      expect(toMetaEvent(ev(name))).toBeNull();
    },
  );

  it("bilinmeyen olayda null döner", () => {
    expect(toMetaEvent(ev("bir_sey_oldu"))).toBeNull();
  });
});
