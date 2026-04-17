import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Stage2Problems } from "../Stage2Problems";

vi.mock("next-intl", () => ({ useTranslations: () => (k: string) => k }));

describe("Stage2Problems", () => {
  it("persona için 10 problem render eder", () => {
    render(<Stage2Problems persona="donusum-teknoloji" onBack={() => {}} onSubmit={() => {}} />);
    expect(screen.getAllByRole("checkbox").length).toBe(10);
  });

  it("3 seçilene kadar Next disabled", () => {
    render(<Stage2Problems persona="buyume-pazarlar" onBack={() => {}} onSubmit={() => {}} />);
    const next = screen.getByRole("button", { name: /next/i });
    expect(next).toBeDisabled();
    const items = screen.getAllByRole("checkbox");
    fireEvent.click(items[0]!);
    fireEvent.click(items[1]!);
    expect(next).toBeDisabled();
    fireEvent.click(items[2]!);
    expect(next).not.toBeDisabled();
  });

  it("4. seçim FIFO ile ilki düşürür", () => {
    const onSubmit = vi.fn();
    render(<Stage2Problems persona="donusum-teknoloji" onBack={() => {}} onSubmit={onSubmit} />);
    const items = screen.getAllByRole("checkbox");
    fireEvent.click(items[0]!);
    fireEvent.click(items[1]!);
    fireEvent.click(items[2]!);
    fireEvent.click(items[3]!);
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    const payload = onSubmit.mock.calls[0]![0] as string[];
    expect(payload.length).toBe(3);
    const slugs = items.map((el) => el.getAttribute("data-slug"));
    expect(payload).not.toContain(slugs[0]);
    expect(payload).toContain(slugs[1]);
    expect(payload).toContain(slugs[2]);
    expect(payload).toContain(slugs[3]);
  });
});
