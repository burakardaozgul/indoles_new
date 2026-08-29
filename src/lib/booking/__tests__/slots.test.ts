import { describe, expect, it } from "vitest";
import { generateSlotsForDay, isSlotBookable } from "../slots";

/** Istanbul UTC+3; 13:00 yerel = 10:00Z. */
describe("generateSlotsForDay", () => {
  it("bir iş gününde tam olarak dört slot üretir", () => {
    const slots = generateSlotsForDay("2026-09-07"); // Pazartesi
    expect(slots).toHaveLength(4);
  });

  it("slotlar 13:00 / 14:45 / 16:30 / 18:15 yerel saatlerinde başlar", () => {
    const slots = generateSlotsForDay("2026-09-07");
    expect(slots.map((s) => s.startUtc)).toEqual([
      "2026-09-07T10:00:00.000Z",
      "2026-09-07T11:45:00.000Z",
      "2026-09-07T13:30:00.000Z",
      "2026-09-07T15:15:00.000Z",
    ]);
  });

  it("her slot 90 dakika sürer", () => {
    const [first] = generateSlotsForDay("2026-09-07");
    const ms = Date.parse(first!.endUtc) - Date.parse(first!.startUtc);
    expect(ms).toBe(90 * 60 * 1000);
  });

  it("beşinci slot üretilmez: 20:00 penceresini aşardı", () => {
    // 18:15 + 90dk = 19:45 (sığar). Sonraki 20:00'de başlayıp 21:30'da biterdi.
    const slots = generateSlotsForDay("2026-09-07");
    const lastEnd = slots[slots.length - 1]!.endUtc;
    expect(lastEnd).toBe("2026-09-07T16:45:00.000Z"); // 19:45 yerel
  });

  it("Pazar hiç slot vermez", () => {
    expect(generateSlotsForDay("2026-09-13")).toHaveLength(0); // Pazar
  });

  it("Cumartesi açıktır", () => {
    expect(generateSlotsForDay("2026-09-12")).toHaveLength(4); // Cumartesi
  });

  it("ilk müsait günden önceki tarih slot vermez", () => {
    expect(generateSlotsForDay("2026-08-28")).toHaveLength(0); // Cuma ama erken
  });
});

describe("isSlotBookable — 24 saat kuralı", () => {
  const slot = "2026-09-07T10:00:00.000Z";

  it("24 saatten fazla varsa rezerve edilebilir", () => {
    expect(isSlotBookable(slot, new Date("2026-09-06T09:00:00.000Z"))).toBe(true);
  });

  it("tam 24 saat sınırında rezerve edilebilir", () => {
    expect(isSlotBookable(slot, new Date("2026-09-06T10:00:00.000Z"))).toBe(true);
  });

  it("24 saatten az kaldıysa reddedilir", () => {
    expect(isSlotBookable(slot, new Date("2026-09-06T10:00:01.000Z"))).toBe(false);
  });

  it("geçmiş slot reddedilir", () => {
    expect(isSlotBookable(slot, new Date("2026-09-08T00:00:00.000Z"))).toBe(false);
  });
});
