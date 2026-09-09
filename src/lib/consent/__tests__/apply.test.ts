import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { applyConsent } from "../apply";
import type { ConsentState } from "../cookie";
import { MARKETING_CONSENT_EVENT } from "@/lib/analytics/ga-bootstrap";

const gtag = vi.fn();

const ALL: ConsentState = { analytics: "granted", marketing: "granted" };
const ANALYTICS_ONLY: ConsentState = { analytics: "granted", marketing: "denied" };
const NONE: ConsentState = { analytics: "denied", marketing: "denied" };

beforeEach(() => {
  gtag.mockClear();
  (window as unknown as { gtag?: unknown }).gtag = gtag;
  (window as unknown as { dataLayer?: unknown[] }).dataLayer = [];
});

afterEach(() => {
  // Önce stub'lar geri alınır: `window` undefined'a stub'lanmış bir testten
  // sonra `delete window.gtag` çalışmaz.
  vi.unstubAllGlobals();
  delete (window as unknown as { gtag?: unknown }).gtag;
});

describe("applyConsent", () => {
  it("tam onayda dört sinyali birden açar", () => {
    applyConsent(ALL);
    expect(gtag).toHaveBeenCalledWith("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    });
  });

  it("pazarlama reddedilince üç reklam sinyalini birden kapatır", () => {
    // Üçü tek karara bağlı (ADR-033): ziyaretçiye üç ayrı teknik kavram
    // ayrıştırtmak anlamlı bir seçim üretmez.
    applyConsent(ANALYTICS_ONLY);
    expect(gtag).toHaveBeenCalledWith("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  });

  it("tam rette hepsini kapalı bildirir", () => {
    // Ret de bildirilmeli: bildirilmezse varsayılan "denied"da kalır ama
    // Google modellemesi kullanıcının karar verdiğini bilmez.
    applyConsent(NONE);
    expect(gtag).toHaveBeenCalledWith("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  });

  it("analitik ile pazarlamayı bağımsız bildirir", () => {
    // Regresyon kilidi: pazarlama onayı analitiğin arkasına saklanamaz.
    applyConsent({ analytics: "denied", marketing: "granted" });
    const payload = gtag.mock.calls[0]?.[2] as Record<string, unknown>;
    expect(payload.analytics_storage).toBe("denied");
    expect(payload.ad_storage).toBe("granted");
  });

  it("gtag yüklenmemişken sessizce düşer", () => {
    // GA kimliği tanımsızken (lokal, preview) script hiç basılmaz;
    // banner yine de çalışabilmeli.
    delete (window as unknown as { gtag?: unknown }).gtag;
    expect(() => applyConsent(ALL)).not.toThrow();
  });

  it("sunucu tarafında (window undefined) çalışmaz", () => {
    vi.stubGlobal("window", undefined);
    expect(() => applyConsent(ALL)).not.toThrow();
    expect(gtag).not.toHaveBeenCalled();
  });

  it("pazarlama onaylaninca reklam etiketleri icin acik olay basar", () => {
    // GTM'in "ek izin kontrolu" tek basina yetmedi: riza dogru okundugu
    // halde All Pages tetikleyicisi Meta Pixel icin hic degerlendirilmedi
    // (Tag Assistant, 2026-09-08). Etiketler bu olaya bagli.
    applyConsent(ALL);
    const dl = (window as unknown as { dataLayer: Record<string, unknown>[] }).dataLayer;
    expect(dl).toContainEqual({ event: MARKETING_CONSENT_EVENT });
  });

  it("pazarlama reddedilince o olayi basmaz", () => {
    applyConsent(ANALYTICS_ONLY);
    const dl = (window as unknown as { dataLayer: Record<string, unknown>[] }).dataLayer;
    expect(dl).not.toContainEqual({ event: MARKETING_CONSENT_EVENT });
  });
});
