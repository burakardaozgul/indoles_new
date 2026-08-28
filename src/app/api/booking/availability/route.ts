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
    // `BOOKINGS_DB` henüz `wrangler.jsonc`'de D1 binding'i olarak yok (görev
    // 4 kapsam kararı: token'ın D1 yetkisi yok, veritabanı kurulamadı). Bu
    // yüzden üretilen `CloudflareEnv` tipinde alan tanımlı değil; binding
    // gelince `cf:typegen` tipi kendiliğinden tamamlayacak ve bu cast'e
    // gerek kalmayacak.
    const db = (env as unknown as { BOOKINGS_DB: D1Database }).BOOKINGS_DB;
    const [busy, soldSlots] = await Promise.all([
      fetchBusy(token, calendarIds, now.toISOString(), toUtc),
      listSoldSlots(db, now.toISOString(), toUtc),
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
