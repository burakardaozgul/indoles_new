/**
 * `POST /api/tools/geo-report` — GEO görünürlük denetleyicisi detaylı rapor
 * akışı. Spec §3 "Detaylı rapor", Görev 12.
 *
 * Akış (KESİN sıra): şema (`geoReportSchema` — `kvkkConsent: z.literal(true)`)
 * → Turnstile → `TOOL_IP_SALT` fail-closed (KVKK) → IP hash → lead limiti
 * (IP/saat 3, `countLeadsSince`) → `getScan` (yoksa 404) → `insertLead` →
 * satışa lead bildirimi + kullanıcıya rapor maili → 200 `{ ok: true }`.
 *
 * KVKK RIZA KAPISI (iki savunma): (1) `geoReportSchema` rızayı `z.literal(true)`
 * ile ZORUNLU kılar — `false`/eksik rıza `safeParse`te 400 olur ve akış
 * `insertLead`'e HİÇ ulaşmaz. (2) `insertLead` veri katmanı rızayı doğrulamaz
 * (Görev 8 reviewer notu: `kvkk_consent = 1` sabitini yazar), bu yüzden rıza
 * doğrulaması BU rotanın sorumluluğudur ve `insertLead` çağrısından ÖNCE
 * (şema geçişinde) tamamlanmış olur. Rızasız hiçbir lead yazılmaz.
 *
 * Mail hata davranışı contact route'unu (`src/app/api/contact/route.ts`) izler:
 * satış bildirimi lead'in kendisidir — düşerse 500 (ziyaretçi tekrar dener).
 * Kullanıcı rapor maili ikincildir — düşerse yutulur + log (yoksa lead satışa
 * ulaşmışken ziyaretçi formu tekrar gönderir, aynı lead iki kez düşerdi). Bu
 * yüzden birincil (satış) mail ÖNCE gönderilir: kullanıcı maili başarılı olup
 * satış maili düşse ziyaretçi ikinci bir rapor alırdı.
 */
import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { geoReportSchema } from "@/lib/schemas/tools";
import { verifyTurnstile } from "@/lib/security/turnstile";
import {
  getScan,
  insertLead,
  countLeadsSince,
  hashClientIp,
} from "@/lib/tools/geo/repository";
import { sendMailWithRetry, recipients } from "@/lib/mail/client";
import { reportError } from "@/lib/observability/report";
import { getToolBySlug } from "@/lib/content/tools";
import { ARTICLES } from "@/lib/content/articles";
import { absoluteUrl } from "@/lib/seo/site";
import type { Locale } from "@/lib/content/types";
import GeoReportEmail from "../../../../../emails/GeoReportEmail";

export const runtime = "nodejs";

// `cloudflare-env.d.ts` yereldeki `wrangler types` çıktısı, repoya girmiyor —
// geo-scan/booking route'larıyla AYNI dar tanım, AYNI binding adı.
type GeoReportEnv = { BOOKINGS_DB: D1Database };

type GeoReportErrorCode =
  | "invalid"
  | "turnstile-failed"
  | "misconfigured"
  | "rate-limited"
  | "not-found"
  | "mail-failed";

function errorResponse(error: GeoReportErrorCode, status: number): Response {
  return NextResponse.json({ error }, { status });
}

const TOOL_SLUG = "geo-gorunurluk-denetleyicisi";
const LEAD_HOURLY_LIMIT = 3;
const HOUR_MS = 60 * 60 * 1000;

/** Rezervasyon sayfasının mutlak adresi — locale'e göre (`routing.ts`). */
function bookingUrl(locale: Locale): string {
  return absoluteUrl(locale === "tr" ? "/tr/iletisim" : "/en/contact");
}

/**
 * İlgili rehber linkleri — kanonik GEO yazıları (spec §3). `articles.ts`'in
 * `topic === "geo"` kayıtlarından türetilir; hayali bir link yazılmaz, içerik
 * katmanı tek kaynak. İlk üç yazı (GEO rehberi, llms.txt, AI Overviews).
 */
function guideLinks(locale: Locale): Array<{ label: string; href: string }> {
  return ARTICLES.filter((a) => a.topic === "geo")
    .slice(0, 3)
    .map((a) => ({
      label: a.title[locale],
      href: absoluteUrl(
        locale === "tr"
          ? `/tr/yazilar/${a.slug.tr}`
          : `/en/articles/${a.slug.en}`,
      ),
    }));
}

export async function POST(req: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse("invalid", 400);
  }

  // KVKK rıza kapısının BİRİNCİ savunması: `kvkkConsent: z.literal(true)`
  // burada geçmezse akış `insertLead`'e hiç ulaşmaz.
  const parsed = geoReportSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("invalid", 400);
  }
  const data = parsed.data;
  const locale = data.locale;

  const ip = req.headers.get("cf-connecting-ip") ?? "unknown";

  const turnstileOk = await verifyTurnstile(data.turnstileToken, ip);
  if (!turnstileOk) {
    return errorResponse("turnstile-failed", 400);
  }

  // KVKK fail-closed: tuz eksik/boşsa tuzsuz SHA-256(IP) rainbow-table ile
  // anında geri çevrilir — ham IP saklamakla eşdeğer. geo-scan/cron ile AYNI
  // duruş: hash'e gitmeden 500.
  const salt = process.env.TOOL_IP_SALT;
  if (!salt) {
    reportError(new Error("TOOL_IP_SALT is not configured"), {
      route: "tools/geo-report",
      step: "config",
    });
    return errorResponse("misconfigured", 500);
  }
  const ipHash = await hashClientIp(ip, salt);

  const { env } = getCloudflareContext();
  const db = (env as unknown as GeoReportEnv).BOOKINGS_DB;

  const hourAgo = new Date(Date.now() - HOUR_MS).toISOString();
  const leadCount = await countLeadsSince(db, ipHash, hourAgo);
  if (leadCount >= LEAD_HOURLY_LIMIT) {
    return errorResponse("rate-limited", 429);
  }

  const scan = await getScan(db, data.scanId);
  if (!scan) {
    return errorResponse("not-found", 404);
  }

  // Rıza şemada zaten doğrulandı (üstteki `safeParse`); `insertLead` burada
  // güvenle çağrılır. D1 yazma hatası contract gövdesini bozmasın diye sarılı.
  try {
    await insertLead(db, {
      scanId: data.scanId,
      email: data.email,
      clientIpHash: ipHash,
    });
  } catch (err) {
    reportError(err, { route: "tools/geo-report", step: "insert-lead" });
    return errorResponse("misconfigured", 500);
  }

  // Rapor görünümü — araç içerik katmanından sinyaller (kalem başlıkları),
  // içerik katmanından rehber linkleri. Tek kaynak; hayali metin üretilmez.
  const tool = getToolBySlug(TOOL_SLUG, "tr");
  const signals = tool?.signals ?? [];
  const links = guideLinks(locale);
  const booking = bookingUrl(locale);

  // Satış bildirimi lead'in kendisidir: düşerse 500, ikinci mail denenmez.
  try {
    await sendMailWithRetry({
      to: recipients(process.env.SALES_INBOX_EMAIL, "digital@indoles.com.tr"),
      subject:
        locale === "tr"
          ? `GEO rapor talebi — ${data.email} — ${scan.totalScore}/100`
          : `GEO report request — ${data.email} — ${scan.totalScore}/100`,
      react: GeoReportEmail({
        locale,
        url: scan.url,
        totalScore: scan.totalScore,
        band: scan.band,
        checks: scan.checks,
        signals,
        guideLinks: links,
        bookingUrl: booking,
        audience: "sales",
        leadEmail: data.email,
      }),
    });
  } catch (err) {
    reportError(err, { route: "tools/geo-report", step: "notification" });
    console.error("[api/tools/geo-report] notification_failed:", err);
    return errorResponse("mail-failed", 500);
  }

  // Kullanıcı raporu ikincildir. Hata yutulur + log: lead satışa ulaştıysa
  // ziyaretçiyi 500'le tekrar gönderime itmeyiz (çift lead).
  try {
    await sendMailWithRetry({
      to: data.email,
      subject:
        locale === "tr"
          ? "GEO görünürlük raporunuz — INDOLES"
          : "Your GEO visibility report — INDOLES",
      react: GeoReportEmail({
        locale,
        url: scan.url,
        totalScore: scan.totalScore,
        band: scan.band,
        checks: scan.checks,
        signals,
        guideLinks: links,
        bookingUrl: booking,
        audience: "user",
      }),
    });
  } catch (err) {
    reportError(err, { route: "tools/geo-report", step: "report" });
    console.error("[api/tools/geo-report] report_failed:", err);
  }

  // `tool_report_requested` dönüşüm olayı istemcide (GeoReportForm) atılır.
  return NextResponse.json({ ok: true });
}
