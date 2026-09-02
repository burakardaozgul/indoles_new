import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SignalRows, barWidthPercent, fillPercent } from "@/components/tools/signal-rows";
import { TOOLS } from "@/lib/content/tools";
import type { GeoCheckResult } from "@/lib/tools/geo/types";

const SIGNALS = TOOLS[0]!.signals;
const CHECKS: GeoCheckResult[] = [
  { id: "ai-access", score: 25, max: 25, status: "pass", summary: { tr: "Tüm botlar okuyabiliyor.", en: "All bots can read." }, findings: [] },
  { id: "llms-txt", score: 10, max: 15, status: "partial", summary: { tr: "llms.txt biçimsiz.", en: "llms.txt unformatted." }, findings: [] },
  { id: "json-ld", score: 0, max: 20, status: "fail", summary: { tr: "JSON-LD yok.", en: "No JSON-LD." }, findings: [] },
  { id: "lang-signals", score: 15, max: 15, status: "pass", summary: { tr: "Dil tam.", en: "Language complete." }, findings: [] },
  { id: "question-h2", score: 0, max: 25, status: "fail", summary: { tr: "Soru yok.", en: "No questions." }, findings: [] },
];

describe("oran yardımcıları", () => {
  it("çubuk genişliği ağırlığa, dolgu puana orantılı", () => {
    expect(barWidthPercent(25, 25)).toBe(100);
    expect(barWidthPercent(15, 25)).toBe(60);
    expect(fillPercent(10, 15)).toBeCloseTo(66.67, 1);
    expect(fillPercent(0, 20)).toBe(0);
  });
});

describe("SignalRows", () => {
  it("beş satır, sinyal sırası, durum etiketi ve puan", () => {
    render(<SignalRows checks={CHECKS} signals={SIGNALS} locale="tr" />);
    const rows = screen.getAllByRole("listitem");
    expect(rows).toHaveLength(5);
    expect(rows[0]).toHaveTextContent("AI erişimi");
    expect(rows[0]).toHaveTextContent("25 / 25 puan");
    expect(rows[0]).toHaveTextContent("Geçti");
    expect(rows[2]).toHaveTextContent("Kaldı");
  });

  it("çubuk genişliği ve dolgusu stil değişkenleriyle verilir", () => {
    const { container } = render(<SignalRows checks={CHECKS} signals={SIGNALS} locale="tr" />);
    const bars = container.querySelectorAll('[data-part="bar"]');
    expect((bars[1] as HTMLElement).style.width).toBe("60%");
    const fills = container.querySelectorAll(".signal-bar-fill");
    expect((fills[1] as HTMLElement).style.getPropertyValue("--fill")).toBe("66.67%");
    expect(fills[2]?.className).toContain("bg-danger-500");
    expect(fills[0]?.className).toContain("bg-success-500");
  });

  it("özet cümlesi açılır ayrıntıda", () => {
    render(<SignalRows checks={CHECKS} signals={SIGNALS} locale="tr" />);
    expect(screen.getByText("llms.txt biçimsiz.")).toBeInTheDocument();
    expect(screen.getAllByText("Ayrıntı")).toHaveLength(5);
  });
});
