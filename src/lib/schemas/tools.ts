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

/**
 * Detaylı rapor isteği şeması — `POST /api/tools/geo-report`. Spec §3, Görev 12.
 *
 * `scanId`: kilidi açılacak taramanın kimliği (`crypto.randomUUID`, Görev 9),
 * bu yüzden `.uuid()` — biçimi bozuk bir kimlik daha DB'ye gitmeden 400 olur.
 *
 * `kvkkConsent`: `z.literal(true)` — KVKK rıza kapısının BİRİNCİ savunması.
 * `insertLead` veri katmanı rızayı doğrulamaz (Görev 8 reviewer notu: `kvkk_consent = 1`
 * sabitini yazar, çağıranın rızayı zaten zorunlu kıldığını varsayar); rıza bu
 * şemada zorunlu kılınır, dolayısıyla `false`/eksik rıza `safeParse`te düşer ve
 * `insertLead` HİÇ çağrılmaz — rızasız hiçbir lead yazılmaz.
 *
 * `turnstileToken`: geo-scan'deki gibi KOŞULSUZ zorunlu (rapor formu da
 * görünmez Turnstile taşır, ADR-028 bayrağı bu rotayı da kapsamaz).
 *
 * `locale`: rapor e-postası bu dilde gider — form hangi locale sayfasından
 * geldiyse o dil (controller ruling, Görev 12). Kapalı `enum`: `de`, `fr` gibi
 * desteklenmeyen bir değer 400 olur, e-posta dili hiç belirsiz kalmaz.
 */
export const geoReportSchema = z.object({
  scanId: z.string().uuid(),
  email: z.string().email(),
  kvkkConsent: z.literal(true),
  turnstileToken: z.string().min(1),
  locale: z.enum(["tr", "en"]),
});

export type GeoReportPayload = z.infer<typeof geoReportSchema>;
