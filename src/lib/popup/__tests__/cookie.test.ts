import { describe, it, expect, beforeEach } from "vitest";
import { readPopupCookie, writePopupCookie, shouldShowPopup } from "../cookie";

function clearCookies() {
  document.cookie.split(";").forEach((c) => {
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
  });
}

describe("cookie state", () => {
  beforeEach(clearCookies);

  it("yaz-oku döngüsü çalışır", () => {
    writePopupCookie({
      version: 1,
      lastShownAt: "2026-04-17T10:00:00Z",
      outcome: "completed",
      persona: "donusum-teknoloji",
      problems: ["a", "b", "c"],
      expiresAt: "2026-10-17T10:00:00Z",
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
        lastShownAt: "2026-04-17T00:00:00Z",
        outcome: "completed",
        persona: "buyume-pazarlar",
        problems: ["a", "b", "c"],
        expiresAt: "2026-10-17T00:00:00Z",
      });
      expect(shouldShowPopup(new Date("2026-04-20T00:00:00Z"))).toBe(false);
    });

    it("completed & süresi dolmuş → gösterir", () => {
      writePopupCookie({
        version: 1,
        lastShownAt: "2025-10-17T00:00:00Z",
        outcome: "completed",
        persona: "buyume-pazarlar",
        problems: ["a", "b", "c"],
        expiresAt: "2026-04-17T00:00:00Z",
      });
      expect(shouldShowPopup(new Date("2026-04-18T00:00:00Z"))).toBe(true);
    });

    it("dismissed & geçerli → göstermez (30 gün)", () => {
      writePopupCookie({
        version: 1,
        lastShownAt: "2026-04-17T00:00:00Z",
        outcome: "dismissed",
        persona: null,
        problems: [],
        expiresAt: "2026-05-17T00:00:00Z",
      });
      expect(shouldShowPopup(new Date("2026-04-25T00:00:00Z"))).toBe(false);
    });
  });
});
