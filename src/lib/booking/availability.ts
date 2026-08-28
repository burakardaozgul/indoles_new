import { generateSlotsForDay, isSlotBookable } from "./slots";

type Interval = { start: string; end: string };

/**
 * "Bugün" iş günü modelinin dilimine göre belirlenir, UTC'ye göre değil.
 * UTC gününü kullanmak her gün 21:00-23:59 UTC arasında pencereyi bir gün
 * geriye kaydırıyor ve listenin başına anlamsız bir boş gün koyuyordu.
 */
export function localDateIso(now: Date, timeZone: string): string {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone, year: "numeric", month: "2-digit", day: "2-digit",
    }).formatToParts(now).map((x) => [x.type, x.value]),
  );
  return `${p.year}-${p.month}-${p.day}`;
}

export type AvailabilityDay = {
  date: string;
  slots: { startUtc: string; endUtc: string }[];
};

/**
 * Saf hesap: I/O yok, girdiler dışarıdan verilir. Böylece Calendar ve
 * veritabanı taklit edilmeden tam kapsam test edilebiliyor.
 */
export function computeAvailability(args: {
  fromDate: string;
  days: number;
  now: Date;
  busy: Interval[];
  soldSlots: string[];
}): AvailabilityDay[] {
  const sold = new Set(args.soldSlots);
  const busy = args.busy.map((b) => ({ start: Date.parse(b.start), end: Date.parse(b.end) }));

  const out: AvailabilityDay[] = [];
  const cursor = new Date(`${args.fromDate}T12:00:00.000Z`);

  for (let i = 0; i < args.days; i++) {
    const date = cursor.toISOString().slice(0, 10);
    const slots = generateSlotsForDay(date).filter((s) => {
      if (sold.has(s.startUtc)) return false;
      if (!isSlotBookable(s.startUtc, args.now)) return false;
      const start = Date.parse(s.startUtc);
      const end = Date.parse(s.endUtc);
      // Kısmi çakışma da doludur: 15 dakikalık bir toplantı 90 dakikalık
      // slotun ortasına düşse bile o slot satılamaz.
      return !busy.some((b) => b.start < end && b.end > start);
    });
    out.push({ date, slots });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return out;
}
