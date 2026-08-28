import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

/**
 * Sessiz düşüş regresyon testi (2026-08-28).
 *
 * Popup submit'i iki yerde sessizce `return` ediyordu: bağlam eksikse
 * (persona/problem) ve API hata dönerse. Ziyaretçi düğmeye basıyor, hiçbir
 * şey olmuyor, lead kayboluyor. Bu dosya ikisinin de artık kullanıcıya
 * görünür olduğunu koruyor.
 */
vi.mock("next-intl", () => ({
  useTranslations: (ns?: string) => {
    const t = (k: string) => `${ns ?? ""}.${k}`;
    t.raw = () => [];
    return t;
  },
  useLocale: () => "tr",
}));

import { EntryPopup } from "../EntryPopup";

describe("EntryPopup — gönderim hataları sessiz kalmıyor", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("API hata dönerse ziyaretçiye mesaj ve alternatif kanal gösterilir", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, json: async () => ({ error: "mail_failed" }) }),
    );

    render(
      <EntryPopup
        open
        onClose={() => {}}
        initialStage="contact"
        initialPersona="donusum-teknoloji"
        initialProblems={["a", "b", "c"]}
      />,
    );

    const form = document.querySelector("form");
    expect(form).not.toBeNull();

    // Formu geçerli hale getir
    const setVal = (id: string, v: string) => {
      const el = document.getElementById(id) as HTMLInputElement | null;
      if (el) fireEvent.change(el, { target: { value: v } });
    };
    setVal("firstName", "Ali");
    setVal("lastName", "Veli");
    setVal("phone", "+905551234567");
    setVal("email", "ali@veli.com");
    setVal("company", "Acme");
    setVal("title", "CTO");
    const kvkk = document.querySelector('input[type="checkbox"]') as HTMLInputElement | null;
    if (kvkk) fireEvent.click(kvkk);

    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
    expect(screen.getByRole("alert").textContent).toMatch(/digital@indoles\.com\.tr/);
  });

  it("bağlam eksikse sessizce dönmez: uyarır ve akışı başa alır", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    // persona/problem YOK ama doğrudan iletişim aşaması açılıyor.
    // (booking aşaması slot da ister; guard'ları izole etmek için contact.)
    render(<EntryPopup open onClose={() => {}} initialStage="contact" />);

    const form = document.querySelector("form");
    const setVal = (id: string, v: string) => {
      const el = document.getElementById(id) as HTMLInputElement | null;
      if (el) fireEvent.change(el, { target: { value: v } });
    };
    setVal("firstName", "Ali");
    setVal("lastName", "Veli");
    setVal("phone", "+905551234567");
    setVal("email", "ali@veli.com");
    setVal("company", "Acme");
    setVal("title", "CTO");
    const kvkk = document.querySelector('input[type="checkbox"]') as HTMLInputElement | null;
    if (kvkk) fireEvent.click(kvkk);
    fireEvent.submit(form!);

    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
    // Ağa hiç çıkılmadı ama kullanıcı sebebi öğrendi
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
