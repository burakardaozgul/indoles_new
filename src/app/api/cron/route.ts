import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { runDailyCronJob, type CronEnv } from "@/lib/booking/cron-job";
import { reportError } from "@/lib/observability/report";

export const runtime = "nodejs";

/**
 * Cloudflare'in Cron Trigger'ı Worker'ın `scheduled(event, env, ctx)`
 * olayını çağırır — bu HTTP rotasını DEĞİL. Yani bu `GET` uç noktası,
 * varlığı bilinen herkes tarafından internetten doğrudan çağrılabilir; bu
 * gerçek, Cron Trigger'ın kendisinden bağımsız. Tek koruma bu sır kontrolü.
 *
 * Sır yoksa (yanlış yapılandırma) TÜM istekler reddedilir — "kontrol
 * atlanır, herkese açık kalır" değil, güvenli tarafta kalınır.
 * `wrangler secret put CRON_SECRET` ile tanımlanır, repoya yazılmaz.
 */
function isAuthorized(req: Request): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  return req.headers.get("x-cron-secret") === expected;
}

export async function GET(req: Request): Promise<Response> {
  if (!isAuthorized(req)) {
    return NextResponse.json(
      { ok: false, reason: "unauthorized" },
      { status: 401 }
    );
  }

  const { env } = getCloudflareContext();
  try {
    // "http": bu rota Cloudflare'in Cron Trigger'ı DEĞİL, elle veya dış bir
    // sistemden atılan bir HTTP isteği ile çağrılıyor — gözlemlenebilirlik
    // özetinde gerçek zamanlanmış çalışmadan ayırt edilebilmesi için sabit
    // geçiriliyor.
    const result = await runDailyCronJob(env as unknown as CronEnv, "http");
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    reportError(err, { route: "cron", step: "run" });
    return NextResponse.json(
      { ok: false, reason: "internal_error" },
      { status: 500 }
    );
  }
}
