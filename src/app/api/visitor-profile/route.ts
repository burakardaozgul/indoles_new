import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { visitorProfileSchema } from '@/lib/schemas/visitor-profile';
import { verifyTurnstile } from '@/lib/security/turnstile';
import { sendMailWithRetry } from '@/lib/mail/client';
import { posthogServer, flushPosthog } from '@/lib/analytics/posthog-server';
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
      from: process.env.RESEND_FROM_EMAIL ?? 'INDOLES <noreply@indoles.com.tr>',
      to: process.env.LEAD_INBOX_EMAIL ?? 'lead@indoles.com.tr',
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
      from: process.env.RESEND_AUTOREPLY_FROM_EMAIL ?? process.env.RESEND_FROM_EMAIL ?? 'INDOLES <hello@indoles.com.tr>',
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

  const ph = posthogServer();
  const distinctId = `email:${data.lead.email.toLowerCase()}`;
  try {
    ph.identify({
      distinctId,
      properties: {
        persona: data.persona,
        first_name: data.lead.firstName,
        last_name: data.lead.lastName,
        company: data.lead.company,
        title: data.lead.title,
        selected_problems: data.problems,
        first_seen_locale: data.locale,
        kvkk_consent_at: kvkkConsentAt,
        utm_source: data.utm?.source,
        utm_medium: data.utm?.medium,
        utm_campaign: data.utm?.campaign,
      },
    });
    ph.capture({
      distinctId,
      event: data.submissionType === 'booking'
        ? 'popup_booking_submitted'
        : 'popup_contact_submitted',
      properties: {
        persona: data.persona,
        problems: data.problems,
        locale: data.locale,
        preferred_slot: data.preferredSlot
          ? `${data.preferredSlot.date} ${data.preferredSlot.time}`
          : null,
      },
    });
    await flushPosthog();
  } catch (err) {
    Sentry.captureException(err, { tags: { route: 'visitor-profile', step: 'posthog' } });
  }

  return NextResponse.json({ ok: true });
}
