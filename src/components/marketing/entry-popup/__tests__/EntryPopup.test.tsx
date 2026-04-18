import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EntryPopup } from "../EntryPopup";

vi.mock("next-intl", () => ({
  useTranslations: (ns?: string) => (k: string) => `${ns ?? ""}.${k}`,
  useLocale: () => "tr",
}));

global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ ok: true, calComEmbedUrl: null }),
}) as unknown as typeof fetch;

beforeEach(() => {
  (window as unknown as { turnstile: unknown }).turnstile = {
    render: (el: Element, opts: { callback: (token: string) => void }) => {
      opts.callback("test-token");
    },
  };
});

describe("EntryPopup", () => {
  it("open=true ise dialog render olur", () => {
    render(<EntryPopup open onClose={() => {}} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("× butonu onClose'u çağırır", () => {
    const onClose = vi.fn();
    render(<EntryPopup open onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it("Stage 1 başlangıç state'idir", () => {
    render(<EntryPopup open onClose={() => {}} />);
    const matches = screen.getAllByText(/stage1\.title/);
    expect(matches.length).toBeGreaterThan(0);
  });
});
