import { NextResponse } from 'next/server';
import { reportError } from '@/lib/observability/report';
import { contactSchema } from '@/lib/schemas/contact';
import { verifyTurnstile } from '@/lib/security/turnstile';
import { spamSignal, turnstileEnabled } from '@/lib/security/anti-spam';
import { sendMailWithRetry, recipients } from '@/lib/mail/client';
import ContactNotification from '../../../../emails/ContactNotification';
import ContactAutoreply from '../../../../emails/ContactAutoreply';

export const runtime = 'nodejs';

export async function POST(req: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'validation', issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const data = parsed.data;

  // Sahte başarı bilinçli: 4xx dönmek bota neyin yakalandığını öğretir.
  const spam = spamSignal(data);
  if (spam) {
    console.warn(`[api/contact] spam_suspect signal=${spam}`);
    return NextResponse.json({ ok: true });
  }

  if (turnstileEnabled()) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '0.0.0.0';
    const ok = data.turnstileToken ? await verifyTurnstile(data.turnstileToken, ip) : false;
    if (!ok) {
      return NextResponse.json({ error: 'turnstile_failed' }, { status: 403 });
    }
  }

  // Satış bildirimi lead'in kendisidir: düşerse istek başarısızdır.
  try {
    await sendMailWithRetry({
      to: recipients(process.env.SALES_INBOX_EMAIL, 'digital@indoles.com.tr'),
      subject: `İletişim — ${data.subject} — ${data.firstName} ${data.lastName}`,
      react: ContactNotification(data),
    });
  } catch (err) {
    reportError(err, { route: 'contact', step: 'notification' });
    console.error('[api/contact] notification_failed:', err);
    return NextResponse.json({ error: 'mail_failed' }, { status: 500 });
  }

  // Otomatik yanıt ikincildir. İki posta tek try içindeyken autoreply hatası
  // 500 döndürüyordu: lead satışa ulaşmış olmasına rağmen kullanıcı formu
  // tekrar gönderiyor, aynı lead iki kez düşüyordu. Hata yutulur, log'a yazılır.
  try {
    await sendMailWithRetry({
      to: data.email,
      subject: data.locale === 'tr' ? 'Mesajını aldık — INDOLES' : 'We got your message — INDOLES',
      react: ContactAutoreply({ firstName: data.firstName, locale: data.locale }),
    });
  } catch (err) {
    reportError(err, { route: 'contact', step: 'autoreply' });
    console.error('[api/contact] autoreply_failed:', err);
  }

  // Dönüşüm olayı istemcide (`ContactForm`) GA4'e yazılıyor — ADR-021.
  return NextResponse.json({ ok: true });
}
