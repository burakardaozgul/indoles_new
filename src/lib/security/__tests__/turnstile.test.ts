import { describe, it, expect, vi, beforeEach } from 'vitest';
import { verifyTurnstile } from '../turnstile';

describe('verifyTurnstile', () => {
  beforeEach(() => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'test-secret');
    global.fetch = vi.fn();
  });

  it('başarılı verification true döner', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });
    const ok = await verifyTurnstile('token-abc', '1.2.3.4');
    expect(ok).toBe(true);
  });

  it('başarısız verification false döner', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: false, 'error-codes': ['invalid'] }),
    });
    const ok = await verifyTurnstile('token-bad', '1.2.3.4');
    expect(ok).toBe(false);
  });

  it('network hatasında false döner', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('net'));
    const ok = await verifyTurnstile('token-x', '1.2.3.4');
    expect(ok).toBe(false);
  });
});
