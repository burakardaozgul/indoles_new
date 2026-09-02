/**
 * Diagnoo'nun sayfa yüzeyiyle motor arasındaki kimlik sözleşmesi.
 *
 * `DiagnooSignalId` tam olarak `computeHealthScore` (`report.ts`) içindeki
 * dört skor boyutudur — ne eksik ne fazla. GEO'daki `GeoCheckId` ile aynı
 * gerekçe: sayfada tanıtılan sinyal, motorun gerçekten puanladığı kalemin
 * kimliğini taşımak zorunda; hayali bir sinyal tip hatası verir.
 *
 * Ağırlıklar (`tools.ts` kaydında yazılı, `tools-content.test` ile korunur):
 * semantic 25 · ux 25 (bilişsel yük 12,5 + eylem çağrısı 12,5) ·
 * speed-funnel 30 · tracking 20. Ödeme adımı sürtünmesi ayrı bir sinyal
 * değil — motorda hız boyutunun içinde raporlanır, sayfada da orada anlatılır.
 */

/** Araç kaydının kararlı TR slug'ı — iki dilde de aynı (marka adı). */
export const DIAGNOO_SLUG = "diagnoo";

export type DiagnooSignalId = "semantic" | "ux" | "speed-funnel" | "tracking";
