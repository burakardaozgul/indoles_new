import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ConsentBanner } from "../consent-banner";
import {
  CONSENT_COOKIE_NAME,
  REGION_COOKIE_NAME,
  readConsentCookie,
} from "@/lib/consent/cookie";

const COPY = {
  title: "Çerez tercihiniz.",
  titleNotice: "Çerez kullanımı.",
  body: "Hangi sayfanın işe yaradığını görmek için ölçüm, reklamlarımızın sonucunu izlemek için pazarlama çerezleri kullanıyoruz. İkisi de onayınıza bağlı.",
  bodyNotice:
    "Deneyiminizi iyileştirmek, hangi sayfaların işe yaradığını ölçmek ve reklamlarımızın sonucunu izlemek için çerez kullanıyoruz. Bunlar varsayılan olarak açık; ayrıntılar ve kapatma yolu aydınlatma metnimizde.",
  accept: "Kabul et",
  reject: "Reddet",
  close: "Kapat",
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
  });

  it("EEA dışında da görünür — ama BİLDİRİM olarak", () => {
    // ADR-035: Türkiye'de çerezler varsayılan açık; şerit soru sormaz,
    // bilgilendirir. Başlık da bunu yansıtmalı.
    setRegion("other");
    renderBanner();
    expect(screen.getByText(COPY.titleNotice)).toBeInTheDocument();
    expect(screen.queryByText(COPY.title)).not.toBeInTheDocument();
  });

  it("bölge bilinmiyorsa bildirim yüzeyi gösterilir", () => {
    // `isConsentRequired` bilinmeyen ülkeyi EEA saymıyor (bkz. region.ts);
    // şerit yine çıkar, ama bildirim olarak.
    renderBanner();
    expect(screen.getByText(COPY.titleNotice)).toBeInTheDocument();
  });

  it("onay daha önce verilmişse tekrar sormaz", () => {
    setRegion("eea");
    document.cookie = `${CONSENT_COOKIE_NAME}=gg; path=/`;
    renderBanner();
    expect(screen.queryByText(COPY.title)).not.toBeInTheDocument();
  });

  it("daha önce reddedilmişse tekrar sormaz", () => {
    setRegion("eea");
    document.cookie = `${CONSENT_COOKIE_NAME}=dd; path=/`;
    renderBanner();
    expect(screen.queryByText(COPY.title)).not.toBeInTheDocument();
  });
});

describe("ConsentBanner — bölgeye göre metin", () => {
  it("EEA'da analitik ve pazarlamayı birlikte sorar", () => {
    setRegion("eea");
    renderBanner();
    expect(screen.getByText(COPY.body, { exact: false })).toBeInTheDocument();
  });

  it("EEA dışında hiçbir şey sormaz — varsayılanı bildirir", () => {
    setRegion("other");
    renderBanner();
    expect(screen.getByText(COPY.bodyNotice, { exact: false })).toBeInTheDocument();
  });
});

describe("ConsentBanner — karar", () => {
  it("EEA'da kabul dört sinyali birden açar", () => {
    setRegion("eea");
    renderBanner();
    fireEvent.click(screen.getByRole("button", { name: COPY.accept }));

    expect(readConsentCookie()).toEqual({ analytics: "granted", marketing: "granted" });
    expect(gtag).toHaveBeenCalledWith("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    });
  });

  it("EEA'da ret ikisini de kapatır", () => {
    setRegion("eea");
    renderBanner();
    fireEvent.click(screen.getByRole("button", { name: COPY.reject }));

    expect(readConsentCookie()).toEqual({ analytics: "denied", marketing: "denied" });
  });

  it("EEA dışında ikinci düğme RET DEĞİL — 'Kapat' ve varsayılanı korur", () => {
    // ADR-035. Kapatmak varsayılanı geri almaz; geri alınacak bir soru
    // sorulmadı. Ret düğmesi bu yüzeyde hiç yok.
    setRegion("other");
    renderBanner();
    expect(screen.queryByRole("button", { name: COPY.reject })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: COPY.close }));
    expect(readConsentCookie()).toEqual({ analytics: "granted", marketing: "granted" });
  });

  it("EEA dışında dört sinyal de açık bildirilir", () => {
    setRegion("other");
    renderBanner();
    fireEvent.click(screen.getByRole("button", { name: COPY.close }));
    expect(gtag).toHaveBeenCalledWith("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    });
  });

  it("karar verilince şerit kaybolur", () => {
    setRegion("eea");
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
