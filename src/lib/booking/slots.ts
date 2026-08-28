import { BOOKING_CONFIG } from "./config";

/**
 * Yerel duvar saatini UTC'ye çevirir.
 *
 * `Intl` ile ofset hesaplanıyor çünkü Türkiye 2016'dan beri kalıcı UTC+3
 * olsa da kuralı koda gömmek, ileride başka bir dilim eklenirse sessizce
 * yanlış sonuç verir. Yaz saati geçişi olan bir dilimde de doğru çalışır.
 */
function zonedTimeToUtc(dateIso: string, hhmm: string, timeZone: string): Date {
  const [h, m] = hhmm.split(":").map(Number);
  const naive = new Date(`${dateIso}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00.000Z`);
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
  const parts = Object.fromEntries(fmt.formatToParts(naive).map((p) => [p.type, p.value]));
  const asUtc = Date.UTC(
    Number(parts.year), Number(parts.month) - 1, Number(parts.day),
    Number(parts.hour), Number(parts.minute), Number(parts.second),
  );
  return new Date(naive.getTime() * 2 - asUtc);
}

/** Yerel takvim gününün haftanın kaçıncı günü olduğu (1=Pzt … 7=Paz). */
function isoWeekday(dateIso: string): number {
  const d = new Date(`${dateIso}T12:00:00.000Z`);
  return d.getUTCDay() === 0 ? 7 : d.getUTCDay();
}

export function generateSlotsForDay(dateIso: string): { startUtc: string; endUtc: string }[] {
  const c = BOOKING_CONFIG;
  if (dateIso < c.firstAvailableDate) return [];
  // `as const` yüzünden openDays tipi salt literal [1,2,3,4,5,6] tuple'ı;
  // isoWeekday ise genel number döner. Genişletme yalnız tip uyumu içindir,
  // hangi günlerin açık olduğunu değiştirmez.
  const openDays: readonly number[] = c.openDays;
  if (!openDays.includes(isoWeekday(dateIso))) return [];

  const windowStart = zonedTimeToUtc(dateIso, c.windowStart, c.timezone);
  const windowEnd = zonedTimeToUtc(dateIso, c.windowEnd, c.timezone);
  const step = (c.slotMinutes + c.bufferMinutes) * 60_000;
  const duration = c.slotMinutes * 60_000;

  const out: { startUtc: string; endUtc: string }[] = [];
  for (let t = windowStart.getTime(); ; t += step) {
    const end = t + duration;
    // Görüşme pencere içinde BİTMELİ; sadece başlaması yetmez.
    if (end > windowEnd.getTime()) break;
    out.push({ startUtc: new Date(t).toISOString(), endUtc: new Date(end).toISOString() });
  }
  return out;
}

export function isSlotBookable(startUtc: string, now: Date): boolean {
  const lead = BOOKING_CONFIG.minLeadHours * 3_600_000;
  return Date.parse(startUtc) - now.getTime() >= lead;
}
