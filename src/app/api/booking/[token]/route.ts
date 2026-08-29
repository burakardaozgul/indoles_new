import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { rescheduleSchema } from "@/lib/schemas/booking";
import { BOOKING_CONFIG } from "@/lib/booking/config";
import { isSlotBookable } from "@/lib/booking/slots";
import { isLegitimateSlot } from "@/lib/booking/availability";
import { findBookingByToken, cancelBooking, rescheduleBooking } from "@/lib/booking/repository";
import {
  deleteEvent,
  patchEventTime,
  getAccessToken,
  firstCalendarId,
  type OAuthEnv,
} from "@/lib/booking/google-calendar";
import { sendMailWithRetry, recipients } from "@/lib/mail/client";
import { reportError } from "@/lib/observability/report";
import BookingCancelled from "../../../../../emails/BookingCancelled";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ token: string }> };

// `cloudflare-env.d.ts` yereldeki `wrangler types` çıktısıdır, repoya girmez.
// `as never` tip denetimini komple kapatırdı (Görev 5 Fix B ile aynı gerekçe,
// bkz. `src/app/api/booking/route.ts`). `getAccessToken`'ın gerçek `OAuthEnv`
// tipini içe alıp genişletiyoruz; dar cast deseni tek yerde tanımlı.
type BookingEnv = OAuthEnv & { BOOKING_CALENDAR_IDS: string; BOOKINGS_DB: D1Database };

export async function GET(_req: Request, ctx: Ctx): Promise<Response> {
  const { token } = await ctx.params;
  const { env } = getCloudflareContext();
  const bookingEnv = env as unknown as BookingEnv;
  const row = await findBookingByToken(bookingEnv.BOOKINGS_DB, token);
  if (!row) return NextResponse.json({ ok: false, reason: "not_found" }, { status: 404 });
  return NextResponse.json({
    ok: true,
    booking: {
      startsAtUtc: row.startsAtUtc,
      endsAtUtc: row.endsAtUtc,
      status: row.status,
      meetUrl: row.meetUrl,
      locale: row.locale,
    },
  });
}

export async function DELETE(_req: Request, ctx: Ctx): Promise<Response> {
  const { token } = await ctx.params;
  const { env } = getCloudflareContext();
  const bookingEnv = env as unknown as BookingEnv;
  const db = bookingEnv.BOOKINGS_DB;

  const row = await findBookingByToken(db, token);
  if (!row) return NextResponse.json({ ok: false, reason: "not_found" }, { status: 404 });

  const result = await cancelBooking(db, token);
  // İkinci tıklama hata değil: aynı sonucun tekrarı (spec §4). Calendar'a
  // dokunulmuyor (etkinlik ilk iptalde zaten silindi) ve mail tekrar gitmiyor.
  if (result === "already_cancelled") {
    return NextResponse.json({ ok: true, alreadyCancelled: true });
  }
  if (result === "not_found") {
    return NextResponse.json({ ok: false, reason: "not_found" }, { status: 404 });
  }

  if (row.calendarEventId) {
    try {
      const at = await getAccessToken(bookingEnv);
      const calId = firstCalendarId(bookingEnv.BOOKING_CALENDAR_IDS);
      // `deleteEvent` idempotent: 404/410 başarı sayılır (bkz. google-calendar.ts).
      await deleteEvent(at, calId, row.calendarEventId);
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
    // Randevu iptali mail hatasından bağımsız geçerli kalır (spec §4).
    reportError(err, { route: "booking/cancel", step: "notification" });
  }

  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request, ctx: Ctx): Promise<Response> {
  const { token } = await ctx.params;
  const body = await req.json().catch(() => null);
  // POST'un `bookingSchema.safeParse` disiplini (spec, `route.ts`) burada da
  // geçerli: ham `body.startsAtUtc`'ye güvenmek "banana" gibi tarih olarak
  // anlamsız bir stringi `isLegitimateSlot`'un `new Date(...)` çağrısına kadar
  // sızdırıyor ve orada yakalanmayan bir `RangeError` fırlatıyordu (Görev 7
  // denetim bulgusu B5) — geçerli bir `cancel_token` bile gerektirmeden.
  const parsed = rescheduleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, reason: "validation" }, { status: 400 });
  }
  const { startsAtUtc } = parsed.data;

  // Fix A: erteleme, POST /api/booking'e Görev 5'te eklenen slot meşruluk
  // kontrolünü ATLAYAMAZ. Tek başına `isSlotBookable` (24 saat kuralı) yeterli
  // değil — meşru bir slot rezerve edip PATCH ile Pazar gününe / ızgara dışı
  // bir ana / gece 03:00'e ertelemek bu kontrolden geçerdi. İki bağımsız
  // kontrol: `isLegitimateSlot` (açık gün + ızgara + firstAvailableDate) ve
  // `isSlotBookable` (sürekli işleyen 24 saat kuralı) — POST ile AYNI
  // fonksiyonlar, `@/lib/booking/availability`'den paylaşılıyor (iki kopya
  // ayrışırsa delik geri gelir).
  const now = new Date();
  if (!isLegitimateSlot(startsAtUtc) || !isSlotBookable(startsAtUtc, now)) {
    return NextResponse.json({ ok: false, reason: "slot_unavailable" }, { status: 422 });
  }

  const { env } = getCloudflareContext();
  const bookingEnv = env as unknown as BookingEnv;
  const db = bookingEnv.BOOKINGS_DB;
  const row = await findBookingByToken(db, token);
  if (!row) return NextResponse.json({ ok: false, reason: "not_found" }, { status: 404 });

  // Bilinçli: `row.startsAtUtc` (KAYNAK, randevunun kendi zamanı) burada HİÇ
  // kontrol edilmiyor — yalnız HEDEF slot (`startsAtUtc`) doğrulanıyor. Yani
  // geçmişte kalmış/gerçekleşmiş bir randevu geçerli bir gelecek slota
  // ertelenebilir. Denetçi bunu engellenmesi gereken bir kusur olarak
  // işaretledi; bilinçli olarak ENGELLENMEDİ (Görev 7 fix turu 1, bulgu 3).
  //
  // GÜNCELLEME (Görev 9): bu artık bir kaçış yolu DEĞİL, yalnız bir
  // kolaylık. Görev 9'un günlük cron'u (`src/lib/booking/cron-job.ts`)
  // başlangıcı geçmiş 'confirmed' satırları 'completed'e çekiyor —
  // idx_bookings_active_email yalnız status='confirmed' satırları kapsadığı
  // için bu adım "aktif randevu" kilidini gerçek çözümüyle serbest bırakıyor.
  // Yani ziyaretçi artık o e-postayla YENİ bir randevu da alabiliyor; erteleme
  // yalnız cron'un henüz süpürmediği kısa aralıkta (aynı gün içinde, cron
  // 03:00 UTC'de çalışana kadar) daha hızlı bir alternatif. Burada hâlâ
  // ENGELLENMİYOR çünkü kapatmanın kazandırdığı bir şey yok — ziyaretçi zaten
  // dürüst bir işlem yapıyor (kendi randevusunu taşıyor) ve cron birkaç saat
  // içinde aynı sonucu kendiliğinden üretecek.
  const endsAtUtc = new Date(Date.parse(startsAtUtc) + BOOKING_CONFIG.slotMinutes * 60_000).toISOString();

  // Çakışma kontrolü veritabanı kısıtında yaşıyor (Görev 2 ruling); uygulama
  // burada kendi ön kontrolünü icat etmiyor, `rescheduleBooking`'in
  // döndürdüğü sonuca güveniyor.
  const moved = await rescheduleBooking(db, token, startsAtUtc, endsAtUtc);
  if (!moved.ok) {
    const status = moved.reason === "slot_taken" ? 409 : 404;
    return NextResponse.json({ ok: false, reason: moved.reason }, { status });
  }

  if (row.calendarEventId) {
    try {
      const at = await getAccessToken(bookingEnv);
      const calId = firstCalendarId(bookingEnv.BOOKING_CALENDAR_IDS);
      // `patchEventTime` `conferenceDataVersion` GÖNDERMEZ: yalnız saat
      // güncelleniyor, mevcut Meet bağlantısı korunuyor (spec §3.4, Görev 3).
      await patchEventTime(at, calId, row.calendarEventId, startsAtUtc, endsAtUtc);
    } catch (err) {
      // Satır zaten taşındı; Calendar tarafı manuel senkronize edilebilir.
      reportError(err, { route: "booking/reschedule", step: "calendar" });
    }
  }

  return NextResponse.json({ ok: true, startsAtUtc, endsAtUtc });
}
