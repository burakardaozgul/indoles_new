import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PersonaSwitch } from "../persona-switch";

const gtag = vi.fn();

beforeEach(() => {
  gtag.mockClear();
  (window as unknown as { dataLayer?: unknown[] }).dataLayer = [];
});

afterEach(() => {
  delete (window as unknown as { dataLayer?: unknown[] }).dataLayer;
  document.documentElement.removeAttribute("data-persona");
});

function personaEvents() {
  return ((window as unknown as { dataLayer?: Record<string, unknown>[] }).dataLayer ?? [])
    .filter((e) => e.event === "persona_axis_clicked")
    .map(({ event: _event, ...params }) => {
      // `gaEvent` her olayda tum parametre adlarini `undefined` olarak
      // sifirliyor (ADR-034 sizinti kalkani); iddialar yalniz gercekten
      // gonderilen alanlari gormeli.
      void _event;
      return Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined));
    });
}

describe("PersonaSwitch — persona_axis_clicked", () => {
  it("sanayi ekseni seçildiğinde olayı yazar", () => {
    render(<PersonaSwitch locale="tr" />);
    fireEvent.click(screen.getByRole("button", { name: /Sanayi/ }));

    expect(personaEvents()[0]).toEqual({ axis: "industrial" });
  });

  it("ticaret ekseni seçildiğinde olayı yazar", () => {
    render(<PersonaSwitch locale="tr" />);
    fireEvent.click(screen.getByRole("button", { name: /Ticaret/ }));

    expect(personaEvents()[0]).toEqual({ axis: "commerce" });
  });

  it("İngilizce arayüzde de aynı ekseni bildirir", () => {
    // Eksen adı ölçüm boyutudur, arayüz diline göre değişemez — değişirse
    // TR ve EN raporları birleştirilemez.
    render(<PersonaSwitch locale="en" />);
    fireEvent.click(screen.getByRole("button", { name: /Commerce/ }));

    expect(personaEvents()[0]).toEqual({ axis: "commerce" });
  });

  it("her tıklama ayrı sayılır", () => {
    render(<PersonaSwitch locale="tr" />);
    fireEvent.click(screen.getByRole("button", { name: /Sanayi/ }));
    fireEvent.click(screen.getByRole("button", { name: /Ticaret/ }));

    expect(personaEvents()).toHaveLength(2);
  });

  it("gtag yüklenmemişken mercek yine değişir", () => {
    delete (window as unknown as { dataLayer?: unknown[] }).dataLayer;
    render(<PersonaSwitch locale="tr" />);
    expect(() =>
      fireEvent.click(screen.getByRole("button", { name: /Ticaret/ })),
    ).not.toThrow();
  });
});
