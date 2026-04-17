import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Stage3Actions } from "../Stage3Actions";

vi.mock("next-intl", () => ({ useTranslations: () => (k: string) => k }));

describe("Stage3Actions", () => {
  it("üç CTA render eder", () => {
    render(
      <Stage3Actions
        onBack={() => {}}
        onBooking={() => {}}
        onContact={() => {}}
        onKeepBrowsing={() => {}}
      />
    );
    expect(screen.getByRole("button", { name: /bookingCta/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /contactCta/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /keepBrowsing/i })).toBeInTheDocument();
  });

  it("her CTA doğru callback'i çağırır", () => {
    const onBooking = vi.fn();
    const onContact = vi.fn();
    const onKeep = vi.fn();
    render(
      <Stage3Actions
        onBack={() => {}}
        onBooking={onBooking}
        onContact={onContact}
        onKeepBrowsing={onKeep}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /bookingCta/i }));
    fireEvent.click(screen.getByRole("button", { name: /contactCta/i }));
    fireEvent.click(screen.getByRole("button", { name: /keepBrowsing/i }));
    expect(onBooking).toHaveBeenCalled();
    expect(onContact).toHaveBeenCalled();
    expect(onKeep).toHaveBeenCalled();
  });
});
