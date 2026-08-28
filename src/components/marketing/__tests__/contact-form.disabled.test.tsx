import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

/**
 * Turnstile bayrağı KAPALIYKEN formun davranışı (ADR-028) — yani launch'ta
 * fiilen yayında olan mod. Ana test dosyası bayrağı açık kurar; bu dosya env'i
 * hiç kurmaz ve modül bayrağı kapalı okur.
 */
vi.hoisted(() => {
  delete process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
});

const { gaEventMock } = vi.hoisted(() => ({ gaEventMock: vi.fn() }));
vi.mock('@/lib/analytics/ga', () => ({ gaEvent: gaEventMock }));

import { ContactForm } from '../ContactForm';

function fillValidForm(): void {
  fireEvent.change(screen.getByLabelText('Ad'), { target: { value: 'Burak' } });
  fireEvent.change(screen.getByLabelText('Soyad'), { target: { value: 'Özgül' } });
  fireEvent.change(screen.getByLabelText('E-posta'), { target: { value: 'test@indoles.com.tr' } });
  fireEvent.change(screen.getByLabelText('Telefon'), { target: { value: '+905551112233' } });
  fireEvent.change(screen.getByLabelText('Şirket'), { target: { value: 'INDOLES' } });
  fireEvent.change(screen.getByLabelText('Konu'), { target: { value: 'Dönüşüm projesi' } });
  fireEvent.change(screen.getByLabelText('Mesaj'), {
    target: { value: 'Uzun bir mesaj yazıyorum, 20 karakterden fazla.' },
  });
  fireEvent.change(screen.getByLabelText('Bütçe aralığı'), { target: { value: '100k-250k' } });
  fireEvent.change(screen.getByLabelText('Zaman çerçevesi'), { target: { value: '1-3-months' } });
  fireEvent.click(screen.getByRole('checkbox', { name: /KVKK/i }));
}

describe('ContactForm — Turnstile bayrağı kapalı', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    gaEventMock.mockClear();
  });

  it('düğme token beklemez: KVKK işaretlenince gönderilebilir olur', () => {
    render(<ContactForm locale="tr" />);
    // Widget yok, script yok — düğmeyi kilitleyen tek şey KVKK onayı.
    expect(document.querySelector('.cf-turnstile')).toBeNull();
    fireEvent.click(screen.getByRole('checkbox', { name: /KVKK/i }));
    expect(screen.getByRole('button', { name: 'Gönder' })).not.toBeDisabled();
  });

  it('bal küpü alanı DOM\'da ama erişim akışının dışında', () => {
    render(<ContactForm locale="tr" />);
    const trap = document.querySelector<HTMLInputElement>('input[name="website"]');
    expect(trap).not.toBeNull();
    expect(trap?.tabIndex).toBe(-1);
    expect(trap?.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('gönderimde süre ve bal küpü sinyalleri gider, turnstileToken gitmez', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    vi.stubGlobal('fetch', fetchMock);
    render(<ContactForm locale="tr" />);
    fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: 'Gönder' }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    const body = JSON.parse((fetchMock.mock.calls[0] as [string, RequestInit])[1].body as string);
    expect(body.website).toBe('');
    expect(typeof body.elapsedMs).toBe('number');
    expect(body.elapsedMs).toBeGreaterThanOrEqual(0);
    expect('turnstileToken' in body).toBe(false);
  });
});
