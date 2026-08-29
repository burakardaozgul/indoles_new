import { z } from "zod";

/**
 * Rezervasyon POST gövdesi.
 *
 * Alan seti KVKK minimizasyonundan (spec §2.2b) daha geniş: `lead`, `persona`
 * ve `problems` mail ve Calendar açıklaması için toplanıyor, ama veritabanına
 * yalnız ad ve e-posta gidiyor — ayrım rotada yapılır, burada değil.
 */
export const bookingSchema = z.object({
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
  problems: z.array(z.string().min(1)).length(3),
  kvkkConsent: z.literal(true),
  /** ADR-028: Turnstile bayrağa bağlı, doğrulama rotada koşullu. */
  turnstileToken: z.string().optional(),
  /** Bal küpü — dolu gelirse sahte başarı döner. */
  website: z.string().optional(),
  elapsedMs: z.number().int().nonnegative().optional(),
});

export type BookingPayload = z.infer<typeof bookingSchema>;
