import { render, screen, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ScanStage } from "@/components/tools/scan-stage";
import { TOOLS } from "@/lib/content/tools";
import { TOOL_SCAN } from "@/lib/v2/anim-config";
import type { GeoCheckResult } from "@/lib/tools/geo/types";

const { reducedMotion } = vi.hoisted(() => ({ reducedMotion: { value: false } }));
vi.mock("@/lib/v2/use-mouse", () => ({ usePrefersReducedMotion: () => reducedMotion.value }));

const SIGNALS = TOOLS[0]!.signals;
const CHECKS: GeoCheckResult[] = SIGNALS.map((s) => ({
  id: s.id, score: s.weight, max: s.weight, status: "pass",
  summary: { tr: "x", en: "x" }, findings: [],
}));

function rows() {
  return [...document.querySelectorAll(".tool-stage-row")].map((r) => r.getAttribute("data-state"));
}

describe("ScanStage", () => {
  beforeEach(() => { vi.useFakeTimers(); reducedMotion.value = false; });
  afterEach(() => vi.useRealTimers());

  it("satırlar enterStaggerMs arayla okunuyor'a girer; yanıt gelmeden hiçbiri done olmaz", () => {
    render(<ScanStage signals={SIGNALS} locale="tr" checks={null} onResolved={vi.fn()} />);
    expect(rows()).toEqual(["reading", "waiting", "waiting", "waiting", "waiting"]);
    act(() => { vi.advanceTimersByTime(TOOL_SCAN.enterStaggerMs * 2); });
    expect(rows()).toEqual(["reading", "reading", "reading", "waiting", "waiting"]);
    act(() => { vi.advanceTimersByTime(TOOL_SCAN.enterStaggerMs * 10); });
    expect(rows().every((s) => s === "reading")).toBe(true);
    expect(screen.getByRole("status")).toHaveTextContent("Tarama sürüyor");
  });

  it("checks gelince satırlar resolveStaggerMs arayla çözülür, morphMs sonra onResolved", () => {
    const onResolved = vi.fn();
    const { rerender } = render(<ScanStage signals={SIGNALS} locale="tr" checks={null} onResolved={onResolved} />);
    act(() => { vi.advanceTimersByTime(TOOL_SCAN.enterStaggerMs * 5); });
    rerender(<ScanStage signals={SIGNALS} locale="tr" checks={CHECKS} onResolved={onResolved} />);
    act(() => { vi.advanceTimersByTime(TOOL_SCAN.resolveStaggerMs * 2 + 1); });
    expect(rows().filter((s) => s === "done")).toHaveLength(2);
    act(() => { vi.advanceTimersByTime(TOOL_SCAN.resolveStaggerMs * 3); });
    expect(rows().every((s) => s === "done")).toBe(true);
    expect(screen.getAllByText("25 / 25 · Geçti").length).toBeGreaterThan(0);
    expect(onResolved).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(TOOL_SCAN.morphMs); });
    expect(onResolved).toHaveBeenCalledTimes(1);
  });

  it("reduced-motion: kadans yok, checks gelince hepsi anında done ve onResolved hemen", () => {
    reducedMotion.value = true;
    const onResolved = vi.fn();
    const { rerender } = render(<ScanStage signals={SIGNALS} locale="tr" checks={null} onResolved={onResolved} />);
    expect(rows().every((s) => s === "reading")).toBe(true);
    rerender(<ScanStage signals={SIGNALS} locale="tr" checks={CHECKS} onResolved={onResolved} />);
    act(() => { vi.advanceTimersByTime(0); });
    expect(rows().every((s) => s === "done")).toBe(true);
    expect(onResolved).toHaveBeenCalledTimes(1);
  });
});
