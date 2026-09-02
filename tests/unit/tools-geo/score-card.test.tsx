import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { ScoreCard } from "@/components/tools/score-card";
import { TOOLS } from "@/lib/content/tools";
import type { GeoScanResult } from "@/lib/tools/geo/types";

const { reducedMotion } = vi.hoisted(() => ({ reducedMotion: { value: true } }));
vi.mock("@/lib/v2/use-mouse", () => ({ usePrefersReducedMotion: () => reducedMotion.value }));

const RESULT: GeoScanResult = {
  id: "scan-1",
  url: "https://www.migros.com.tr",
  totalScore: 55,
  band: "gelismeye-acik",
  scannedAt: "2026-09-02T00:00:00.000Z",
  checks: [],
};

describe("ScoreCard", () => {
  beforeEach(() => {
    reducedMotion.value = true;
  });

  it("skoru, bandı ve bant cümlesini basar; reduced-motion'da sayaç anında biter", () => {
    render(<ScoreCard result={RESULT} tool={TOOLS[0]!} locale="tr" shareUrl="https://x/y" />);
    expect(screen.getByText("55", { selector: "[data-part='score']" })).toBeInTheDocument();
    expect(screen.getByText("Gelişmeye açık")).toBeInTheDocument();
    expect(screen.getByText(TOOLS[0]!.bands["gelismeye-acik"].tr)).toBeInTheDocument();
    expect(screen.getByText("https://www.migros.com.tr")).toBeInTheDocument();
  });

  it("bağlantıyı panoya kopyalar ve düğme metni geçici olarak değişir", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    render(<ScoreCard result={RESULT} tool={TOOLS[0]!} locale="tr" shareUrl="https://x/y" />);
    fireEvent.click(screen.getByRole("button", { name: "Bağlantıyı kopyala" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Kopyalandı" })).toBeInTheDocument());
    expect(writeText).toHaveBeenCalledWith("https://x/y");
  });

  it("onNewScan verilirse düğme, newScanHref verilirse link basar", () => {
    const onNewScan = vi.fn();
    const { rerender } = render(
      <ScoreCard result={RESULT} tool={TOOLS[0]!} locale="tr" shareUrl="u" onNewScan={onNewScan} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Yeni tarama" }));
    expect(onNewScan).toHaveBeenCalledTimes(1);
    rerender(<ScoreCard result={RESULT} tool={TOOLS[0]!} locale="tr" shareUrl="u" newScanHref="/tr/araclar/geo" />);
    expect(screen.getByRole("link", { name: "Yeni tarama" })).toHaveAttribute("href", "/tr/araclar/geo");
  });

  it("sayaç animasyonluyken de son değere ulaşır", async () => {
    reducedMotion.value = false;
    render(<ScoreCard result={RESULT} tool={TOOLS[0]!} locale="tr" shareUrl="u" />);
    await waitFor(
      () => expect(screen.getByText("55", { selector: "[data-part='score']" })).toBeInTheDocument(),
      { timeout: 2000 },
    );
  });
});
