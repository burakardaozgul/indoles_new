import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * OpenNext — Cloudflare Workers adaptörü (ADR-024).
 *
 * Yapılandırma bilinçli olarak boş: bu site **SSG**. 124 URL'in tamamı build
 * anında üretiliyor, ISR/on-demand revalidation kullanılmıyor (ADR-006 —
 * içerik statik TS + MDX, ADR-010 — DB yok). Dolayısıyla adaptörün R2
 * incremental cache, Durable Object queue ve tag cache katmanlarına ihtiyaç
 * yok; eklemek kurulmamış altyapıya bağımlılık ve gereksiz maliyet üretirdi.
 *
 * Sunucuda çalışan tek şey iki route handler (`/api/contact`,
 * `/api/visitor-profile`) ve metadata rotaları (robots, sitemap, llms.txt,
 * opengraph-image) — hepsi istek başına çalışıyor, önbellek katmanı
 * gerektirmiyor.
 *
 * Bu dosya, ISR devreye girdiği gün genişletilmeli: o durumda
 * `incrementalCache` + `queue` tanımlanmadan revalidation sessizce çalışmaz.
 */
export default defineCloudflareConfig();
