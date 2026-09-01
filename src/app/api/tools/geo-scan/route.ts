/**
 * `POST /api/tools/geo-scan` — GEO görünürlük denetleyicisi tarama uç
 * noktası. Spec §4 "Tarama akışı", Görev 9.
 *
 * Akış (brief'in tanımladığı sıra, KESİN): Turnstile → `TOOL_IP_SALT`
 * yapılandırma kontrolü (fail-closed, KVKK) → IP hash → limitler (IP/saat
 * 10, global/24s 500) → `validateTargetUrl` (SSRF matrisi, Görev 7) →
 * `fetchScanTargets` → `runGeoScan` (Görev 6) → `crypto.randomUUID()` →
 * `insertScan` → 200. Desen contact route'unu (`src/app/api/contact/route.ts`)
 * izler: aynı Turnstile yardımcısı (`verifyTurnstile`), aynı D1 erişim
 * biçimi (`getCloudflareContext`, booking route'unun deseni).
 *
 * Turnstile burada contact/booking'in aksine KOŞULSUZ — `turnstileEnabled()`
 * bayrağı (ADR-028) bu rotayı kapsamaz. O bayrak yalnız Cloudflare'in
 * challenge sunucusundaki geçici bir DNS arızasına karşı iki mevcut formu
 * ayakta tutmak için var; bu araç sayfası Turnstile'sız hiç render edilmez
 * (spec §5), o yüzden token şemada zorunlu (`geoScanSchema`) ve doğrulama
 * her istekte çalışır.
 */
import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { geoScanSchema } from "@/lib/schemas/tools";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { validateTargetUrl, fetchScanTargets } from "@/lib/tools/geo/safe-fetch";
import { runGeoScan } from "@/lib/tools/geo/engine";
import { insertScan, countScansSince, hashClientIp } from "@/lib/tools/geo/repository";
import { reportError } from "@/lib/observability/report";

export const runtime = "nodejs";

// `cloudflare-env.d.ts` yereldeki `wrangler types` çıktısı, repoya girmiyor
// (booking route'larındaki aynı gerekçe) — üç alanı burada dar tanımlıyoruz.
// GEO araçları rezervasyonun kurduğu AYNI D1 veritabanını kullanıyor
// (repository.ts başlık yorumu), bu yüzden binding adı da AYNI: `BOOKINGS_DB`.
type GeoScanEnv = { BOOKINGS_DB: D1Database };

type GeoScanErrorCode =
  | "invalid-url"
  | "rate-limited"
  | "target-unreachable"
  | "turnstile-failed"
  // 5. kod — brief'in kapalı dört-kod sözlüğünü bilinçli genişletir.
  // Sunucu-tarafı yapılandırma/altyapı hatalarını (bkz. aşağıdaki iki
  // kullanım) istemciye SIZDIRMADAN tek bir opak koda toplar.
  | "misconfigured";

function errorResponse(error: GeoScanErrorCode, status: number): Response {
  return NextResponse.json({ error }, { status });
}

const IP_HOURLY_LIMIT = 10;
const GLOBAL_DAILY_LIMIT = 500;
const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

/**
 * `fetchScanTargets` içindeki `validateTargetUrl` HER yönlendirme hop'una
 * taze bir 10 sn zaman aşımı veriyor (safe-fetch.ts, Görev 7 tasarım
 * kararı: ara adımları da SSRF'e karşı doğrulamak için). En kötü durumda
 * (3 yönlendirme) bu ~40 sn'ye kadar birikebilir — tek bir yavaş/kötü
 * niyetli hedef isteği anormal uzun süre açık tutabilir (G7 gözlemi,
 * progress.md "Task 9-carry"). Rota bu birikmeyi kendi üst sınırıyla keser:
 * toplam tarama işi (sayfa + robots.txt + llms.txt getirme) ~20 sn içinde
 * bitmezse hedef erişilemez sayılır — `fetchScanTargets`'ın kendi
 * `Error("target-unreachable")` fırlatmasıyla AYNI sonuca (502) düşer.
 */
const SCAN_TIME_BUDGET_MS = 20_000;

// `Promise.race` tek başına `work` kazandığında zamanlayıcıyı temizlemez —
// yanıt dönüldükten sonra bile 20 sn'ye kadar askıda bir `setTimeout` kalır
// (Workers isolate'inde yararsız bir referans). `clearTimeout` ile `work`
// hangi taraf kazanırsa kazansın öbür tarafın izi silinir.
function withTimeBudget<T>(work: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("scan-time-budget-exceeded")), ms);
    work.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      },
    );
  });
}

export async function POST(req: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse("invalid-url", 400);
  }

  const parsed = geoScanSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("invalid-url", 400);
  }
  const data = parsed.data;

  const ip = req.headers.get("cf-connecting-ip") ?? "unknown";

  const turnstileOk = await verifyTurnstile(data.turnstileToken, ip);
  if (!turnstileOk) {
    return errorResponse("turnstile-failed", 400);
  }

  // KVKK: ham IP hiçbir yerde saklanmaz — yalnız SHA-256(ip + gizli tuz)
  // hash'i (repository.ts). Tuz `TOOL_IP_SALT` sırrı eksikse (veya boşsa)
  // tuzsuz SHA-256(IP) 32-bit IPv4 uzayında rainbow-table ile ANINDA geri
  // çevrilir — bu, ham IP saklamakla eşdeğerdir ve "ham IP saklanmaz"
  // gereksinimini sessizce sıfırlar. Fail-closed: kod tabanı emsali
  // `src/app/api/cron/route.ts` (CRON_SECRET yoksa TÜM istekler reddedilir)
  // — aynı duruş burada da izlenir. Üretimde sır `wrangler secret put
  // TOOL_IP_SALT` ile girilir (README).
  const salt = process.env.TOOL_IP_SALT;
  if (!salt) {
    reportError(new Error("TOOL_IP_SALT is not configured"), {
      route: "tools/geo-scan",
      step: "config",
    });
    return errorResponse("misconfigured", 500);
  }
  const ipHash = await hashClientIp(ip, salt);

  const { env } = getCloudflareContext();
  const db = (env as unknown as GeoScanEnv).BOOKINGS_DB;

  const now = new Date();
  const hourAgo = new Date(now.getTime() - HOUR_MS).toISOString();
  const dayAgo = new Date(now.getTime() - DAY_MS).toISOString();

  const [ipCount, globalCount] = await Promise.all([
    countScansSince(db, ipHash, hourAgo),
    countScansSince(db, null, dayAgo),
  ]);
  if (ipCount >= IP_HOURLY_LIMIT || globalCount >= GLOBAL_DAILY_LIMIT) {
    return errorResponse("rate-limited", 429);
  }

  const validated = validateTargetUrl(data.url);
  if (!validated.ok) {
    return errorResponse("invalid-url", 400);
  }

  let targets;
  try {
    targets = await withTimeBudget(fetchScanTargets(validated.url), SCAN_TIME_BUDGET_MS);
  } catch (err) {
    reportError(err, { route: "tools/geo-scan", step: "fetch" });
    return errorResponse("target-unreachable", 502);
  }

  const partial = runGeoScan({
    url: data.url,
    pageHtml: targets.pageHtml,
    robotsTxt: targets.robotsTxt,
    llmsTxt: targets.llmsTxt,
  });

  const id = crypto.randomUUID();
  const scannedAt = new Date().toISOString();
  const result = { id, scannedAt, ...partial };

  try {
    await insertScan(db, {
      id,
      url: result.url,
      totalScore: result.totalScore,
      band: result.band,
      checksJson: JSON.stringify(result.checks),
      clientIpHash: ipHash,
    });
  } catch (err) {
    // Try/catch olmadan bir D1 yazma hatası burada yakalanmadan fırlar —
    // rota çöker ve istemci JSON gövdesi yerine framework'ün genel HTML
    // hata sayfasını alır, `{error:...}` sözleşmesi tamamen bozulur.
    reportError(err, { route: "tools/geo-scan", step: "insert" });
    return errorResponse("misconfigured", 500);
  }

  return NextResponse.json({ id, result }, { status: 200 });
}
