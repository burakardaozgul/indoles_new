import { describe, it, expect } from "vitest";
import { EVENT_NAMES, EVENT_PARAM_MAX, truncateParam, healthScoreBucket } from "../events";
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
