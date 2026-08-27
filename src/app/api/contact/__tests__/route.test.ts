import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../route';

vi.mock('@/lib/security/turnstile', () => ({ verifyTurnstile: vi.fn() }));
vi.mock('@/lib/mail/client', () => ({ sendMailWithRetry: vi.fn() }));

const validBody = {
  firstName: 'Ayşe', lastName: 'Yılmaz',
  email: 'ayse@example.com', phone: '+905550001122', company: 'Acme',
  subject: 'Proje', message: 'Uzun mesaj, 20 karakterden fazla.',
  budgetRange: '100k-250k', timeline: '1-3-months',
  kvkkConsent: true, locale: 'tr', turnstileToken: 'tkn',
};

function req(body: unknown): Request {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': '1.2.3.4' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/contact', () => {
  beforeEach(async () => {
    vi.resetAllMocks();
    // Set safe default so leftover once-mocks don't bleed between tests.
    const { verifyTurnstile } = await import('@/lib/security/turnstile');
    vi.mocked(verifyTurnstile).mockResolvedValue(true);
  });

  it('400 invalid', async () => {
    const { verifyTurnstile } = await import('@/lib/security/turnstile');
    vi.mocked(verifyTurnstile).mockResolvedValueOnce(true);
    const res = await POST(req({ ...validBody, message: 'kısa' }));
    expect(res.status).toBe(400);
  });

  it('403 turnstile fail', async () => {
    const { verifyTurnstile } = await import('@/lib/security/turnstile');
    vi.mocked(verifyTurnstile).mockResolvedValueOnce(false);
    const res = await POST(req(validBody));
    expect(res.status).toBe(403);
  });

  it('200 happy path', async () => {
    const { verifyTurnstile } = await import('@/lib/security/turnstile');
    const { sendMailWithRetry } = await import('@/lib/mail/client');
    vi.mocked(verifyTurnstile).mockResolvedValueOnce(true);
    vi.mocked(sendMailWithRetry).mockResolvedValue(undefined);
    const res = await POST(req(validBody));
    expect(res.status).toBe(200);
    expect(sendMailWithRetry).toHaveBeenCalledTimes(2);
  });

  it('500 — satış bildirimi düşerse istek başarısız', async () => {
    const { verifyTurnstile } = await import('@/lib/security/turnstile');
    const { sendMailWithRetry } = await import('@/lib/mail/client');
    vi.mocked(verifyTurnstile).mockResolvedValueOnce(true);
    vi.mocked(sendMailWithRetry).mockRejectedValueOnce(new Error('resend'));
    const res = await POST(req(validBody));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: 'mail_failed' });
    // Bildirim düştüyse otomatik yanıt hiç denenmez.
    expect(sendMailWithRetry).toHaveBeenCalledTimes(1);
  });

  it('200 — otomatik yanıt düşse de lead satışa ulaştıysa başarı döner', async () => {
    const { verifyTurnstile } = await import('@/lib/security/turnstile');
    const { sendMailWithRetry } = await import('@/lib/mail/client');
    vi.mocked(verifyTurnstile).mockResolvedValueOnce(true);
    vi.mocked(sendMailWithRetry)
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error('resend'));
    const res = await POST(req(validBody));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(sendMailWithRetry).toHaveBeenCalledTimes(2);
  });

  it('satış bildirimi varsayılan gelen kutusuna gider', async () => {
    const previous = process.env.SALES_INBOX_EMAIL;
    delete process.env.SALES_INBOX_EMAIL;
    try {
      const { verifyTurnstile } = await import('@/lib/security/turnstile');
      const { sendMailWithRetry } = await import('@/lib/mail/client');
      vi.mocked(verifyTurnstile).mockResolvedValueOnce(true);
      vi.mocked(sendMailWithRetry).mockResolvedValue(undefined);
      await POST(req(validBody));
      expect(vi.mocked(sendMailWithRetry).mock.calls[0]?.[0]).toMatchObject({
        to: 'digital@indoles.com.tr',
      });
    } finally {
      if (previous === undefined) delete process.env.SALES_INBOX_EMAIL;
      else process.env.SALES_INBOX_EMAIL = previous;
    }
  });
});
