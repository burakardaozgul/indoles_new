import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ConsultantCard } from "../ConsultantCard";

vi.mock("next-intl", () => ({
  useTranslations: () => {
    const t = (k: string) => k;
    return t;
  },
}));

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ alt, onError }: { alt: string; onError?: () => void }) => {
    // Simulate error to trigger initials fallback
    if (onError) onError();
    return <img alt={alt} />;
  },
}));

describe("ConsultantCard", () => {
  it("danışman adını gösterir", () => {
    render(
      <ConsultantCard locale="tr" selectedDate={null} selectedTime={null} />
    );
    expect(screen.getByText("Burak Arda Özgül")).toBeInTheDocument();
  });

  it("slot seçilmemişse placeholder metni gösterir", () => {
    render(
      <ConsultantCard locale="tr" selectedDate={null} selectedTime={null} />
    );
    expect(screen.getByText("slotNotSelected")).toBeInTheDocument();
  });

  it("slot seçilmişse tarih ve saat gösterir", () => {
    render(
      <ConsultantCard
        locale="tr"
        selectedDate="2026-04-20"
        selectedTime="10:00"
      />
    );
    // Should contain the time
    expect(screen.getByText(/10:00/)).toBeInTheDocument();
  });

  it("initials fallback gösterilir (fotoğraf yüklenemezse)", () => {
    render(
      <ConsultantCard locale="tr" selectedDate={null} selectedTime={null} />
    );
    // Image mock triggers onError, so initials should appear
    expect(screen.getByText("BÖ")).toBeInTheDocument();
  });

  it("EN locale'de İngilizce unvan gösterilir", () => {
    render(
      <ConsultantCard locale="en" selectedDate={null} selectedTime={null} />
    );
    expect(screen.getByText("Founder & CTO")).toBeInTheDocument();
  });
});
