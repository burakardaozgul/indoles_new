import { describe, expect, it } from "vitest";
import { computeAvailability, localDateIso } from "../availability";

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

  it("dönen günler ardışık takvim günleridir — ay geçişi dahil", () => {
    const days = computeAvailability({
      fromDate: "2026-09-28", days: 7, now: NOW, busy: [], soldSlots: [],
    });
    expect(days.map((d) => d.date)).toEqual([
      "2026-09-28", "2026-09-29", "2026-09-30",
      "2026-10-01", "2026-10-02", "2026-10-03", "2026-10-04",
    ]);
  });
});

describe("localDateIso", () => {
  it("bugün, UTC'ye göre değil İstanbul dilimine göre belirlenir", () => {
    // 21:00Z = İstanbul'da ertesi gün 00:00. UTC günü kullanan bir uygulama
    // burada bir gün geride kalır ve pencerenin başına boş gün koyar.
    expect(localDateIso(new Date("2026-10-15T21:00:00.000Z"), "Europe/Istanbul")).toBe("2026-10-16");
    expect(localDateIso(new Date("2026-10-15T20:59:00.000Z"), "Europe/Istanbul")).toBe("2026-10-15");
  });
});
