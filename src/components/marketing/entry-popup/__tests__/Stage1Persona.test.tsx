import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Stage1Persona } from "../Stage1Persona";

vi.mock("next-intl", () => ({ useTranslations: () => (k: string) => k }));

describe("Stage1Persona", () => {
  it("iki persona kartı render eder", () => {
    render(<Stage1Persona onSelect={() => {}} />);
    const cards = screen.getAllByRole("button").filter((b) => b.getAttribute("data-persona"));
    expect(cards.length).toBe(2);
  });

  it("onSelect doğru slug ile çağrılır", () => {
    const onSelect = vi.fn();
    render(<Stage1Persona onSelect={onSelect} />);
    fireEvent.click(screen.getByRole("button", { name: /donusum-teknoloji/i }));
    expect(onSelect).toHaveBeenCalledWith("donusum-teknoloji");
  });
});
