import { describe, expect, it } from "vitest";
import { BAND_LABELS, REPORT_ERROR_MAP, SCAN_ERROR_MAP, STATUS_LABELS, TOOL_UI, fill } from "@/components/tools/copy";
import { TOOLS } from "@/lib/content/tools";
import { BAND_ORDER } from "@/lib/tools/geo/types";

function keysDeep(o: unknown, prefix = ""): string[] {
  if (typeof o !== "object" || o === null) return [prefix];
  return Object.entries(o).flatMap(([k, v]) => keysDeep(v, prefix ? `${prefix}.${k}` : k));
}

describe("araç UI kopyası", () => {
  it("TR ve EN aynı anahtar ağacını taşır", () => {
    expect(keysDeep(TOOL_UI.en).sort()).toEqual(keysDeep(TOOL_UI.tr).sort());
  });

  it("hata eşlemeleri her rota kodunu kapsar", () => {
    expect(SCAN_ERROR_MAP).toMatchObject({
      "invalid-url": "invalidUrl",
      "invalid-request": "generic",
      "rate-limited": "rateLimited",
      "target-unreachable": "unreachable",
      "target-blocked": "blocked",
      "turnstile-failed": "turnstile",
      misconfigured: "unavailable",
    });
    expect(REPORT_ERROR_MAP).toMatchObject({
      "rate-limited": "rateLimited",
      "not-found": "notFound",
      "turnstile-failed": "turnstile",
      "mail-failed": "mailFailed",
      misconfigured: "unavailable",
      invalid: "generic",
    });
    for (const kind of Object.values(SCAN_ERROR_MAP)) {
      expect(TOOL_UI.tr.errors[kind]).toBeTruthy();
      expect(TOOL_UI.en.errors[kind]).toBeTruthy();
    }
  });

  it("bant ve durum etiketleri iki dilde dolu", () => {
    for (const b of BAND_ORDER) {
      expect(BAND_LABELS[b].tr).toBeTruthy();
      expect(BAND_LABELS[b].en).toBeTruthy();
      expect(TOOLS[0]!.bands[b].tr).toBeTruthy();
      expect(TOOLS[0]!.bands[b].en).toBeTruthy();
    }
    expect(Object.keys(STATUS_LABELS)).toEqual(["pass", "partial", "fail"]);
  });

  it("fill yer tutucuları doldurur", () => {
    expect(fill("{n} bulgu", { n: 3 })).toBe("3 bulgu");
    expect(fill("Tarama tamamlandı, skor {score}", { score: 55 })).toBe("Tarama tamamlandı, skor 55");
  });

  it("içerik: kanıt şeridi 4 öğe, lede tek cümle, yardım satırı var", () => {
    const t = TOOLS[0]!;
    expect(t.proof).toHaveLength(4);
    expect((t.lede.tr.match(/[.!?](\s|$)/g) ?? []).length).toBe(1);
    expect(t.inputHelp.tr).toContain("yalnız");
  });
});
