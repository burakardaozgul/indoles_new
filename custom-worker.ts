/**
 * Cloudflare için özel Worker sarmalayıcısı.
 *
 * SORUN: OpenNext'in `pnpm cf:build` ile ürettiği `.open-next/worker.js`
 * yalnız `fetch` export eder. Cloudflare'in Cron Trigger'ı ise deploy
 * edilen Worker'ın `scheduled(event, env, ctx)` olayını çağırır — bu ikisi
 * bağlanmadan `wrangler.jsonc`'deki `triggers.crons` GERÇEKTE ateşlenmez ve
 * hiçbir şey bulmaz (90 günlük KVKK silmesi, "completed" geçişi, öksüz
 * randevu raporu, OAuth canlılık sorgusu — hiçbiri çalışmaz).
 *
 * ÇÖZÜM: resmi "custom worker" kalıbı —
 * https://opennext.js.org/cloudflare/howtos/custom-worker (context7
 * @opennextjs/cloudflare ile 2026-08-29'da doğrulandı). Bu dosya
 * `.open-next/worker.js`'in `fetch`ini olduğu gibi devrediyor, `scheduled`
 * ekliyor, üç Durable Object sınıfını yeniden export ediyor. `wrangler.jsonc`
 * `main` artık `.open-next/worker.js` değil BU dosyayı gösteriyor.
 *
 * NEDEN `.ts` AMA tsconfig.json'un DIŞINDA (bkz. `exclude`):
 * 1) `.open-next/worker.js` yalnız `pnpm cf:build` sonrası var olur, depoda
 *    durmaz (.gitignore). Temiz bir checkout'ta `pnpm typecheck` bu dosyayı
 *    programa alırsa kırılırdı.
 * 2) Bu depo `@cloudflare/workers-types`'ı BİLEREK kurmuyor (Görev 4
 *    ruling'i, bkz. `src/lib/booking/d1.d.ts`): üretilen `cloudflare-env.d.ts`
 *    dört test dosyasında typecheck hatası doğuruyordu. Yani `ExportedHandler`,
 *    `ScheduledController`, `ExecutionContext` gibi ambient Workers tipleri bu
 *    projede YOK — resmi örnekteki `satisfies ExportedHandler<CloudflareEnv>`
 *    burada kullanılamaz.
 * Çözüm ikisi için de aynı: `next.config.ts` / `sst.config.ts` gibi diğer kök
 * yapılandırma dosyalarıyla AYNI desen — tsconfig `exclude`'a eklenmek.
 * Wrangler'ın kendi esbuild tabanlı derlemesi (main olarak okuduğunda) bu
 * dosyayı `tsc`den bağımsız, sorunsuz derler.
 *
 * Gerçek mantık burada YOK: `scheduled` yalnız `runForScheduledEvent`'i
 * çağırıyor (`src/lib/booking/scheduled-cron.ts`) — o da `route.ts`'teki
 * `GET` ile AYNI `runDailyCronJob`'u çağırıyor (`src/lib/booking/cron-job.ts`).
 * İki kopya mantık yok. Bu dosya `.open-next/worker.js`'e bağımlı olduğu
 * için vitest'te doğrudan test edilemez — gerçek mantık bu yüzden testi
 * mümkün olan `scheduled-cron.ts`'e taşındı.
 *
 * `/api/cron` HTTP rotası SİLİNMEDİ: elle tetikleme ve canlı doğrulama için
 * duruyor. O rotanın `CRON_SECRET` kontrolü kendi içinde kalıyor — Cloudflare
 * Cron Trigger'ın kendisi HTTP'den değil doğrudan `scheduled()`'dan geldiği
 * için bu dosya hiçbir sır kontrolüne tabi DEĞİL (platform zaten yalnız
 * Cloudflare'in kendisi tarafından tetiklenir).
 */

// @ts-ignore `.open-next/worker.js` yalnız `pnpm cf:build` sonrası var olur, depoda durmaz
import { default as handler, DOQueueHandler, DOShardedTagCache, BucketCachePurge } from "./.open-next/worker.js";
import { runForScheduledEvent } from "./src/lib/booking/scheduled-cron";
import type { CronEnv } from "./src/lib/booking/cron-job";
// @ts-ignore "cloudflare:workers" ambient modül — wrangler'ın esbuild derlemesi bunu
// çözer, tsc bu dosyayı hiç görmüyor (yukarıdaki başlık yorumuna bkz.).
import { WorkflowEntrypoint, type WorkflowEvent, type WorkflowStep } from "cloudflare:workers";
import { runDiagnosticPipeline, type PipelineEnv } from "./src/lib/tools/diagnoo/pipeline";

export default {
  // Next.js/OpenNext'in ürettiği fetch işleyicisi OLDUĞU GİBİ devrediliyor —
  // bu dosya HTTP tarafına hiç dokunmuyor.
  fetch: handler.fetch,

  // Cloudflare Cron Trigger BUNU çağırır. `getCloudflareContext()` burada
  // ÇALIŞMAZ — Next.js isteği yok, onu kuran AsyncLocalStorage bağlamı da
  // yok; `env` platform tarafından doğrudan parametre olarak geliyor
  // (`runDailyCronJob` tam bunun için `env`i argüman alacak şekilde yazıldı).
  async scheduled(
    _event: unknown,
    env: CronEnv,
    ctx: { waitUntil(promise: Promise<unknown>): void }
  ) {
    // `ctx.waitUntil` ZORUNLU: çağrılmazsa Workers bu async işi beklemeden
    // çalışmayı keser, iş yarıda kalır.
    ctx.waitUntil(runForScheduledEvent(env));
  },
};

// Üç Durable Object sınıfı da yeniden export EDİLMEK ZORUNDA: `main` bu üçünü
// export etmezse (OpenNext'in ürettiği worker.js her zaman eder) DO
// binding'leri kırılır ve deploy patlar — gözden kaçması en kolay, en
// pahalı hata.
export { DOQueueHandler, DOShardedTagCache, BucketCachePurge };

/**
 * Diagnoo teşhis pipeline'ının Cloudflare Workflow entrypoint'i (ADR-032).
 *
 * NEDEN BURADA: tek Worker, tek wrangler projesi — `wrangler.jsonc`'nin
 * `workflows` binding'i `class_name` ile BU dosyadaki bir export'u arıyor,
 * ikinci bir script/deploy hedefi açmıyoruz. Kalıp `scheduled` ile birebir
 * aynı: entrypoint burada ince bir sarmalayıcı, gerçek mantık `src/`
 * içinde env-parametreli, birim testli bir fonksiyonda yaşıyor
 * (`src/lib/tools/diagnoo/pipeline.ts` → `runDiagnosticPipeline`). Bu sınıf
 * `.open-next/worker.js` ve `cloudflare:workers`'a bağımlı olduğu için
 * vitest'te doğrudan test edilemez — `pipeline.test.ts` `StepRunner`'ın
 * yapısal bir sahte'siyle (mock) tüm adım sırasını ve hata yollarını
 * doğrular.
 *
 * `WorkflowEntrypoint<unknown, ...>`: bu depo `@cloudflare/workers-types`'ı
 * bilerek kurmuyor (bkz. dosya başlığı), o yüzden `Env` jenerik parametresi
 * gerçek bir binding tipiyle daraltılamıyor — `this.env`'i `pipeline.ts`'in
 * beklediği `PipelineEnv`'e elle cast ediyoruz.
 */
export class DiagnooDiagnosticWorkflow extends WorkflowEntrypoint<unknown, { diagnosticId: string }> {
  async run(event: WorkflowEvent<{ diagnosticId: string }>, step: WorkflowStep): Promise<void> {
    await runDiagnosticPipeline(this.env as unknown as PipelineEnv, step, event.payload.diagnosticId);
  }
}
