import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { PopupProvider, usePopup, isAutoPopupSuppressed } from "../popup-context";
import type { BookingCtaSource } from "@/lib/analytics/events";

vi.mock("next-intl", () => ({
  useTranslations: (ns?: string) => {
    const t = (k: string) => `${ns ?? ""}.${k}`;
    t.raw = () => [];
    return t;
  },
  useLocale: () => "tr",
}));

// `PopupProvider`in otomatik tetikleyicisi `/iletisim` + `/en/contact`de
// bastırılmalı (bkz. altta "otomatik popup tetikleyicisi" describe'ı) —
// gerçek `next/navigation` bir Next.js router context'i olmadan `null`
// döner, testte hangi rotada olduğumuzu bu sahte üzerinden kontrol ediyoruz.
const pathnameMock = vi.hoisted(() => vi.fn((): string | null => null));
vi.mock("next/navigation", () => ({ usePathname: pathnameMock }));

global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ ok: true, calComEmbedUrl: null }),
}) as unknown as typeof fetch;

const gtag = vi.fn();

function Consumer({ source, pillar }: { source: BookingCtaSource; pillar?: "growth" | "transform" | "build" }) {
  const { openPopup } = usePopup();
  return (
    <button type="button" onClick={() => openPopup(source, pillar)}>
      aç
    </button>
  );
}

function renderWith(source: BookingCtaSource, pillar?: "growth" | "transform" | "build") {
  return render(
    <PopupProvider>
      <Consumer source={source} {...(pillar ? { pillar } : {})} />
    </PopupProvider>,
  );
}

beforeEach(() => {
  gtag.mockClear();
  (window as unknown as { gtag?: unknown }).gtag = gtag;
  (window as unknown as { turnstile: unknown }).turnstile = {
    render: (_el: Element, opts: { callback: (t: string) => void }) => {
      opts.callback("test-token");
      return "widget-1";
    },
    remove: vi.fn(),
  };
});

afterEach(() => {
  delete (window as unknown as { gtag?: unknown }).gtag;
});

function bookingEvents() {
  return gtag.mock.calls.filter((c) => c[1] === "booking_cta_clicked");
}

describe("openPopup — booking_cta_clicked", () => {
  it("CTA'nın basıldığı yüzeyi olaya yazar", () => {
    renderWith("nav");
    fireEvent.click(screen.getByRole("button", { name: "aç" }));

    expect(bookingEvents()).toHaveLength(1);
    expect(bookingEvents()[0]?.[2]).toEqual({ source: "nav" });
  });

  it("verildiğinde pillar kırılımını da taşır", () => {
    renderWith("service-detail", "transform");
    fireEvent.click(screen.getByRole("button", { name: "aç" }));

    expect(bookingEvents()[0]?.[2]).toEqual({
      source: "service-detail",
      pillar: "transform",
    });
  });

  it("pillar verilmediğinde alanı hiç basmaz", () => {
    // Tanımsız bir parametre GA4'te boş dize olarak görünür ve
    // "pillar'ı olmayan CTA" ile "pillar'ı boş olan CTA" ayrımı kaybolur.
    renderWith("contact-callout");
    fireEvent.click(screen.getByRole("button", { name: "aç" }));

    expect(bookingEvents()[0]?.[2]).not.toHaveProperty("pillar");
  });

  it("her tıklamada bir kez yazar", () => {
    renderWith("nav-mobile");
    const button = screen.getByRole("button", { name: "aç" });
    fireEvent.click(button);
    fireEvent.click(button);

    expect(bookingEvents()).toHaveLength(2);
  });

  it("popup'ı da açar — ölçüm davranışı bozmaz", () => {
    renderWith("package-detail");
    fireEvent.click(screen.getByRole("button", { name: "aç" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});

/**
 * `/iletisim` Görev 10 ile kendi gömülü rezervasyon yüzeyine kavuştu;
 * global popup'ın otomatik tetiği (4sn sonra `open=true`) o sayfada
 * bastırılmazsa üstüne çakışan İKİNCİ bir rezervasyon arayüzü açar (denetim
 * bulgusu). Yalnız OTOMATİK tetik bastırılıyor — bu blok, elle `openPopup()`
 * çağrısını değil, mount sonrası zamanlayıcıyı test ediyor.
 */
describe("otomatik popup tetikleyicisi — /iletisim ve /en/contact bastırması", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    pathnameMock.mockReset();
    pathnameMock.mockReturnValue(null);
  });

  it("/tr/iletisim'de otomatik tetiklenmez", () => {
    pathnameMock.mockReturnValue("/tr/iletisim");
    render(
      <PopupProvider>
        <div />
      </PopupProvider>,
    );

    act(() => {
      vi.advanceTimersByTime(10_000);
    });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("/en/contact'ta otomatik tetiklenmez", () => {
    pathnameMock.mockReturnValue("/en/contact");
    render(
      <PopupProvider>
        <div />
      </PopupProvider>,
    );

    act(() => {
      vi.advanceTimersByTime(10_000);
    });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("başka bir sayfada (ör. ana sayfa) otomatik tetiklenmeye devam eder", () => {
    pathnameMock.mockReturnValue("/tr");
    render(
      <PopupProvider>
        <div />
      </PopupProvider>,
    );

    act(() => {
      vi.advanceTimersByTime(10_000);
    });

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});

describe("isAutoPopupSuppressed — araç rotaları (spec §7)", () => {
  it("iletişim ve araç rotalarında otomatik tetik yok, diğerlerinde var", () => {
    expect(isAutoPopupSuppressed("/tr/iletisim")).toBe(true);
    expect(isAutoPopupSuppressed("/tr/araclar")).toBe(true);
    expect(isAutoPopupSuppressed("/tr/araclar/geo-gorunurluk-denetleyicisi")).toBe(true);
    expect(isAutoPopupSuppressed("/en/tools/geo-visibility-checker/result/abc")).toBe(true);
    expect(isAutoPopupSuppressed("/tr/hizmetler")).toBe(false);
    expect(isAutoPopupSuppressed("/tr")).toBe(false);
  });
});
