import { z } from "zod";

/**
 * Rezervasyon POST gövdesi.
 *
 * Alan seti KVKK minimizasyonundan (spec §2.2b) daha geniş: `lead`, `persona`
 * ve `problems` mail ve Calendar açıklaması için toplanıyor, ama veritabanına
 * yalnız ad ve e-posta gidiyor — ayrım rotada yapılır, burada değil.
 *
 * `source` iki gerçek çağıranı ayırt eder: `popup` (Stage1/Stage2 problem
 * seçimi var, `problems` tam 3 gerçek seçim) ve `contact` (`/iletisim`in
 * gömülü rezervasyon yüzeyi, problem seçimi HİÇ yok). Önceden `problems`
 * her yerde tam 3 string istiyordu; `contact` çağıranı bunu karşılamak için
 * üç uydurma dize gönderiyordu (`["İletişim sayfası", ...]`) — bu dizeler
 * Burak'ın bildirim mailinde ve Calendar açıklamasında gerçek bir problem
 * seçimiymiş GİBİ görünüyordu. Şema artık gerçeği ifade ediyor: kısıt
 * `source`a bağlı, `superRefine` ile kuruluyor (aşağıda). Popup'ın önceki
 * garantisi (tam 3) ZAYIFLAMADI — yalnız artık `source === "popup"` şartına
 * bağlı, çünkü tek çağıran zaten hep popup'tı.
 */
export const bookingSchema = z
  .object({
    startsAtUtc: z.string().datetime(),
    visitorTimezone: z.string().min(1),
    locale: z.enum(["tr", "en"]),
    lead: z.object({
      firstName: z.string().min(2),
      lastName: z.string().min(2),
      phone: z.string().regex(/^\+?[0-9\s-]{7,}$/),
      email: z.string().email(),
      company: z.string().min(2),
      title: z.string().min(2),
    }),
    persona: z.enum(["donusum-teknoloji", "buyume-pazarlar"]),
    /** Uzunluk kısıtı burada YOK — `source`a bağlı olduğu için `superRefine`da. */
    problems: z.array(z.string().min(1)),
    source: z.enum(["popup", "contact"]),
    kvkkConsent: z.literal(true),
    /** ADR-028: Turnstile bayrağa bağlı, doğrulama rotada koşullu. */
    turnstileToken: z.string().optional(),
    /** Bal küpü — dolu gelirse sahte başarı döner. */
    website: z.string().optional(),
    elapsedMs: z.number().int().nonnegative().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.source === "popup" && data.problems.length !== 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Popup kaynaklı rezervasyon tam 3 problem seçimi gerektirir.",
        path: ["problems"],
      });
    }
    if (data.source === "contact" && data.problems.length !== 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "İletişim kaynaklı rezervasyonda problem seçimi olamaz — Stage1/Stage2 orada yok.",
        path: ["problems"],
      });
    }
  });

export type BookingPayload = z.infer<typeof bookingSchema>;

/**
 * Erteleme (PATCH /api/booking/:token) gövdesi.
 *
 * POST'un `bookingSchema.safeParse` disiplini PATCH'e taşınmamıştı (Görev 7
 * denetim bulgusu B5): ham `body.startsAtUtc` doğrudan `isLegitimateSlot`
 * içindeki `new Date(...)`'e gidiyordu — "banana" gibi tarih olarak anlamsız
 * ama boş olmayan bir string, hiçbir `try/catch`in yakalamadığı bir
 * `RangeError: Invalid time value` fırlatıyordu (400 değil). Bu doğrulama
 * DB sorgusundan (token arama) önce çalıştığı için geçerli bir `cancel_token`
 * bile gerekmiyordu — herhangi bir istek bu çökmeyi tetikleyebiliyordu.
 */
export const rescheduleSchema = z.object({
  startsAtUtc: z.string().datetime(),
});

export type ReschedulePayload = z.infer<typeof rescheduleSchema>;
