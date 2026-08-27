import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendMailWithRetry } from '../client';

const sendMock = vi.fn();
vi.mock('worker-mailer', () => ({
  WorkerMailer: { send: (...args: unknown[]) => sendMock(...args) },
}));
// React Email render'ı gerçek DOM'a ihtiyaç duyuyor; testte gövde içeriği değil
// gönderim davranışı ölçülüyor.
vi.mock('@react-email/render', () => ({
  render: vi.fn(async (_el: unknown, opts?: { plainText?: boolean }) =>
    opts?.plainText ? 'düz metin' : '<p>html</p>',
  ),
}));

const el = null as never;

describe('sendMailWithRetry', () => {
  beforeEach(() => {
    sendMock.mockReset();
    vi.stubEnv('SMTP_HOST', 'polo.veridyen.com');
    vi.stubEnv('SMTP_PORT', '587');
    vi.stubEnv('SMTP_USER', 'noreply@indoles.com.tr');
    vi.stubEnv('SMTP_PASS', 'gizli');
  });

  it('ilk denemede başarılıysa tek call', async () => {
    sendMock.mockResolvedValueOnce(undefined);
    await sendMailWithRetry({ to: 'b@x.com', subject: 's', react: el });
    expect(sendMock).toHaveBeenCalledTimes(1);
  });

  it('2 kez fail + 3. denemede başarılıysa 3 call', async () => {
    sendMock
      .mockRejectedValueOnce(new Error('x'))
      .mockRejectedValueOnce(new Error('y'))
      .mockResolvedValueOnce(undefined);
    await sendMailWithRetry({ to: 'b@x.com', subject: 's', react: el }, { maxAttempts: 3, baseDelayMs: 1 });
    expect(sendMock).toHaveBeenCalledTimes(3);
  });

  it('3 kez fail sonrası throw', async () => {
    sendMock.mockRejectedValue(new Error('x'));
    await expect(
      sendMailWithRetry({ to: 'b@x.com', subject: 's', react: el }, { maxAttempts: 3, baseDelayMs: 1 }),
    ).rejects.toThrow(/3 denemede başarısız/);
    expect(sendMock).toHaveBeenCalledTimes(3);
  });

  it('gönderen sunucunun dayattığı adres; çağıran değiştiremiyor', async () => {
    // Veridyen zarf ve header'ın kimlik doğrulanan kutuya eşit olmasını şart
    // koşuyor (550). From'u parametreleştirmek gerçekte var olmayan bir
    // esneklik vaat ederdi.
    vi.stubEnv('MAIL_FROM', 'INDOLES <noreply@indoles.com.tr>');
    sendMock.mockResolvedValueOnce(undefined);
    await sendMailWithRetry({ to: 'b@x.com', subject: 's', react: el });
    const [, message] = sendMock.mock.calls[0] as [unknown, Record<string, unknown>];
    expect(message.from).toEqual({ name: 'INDOLES', email: 'noreply@indoles.com.tr' });
  });

  it('yanıtlar digital@ adresine döner', async () => {
    sendMock.mockResolvedValueOnce(undefined);
    await sendMailWithRetry({ to: 'b@x.com', subject: 's', react: el });
    const [, message] = sendMock.mock.calls[0] as [unknown, Record<string, unknown>];
    expect(message.reply).toEqual({ email: 'digital@indoles.com.tr' });
  });

  it('587 STARTTLS ile, 465 örtük TLS ile açılır', async () => {
    sendMock.mockResolvedValue(undefined);
    await sendMailWithRetry({ to: 'b@x.com', subject: 's', react: el });
    const [cfg587] = sendMock.mock.calls[0] as [Record<string, unknown>];
    expect(cfg587).toMatchObject({ port: 587, secure: false, startTls: true });

    sendMock.mockReset();
    sendMock.mockResolvedValue(undefined);
    vi.stubEnv('SMTP_PORT', '465');
    await sendMailWithRetry({ to: 'b@x.com', subject: 's', react: el });
    const [cfg465] = sendMock.mock.calls[0] as [Record<string, unknown>];
    expect(cfg465).toMatchObject({ port: 465, secure: true, startTls: false });
  });

  it('SMTP yapılandırması eksikse anlamlı hata verir', async () => {
    vi.stubEnv('SMTP_HOST', '');
    await expect(
      sendMailWithRetry({ to: 'b@x.com', subject: 's', react: el }, { maxAttempts: 1, baseDelayMs: 1 }),
    ).rejects.toThrow(/SMTP yapılandırması eksik/);
  });
});
