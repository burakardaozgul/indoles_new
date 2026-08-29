import { describe, it, expect, beforeEach } from "vitest";
import { sessionId } from "../session";

/**
 * Görev 10'da `EntryPopup`in özel fonksiyonundan buraya taşındı: popup ve
 * `/iletisim`in gömülü rezervasyon yüzeyi (`ContactBookingScreen`) aynı
 * `brief_submitted` olayını aynı `briefId` sözleşmesiyle yazıyor.
 */
beforeEach(() => {
  window.sessionStorage.clear();
});

describe("sessionId", () => {
  it("aynı sekmede tekrar çağrıldığında aynı değeri döner", () => {
    const a = sessionId();
    const b = sessionId();
    expect(a).toBe(b);
  });

  it("sessionStorage temizse yeni bir kimlik üretir ve saklar", () => {
    const id = sessionId();
    expect(id).toMatch(/^sess_/);
    expect(window.sessionStorage.getItem("indoles_session_id")).toBe(id);
  });

  it("iki bağımsız oturum (storage temizlendikten sonra) farklı kimlik üretir", () => {
    const first = sessionId();
    window.sessionStorage.clear();
    const second = sessionId();
    expect(first).not.toBe(second);
  });
});
