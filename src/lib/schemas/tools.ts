import { z } from "zod";
import { KnownMetricsSchema } from "@/lib/tools/diagnoo/schema";

/**
 * GEO tarama isteği şeması — `POST /api/tools/geo-scan`. Spec §4, Görev 9.
 *
 * `url`: yalnız "bir URL gibi görünüyor mu" sorusuna cevap verir. "Taranmasına
 * izin var mı" sorusu (SSRF matrisi) burada DEĞİL, rotada AYRI ve ZORUNLU bir
 * ikinci geçişte (`validateTargetUrl`, Görev 7) sorulur — ikisi karıştırılmaz.
 *
 * `turnstileToken`: final review (C1) düzeltmesi — contact/booking'in izlediği
 * AYNI koşullu desen (ADR-028, `src/lib/security/anti-spam.ts`). Görev 9'un
 * ilk halinde bu alan `min(1)` ile KOŞULSUZ zorunluydu ("araç Turnstile'sız
 * hiç render edilmez" varsayımıyla) — ama ADR-028 bayrağı
 * (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`) launch konfigürasyonunda KAPALI
 * (Cloudflare'in challenge sunucusu IPv4-only ağlarda çözülmüyor,
 * `.env.example`). Bayrak kapalıyken istemci hiç token göndermiyordu ve
 * `safeParse` her geçerli URL'i "invalid-url" olarak reddediyordu — kullanıcı
 * URL'i suçlanıyordu, sunucu konfigürasyonu suçlu olduğu halde. Alan artık
 * contact'taki gibi `.optional()`; doğrulama rotada `turnstileEnabled()`
 * bayrağına göre KOŞULLU çalışır.
 *
 * `website`/`elapsedMs`: bal küpü + süre tuzağı — Turnstile bayrağı KAPALIYKEN
 * devreye giren ikincil savunma (`spamSignal()`, anti-spam.ts). Alan adları
 * contact şemasıyla (`src/lib/schemas/contact.ts`) BİREBİR aynı — `spamSignal`
 * bu adları bekler.
 */
export const geoScanSchema = z.object({
  url: z.string().url().max(2048),
  turnstileToken: z.string().optional(),
  /** Bal küpü — insanlar görmez, botlar doldurur. */
  website: z.string().optional(),
  /** Formun yüklenmesinden gönderime geçen süre (ms). Yokluğu bot işaretidir. */
  elapsedMs: z.number().int().nonnegative().optional(),
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
 * `turnstileToken`: geo-scan'deki gibi final review (C1) ile `.optional()`e
 * çevrildi — ADR-028 bayrağı bu rotayı da kapsar artık (aynı gerekçe, geo-scan
 * şemasının başlık yorumuna bkz).
 *
 * `website`/`elapsedMs`: bal küpü + süre tuzağı — geo-scan şemasıyla AYNI
 * alan adları, AYNI amaç.
 *
 * `locale`: rapor e-postası bu dilde gider — form hangi locale sayfasından
 * geldiyse o dil (controller ruling, Görev 12). Kapalı `enum`: `de`, `fr` gibi
 * desteklenmeyen bir değer 400 olur, e-posta dili hiç belirsiz kalmaz.
 */
export const geoReportSchema = z.object({
  scanId: z.string().uuid(),
  email: z.string().email(),
  kvkkConsent: z.literal(true),
  turnstileToken: z.string().optional(),
  locale: z.enum(["tr", "en"]),
  website: z.string().optional(),
  elapsedMs: z.number().int().nonnegative().optional(),
});

export type GeoReportPayload = z.infer<typeof geoReportSchema>;

/**
 * Teşhis başlatma isteği şeması — `POST /api/tools/diagnoo-start`. Spec §9,
 * Görev 12.
 *
 * `url`: GEO'daki gibi yalnız "URL gibi görünüyor mu" — SSRF/erişilebilirlik
 * kontrolü burada yapılmaz, teşhis pipeline'ının kendi tarama katmanına aittir.
 *
 * `turnstileToken`: Görev 17 (task-17) düzeltmesi — contact/GEO'nun izlediği
 * AYNI koşullu desen (ADR-028, ADR-032). İlk halinde bu alan `min(1)` ile
 * KOŞULSUZ zorunluydu ("araç Turnstile'sız hiç render edilmez" varsayımıyla)
 * — ama ADR-028 bayrağı (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`) launch
 * konfigürasyonunda KAPALI. Bayrak kapalıyken istemci hiç token
 * göndermiyordu ve `safeParse` her geçerli URL'i reddediyordu. Alan artık
 * contact/GEO'daki gibi `.optional()`; doğrulama rotada `turnstileEnabled()`
 * bayrağına göre KOŞULLU çalışır.
 *
 * `website`/`elapsedMs`: bal küpü + süre tuzağı — Turnstile bayrağı
 * KAPALIYKEN devreye giren ikincil savunma (`spamSignal()`, anti-spam.ts).
 * Alan adları contact/GEO şemalarıyla BİREBİR aynı — `spamSignal` bu adları
 * bekler.
 */
export const diagnooStartSchema = z.object({
  url: z.string().url().max(2048),
  locale: z.enum(["tr", "en"]),
  turnstileToken: z.string().optional(),
  /** Bal küpü — insanlar görmez, botlar doldurur. */
  website: z.string().optional(),
  /** Formun yüklenmesinden gönderime geçen süre (ms). Yokluğu bot işaretidir. */
  elapsedMs: z.number().int().nonnegative().optional(),
});

export type DiagnooStartPayload = z.infer<typeof diagnooStartSchema>;

/**
 * Kilit açma (unlock) isteği şeması — `POST /api/tools/diagnoo-unlock`.
 * Spec §10, Görev 12.
 *
 * `diagnosticId`: kilidi açılacak teşhisin kimliği (`crypto.randomUUID`,
 * diagnoo-start) — `.uuid()` ile biçimi bozuk bir kimlik DB'ye gitmeden 400 olur.
 *
 * `kvkkConsent`: `z.literal(true)` — GEO'daki `geoReportSchema` ile AYNI kapı
 * mantığı: `createLead` veri katmanı rızayı doğrulamaz, rıza burada zorunlu
 * kılınır; `false`/eksik rıza `safeParse`te düşer, `createLead` HİÇ çağrılmaz.
 *
 * `knownMetrics`: opsiyonel — ziyaretçi gerçek metrik girerse finansal projeksiyon
 * `recomputeWithKnownMetrics` ile yeniden hesaplanır (Görev 10).
 *
 * `turnstileToken`: `diagnooStartSchema`'daki gibi Görev 17 ile `.optional()`e
 * çevrildi — ADR-028 bayrağı bu rotayı da kapsar artık (aynı gerekçe, yukarıdaki
 * şemanın başlık yorumuna bkz).
 *
 * `website`/`elapsedMs`: bal küpü + süre tuzağı — `diagnooStartSchema` ile
 * AYNI alan adları, AYNI amaç.
 */
export const diagnooUnlockSchema = z.object({
  diagnosticId: z.string().uuid(),
  email: z.string().email(),
  company: z.string().min(2).max(120),
  fullName: z.string().max(120).optional(),
  knownMetrics: KnownMetricsSchema.optional(),
  kvkkConsent: z.literal(true),
  turnstileToken: z.string().optional(),
  website: z.string().optional(),
  elapsedMs: z.number().int().nonnegative().optional(),
});

export type DiagnooUnlockPayload = z.infer<typeof diagnooUnlockSchema>;
