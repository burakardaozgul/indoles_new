import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { HomeHeroSection } from "../home-hero-section";

// next-intl: key-as-string translator
vi.mock("next-intl", () => ({
  useTranslations: () => (k: string) => k,
}));

// Mock EntryPopup to avoid full Radix/trpc tree
vi.mock("../entry-popup/EntryPopup", () => ({
  EntryPopup: ({ open }: { open: boolean; onClose: unknown }) => (
    <div data-testid="entry-popup" data-open={String(open)} />
  ),
}));

// Mock BrandWatermark to avoid window.matchMedia in jsdom
vi.mock("@/components/brand/brand-watermark", () => ({
  BrandWatermark: () => null,
}));

// Mock PersonaChip (real component) — keep it real but mock its i18n dep above
// No additional mock needed; PersonaChip is already covered by the next-intl mock.

const mockForceOpen = vi.fn();
const mockClose = vi.fn();

vi.mock("@/lib/popup/use-entry-popup", () => ({
  useEntryPopup: () => ({
    open: false,
    forceOpen: mockForceOpen,
    close: mockClose,
  }),
  readCurrentPersona: vi.fn().mockReturnValue(null),
}));

import { readCurrentPersona } from "@/lib/popup/use-entry-popup";

describe("HomeHeroSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("persona null — default editorial keys render", () => {
    vi.mocked(readCurrentPersona).mockReturnValue(null);
    render(<HomeHeroSection locale="tr" />);

    // With key-as-string translator, tHero("editorial.emphasisA") → "editorial.emphasisA"
    // emphasisA is inside its own <span>, so getByText works directly on it
    expect(screen.getByText("editorial.emphasisA")).toBeInTheDocument();
    // support key renders in its own <p>
    expect(screen.getByText("support")).toBeInTheDocument();
    // EntryPopup present (closed)
    expect(screen.getByTestId("entry-popup")).toBeInTheDocument();
    // No PersonaChip rendered when persona is null
    expect(screen.queryByRole("button", { name: "chip.change" })).toBeNull();
  });

  it("persona = donusum-teknoloji — variant keys render + PersonaChip shown", () => {
    vi.mocked(readCurrentPersona).mockReturnValue("donusum-teknoloji");
    render(<HomeHeroSection locale="tr" />);

    // emphasisA is inside its own <span>
    expect(
      screen.getByText("personas.donusum-teknoloji.editorial.emphasisA")
    ).toBeInTheDocument();
    // support renders in its own <p>
    expect(
      screen.getByText("personas.donusum-teknoloji.support")
    ).toBeInTheDocument();
    // PersonaChip rendered (non-null persona)
    expect(
      screen.getByRole("button", { name: "chip.change" })
    ).toBeInTheDocument();
  });

  it("PersonaChip change click → popup.forceOpen called", () => {
    vi.mocked(readCurrentPersona).mockReturnValue("buyume-pazarlar");
    render(<HomeHeroSection locale="tr" />);

    const changeBtn = screen.getByRole("button", { name: "chip.change" });
    fireEvent.click(changeBtn);
    expect(mockForceOpen).toHaveBeenCalledTimes(1);
  });
});
