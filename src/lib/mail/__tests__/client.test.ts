import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendMailWithRetry } from '../client';

const resendSendMock = vi.fn();
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: { send: resendSendMock },
  })),
}));

describe('sendMailWithRetry', () => {
  beforeEach(() => {
    resendSendMock.mockReset();
    vi.stubEnv('RESEND_API_KEY', 'test-key');
  });

  it('ilk denemede başarılıysa tek call', async () => {
    resendSendMock.mockResolvedValueOnce({ data: { id: '1' }, error: null });
    await sendMailWithRetry({ from: 'a', to: 'b', subject: 's', react: null, text: 't' });
    expect(resendSendMock).toHaveBeenCalledTimes(1);
  });

  it('2 kez fail + 3. denemede başarılıysa 3 call', async () => {
    resendSendMock
      .mockResolvedValueOnce({ data: null, error: { message: 'x' } })
      .mockResolvedValueOnce({ data: null, error: { message: 'y' } })
      .mockResolvedValueOnce({ data: { id: '2' }, error: null });
    await sendMailWithRetry(
      { from: 'a', to: 'b', subject: 's', react: null, text: 't' },
      { maxAttempts: 3, baseDelayMs: 1 },
    );
    expect(resendSendMock).toHaveBeenCalledTimes(3);
  });

  it('3 kez fail sonrası throw', async () => {
    resendSendMock.mockResolvedValue({ data: null, error: { message: 'x' } });
    await expect(
      sendMailWithRetry(
        { from: 'a', to: 'b', subject: 's', react: null, text: 't' },
        { maxAttempts: 3, baseDelayMs: 1 },
      ),
    ).rejects.toThrow();
    expect(resendSendMock).toHaveBeenCalledTimes(3);
  });
});
