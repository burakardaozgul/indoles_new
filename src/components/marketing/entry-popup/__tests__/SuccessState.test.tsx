import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SuccessState } from "../SuccessState";

vi.mock("next-intl", () => ({ useTranslations: () => (k: string) => k }));

describe("SuccessState", () => {
  it("meetUrl/cancelUrl verilmezse dış link basmaz (ADR-025 geriye uyum)", () => {
    render(<SuccessState variant="booking" onClose={() => {}} />);
    expect(screen.getByText(/bookingTitle/i)).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("contact variant başlığı render eder", () => {
    render(<SuccessState variant="contact" onClose={() => {}} />);
    expect(screen.getByText(/contactTitle/i)).toBeInTheDocument();
  });

  it("meetUrl varsa görüşme bağlantısını gösterir", () => {
    render(
      <SuccessState
        variant="booking"
        onClose={() => {}}
        meetUrl="https://meet.google.com/abc-defg-hij"
        cancelUrl={null}
      />,
    );
    const link = screen.getByRole("link", { name: /meetLink/i });
    expect(link).toHaveAttribute("href", "https://meet.google.com/abc-defg-hij");
  });

  it("cancelUrl varsa yönetim linkini gösterir", () => {
    render(
      <SuccessState
        variant="booking"
        onClose={() => {}}
        meetUrl={null}
        cancelUrl="https://indoles.com.tr/tr/rezervasyon/tok123"
      />,
    );
    const link = screen.getByRole("link", { name: /manageLink/i });
    expect(link).toHaveAttribute("href", "https://indoles.com.tr/tr/rezervasyon/tok123");
  });

  it("degraded ise sahte Meet linki göstermez, dürüst mesaj basar", () => {
    // Calendar entegrasyonu başarısız olduğunda satır `failed` işaretlenir ama
    // randevu geçerli kalır (spec §4) — arayüz bunu Meet linki UYDURARAK değil,
    // "bağlantı ayrıca iletilecek" diyerek yansıtır.
    render(
      <SuccessState variant="booking" onClose={() => {}} meetUrl={null} cancelUrl={null} degraded />,
    );
    expect(screen.getByText(/degradedNotice/i)).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /meetLink/i })).not.toBeInTheDocument();
  });

  it("contact variantında meetUrl geçilse bile link basmaz", () => {
    // meetUrl yalnız booking'e ait; contact akışında hiç anlamlı değil.
    render(
      <SuccessState variant="contact" onClose={() => {}} meetUrl="https://meet.google.com/x" />,
    );
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
