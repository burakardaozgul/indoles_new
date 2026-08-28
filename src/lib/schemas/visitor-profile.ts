import { z } from 'zod';

export const visitorProfileSchema = z.object({
  persona: z.enum(['donusum-teknoloji', 'buyume-pazarlar']),
  problems: z.array(z.string().min(1)).length(3),
  lead: z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    phone: z.string().regex(/^\+?[0-9\s-]{7,}$/),
    email: z.string().email(),
    company: z.string().min(2),
    title: z.string().min(2),
  }),
  submissionType: z.enum(['booking', 'contact']),
  kvkkConsent: z.literal(true),
  locale: z.enum(['tr', 'en']),
  utm: z.object({
    source: z.string().optional(),
    medium: z.string().optional(),
    campaign: z.string().optional(),
  }).optional(),
  preferredSlot: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    time: z.string().regex(/^\d{2}:\d{2}$/),
  }).optional(),
  /** Turnstile bayrakla devre dışı olabilir (ADR-028); doğrulama rotada koşullu. */
  turnstileToken: z.string().optional(),
  /** Popup'ın açılışından gönderime geçen süre (ms). Yokluğu bot işaretidir. */
  elapsedMs: z.number().int().nonnegative().optional(),
});

export type VisitorProfilePayload = z.infer<typeof visitorProfileSchema>;
