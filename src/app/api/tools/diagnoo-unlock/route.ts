/**
 * `POST /api/tools/diagnoo-unlock` — Diagnoo GAP analizi kilit açma (unlock)
 * uç noktası. Spec §10 "Kilit açma akışı", Görev 12.
 *
 * Akış (KESİN sıra): json → `diagnooUnlockSchema.safeParse`
 * (`kvkkConsent: z.literal(true)` — GEO'daki `geoReportSchema` ile AYNI KVKK
 * kapı mantığı, bkz. o şemanın yorumu) → ip → Turnstile (koşulsuz) →
 * `TOOL_IP_SALT` fail-closed → `hashClientIp` → IP/saat limiti (429) →
 * `getDiagnostic` (yok → 404; tamamlanmamış/rapor yok → 409 not-ready) →
 * `hasLeadForEmail` (yalnız bildirim kararı için) → `createLead` (HER çağrı
 * kendi satırını yazar) → `knownMetrics` verilmişse `recomputeWithKnownMetrics`
 * + `saveLeadRecompute` (o satıra) → daha önce bildirilmemişse satış lead
 * bildirimi → kilit çerezi → 200 `{ report }`.
 *
 * KİLİT ZİYARETÇİYE BAĞLIDIR, TEŞHİSE DEĞİL (C1). Teşhis satırı aynı URL için
 * 24 saat boyunca yeniden kullanılıyor; kilit teşhis bazlı kalsaydı A'nın
 * açtığı rapor B'ye de açılırdı. Bu yüzden: (1) her lead kendi
 * `unlock_token`ını alır ve token yalnız `HttpOnly` çerezde taşınır,
 * (2) yeniden hesaplanan rapor PAYLAŞILAN `report_json`a değil lead satırına
 * yazılır — `saveReport` bu rotada artık hiç çağrılmaz.
 *
 * TEKRAR EDEN E-POSTA YALNIZ BİLDİRİMİ BASTIRIR. E-posta bir kimlik DEĞİL:
 * teşhis kimliği paylaşılabilir ve 24 saatlik yeniden kullanım yolu onu
 * zaten başkasına veriyor. E-posta kimlik sayılsaydı, A'nın iş adresini bilen
 * biri "A olarak" unlock edip A'nın kendi rakamlarıyla hesaplanmış raporunu
 * okuyabilir, üstelik token yeniden yazıldığı için A'nın çerezini de
 * düşürebilirdi. Bu yüzden her çağrı KENDİ lead satırını ve KENDİ token'ını
 * alır; aynı adres ikinci kez geldiğinde tek fark, satış kutusuna ikinci bir
 * bildirim düşmemesidir.
 *
 * MAIL DAVRANIŞI GEO'DAN BİLİNÇLİ FARKLI (spec §10): GEO'da (`geo-report`)
 * satış bildirimi lead'in kendisidir, düşerse 500. Burada tam rapor zaten
 * DB'ye yazılmış ve 200 yanıtı BAĞIMSIZ olarak ekrana dönecek — satış
 * e-postası düşse bile ziyaretçi kilidi açılmış raporunu görmelidir. Bu
 * yüzden mail `try/catch` ile sarılı, hata `reportError` + `console.error`
 * ile loglanır, yanıt ASLA engellenmez.
 */
import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { diagnooUnlockSchema } from "@/lib/schemas/tools";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { hashClientIp } from "@/lib/tools/shared/ip-hash";
import {
  getDiagnostic,
  createLead,
  saveLeadRecompute,
  hasLeadForEmail,
  countLeadsSince,
  sqliteTimestamp,
} from "@/lib/tools/diagnoo/repository";
import { recomputeWithKnownMetrics } from "@/lib/tools/diagnoo/report";
import { UNLOCK_COOKIE_MAX_AGE, unlockCookieName } from "@/lib/tools/diagnoo/unlock-cookie";
import { sendMailWithRetry, recipients } from "@/lib/mail/client";
import { reportError } from "@/lib/observability/report";
import DiagnooLeadNotification from "../../../../../emails/DiagnooLeadNotification";

export const runtime = "nodejs";

// GEO/booking rotalarındaki AYNI dar env tanımı.
type DiagnooRouteEnv = { BOOKINGS_DB: D1Database };

type DiagnooUnlockErrorCode =
  | "invalid"
  | "turnstile-failed"
  | "misconfigured"
  | "rate-limited"
  | "not-found"
  | "not-ready";

/**
 * IP başına saatlik kilit açma sınırı — GEO `geo-report` rotasının
 * `LEAD_HOURLY_LIMIT` değeriyle AYNI. Kilit açma da bir lead yazma yüzeyidir:
 * sınırsız çağrı hem satış kutusunu doldurur hem D1'e sınırsız satır yazar.
 */
const LEAD_HOURLY_LIMIT = 3;
const HOUR_MS = 60 * 60 * 1000;

function errorResponse(error: DiagnooUnlockErrorCode, status: number): Response {
  return NextResponse.json({ error }, { status });
}

/** Satış e-postasındaki tam rapor linkinin göreli yolu — locale her zaman
 * `tr` (GEO'daki satış bildirimlerinin AYNI kuralı: iç ekip Türkçe okur). */
function reportPath(diagnosticId: string): string {
  return `/tr/araclar/diagnoo/rapor/${diagnosticId}`;
}

export async function POST(req: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse("invalid", 400);
  }

  // KVKK rıza kapısının BİRİNCİ savunması: `kvkkConsent: z.literal(true)`
  // burada geçmezse akış `createLead`'e hiç ulaşmaz.
  const parsed = diagnooUnlockSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("invalid", 400);
  }
  const data = parsed.data;

  const ip = req.headers.get("cf-connecting-ip") ?? "0.0.0.0";

  const turnstileOk = await verifyTurnstile(data.turnstileToken, ip);
  if (!turnstileOk) {
    return errorResponse("turnstile-failed", 403);
  }

  // KVKK fail-closed: GEO/diagnoo-start ile AYNI duruş.
  const salt = process.env.TOOL_IP_SALT;
  if (!salt) {
    reportError(new Error("TOOL_IP_SALT is not configured"), {
      route: "tools/diagnoo-unlock",
      step: "config",
    });
    return errorResponse("misconfigured", 500);
  }
  const ipHash = await hashClientIp(ip, salt);

  const { env } = getCloudflareContext();
  const db = (env as unknown as DiagnooRouteEnv).BOOKINGS_DB;

  // D1'in `datetime('now')` metniyle (UTC, "T" yok) sözlük sırasında doğru
  // karşılaştırılsın diye `sqliteTimestamp` — bkz. repository.ts başlık notu.
  const sinceIso = sqliteTimestamp(new Date(Date.now() - HOUR_MS));
  const leadCount = await countLeadsSince(db, ipHash, sinceIso);
  if (leadCount >= LEAD_HOURLY_LIMIT) {
    return errorResponse("rate-limited", 429);
  }

  const row = await getDiagnostic(db, data.diagnosticId);
  if (!row) {
    return errorResponse("not-found", 404);
  }
  if (row.status !== "completed" || row.report === null) {
    return errorResponse("not-ready", 409);
  }

  // Kilit token'ı: yalnız çerezde taşınır, yanıt gövdesine ve URL'ye girmez.
  const unlockToken = crypto.randomUUID();
  const leadId = crypto.randomUUID();

  let report = row.report;

  try {
    // Bildirim kararı satır YAZILMADAN ÖNCE alınır; kendi satırımızı gördükten
    // sonra sorsaydık cevap her zaman "zaten bildirildi" olurdu.
    const alreadyNotified = await hasLeadForEmail(db, data.diagnosticId, data.email);

    await createLead(db, {
      id: leadId,
      diagnosticId: data.diagnosticId,
      email: data.email,
      company: data.company,
      fullName: data.fullName ?? null,
      knownMetrics: data.knownMetrics ?? null,
      clientIpHash: ipHash,
      unlockToken,
    });

    if (data.knownMetrics) {
      report = recomputeWithKnownMetrics(report, data.knownMetrics);
      // Ziyaretçiye özel rapor BU lead satırına yazılır; paylaşılan teşhis
      // satırına yazmak aynı teşhisi gören herkese bu kişinin trafik, sepet,
      // dönüşüm ve reklam bütçesi rakamlarını gösterirdi (C1).
      await saveLeadRecompute(db, leadId, report);
    }

    // Satış lead bildirimi — spec §10: hata cevabı ENGELLEMEZ. Ziyaretçi
    // kilidi zaten açılmış raporunu görmeli, satış maili ikincil bir yan
    // etkidir. Aynı adres için ikinci kez gönderilmez.
    if (!alreadyNotified) {
      try {
        await sendMailWithRetry({
          to: recipients(process.env.SALES_INBOX_EMAIL, "digital@indoles.com.tr"),
          subject: `Diagnoo lead — ${data.company} — ${report.healthScore}/100`,
          react: DiagnooLeadNotification({
            email: data.email,
            company: data.company,
            fullName: data.fullName ?? null,
            url: report.url,
            healthScore: report.healthScore,
            totalRecoverable: report.financial.totalRecoverable,
            hasRealMetrics: Boolean(data.knownMetrics),
            reportPath: reportPath(data.diagnosticId),
          }),
        });
      } catch (err) {
        reportError(err, { route: "tools/diagnoo-unlock", step: "mail" });
        console.error("[api/tools/diagnoo-unlock] mail_failed:", err);
      }
    }
  } catch (err) {
    reportError(err, { route: "tools/diagnoo-unlock", step: "create-lead" });
    return errorResponse("misconfigured", 500);
  }

  const res = NextResponse.json({ report }, { status: 200 });
  res.cookies.set(unlockCookieName(data.diagnosticId), unlockToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: UNLOCK_COOKIE_MAX_AGE,
  });
  return res;
}
