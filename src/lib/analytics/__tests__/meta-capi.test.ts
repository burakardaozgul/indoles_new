import { describe, it, expect, vi } from "vitest";
import {
  hashForMeta,
  normalizeEmail,
  normalizePhone,
  buildUserData,
  sendCapiEvent,
} from "../meta-capi";

describe("normalizeEmail", () => {
  it("kırpar ve küçük harfe çevirir — Meta eşleştirme kuralı", () => {
    expect(normalizeEmail("  Burak@Indoles.COM.TR ")).toBe("burak@indoles.com.tr");
  });
});

describe("normalizePhone", () => {
  it("rakam dışını atar", () => {
    expect(normalizePhone("+90 (532) 111 22 33")).toBe("905321112233");
  });

  it("yerel 0'lı numaraya ülke kodu ekler", () => {
    // Meta ülke kodsuz numarayı eşleştiremiyor.
    expect(normalizePhone("0532 111 22 33")).toBe("905321112233");
  });

  it("uluslararası 00 önekini atar", () => {
    expect(normalizePhone("0090 532 111 22 33")).toBe("905321112233");
  });

  it("ülke kodsuz 10 haneliye 90 ekler", () => {
    expect(normalizePhone("5321112233")).toBe("905321112233");
  });
});

describe("hashForMeta", () => {
  it("SHA-256 üretir (64 hex karakter)", async () => {
    const h = await hashForMeta("burak@indoles.com.tr");
    expect(h).toMatch(/^[0-9a-f]{64}$/);
  });

  it("aynı girdi aynı hash — eşleştirme buna bağlı", async () => {
    expect(await hashForMeta("a@b.com")).toBe(await hashForMeta("a@b.com"));
  });
});

describe("buildUserData", () => {
  it("e-posta ve telefonu hash'ler, ham göndermez", async () => {
    const out = await buildUserData({ email: "Burak@Indoles.com.tr", phone: "0532 111 22 33" });
    expect(out.em).toEqual([await hashForMeta("burak@indoles.com.tr")]);
    expect(out.ph).toEqual([await hashForMeta("905321112233")]);
    expect(JSON.stringify(out)).not.toContain("Burak");
    expect(JSON.stringify(out)).not.toContain("0532");
  });

  it("IP ve User-Agent'ı hash'lemez — Meta ham bekliyor", async () => {
    const out = await buildUserData({ clientIpAddress: "1.2.3.4", clientUserAgent: "UA/1" });
    expect(out.client_ip_address).toBe("1.2.3.4");
    expect(out.client_user_agent).toBe("UA/1");
  });

  it("boş alanları hiç koymaz", async () => {
    expect(await buildUserData({})).toEqual({});
  });
});

describe("sendCapiEvent", () => {
  const cfg = { pixelId: "1378220013915135", accessToken: "TOKEN" };

  it("event_id'yi olduğu gibi taşır — deduplication buna bağlı", async () => {
    let sent: Record<string, unknown> = {};
    const fake = vi.fn(async (_u: string, init: RequestInit) => {
      sent = JSON.parse(String(init.body));
      return new Response(JSON.stringify({ events_received: 1 }), { status: 200 });
    }) as unknown as typeof fetch;

    await sendCapiEvent(cfg, { eventName: "Lead", eventId: "abc-123" }, fake);
    const ev = (sent.data as Record<string, unknown>[])[0];
    expect(ev?.event_id).toBe("abc-123");
    expect(ev?.action_source).toBe("website");
  });

  it("test kodunu gövdeye ekler", async () => {
    let sent: Record<string, unknown> = {};
    const fake = vi.fn(async (_u: string, init: RequestInit) => {
      sent = JSON.parse(String(init.body));
      return new Response(JSON.stringify({ events_received: 1 }), { status: 200 });
    }) as unknown as typeof fetch;

    await sendCapiEvent({ ...cfg, testEventCode: "TEST69819" },
      { eventName: "Lead", eventId: "x1234567" }, fake);
    expect(sent.test_event_code).toBe("TEST69819");
  });

  it("Meta hatasını yükseltmez, sonuç olarak döner", async () => {
    // Ölçüm hatası ziyaretçinin akışını bozmamalı.
    const fake = vi.fn(async () =>
      new Response(JSON.stringify({ error: { message: "Invalid token" } }), { status: 400 }),
    ) as unknown as typeof fetch;
    const res = await sendCapiEvent(cfg, { eventName: "Lead", eventId: "x1234567" }, fake);
    expect(res).toEqual({ ok: false, error: "Invalid token" });
  });

  it("ağ hatasında da patlamaz", async () => {
    const fake = vi.fn(async () => {
      throw new Error("network down");
    }) as unknown as typeof fetch;
    const res = await sendCapiEvent(cfg, { eventName: "Lead", eventId: "x1234567" }, fake);
    expect(res.ok).toBe(false);
  });

  it("erişim jetonunu gövdede gönderir, URL'de değil", async () => {
    // Jeton sorgu dizesinde giderse sunucu loglarına düşer.
    let url = "";
    let sent: Record<string, unknown> = {};
    const fake = vi.fn(async (u: string, init: RequestInit) => {
      url = u;
      sent = JSON.parse(String(init.body));
      return new Response(JSON.stringify({ events_received: 1 }), { status: 200 });
    }) as unknown as typeof fetch;
    await sendCapiEvent(cfg, { eventName: "Lead", eventId: "x1234567" }, fake);
    expect(url).not.toContain("TOKEN");
    expect(sent.access_token).toBe("TOKEN");
  });
});
