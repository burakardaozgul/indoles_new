import { describe, expect, it, beforeEach } from "vitest";
import Database from "better-sqlite3";
import { readFileSync } from "node:fs";
import {
  createBooking, findBookingByToken, listSoldSlots,
  cancelBooking, hasActiveBooking, attachCalendarResult,
} from "../repository";

/**
 * D1 SQLite üzerine kurulu; testte better-sqlite3'ü D1 arayüzüne saran ince
 * bir adaptör kullanıyoruz. Amaç kısıtın GERÇEKTEN veritabanı seviyesinde
 * çalıştığını görmek — mock bir depo bunu kanıtlayamaz.
 */
function makeDb() {
  const sqlite = new Database(":memory:");
  sqlite.exec(readFileSync("migrations/0001_bookings.sql", "utf-8"));
  return {
    prepare(sql: string) {
      const stmt = sqlite.prepare(sql);
      let bound: unknown[] = [];
      const api = {
        bind: (...args: unknown[]) => { bound = args; return api; },
        run: async () => { stmt.run(...bound); return { success: true }; },
        first: async () => stmt.get(...bound) ?? null,
        all: async () => ({ results: stmt.all(...bound) }),
      };
      return api;
    },
  } as unknown as D1Database;
}

const base = {
  consultantId: "burak",
  startsAtUtc: "2026-09-07T10:00:00.000Z",
  endsAtUtc: "2026-09-07T11:30:00.000Z",
  visitorTimezone: "Europe/Istanbul",
  name: "Ayşe Yılmaz",
  email: "ayse@example.com",
  locale: "tr" as const,
};

describe("repository", () => {
  let db: D1Database;
  beforeEach(() => { db = makeDb(); });

  it("randevu oluşturur ve token ile bulunur", async () => {
    const res = await createBooking(db, base);
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    const found = await findBookingByToken(db, res.row.cancelToken);
    expect(found?.email).toBe("ayse@example.com");
  });

  it("AYNI slota ikinci rezervasyon veritabanı seviyesinde reddedilir", async () => {
    await createBooking(db, base);
    const second = await createBooking(db, { ...base, email: "baska@example.com" });
    expect(second).toEqual({ ok: false, reason: "slot_taken" });
  });

  it("EŞZAMANLI iki yazmadan tam olarak biri başarılı olur", async () => {
    // Spec §7'nin asıl talebi bu: "tek tek çağrılarla test etmek kanıt
    // değil". Sıralı test yalnız ikinci çağrının reddedildiğini gösterir;
    // yarışın gerçekten veritabanında çözüldüğünü göstermez. Promise.all
    // ikisini de aynı olay döngüsü turunda başlatıyor, dolayısıyla
    // "önce kontrol et sonra yaz" deseni kurulsaydı ikisi de geçerdi.
    const results = await Promise.all([
      createBooking(db, { ...base, email: "bir@example.com" }),
      createBooking(db, { ...base, email: "iki@example.com" }),
    ]);
    const succeeded = results.filter((r) => r.ok);
    const rejected = results.filter((r) => !r.ok);
    expect(succeeded).toHaveLength(1);
    expect(rejected).toHaveLength(1);
    expect(rejected[0]).toEqual({ ok: false, reason: "slot_taken" });

    // Ve veritabanında gerçekten tek satır var.
    const sold = await listSoldSlots(db, "2026-09-01T00:00:00.000Z", "2026-09-30T00:00:00.000Z");
    expect(sold).toEqual(["2026-09-07T10:00:00.000Z"]);
  });

  it("iptal edilen slot yeniden satılabilir — kısmi indeks doğrulaması", async () => {
    const first = await createBooking(db, base);
    if (!first.ok) throw new Error("kurulum başarısız");
    await cancelBooking(db, first.row.cancelToken);
    const second = await createBooking(db, { ...base, email: "baska@example.com" });
    expect(second.ok).toBe(true);
  });

  it("aynı e-postadan ikinci aktif randevu engellenir", async () => {
    await createBooking(db, base);
    const second = await createBooking(db, { ...base, startsAtUtc: "2026-09-08T10:00:00.000Z", endsAtUtc: "2026-09-08T11:30:00.000Z" });
    expect(second).toEqual({ ok: false, reason: "duplicate_email" });
  });

  it("iptal iki kez çağrılınca hata vermez (idempotent)", async () => {
    const r = await createBooking(db, base);
    if (!r.ok) throw new Error("kurulum başarısız");
    expect(await cancelBooking(db, r.row.cancelToken)).toBe("cancelled");
    expect(await cancelBooking(db, r.row.cancelToken)).toBe("already_cancelled");
  });

  it("listSoldSlots yalnız confirmed satırları döndürür", async () => {
    const r = await createBooking(db, base);
    if (!r.ok) throw new Error("kurulum başarısız");
    expect(await listSoldSlots(db, "2026-09-01T00:00:00.000Z", "2026-09-30T00:00:00.000Z"))
      .toEqual(["2026-09-07T10:00:00.000Z"]);
    await cancelBooking(db, r.row.cancelToken);
    expect(await listSoldSlots(db, "2026-09-01T00:00:00.000Z", "2026-09-30T00:00:00.000Z"))
      .toEqual([]);
  });

  it("KVKK: satırda telefon/şirket/unvan/persona sütunu YOKTUR", async () => {
    const r = await createBooking(db, base);
    if (!r.ok) throw new Error("kurulum başarısız");
    const row = await findBookingByToken(db, r.row.cancelToken);
    const keys = Object.keys(row as object);
    for (const forbidden of ["phone", "company", "title", "persona", "problems"]) {
      expect(keys).not.toContain(forbidden);
    }
  });

  it("Calendar sonucu satıra işlenir", async () => {
    const r = await createBooking(db, base);
    if (!r.ok) throw new Error("kurulum başarısız");
    await attachCalendarResult(db, r.row.id, "evt_1", "https://meet.google.com/abc-defg-hij");
    const row = await findBookingByToken(db, r.row.cancelToken);
    expect(row?.meetUrl).toBe("https://meet.google.com/abc-defg-hij");
  });

  it("hasActiveBooking iptal sonrası null döner", async () => {
    const r = await createBooking(db, base);
    if (!r.ok) throw new Error("kurulum başarısız");
    expect(await hasActiveBooking(db, base.email)).not.toBeNull();
    await cancelBooking(db, r.row.cancelToken);
    expect(await hasActiveBooking(db, base.email)).toBeNull();
  });
});
