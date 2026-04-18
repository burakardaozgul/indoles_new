import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EntryPopup } from "../EntryPopup";

vi.mock("next-intl", () => ({
  useTranslations: (ns?: string) => {
    const t = (k: string) => `${ns ?? ""}.${k}`;
    t.raw = (k: string) => {
      if (k.includes("descriptionPoints")) return ["point 1", "point 2", "point 3"];
      return [];
    };
    return t;
  },
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
      return "widget-1";
    },
    remove: vi.fn(),
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
