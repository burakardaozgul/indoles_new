import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SuccessState } from "../SuccessState";

vi.mock("next-intl", () => ({ useTranslations: () => (k: string) => k }));

describe("SuccessState", () => {
  it("booking variant başlığı render eder, dış link basmaz (ADR-025)", () => {
    render(<SuccessState variant="booking" onClose={() => {}} />);
    expect(screen.getByText(/bookingTitle/i)).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("contact variant başlığı render eder", () => {
    render(<SuccessState variant="contact" onClose={() => {}} />);
    expect(screen.getByText(/contactTitle/i)).toBeInTheDocument();
  });
});
