import { z } from 'zod';

export type ContactLocale = 'tr' | 'en';

type ContactMessageKey =
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'phone'
  | 'company'
  | 'subject'
  | 'messageMin'
  | 'messageMax'
  | 'budgetRange'
  | 'timeline'
  | 'kvkkConsent';

/**
 * Alan bazlı doğrulama mesajları.
 *
 * Zod'un ham varsayılanı ("String must contain at least 2 character(s)") TR
 * sayfada İngilizce olarak görünüyordu. Mesajlar artık şemanın kendisinde,
 * locale'e göre kurulur; form katmanı hata metni üretmez.
 */
export const contactMessages: Record<ContactLocale, Record<ContactMessageKey, string>> = {
  tr: {
    firstName: 'En az 2 karakter.',
    lastName: 'En az 2 karakter.',
    email: 'Geçerli bir e-posta yaz.',
    phone: 'Telefonu alan koduyla yaz: +90 555 000 00 00.',
    company: 'En az 2 karakter.',
    subject: 'En az 3 karakter.',
    messageMin: 'En az 20 karakter.',
    messageMax: 'En fazla 2000 karakter.',
    budgetRange: 'Bir bütçe aralığı seç.',
    timeline: 'Bir zaman çerçevesi seç.',
    kvkkConsent: 'Göndermek için KVKK onayı gerekli.',
  },
  en: {
    firstName: 'At least 2 characters.',
    lastName: 'At least 2 characters.',
    email: 'Enter a valid email address.',
    phone: 'Include the area code: +90 555 000 00 00.',
    company: 'At least 2 characters.',
    subject: 'At least 3 characters.',
    messageMin: 'At least 20 characters.',
    messageMax: 'At most 2000 characters.',
    budgetRange: 'Select a budget range.',
    timeline: 'Select a timeframe.',
    kvkkConsent: 'KVKK consent is required to send.',
  },
};

export const BUDGET_RANGES = ['<25k', '25k-100k', '100k-250k', '250k-1m', '>1m', 'other'] as const;
export const TIMELINES = ['asap', '1-3-months', '3-6-months', 'exploring'] as const;

/** Boş alan da (`undefined`) alanın kendi mesajını basar, "Required" değil. */
function requiredString(message: string): z.ZodString {
  return z.string({ required_error: message, invalid_type_error: message });
}

/**
 * Şemayı locale'e göre kurar. Enum'larda `errorMap` kullanılır: boş placeholder
 * seçiliyken zod `invalid_enum_value` üretir ve `required_error` devreye girmez.
 */
export function buildContactSchema(locale: ContactLocale = 'tr') {
  const m = contactMessages[locale];
  return z.object({
    firstName: requiredString(m.firstName).min(2, m.firstName),
    lastName: requiredString(m.lastName).min(2, m.lastName),
    email: requiredString(m.email).email(m.email),
    phone: requiredString(m.phone).regex(/^\+?[0-9\s-]{7,}$/, m.phone),
    company: requiredString(m.company).min(2, m.company),
    subject: requiredString(m.subject).min(3, m.subject),
    message: requiredString(m.messageMin).min(20, m.messageMin).max(2000, m.messageMax),
    budgetRange: z.enum(BUDGET_RANGES, { errorMap: () => ({ message: m.budgetRange }) }),
    timeline: z.enum(TIMELINES, { errorMap: () => ({ message: m.timeline }) }),
    kvkkConsent: z.literal(true, { errorMap: () => ({ message: m.kvkkConsent }) }),
    locale: z.enum(['tr', 'en']),
    /** Turnstile bayrakla devre dışı olabilir (ADR-028); doğrulama rotada koşullu. */
    turnstileToken: z.string().optional(),
    /** Bal küpü — insanlar görmez, botlar doldurur. Doluysa rota sahte başarı döner. */
    website: z.string().optional(),
    /** Formun yüklenmesinden gönderime geçen süre (ms). Yokluğu bot işaretidir. */
    elapsedMs: z.number().int().nonnegative().optional(),
  });
}

/**
 * Sunucu tarafı şema. Mesajları kullanıcıya gösterilmez (route yalnız
 * `issues` döndürür), bu yüzden varsayılan locale ile kurulur.
 */
export const contactSchema = buildContactSchema('tr');

export type ContactPayload = z.infer<typeof contactSchema>;
