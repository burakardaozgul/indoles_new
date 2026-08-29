import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { bookingSchema } from "@/lib/schemas/booking";
import { BOOKING_CONFIG } from "@/lib/booking/config";
import { isSlotBookable } from "@/lib/booking/slots";
import { isLegitimateSlot } from "@/lib/booking/availability";
import { createBooking, attachCalendarResult } from "@/lib/booking/repository";
import { createEvent, getAccessToken, firstCalendarId, type OAuthEnv } from "@/lib/booking/google-calendar";
import { sendMailWithRetry, recipients } from "@/lib/mail/client";
import { spamSignal, turnstileEnabled } from "@/lib/security/anti-spam";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { reportError } from "@/lib/observability/report";
import BookingConfirmation from "../../../../emails/BookingConfirmation";
import BookingNotification from "../../../../emails/BookingNotification";

export const runtime = "nodejs";

// `cloudflare-env.d.ts` yereldeki `wrangler types` çıktısıdır, repoya girmez.
// `as never` tip denetimini komple kapatıp GOOGLE_OAUTH_* alan adlarındaki bir
// yazım hatasını sessizce geçirirdi (Görev 4 denetiminde aynı kusur bulundu ve
// `availability/route.ts`te düzeltildi). `getAccessToken`'ın gerçek `OAuthEnv`
// tipini içe alıp genişletiyoruz; aynı dar cast deseni.
type BookingEnv = OAuthEnv & { BOOKING_CALENDAR_IDS: string; BOOKINGS_DB: D1Database };

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

  // Tek koruma istemci olamaz (spec §3.1b, §4). İki bağımsız kontrol:
  // 1) slot ızgaraya/çalışma penceresine/açık güne/firstAvailableDate'e uyuyor mu
  //    (isLegitimateSlot) — 2) sürekli işleyen 24 saat kuralı (isSlotBookable).
  // İkisi ayrı endişeler: biri günün kendisini, öbürü "şimdi"ye göre mesafeyi
  // doğruluyor; biri eksik kalırsa el yapımı bir POST aradan sızabilirdi.
  const now = new Date();
  if (!isLegitimateSlot(data.startsAtUtc) || !isSlotBookable(data.startsAtUtc, now)) {
    return NextResponse.json({ ok: false, reason: "slot_unavailable" }, { status: 422 });
  }

  const { env } = getCloudflareContext();
  const bookingEnv = env as unknown as BookingEnv;
  const db = bookingEnv.BOOKINGS_DB;
  const endsAtUtc = new Date(
    Date.parse(data.startsAtUtc) + BOOKING_CONFIG.slotMinutes * 60_000,
  ).toISOString();
  const name = `${data.lead.firstName} ${data.lead.lastName}`;

  // 1) ÖNCE veritabanı. Tersi olsaydı Calendar'a etkinlik düşüp yazma
  //    başarısız olabilir ve kaydı olmayan bir toplantı kalırdı (spec §3.2).
  //    KVKK: yalnız ad ve e-posta yazılıyor (spec §2.2b) — telefon, şirket,
  //    unvan, persona, problemler veritabanına GİRMEZ.
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
    // "slot_taken" (çakışma kilidi) veya "duplicate_email" (aktif randevu
    // garantisi, Görev 2'de kısmi unique indekse taşındı) — rota kendi
    // kontrolünü icat etmez, veritabanının döndürdüğü sebebe güvenir.
    return NextResponse.json({ ok: false, reason: created.reason }, { status: 409 });
  }
  const row = created.row;

  // 2) Calendar + Meet. Buradaki başarısızlık randevuyu iptal ETMEZ ve satır
  //    'failed'e ÇEKİLMEZ (ADR-029; bu yolu üreten `markFailed` Görev 9 fix
  //    turu 1'de ölü kod olarak silindi). `idx_bookings_slot` ve
  //    `idx_bookings_active_email` kısmi indeksleri yalnız 'confirmed'
  //    satırları kapsıyor — satır 'failed' olduğu an slot VE e-posta kilidi
  //    aynı anda düşer, yani ziyaretçiye onay maili giderken saat başka
  //    birine satılabilir hale gelirdi. Niyet (spec §4) randevunun geçerli
  //    kalması, Burak'ın etkinliği elle açabilmesi; bunun işareti zaten
  //    bedava: `calendar_event_id` NULL kalır. Satır 'confirmed' kalır,
  //    slot tutulur, ziyaretçinin iptal/erteleme bağlantısı çalışmaya devam
  //    eder.
  let meetUrl: string | null = null;
  let degraded = false;
  try {
    const token = await getAccessToken(bookingEnv);
    // İlk kimlik boşsa (env tamamen boş, ya da baştan virgülle başlıyorsa)
    // `createEvent`'i boş bir calendarId ile çağırmak sessizce degraded'a
    // düşerdi ve sebebi hiçbir yerde görünmezdi (Görev 4 fix turu 2'de kardeş
    // delik kapatıldı). Açık, aranabilir bir hata fırlatılıyor —
    // `firstCalendarId` PATCH/DELETE ile paylaşılan tek tanım
    // (`@/lib/booking/google-calendar`, Görev 7 fix turu 1, bulgu C1).
    const calId = firstCalendarId(bookingEnv.BOOKING_CALENDAR_IDS);
    const res = await createEvent(token, calId, {
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
    degraded = true;
  }

  // 3) Mailler. Bildirim lead'in kendisidir; onay ikincildir.
  const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${data.locale}/rezervasyon/${row.cancelToken}`;
  try {
    await sendMailWithRetry({
      to: recipients(process.env.SALES_INBOX_EMAIL, "digital@indoles.com.tr"),
      subject: `Yeni randevu — ${name} — ${row.startsAtUtc}`,
      react: BookingNotification({
        name,
        lead: data.lead,
        persona: data.persona,
        problems: data.problems,
        startsAtUtc: row.startsAtUtc,
        meetUrl,
        degraded,
      }),
    });
  } catch (err) {
    reportError(err, { route: "booking", step: "notification" });
  }

  try {
    await sendMailWithRetry({
      to: data.lead.email,
      subject:
        data.locale === "tr" ? "Randevun onaylandı — INDOLES" : "Your booking is confirmed — INDOLES",
      react: BookingConfirmation({
        firstName: data.lead.firstName,
        locale: data.locale,
        startsAtUtc: row.startsAtUtc,
        visitorTimezone: data.visitorTimezone,
        meetUrl,
        cancelUrl,
      }),
    });
  } catch (err) {
    // Randevu geçerli kalır, silinmez (spec §4).
    reportError(err, { route: "booking", step: "confirmation" });
  }

  return NextResponse.json({ ok: true, cancelToken: row.cancelToken, meetUrl, degraded });
}
