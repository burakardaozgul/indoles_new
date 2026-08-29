import { describe, expect, it, beforeEach } from "vitest";
import Database from "better-sqlite3";
import { readFileSync } from "node:fs";
import {
  createBooking, findBookingByToken, listSoldSlots,
  cancelBooking, hasActiveBooking, attachCalendarResult, rescheduleBooking,
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
        run: async () => {
          const info = stmt.run(...bound);
          // better-sqlite3 `run()` sonucu `changes` alanını zaten veriyor —
          // rescheduleBooking'in sahte-başarı kontrolü bunu okuyor.
          return { success: true, meta: { changes: info.changes } };
        },
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
    // Bu test "önce kontrol et sonra yaz" desenini yakalar: iki okuma da
    // herhangi bir yazma commit olmadan önce çalışıyor, dolayısıyla ön
    // kontrole güvenen bir uygulama ikisini de kabul ederdi. Kanıtladığı
    // şey kısıtın SQL seviyesinde tuttuğu. Kanıtlamadığı şey: better-sqlite3
    // senkron olduğu için burada gerçek paralellik yok; D1'in ağ üzerinden
    // gelen eşzamanlı isteklerdeki davranışı ancak canlı ortamda doğrulanır.
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

  it("EŞZAMANLI aynı e-posta iki farklı slota yazamaz", async () => {
    // Ön kontrol tek başına yeterli değildi: iki istek de "aktif randevu yok"
    // görüp ikisi de yazabiliyordu. Garanti artık kısmi indekste
    // (idx_bookings_active_email).
    const results = await Promise.all([
      createBooking(db, base),
      createBooking(db, { ...base, startsAtUtc: "2026-09-08T10:00:00.000Z", endsAtUtc: "2026-09-08T11:30:00.000Z" }),
    ]);
    expect(results.filter((r) => r.ok)).toHaveLength(1);
    expect(results.filter((r) => !r.ok)[0]).toEqual({ ok: false, reason: "duplicate_email" });
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

  it("e-posta büyük/küçük harf farkı aktif randevu kontrolünü atlatamaz", async () => {
    // SQLite BINARY collation kullanır: normalize edilmeseydi bu iki e-posta
    // farklı sayılır ve ikisi de aktif randevu açabilirdi.
    const first = await createBooking(db, { ...base, email: "AYSE@Example.com" });
    expect(first.ok).toBe(true);
    const second = await createBooking(db, {
      ...base,
      email: "ayse@example.com",
      startsAtUtc: "2026-09-08T10:00:00.000Z",
      endsAtUtc: "2026-09-08T11:30:00.000Z",
    });
    expect(second).toEqual({ ok: false, reason: "duplicate_email" });
  });

  it("iptal iki kez çağrılınca hata vermez (idempotent)", async () => {
    const r = await createBooking(db, base);
    if (!r.ok) throw new Error("kurulum başarısız");
    expect(await cancelBooking(db, r.row.cancelToken)).toBe("cancelled");
    expect(await cancelBooking(db, r.row.cancelToken)).toBe("already_cancelled");
  });

  it("ön kontrolden sonra araya EŞZAMANLI ikinci iptal girerse SAHTE 'cancelled' dönmez (Görev 7 fix turu 1, bulgu 2)", async () => {
    // `rescheduleBooking`'in TOCTOU testiyle AYNI enjeksiyon tekniği: A'nın
    // UPDATE'i çalışmadan hemen önce, B'nin (eşzamanlı ikinci DELETE) satırı
    // ZATEN iptal etmiş olduğunu simüle ediyoruz. Guard'sız bir UPDATE
    // (`WHERE id = ?`, `status='confirmed'` şartı yok) bunu sessizce
    // "başarılı" sayardı ve A da "cancelled" dönerdi — DELETE rotasında bu,
    // iki eşzamanlı isteğin İKİSİNİN DE bildirim maili göndermesi demek
    // (denetçinin gerçek SQLite üzerinde kanıtladığı senaryo).
    const r = await createBooking(db, base);
    if (!r.ok) throw new Error("kurulum başarısız");

    const originalPrepare = db.prepare.bind(db);
    db.prepare = ((sql: string) => {
      if (sql.startsWith("UPDATE bookings SET status = 'cancelled'")) {
        originalPrepare("UPDATE bookings SET status = 'cancelled' WHERE id = ?").bind(r.row.id).run();
      }
      return originalPrepare(sql);
    }) as typeof db.prepare;

    const result = await cancelBooking(db, r.row.cancelToken);
    expect(result).toBe("already_cancelled");

    // Satır gerçekten iptal durumunda — veri bütünlüğü bozulmadı, yalnız
    // ikinci çağıranın yanlışlıkla "cancelled" (ve dolayısıyla ikinci bir
    // bildirim maili) alması engellendi.
    const found = await findBookingByToken(db, r.row.cancelToken);
    expect(found?.status).toBe("cancelled");
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

  describe("rescheduleBooking", () => {
    it("mutlu yol: boş bir slota taşır", async () => {
      const r = await createBooking(db, base);
      if (!r.ok) throw new Error("kurulum başarısız");
      const newStart = "2026-09-08T10:00:00.000Z";
      const newEnd = "2026-09-08T11:30:00.000Z";
      const res = await rescheduleBooking(db, r.row.cancelToken, newStart, newEnd);
      expect(res).toEqual({ ok: true, row: { ...r.row, startsAtUtc: newStart, endsAtUtc: newEnd } });

      // Veritabanı da güncellenmiş olmalı, dönen değer kadar değil.
      const found = await findBookingByToken(db, r.row.cancelToken);
      expect(found?.startsAtUtc).toBe(newStart);
    });

    it("dolu bir slota taşımak slot_taken döner", async () => {
      const r = await createBooking(db, base);
      if (!r.ok) throw new Error("kurulum başarısız");
      const otherStart = "2026-09-08T10:00:00.000Z";
      const otherEnd = "2026-09-08T11:30:00.000Z";
      const other = await createBooking(db, { ...base, email: "baska@example.com", startsAtUtc: otherStart, endsAtUtc: otherEnd });
      expect(other.ok).toBe(true);

      const res = await rescheduleBooking(db, r.row.cancelToken, otherStart, otherEnd);
      expect(res).toEqual({ ok: false, reason: "slot_taken" });

      // İlk randevu hâlâ eski saatinde duruyor olmalı.
      const found = await findBookingByToken(db, r.row.cancelToken);
      expect(found?.startsAtUtc).toBe(base.startsAtUtc);
    });

    it("iptal edilmiş randevu için not_found döner", async () => {
      const r = await createBooking(db, base);
      if (!r.ok) throw new Error("kurulum başarısız");
      await cancelBooking(db, r.row.cancelToken);

      const res = await rescheduleBooking(db, r.row.cancelToken, "2026-09-08T10:00:00.000Z", "2026-09-08T11:30:00.000Z");
      expect(res).toEqual({ ok: false, reason: "not_found" });
    });

    it("ön kontrolden sonra araya iptal girerse SAHTE BAŞARI dönmez", async () => {
      // Yukarıdaki "iptal edilmiş randevu için not_found döner" testinden
      // FARKLI bir yolu kanıtlaması gerekiyor: o testte iptal
      // rescheduleBooking ÇAĞRILMADAN ÖNCE tamamlanıyor, dolayısıyla
      // fonksiyonun EN BAŞINDAKİ ön kontrolü (`row.status !== "confirmed"`)
      // zaten "cancelled" görüp orada dönüyor — UPDATE'e hiç ulaşılmıyor.
      // better-sqlite3 senkron olduğu için ön kontrol ile UPDATE arasına
      // GERÇEK bir eşzamanlı yazma sokmanın yolu yok; bu yüzden UPDATE
      // çağrısını (yalnızca onu) db.prepare'ı geçici olarak sararak
      // yakalıyoruz ve gerçek UPDATE çalışmadan HEMEN ÖNCE satırı iptal
      // ediyoruz. Böylece rescheduleBooking'in ön kontrolü hâlâ "confirmed"
      // okuyor, ama `AND status = 'confirmed'` guard'lı UPDATE artık 0 satır
      // etkiliyor — SQLite bunu hata olarak fırlatmaz. meta.changes'i
      // okumayan bir uygulama burada ok:true derdi (denetçinin ampirik
      // kanıtladığı sahte-başarı senaryosu).
      const r = await createBooking(db, base);
      if (!r.ok) throw new Error("kurulum başarısız");

      const originalPrepare = db.prepare.bind(db);
      db.prepare = ((sql: string) => {
        if (sql.startsWith("UPDATE bookings SET starts_at_utc")) {
          originalPrepare("UPDATE bookings SET status = 'cancelled' WHERE id = ?").bind(r.row.id).run();
        }
        return originalPrepare(sql);
      }) as typeof db.prepare;

      const moved = await rescheduleBooking(db, r.row.cancelToken, "2026-09-08T10:00:00.000Z", "2026-09-08T11:30:00.000Z");
      expect(moved).toEqual({ ok: false, reason: "not_found" });

      // Ve saatler gerçekten değişmemiş.
      const found = await findBookingByToken(db, r.row.cancelToken);
      expect(found?.startsAtUtc).toBe(base.startsAtUtc);
    });
  });
});
