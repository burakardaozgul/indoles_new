import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { BOOKING_CONFIG } from "@/lib/booking/config";
import { computeAvailability, localDateIso } from "@/lib/booking/availability";
import { listSoldSlots } from "@/lib/booking/repository";
import {
  fetchBusy, getAccessToken, CalendarAuthError, type OAuthEnv,
} from "@/lib/booking/google-calendar";
import { reportError } from "@/lib/observability/report";

export const runtime = "nodejs";

/** Takvim önümüzdeki dört haftayı gösteriyor. */
const WINDOW_DAYS = 28;

// `cloudflare-env.d.ts` yereldeki `wrangler types` çıktısıdır, repoya girmez
// ve üretilmediği ortamda (CI, bu depo) `CloudflareEnv` bomboş kalır. Rota bu
// tipe bağlı olursa typecheck kırılır; onun yerine kullandığımız üç alanı
// burada dar biçimde tanımlıyoruz. `never` ile geçmek tip denetimini komple
// kapatıyordu (GOOGLE_OAUTH_* alan adlarında yazım hatası sessizce geçerdi) —
// bu yüzden `getAccessToken`'ın gerçek `OAuthEnv` tipini içe alıp genişletiyoruz.
type BookingEnv = OAuthEnv & { BOOKING_CALENDAR_IDS: string; BOOKINGS_DB: D1Database };

export async function GET(): Promise<Response> {
  const { env } = getCloudflareContext();
  const bookingEnv = env as unknown as BookingEnv;
  const now = new Date();
  // "Bugün" İstanbul dilimine göre: pencere ve tüm slotlar o dilimde
  // tanımlı. UTC günü kullanmak 21:00-23:59 UTC arasında bir gün geriden
  // başlayan, anlamsız bir boş günle açılan bir pencere üretiyordu.
  const fromDate = localDateIso(now, BOOKING_CONFIG.timezone);
  const toUtc = new Date(now.getTime() + WINDOW_DAYS * 86_400_000).toISOString();

  try {
    // Ayrıştırma try içinde: `BOOKING_CALENDAR_IDS` env'i eksik veya boşsa
    // `.split()` burada fırlar ve aşağıdaki `unavailable` yoluna düşer.
    // try dışındayken yakalanmadan 500'e çıkıyordu — tam da yapılandırma
    // hatası senaryosunda "yetki koptu, iletişim formuna düş" garantisi
    // deliniyordu (spec §4).
    //
    // Müsaitlik birden fazla takvimden okunuyor (spec §2.1b): iş takvimi ve
    // "yalnız müsaitlik" düzeyinde paylaşılan kişisel takvim.
    const calendarIds = bookingEnv.BOOKING_CALENDAR_IDS
      .split(",").map((s) => s.trim()).filter(Boolean);
    // Boş string (`""`) `.split()`'i fırlatmadan `[]` üretir — env eksikmiş
    // gibi davranmayı atlatır. Liste boşsa env hiç yokmuş gibi aynı
    // `unavailable` yoluna düşüyoruz; aksi halde `fetchBusy([])` hiç
    // meşguliyet göremeden sessizce "tamamen müsait" döner (spec §4 ihlali).
    if (calendarIds.length === 0) {
      throw new Error("BOOKING_CALENDAR_IDS boş — hiçbir takvim tanımlı değil");
    }

    const token = await getAccessToken(bookingEnv);
    const [busy, soldSlots] = await Promise.all([
      fetchBusy(token, calendarIds, now.toISOString(), toUtc),
      listSoldSlots(bookingEnv.BOOKINGS_DB, now.toISOString(), toUtc),
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
