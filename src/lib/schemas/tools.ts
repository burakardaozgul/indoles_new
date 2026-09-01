import { z } from "zod";

/**
 * GEO tarama isteği şeması — `POST /api/tools/geo-scan`. Spec §4, Görev 9.
 *
 * `url`: yalnız "bir URL gibi görünüyor mu" sorusuna cevap verir. "Taranmasına
 * izin var mı" sorusu (SSRF matrisi) burada DEĞİL, rotada AYRI ve ZORUNLU bir
 * ikinci geçişte (`validateTargetUrl`, Görev 7) sorulur — ikisi karıştırılmaz.
 *
 * `turnstileToken`: bu araçta Turnstile ZORUNLU — contact/booking'in aksine
 * (ADR-028 bayrağı, Cloudflare'in challenge sunucusundaki DNS arızası
 * nedeniyle o iki formda koşullu hale geldi) bu form Turnstile'sız hiç
 * render edilmez (spec §5: "iki formda da görünmez Turnstile"), o yüzden
 * alan burada `min(1)` ile zorunlu, contact'taki gibi `.optional()` değil.
 */
export const geoScanSchema = z.object({
  url: z.string().url().max(2048),
  turnstileToken: z.string().min(1),
});

export type GeoScanPayload = z.infer<typeof geoScanSchema>;
