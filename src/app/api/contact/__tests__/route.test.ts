import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../route';

vi.mock('@/lib/security/turnstile', () => ({ verifyTurnstile: vi.fn() }));
// `recipients` gerçek uygulamasıyla mock'lanıyor: rotanın alıcı listesini
// diziye çevirdiğini doğrulamak istiyoruz, o davranışı sahteleyip atlamak değil.
vi.mock('@/lib/mail/client', async (importActual) => ({
  sendMailWithRetry: vi.fn(),
  recipients: (await importActual<typeof import('@/lib/mail/client')>()).recipients,
}));

const validBody = {
  firstName: 'Ayşe', lastName: 'Yılmaz',
  email: 'ayse@example.com', phone: '+905550001122', company: 'Acme',
  subject: 'Proje', message: 'Uzun mesaj, 20 karakterden fazla.',
  budgetRange: '100k-250k', timeline: '1-3-months',
  kvkkConsent: true, locale: 'tr', turnstileToken: 'tkn',
  // İnsan davranışı: bal küpü boş, doldurma süresi eşiğin üstünde.
  website: '', elapsedMs: 5000,
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

  it('403 turnstile fail — bayrak AÇIKKEN', async () => {
    vi.stubEnv('NEXT_PUBLIC_TURNSTILE_SITE_KEY', '0xTESTKEY');
    try {
      const { verifyTurnstile } = await import('@/lib/security/turnstile');
      vi.mocked(verifyTurnstile).mockResolvedValueOnce(false);
      const res = await POST(req(validBody));
      expect(res.status).toBe(403);
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it('bayrak KAPALIYKEN turnstile hiç sorgulanmaz', async () => {
    const { verifyTurnstile } = await import('@/lib/security/turnstile');
    const { sendMailWithRetry } = await import('@/lib/mail/client');
    vi.mocked(sendMailWithRetry).mockResolvedValue(undefined);
    const res = await POST(req({ ...validBody, turnstileToken: undefined }));
    expect(res.status).toBe(200);
    expect(verifyTurnstile).not.toHaveBeenCalled();
    expect(sendMailWithRetry).toHaveBeenCalledTimes(2);
  });

  it('bal küpü doluysa sahte başarı döner ve mail GİTMEZ', async () => {
    // 4xx dönmüyoruz: açık hata bota neyin yakalandığını öğretir (anti-spam.ts).
    const { sendMailWithRetry } = await import('@/lib/mail/client');
    const res = await POST(req({ ...validBody, website: 'https://spam.example' }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(sendMailWithRetry).not.toHaveBeenCalled();
  });

  it('2 saniyeden hızlı gönderim sahte başarıya düşer', async () => {
    const { sendMailWithRetry } = await import('@/lib/mail/client');
    const res = await POST(req({ ...validBody, elapsedMs: 400 }));
    expect(res.status).toBe(200);
    expect(sendMailWithRetry).not.toHaveBeenCalled();
  });

  it('süre bilgisi hiç yoksa (doğrudan API botu) sahte başarıya düşer', async () => {
    const { sendMailWithRetry } = await import('@/lib/mail/client');
    const res = await POST(req({ ...validBody, elapsedMs: undefined }));
    expect(res.status).toBe(200);
    expect(sendMailWithRetry).not.toHaveBeenCalled();
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

  it('satış bildirimi virgüllü listedeki alıcıların HEPSİNE gider', async () => {
    const previous = process.env.SALES_INBOX_EMAIL;
    process.env.SALES_INBOX_EMAIL =
      'digital@indoles.com.tr, burak@indoles.com.tr,b.a.ozgul@gmail.com';
    try {
      const { verifyTurnstile } = await import('@/lib/security/turnstile');
      const { sendMailWithRetry } = await import('@/lib/mail/client');
      vi.mocked(verifyTurnstile).mockResolvedValueOnce(true);
      vi.mocked(sendMailWithRetry).mockResolvedValue(undefined);
      await POST(req(validBody));
      // Dizi olarak geçmesi şart: virgüllü tek string Resend'de tek geçersiz
      // adres sayılır ve lead bildirimi sessizce kimseye ulaşmaz.
      expect(vi.mocked(sendMailWithRetry).mock.calls[0]?.[0]).toMatchObject({
        to: ['digital@indoles.com.tr', 'burak@indoles.com.tr', 'b.a.ozgul@gmail.com'],
      });
    } finally {
      if (previous === undefined) delete process.env.SALES_INBOX_EMAIL;
      else process.env.SALES_INBOX_EMAIL = previous;
    }
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
        to: ['digital@indoles.com.tr'],
      });
    } finally {
      if (previous === undefined) delete process.env.SALES_INBOX_EMAIL;
      else process.env.SALES_INBOX_EMAIL = previous;
    }
  });
});
