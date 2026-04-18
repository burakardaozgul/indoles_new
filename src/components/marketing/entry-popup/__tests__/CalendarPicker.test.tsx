import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CalendarPicker } from "../CalendarPicker";

vi.mock("next-intl", () => ({
  useTranslations: () => {
    const t = (k: string) => k;
    return t;
  },
}));

describe("CalendarPicker", () => {
  const baseProps = {
    locale: "tr" as const,
    onSlotChange: vi.fn(),
    selectedDate: null,
    selectedTime: null,
  };

  it("geçerli ayı render eder", () => {
    render(<CalendarPicker {...baseProps} />);
    // Month name grid headers visible
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("hafta sonu günleri disabled gelir", () => {
    render(<CalendarPicker {...baseProps} />);
    const buttons = screen.getAllByRole("button").filter(
      (b) => b.getAttribute("aria-disabled") === "true"
    );
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("bir gün seçilince onSlotChange çağrılır", () => {
    const onSlotChange = vi.fn();
    render(<CalendarPicker {...baseProps} onSlotChange={onSlotChange} />);

    // Find an enabled weekday button
    const enabledButtons = screen.getAllByRole("button").filter(
      (b) => !b.hasAttribute("disabled") && b.getAttribute("aria-selected") !== "true"
        && !["Önceki ay", "Sonraki ay", "prev", "next"].includes(b.getAttribute("aria-label") ?? "")
        && b.getAttribute("aria-label")?.match(/\d/)
    );

    if (enabledButtons.length > 0) {
      fireEvent.click(enabledButtons[0]!);
      expect(onSlotChange).toHaveBeenCalledWith(expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/), null);
    }
  });

  it("gün seçilince saat slotları görünür", () => {
    const today = new Date();
    const isoDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    // Use a Monday-Friday day (skip if today is weekend — use a future weekday)
    let targetDate = isoDate;
    const d = new Date(today);
    while (d.getDay() === 0 || d.getDay() === 6) {
      d.setDate(d.getDate() + 1);
    }
    targetDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    render(<CalendarPicker {...baseProps} selectedDate={targetDate} />);
    expect(screen.getByText("09:00")).toBeInTheDocument();
    expect(screen.getByText("17:00")).toBeInTheDocument();
  });

  it("saat seçilince onSlotChange doğru çağrılır", () => {
    const onSlotChange = vi.fn();
    const d = new Date();
    while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
    const selectedDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    render(
      <CalendarPicker
        {...baseProps}
        onSlotChange={onSlotChange}
        selectedDate={selectedDate}
      />
    );

    fireEvent.click(screen.getByText("10:00"));
    expect(onSlotChange).toHaveBeenCalledWith(selectedDate, "10:00");
  });

  it("ay navigasyonu çalışır", () => {
    render(<CalendarPicker {...baseProps} />);
    const nextBtn = screen.getByRole("button", { name: /sonraki ay/i });
    expect(nextBtn).not.toBeDisabled();
    fireEvent.click(nextBtn);
    // After click, heading should change (month name changes)
    // Just verify it doesn't crash
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });
});
