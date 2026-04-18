import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { HomeHeroSection } from "../home-hero-section";

// next-intl: key-as-string translator
vi.mock("next-intl", () => ({
  useTranslations: () => (k: string) => k,
}));

// Mock BrandWatermark to avoid window.matchMedia in jsdom
vi.mock("@/components/brand/brand-watermark", () => ({
  BrandWatermark: () => null,
}));

// Mock PopupCTAButton to avoid context dependency in EditorialHero
vi.mock("../PopupCTAButton", () => ({
  PopupCTAButton: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <button className={className}>{children}</button>
  ),
}));

const mockOpenPopup = vi.fn();

vi.mock("@/lib/popup/popup-context", () => ({
  usePopup: () => ({
    open: false,
    openPopup: mockOpenPopup,
    closePopup: vi.fn(),
  }),
}));

vi.mock("@/lib/popup/use-entry-popup", () => ({
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

    expect(screen.getByText("editorial.emphasisA")).toBeInTheDocument();
    expect(screen.getByText("support")).toBeInTheDocument();
    // No PersonaChip rendered when persona is null
    expect(screen.queryByRole("button", { name: "chip.change" })).toBeNull();
  });

  it("persona = donusum-teknoloji — variant keys render + PersonaChip shown", () => {
    vi.mocked(readCurrentPersona).mockReturnValue("donusum-teknoloji");
    render(<HomeHeroSection locale="tr" />);

    expect(
      screen.getByText("personas.donusum-teknoloji.editorial.emphasisA")
    ).toBeInTheDocument();
    expect(
      screen.getByText("personas.donusum-teknoloji.support")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "chip.change" })
    ).toBeInTheDocument();
  });

  it("PersonaChip change click → openPopup called", () => {
    vi.mocked(readCurrentPersona).mockReturnValue("buyume-pazarlar");
    render(<HomeHeroSection locale="tr" />);

    const changeBtn = screen.getByRole("button", { name: "chip.change" });
    fireEvent.click(changeBtn);
    expect(mockOpenPopup).toHaveBeenCalledTimes(1);
  });
});
