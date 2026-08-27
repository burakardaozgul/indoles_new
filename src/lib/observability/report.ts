/**
 * Hata raporlama tek noktadan.
 *
 * Sentry kaldırıldı (ADR-027): SDK kuruluydu ama `Sentry.init` hiçbir yerde
 * çağrılmıyordu — denetim O-03'te kayıtlı. Yani paket boyutunu şişirirken tek
 * bir hata bile göndermiyordu. Worker 3 MB sınırına dayandığında bu ölü ağırlık
 * ilk çıkarılan oldu.
 *
 * `console.error` bir gerileme değil: `wrangler.jsonc`'de observability açık,
 * dolayısıyla bu kayıtlar Cloudflare panelinde aranabilir durumda duruyor —
 * Sentry'nin fiilen yaptığından fazlası.
 */
export function reportError(
  error: unknown,
  context: { route: string; step: string } & Record<string, string>,
): void {
  const tags = Object.entries(context)
    .map(([k, v]) => `${k}=${v}`)
    .join(' ');
  console.error(`[hata] ${tags} ::`, error);
}
