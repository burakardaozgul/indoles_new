import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

/**
 * OpenNext — Cloudflare Workers adaptörü (ADR-024).
 *
 * `incrementalCache` **tanımlanmak zorunda**, site tamamen SSG olsa bile.
 * Adaptör önceden üretilmiş HTML'i de bu katmandan okuyor; katman yoksa her
 * istek sayfayı Worker içinde yeniden render ediyor. Ölçüldü: cache
 * tanımsızken TTFB 703 ms / FCP 1332 ms (lokal `next start`: 66 / 236 ms) ve
 * HTML yanıtı `no-store` ile geliyordu — 141 önceden üretilmiş sayfanın
 * hiçbiri statik olarak servis edilmiyordu.
 *
 * `static-assets-incremental-cache` seçildi çünkü adaptörün kendi tanımı bu
 * durumu tarif ediyor: "yeniden doğrulama istemeyen ve yalnız önceden
 * üretilmiş veri sunan uygulamalar". Site ISR kullanmıyor (ADR-006 statik
 * içerik + ADR-010 DB yok), dolayısıyla R2 veya KV kurmak kurulmamış
 * altyapıya bağımlılık ve gereksiz maliyet olurdu; HTML zaten Workers
 * Assets'te duruyor.
 *
 * **ISR/on-demand revalidation devreye girerse bu satır yetmez:** o durumda
 * `r2IncrementalCache` + bir kuyruk (queue) gerekir, yoksa yeniden doğrulama
 * sessizce çalışmaz.
 */
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
