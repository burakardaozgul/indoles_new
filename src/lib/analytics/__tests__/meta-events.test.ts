import { describe, it, expect } from "vitest";
import { toMetaEvent, LEAD_EVENTS } from "../meta-events";

describe("toMetaEvent — dönüşümler", () => {
  it.each([
    "contact_form_submitted",
    "popup_booking_submitted",
    "popup_contact_submitted",
    "tool_report_requested",
  ])("%s -> Lead, SUNUCU kanalindan", (name) => {
    // `channel: "server"` kritik: bu olaylar tarayicidan GONDERILMEZ, kimligi
    // olan kopyayi form handler'i yollar (ADR-036).
    expect(toMetaEvent(name)).toEqual({ name: "Lead", channel: "server" });
  });

  it("contact_booking_submitted de Lead", () => {
    expect(toMetaEvent("contact_booking_submitted")).toEqual({ name: "Lead", channel: "server" });
  });

  it("bes donusumun HEPSI listede", () => {
    // Regresyon kilidi: liste eksik kalirsa o yuzeyin lead'i Meta'ya hic
    // ulasmaz. Uc tanesi tam olarak boyle kaybolmustu (denetim 2026-09-09).
    expect([...LEAD_EVENTS].sort()).toEqual([
      "contact_booking_submitted",
      "contact_form_submitted",
      "popup_booking_submitted",
      "popup_contact_submitted",
      "tool_report_requested",
    ]);
  });

  it("HICBIR Lead tarayici kanalinda degil", () => {
    for (const name of LEAD_EVENTS) {
      expect(toMetaEvent(name)?.channel).toBe("server");
    }
  });
});

describe("toMetaEvent — retargeting sinyalleri", () => {
  it("hizmet görüntülemeyi ViewContent'e çevirir", () => {
    expect(toMetaEvent("service_viewed", { slug: "performans-pazarlama", pillar: "growth" }))
      .toEqual({
        name: "ViewContent",
        channel: "browser",
        params: {
          content_type: "service",
          content_ids: ["performans-pazarlama"],
          content_category: "growth",
        },
      });
  });

  it("paket görüntülemede fiyatı değer olarak taşır", () => {
    // Değer bazlı kitleler ve ROAS raporları bunu kullanır.
    const out = toMetaEvent("package_viewed", {
      packageSlug: "geo-baslangic", pillar: "growth", price: 45000, currency: "TRY",
    });
    expect(out?.params).toMatchObject({ value: 45000, currency: "TRY" });
  });

  it("vaka görüntülemede problem tipini kategori yapar", () => {
    const out = toMetaEvent("case_study_viewed", { slug: "meccanotecnica", problemType: "verim-kaybi" });
    expect(out?.params).toMatchObject({ content_type: "case_study", content_category: "verim-kaybi" });
  });

  it("tamamlanan araç taramasını bandıyla birlikte taşır", () => {
    // En sıcak segment: sorunu ölçtü, sonucu gördü, rapor istemedi.
    const out = toMetaEvent("tool_scan_completed", { slug: "geo", band: "orta" });
    expect(out?.params).toMatchObject({ content_type: "tool", content_category: "orta" });
  });
});

describe("toMetaEvent — ViewContent tarayici kanalinda", () => {
  it.each(["service_viewed", "package_viewed", "case_study_viewed", "tool_scan_completed"])(
    "%s browser kanalinda",
    (name) => {
      expect(toMetaEvent(name, { slug: "x", pillar: "growth", packageSlug: "x", price: 1 })?.channel)
        .toBe("browser");
    },
  );
});

describe("toMetaEvent — eşlenmeyenler", () => {
  it.each(["faq_opened", "persona_axis_clicked", "pillar_viewed", "tool_used"])(
    "%s Meta'ya taşınmaz",
    (name) => {
      // Mikro etkileşimler kitleleri seyreltir, reklam kararını değiştirmez.
      expect(toMetaEvent(name)).toBeNull();
    },
  );

  it("bilinmeyen olayda null döner", () => {
    expect(toMetaEvent("bir_sey_oldu")).toBeNull();
  });
});
