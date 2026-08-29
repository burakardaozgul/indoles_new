# Rezervasyon Sistemi — Uygulama Planı

> **Agentic worker'lar için:** ZORUNLU ALT-SKILL: Bu planı görev görev uygulamak için `superpowers:subagent-driven-development` (önerilen) veya `superpowers:executing-plans` kullan. Adımlar takip için checkbox (`- [ ]`) sözdizimiyle yazıldı.

**Hedef:** Ziyaretçinin siteden gerçek bir randevu alabildiği, saatin anında kesinleştiği, Google Meet bağlantısının otomatik üretildiği ve mail linkiyle iptal/erteleme yapılabildiği rezervasyon sistemi.

**Mimari:** Müsaitliğin tek kaynağı Google Calendar (`freeBusy`), "bu slotu sattık mı" sorusunun tek kaynağı Cloudflare D1. Çakışma uygulama kodunda kilitle değil, veritabanındaki kısmi benzersizlik indeksiyle önlenir. Yazma sırası her zaman **önce D1, sonra Calendar** — tersi, kaydı olmayan takvim etkinliği bırakır.

**Tech Stack:** Next.js 15 Route Handlers · Cloudflare D1 (`wrangler d1`) · Google Calendar REST (`fetch`, SDK yok) · React Email + `src/lib/mail/client.ts` (Veridyen SMTP, ADR-026) · Vitest

**Spec:** `docs/superpowers/specs/2026-08-27-rezervasyon-sistemi-design.md`

## Global Constraints

Bu bölüm her görevin gereklerine örtük olarak dahildir.

- **Zaman:** Veritabanında ve Calendar'da **her şey UTC**. Ziyaretçiye tarayıcı diliminde gösterilir. Onay mailinde saat **hem ziyaretçinin dilimi hem Europe/Istanbul** ile yazılır. (spec §3.3)
- **Slot değerleri koda gömülmez** — tek yapılandırma dosyasında durur: süre 90 dk, tampon 15 dk, pencere 13:00–20:00, açık günler Pzt–Cmt, ilk müsait gün **2026-08-31**, en erken rezervasyon **24 saat**. (spec §3.1b)
- **Vaat 1 saat / blok 90 dakika ayrımı kasıtlıdır.** Site kopyası "1 saatlik keşif görüşmesi" der, takvimde 90 dk kapanır. Kopyayı 90'a çekmek veya bloğu 60'a indirmek **karar değişikliğidir, hata düzeltmesi değil**. (spec §3.1b)
- **KVKK minimizasyonu:** Veritabanına **yalnız** ad + e-posta yazılır. Telefon, şirket, unvan, persona, üç problem **yalnız maile ve Calendar etkinlik açıklamasına** gider. (spec §2.2b)
- **Sırlar repoya girmez** — `wrangler secret`. Sır olmayan çalışma zamanı ayarları `wrangler.jsonc` → `vars`.
- **Google SDK kullanılmaz** — `googleapis` paketi Node'a bağlı ve Worker paketini şişirir. Doğrudan `fetch` ile REST. (spec §8)
- **Turnstile bayrağı:** `lib/security/anti-spam.ts` → `turnstileEnabled()`. Bayrak kapalıyken doğrulama istenmez; spam savunması bal küpü + süre tuzağıdır. (ADR-028)
- **Dil:** Kod ve yorumlar Türkçe açıklamalı, tanımlayıcılar İngilizce. Emoji yok. (CLAUDE.md §3)
- Her görev sonunda `pnpm typecheck` ve `pnpm vitest run` temiz olmalı.

## Dosya Yapısı

| Dosya | Sorumluluk |
|---|---|
| `migrations/0001_bookings.sql` | `bookings` tablosu + kısmi benzersizlik indeksi |
| `src/lib/booking/config.ts` | Slot parametreleri — tek doğruluk kaynağı |
| `src/lib/booking/slots.ts` | Saf slot üretimi ve 24 saat kuralı (I/O yok) |
| `src/lib/booking/repository.ts` | D1 erişimi — tek arayüz, sağlayıcı değişirse yalnız bu dosya değişir |
| `src/lib/booking/google-calendar.ts` | OAuth token yenileme + `freeBusy` / `events.*` REST çağrıları |
| `src/lib/booking/availability.ts` | Calendar meşguliyeti + satılan slotlar → müsait liste |
| `src/app/api/booking/availability/route.ts` | `GET` — dört haftalık müsaitlik |
| `src/app/api/booking/route.ts` | `POST` — rezervasyon oluşturma |
| `src/app/api/booking/[token]/route.ts` | `GET`/`DELETE`/`PATCH` — görüntüle/iptal/ertele |
| `emails/BookingConfirmation.tsx` | Ziyaretçiye onay (Meet + iptal linki + iki dilimde saat) |
| `emails/BookingNotification.tsx` | Burak'a bildirim (persona + problemler + lead alanları) |
| `emails/BookingCancelled.tsx` | İptal bildirimi |
| `src/components/marketing/entry-popup/CalendarPicker.tsx` | Sabit saatleri bırakır, sunucudan müsaitlik alır |
| `src/components/marketing/entry-popup/SuccessState.tsx` | `bookingUrl` + iptal linki gösterimi geri gelir |
| `src/app/(marketing)/[locale]/rezervasyon/[token]/page.tsx` | İptal/erteleme sayfası |

---

## Görev 1: Slot yapılandırması ve saf slot üretimi

Hiçbir I/O olmayan, tamamen deterministik çekirdek. Önce bu, çünkü diğer her şey buna dayanıyor ve testi en ucuz burada.

**Files:**
- Create: `src/lib/booking/config.ts`
- Create: `src/lib/booking/slots.ts`
- Test: `src/lib/booking/__tests__/slots.test.ts`

**Interfaces:**
- Consumes: yok
- Produces:
  - `BOOKING_CONFIG: { slotMinutes: 90; bufferMinutes: 15; windowStart: "13:00"; windowEnd: "20:00"; openDays: number[]; firstAvailableDate: string; minLeadHours: 24; timezone: "Europe/Istanbul"; consultantId: string }`
  - `generateSlotsForDay(dateIso: string): { startUtc: string; endUtc: string }[]`
  - `isSlotBookable(startUtc: string, now: Date): boolean`

- [ ] **Adım 1: Yapılandırma dosyasını yaz**

`src/lib/booking/config.ts`:

```ts
/**
 * Rezervasyon parametreleri — tek doğruluk kaynağı (spec §3.1b).
 *
 * Bu değerler koda gömülmez çünkü değişmeleri kod değişikliği değil değer
 * değişikliği olmalı; çoklu danışmana geçilirse her danışman kendi
 * penceresini taşıyacak.
 */
export const BOOKING_CONFIG = {
  /** Takvimde kapanan blok. Ziyaretçiye verilen vaat 1 saattir — fark kasıtlı. */
  slotMinutes: 90,
  /** Görüşmeler arası tampon: uzayan görüşme sonrakini kaydırmasın. */
  bufferMinutes: 15,
  windowStart: "13:00",
  /** Görüşme bu saatte BİTMİŞ olmalı, başlamış değil. */
  windowEnd: "20:00",
  /** 1=Pazartesi … 6=Cumartesi. Pazar kapalı. */
  openDays: [1, 2, 3, 4, 5, 6],
  /** Tek seferlik başlangıç; bundan önceki günler hiç gösterilmez. */
  firstAvailableDate: "2026-08-31",
  /** Sürekli kural: başlangıcına bu kadar saatten az kalan slot gösterilmez. */
  minLeadHours: 24,
  timezone: "Europe/Istanbul",
  /** Launch'ta tek danışman; alan çoklu danışman için bugünden var. */
  consultantId: "burak",
} as const;
```

- [ ] **Adım 2: Başarısız testi yaz**

`src/lib/booking/__tests__/slots.test.ts`:

```ts
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
    expect(generateSlotsForDay("2026-09-04")).toHaveLength(0); // Cuma ama erken
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
```

- [ ] **Adım 3: Testin başarısız olduğunu doğrula**

Çalıştır: `pnpm vitest run src/lib/booking/__tests__/slots.test.ts`
Beklenen: FAIL — `Cannot find module '../slots'`

- [ ] **Adım 4: Asgari uygulamayı yaz**

`src/lib/booking/slots.ts`:

```ts
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
  if (!c.openDays.includes(isoWeekday(dateIso))) return [];

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
```

- [ ] **Adım 5: Testin geçtiğini doğrula**

Çalıştır: `pnpm vitest run src/lib/booking/__tests__/slots.test.ts`
Beklenen: PASS — 11 test

- [ ] **Adım 6: Commit**

```bash
git add src/lib/booking/config.ts src/lib/booking/slots.ts src/lib/booking/__tests__/slots.test.ts
git commit -m "feat(booking): slot yapılandırması ve saf slot üretimi

Slot üretimi I/O'suz ve deterministik: 90 dk blok + 15 dk tampon,
13:00-20:00 penceresi, Pzt-Cmt. Dördüncü slot 19:45'te bitiyor, beşincisi
pencereyi aşacağı için üretilmiyor.

Yerel saat UTC'ye Intl ile çevriliyor, +3 sabiti koda gömülmüyor: ileride
başka bir dilim eklenirse sabit sessizce yanlış sonuç verirdi.

24 saat kuralı ayrı ve saf bir fonksiyon; hem liste hem rezervasyon anı
aynı kuralı çağıracak."
```

---

## Görev 2: D1 şeması ve depo katmanı

**Files:**
- Create: `migrations/0001_bookings.sql`
- Create: `src/lib/booking/repository.ts`
- Modify: `wrangler.jsonc` (d1_databases binding)
- Test: `src/lib/booking/__tests__/repository.test.ts`

**Interfaces:**
- Consumes: `BOOKING_CONFIG` (Görev 1)
- Produces:
  - `type BookingRow = { id, cancelToken, calendarEventId, meetUrl, consultantId, startsAtUtc, endsAtUtc, visitorTimezone, name, email, locale, status, createdAt, updatedAt }`
  - `createBooking(db: D1Database, input): Promise<{ ok: true; row: BookingRow } | { ok: false; reason: "slot_taken" | "duplicate_email" }>`
  - `findBookingByToken(db, token): Promise<BookingRow | null>`
  - `listSoldSlots(db, fromUtc, toUtc): Promise<string[]>`
  - `attachCalendarResult(db, id, eventId, meetUrl): Promise<void>`
  - `markFailed(db, id): Promise<void>`
  - `cancelBooking(db, token): Promise<"cancelled" | "already_cancelled" | "not_found">`
  - `rescheduleBooking(db, token, startsAtUtc, endsAtUtc): Promise<{ ok: true; row: BookingRow } | { ok: false; reason: "slot_taken" | "not_found" }>`
  - `hasActiveBooking(db, email): Promise<BookingRow | null>`

- [ ] **Adım 1: Göç dosyasını yaz**

`migrations/0001_bookings.sql`:

```sql
-- Rezervasyon tablosu (spec §2.2).
-- KVKK minimizasyonu: yalnız ad ve e-posta saklanır. Telefon, şirket,
-- unvan, persona ve problemler BURAYA YAZILMAZ — yalnız maile ve Calendar
-- etkinlik açıklamasına gider (spec §2.2b).
CREATE TABLE bookings (
  id                TEXT PRIMARY KEY,
  cancel_token      TEXT NOT NULL UNIQUE,
  calendar_event_id TEXT,
  meet_url          TEXT,
  consultant_id     TEXT NOT NULL,
  starts_at_utc     TEXT NOT NULL,
  ends_at_utc       TEXT NOT NULL,
  visitor_timezone  TEXT NOT NULL,
  name              TEXT NOT NULL,
  email             TEXT NOT NULL,
  locale            TEXT NOT NULL,
  status            TEXT NOT NULL CHECK (status IN ('confirmed', 'cancelled', 'failed')),
  created_at        TEXT NOT NULL,
  updated_at        TEXT NOT NULL
);

-- Çakışma kilidi. KISMİ indeks olması şart: iptal edilen bir slot yeniden
-- satılabilmeli, dolayısıyla kısıt yalnız 'confirmed' satırları kapsar.
-- Uygulama kodunda kilit alınmaz; "önce kontrol et sonra yaz" yarışa açıktır.
CREATE UNIQUE INDEX idx_bookings_slot
  ON bookings (consultant_id, starts_at_utc)
  WHERE status = 'confirmed';

-- Aktif randevu kontrolü ve temizlik işi bu sütunlardan tarar.
CREATE INDEX idx_bookings_email_status ON bookings (email, status);
CREATE INDEX idx_bookings_starts_at ON bookings (starts_at_utc);
```

- [ ] **Adım 2: D1 veritabanını oluştur ve bağla**

```bash
export CLOUDFLARE_API_TOKEN="$(grep -m1 '^CLOUDFLARE_API_TOKEN=' .env.local | cut -d= -f2-)"
npx wrangler d1 create indoles-bookings
```

Çıktıdaki `database_id` değerini `wrangler.jsonc`'ye ekle:

```jsonc
  "d1_databases": [
    {
      "binding": "BOOKINGS_DB",
      "database_name": "indoles-bookings",
      "database_id": "<create çıktısındaki id>"
    }
  ],
```

Göçü hem yerelde hem uzakta uygula:

```bash
npx wrangler d1 migrations apply indoles-bookings --local
npx wrangler d1 migrations apply indoles-bookings --remote
```

- [ ] **Adım 3: Başarısız testi yaz**

`src/lib/booking/__tests__/repository.test.ts`:

```ts
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
```

- [ ] **Adım 4: Test bağımlılığını kur ve testin başarısız olduğunu doğrula**

```bash
pnpm add -D better-sqlite3 @types/better-sqlite3
pnpm vitest run src/lib/booking/__tests__/repository.test.ts
```

Beklenen: FAIL — `Cannot find module '../repository'`

- [ ] **Adım 5: Depo katmanını yaz**

`src/lib/booking/repository.ts`:

```ts
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

export async function hasActiveBooking(db: D1Database, email: string): Promise<BookingRow | null> {
  const row = await db
    .prepare("SELECT * FROM bookings WHERE email = ? AND status = 'confirmed' LIMIT 1")
    .bind(email)
    .first();
  return row ? toRow(row as Raw) : null;
}

export async function createBooking(
  db: D1Database,
  input: CreateInput,
): Promise<{ ok: true; row: BookingRow } | { ok: false; reason: "slot_taken" | "duplicate_email" }> {
  const existing = await hasActiveBooking(db, input.email);
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
    // Kısmi benzersizlik indeksi reddetti: slot bu arada satıldı.
    // Yarışı kod değil veritabanı çözüyor — burada yalnız çeviriyoruz.
    if (String(err).includes("UNIQUE")) return { ok: false, reason: "slot_taken" };
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
    await db
      .prepare("UPDATE bookings SET starts_at_utc = ?, ends_at_utc = ?, updated_at = ? WHERE id = ?")
      .bind(startsAtUtc, endsAtUtc, new Date().toISOString(), row.id)
      .run();
  } catch (err) {
    if (String(err).includes("UNIQUE")) return { ok: false, reason: "slot_taken" };
    throw err;
  }
  return { ok: true, row: { ...row, startsAtUtc, endsAtUtc } };
}
```

- [ ] **Adım 6: Testlerin geçtiğini doğrula**

Çalıştır: `pnpm vitest run src/lib/booking/__tests__/repository.test.ts`
Beklenen: PASS — 10 test

- [ ] **Adım 7: Commit**

```bash
git add migrations/ src/lib/booking/repository.ts src/lib/booking/__tests__/repository.test.ts wrangler.jsonc package.json pnpm-lock.yaml
git commit -m "feat(booking): D1 şeması ve depo katmanı

Çakışma kilidi kısmi benzersizlik indeksi: yalnız confirmed satırları
kapsıyor, böylece iptal edilen slot yeniden satılabiliyor. Yarışı uygulama
kodu değil veritabanı çözüyor; repository yalnız UNIQUE hatasını
slot_taken'a çeviriyor.

KVKK minimizasyonu şemaya gömülü: telefon, şirket, unvan, persona ve
problem sütunu YOK. Test bunu regresyon olarak koruyor.

Testler gerçek SQLite üzerinde koşuyor -- mock depo kısıtın veritabanı
seviyesinde çalıştığını kanıtlayamazdı."
```

---

## Görev 3: Google Calendar istemcisi

**Files:**
- Create: `src/lib/booking/google-calendar.ts`
- Test: `src/lib/booking/__tests__/google-calendar.test.ts`

**Interfaces:**
- Consumes: yok
- Produces:
  - `getAccessToken(env): Promise<string>`
  - `fetchBusy(token, calendarIds: string[], fromUtc, toUtc): Promise<{ start: string; end: string }[]>`
  - `createEvent(token, calendarId, input): Promise<{ eventId: string; meetUrl: string | null }>`
  - `deleteEvent(token, calendarId, eventId): Promise<void>`
  - `patchEventTime(token, calendarId, eventId, startUtc, endUtc): Promise<void>`
  - `class CalendarAuthError extends Error` — `invalid_grant` bu tiple fırlatılır

- [ ] **Adım 1: Başarısız testi yaz**

`src/lib/booking/__tests__/google-calendar.test.ts`:

```ts
import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  getAccessToken, fetchBusy, createEvent, patchEventTime, CalendarAuthError,
} from "../google-calendar";

const env = {
  GOOGLE_OAUTH_CLIENT_ID: "cid",
  GOOGLE_OAUTH_CLIENT_SECRET: "csec",
  GOOGLE_OAUTH_REFRESH_TOKEN: "rtok",
} as const;

beforeEach(() => { vi.restoreAllMocks(); });

function mockFetchOnce(body: unknown, ok = true, status = 200) {
  return vi.fn().mockResolvedValue({
    ok, status, json: async () => body, text: async () => JSON.stringify(body),
  });
}

describe("getAccessToken", () => {
  it("refresh token ile access token alır", async () => {
    const f = mockFetchOnce({ access_token: "ya29.test" });
    vi.stubGlobal("fetch", f);
    expect(await getAccessToken(env)).toBe("ya29.test");
    const [url, init] = f.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("oauth2.googleapis.com/token");
    expect(String(init.body)).toContain("grant_type=refresh_token");
  });

  it("invalid_grant CalendarAuthError olarak fırlatılır", async () => {
    // Sessiz bozulmanın tek görünür anı burası; çağıran bu tipe bakarak
    // uyarı maili gönderiyor (spec §8).
    vi.stubGlobal("fetch", mockFetchOnce({ error: "invalid_grant" }, false, 400));
    await expect(getAccessToken(env)).rejects.toBeInstanceOf(CalendarAuthError);
  });
});

describe("fetchBusy", () => {
  it("birden fazla takvimin dolu aralıklarını birleştirir", async () => {
    // Müsaitlik tek takvimden değil kimlik listesinden okunuyor (spec §2.1b).
    vi.stubGlobal("fetch", mockFetchOnce({
      calendars: {
        "digital@indoles.com.tr": { busy: [{ start: "2026-09-07T10:00:00Z", end: "2026-09-07T11:00:00Z" }] },
        "b.a.ozgul@gmail.com": { busy: [{ start: "2026-09-07T13:00:00Z", end: "2026-09-07T14:00:00Z" }] },
      },
    }));
    const busy = await fetchBusy("tok", ["digital@indoles.com.tr", "b.a.ozgul@gmail.com"],
      "2026-09-01T00:00:00Z", "2026-09-30T00:00:00Z");
    expect(busy).toHaveLength(2);
  });

  it("erişilemeyen takvim hatası tüm sorguyu düşürmez", async () => {
    vi.stubGlobal("fetch", mockFetchOnce({
      calendars: {
        "digital@indoles.com.tr": { busy: [{ start: "2026-09-07T10:00:00Z", end: "2026-09-07T11:00:00Z" }] },
        "yok@example.com": { errors: [{ reason: "notFound" }] },
      },
    }));
    const busy = await fetchBusy("tok", ["digital@indoles.com.tr", "yok@example.com"],
      "2026-09-01T00:00:00Z", "2026-09-30T00:00:00Z");
    expect(busy).toHaveLength(1);
  });
});

describe("createEvent", () => {
  it("conferenceDataVersion=1 ile Meet bağlantısı ister", async () => {
    const f = mockFetchOnce({
      id: "evt_1",
      hangoutLink: "https://meet.google.com/abc-defg-hij",
      conferenceData: { conferenceId: "abc" },
    });
    vi.stubGlobal("fetch", f);
    const res = await createEvent("tok", "digital@indoles.com.tr", {
      summary: "INDOLES görüşmesi",
      description: "detay",
      startUtc: "2026-09-07T10:00:00.000Z",
      endUtc: "2026-09-07T11:30:00.000Z",
      attendeeEmail: "ayse@example.com",
    });
    expect(res).toEqual({ eventId: "evt_1", meetUrl: "https://meet.google.com/abc-defg-hij" });
    const [url, init] = f.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("conferenceDataVersion=1");
    expect(String(init.body)).toContain("hangoutsMeet");
  });
});

describe("patchEventTime", () => {
  it("conferenceData'ya DOKUNMAZ — Meet bağlantısı korunur", async () => {
    // conferenceDataVersion gönderilmezse Google mevcut konferansı koruyor.
    const f = mockFetchOnce({ id: "evt_1" });
    vi.stubGlobal("fetch", f);
    await patchEventTime("tok", "cal", "evt_1", "2026-09-08T10:00:00.000Z", "2026-09-08T11:30:00.000Z");
    const [url, init] = f.mock.calls[0] as [string, RequestInit];
    expect(url).not.toContain("conferenceDataVersion");
    const body = JSON.parse(String(init.body)) as Record<string, unknown>;
    expect(Object.keys(body).sort()).toEqual(["end", "start"]);
  });
});
```

- [ ] **Adım 2: Testin başarısız olduğunu doğrula**

Çalıştır: `pnpm vitest run src/lib/booking/__tests__/google-calendar.test.ts`
Beklenen: FAIL — `Cannot find module '../google-calendar'`

- [ ] **Adım 3: İstemciyi yaz**

`src/lib/booking/google-calendar.ts`:

```ts
/**
 * Google Calendar REST istemcisi (spec §8).
 *
 * `googleapis` paketi kullanılmıyor: Node'a bağlı ve Worker paketini
 * şişirir. Yetkilendirme OAuth + kalıcı refresh token; servis hesabı
 * değil (gerekçe spec §8'de).
 */

/** Yetki koptu — çağıran bunu yakalayıp uyarı maili gönderir. */
export class CalendarAuthError extends Error {
  constructor(detail: string) {
    super(`Calendar yetkisi geçersiz: ${detail}`);
    this.name = "CalendarAuthError";
  }
}

type OAuthEnv = {
  GOOGLE_OAUTH_CLIENT_ID: string;
  GOOGLE_OAUTH_CLIENT_SECRET: string;
  GOOGLE_OAUTH_REFRESH_TOKEN: string;
};

export async function getAccessToken(env: OAuthEnv): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.GOOGLE_OAUTH_CLIENT_ID,
      client_secret: env.GOOGLE_OAUTH_CLIENT_SECRET,
      refresh_token: env.GOOGLE_OAUTH_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });
  const data = (await res.json()) as { access_token?: string; error?: string };
  if (!res.ok || !data.access_token) {
    // invalid_grant sessiz bozulmanın tek sinyali; ayrı tiple fırlatıyoruz.
    throw new CalendarAuthError(data.error ?? `HTTP ${res.status}`);
  }
  return data.access_token;
}

export async function fetchBusy(
  token: string, calendarIds: string[], fromUtc: string, toUtc: string,
): Promise<{ start: string; end: string }[]> {
  const res = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({ timeMin: fromUtc, timeMax: toUtc, items: calendarIds.map((id) => ({ id })) }),
  });
  if (!res.ok) throw new Error(`freeBusy başarısız: HTTP ${res.status}`);
  const data = (await res.json()) as {
    calendars?: Record<string, { busy?: { start: string; end: string }[]; errors?: unknown[] }>;
  };
  const out: { start: string; end: string }[] = [];
  for (const entry of Object.values(data.calendars ?? {})) {
    // Erişilemeyen bir takvim (paylaşım kaldırılmış olabilir) tüm sorguyu
    // düşürmemeli; o takvim yok sayılır, diğerleri korunur.
    if (entry.errors) continue;
    out.push(...(entry.busy ?? []));
  }
  return out;
}

export async function createEvent(
  token: string,
  calendarId: string,
  input: { summary: string; description: string; startUtc: string; endUtc: string; attendeeEmail: string },
): Promise<{ eventId: string; meetUrl: string | null }> {
  const url =
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events` +
    `?conferenceDataVersion=1&sendUpdates=all`;
  const res = await fetch(url, {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({
      summary: input.summary,
      description: input.description,
      start: { dateTime: input.startUtc, timeZone: "UTC" },
      end: { dateTime: input.endUtc, timeZone: "UTC" },
      attendees: [{ email: input.attendeeEmail }],
      conferenceData: {
        createRequest: {
          requestId: crypto.randomUUID(),
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    }),
  });
  if (!res.ok) throw new Error(`events.insert başarısız: HTTP ${res.status} ${await res.text()}`);
  const data = (await res.json()) as { id: string; hangoutLink?: string };
  return { eventId: data.id, meetUrl: data.hangoutLink ?? null };
}

export async function deleteEvent(token: string, calendarId: string, eventId: string): Promise<void> {
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${eventId}?sendUpdates=all`,
    { method: "DELETE", headers: { authorization: `Bearer ${token}` } },
  );
  // 410 = zaten silinmiş; iptal idempotent olmalı.
  if (!res.ok && res.status !== 404 && res.status !== 410) {
    throw new Error(`events.delete başarısız: HTTP ${res.status}`);
  }
}

export async function patchEventTime(
  token: string, calendarId: string, eventId: string, startUtc: string, endUtc: string,
): Promise<void> {
  // `conferenceData` gönderilmiyor ve `conferenceDataVersion` YOK: böylece
  // Google mevcut Meet bağlantısını koruyor, yenisini üretmiyor (spec §8).
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${eventId}?sendUpdates=all`,
    {
      method: "PATCH",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({
        start: { dateTime: startUtc, timeZone: "UTC" },
        end: { dateTime: endUtc, timeZone: "UTC" },
      }),
    },
  );
  if (!res.ok) throw new Error(`events.patch başarısız: HTTP ${res.status}`);
}
```

- [ ] **Adım 4: Testlerin geçtiğini doğrula**

Çalıştır: `pnpm vitest run src/lib/booking/__tests__/google-calendar.test.ts`
Beklenen: PASS — 6 test

- [ ] **Adım 5: Commit**

```bash
git add src/lib/booking/google-calendar.ts src/lib/booking/__tests__/google-calendar.test.ts
git commit -m "feat(booking): Google Calendar REST istemcisi

SDK yok, doğrudan fetch: googleapis paketi Node'a bağlı ve Worker
paketini şişirirdi.

Üç davranış teste bağlandı çünkü üçü de sessizce yanlış çalışabilir.
invalid_grant ayrı bir hata tipiyle fırlatılıyor -- yetkinin kopması
sistemin sessizce durduğu tek yol, çağıran bu tipe bakıp uyarı
gönderecek. freeBusy erişilemeyen bir takvimi yok sayıp diğerlerini
koruyor. events.patch conferenceDataVersion GÖNDERMİYOR, böylece erteleme
mevcut Meet bağlantısını koruyor."
```

---

## Görev 4: Müsaitlik hesabı ve GET uç noktası

**Files:**
- Create: `src/lib/booking/availability.ts`
- Create: `src/app/api/booking/availability/route.ts`
- Test: `src/lib/booking/__tests__/availability.test.ts`

**Interfaces:**
- Consumes: `generateSlotsForDay`, `isSlotBookable` (Görev 1), `listSoldSlots` (Görev 2), `fetchBusy` (Görev 3)
- Produces: `computeAvailability(args): { date: string; slots: { startUtc: string; endUtc: string }[] }[]`

- [ ] **Adım 1: Başarısız testi yaz**

`src/lib/booking/__tests__/availability.test.ts`:

```ts
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
```

- [ ] **Adım 2: Testin başarısız olduğunu doğrula**

Çalıştır: `pnpm vitest run src/lib/booking/__tests__/availability.test.ts`
Beklenen: FAIL — `Cannot find module '../availability'`

- [ ] **Adım 3: Hesabı yaz**

`src/lib/booking/availability.ts`:

```ts
import { generateSlotsForDay, isSlotBookable } from "./slots";

type Interval = { start: string; end: string };

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
```

- [ ] **Adım 4: Testlerin geçtiğini doğrula**

Çalıştır: `pnpm vitest run src/lib/booking/__tests__/availability.test.ts`
Beklenen: PASS — 6 test

- [ ] **Adım 5: GET uç noktasını yaz**

`src/app/api/booking/availability/route.ts`:

```ts
import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { BOOKING_CONFIG } from "@/lib/booking/config";
import { computeAvailability } from "@/lib/booking/availability";
import { listSoldSlots } from "@/lib/booking/repository";
import { fetchBusy, getAccessToken, CalendarAuthError } from "@/lib/booking/google-calendar";
import { reportError } from "@/lib/observability/report";

export const runtime = "nodejs";

/** Takvim önümüzdeki dört haftayı gösteriyor. */
const WINDOW_DAYS = 28;

export async function GET(): Promise<Response> {
  const { env } = getCloudflareContext();
  const now = new Date();
  const fromDate = now.toISOString().slice(0, 10);
  const toUtc = new Date(now.getTime() + WINDOW_DAYS * 86_400_000).toISOString();

  // Müsaitlik birden fazla takvimden okunuyor (spec §2.1b): iş takvimi ve
  // "yalnız müsaitlik" düzeyinde paylaşılan kişisel takvim.
  const calendarIds = (env.BOOKING_CALENDAR_IDS as string)
    .split(",").map((s) => s.trim()).filter(Boolean);

  try {
    const token = await getAccessToken(env as never);
    const [busy, soldSlots] = await Promise.all([
      fetchBusy(token, calendarIds, now.toISOString(), toUtc),
      listSoldSlots(env.BOOKINGS_DB as D1Database, now.toISOString(), toUtc),
    ]);
    const days = computeAvailability({ fromDate, days: WINDOW_DAYS, now, busy, soldSlots });
    return NextResponse.json({ ok: true, days });
  } catch (err) {
    reportError(err, { route: "booking/availability", step: "compute" });
    // Yetki koptuysa boş liste dönüyoruz; arayüz "şu an uygun saat
    // görünmüyor, bize yazın" diyerek iletişim formuna düşüyor (spec §4).
    // Sessiz boş kutu gösterilmiyor: `unavailable` bayrağı bunu ayırt ediyor.
    return NextResponse.json(
      { ok: false, unavailable: true, authExpired: err instanceof CalendarAuthError, days: [] },
      { status: 200 },
    );
  }
}
```

- [ ] **Adım 6: `wrangler.jsonc`'ye takvim kimliklerini ekle**

`vars` bloğuna:

```jsonc
    "BOOKING_CALENDAR_IDS": "digital@indoles.com.tr,b.a.ozgul@gmail.com",
```

- [ ] **Adım 7: Sırları Cloudflare'e taşı**

```bash
export CLOUDFLARE_API_TOKEN="$(grep -m1 '^CLOUDFLARE_API_TOKEN=' .env.local | cut -d= -f2-)"
for K in GOOGLE_OAUTH_CLIENT_ID GOOGLE_OAUTH_CLIENT_SECRET GOOGLE_OAUTH_REFRESH_TOKEN; do
  printf '%s' "$(grep -m1 "^$K=" .env.local | cut -d= -f2-)" | npx wrangler secret put "$K"
done
npx wrangler secret list
```

- [ ] **Adım 8: Commit**

```bash
git add src/lib/booking/availability.ts src/lib/booking/__tests__/availability.test.ts src/app/api/booking/availability/route.ts wrangler.jsonc
git commit -m "feat(booking): müsaitlik hesabı ve GET uç noktası

Hesap saf: Calendar meşguliyeti ve satılan slotlar dışarıdan veriliyor,
böylece tam kapsam I/O taklidi olmadan test ediliyor.

Kısmi çakışma da slotu düşürüyor -- 15 dakikalık bir toplantı 90 dakikalık
slotun ortasına düşse bile o slot satılamaz.

Yetki koptuğunda uç nokta 200 ve unavailable bayrağı dönüyor. Boş dizi tek
başına yeterli değil: arayüzün 'uygun saat yok' ile 'sistem bozuk' halini
ayırt edip iletişim formuna düşebilmesi gerekiyor."
```

---

## Görev 5: Rezervasyon POST uç noktası

Spec §3.2'deki sıra burada uygulanıyor: **önce D1, sonra Calendar.**

**Files:**
- Create: `src/lib/schemas/booking.ts`
- Create: `src/app/api/booking/route.ts`
- Test: `src/app/api/booking/__tests__/route.test.ts`

**Interfaces:**
- Consumes: hepsi (Görev 1–4) + `sendMailWithRetry`, `recipients` (`@/lib/mail/client`)
- Produces: `POST /api/booking` → `{ ok: true; cancelToken; meetUrl }` veya `{ ok: false; reason }`

- [ ] **Adım 1: Şemayı yaz**

`src/lib/schemas/booking.ts`:

```ts
import { z } from "zod";

export const bookingSchema = z.object({
  startsAtUtc: z.string().datetime(),
  visitorTimezone: z.string().min(1),
  locale: z.enum(["tr", "en"]),
  lead: z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    phone: z.string().regex(/^\+?[0-9\s-]{7,}$/),
    email: z.string().email(),
    company: z.string().min(2),
    title: z.string().min(2),
  }),
  persona: z.enum(["donusum-teknoloji", "buyume-pazarlar"]),
  problems: z.array(z.string().min(1)).length(3),
  kvkkConsent: z.literal(true),
  /** ADR-028: Turnstile bayrağa bağlı, doğrulama rotada koşullu. */
  turnstileToken: z.string().optional(),
  /** Bal küpü — dolu gelirse sahte başarı döner. */
  website: z.string().optional(),
  elapsedMs: z.number().int().nonnegative().optional(),
});

export type BookingPayload = z.infer<typeof bookingSchema>;
```

- [ ] **Adım 2: Başarısız testi yaz**

`src/app/api/booking/__tests__/route.test.ts`:

```ts
import { describe, expect, it, vi, beforeEach } from "vitest";

const createBooking = vi.fn();
const attachCalendarResult = vi.fn();
const markFailed = vi.fn();
vi.mock("@/lib/booking/repository", () => ({
  createBooking, attachCalendarResult, markFailed,
  hasActiveBooking: vi.fn().mockResolvedValue(null),
}));

const createEvent = vi.fn();
vi.mock("@/lib/booking/google-calendar", async (orig) => ({
  ...(await orig<typeof import("@/lib/booking/google-calendar")>()),
  getAccessToken: vi.fn().mockResolvedValue("tok"),
  createEvent,
}));

const sendMailWithRetry = vi.fn();
vi.mock("@/lib/mail/client", async (orig) => ({
  sendMailWithRetry,
  recipients: (await orig<typeof import("@/lib/mail/client")>()).recipients,
}));

vi.mock("@opennextjs/cloudflare", () => ({
  getCloudflareContext: () => ({ env: { BOOKINGS_DB: {}, BOOKING_CALENDAR_IDS: "cal@x.com" } }),
}));

import { POST } from "../route";

const validBody = {
  startsAtUtc: "2026-09-07T10:00:00.000Z",
  visitorTimezone: "Europe/Istanbul",
  locale: "tr",
  lead: {
    firstName: "Ayşe", lastName: "Yılmaz", phone: "+905550001122",
    email: "ayse@example.com", company: "Acme", title: "CTO",
  },
  persona: "donusum-teknoloji",
  problems: ["a", "b", "c"],
  kvkkConsent: true,
  website: "",
  elapsedMs: 9000,
};

function req(body: unknown): Request {
  return new Request("http://localhost/api/booking", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

const row = {
  id: "b1", cancelToken: "tok123", startsAtUtc: validBody.startsAtUtc,
  endsAtUtc: "2026-09-07T11:30:00.000Z", email: validBody.lead.email,
  name: "Ayşe Yılmaz", locale: "tr", status: "confirmed",
};

describe("POST /api/booking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.setSystemTime(new Date("2026-09-01T09:00:00.000Z"));
    createBooking.mockResolvedValue({ ok: true, row });
    createEvent.mockResolvedValue({ eventId: "evt_1", meetUrl: "https://meet.google.com/x" });
    sendMailWithRetry.mockResolvedValue(undefined);
  });

  it("mutlu yol: D1 yazılır, Calendar açılır, iki mail gider", async () => {
    const res = await POST(req(validBody));
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ok: true, meetUrl: "https://meet.google.com/x" });
    expect(createBooking).toHaveBeenCalledTimes(1);
    expect(createEvent).toHaveBeenCalledTimes(1);
    expect(sendMailWithRetry).toHaveBeenCalledTimes(2);
  });

  it("D1 Calendar'DAN ÖNCE yazılır", async () => {
    // Ters sıra, kaydı olmayan takvim etkinliği bırakırdı (spec §3.2).
    const order: string[] = [];
    createBooking.mockImplementation(async () => { order.push("db"); return { ok: true, row }; });
    createEvent.mockImplementation(async () => { order.push("calendar"); return { eventId: "e", meetUrl: null }; });
    await POST(req(validBody));
    expect(order).toEqual(["db", "calendar"]);
  });

  it("slot az önce dolduysa 409 ve sebep döner", async () => {
    createBooking.mockResolvedValue({ ok: false, reason: "slot_taken" });
    const res = await POST(req(validBody));
    expect(res.status).toBe(409);
    expect(await res.json()).toMatchObject({ reason: "slot_taken" });
    expect(createEvent).not.toHaveBeenCalled();
  });

  it("Calendar düşerse satır failed işaretlenir AMA bildirim maili yine gider", async () => {
    // Lead kaybolmamalı: manuel dönülebilsin (spec §4).
    createEvent.mockRejectedValue(new Error("calendar down"));
    const res = await POST(req(validBody));
    expect(markFailed).toHaveBeenCalledWith(expect.anything(), "b1");
    expect(sendMailWithRetry).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ok: true, degraded: true });
  });

  it("24 saatten yakın slot sunucuda reddedilir", async () => {
    // İstemci zaten göstermiyor ama tek koruma istemci olamaz (spec §3.1b).
    vi.setSystemTime(new Date("2026-09-07T00:00:00.000Z"));
    const res = await POST(req(validBody));
    expect(res.status).toBe(422);
    expect(createBooking).not.toHaveBeenCalled();
  });

  it("geçmiş slot reddedilir", async () => {
    vi.setSystemTime(new Date("2026-09-08T00:00:00.000Z"));
    const res = await POST(req(validBody));
    expect(res.status).toBe(422);
  });

  it("bal küpü doluysa sahte başarı döner ve hiçbir şey yazılmaz", async () => {
    const res = await POST(req({ ...validBody, website: "http://spam" }));
    expect(res.status).toBe(200);
    expect(createBooking).not.toHaveBeenCalled();
    expect(sendMailWithRetry).not.toHaveBeenCalled();
  });

  it("KVKK: D1'e yalnız ad ve e-posta gider", async () => {
    await POST(req(validBody));
    const arg = createBooking.mock.calls[0]![1] as Record<string, unknown>;
    expect(Object.keys(arg).sort()).toEqual(
      ["consultantId", "email", "endsAtUtc", "locale", "name", "startsAtUtc", "visitorTimezone"],
    );
  });
});
```

- [ ] **Adım 3: Testin başarısız olduğunu doğrula**

Çalıştır: `pnpm vitest run src/app/api/booking/__tests__/route.test.ts`
Beklenen: FAIL — `Cannot find module '../route'`

- [ ] **Adım 4: Rotayı yaz**

`src/app/api/booking/route.ts`:

```ts
import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { bookingSchema } from "@/lib/schemas/booking";
import { BOOKING_CONFIG } from "@/lib/booking/config";
import { isSlotBookable } from "@/lib/booking/slots";
import { createBooking, attachCalendarResult, markFailed } from "@/lib/booking/repository";
import { createEvent, getAccessToken } from "@/lib/booking/google-calendar";
import { sendMailWithRetry, recipients } from "@/lib/mail/client";
import { spamSignal, turnstileEnabled } from "@/lib/security/anti-spam";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { reportError } from "@/lib/observability/report";
import BookingConfirmation from "../../../../emails/BookingConfirmation";
import BookingNotification from "../../../../emails/BookingNotification";

export const runtime = "nodejs";

export async function POST(req: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "invalid_json" }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, reason: "validation" }, { status: 400 });
  }
  const data = parsed.data;

  // Sahte başarı bilinçli: açık hata bota neyin yakalandığını öğretir (ADR-028).
  if (spamSignal(data)) return NextResponse.json({ ok: true });

  if (turnstileEnabled()) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "0.0.0.0";
    const ok = data.turnstileToken ? await verifyTurnstile(data.turnstileToken, ip) : false;
    if (!ok) return NextResponse.json({ ok: false, reason: "turnstile_failed" }, { status: 403 });
  }

  // İstemci 24 saat kuralını zaten uyguluyor ama tek koruma istemci olamaz.
  const now = new Date();
  if (!isSlotBookable(data.startsAtUtc, now)) {
    return NextResponse.json({ ok: false, reason: "slot_unavailable" }, { status: 422 });
  }

  const { env } = getCloudflareContext();
  const db = env.BOOKINGS_DB as D1Database;
  const endsAtUtc = new Date(
    Date.parse(data.startsAtUtc) + BOOKING_CONFIG.slotMinutes * 60_000,
  ).toISOString();
  const name = `${data.lead.firstName} ${data.lead.lastName}`;

  // 1) ÖNCE veritabanı. Tersi olsaydı Calendar'a etkinlik düşüp yazma
  //    başarısız olabilir ve kaydı olmayan bir toplantı kalırdı (spec §3.2).
  //    KVKK: yalnız ad ve e-posta yazılıyor.
  const created = await createBooking(db, {
    consultantId: BOOKING_CONFIG.consultantId,
    startsAtUtc: data.startsAtUtc,
    endsAtUtc,
    visitorTimezone: data.visitorTimezone,
    name,
    email: data.lead.email,
    locale: data.locale,
  });
  if (!created.ok) {
    return NextResponse.json({ ok: false, reason: created.reason }, { status: 409 });
  }
  const row = created.row;

  // 2) Calendar + Meet. Buradaki başarısızlık randevuyu iptal etmez:
  //    satır failed işaretlenir, bildirim maili YİNE gider, lead kaybolmaz.
  let meetUrl: string | null = null;
  let degraded = false;
  try {
    const token = await getAccessToken(env as never);
    const calendarId = (env.BOOKING_CALENDAR_IDS as string).split(",")[0]!.trim();
    const res = await createEvent(token, calendarId, {
      summary: `INDOLES görüşmesi — ${name}`,
      // Lead bağlamı burada duruyor, veritabanında değil (spec §2.2b).
      description: [
        `Ad: ${name}`,
        `E-posta: ${data.lead.email}`,
        `Telefon: ${data.lead.phone}`,
        `Şirket: ${data.lead.company}`,
        `Unvan: ${data.lead.title}`,
        `Persona: ${data.persona}`,
        `Problemler: ${data.problems.join(" · ")}`,
      ].join("\n"),
      startUtc: row.startsAtUtc,
      endUtc: row.endsAtUtc,
      attendeeEmail: data.lead.email,
    });
    meetUrl = res.meetUrl;
    await attachCalendarResult(db, row.id, res.eventId, res.meetUrl);
  } catch (err) {
    reportError(err, { route: "booking", step: "calendar" });
    await markFailed(db, row.id);
    degraded = true;
  }

  // 3) Mailler. Bildirim lead'in kendisidir; onay ikincildir.
  const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${data.locale}/rezervasyon/${row.cancelToken}`;
  try {
    await sendMailWithRetry({
      to: recipients(process.env.SALES_INBOX_EMAIL, "digital@indoles.com.tr"),
      subject: `Yeni randevu — ${name} — ${row.startsAtUtc}`,
      react: BookingNotification({
        name, lead: data.lead, persona: data.persona, problems: data.problems,
        startsAtUtc: row.startsAtUtc, meetUrl, degraded,
      }),
    });
  } catch (err) {
    reportError(err, { route: "booking", step: "notification" });
  }

  try {
    await sendMailWithRetry({
      to: data.lead.email,
      subject: data.locale === "tr" ? "Randevun onaylandı — INDOLES" : "Your booking is confirmed — INDOLES",
      react: BookingConfirmation({
        firstName: data.lead.firstName, locale: data.locale,
        startsAtUtc: row.startsAtUtc, visitorTimezone: data.visitorTimezone,
        meetUrl, cancelUrl,
      }),
    });
  } catch (err) {
    // Randevu geçerli kalır, silinmez (spec §4).
    reportError(err, { route: "booking", step: "confirmation" });
  }

  return NextResponse.json({ ok: true, cancelToken: row.cancelToken, meetUrl, degraded });
}
```

- [ ] **Adım 5: Testlerin geçtiğini doğrula**

Çalıştır: `pnpm vitest run src/app/api/booking/__tests__/route.test.ts`
Beklenen: PASS — 8 test

- [ ] **Adım 6: Commit**

```bash
git add src/lib/schemas/booking.ts src/app/api/booking/route.ts src/app/api/booking/__tests__/route.test.ts
git commit -m "feat(booking): rezervasyon POST uç noktası

Yazma sırası teste bağlandı: önce D1, sonra Calendar. Tersi, veritabanında
kaydı olmayan bir takvim etkinliği bırakırdı.

Calendar düşerse randevu iptal edilmiyor -- satır failed işaretleniyor ve
bildirim maili yine gidiyor, çünkü lead'in kaybolması takvim kaydının
eksikliğinden pahalı.

24 saat kuralı sunucuda tekrar uygulanıyor. İstemci zaten göstermiyor ama
tek koruma istemci olamaz."
```

---

## Görev 6: Mail şablonları

**Files:**
- Create: `emails/BookingConfirmation.tsx`
- Create: `emails/BookingNotification.tsx`
- Create: `emails/BookingCancelled.tsx`
- Create: `emails/CalendarAuthAlert.tsx`
- Test: `emails/__tests__/booking-emails.test.tsx`

**Interfaces:**
- Consumes: yok
- Produces: DÖRT React Email bileşeni; props imzaları Görev 5, 7 ve 9'da kullanılıyor.
  `CalendarAuthAlert` planın ilk halinde yoktu — Görev 9'un `react: null as never`
  yer tutucusu `sendMailWithRetry`'nin `render(input.react)` çağrısında patlardı
  (ön-tarama ÇELİŞKİ-3). Şablon buraya alındı, Görev 9 onu tüketiyor.

- [ ] **Adım 1: Başarısız testi yaz**

`emails/__tests__/booking-emails.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render } from "@react-email/render";
import BookingConfirmation from "../BookingConfirmation";
import BookingNotification from "../BookingNotification";

describe("BookingConfirmation", () => {
  const props = {
    firstName: "Ayşe",
    locale: "tr" as const,
    startsAtUtc: "2026-09-07T10:00:00.000Z",
    visitorTimezone: "Europe/Berlin",
    meetUrl: "https://meet.google.com/abc",
    cancelUrl: "https://www.indoles.com.tr/tr/rezervasyon/tok123",
  };

  it("saati HEM ziyaretçinin dilimiyle HEM İstanbul saatiyle yazar", async () => {
    // Yurt dışı görüşmede "10:00" kimin saati tartışması çıkmasın (spec §3.3).
    const html = await render(BookingConfirmation(props));
    expect(html).toContain("12:00"); // Berlin (UTC+2)
    expect(html).toContain("13:00"); // İstanbul (UTC+3)
    expect(html).toContain("Europe/Berlin");
    expect(html).toContain("İstanbul");
  });

  it("Meet bağlantısını ve iptal linkini içerir", async () => {
    const html = await render(BookingConfirmation(props));
    expect(html).toContain("https://meet.google.com/abc");
    expect(html).toContain("https://www.indoles.com.tr/tr/rezervasyon/tok123");
  });

  it("Meet üretilememişse dürüst mesaj verir, boş bağlantı basmaz", async () => {
    const html = await render(BookingConfirmation({ ...props, meetUrl: null }));
    expect(html).not.toContain("meet.google.com");
    expect(html).toMatch(/bağlantıyı ayrıca/i);
  });

  it("EN sürümü İngilizce basar", async () => {
    const html = await render(BookingConfirmation({ ...props, locale: "en" }));
    expect(html).toMatch(/your booking/i);
  });
});

describe("BookingNotification", () => {
  const props = {
    name: "Ayşe Yılmaz",
    lead: {
      firstName: "Ayşe", lastName: "Yılmaz", phone: "+905550001122",
      email: "ayse@example.com", company: "Acme", title: "CTO",
    },
    persona: "donusum-teknoloji",
    problems: ["p1", "p2", "p3"],
    startsAtUtc: "2026-09-07T10:00:00.000Z",
    meetUrl: "https://meet.google.com/abc",
    degraded: false,
  };

  it("lead bağlamının tamamını taşır — veritabanında tutulmayan alanlar dahil", async () => {
    const html = await render(BookingNotification(props));
    for (const v of ["+905550001122", "Acme", "CTO", "donusum-teknoloji", "p1", "p2", "p3"]) {
      expect(html).toContain(v);
    }
  });

  it("Calendar düştüyse uyarı basar", async () => {
    const html = await render(BookingNotification({ ...props, degraded: true, meetUrl: null }));
    expect(html).toMatch(/takvime YAZILAMADI|elle/i);
  });
});
```

- [ ] **Adım 2: Testin başarısız olduğunu doğrula**

Çalıştır: `pnpm vitest run emails/__tests__/booking-emails.test.tsx`
Beklenen: FAIL — `Cannot find module '../BookingConfirmation'`

- [ ] **Adım 3: Şablonları yaz**

`emails/BookingConfirmation.tsx`:

```tsx
import * as React from "react";
import { Html, Head, Body, Container, Heading, Text, Link, Hr } from "@react-email/components";

type Props = {
  firstName: string;
  locale: "tr" | "en";
  startsAtUtc: string;
  visitorTimezone: string;
  meetUrl: string | null;
  cancelUrl: string;
};

/** Saati verilen dilimde okunur biçime çevirir. */
function fmt(iso: string, timeZone: string, locale: "tr" | "en"): string {
  return new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-GB", {
    timeZone, dateStyle: "full", timeStyle: "short",
  }).format(new Date(iso));
}

export default function BookingConfirmation({
  firstName, locale, startsAtUtc, visitorTimezone, meetUrl, cancelUrl,
}: Props) {
  const tr = locale === "tr";
  const visitor = fmt(startsAtUtc, visitorTimezone, locale);
  const istanbul = fmt(startsAtUtc, "Europe/Istanbul", locale);
  // İki dilim birden yazılıyor: yurt dışı görüşmede "10:00" ifadesinin
  // kimin saati olduğu tartışılmasın (spec §3.3).
  const sameZone = visitorTimezone === "Europe/Istanbul";

  return (
    <Html lang={locale}>
      <Head />
      <Body style={{ fontFamily: "system-ui, sans-serif", background: "#FAFAF8" }}>
        <Container style={{ padding: "32px", maxWidth: "560px" }}>
          <Heading style={{ fontSize: "20px" }}>
            {tr ? `${firstName}, randevun onaylandı.` : `${firstName}, your booking is confirmed.`}
          </Heading>

          <Text><strong>{visitor}</strong> ({visitorTimezone})</Text>
          {!sameZone && (
            <Text style={{ color: "#555" }}>
              {tr ? "İstanbul saatiyle: " : "Istanbul time: "}{istanbul}
            </Text>
          )}

          <Hr />

          {meetUrl ? (
            <Text>
              {tr ? "Görüşme bağlantısı: " : "Meeting link: "}
              <Link href={meetUrl}>{meetUrl}</Link>
            </Text>
          ) : (
            <Text>
              {tr
                ? "Görüşme bağlantısını ayrıca ileteceğiz."
                : "We will send the meeting link separately."}
            </Text>
          )}

          <Text style={{ fontSize: "13px", color: "#666" }}>
            {tr ? "Saati değiştirmen veya iptal etmen gerekirse: " : "To reschedule or cancel: "}
            <Link href={cancelUrl}>{cancelUrl}</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
```

`emails/BookingNotification.tsx`:

```tsx
import * as React from "react";
import { Html, Head, Body, Container, Heading, Text, Link, Hr } from "@react-email/components";

type Props = {
  name: string;
  lead: { firstName: string; lastName: string; phone: string; email: string; company: string; title: string };
  persona: string;
  problems: string[];
  startsAtUtc: string;
  meetUrl: string | null;
  degraded: boolean;
};

export default function BookingNotification({
  name, lead, persona, problems, startsAtUtc, meetUrl, degraded,
}: Props) {
  const istanbul = new Intl.DateTimeFormat("tr-TR", {
    timeZone: "Europe/Istanbul", dateStyle: "full", timeStyle: "short",
  }).format(new Date(startsAtUtc));

  return (
    <Html lang="tr">
      <Head />
      <Body style={{ fontFamily: "system-ui, sans-serif" }}>
        <Container style={{ padding: "32px", maxWidth: "560px" }}>
          <Heading style={{ fontSize: "20px" }}>Yeni randevu — {name}</Heading>
          <Text><strong>{istanbul}</strong></Text>

          {degraded && (
            // Bu satır olmadan takvimde görünmeyen bir randevu sessizce kaçar.
            <Text style={{ color: "#7D3230", fontWeight: 600 }}>
              DİKKAT: Takvime YAZILAMADI. Etkinliği elle oluşturman gerekiyor.
            </Text>
          )}

          <Hr />
          {/* Lead bağlamı yalnız burada ve Calendar açıklamasında; veritabanında değil. */}
          <Text>E-posta: {lead.email}</Text>
          <Text>Telefon: {lead.phone}</Text>
          <Text>Şirket: {lead.company}</Text>
          <Text>Unvan: {lead.title}</Text>
          <Text>Persona: {persona}</Text>
          <Text>Problemler: {problems.join(" · ")}</Text>

          {meetUrl && (
            <Text>Meet: <Link href={meetUrl}>{meetUrl}</Link></Text>
          )}
        </Container>
      </Body>
    </Html>
  );
}
```

`emails/BookingCancelled.tsx`:

```tsx
import * as React from "react";
import { Html, Head, Body, Container, Heading, Text } from "@react-email/components";

type Props = { name: string; startsAtUtc: string };

export default function BookingCancelled({ name, startsAtUtc }: Props) {
  const istanbul = new Intl.DateTimeFormat("tr-TR", {
    timeZone: "Europe/Istanbul", dateStyle: "full", timeStyle: "short",
  }).format(new Date(startsAtUtc));

  return (
    <Html lang="tr">
      <Head />
      <Body style={{ fontFamily: "system-ui, sans-serif" }}>
        <Container style={{ padding: "32px", maxWidth: "560px" }}>
          <Heading style={{ fontSize: "20px" }}>Randevu iptal edildi</Heading>
          <Text>{name} — {istanbul}</Text>
          <Text style={{ color: "#555" }}>Slot yeniden satışa açıldı.</Text>
        </Container>
      </Body>
    </Html>
  );
}
```

- [ ] **Adım 4: Testlerin geçtiğini doğrula**

Çalıştır: `pnpm vitest run emails/__tests__/booking-emails.test.tsx`
Beklenen: PASS — 6 test

- [ ] **Adım 5: Commit**

```bash
git add emails/BookingConfirmation.tsx emails/BookingNotification.tsx emails/BookingCancelled.tsx emails/__tests__/booking-emails.test.tsx
git commit -m "feat(booking): onay, bildirim ve iptal mail şablonları

Onay maili saati iki dilimde yazıyor -- ziyaretçinin kendi dilimi ve
İstanbul. Yurt dışı bir görüşmede '10:00' ifadesinin kimin saati olduğu
tartışılmasın diye; test bunu koruyor.

Meet üretilememişse boş bağlantı basılmıyor, dürüst bir cümle yazılıyor.

Bildirim maili lead bağlamının tamamını taşıyor: telefon, şirket, unvan,
persona ve problemler veritabanında tutulmuyor (KVKK minimizasyonu), tek
yaşadıkları yer bu mail ve Calendar açıklaması. Calendar düştüyse mailin
başında elle oluşturma uyarısı çıkıyor."
```

---

## Görev 7: İptal ve erteleme

**Files:**
- Create: `src/app/api/booking/[token]/route.ts`
- Test: `src/app/api/booking/__tests__/token-route.test.ts`

> `rezervasyon/[token]/page.tsx` ve `ManageBooking` bu görevden ÇIKARILDI, Görev 8'e
> taşındı (ön-tarama ÇELİŞKİ-2): sayfa, Görev 8'in ürettiği bileşeni import ediyor ve
> erteleme akışı yine Görev 8'in sunucu tabanlı `CalendarPicker`'ına dayanıyor. Görev 7
> yalnız API uçlarını teslim ediyor.

**Interfaces:**
- Consumes: `findBookingByToken`, `cancelBooking`, `rescheduleBooking` (Görev 2), `deleteEvent`, `patchEventTime` (Görev 3), `BookingCancelled` (Görev 6)
- Produces: `GET /api/booking/:token`, `DELETE /api/booking/:token`, `PATCH /api/booking/:token`

- [ ] **Adım 1: Başarısız testi yaz**

`src/app/api/booking/__tests__/token-route.test.ts`:

```ts
import { describe, expect, it, vi, beforeEach } from "vitest";

const findBookingByToken = vi.fn();
const cancelBooking = vi.fn();
const rescheduleBooking = vi.fn();
vi.mock("@/lib/booking/repository", () => ({ findBookingByToken, cancelBooking, rescheduleBooking }));

const deleteEvent = vi.fn();
const patchEventTime = vi.fn();
vi.mock("@/lib/booking/google-calendar", async (orig) => ({
  ...(await orig<typeof import("@/lib/booking/google-calendar")>()),
  getAccessToken: vi.fn().mockResolvedValue("tok"),
  deleteEvent, patchEventTime,
}));

const sendMailWithRetry = vi.fn();
vi.mock("@/lib/mail/client", async (orig) => ({
  sendMailWithRetry,
  recipients: (await orig<typeof import("@/lib/mail/client")>()).recipients,
}));

vi.mock("@opennextjs/cloudflare", () => ({
  getCloudflareContext: () => ({ env: { BOOKINGS_DB: {}, BOOKING_CALENDAR_IDS: "cal@x.com" } }),
}));

import { GET, DELETE, PATCH } from "../[token]/route";

const row = {
  id: "b1", cancelToken: "tok123", calendarEventId: "evt_1",
  startsAtUtc: "2026-09-07T10:00:00.000Z", endsAtUtc: "2026-09-07T11:30:00.000Z",
  name: "Ayşe Yılmaz", email: "ayse@example.com", locale: "tr", status: "confirmed",
  meetUrl: "https://meet.google.com/x",
};
const ctx = { params: Promise.resolve({ token: "tok123" }) };
const req = (body?: unknown) =>
  new Request("http://localhost/api/booking/tok123", {
    method: "POST", headers: { "content-type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

describe("token rotası", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.setSystemTime(new Date("2026-09-01T09:00:00.000Z"));
    findBookingByToken.mockResolvedValue(row);
  });

  it("GET randevuyu döndürür", async () => {
    const res = await GET(req(), ctx);
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ok: true, booking: { startsAtUtc: row.startsAtUtc } });
  });

  it("GET bilinmeyen token için 404", async () => {
    findBookingByToken.mockResolvedValue(null);
    expect((await GET(req(), ctx)).status).toBe(404);
  });

  it("DELETE iptal eder, Calendar etkinliğini siler, bildirim gönderir", async () => {
    cancelBooking.mockResolvedValue("cancelled");
    const res = await DELETE(req(), ctx);
    expect(res.status).toBe(200);
    expect(deleteEvent).toHaveBeenCalledWith("tok", "cal@x.com", "evt_1");
    expect(sendMailWithRetry).toHaveBeenCalled();
  });

  it("DELETE ikinci kez çağrılınca hata DEĞİL, aynı sonucu döner", async () => {
    // İdempotent: iptal linki iki kez tıklanabilir (spec §4).
    cancelBooking.mockResolvedValue("already_cancelled");
    const res = await DELETE(req(), ctx);
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ok: true, alreadyCancelled: true });
  });

  it("PATCH yeni saate taşır ve Meet bağlantısını korur", async () => {
    rescheduleBooking.mockResolvedValue({
      ok: true, row: { ...row, startsAtUtc: "2026-09-08T10:00:00.000Z", endsAtUtc: "2026-09-08T11:30:00.000Z" },
    });
    const res = await PATCH(req({ startsAtUtc: "2026-09-08T10:00:00.000Z" }), ctx);
    expect(res.status).toBe(200);
    expect(patchEventTime).toHaveBeenCalledWith(
      "tok", "cal@x.com", "evt_1", "2026-09-08T10:00:00.000Z", "2026-09-08T11:30:00.000Z",
    );
  });

  it("PATCH dolu slota taşımayı 409 ile reddeder", async () => {
    rescheduleBooking.mockResolvedValue({ ok: false, reason: "slot_taken" });
    expect((await PATCH(req({ startsAtUtc: "2026-09-08T10:00:00.000Z" }), ctx)).status).toBe(409);
  });

  it("PATCH 24 saat kuralını sunucuda uygular", async () => {
    vi.setSystemTime(new Date("2026-09-08T00:00:00.000Z"));
    expect((await PATCH(req({ startsAtUtc: "2026-09-08T10:00:00.000Z" }), ctx)).status).toBe(422);
  });
});
```

- [ ] **Adım 2: Testin başarısız olduğunu doğrula**

Çalıştır: `pnpm vitest run src/app/api/booking/__tests__/token-route.test.ts`
Beklenen: FAIL — `Cannot find module '../[token]/route'`

- [ ] **Adım 3: Rotayı yaz**

`src/app/api/booking/[token]/route.ts`:

```ts
import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { BOOKING_CONFIG } from "@/lib/booking/config";
import { isSlotBookable } from "@/lib/booking/slots";
import { findBookingByToken, cancelBooking, rescheduleBooking } from "@/lib/booking/repository";
import { deleteEvent, patchEventTime, getAccessToken } from "@/lib/booking/google-calendar";
import { sendMailWithRetry, recipients } from "@/lib/mail/client";
import { reportError } from "@/lib/observability/report";
import BookingCancelled from "../../../../../emails/BookingCancelled";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ token: string }> };

function calendarId(env: Record<string, unknown>): string {
  return (env.BOOKING_CALENDAR_IDS as string).split(",")[0]!.trim();
}

export async function GET(_req: Request, ctx: Ctx): Promise<Response> {
  const { token } = await ctx.params;
  const { env } = getCloudflareContext();
  const row = await findBookingByToken(env.BOOKINGS_DB as D1Database, token);
  if (!row) return NextResponse.json({ ok: false, reason: "not_found" }, { status: 404 });
  return NextResponse.json({
    ok: true,
    booking: {
      startsAtUtc: row.startsAtUtc, endsAtUtc: row.endsAtUtc,
      status: row.status, meetUrl: row.meetUrl, locale: row.locale,
    },
  });
}

export async function DELETE(_req: Request, ctx: Ctx): Promise<Response> {
  const { token } = await ctx.params;
  const { env } = getCloudflareContext();
  const db = env.BOOKINGS_DB as D1Database;

  const row = await findBookingByToken(db, token);
  if (!row) return NextResponse.json({ ok: false, reason: "not_found" }, { status: 404 });

  const result = await cancelBooking(db, token);
  // İkinci tıklama hata değil: aynı sonucun tekrarı (spec §4).
  if (result === "already_cancelled") {
    return NextResponse.json({ ok: true, alreadyCancelled: true });
  }

  if (row.calendarEventId) {
    try {
      const at = await getAccessToken(env as never);
      await deleteEvent(at, calendarId(env as never), row.calendarEventId);
    } catch (err) {
      // Satır zaten iptal; takvimde kalan etkinlik elle silinebilir.
      reportError(err, { route: "booking/cancel", step: "calendar" });
    }
  }

  try {
    await sendMailWithRetry({
      to: recipients(process.env.SALES_INBOX_EMAIL, "digital@indoles.com.tr"),
      subject: `Randevu iptal edildi — ${row.name}`,
      react: BookingCancelled({ name: row.name, startsAtUtc: row.startsAtUtc }),
    });
  } catch (err) {
    reportError(err, { route: "booking/cancel", step: "notification" });
  }

  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request, ctx: Ctx): Promise<Response> {
  const { token } = await ctx.params;
  const body = (await req.json().catch(() => null)) as { startsAtUtc?: string } | null;
  if (!body?.startsAtUtc) {
    return NextResponse.json({ ok: false, reason: "validation" }, { status: 400 });
  }

  // Erteleme de 24 saat kuralına tabidir; istemci tek koruma olamaz.
  if (!isSlotBookable(body.startsAtUtc, new Date())) {
    return NextResponse.json({ ok: false, reason: "slot_unavailable" }, { status: 422 });
  }

  const { env } = getCloudflareContext();
  const db = env.BOOKINGS_DB as D1Database;
  const row = await findBookingByToken(db, token);
  if (!row) return NextResponse.json({ ok: false, reason: "not_found" }, { status: 404 });

  const endsAtUtc = new Date(
    Date.parse(body.startsAtUtc) + BOOKING_CONFIG.slotMinutes * 60_000,
  ).toISOString();

  const moved = await rescheduleBooking(db, token, body.startsAtUtc, endsAtUtc);
  if (!moved.ok) {
    const status = moved.reason === "slot_taken" ? 409 : 404;
    return NextResponse.json({ ok: false, reason: moved.reason }, { status });
  }

  if (row.calendarEventId) {
    try {
      const at = await getAccessToken(env as never);
      // Yalnız saat güncelleniyor; conferenceData'ya dokunulmuyor, bu yüzden
      // mevcut Meet bağlantısı korunuyor (spec §3.4).
      await patchEventTime(at, calendarId(env as never), row.calendarEventId, body.startsAtUtc, endsAtUtc);
    } catch (err) {
      reportError(err, { route: "booking/reschedule", step: "calendar" });
    }
  }

  return NextResponse.json({ ok: true, startsAtUtc: body.startsAtUtc, endsAtUtc });
}
```

- [ ] **Adım 4: İptal/erteleme sayfasını yaz**

`src/app/(marketing)/[locale]/rezervasyon/[token]/page.tsx`:

```tsx
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { V2PageHeader } from "@/components/v2/chrome/V2PageHeader";
import { ManageBooking } from "@/components/marketing/booking/ManageBooking";
import type { Locale } from "@/lib/content/types";

/** Kişiye özel sayfa: arama motorlarında görünmemeli. */
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale; token: string }>;
}) {
  const { locale, token } = await params;
  setRequestLocale(locale);
  return (
    <>
      <V2PageHeader />
      <main className="ds-container py-16">
        <ManageBooking locale={locale} token={token} />
      </main>
    </>
  );
}
```

- [ ] **Adım 5: Testlerin geçtiğini doğrula**

Çalıştır: `pnpm vitest run src/app/api/booking/__tests__/token-route.test.ts`
Beklenen: PASS — 7 test

- [ ] **Adım 6: Commit**

```bash
git add "src/app/api/booking/[token]/route.ts" "src/app/(marketing)/[locale]/rezervasyon/[token]/page.tsx" src/app/api/booking/__tests__/token-route.test.ts
git commit -m "feat(booking): iptal ve erteleme uç noktaları

İptal idempotent: ikinci tıklama hata değil, aynı sonucun tekrarı. Mail
linkleri iki kez tıklanır, bu bir kullanıcı hatası değil.

Erteleme events.patch ile yalnız saati güncelliyor; conferenceData'ya
dokunulmadığı için Meet bağlantısı korunuyor ve ziyaretçinin elindeki link
geçerli kalıyor.

24 saat kuralı ertelemede de sunucuda uygulanıyor.

İptal sayfası noindex: kişiye özel bir adres arama motoruna girmemeli."
```

---

## Görev 8: Arayüz bağlantısı

Görsel tasarım korunuyor; değişen tek şey verinin kaynağı (spec §5).

**Files:**
- Modify: `src/components/marketing/entry-popup/CalendarPicker.tsx`
- Modify: `src/components/marketing/entry-popup/SuccessState.tsx`
- Modify: `src/components/marketing/entry-popup/EntryPopup.tsx`
- Create: `src/components/marketing/booking/ManageBooking.tsx`
- Test: `src/components/marketing/entry-popup/__tests__/calendar-picker.test.tsx`

**Interfaces:**
- Consumes: `GET /api/booking/availability` (Görev 4), `POST /api/booking` (Görev 5), token rotası (Görev 7)
- Produces: `CalendarPicker` artık `availability` verisinden besleniyor

- [ ] **Adım 1: Başarısız testi yaz**

`src/components/marketing/entry-popup/__tests__/calendar-picker.test.tsx`:

```tsx
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";

vi.mock("next-intl", () => ({
  useTranslations: () => Object.assign((k: string) => k, { raw: () => [] }),
}));

import { CalendarPicker } from "../CalendarPicker";

const days = [
  { date: "2026-09-07", slots: [
    { startUtc: "2026-09-07T10:00:00.000Z", endUtc: "2026-09-07T11:30:00.000Z" },
    { startUtc: "2026-09-07T13:30:00.000Z", endUtc: "2026-09-07T15:00:00.000Z" },
  ] },
  { date: "2026-09-08", slots: [] },
];

beforeEach(() => vi.restoreAllMocks());

describe("CalendarPicker — sunucudan müsaitlik", () => {
  it("SABİT saat listesi ÜRETMEZ, sunucudan geleni gösterir", async () => {
    // Eski davranış sekiz sabit saat basıyordu ve dolu saatleri müsait
    // gösteriyordu; bu testin varlık sebebi o regresyonu engellemek.
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true, json: async () => ({ ok: true, days }),
    }));
    render(<CalendarPicker locale="tr" onSlotChange={() => {}} selectedDate={null} selectedTime={null} />);
    await waitFor(() => expect(screen.getByRole("button", { name: "7" })).toBeEnabled());
    fireEvent.click(screen.getByRole("button", { name: "7" }));
    await waitFor(() => expect(screen.getAllByRole("button", { name: /^\d{2}:\d{2}$/ })).toHaveLength(2));
    expect(screen.queryByRole("button", { name: "09:00" })).toBeNull();
  });

  it("slotu olmayan gün seçilemez", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true, json: async () => ({ ok: true, days }),
    }));
    render(<CalendarPicker locale="tr" onSlotChange={() => {}} selectedDate={null} selectedTime={null} />);
    await waitFor(() => expect(screen.getByRole("button", { name: "8" })).toBeDisabled());
  });

  it("sistem bozuksa iletişim formuna yönlendiren mesaj gösterir", async () => {
    // Sessiz boş kutu gösterilmiyor (spec §4).
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true, json: async () => ({ ok: false, unavailable: true, days: [] }),
    }));
    render(<CalendarPicker locale="tr" onSlotChange={() => {}} selectedDate={null} selectedTime={null} />);
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent(/bize yazın|iletişim/i));
  });

  it("seçim UTC olarak yukarı iletilir", async () => {
    const onSlotChange = vi.fn();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true, json: async () => ({ ok: true, days }),
    }));
    render(<CalendarPicker locale="tr" onSlotChange={onSlotChange} selectedDate={null} selectedTime={null} />);
    await waitFor(() => expect(screen.getByRole("button", { name: "7" })).toBeEnabled());
    fireEvent.click(screen.getByRole("button", { name: "7" }));
    const slotBtn = (await screen.findAllByRole("button", { name: /^\d{2}:\d{2}$/ }))[0]!;
    fireEvent.click(slotBtn);
    expect(onSlotChange).toHaveBeenCalledWith("2026-09-07", "2026-09-07T10:00:00.000Z");
  });
});
```

- [ ] **Adım 2: Testin başarısız olduğunu doğrula**

Çalıştır: `pnpm vitest run src/components/marketing/entry-popup/__tests__/calendar-picker.test.tsx`
Beklenen: FAIL — sabit saatler render ediliyor

- [ ] **Adım 3: `CalendarPicker`'ı sunucu verisine bağla**

`src/components/marketing/entry-popup/CalendarPicker.tsx` içinde:

1. `TIME_SLOTS` sabitini **sil**.
2. Bileşenin başına müsaitlik yüklemesini ekle:

```tsx
type AvailabilityDay = { date: string; slots: { startUtc: string; endUtc: string }[] };

const [days, setDays] = React.useState<AvailabilityDay[] | null>(null);
const [unavailable, setUnavailable] = React.useState(false);

React.useEffect(() => {
  let cancelled = false;
  fetch("/api/booking/availability")
    .then((r) => r.json())
    .then((d: { ok: boolean; unavailable?: boolean; days: AvailabilityDay[] }) => {
      if (cancelled) return;
      // `unavailable`, "bugün uygun saat yok" ile "sistem bozuk" halini
      // ayırıyor; ikisi aynı boş kutuya düşerse ziyaretçi çıkışsız kalır.
      if (!d.ok && d.unavailable) setUnavailable(true);
      setDays(d.days ?? []);
    })
    .catch(() => { if (!cancelled) setUnavailable(true); });
  return () => { cancelled = true; };
}, []);

const slotsByDate = React.useMemo(() => {
  const m = new Map<string, { startUtc: string; endUtc: string }[]>();
  for (const d of days ?? []) m.set(d.date, d.slots);
  return m;
}, [days]);
```

3. Gün hücresinin `disabled` kuralını `(slotsByDate.get(isoDate(cell))?.length ?? 0) === 0` yap — hafta sonu kuralı kalkar, Cumartesi sunucu izin verdiği için açılır.
4. Saat listesini `slotsByDate.get(selectedDate)` üzerinden render et; etiket ziyaretçinin dilimine çevrilir, `onSlotChange`e **UTC** değer gider:

```tsx
{(slotsByDate.get(selectedDate) ?? []).map((s) => (
  <button
    key={s.startUtc}
    type="button"
    onClick={() => onSlotChange(selectedDate, s.startUtc)}
    aria-pressed={selectedTime === s.startUtc}
  >
    {new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-GB", {
      hour: "2-digit", minute: "2-digit",
    }).format(new Date(s.startUtc))}
  </button>
))}
```

5. `unavailable` durumunda takvim yerine çıkış yolu göster:

```tsx
{unavailable && (
  <p role="status" className="text-sm text-ink-700">
    {locale === "tr"
      ? "Şu an uygun saat görünmüyor. Bize yazın, biz dönelim."
      : "No times are available right now. Write to us and we will get back."}
  </p>
)}
```

- [ ] **Adım 4: `SuccessState`e Meet ve iptal linkini geri getir**

```tsx
type Props = {
  variant: "booking" | "contact";
  onClose: () => void;
  /** ADR-025'te kaldırılmıştı; gerçek rezervasyonla birlikte geri geldi. */
  meetUrl?: string | null;
  cancelUrl?: string | null;
};
```

Gövdeye ekle:

```tsx
{variant === "booking" && meetUrl && (
  <p className="text-sm mt-4">
    <a href={meetUrl} className="underline">{t("success.meetLink")}</a>
  </p>
)}
{variant === "booking" && cancelUrl && (
  <p className="text-xs text-neutral-600 mt-2">
    <a href={cancelUrl} className="underline">{t("success.manageLink")}</a>
  </p>
)}
```

`messages/tr.json` ve `messages/en.json` içine `popup.success.meetLink` ve `popup.success.manageLink` anahtarlarını ekle (TR: "Görüşme bağlantısını aç" / "Randevunu görüntüle veya iptal et").

- [ ] **Adım 5: `EntryPopup`u yeni uç noktaya bağla**

`handleSubmitForm` içinde `submissionType === "booking"` dalında `submitVisitorProfile` yerine `POST /api/booking` çağrılır; dönen `cancelToken` ve `meetUrl` state'e alınıp `SuccessState`e geçirilir. `contact` dalı **değişmez**.

- [ ] **Adım 6: Testlerin geçtiğini doğrula**

```bash
pnpm vitest run src/components/marketing/entry-popup
pnpm typecheck
```

Beklenen: tüm testler PASS

- [ ] **Adım 7: Commit**

```bash
git add src/components/marketing/entry-popup/ src/components/marketing/booking/ messages/
git commit -m "feat(booking): arayüz gerçek müsaitliğe bağlandı

CalendarPicker sabit sekiz saat üretmeyi bıraktı. Eski davranış dolu
saatleri müsait gösteriyordu ve kendi kodunda bunu itiraf ediyordu; test
o regresyonu artık engelliyor.

Görsel tasarım korundu: düzen, stil ve etkileşim aynı, değişen yalnız
verinin kaynağı. Cumartesi açıldı -- kural artık bileşende değil sunucuda.

Seçim yukarı UTC olarak iletiliyor, ekranda ziyaretçinin dilimine
çevriliyor. SuccessState'in ADR-025'te kaldırılan bağlantı alanı gerçek
rezervasyonla birlikte geri geldi: Meet linki ve iptal adresi."
```

---

## Görev 9: Yaşam döngüsü işleri ve temizlik

**Files:**
- Create: `src/app/api/cron/route.ts`
- Modify: `wrangler.jsonc` (triggers)
- Delete: `src/lib/email/`, `src/components/marketing/entry-popup/QuickBookForm.tsx`
- Modify: `src/lib/popup/analytics.ts` (`popup_cal_com_redirect` kaldır)
- Modify: `docs/14-privacy-kvkk.md`
- Test: `src/app/api/cron/__tests__/route.test.ts`

**Interfaces:**
- Consumes: `fetchBusy`, `getAccessToken` (Görev 3), `CalendarAuthAlert` (Görev 6)
- Produces: `GET /api/cron` — günlük temizlik + aylık canlılık

- [ ] **Adım 1: Başarısız testi yaz**

`src/app/api/cron/__tests__/route.test.ts`:

```ts
import { describe, expect, it, vi, beforeEach } from "vitest";

const run = vi.fn().mockResolvedValue({ success: true });
const prepare = vi.fn(() => ({ bind: () => ({ run }) }));
vi.mock("@opennextjs/cloudflare", () => ({
  getCloudflareContext: () => ({ env: { BOOKINGS_DB: { prepare }, BOOKING_CALENDAR_IDS: "cal@x.com" } }),
}));

const fetchBusy = vi.fn();
vi.mock("@/lib/booking/google-calendar", async (orig) => ({
  ...(await orig<typeof import("@/lib/booking/google-calendar")>()),
  getAccessToken: vi.fn().mockResolvedValue("tok"),
  fetchBusy,
}));

const sendMailWithRetry = vi.fn();
vi.mock("@/lib/mail/client", async (orig) => ({
  sendMailWithRetry,
  recipients: (await orig<typeof import("@/lib/mail/client")>()).recipients,
}));

import { GET } from "../route";

beforeEach(() => { vi.clearAllMocks(); fetchBusy.mockResolvedValue([]); });

describe("cron", () => {
  it("90 günden eski randevuları siler", async () => {
    await GET(new Request("http://localhost/api/cron"));
    expect(prepare).toHaveBeenCalledWith(expect.stringContaining("DELETE FROM bookings"));
  });

  it("canlılık sorgusu çalışır — 6 aylık atıl kalma sayacını sıfırlar", async () => {
    await GET(new Request("http://localhost/api/cron"));
    expect(fetchBusy).toHaveBeenCalled();
  });

  it("yetki koptuysa uyarı maili gider", async () => {
    const { CalendarAuthError } = await import("@/lib/booking/google-calendar");
    fetchBusy.mockRejectedValue(new CalendarAuthError("invalid_grant"));
    await GET(new Request("http://localhost/api/cron"));
    expect(sendMailWithRetry).toHaveBeenCalledWith(
      expect.objectContaining({ subject: expect.stringMatching(/yeniden yetkilendirme/i) }),
    );
  });
});
```

- [ ] **Adım 2: Testin başarısız olduğunu doğrula**

Çalıştır: `pnpm vitest run src/app/api/cron/__tests__/route.test.ts`
Beklenen: FAIL — `Cannot find module '../route'`

- [ ] **Adım 3: Cron rotasını yaz**

`src/app/api/cron/route.ts`:

```ts
import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { fetchBusy, getAccessToken, CalendarAuthError } from "@/lib/booking/google-calendar";
import { sendMailWithRetry, recipients } from "@/lib/mail/client";
import { reportError } from "@/lib/observability/report";

export const runtime = "nodejs";

/** KVKK saklama süresi: görüşme tarihinden 90 gün sonra satır silinir (spec §2.2b). */
const RETENTION_DAYS = 90;

export async function GET(_req: Request): Promise<Response> {
  const { env } = getCloudflareContext();
  const db = env.BOOKINGS_DB as D1Database;
  const cutoff = new Date(Date.now() - RETENTION_DAYS * 86_400_000).toISOString();

  await db.prepare("DELETE FROM bookings WHERE starts_at_utc < ?").bind(cutoff).run();

  /**
   * Canlılık sorgusu (spec §8). İki iş birden yapıyor: 6 aylık atıl kalma
   * sayacını sıfırlıyor ve token'ın hâlâ geçerli olduğunu erken doğruluyor.
   * Yetkinin sessizce ölmesi bu yolun asıl riski.
   */
  try {
    const token = await getAccessToken(env as never);
    const ids = (env.BOOKING_CALENDAR_IDS as string).split(",").map((s) => s.trim());
    const from = new Date().toISOString();
    const to = new Date(Date.now() + 3_600_000).toISOString();
    await fetchBusy(token, ids, from, to);
  } catch (err) {
    reportError(err, { route: "cron", step: "liveness" });
    if (err instanceof CalendarAuthError) {
      await sendMailWithRetry({
        to: recipients(process.env.SALES_INBOX_EMAIL, "digital@indoles.com.tr"),
        subject: "INDOLES — takvim bağlantısı yeniden yetkilendirme istiyor",
        // Düz fonksiyon çağrısı, JSX değil: rota dosyası `.ts` ve JSX orada
        // derlenmez. Depodaki diğer üç mail çağrısı da aynı biçimde
        // (bkz. src/app/api/contact/route.ts).
        react: CalendarAuthAlert({
          // CalendarAuthError `code` alanı taşımıyor; yetkinin ölme
          // biçimi pratikte tek: refresh token reddedildi.
          errorCode: "invalid_grant",
          detectedAtUtc: new Date().toISOString(),
        }),
      }).catch(() => {});
    }
  }

  return NextResponse.json({ ok: true });
}
```

- [ ] **Adım 4: Cron tetikleyicisini ekle**

`wrangler.jsonc`:

```jsonc
  "triggers": { "crons": ["0 3 * * *"] },
```

- [ ] **Adım 5: Ölü Cal.com kalıntılarını sil**

```bash
git rm -r src/lib/email
git rm src/components/marketing/entry-popup/QuickBookForm.tsx
```

`src/lib/popup/analytics.ts` içinden `popup_cal_com_redirect: { booking_id: string };` satırını sil.

- [ ] **Adım 6: `docs/14`'ü güncelle**

§1 tablosundaki "Rezervasyon verisi | Cal.com Cloud" satırını değiştir:

```markdown
| Rezervasyon verisi | Cloudflare D1 (`bookings`) — yalnız ad + e-posta; görüşmeden 90 gün sonra silinir | ADR-025, rezervasyon spec §2.2b |
```

§2.3 "Cal.com" bölümünü sil; yerine Google Calendar'ı veri işleyen olarak ekle.

- [ ] **Adım 7: Testlerin geçtiğini doğrula**

```bash
pnpm vitest run
pnpm typecheck
```

Beklenen: tüm testler PASS, typecheck temiz

- [ ] **Adım 8: Commit**

```bash
git add -A
git commit -m "feat(booking): yaşam döngüsü işleri + Cal.com kalıntı temizliği

Günlük cron iki iş yapıyor. Birincisi KVKK saklama süresi: görüşmeden 90
gün sonra satır siliniyor. İkincisi canlılık sorgusu -- küçük bir freeBusy
çağrısı hem 6 aylık atıl kalma sayacını sıfırlıyor hem token'ın
geçerliliğini erken doğruluyor. invalid_grant yakalanırsa uyarı maili
gidiyor; yetkinin sessizce ölmesi bu yolun asıl riskiydi.

Ölü Cal.com kalıntıları gitti: src/lib/email (gerçek yol src/lib/mail),
QuickBookForm ve popup_cal_com_redirect olay tipi.

docs/14 güncellendi: rezervasyon verisi artık Cal.com Cloud'da değil D1'de
ve minimizasyon kuralı yazılı."
```

---

## Görev 10: Canlı doğrulama ve `/iletisim` gömülü takvim

**Files:**
- Modify: `src/app/(marketing)/[locale]/iletisim/page.tsx`
- Modify: `docs/superpowers/specs/2026-08-27-rezervasyon-sistemi-design.md` (ilk gün tarihi)
- Test: elle canlı doğrulama

- [ ] **Adım 1: Spec'teki ilk müsait günü güncelle**

`§3.1b` tablosunda `2026-08-31` → `2026-09-07`. Gerekçe satırı ekle: geliştirme için ertelendi (Burak kararı, 2026-08-28); ADR-025'in geçiş kurgusu o tarihe kadar geçerli.

- [ ] **Adım 2: `/iletisim` sayfasına `BookingScreen`i göm**

`ContactForm`un yanına, aynı `BookingScreen` bileşeni modal olmadan sayfa içinde render edilir. İki yüzey tek bileşeni paylaşır; ayrı bir takvim arayüzü yazılmaz (spec §5).

- [ ] **Adım 3: Deploy ve duman testi**

```bash
zsh /tmp/deploy-prod-indoles.sh
CF_SMOKE_DOH=1 scripts/cf-smoke.sh https://www.indoles.com.tr
```

Beklenen: 30/30

- [ ] **Adım 4: Uçtan uca canlı doğrulama**

Sırayla ve **gerçek** olarak:

1. `/tr/iletisim` → takvimde yalnız gerçekten boş saatler görünüyor mu
2. Bir slot rezerve et → onay maili geldi mi, Meet bağlantısı çalışıyor mu
3. `digital@indoles.com.tr` takviminde etkinlik göründü mü, ziyaretçi davetli mi
4. Aynı slotu ikinci kez rezerve etmeyi dene → "bu saat az önce alındı"
5. Onay mailindeki linkten **ertele** → Meet bağlantısı **aynı kaldı** mı
6. Aynı linkten **iptal et** → takvimden silindi mi, slot listeye geri döndü mü
7. İptal linkine ikinci kez tıkla → hata değil, "zaten iptal edilmiş"

- [ ] **Adım 5: Commit**

```bash
git add -A
git commit -m "feat(booking): /iletisim gömülü takvim + ilk gün 7 Eylül

Rezervasyon iki yüzeyde de aynı BookingScreen bileşenini kullanıyor:
popup'ta modal, iletişim sayfasında gömülü. Ayrı bir takvim arayüzü
yazılmadı.

İlk müsait gün 31 Ağustos'tan 7 Eylül'e alındı (Burak kararı): sistemin
düzgün kurulması için 10 gün. O tarihe kadar ADR-025'in geçiş kurgusu --
form + e-posta -- yürürlükte kalıyor."
```

---

## Bilinen açık uçlar

| Konu | Durum |
|---|---|
| **Apple Calendar ↔ `digital@` bağlantısı** | Burak yapıyor. **Görev 4'ten önce tamamlanmalı** — yoksa `freeBusy` boş döner ve dolu saatler satılır |
| Cloud projesinin kuruma devri | Launch sonrası; uygulamayı bloke etmiyor |
| OAuth 10. gün testi | ~2026-09-06; Görev 9'daki canlılık işi bunu zaten sürekli yapıyor |
| Çoklu danışman | Kapsam dışı; `consultant_id` alanı hazır |
