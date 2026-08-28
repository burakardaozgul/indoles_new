import { describe, expect, it } from "vitest";
import { computeAvailability } from "../availability";

const NOW = new Date("2026-09-01T09:00:00.000Z");

describe("computeAvailability", () => {
  it("Calendar'da dolu olan slotu listeden çıkarır", () => {
    const days = computeAvailability({
      fromDate: "2026-09-07", days: 1, now: NOW,
      busy: [{ start: "2026-09-07T10:00:00.000Z", end: "2026-09-07T11:30:00.000Z" }],
      soldSlots: [],
    });
    const starts = days[0]!.slots.map((s) => s.startUtc);
    expect(starts).not.toContain("2026-09-07T10:00:00.000Z");
    expect(starts).toHaveLength(3);
  });

  it("kısmen çakışan meşguliyet de slotu düşürür", () => {
    // 13:30-13:45 yerel, ikinci slotun (11:45Z-13:15Z) ortasına düşüyor.
    const days = computeAvailability({
      fromDate: "2026-09-07", days: 1, now: NOW,
      busy: [{ start: "2026-09-07T12:00:00.000Z", end: "2026-09-07T12:15:00.000Z" }],
      soldSlots: [],
    });
    expect(days[0]!.slots.map((s) => s.startUtc)).not.toContain("2026-09-07T11:45:00.000Z");
  });

  it("bizim sattığımız slot listeden çıkar", () => {
    const days = computeAvailability({
      fromDate: "2026-09-07", days: 1, now: NOW,
      busy: [], soldSlots: ["2026-09-07T13:30:00.000Z"],
    });
    expect(days[0]!.slots.map((s) => s.startUtc)).not.toContain("2026-09-07T13:30:00.000Z");
  });

  it("24 saatten yakın slotlar hiç görünmez", () => {
    const days = computeAvailability({
      fromDate: "2026-09-07", days: 1,
      now: new Date("2026-09-07T00:00:00.000Z"), // ilk slota 10 saat var
      busy: [], soldSlots: [],
    });
    expect(days[0]!.slots).toHaveLength(0);
  });

  it("Pazar günü listede boş döner", () => {
    const days = computeAvailability({
      fromDate: "2026-09-13", days: 1, now: NOW, busy: [], soldSlots: [],
    });
    expect(days[0]).toEqual({ date: "2026-09-13", slots: [] });
  });

  it("istenen gün sayısı kadar gün döndürür", () => {
    const days = computeAvailability({
      fromDate: "2026-09-07", days: 28, now: NOW, busy: [], soldSlots: [],
    });
    expect(days).toHaveLength(28);
  });
});
