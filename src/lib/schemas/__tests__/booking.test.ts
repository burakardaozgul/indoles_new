import { describe, it, expect } from "vitest";
import { bookingSchema } from "../booking";

/**
 * `problems` kısıtı `source`a bağlı (superRefine, `@/lib/schemas/booking.ts`):
 * popup Stage1/Stage2'den tam 3 gerçek seçim üretir, `/iletisim`in gömülü
 * rezervasyon yüzeyinde (Görev 10) hiç problem seçimi yok. Önceden şema her
 * yerde tam 3 string istiyordu ve `/iletisim` bunu karşılamak için üç uydurma
 * dize gönderiyordu — bu testler o deliğin bir daha açılmadığını kilitliyor.
 */
describe("bookingSchema", () => {
  const validPayload = {
    startsAtUtc: "2026-09-07T10:00:00.000Z",
    visitorTimezone: "Europe/Istanbul",
    locale: "tr",
    lead: {
      firstName: "Burak",
      lastName: "Özgül",
      phone: "+905551112233",
      email: "burak@indoles.com.tr",
      company: "INDOLES",
      title: "Kurucu",
    },
    persona: "donusum-teknoloji",
    kvkkConsent: true,
  } as const;

  it("source: popup + tam 3 problem kabul edilir", () => {
    expect(() =>
      bookingSchema.parse({ ...validPayload, source: "popup", problems: ["a", "b", "c"] }),
    ).not.toThrow();
  });

  it("source: contact + 0 problem kabul edilir", () => {
    expect(() => bookingSchema.parse({ ...validPayload, source: "contact", problems: [] })).not.toThrow();
  });

  it("source: contact + 3 problem REDDEDİLİR — problem seçimi orada yok, veri uydurulamaz", () => {
    expect(() =>
      bookingSchema.parse({ ...validPayload, source: "contact", problems: ["a", "b", "c"] }),
    ).toThrow();
  });

  it("source: popup + 0 problem REDDEDİLİR — popup'ın Stage1/Stage2 garantisi zayıflamadı", () => {
    expect(() => bookingSchema.parse({ ...validPayload, source: "popup", problems: [] })).toThrow();
  });

  it("source: popup + 2 problem REDDEDİLİR — tam 3 dışında hiçbir uzunluk geçmez", () => {
    expect(() =>
      bookingSchema.parse({ ...validPayload, source: "popup", problems: ["a", "b"] }),
    ).toThrow();
  });

  it("geçersiz source değeri reddedilir", () => {
    expect(() =>
      bookingSchema.parse({ ...validPayload, source: "widget", problems: ["a", "b", "c"] }),
    ).toThrow();
  });
});
