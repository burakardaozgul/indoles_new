import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { visitorProfileSchema } from '@/lib/schemas/visitor-profile';
import { verifyTurnstile } from '@/lib/security/turnstile';
import { sendMailWithRetry, recipients } from '@/lib/mail/client';
import VisitorProfileLeadNotification from '../../../../emails/VisitorProfileLeadNotification';
import VisitorProfileAutoreply from '../../../../emails/VisitorProfileAutoreply';

export const runtime = 'nodejs';

export async function POST(req: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const parsed = visitorProfileSchema.safeParse(body);
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

  const kvkkConsentAt = new Date().toISOString();

  try {
    await sendMailWithRetry({
      to: recipients(process.env.LEAD_INBOX_EMAIL, 'digital@indoles.com.tr'),
      subject: `Yeni popup lead — ${data.lead.firstName} ${data.lead.lastName} (${data.lead.company})`,
      react: VisitorProfileLeadNotification({
        persona: data.persona,
        problems: data.problems,
        lead: data.lead,
        submissionType: data.submissionType,
        locale: data.locale,
        utm: data.utm,
        preferredSlot: data.preferredSlot,
      }),
    });
    await sendMailWithRetry({
      to: data.lead.email,
      subject: data.locale === 'tr' ? 'Seçimini aldık — INDOLES' : 'We got your selection — INDOLES',
      react: VisitorProfileAutoreply({
        persona: data.persona,
        firstName: data.lead.firstName,
        submissionType: data.submissionType,
        locale: data.locale,
      }),
    });
  } catch (err) {
    Sentry.captureException(err, { tags: { route: 'visitor-profile', step: 'mail' } });
    console.error('[api/visitor-profile] mail_failed:', err);
    return NextResponse.json({ error: 'mail_failed' }, { status: 500 });
  }

  // Lead olayları istemcide (`EntryPopup`) GA4'e yazılıyor — ADR-021.
  // Lead detayı e-posta bildirimiyle taşınıyor; GA4 CRM değil.

  return NextResponse.json({ ok: true });
}
