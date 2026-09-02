/**
 * `POST /api/tools/diagnoo-unlock` — Diagnoo GAP analizi kilit açma (unlock)
 * uç noktası. Spec §10 "Kilit açma akışı", Görev 12.
 *
 * Akış (KESİN sıra): json → `diagnooUnlockSchema.safeParse`
 * (`kvkkConsent: z.literal(true)` — GEO'daki `geoReportSchema` ile AYNI KVKK
 * kapı mantığı, bkz. o şemanın yorumu) → ip → Turnstile (koşulsuz) →
 * `TOOL_IP_SALT` fail-closed → `hashClientIp` → `getDiagnostic` (yok → 404;
 * tamamlanmamış/rapor yok → 409 not-ready) → `createLead` (aynı teşhis için
 * ikinci çağrı `UNIQUE` ihlaliyle "duplicate" döner — unlock İDEMPOTENT,
 * hata değil, akış aynen devam eder) → `knownMetrics` verilmişse
 * `recomputeWithKnownMetrics` + `saveReport` (gerçek veriyle finansal
 * projeksiyon yeniden hesaplanır ve kalıcılaşır) → satış lead bildirimi →
 * 200 `{ report }`.
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
import { getDiagnostic, createLead, saveReport } from "@/lib/tools/diagnoo/repository";
import { recomputeWithKnownMetrics } from "@/lib/tools/diagnoo/report";
import { sendMailWithRetry, recipients } from "@/lib/mail/client";
import { reportError } from "@/lib/observability/report";
import DiagnooLeadNotification from "../../../../../emails/DiagnooLeadNotification";

export const runtime = "nodejs";

// GEO/booking rotalarındaki AYNI dar env tanımı.
type DiagnooRouteEnv = { BOOKINGS_DB: D1Database };

type DiagnooUnlockErrorCode = "invalid" | "turnstile-failed" | "misconfigured" | "not-found" | "not-ready";

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

  const row = await getDiagnostic(db, data.diagnosticId);
  if (!row) {
    return errorResponse("not-found", 404);
  }
  if (row.status !== "completed" || row.report === null) {
    return errorResponse("not-ready", 409);
  }

  try {
    // `createLead` "UNIQUE" ihlalini kendi içinde `{ok:false, reason:"duplicate"}`
    // olarak yakalar (repository.ts) — unlock idempotent olmalı (spec §10),
    // ikinci çağrı hata sayılmaz, akış aynen devam eder.
    await createLead(db, {
      id: crypto.randomUUID(),
      diagnosticId: data.diagnosticId,
      email: data.email,
      company: data.company,
      fullName: data.fullName ?? null,
      knownMetrics: data.knownMetrics ?? null,
      clientIpHash: ipHash,
    });
  } catch (err) {
    reportError(err, { route: "tools/diagnoo-unlock", step: "create-lead" });
    return errorResponse("misconfigured", 500);
  }

  let report = row.report;
  if (data.knownMetrics) {
    report = recomputeWithKnownMetrics(report, data.knownMetrics);
    try {
      await saveReport(db, data.diagnosticId, report);
    } catch (err) {
      reportError(err, { route: "tools/diagnoo-unlock", step: "save-report" });
      return errorResponse("misconfigured", 500);
    }
  }

  // Satış lead bildirimi — spec §10: hata cevabı ENGELLEMEZ. Ziyaretçi kilidi
  // zaten açılmış raporunu görmeli, satış maili ikincil bir yan etkidir.
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

  return NextResponse.json({ report }, { status: 200 });
}
