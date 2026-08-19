import { describe, it, expect, beforeEach } from "vitest";
import { readPopupCookie, writePopupCookie, shouldShowPopup } from "../cookie";

function clearCookies() {
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
  });
}

/**
 * Tarihler gerçek saate göre göreli üretilir.
 *
 * Sabit tarih kullanılamaz: `writePopupCookie` cookie'nin `expires` alanını
 * `expiresAt`'ten kurar ve jsdom geçmiş tarihli cookie'yi anında düşürür.
 * Sabit fixture'lar o tarihi geçince test kendiliğinden kırılırdı
 * (2026-08'de yaşandı). `days()` bunu kalıcı olarak engeller.
 */
const DAY_MS = 24 * 60 * 60 * 1000;
const NOW = Date.now();
const days = (n: number) => new Date(NOW + n * DAY_MS);
const iso = (n: number) => days(n).toISOString();

describe("cookie state", () => {
  beforeEach(clearCookies);

  it("yaz-oku döngüsü çalışır", () => {
    writePopupCookie({
      version: 1,
      lastShownAt: iso(0),
      outcome: "completed",
      persona: "donusum-teknoloji",
      problems: ["a", "b", "c"],
      expiresAt: iso(180),
    });
    const r = readPopupCookie();
    expect(r?.outcome).toBe("completed");
    expect(r?.persona).toBe("donusum-teknoloji");
  });

  it("cookie yoksa null döner", () => {
    expect(readPopupCookie()).toBeNull();
  });

  describe("shouldShowPopup", () => {
    it("cookie yoksa gösterir", () => {
      expect(shouldShowPopup(new Date())).toBe(true);
    });

    it("completed & geçerli → göstermez", () => {
      writePopupCookie({
        version: 1,
        lastShownAt: iso(0),
        outcome: "completed",
        persona: "buyume-pazarlar",
        problems: ["a", "b", "c"],
        expiresAt: iso(180),
      });
      expect(shouldShowPopup(days(3))).toBe(false);
    });

    it("completed & süresi dolmuş → gösterir", () => {
      writePopupCookie({
        version: 1,
        lastShownAt: iso(0),
        outcome: "completed",
        persona: "buyume-pazarlar",
        problems: ["a", "b", "c"],
        expiresAt: iso(180),
      });
      // Cookie hâlâ tarayıcıda duruyor ama mantıksal geçerliliği bitmiş:
      // kontrol anı expiresAt'in ötesinde.
      expect(shouldShowPopup(days(181))).toBe(true);
    });

    it("dismissed & geçerli → göstermez (30 gün)", () => {
      writePopupCookie({
        version: 1,
        lastShownAt: iso(0),
        outcome: "dismissed",
        persona: null,
        problems: [],
        expiresAt: iso(30),
      });
      expect(shouldShowPopup(days(8))).toBe(false);
    });
  });
});
