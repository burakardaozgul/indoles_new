import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SuccessState } from "../SuccessState";

vi.mock("next-intl", () => ({ useTranslations: () => (k: string) => k }));

describe("SuccessState", () => {
  it("booking variant Cal.com URL linkini gösterir", () => {
    render(<SuccessState variant="booking" bookingUrl="https://cal.com/x" onClose={() => {}} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "https://cal.com/x");
  });

  it("contact variant başlığı render eder", () => {
    render(<SuccessState variant="contact" bookingUrl={null} onClose={() => {}} />);
    expect(screen.getByText(/contactTitle/i)).toBeInTheDocument();
  });
});
