import { describe, it, expect } from "vitest";
import {
  EVENT_NAMES,
  EVENT_PARAM_MAX,
  EVENT_PARAM_NAMES,
  truncateParam,
  healthScoreBucket,
} from "../events";
import type { AnalyticsEvent } from "../events";

describe("EVENT_NAMES — GA4 kısıtları (docs/12 §2)", () => {
  it("her ad snake_case'dir", () => {
    for (const name of EVENT_NAMES) {
      expect(name).toMatch(/^[a-z][a-z0-9_]*$/);
    }
  });

  it("her ad 40 karakteri aşmaz", () => {
    // GA4 sınırı. Aşan ad sessizce kırpılır ve iki olay tek isimde birleşir.
    for (const name of EVENT_NAMES) {
      expect(name.length).toBeLessThanOrEqual(40);
    }
  });

  it("ad tekrarı yoktur", () => {
    expect(new Set(EVENT_NAMES).size).toBe(EVENT_NAMES.length);
  });

  it("obje_fiil biçimindedir — fiil sonda", () => {
    // docs/12 §2: `{object}_{verb}`. Tersi (`viewed_pillar`) GA4
    // raporlarında alfabetik gruplamayı bozar.
    // `used`/`completed`/`requested` Görev 11 GEO araç olaylarıyla eklendi
    // (spec §4/§6, Burak onaylı — 2026-09-01 tasarım onayı).
    // `expanded` Görev 13 Diagnoo olaylarıyla eklendi (2026-09-01 tasarım onayı).
    for (const name of EVENT_NAMES) {
      expect(name).toMatch(
        /_(viewed|clicked|opened|submitted|given|shown|dismissed|selected|used|completed|requested|expanded)$/,
      );
    }
  });
});

describe("truncateParam", () => {
  it("sınırın altındaki metni değiştirmez", () => {
    expect(truncateParam("CRO nedir?")).toBe("CRO nedir?");
  });

  it("sınırı aşan metni kırpar", () => {
    const long = "a".repeat(EVENT_PARAM_MAX + 50);
    expect(truncateParam(long)).toHaveLength(EVENT_PARAM_MAX);
  });

  it("tam sınırdaki metni olduğu gibi bırakır", () => {
    const exact = "a".repeat(EVENT_PARAM_MAX);
    expect(truncateParam(exact)).toBe(exact);
  });

  it("GA4 parametre sınırı 100 karakterdir", () => {
    expect(EVENT_PARAM_MAX).toBe(100);
  });
});

describe("diagnoo tools — health score ve yeni olaylar", () => {
  it("diagnoo tools eventleri EVENT_NAMES'te kayıtlı", () => {
    for (const name of ["tool_roadmap_item_expanded", "tool_service_cta_clicked"]) expect(EVENT_NAMES).toContain(name);
  });

  it("healthScoreBucket sınırları doğru kovalar", () => {
    expect(healthScoreBucket(0)).toBe("0-25");
    expect(healthScoreBucket(25)).toBe("0-25");
    expect(healthScoreBucket(26)).toBe("26-50");
    expect(healthScoreBucket(54)).toBe("51-75");
    expect(healthScoreBucket(100)).toBe("76-100");
  });

  it("tool_scan_completed sağlık kovasını band olarak kabul eder (tip)", () => {
    const ev: AnalyticsEvent = { name: "tool_scan_completed", properties: { slug: "diagnoo", band: "51-75", locale: "tr" } };
    expect(ev.name).toBe("tool_scan_completed");
  });
});

describe("EVENT_PARAM_NAMES — sizinti kalkani (ADR-034)", () => {
  /**
   * Taksonomideki HER olayin temsili bir ornegi. `AnalyticsEvent` bir tip
   * oldugu icin calisma zamaninda numaralandirilamiyor; bu dizi o boslugu
   * kapatir. Yeni bir olay eklenip buraya yazilmazsa `EVENT_NAMES` kapsam
   * testi (asagida) hata verir.
   */
  const samples: AnalyticsEvent[] = [
    { name: "persona_axis_clicked", properties: { axis: "industrial" } },
    { name: "pillar_viewed", properties: { pillar: "growth", locale: "tr" } },
    { name: "service_viewed", properties: { slug: "cro", pillar: "growth", locale: "tr" } },
    {
      name: "package_viewed",
      properties: { packageSlug: "p", pillar: "growth", price: 1, currency: "TRY" },
    },
    { name: "case_study_viewed", properties: { slug: "s", problemType: "p", pillar: "growth" } },
    { name: "faq_opened", properties: { surface: "service", question: "q" } },
    { name: "booking_cta_clicked", properties: { source: "nav", pillar: "growth" } },
    {
      name: "brief_submitted",
      properties: { briefId: "b", pillar: "growth", budget: "small", timeline: "urgent" },
    },
    {
      name: "contact_booking_submitted",
      properties: { briefId: "b", locale: "tr", preferred_slot: "2026-09-10 14:00" },
    },
    { name: "tool_used", properties: { slug: "geo", locale: "tr" } },
    { name: "tool_scan_completed", properties: { slug: "geo", band: "0-25", locale: "tr" } },
    { name: "tool_report_requested", properties: { slug: "geo", band: "0-25", locale: "tr" } },
    {
      name: "tool_roadmap_item_expanded",
      properties: { slug: "diagnoo", category: "speed", locale: "tr" },
    },
    {
      name: "tool_service_cta_clicked",
      properties: { slug: "diagnoo", target_service: "cro", locale: "tr" },
    },
  ];

  it("her taksonomi olayinin her parametresini kapsar", () => {
    // Listede olmayan bir parametre `gaEvent`in sifirlamasindan kacar ve
    // SONRAKI olaylara sizar — canli dogrulamada `ep.slug` ve `ep.surface`
    // tam olarak boyle sizdi (2026-09-09).
    const missing = new Set<string>();
    for (const ev of samples) {
      for (const key of Object.keys(ev.properties)) {
        if (!(EVENT_PARAM_NAMES as readonly string[]).includes(key)) missing.add(key);
      }
    }
    expect([...missing]).toEqual([]);
  });

  it("her taksonomi olayindan bir ornek tasir", () => {
    expect(new Set(samples.map((s) => s.name)).size).toBe(EVENT_NAMES.length);
  });

  it("serbest olaylarin parametrelerini de tasir", () => {
    // Taksonomi disi olaylar (`gaEvent` ile atilanlar) ayni dataLayer'i
    // paylasir, dolayisiyla ayni sizinti riskini tasir.
    for (const key of [
      "topic", // article_filter
      "subject", "budget_range", "timeline", // contact_form_submitted
      "persona", "problems", "trigger_source", "at_stage", "stage",
      "from", "lead_id", "previous_persona", "time_on_stage_ms", "time_to_show_ms", // popup
    ]) {
      expect(EVENT_PARAM_NAMES as readonly string[]).toContain(key);
    }
  });

  it("ad tekrari yoktur", () => {
    expect(new Set(EVENT_PARAM_NAMES).size).toBe(EVENT_PARAM_NAMES.length);
  });

  it("her ad GA4 parametre kuralina uyar — snake_case/camelCase, <=40 karakter", () => {
    for (const n of EVENT_PARAM_NAMES) {
      expect(n.length).toBeLessThanOrEqual(40);
      expect(n).toMatch(/^[a-zA-Z][a-zA-Z0-9_]*$/);
    }
  });
});
