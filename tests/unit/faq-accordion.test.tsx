import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FaqAccordion } from "@/components/marketing/faq-accordion";

/**
 * Akordiyonun sözleşmesi iki tarafa birden bakıyor: kullanıcı için açılıp
 * kapanmalı, crawler için metin kapalıyken de DOM'da durmalı. İkinci kısım
 * kolayca kaybolur — biri `<details>`i JS akordiyonuyla değiştirirse test
 * düşer.
 */
const ITEMS = [
  { question: "CRO nedir?", answer: "Dönüşüm oranı optimizasyonu, mevcut trafikten daha fazla satış çıkarma işidir." },
  { question: "Ne kadar sürer?", answer: "İlk ölçüm iki hafta, ilk test sonucu dört ila altı hafta içinde gelir." },
];

describe("FaqAccordion", () => {
  it("her soru için bir <details> üretir", () => {
    const { container } = render(<FaqAccordion surface="service" items={ITEMS} />);
    expect(container.querySelectorAll("details")).toHaveLength(ITEMS.length);
    expect(container.querySelectorAll("summary")).toHaveLength(ITEMS.length);
  });

  it("kapalıyken bile cevap metni DOM'da durur — crawler görünürlüğü", () => {
    const { container } = render(<FaqAccordion surface="service" items={ITEMS} />);
    // hiçbir details `open` değil
    expect(container.querySelectorAll("details[open]")).toHaveLength(0);
    // ama metin yine de erişilebilir
    for (const item of ITEMS) {
      expect(container.textContent).toContain(item.answer);
    }
  });

  it("soruyu h3 olarak basar — başlık sırası korunur", () => {
    render(<FaqAccordion surface="service" items={ITEMS} />);
    for (const item of ITEMS) {
      expect(screen.getByRole("heading", { level: 3, name: item.question })).toBeTruthy();
    }
  });

  it("boş listede hiçbir şey render etmez", () => {
    const { container } = render(<FaqAccordion surface="service" items={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("ReactNode cevabı kabul eder — paket sayfası persona metnini böyle geçiyor", () => {
    const { container } = render(
      <FaqAccordion surface="service" items={[{ question: "Kime uygun?", answer: <span data-testid="persona">Sanayi tarafı</span> }]} />,
    );
    expect(container.querySelector('[data-testid="persona"]')).toBeTruthy();
  });
});
