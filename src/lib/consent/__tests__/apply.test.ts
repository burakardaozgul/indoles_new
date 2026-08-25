import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { applyConsent } from "../apply";

const gtag = vi.fn();

beforeEach(() => {
  gtag.mockClear();
  (window as unknown as { gtag?: unknown }).gtag = gtag;
});

afterEach(() => {
  // Önce stub'lar geri alınır: `window` undefined'a stub'lanmış bir testten
  // sonra `delete window.gtag` çalışmaz.
  vi.unstubAllGlobals();
  delete (window as unknown as { gtag?: unknown }).gtag;
});

describe("applyConsent", () => {
  it("onay verildiğinde analytics_storage'ı açar", () => {
    applyConsent("granted");
    expect(gtag).toHaveBeenCalledWith("consent", "update", {
      analytics_storage: "granted",
    });
  });

  it("onay reddedildiğinde analytics_storage'ı kapalı bildirir", () => {
    // Ret de bildirilmeli: bildirilmezse bölgesel varsayılan "denied"da
    // kalır ama Google modellemesi kullanıcının karar verdiğini bilmez.
    applyConsent("denied");
    expect(gtag).toHaveBeenCalledWith("consent", "update", {
      analytics_storage: "denied",
    });
  });

  it("reklam sinyallerine dokunmaz — varsayılanda reddedilmiş kalır", () => {
    applyConsent("granted");
    const payload = gtag.mock.calls[0]?.[2] as Record<string, unknown>;
    expect(payload).not.toHaveProperty("ad_storage");
    expect(payload).not.toHaveProperty("ad_user_data");
    expect(payload).not.toHaveProperty("ad_personalization");
  });

  it("gtag yüklenmemişken sessizce düşer", () => {
    // GA kimliği tanımsızken (lokal, preview) script hiç basılmaz;
    // banner yine de çalışabilmeli.
    delete (window as unknown as { gtag?: unknown }).gtag;
    expect(() => applyConsent("granted")).not.toThrow();
  });

  it("sunucu tarafında (window undefined) çalışmaz", () => {
    vi.stubGlobal("window", undefined);
    expect(() => applyConsent("granted")).not.toThrow();
    expect(gtag).not.toHaveBeenCalled();
  });
});
