import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BAND_COLORS, BandScale, bandSegments } from "@/components/tools/band-scale";
import { BAND_LABELS } from "@/components/tools/copy";
import { BAND_THRESHOLDS } from "@/lib/tools/geo/types";

const labels = { zayif: "zayıf", "gelismeye-acik": "gelişmeye açık", iyi: "iyi", oncu: "öncü" };

describe("bandSegments", () => {
  it("dört bölme, eşiklerle bitişik, 0'dan 100'e", () => {
    expect(bandSegments()).toEqual([
      { band: "zayif", from: 0, to: BAND_THRESHOLDS["gelismeye-acik"] },
      { band: "gelismeye-acik", from: BAND_THRESHOLDS["gelismeye-acik"], to: BAND_THRESHOLDS.iyi },
      { band: "iyi", from: BAND_THRESHOLDS.iyi, to: BAND_THRESHOLDS.oncu },
      { band: "oncu", from: BAND_THRESHOLDS.oncu, to: 100 },
    ]);
  });
});

describe("BandScale", () => {
  it("işaretçi skor konumunda, aktif bölme güçlü renkte, diğerleri yumuşak", () => {
    const { container } = render(<BandScale score={55} labels={labels} ariaLabel="Skor ölçeği" />);
    const marker = container.querySelector('[data-part="marker"]');
    expect(marker?.getAttribute("cx")).toBe("550");
    const segs = container.querySelectorAll('rect[data-band]');
    expect(segs).toHaveLength(4);
    expect(segs[1]?.getAttribute("fill")).toBe(BAND_COLORS["gelismeye-acik"].strong);
    expect(segs[0]?.getAttribute("fill")).toBe(BAND_COLORS.zayif.soft);
    expect(segs[2]?.getAttribute("fill")).toBe(BAND_COLORS.iyi.soft);
  });

  it("bölme genişlikleri eşik oranlarında (40/30/20/10)", () => {
    const { container } = render(<BandScale score={0} labels={labels} ariaLabel="x" />);
    const widths = [...container.querySelectorAll("rect[data-band]")].map((r) => Number(r.getAttribute("width")));
    // 1000 birimlik viewBox, bölmeler arası 4 birim boşluk düşülür
    expect(widths.map((w) => Math.round((w + 4) / 10))).toEqual([40, 30, 20, 10]);
  });

  it("erişilebilir: role=img ve aria-label; bant adları metin olarak var", () => {
    const { getByRole, getByText } = render(<BandScale score={95} labels={labels} ariaLabel="Skor ölçeği" />);
    expect(getByRole("img", { name: "Skor ölçeği" })).toBeInTheDocument();
    expect(getByText(BAND_LABELS.oncu.tr.toLowerCase())).toBeInTheDocument();
  });

  it("score null ise işaretçi çizilmez, hiçbir bölme güçlü renkte değil", () => {
    const { container } = render(<BandScale score={null} labels={labels} ariaLabel="x" />);
    expect(container.querySelector('[data-part="marker"]')).toBeNull();
    expect(container.querySelectorAll("rect[data-band]")[1]?.getAttribute("fill")).toBe(BAND_COLORS["gelismeye-acik"].soft);
  });
});
