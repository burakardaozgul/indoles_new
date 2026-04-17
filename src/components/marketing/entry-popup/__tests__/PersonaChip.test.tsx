import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PersonaChip } from "../PersonaChip";

vi.mock("next-intl", () => ({ useTranslations: () => (k: string) => k }));

describe("PersonaChip", () => {
  it("persona seçili ise etiket + değiştir", () => {
    render(<PersonaChip persona="buyume-pazarlar" onReopen={() => {}} />);
    expect(screen.getByText(/chip\.current/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /chip\.change/i })).toBeInTheDocument();
  });

  it("persona null → render etmez", () => {
    const { container } = render(<PersonaChip persona={null} onReopen={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it("değiştir → onReopen", () => {
    const onReopen = vi.fn();
    render(<PersonaChip persona="donusum-teknoloji" onReopen={onReopen} />);
    fireEvent.click(screen.getByRole("button", { name: /chip\.change/i }));
    expect(onReopen).toHaveBeenCalled();
  });
});
