/**
 * `POST /api/tools/diagnoo-start` — Diagnoo GAP analizi başlatma uç noktası.
 * Spec §9 "Teşhis başlatma akışı", Görev 12.
 *
 * Akış (Faz 2 lansman düzeltme dalgası sonrası, GEO rotalarının
 * (`geo-scan/route.ts`, `geo-report/route.ts`) izlediği sıranın ÜZERİNE
 * madde A eklenmiş hâli): json → `diagnooStartSchema.safeParse` → bal küpü/
 * süre tuzağı (`spamSignal`, HER ZAMAN çalışır) → ip (`cf-connecting-ip`,
 * yoksa `"0.0.0.0"`) → Turnstile (yalnız `turnstileEnabled()` iken) → motor
 * anahtarları kontrolü (`GEMINI_API_KEY`/`FIRECRAWL_API_KEY`, "kullanıma
 * henüz açılmadı" fail-closed — GEO'da karşılığı yok, yalnız Diagnoo'ya
 * özgü) → `TOOL_IP_SALT` fail-closed (KVKK) → `hashClientIp` → IP/gün limiti
 * → global/gün limiti → URL normalize → `findFreshCompleted` (24 saat
 * içinde tamamlanmış aynı URL varsa yeniden koşturmaz, maliyet koruması) →
 * yoksa yeni teşhis oluştur + Workflow'u tetikle → 202.
 *
 * TURNSTILE ADR-028 DESENİNE TAŞINDI (Görev 17.1, task-17-brief §17.1): launch
 * konfigürasyonunda `NEXT_PUBLIC_TURNSTILE_SITE_KEY` boş — bu rota da GEO/
 * contact gibi Turnstile'ı yalnız `turnstileEnabled()` bayrağı açıkken
 * zorunlu kılar; bayrak kapalıyken YERİNE bal küpü + süre tuzağı
 * (`spamSignal`) çalışır. Sahte başarı GEO'nun 6330fcc'de seçtiği davranışın
 * BİREBİR aynısı: 4xx dönmek bota neyin yakalandığını öğretir, 200 `{ ok:
 * true }` dönüp teşhisi hiç başlatmamak hem botu yanıltır hem D1/Workflow
 * maliyetini korur.
 *
 * GEO'dan FARK: Turnstile başarısızlığı burada 403 döner (GEO'da 400) — spec
 * §9'un kapalı sözlüğü bunu böyle tanımlar; iki araç arasında bilinçli bir
 * kod farkı, hizalama hatası değil. Bu fark bayrak açıkken de korunur.
 */
import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { diagnooStartSchema } from "@/lib/schemas/tools";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { spamSignal, turnstileEnabled } from "@/lib/security/anti-spam";
import { hashClientIp } from "@/lib/tools/shared/ip-hash";
import {
  createDiagnostic,
  findFreshCompleted,
  countDiagnosticsSince,
  sqliteTimestamp,
} from "@/lib/tools/diagnoo/repository";
import { reportError } from "@/lib/observability/report";

export const runtime = "nodejs";

// `cloudflare-env.d.ts` yereldeki `wrangler types` çıktısı, repoya girmiyor
// (GEO/booking rotalarındaki aynı gerekçe) — dar tanım burada. Diagnoo AYNI
// rezervasyon D1 veritabanını kullanıyor (`repository.ts` başlık yorumu),
// bu yüzden binding adı da AYNI: `BOOKINGS_DB`.
type DiagnooRouteEnv = {
  BOOKINGS_DB: D1Database;
  DIAGNOO_WORKFLOW: { create(opts: { params: { diagnosticId: string } }): Promise<unknown> };
};

type DiagnooStartErrorCode =
  | "invalid"
  | "turnstile-failed"
  | "misconfigured"
  | "not-configured"
  | "rate-limited";

function errorResponse(error: DiagnooStartErrorCode, status: number): Response {
  return NextResponse.json({ error }, { status });
}

const IP_DAILY_LIMIT = 3;
const GLOBAL_DAILY_LIMIT = 100;
const FRESH_HOURS = 24;
const DAY_MS = 24 * 60 * 60 * 1000;

/** `new URL(url).origin + pathname` (sondaki `/` düşer) — aynı sayfanın farklı
 * yazımlarını (`https://a.com` vs `https://a.com/`) tek kayda eşler. */
function normalizeUrl(url: string): string {
  const u = new URL(url);
  return u.origin + u.pathname.replace(/\/$/, "");
}

export async function POST(req: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse("invalid", 400);
  }

  const parsed = diagnooStartSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("invalid", 400);
  }
  const data = parsed.data;

  // Bal küpü + süre tuzağı — HER ZAMAN çalışır (Turnstile açık/kapalı fark
  // etmez), contact/GEO route'larının izlediği AYNI desen. Sahte başarı
  // bilinçli: 4xx dönmek bota neyin yakalandığını öğretir; 200 dönüp teşhisi
  // hiç başlatmamak hem botu yanıltır hem D1/Workflow maliyetini korur.
  const spam = spamSignal(data);
  if (spam) {
    console.warn(`[api/tools/diagnoo-start] spam_suspect signal=${spam}`);
    return NextResponse.json({ ok: true });
  }

  const ip = req.headers.get("cf-connecting-ip") ?? "0.0.0.0";

  if (turnstileEnabled()) {
    const turnstileOk = data.turnstileToken
      ? await verifyTurnstile(data.turnstileToken, ip)
      : false;
    if (!turnstileOk) {
      return errorResponse("turnstile-failed", 403);
    }
  }

  // Lansman düzeltme dalgası madde A (Task 10 review Important): Burak'ın
  // kararı "kullanıma sonra açarız" — motor anahtarları üretimde henüz
  // tanımlı değilken her gerçek tarama Firecrawl'dan hata alıp
  // `scrape_failed`e düşüyor, D1 satırı + Workflow koşusu + günlük IP
  // kotasından bir hak zaten harcanmış oluyordu. Anahtar yoksa taramayı hiç
  // BAŞLATMADAN durum söylenir: hız limiti sayımından ve
  // `createDiagnostic`/Workflow'dan ÖNCE, salt/hash'e bile gitmeden kontrol
  // edilir. `PSI_API_KEY` bilerek DAHIL DEĞİL: PSI zaten null dönebiliyor,
  // hız verisi "veri yetersiz" yoluna düşer — araç onsuz da anlamlı çalışır.
  //
  // Kaynak `process.env` (TOOL_IP_SALT ile AYNI desen, aşağıya bkz.):
  // `@opennextjs/cloudflare`nin `populateProcessEnv`i (dist/cli/templates/
  // init.js) prod'da Workers `env`indeki HER string alanı (`vars` +
  // `wrangler secret put` sırları) `process.env`e KOPYALAR; Workflow'un
  // kendisi de (`custom-worker.ts` `DiagnooDiagnosticWorkflow`) bu anahtarları
  // `this.env` üzerinden AYNI platform env'inden okur (`pipeline.ts`
  // `PipelineEnv`). Yani iki okuma yolu asla ayrışmaz — `process.env`in
  // "evet var" demesi Workflow'un da göreceği anlamına gelir.
  if (!process.env.GEMINI_API_KEY || !process.env.FIRECRAWL_API_KEY) {
    return errorResponse("not-configured", 503);
  }

  // KVKK fail-closed: GEO rotalarıyla AYNI duruş — tuz eksik/boşsa tuzsuz
  // SHA-256(IP) rainbow-table ile anında geri çevrilir, ham IP saklamakla
  // eşdeğerdir. Hash'e gitmeden 500.
  const salt = process.env.TOOL_IP_SALT;
  if (!salt) {
    reportError(new Error("TOOL_IP_SALT is not configured"), {
      route: "tools/diagnoo-start",
      step: "config",
    });
    return errorResponse("misconfigured", 500);
  }
  const ipHash = await hashClientIp(ip, salt);

  const { env } = getCloudflareContext();
  const diagnooEnv = env as unknown as DiagnooRouteEnv;
  const db = diagnooEnv.BOOKINGS_DB;

  // D1'in `datetime('now')` metniyle (UTC, "T" yok) sözlük sırasında doğru
  // karşılaştırılsın diye `sqliteTimestamp` — bkz. repository.ts başlık notu.
  const sinceIso = sqliteTimestamp(new Date(Date.now() - DAY_MS));

  const ipCount = await countDiagnosticsSince(db, ipHash, sinceIso);
  if (ipCount >= IP_DAILY_LIMIT) {
    return errorResponse("rate-limited", 429);
  }
  const globalCount = await countDiagnosticsSince(db, null, sinceIso);
  if (globalCount >= GLOBAL_DAILY_LIMIT) {
    return errorResponse("rate-limited", 429);
  }

  const normalizedUrl = normalizeUrl(data.url);

  const fresh = await findFreshCompleted(db, normalizedUrl, FRESH_HOURS);
  if (fresh) {
    return NextResponse.json({ id: fresh.id, reused: true }, { status: 202 });
  }

  const id = crypto.randomUUID();
  try {
    await createDiagnostic(db, { id, url: normalizedUrl, locale: data.locale, clientIpHash: ipHash });
    await diagnooEnv.DIAGNOO_WORKFLOW.create({ params: { diagnosticId: id } });
  } catch (err) {
    // Try/catch olmadan bir D1/Workflow hatası burada yakalanmadan fırlar —
    // rota çöker ve istemci JSON gövdesi yerine framework'ün genel HTML hata
    // sayfasını alır (GEO'daki `insertScan` savunmasının AYNISI).
    reportError(err, { route: "tools/diagnoo-start", step: "create" });
    return errorResponse("misconfigured", 500);
  }

  return NextResponse.json({ id, reused: false }, { status: 202 });
}
