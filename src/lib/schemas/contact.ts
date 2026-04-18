import { z } from 'zod';

export const contactSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[0-9\s-]{7,}$/),
  company: z.string().min(2),
  subject: z.string().min(3),
  message: z.string().min(20).max(2000),
  budgetRange: z.enum(['<25k', '25k-100k', '100k-250k', '250k-1m', '>1m', 'other']),
  timeline: z.enum(['asap', '1-3-months', '3-6-months', 'exploring']),
  kvkkConsent: z.literal(true),
  locale: z.enum(['tr', 'en']),
  turnstileToken: z.string().min(1),
});

export type ContactPayload = z.infer<typeof contactSchema>;
