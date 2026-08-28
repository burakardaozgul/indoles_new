import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { ContactForm } from '../ContactForm';

// Bu dosya Turnstile'ın AÇIK olduğu modu test eder; bayrak modül yüklenirken
// okunduğu için env burada, import'lar değerlenmeden kurulur.
const { gaEventMock } = vi.hoisted(() => {
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = '0xTESTKEY';
  return { gaEventMock: vi.fn() };
});
vi.mock('@/lib/analytics/ga', () => ({ gaEvent: gaEventMock }));

type TurnstileOptions = {
  callback: (token: string) => void;
  'expired-callback': () => void;
  'error-callback': () => void;
};

type TurnstileWindow = typeof window & {
  turnstile?: {
    render: (el: Element, opts: TurnstileOptions) => string;
    reset: (id?: string) => void;
  };
};

let lastOptions: TurnstileOptions | undefined;

/** Turnstile script'ini taklit eder; render anında token verir. */
function stubTurnstile(token = 'test-token'): void {
  (window as TurnstileWindow).turnstile = {
    render: (_el, opts) => {
      lastOptions = opts;
      opts.callback(token);
      return 'widget-1';
    },
    reset: vi.fn(),
  };
}

function removeTurnstile(): void {
  delete (window as TurnstileWindow).turnstile;
}

const TR_LABELS = [
  'Ad',
  'Soyad',
  'E-posta',
  'Telefon',
  'Şirket',
  'Konu',
  'Bütçe aralığı',
  'Zaman çerçevesi',
  'Mesaj',
];

function fillValidForm(): void {
  fireEvent.change(screen.getByLabelText('Ad'), { target: { value: 'Burak' } });
  fireEvent.change(screen.getByLabelText('Soyad'), { target: { value: 'Özgül' } });
  fireEvent.change(screen.getByLabelText('E-posta'), {
    target: { value: 'test@indoles.com.tr' },
  });
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

describe('ContactForm', () => {
  beforeEach(() => {
    lastOptions = undefined;
    gaEventMock.mockReset();
    removeTurnstile();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    removeTurnstile();
  });

  it('her alan etiketiyle bulunabilir', () => {
    stubTurnstile();
    render(<ContactForm locale="tr" />);
    for (const label of TR_LABELS) {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    }
    expect(screen.getByRole('checkbox', { name: /KVKK/i })).toBeInTheDocument();
  });

  it('zorunlu alanlar aria-required taşır', () => {
    stubTurnstile();
    render(<ContactForm locale="tr" />);
    for (const label of TR_LABELS) {
      expect(screen.getByLabelText(label)).toHaveAttribute('aria-required', 'true');
    }
  });

  it('TR sayfada hata mesajları Türkçe ve alana bağlı', async () => {
    stubTurnstile();
    render(<ContactForm locale="tr" />);
    fireEvent.click(screen.getByRole('checkbox', { name: /KVKK/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Gönder' }));

    const messages = await screen.findAllByText('En az 2 karakter.');
    expect(messages.length).toBeGreaterThanOrEqual(3);
    expect(screen.getByText('Geçerli bir e-posta yaz.')).toBeInTheDocument();
    expect(screen.getByText('Bir bütçe aralığı seç.')).toBeInTheDocument();
    expect(screen.getByText('Bir zaman çerçevesi seç.')).toBeInTheDocument();

    // Zod'un ham İngilizce varsayılanı sızmamalı.
    expect(screen.queryByText(/Required|must contain|Invalid|String/i)).toBeNull();

    const firstName = screen.getByLabelText('Ad');
    expect(firstName).toHaveAttribute('aria-invalid', 'true');
    const describedBy = firstName.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy as string)).toHaveTextContent('En az 2 karakter.');
  });

  it('EN sayfada aynı hatalar İngilizce basılır', async () => {
    stubTurnstile();
    render(<ContactForm locale="en" />);
    fireEvent.click(screen.getByRole('checkbox', { name: /KVKK/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

    await screen.findAllByText('At least 2 characters.');
    expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument();
    expect(screen.getByText('Select a budget range.')).toBeInTheDocument();
  });

  it('KVKK linki locale segmentini kullanır', () => {
    stubTurnstile();
    const { unmount } = render(<ContactForm locale="tr" />);
    expect(screen.getByRole('link', { name: 'Aydınlatma metni' })).toHaveAttribute(
      'href',
      '/tr/gizlilik-kvkk',
    );
    unmount();

    render(<ContactForm locale="en" />);
    expect(screen.getByRole('link', { name: 'Privacy notice' })).toHaveAttribute(
      'href',
      '/en/privacy',
    );
  });

  it('bütçe seçenekleri yerelleştirilir, value değişmez', () => {
    stubTurnstile();
    render(<ContactForm locale="tr" />);
    const budget = screen.getByLabelText('Bütçe aralığı') as HTMLSelectElement;
    const values = Array.from(budget.options).map((o) => o.value);
    expect(values).toEqual(['', '<25k', '25k-100k', '100k-250k', '250k-1m', '>1m', 'other']);
    expect(budget.options[0]?.disabled).toBe(true);
    expect(budget.options[0]?.textContent).toBe('Seç');
    expect(budget.options[1]?.textContent).toBe('₺25.000 altı');
    expect(budget.options[6]?.textContent).toBe('Diğer');
  });

  it('buton kilitliyken gerekçe görünür', () => {
    render(<ContactForm locale="tr" />);
    expect(screen.getByRole('button', { name: 'Gönder' })).toBeDisabled();
    expect(screen.getByText('Güvenlik doğrulaması yükleniyor…')).toBeInTheDocument();
  });

  it('token geldiyse eksik KVKK onayı gerekçe olarak yazılır', () => {
    stubTurnstile();
    render(<ContactForm locale="tr" />);
    expect(screen.getByText('Göndermek için KVKK onayı gerekli.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('checkbox', { name: /KVKK/i }));
    expect(screen.queryByText('Göndermek için KVKK onayı gerekli.')).toBeNull();
    expect(screen.getByRole('button', { name: 'Gönder' })).not.toBeDisabled();
  });

  it('Turnstile script geç gelirse widget yine de kurulur', () => {
    vi.useFakeTimers();
    try {
      render(<ContactForm locale="tr" />);
      expect(screen.getByRole('button', { name: 'Gönder' })).toBeDisabled();

      stubTurnstile('late-token');
      act(() => {
        vi.advanceTimersByTime(600);
      });

      fireEvent.click(screen.getByRole('checkbox', { name: /KVKK/i }));
      expect(screen.getByRole('button', { name: 'Gönder' })).not.toBeDisabled();
    } finally {
      vi.useRealTimers();
    }
  });

  it('token düşerse buton tekrar kilitlenir', () => {
    stubTurnstile();
    render(<ContactForm locale="tr" />);
    fireEvent.click(screen.getByRole('checkbox', { name: /KVKK/i }));
    expect(screen.getByRole('button', { name: 'Gönder' })).not.toBeDisabled();

    act(() => {
      lastOptions?.['expired-callback']();
    });
    expect(screen.getByRole('button', { name: 'Gönder' })).toBeDisabled();
    expect(screen.getByText('Güvenlik doğrulaması yükleniyor…')).toBeInTheDocument();
  });

  it('mesaj sayacı yalnız 1800 karakterden sonra görünür', () => {
    stubTurnstile();
    render(<ContactForm locale="tr" />);
    const message = screen.getByLabelText('Mesaj');
    expect(message).toHaveAttribute('maxlength', '2000');

    fireEvent.change(message, { target: { value: 'a'.repeat(1799) } });
    expect(screen.queryByText(/karakter kaldı/)).toBeNull();

    fireEvent.change(message, { target: { value: 'a'.repeat(1850) } });
    expect(screen.getByText('150 karakter kaldı')).toBeInTheDocument();
  });

  it('başarılı gönderimde durum kartı duyurulur ve GA olayı yazılır', async () => {
    stubTurnstile();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) }),
    );
    render(<ContactForm locale="tr" />);
    fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: 'Gönder' }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Mesajın elimizde.');
    });
    expect(gaEventMock).toHaveBeenCalledWith('contact_form_submitted', {
      subject: 'Dönüşüm projesi',
      budget_range: '100k-250k',
      timeline: '1-3-months',
      locale: 'tr',
    });
  });

  it('403 turnstile hatası kendi mesajını basar', async () => {
    stubTurnstile();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
        json: async () => ({ error: 'turnstile_failed' }),
      }),
    );
    render(<ContactForm locale="tr" />);
    fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: 'Gönder' }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Güvenlik doğrulaması geçmedi; sayfayı yenileyip tekrar dene.');
    expect(gaEventMock).not.toHaveBeenCalled();
  });

  it('500 hatası genel mesaja düşer', async () => {
    stubTurnstile();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: 'mail_failed' }),
      }),
    );
    render(<ContactForm locale="tr" />);
    fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: 'Gönder' }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Bir sorun oluştu, tekrar dene.');
  });
});
