import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ConsentBanner } from "../consent-banner";
import {
  CONSENT_COOKIE_NAME,
  REGION_COOKIE_NAME,
  readConsentCookie,
} from "@/lib/consent/cookie";

const COPY = {
  title: "Ölçüm çerezi kullanıyoruz.",
  body: "Hangi sayfanın işe yaradığını görmek için. Reklam takibi yapmıyoruz, profil çıkarmıyoruz.",
  accept: "Kabul et",
  reject: "Yalnız gerekli olanlar",
  policyLabel: "Çerez ve KVKK aydınlatması",
  policyHref: "/tr/gizlilik-kvkk",
  regionLabel: "Çerez tercihi",
} as const;

const gtag = vi.fn();

function clearCookies() {
  for (const pair of document.cookie.split(";")) {
    const name = pair.split("=")[0]?.trim();
    if (name) document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }
}

function setRegion(value: string) {
  document.cookie = `${REGION_COOKIE_NAME}=${value}; path=/`;
}

function renderBanner() {
  return render(<ConsentBanner {...COPY} />);
}

beforeEach(() => {
  clearCookies();
  gtag.mockClear();
  (window as unknown as { gtag?: unknown }).gtag = gtag;
});

afterEach(() => {
  delete (window as unknown as { gtag?: unknown }).gtag;
});

describe("ConsentBanner — görünürlük", () => {
  it("EEA bölgesinde ve karar verilmemişken görünür", () => {
    setRegion("eea");
    renderBanner();
    expect(screen.getByText(COPY.title)).toBeInTheDocument();
    expect(screen.getByText(COPY.body)).toBeInTheDocument();
  });

  it("EEA dışında hiç render olmaz", () => {
    // Bölgesel karar (docs/14 §3): TR ziyaretçisine banner çıkmaz.
    setRegion("other");
    renderBanner();
    expect(screen.queryByText(COPY.title)).not.toBeInTheDocument();
  });

  it("bölge bilinmiyorsa render olmaz", () => {
    renderBanner();
    expect(screen.queryByText(COPY.title)).not.toBeInTheDocument();
  });

  it("onay daha önce verilmişse tekrar sormaz", () => {
    setRegion("eea");
    document.cookie = `${CONSENT_COOKIE_NAME}=granted; path=/`;
    renderBanner();
    expect(screen.queryByText(COPY.title)).not.toBeInTheDocument();
  });

  it("daha önce reddedilmişse tekrar sormaz", () => {
    setRegion("eea");
    document.cookie = `${CONSENT_COOKIE_NAME}=denied; path=/`;
    renderBanner();
    expect(screen.queryByText(COPY.title)).not.toBeInTheDocument();
  });
});

describe("ConsentBanner — karar", () => {
  beforeEach(() => setRegion("eea"));

  it("kabul edilince onayı kaydeder ve Google'a bildirir", () => {
    renderBanner();
    fireEvent.click(screen.getByRole("button", { name: COPY.accept }));

    expect(readConsentCookie()).toBe("granted");
    expect(gtag).toHaveBeenCalledWith("consent", "update", {
      analytics_storage: "granted",
    });
  });

  it("reddedilince reddi kaydeder ve Google'a bildirir", () => {
    renderBanner();
    fireEvent.click(screen.getByRole("button", { name: COPY.reject }));

    expect(readConsentCookie()).toBe("denied");
    expect(gtag).toHaveBeenCalledWith("consent", "update", {
      analytics_storage: "denied",
    });
  });

  it("karar verilince şerit kaybolur", () => {
    renderBanner();
    fireEvent.click(screen.getByRole("button", { name: COPY.accept }));
    expect(screen.queryByText(COPY.title)).not.toBeInTheDocument();
  });
});

describe("ConsentBanner — erişilebilirlik ve karanlık desen", () => {
  beforeEach(() => setRegion("eea"));

  it("adlandırılmış bir bölge olarak duyurulur", () => {
    renderBanner();
    expect(screen.getByRole("region", { name: COPY.regionLabel })).toBeInTheDocument();
  });

  it("aydınlatma metnine bağlantı verir", () => {
    renderBanner();
    const link = screen.getByRole("link", { name: COPY.policyLabel });
    expect(link).toHaveAttribute("href", COPY.policyHref);
  });

  it("iki düğme de gerçek buton — ret bağlantıya gizlenmez", () => {
    // EDPB rehberi: reddetmek kabul etmek kadar kolay olmalı. Reddi
    // metin bağlantısına düşürmek karanlık desendir.
    renderBanner();
    expect(screen.getByRole("button", { name: COPY.accept })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: COPY.reject })).toBeInTheDocument();
  });
});
