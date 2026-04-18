import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { contactSchema } from '@/lib/schemas/contact';
import { verifyTurnstile } from '@/lib/security/turnstile';
import { sendMailWithRetry } from '@/lib/mail/client';
import { posthogServer, flushPosthog } from '@/lib/analytics/posthog-server';
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

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '0.0.0.0';
  const ok = await verifyTurnstile(data.turnstileToken, ip);
  if (!ok) {
    return NextResponse.json({ error: 'turnstile_failed' }, { status: 403 });
  }

  try {
    await sendMailWithRetry({
      from: 'INDOLES <noreply@indoles.com.tr>',
      to: process.env.SALES_INBOX_EMAIL ?? 'sales@indoles.com.tr',
      subject: `İletişim — ${data.subject} — ${data.firstName} ${data.lastName}`,
      react: ContactNotification(data),
    });
    await sendMailWithRetry({
      from: 'INDOLES <hello@indoles.com.tr>',
      to: data.email,
      subject: data.locale === 'tr' ? 'Mesajını aldık — INDOLES' : 'We got your message — INDOLES',
      react: ContactAutoreply({ firstName: data.firstName, locale: data.locale }),
    });
  } catch (err) {
    Sentry.captureException(err, { tags: { route: 'contact', step: 'mail' } });
    return NextResponse.json({ error: 'mail_failed' }, { status: 500 });
  }

  try {
    const ph = posthogServer();
    ph.capture({
      distinctId: `email:${data.email.toLowerCase()}`,
      event: 'contact_form_submitted',
      properties: {
        subject: data.subject,
        budget_range: data.budgetRange,
        timeline: data.timeline,
        locale: data.locale,
      },
    });
    await flushPosthog();
  } catch (err) {
    Sentry.captureException(err, { tags: { route: 'contact', step: 'posthog' } });
  }

  return NextResponse.json({ ok: true });
}
