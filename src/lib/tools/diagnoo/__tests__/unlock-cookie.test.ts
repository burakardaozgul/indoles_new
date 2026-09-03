import { describe, it, expect } from "vitest";
import { readUnlockToken, unlockCookieName } from "../unlock-cookie";

/**
 * `readUnlockToken` bozuk `Cookie` başlığına dayanıklı olmalı — Cila A madde 1.
 * `decodeURIComponent` tek başına yüzde işaretini (`%`) URI olarak
 * ayrıştıramayan her değerde `URIError` fırlatır; bu hata rotanın try/catch'i
 * dışında kalırsa istek 500 ile patlar. Doğru davranış: bozuk token'ı `null`
 * ile işaretleyip çağırana (rota) kilit kapalıymış gibi davranma imkânı vermek.
 */
describe("readUnlockToken", () => {
  it("eşleşen çerezin token'ını decode ederek döner", () => {
    const header = `${unlockCookieName("d1")}=abc%20def`;
    expect(readUnlockToken(header, "d1")).toBe("abc def");
  });

  it("çerez başlığı yoksa veya boşsa boş dize döner", () => {
    expect(readUnlockToken(null, "d1")).toBe("");
    expect(readUnlockToken("", "d1")).toBe("");
  });

  it("başka teşhisin çerezini görmezden gelir", () => {
    const header = `${unlockCookieName("d2")}=xyz`;
    expect(readUnlockToken(header, "d1")).toBe("");
  });

  it("bozuk yüzde-kodlama 500 atmaz, null döner", () => {
    const header = `${unlockCookieName("d1")}=%`;
    expect(readUnlockToken(header, "d1")).toBeNull();
  });

  it("diğer çerezler arasında bozuk olan tek başına akışı bozmaz", () => {
    const header = `foo=bar; ${unlockCookieName("d1")}=%E0%A4%A; baz=qux`;
    expect(readUnlockToken(header, "d1")).toBeNull();
  });
});
