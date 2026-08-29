/**
 * Cloudflare Cron Trigger'ın gerçekte çağırdığı olay Worker'ın
 * `scheduled(event, env, ctx)`'i — `src/app/api/cron/route.ts`'teki HTTP
 * `GET` rotası DEĞİL (gerekçe orada). `custom-worker.ts` bu olayı ekleyen
 * sarmalayıcı, ama o dosya `.open-next/worker.js`'e bağımlı (yalnız
 * `pnpm cf:build` sonrası var olur) ve bu yüzden vitest'te doğrudan import
 * edilemez.
 *
 * Bu modül o bağımlılığı taşımadığı için test edilebilir: `custom-worker.ts`
 * ince bir tel olarak kalır (yalnız `ctx.waitUntil` ile burayı çağırır),
 * gerçek mantık — hata durumunda `reportError`'a düşüp fırlatmama — burada
 * yaşar. Hem bu hem `route.ts`'teki `GET` AYNI `runDailyCronJob`'u çağırır;
 * iki kopya mantık yok.
 */

import { runDailyCronJob, type CronEnv } from "./cron-job";
import { reportError } from "@/lib/observability/report";

/**
 * `ctx.waitUntil(runForScheduledEvent(env))` ile çağrılmak üzere tasarlandı.
 *
 * Döndürülen promise ASLA reddetmez: `waitUntil`'e verilen bir promise
 * reddederse Cloudflare bunu "yakalanmamış istisna" olarak loglar — burada
 * zaten `route.ts`'in yaptığı gibi `reportError` ile kaydedip yutuyoruz,
 * ekstra gürültü çıkarmıyoruz.
 */
export async function runForScheduledEvent(env: CronEnv): Promise<void> {
  try {
    await runDailyCronJob(env);
  } catch (err) {
    reportError(err, { route: "cron-scheduled", step: "run" });
  }
}
