import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PersonaSwitch } from "../persona-switch";

const gtag = vi.fn();

beforeEach(() => {
  gtag.mockClear();
  (window as unknown as { gtag?: unknown }).gtag = gtag;
});

afterEach(() => {
  delete (window as unknown as { gtag?: unknown }).gtag;
  document.documentElement.removeAttribute("data-persona");
});

function personaEvents() {
  return gtag.mock.calls.filter((c) => c[1] === "persona_axis_clicked");
}

describe("PersonaSwitch — persona_axis_clicked", () => {
  it("sanayi ekseni seçildiğinde olayı yazar", () => {
    render(<PersonaSwitch locale="tr" />);
    fireEvent.click(screen.getByRole("button", { name: /Sanayi/ }));

    expect(personaEvents()[0]?.[2]).toEqual({ axis: "industrial" });
  });

  it("ticaret ekseni seçildiğinde olayı yazar", () => {
    render(<PersonaSwitch locale="tr" />);
    fireEvent.click(screen.getByRole("button", { name: /Ticaret/ }));

    expect(personaEvents()[0]?.[2]).toEqual({ axis: "commerce" });
  });

  it("İngilizce arayüzde de aynı ekseni bildirir", () => {
    // Eksen adı ölçüm boyutudur, arayüz diline göre değişemez — değişirse
    // TR ve EN raporları birleştirilemez.
    render(<PersonaSwitch locale="en" />);
    fireEvent.click(screen.getByRole("button", { name: /Commerce/ }));

    expect(personaEvents()[0]?.[2]).toEqual({ axis: "commerce" });
  });

  it("her tıklama ayrı sayılır", () => {
    render(<PersonaSwitch locale="tr" />);
    fireEvent.click(screen.getByRole("button", { name: /Sanayi/ }));
    fireEvent.click(screen.getByRole("button", { name: /Ticaret/ }));

    expect(personaEvents()).toHaveLength(2);
  });

  it("gtag yüklenmemişken mercek yine değişir", () => {
    delete (window as unknown as { gtag?: unknown }).gtag;
    render(<PersonaSwitch locale="tr" />);
    expect(() =>
      fireEvent.click(screen.getByRole("button", { name: /Ticaret/ })),
    ).not.toThrow();
  });
});
