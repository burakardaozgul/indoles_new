/**
 * Günlük yaşam döngüsü işi (Görev 9, spec §8; ADR-029 §"Yeniden değerlendirme
 * tetikleyicileri").
 *
 * Mantık `getCloudflareContext()` ÇAĞIRMAZ, `env`'i parametre olarak alır.
 * Neden: bu fonksiyon iki farklı çağıranı desteklemek zorunda —
 * `src/app/api/cron/route.ts`'teki (manuel/dış tetikleme için sır korumalı)
 * `GET` rotası `getCloudflareContext()` ile env'i kendisi çözüp buraya
 * geçiriyor. `getCloudflareContext()` yalnız bir Next.js isteği sırasında
 * kurulan AsyncLocalStorage bağlamında çalışıyor; Cloudflare'in gerçek Cron
 * Trigger'ı ise Worker'ın `scheduled(event, env, ctx)` olayını çağırıyor —
 * İSTEK YOK, dolayısıyla o bağlam da yok. `env`'i parametre yapmak bu
 * fonksiyonu ikisinden de çağrılabilir kılıyor.
 */

import {
  fetchBusy,
  getAccessToken,
  CalendarAuthError,
  type OAuthEnv,
} from "./google-calendar";
import {
  completePastBookings,
  deleteBookingsOlderThan,
  listOrphanedBookings,
} from "./repository";
import { sendMailWithRetry, recipients } from "@/lib/mail/client";
import { reportError } from "@/lib/observability/report";
import CalendarAuthAlert from "../../../emails/CalendarAuthAlert";
import OrphanBookingsReport from "../../../emails/OrphanBookingsReport";

/** KVKK saklama süresi: görüşme tarihinden 90 gün sonra satır tamamen silinir (spec §2.2b, docs/14). */
const RETENTION_DAYS = 90;

export type CronEnv = OAuthEnv & {
  BOOKINGS_DB: D1Database;
  BOOKING_CALENDAR_IDS: string;
};

export type CronResult = {
  deletedCount: number;
  completedCount: number;
  orphanCount: number;
};

export async function runDailyCronJob(env: CronEnv): Promise<CronResult> {
  const db = env.BOOKINGS_DB;
  const now = new Date();
  const nowUtc = now.toISOString();
  const cutoffUtc = new Date(
    now.getTime() - RETENTION_DAYS * 86_400_000
  ).toISOString();

  // Dört adım KASITLI olarak birbirinden bağımsız try/catch'lere alınıyor
  // (Görev 9 fix turu 1, bulgu 1 — denetçi mutasyonla kanıtladı). Adımlar
  // paylaşımlı bir hata akışında zincirlenirse silme veya öksüz-raporu
  // adımındaki GEÇİCİ bir D1 hatası, 4. adımdaki canlılık sorgusunun hiç
  // çalışmamasına yol açar — ve tam da bu sorgu, OAuth refresh token'ının
  // Google'ın "7 gün / 6 ay atıl kalma" sınırında sessizce ölmesini önleyen
  // TEK mekanizma (bkz. adım 4 yorumu, ADR-029 "Yeniden değerlendirme
  // tetikleyicileri"). Bir adımın hatası diğer üçünü DURDURMAMALI; her biri
  // kendi hatasını `reportError` ile raporlayıp bir sonraki adıma geçer.
  let deletedCount = 0;
  let completedCount = 0;
  let orphans: Awaited<ReturnType<typeof listOrphanedBookings>> = [];

  // 1) KVKK saklama süresi: 90 günden eski satırlar statüsünden bağımsız silinir.
  try {
    deletedCount = await deleteBookingsOlderThan(db, cutoffUtc);
  } catch (err) {
    reportError(err, { route: "cron", step: "retention-delete" });
  }

  // 2) Ek 1 (denetim, plandaki ilk halinde yoktu): başlangıcı geçmiş
  //    'confirmed' satırlar 'completed'e çekilir. idx_bookings_slot VE
  //    idx_bookings_active_email ikisi de yalnız status='confirmed'
  //    satırları kapsıyor — bu adım olmadan geçmişte görüşülmüş bir e-posta
  //    süresiz "aktif randevu" kilidinde kalırdı (Eylül'de görüşen biri
  //    Ekim'de randevu alamaz).
  try {
    completedCount = await completePastBookings(db, nowUtc);
  } catch (err) {
    reportError(err, { route: "cron", step: "complete-past" });
  }

  // 3) Ek 2 (denetim): Calendar'a hiç yazılamamış (ADR-029) ve hâlâ
  //    gelecekte olan randevular varsa TEK özet mail. Sonuç boşsa mail YOK —
  //    her gün gelen bir "her şey yolunda" maili gerçek uyarıyı gömer.
  //    Sorgunun kendisi de kendi try/catch'inde: sorgu patlarsa mail
  //    denemesi hiç YAPILMAMALI (gönderecek veri yok), ama 4. adım yine de
  //    çalışmalı.
  try {
    orphans = await listOrphanedBookings(db, nowUtc);
    if (orphans.length > 0) {
      try {
        await sendMailWithRetry({
          to: recipients(
            process.env.SALES_INBOX_EMAIL,
            "digital@indoles.com.tr"
          ),
          subject: `INDOLES — ${orphans.length} randevu takvime düşmedi`,
          react: OrphanBookingsReport({
            bookings: orphans.map((b) => ({
              name: b.name,
              email: b.email,
              startsAtUtc: b.startsAtUtc,
            })),
          }),
        });
      } catch (err) {
        reportError(err, { route: "cron", step: "orphan-report-mail" });
      }
    }
  } catch (err) {
    reportError(err, { route: "cron", step: "orphan-report-query" });
  }

  // 4) Canlılık sorgusu (spec §8). Küçük bir freeBusy çağrısı hem Google'ın
  //    "7 gün / 6 ay atıl kalma" sayaçlarını sıfırlıyor hem refresh token'ın
  //    hâlâ geçerli olduğunu erken doğruluyor. Cron GÜNLÜK çalışıyor —
  //    ihtiyaç aylık, ama günlük çalıştırmak fazladan bir zamanlama durumu
  //    tutmayı gerektirmiyor ve maliyeti tek bir küçük istek. Yukarıdaki üç
  //    adımdan HANGİSİ patlarsa patlasın bu adım YİNE çalışır — en pahalı
  //    hata (sessiz token ölümü) budur.
  try {
    const token = await getAccessToken(env);
    const ids = env.BOOKING_CALENDAR_IDS.split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const to = new Date(now.getTime() + 3_600_000).toISOString();
    await fetchBusy(token, ids, nowUtc, to);
  } catch (err) {
    reportError(err, { route: "cron", step: "liveness" });
    if (err instanceof CalendarAuthError) {
      await sendMailWithRetry({
        to: recipients(process.env.SALES_INBOX_EMAIL, "digital@indoles.com.tr"),
        subject: "INDOLES — takvim bağlantısı yeniden yetkilendirme istiyor",
        react: CalendarAuthAlert({
          // CalendarAuthError `code` alanı taşımıyor; yetkinin ölme biçimi
          // pratikte tek: refresh token reddedildi.
          errorCode: "invalid_grant",
          detectedAtUtc: nowUtc,
        }),
      }).catch(() => {});
    }
  }

  return { deletedCount, completedCount, orphanCount: orphans.length };
}
