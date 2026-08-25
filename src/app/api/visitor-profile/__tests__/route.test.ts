import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../route';

vi.mock('@/lib/security/turnstile', () => ({ verifyTurnstile: vi.fn() }));
vi.mock('@/lib/mail/client', () => ({ sendMailWithRetry: vi.fn() }));

const validBody = {
  persona: 'donusum-teknoloji',
  problems: ['a', 'b', 'c'],
  lead: {
    firstName: 'Burak', lastName: 'Özgül',
    phone: '+905551112233', email: 'burak@indoles.com.tr',
    company: 'INDOLES', title: 'Kurucu',
  },
  submissionType: 'booking',
  kvkkConsent: true,
  locale: 'tr',
  turnstileToken: 'tkn',
};

function buildRequest(body: unknown): Request {
  return new Request('http://localhost/api/visitor-profile', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': '1.2.3.4' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/visitor-profile', () => {
  beforeEach(async () => {
    vi.resetAllMocks();
    // Set safe default so leftover once-mocks don't bleed between tests.
    const { verifyTurnstile } = await import('@/lib/security/turnstile');
    vi.mocked(verifyTurnstile).mockResolvedValue(true);
  });

  it('400 — invalid Zod', async () => {
    const { verifyTurnstile } = await import('@/lib/security/turnstile');
    vi.mocked(verifyTurnstile).mockResolvedValueOnce(true);
    const res = await POST(buildRequest({ ...validBody, problems: ['x'] }));
    expect(res.status).toBe(400);
  });

  it('403 — Turnstile fail', async () => {
    const { verifyTurnstile } = await import('@/lib/security/turnstile');
    vi.mocked(verifyTurnstile).mockResolvedValueOnce(false);
    const res = await POST(buildRequest(validBody));
    expect(res.status).toBe(403);
  });

  it('200 — happy path (booking)', async () => {
    const { verifyTurnstile } = await import('@/lib/security/turnstile');
    const { sendMailWithRetry } = await import('@/lib/mail/client');
    vi.mocked(verifyTurnstile).mockResolvedValueOnce(true);
    vi.mocked(sendMailWithRetry).mockResolvedValue(undefined);
    const res = await POST(buildRequest(validBody));
    expect(res.status).toBe(200);
    expect(sendMailWithRetry).toHaveBeenCalledTimes(2);
  });

  it('200 — preferredSlot ile booking', async () => {
    const { verifyTurnstile } = await import('@/lib/security/turnstile');
    const { sendMailWithRetry } = await import('@/lib/mail/client');
    vi.mocked(verifyTurnstile).mockResolvedValueOnce(true);
    vi.mocked(sendMailWithRetry).mockResolvedValue(undefined);
    const bodyWithSlot = { ...validBody, preferredSlot: { date: '2026-04-25', time: '10:00' } };
    const res = await POST(buildRequest(bodyWithSlot));
    expect(res.status).toBe(200);
    const json = await res.json() as Record<string, unknown>;
    expect(json.ok).toBe(true);
    // No calComEmbedUrl in new flow
    expect(json.calComEmbedUrl).toBeUndefined();
  });

  it('500 — Resend hepsi fail', async () => {
    const { verifyTurnstile } = await import('@/lib/security/turnstile');
    const { sendMailWithRetry } = await import('@/lib/mail/client');
    vi.mocked(verifyTurnstile).mockResolvedValueOnce(true);
    vi.mocked(sendMailWithRetry).mockRejectedValueOnce(new Error('resend'));
    const res = await POST(buildRequest(validBody));
    expect(res.status).toBe(500);
  });
});
