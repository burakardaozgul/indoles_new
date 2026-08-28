/**
 * Rezervasyon veri erişimi — tek arayüz (spec §2.3).
 *
 * Tüm D1 çağrıları buradan geçer; sağlayıcı değişirse yalnız bu dosya
 * değişir. Rotalar SQL görmez.
 */

export type BookingStatus = "confirmed" | "cancelled" | "failed";

export type BookingRow = {
  id: string;
  cancelToken: string;
  calendarEventId: string | null;
  meetUrl: string | null;
  consultantId: string;
  startsAtUtc: string;
  endsAtUtc: string;
  visitorTimezone: string;
  name: string;
  email: string;
  locale: "tr" | "en";
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
};

type CreateInput = {
  consultantId: string;
  startsAtUtc: string;
  endsAtUtc: string;
  visitorTimezone: string;
  name: string;
  email: string;
  locale: "tr" | "en";
};

type Raw = Record<string, unknown>;

function toRow(r: Raw): BookingRow {
  return {
    id: String(r.id),
    cancelToken: String(r.cancel_token),
    calendarEventId: (r.calendar_event_id as string | null) ?? null,
    meetUrl: (r.meet_url as string | null) ?? null,
    consultantId: String(r.consultant_id),
    startsAtUtc: String(r.starts_at_utc),
    endsAtUtc: String(r.ends_at_utc),
    visitorTimezone: String(r.visitor_timezone),
    name: String(r.name),
    email: String(r.email),
    locale: r.locale === "en" ? "en" : "tr",
    status: r.status as BookingStatus,
    createdAt: String(r.created_at),
    updatedAt: String(r.updated_at),
  };
}

/** Tahmin edilemez iptal anahtarı — 256 bit, URL güvenli. */
function newToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * SQLite varsayılan olarak BINARY collation kullanır: "Ayse@x.com" ve
 * "ayse@x.com" farklı string sayılır, dolayısıyla idx_bookings_active_email
 * kısıtı ikisini ayrı e-posta olarak görüp ikisine de aktif randevu açardı.
 * Karşılaştırma ve depolama TEK bir yerde normalize edilir ki indeks
 * tutarlı kalsın.
 */
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function hasActiveBooking(db: D1Database, email: string): Promise<BookingRow | null> {
  const row = await db
    .prepare("SELECT * FROM bookings WHERE email = ? AND status = 'confirmed' LIMIT 1")
    .bind(normalizeEmail(email))
    .first();
  return row ? toRow(row as Raw) : null;
}

export async function createBooking(
  db: D1Database,
  input: CreateInput,
): Promise<{ ok: true; row: BookingRow } | { ok: false; reason: "slot_taken" | "duplicate_email" }> {
  const email = normalizeEmail(input.email);
  const existing = await hasActiveBooking(db, email);
  if (existing) return { ok: false, reason: "duplicate_email" };

  const now = new Date().toISOString();
  const row: BookingRow = {
    id: crypto.randomUUID(),
    cancelToken: newToken(),
    calendarEventId: null,
    meetUrl: null,
    status: "confirmed",
    createdAt: now,
    updatedAt: now,
    ...input,
    email,
  };

  try {
    await db
      .prepare(
        `INSERT INTO bookings (id, cancel_token, calendar_event_id, meet_url, consultant_id,
           starts_at_utc, ends_at_utc, visitor_timezone, name, email, locale, status,
           created_at, updated_at)
         VALUES (?, ?, NULL, NULL, ?, ?, ?, ?, ?, ?, ?, 'confirmed', ?, ?)`,
      )
      .bind(
        row.id, row.cancelToken, row.consultantId, row.startsAtUtc, row.endsAtUtc,
        row.visitorTimezone, row.name, row.email, row.locale, row.createdAt, row.updatedAt,
      )
      .run();
  } catch (err) {
    const msg = String(err);
    if (msg.includes("UNIQUE")) {
      // Hangi kısıt patladı: slot mu, aktif e-posta mı? Yukarıdaki
      // hasActiveBooking ön kontrolü hızlı yol ve net hata mesajı için var,
      // ama tek başına güvence değil — eşzamanlı iki istek ikisi de "aktif
      // randevu yok" görüp ikisi de buraya kadar gelebilir. Nihai ayrımı
      // veritabanının kendisi yapıyor: better-sqlite3 (ve D1'in temelindeki
      // SQLite) UNIQUE hata mesajına ihlal edilen sütunu yazıyor
      // ("UNIQUE constraint failed: bookings.email" vs.
      // "...bookings.consultant_id, bookings.starts_at_utc").
      if (msg.includes("email")) return { ok: false, reason: "duplicate_email" };
      return { ok: false, reason: "slot_taken" };
    }
    throw err;
  }
  return { ok: true, row };
}

export async function findBookingByToken(db: D1Database, token: string): Promise<BookingRow | null> {
  const row = await db.prepare("SELECT * FROM bookings WHERE cancel_token = ?").bind(token).first();
  return row ? toRow(row as Raw) : null;
}

export async function listSoldSlots(db: D1Database, fromUtc: string, toUtc: string): Promise<string[]> {
  const res = await db
    .prepare(
      `SELECT starts_at_utc FROM bookings
       WHERE status = 'confirmed' AND starts_at_utc >= ? AND starts_at_utc < ?`,
    )
    .bind(fromUtc, toUtc)
    .all();
  return (res.results as Raw[]).map((r) => String(r.starts_at_utc));
}

export async function attachCalendarResult(
  db: D1Database, id: string, eventId: string, meetUrl: string | null,
): Promise<void> {
  await db
    .prepare("UPDATE bookings SET calendar_event_id = ?, meet_url = ?, updated_at = ? WHERE id = ?")
    .bind(eventId, meetUrl, new Date().toISOString(), id)
    .run();
}

export async function markFailed(db: D1Database, id: string): Promise<void> {
  await db
    .prepare("UPDATE bookings SET status = 'failed', updated_at = ? WHERE id = ?")
    .bind(new Date().toISOString(), id)
    .run();
}

export async function cancelBooking(
  db: D1Database, token: string,
): Promise<"cancelled" | "already_cancelled" | "not_found"> {
  const row = await findBookingByToken(db, token);
  if (!row) return "not_found";
  // İdempotent: ikinci tıklama hata değil, aynı sonucun tekrarı (spec §4).
  if (row.status !== "confirmed") return "already_cancelled";
  await db
    .prepare("UPDATE bookings SET status = 'cancelled', updated_at = ? WHERE id = ?")
    .bind(new Date().toISOString(), row.id)
    .run();
  return "cancelled";
}

export async function rescheduleBooking(
  db: D1Database, token: string, startsAtUtc: string, endsAtUtc: string,
): Promise<{ ok: true; row: BookingRow } | { ok: false; reason: "slot_taken" | "not_found" }> {
  const row = await findBookingByToken(db, token);
  if (!row || row.status !== "confirmed") return { ok: false, reason: "not_found" };
  try {
    // `AND status = 'confirmed'` okuma anındaki değil YAZMA anındaki durumu
    // kilitliyor: yukarıdaki kontrol ile bu UPDATE arasında eşzamanlı bir
    // cancelBooking araya girerse, guard olmadan iptal edilmiş satırın
    // saatleri sessizce güncellenirdi.
    const res = await db
      .prepare(
        "UPDATE bookings SET starts_at_utc = ?, ends_at_utc = ?, updated_at = ? WHERE id = ? AND status = 'confirmed'",
      )
      .bind(startsAtUtc, endsAtUtc, new Date().toISOString(), row.id)
      .run();

    // SQLite eşleşme bulamayınca HATA FIRLATMIYOR, sessizce 0 satır günceller.
    // Sonucu okumazsak, ön kontrol ile UPDATE arasına giren bir iptal sonrası
    // çağırana "taşındı" demiş oluruz — Calendar ve mail o yalana göre hareket
    // eder. `res.meta` yoksa (ör. eksik bir adaptör) güvenli tarafta kal ve
    // başarı iddia etme.
    if ((res.meta?.changes ?? 0) === 0) {
      return { ok: false, reason: "not_found" };
    }
  } catch (err) {
    if (String(err).includes("UNIQUE")) return { ok: false, reason: "slot_taken" };
    throw err;
  }
  return { ok: true, row: { ...row, startsAtUtc, endsAtUtc } };
}
