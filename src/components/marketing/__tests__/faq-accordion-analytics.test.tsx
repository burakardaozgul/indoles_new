import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FaqAccordion } from "../faq-accordion";
import { EVENT_PARAM_MAX } from "@/lib/analytics/events";

const gtag = vi.fn();

const ITEMS = [
  { question: "CRO nedir?", answer: "Dönüşüm oranı optimizasyonu." },
  { question: "Ne kadar sürer?", answer: "Dört hafta." },
];

beforeEach(() => {
  gtag.mockClear();
  (window as unknown as { gtag?: unknown }).gtag = gtag;
});

afterEach(() => {
  delete (window as unknown as { gtag?: unknown }).gtag;
});

function faqEvents() {
  return gtag.mock.calls.filter((c) => c[1] === "faq_opened");
}

/**
 * jsdom `<details>`in `open` özniteliğini tıklamayla kendiliğinden
 * değiştirmiyor; gerçek tarayıcı davranışı elle kurulur ve `toggle`
 * olayı tetiklenir.
 */
function toggle(question: string, open: boolean) {
  const details = screen.getByText(question).closest("details")!;
  details.open = open;
  fireEvent(details, new Event("toggle", { bubbles: false }));
}

describe("FaqAccordion — faq_opened", () => {
  it("bir soru açıldığında olayı yazar", () => {
    render(<FaqAccordion items={ITEMS} surface="service" />);
    toggle("CRO nedir?", true);

    expect(faqEvents()).toHaveLength(1);
    expect(faqEvents()[0]?.[2]).toEqual({
      surface: "service",
      question: "CRO nedir?",
    });
  });

  it("kapanışta olay yazmaz", () => {
    // Kapanış bir ilgi sinyali değil; sayılırsa açılma oranı iki katına çıkar.
    render(<FaqAccordion items={ITEMS} surface="article" />);
    toggle("CRO nedir?", true);
    toggle("CRO nedir?", false);

    expect(faqEvents()).toHaveLength(1);
  });

  it("yüzey tipini olaya taşır", () => {
    render(<FaqAccordion items={ITEMS} surface="case" />);
    toggle("Ne kadar sürer?", true);

    expect(faqEvents()[0]?.[2]).toMatchObject({ surface: "case" });
  });

  it("uzun soruyu GA4 parametre sınırına kırpar", () => {
    const long = "A".repeat(EVENT_PARAM_MAX + 40) + "?";
    render(<FaqAccordion items={[{ question: long, answer: "x" }]} surface="pillar" />);
    toggle(long, true);

    const question = (faqEvents()[0]?.[2] as { question: string }).question;
    expect(question).toHaveLength(EVENT_PARAM_MAX);
  });

  it("her soru ayrı sayılır", () => {
    render(<FaqAccordion items={ITEMS} surface="package" />);
    toggle("CRO nedir?", true);
    toggle("Ne kadar sürer?", true);

    expect(faqEvents()).toHaveLength(2);
  });

  it("gtag yüklenmemişken açılış çalışmaya devam eder", () => {
    delete (window as unknown as { gtag?: unknown }).gtag;
    render(<FaqAccordion items={ITEMS} surface="service" />);
    expect(() => toggle("CRO nedir?", true)).not.toThrow();
  });
});
