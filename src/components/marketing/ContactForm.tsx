'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useForm, type UseFormRegister } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { buildContactSchema, type ContactLocale } from '@/lib/schemas/contact';
import { Button } from '@/components/ui/button';
import { Input, Select, Textarea } from '@/components/ui/input';
import { gaEvent } from '@/lib/analytics/ga';

// kvkkConsent is boolean in the form (not literal true) — we force it to true on submit
function buildFormSchema(locale: ContactLocale) {
  return buildContactSchema(locale)
    .omit({ turnstileToken: true, locale: true })
    .extend({ kvkkConsent: z.boolean() });
}

type FormValues = z.infer<ReturnType<typeof buildFormSchema>>;
type RegisterFn = UseFormRegister<FormValues>;

const MESSAGE_MAX = 2000;
/**
 * Sayaç kalıcı değil: son 200 karakterde beliriyor. Kalıcı bir sayaç her
 * alanın altına gürültü ekler ve limiti olduğundan dar gösterir; eşik sonrası
 * görünen sayaç ise tam gerektiği anda uyarıya dönüşür.
 */
const MESSAGE_COUNTER_THRESHOLD = 1800;

/** Turnstile script'i geç gelebilir; kısa aralıkla ~18 sn yoklanır. */
/**
 * Turnstile bayrağı (ADR-028): site anahtarı build'de yoksa widget hiç render
 * edilmez, düğme token beklemez, sunucu da doğrulama istemez. Devre dışıyken
 * savunma bal küpü + süre tuzağı (rota tarafı: lib/security/anti-spam.ts).
 */
const TURNSTILE_ENABLED = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

const TURNSTILE_POLL_MS = 300;

/**
 * Widget render edildikten SONRA token gelmezse ne kadar beklenir.
 *
 * Mevcut sayaç yalnız "script hiç yüklenmedi" durumunu yakalıyordu. Ölçtük
 * (2026-08-28): script yüklenip widget render olduğu hâlde meydan okuma
 * tamamlanmayabiliyor ve Turnstile bu durumda `error-callback` ateşlemiyor.
 * Sonuç: ziyaretçi "yükleniyor" yazısıyla kilitli bir düğmenin karşısında
 * süresiz bekliyor ve formu hiç gönderemiyor — sessiz dönüşüm kaybı.
 */
const TURNSTILE_TOKEN_TIMEOUT_MS = 25_000;
const TURNSTILE_POLL_LIMIT = 60;

type TurnstileApi = {
  render: (
    el: Element,
    opts: {
      sitekey: string | undefined;
      callback: (token: string) => void;
      'expired-callback': () => void;
      'error-callback': () => void;
    },
  ) => string | undefined;
  reset?: (widgetId?: string) => void;
};

function turnstileApi(): TurnstileApi | undefined {
  if (typeof window === 'undefined') return undefined;
  return (window as unknown as { turnstile?: TurnstileApi }).turnstile;
}

// ---- Field helper ----

type FieldProps = {
  id: string;
  name: keyof FormValues;
  label: string;
  register: RegisterFn;
  error?: string | undefined;
  type?: string;
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>['inputMode'];
  autoComplete?: string;
};

function Field({
  id,
  name,
  label,
  register,
  error,
  type = 'text',
  inputMode,
  autoComplete,
}: FieldProps) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="typography-label text-ink-700">
        {label}
      </label>
      <Input
        id={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        aria-required
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className="mt-2"
        {...register(name)}
      />
      {error && (
        <p id={errorId} className="typography-caption text-danger-700 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

// ---- Select helper ----

type SelectFieldProps = {
  id: string;
  name: keyof FormValues;
  label: string;
  placeholder: string;
  options: ReadonlyArray<readonly [string, string]>;
  register: RegisterFn;
  error?: string | undefined;
};

function SelectField({
  id,
  name,
  label,
  placeholder,
  options,
  register,
  error,
}: SelectFieldProps) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="typography-label text-ink-700">
        {label}
      </label>
      <Select
        id={id}
        defaultValue=""
        aria-required
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className="mt-2"
        {...register(name)}
      >
        {/* Seçilemez placeholder — boş option kullanıcıya "geçerli seçenek" gibi görünüyordu. */}
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map(([value, display]) => (
          <option key={value} value={value}>
            {display}
          </option>
        ))}
      </Select>
      {error && (
        <p id={errorId} className="typography-caption text-danger-700 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

// ---- Görünen etiketler (value'lar şema enum'u ve GA event'iyle sabit) ----

const BUDGET_OPTIONS: Record<ContactLocale, ReadonlyArray<readonly [string, string]>> = {
  tr: [
    ['<25k', '₺25.000 altı'],
    ['25k-100k', '₺25.000–100.000'],
    ['100k-250k', '₺100.000–250.000'],
    ['250k-1m', '₺250.000–1.000.000'],
    ['>1m', '₺1.000.000 üzeri'],
    ['other', 'Diğer'],
  ],
  en: [
    ['<25k', 'Under ₺25,000'],
    ['25k-100k', '₺25,000–100,000'],
    ['100k-250k', '₺100,000–250,000'],
    ['250k-1m', '₺250,000–1,000,000'],
    ['>1m', 'Over ₺1,000,000'],
    ['other', 'Other'],
  ],
};

const TIMELINE_OPTIONS: Record<ContactLocale, ReadonlyArray<readonly [string, string]>> = {
  tr: [
    ['asap', 'Mümkünse hemen'],
    ['1-3-months', '1-3 ay'],
    ['3-6-months', '3-6 ay'],
    ['exploring', 'Araştırma aşaması'],
  ],
  en: [
    ['asap', 'ASAP'],
    ['1-3-months', '1-3 months'],
    ['3-6-months', '3-6 months'],
    ['exploring', 'Exploring'],
  ],
};

// ---- ContactForm ----

export function ContactForm({ locale }: { locale: ContactLocale }) {
  const isTr = locale === 'tr';
  const uid = useId();
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorKind, setErrorKind] = useState<'generic' | 'turnstile'>('generic');
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [turnstileStatus, setTurnstileStatus] = useState<'pending' | 'ready' | 'unavailable'>(
    TURNSTILE_ENABLED ? 'pending' : 'ready',
  );
  /** Bal küpü + süre tuzağı (ADR-028). mountedAt: form ekrana geldiği an. */
  const [website, setWebsite] = useState('');
  const mountedAtRef = useRef<number>(Date.now());
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);
  const renderedRef = useRef(false);

  const resolver = useMemo(() => zodResolver(buildFormSchema(locale)), [locale]);

  const { register, handleSubmit, watch, formState } = useForm<FormValues>({
    resolver,
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      subject: '',
      message: '',
      kvkkConsent: false,
    },
  });

  const errors = formState.errors;
  const kvkkConsent = watch('kvkkConsent');
  const messageValue = watch('message') ?? '';

  useEffect(() => {
    if (!TURNSTILE_ENABLED) return;
    let attempts = 0;
    let timer: ReturnType<typeof setInterval> | undefined;

    const stop = (): void => {
      if (timer !== undefined) {
        clearInterval(timer);
        timer = undefined;
      }
    };

    const tryRender = (): boolean => {
      if (renderedRef.current) return true;
      const api = turnstileApi();
      const el = turnstileRef.current;
      if (!api || !el) return false;
      renderedRef.current = true;
      widgetIdRef.current = api.render(el, {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
        callback: (token: string) => {
          setTurnstileToken(token);
          setTurnstileStatus('ready');
        },
        // Token ~5 dk sonra düşer; widget sıfırlanır, yeni token gelene dek buton kilitlenir.
        'expired-callback': () => {
          setTurnstileToken('');
          setTurnstileStatus('pending');
          try {
            turnstileApi()?.reset?.(widgetIdRef.current);
          } catch {
            /* widget kaldırılmış olabilir */
          }
        },
        // Widget kendi retry'ını tüketti; kullanıcıya sayfayı yenilemesini söyleriz.
        'error-callback': () => {
          setTurnstileToken('');
          setTurnstileStatus('unavailable');
        },
      });
      return true;
    };

    if (!tryRender()) {
      timer = setInterval(() => {
        attempts += 1;
        if (tryRender()) {
          stop();
          return;
        }
        if (attempts >= TURNSTILE_POLL_LIMIT) {
          stop();
          setTurnstileStatus('unavailable');
        }
      }, TURNSTILE_POLL_MS);
    }

    return stop;
  }, []);

  /**
   * Başarı kartı ekrana getirilir (2026-08-28).
   *
   * Uzun form kısa bir kartla değişince sayfa yüksekliği aniden düşüyor;
   * tarayıcı mevcut kaydırma konumunu yeni sınıra kelepçeliyor ve mobilde
   * ziyaretçi kendini sayfanın en altında buluyordu — "gönderdim, en alta
   * atladı". Kart görünür alana çekilince onay gerçekten okunuyor.
   */
  const successRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state !== 'success') return;
    successRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [state]);

  /**
   * Bekçi: durum `pending`de takılı kalırsa ziyaretçiyi süresiz bekletmek
   * yerine açık bir mesaja ve alternatif kanala düşürüyoruz.
   */
  useEffect(() => {
    if (turnstileStatus !== 'pending') return;
    const id = setTimeout(() => {
      setTurnstileStatus((current) => (current === 'pending' ? 'unavailable' : current));
    }, TURNSTILE_TOKEN_TIMEOUT_MS);
    return () => clearTimeout(id);
  }, [turnstileStatus]);

  /** Token tek kullanımlıktır: başarısız gönderimden sonra yenisi istenir. */
  function clearTurnstileToken(): void {
    setTurnstileToken('');
    setTurnstileStatus('pending');
    try {
      turnstileApi()?.reset?.(widgetIdRef.current);
    } catch {
      /* reset yoksa yeni token beklenir */
    }
  }

  async function onSubmit(values: FormValues): Promise<void> {
    setState('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...values,
          locale,
          kvkkConsent: true,
          website,
          elapsedMs: Date.now() - mountedAtRef.current,
          ...(TURNSTILE_ENABLED ? { turnstileToken } : {}),
        }),
      });
      if (res.ok) {
        setState('success');
        // Dönüşüm olayı istemcide yazılır (ADR-021): sunucu tarafı analitik
        // istemcisi kaldırıldı, GA4 zaten burada yüklü.
        gaEvent('contact_form_submitted', {
          subject: values.subject,
          budget_range: values.budgetRange,
          timeline: values.timeline,
          locale,
        });
        return;
      }
      // `res.ok` tek başına yetmiyor: 403 turnstile farklı bir aksiyon ister.
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      setErrorKind(body?.error === 'turnstile_failed' ? 'turnstile' : 'generic');
      setState('error');
      clearTurnstileToken();
    } catch {
      setErrorKind('generic');
      setState('error');
      clearTurnstileToken();
    }
  }

  if (state === 'success') {
    return (
      <div
        ref={successRef}
        role="status"
        className="v2-surface border border-surface-2 rounded-2xl p-10 text-center"
      >
        <h3 className="typography-h3 text-ink-900">
          {isTr ? 'Mesajın elimizde.' : 'We got your message.'}
        </h3>
        <p className="typography-body-md text-ink-700 mt-3">
          {isTr ? '1 iş günü içinde dönüyoruz.' : 'We will reply within one business day.'}
        </p>
      </div>
    );
  }

  const messageId = `${uid}-message`;
  const messageErrorId = `${messageId}-error`;
  const messageCounterId = `${messageId}-counter`;
  const remaining = MESSAGE_MAX - messageValue.length;
  const showCounter = messageValue.length >= MESSAGE_COUNTER_THRESHOLD;
  const messageDescribedBy =
    [errors.message ? messageErrorId : null, showCounter ? messageCounterId : null]
      .filter(Boolean)
      .join(' ') || undefined;

  const kvkkId = `${uid}-kvkkConsent`;
  const kvkkHref = isTr ? '/tr/gizlilik-kvkk' : '/en/privacy';

  // Buton kilitliyken tek satırlık gerekçe — kullanıcı neyi bekleyeceğini bilir.
  let submitHint: string | null = null;
  if (state !== 'submitting') {
    if (turnstileStatus === 'unavailable') {
      submitHint = isTr
        ? 'Güvenlik doğrulaması yüklenemedi. Sayfayı yenileyebilir veya doğrudan digital@indoles.com.tr adresine yazabilirsin.'
        : 'The security check did not load. Refresh the page, or email us directly at digital@indoles.com.tr.';
    } else if (!turnstileToken) {
      submitHint = isTr ? 'Güvenlik doğrulaması yükleniyor…' : 'Loading the security check…';
    } else if (!kvkkConsent) {
      submitHint = isTr
        ? 'Göndermek için KVKK onayı gerekli.'
        : 'KVKK consent is required to send.';
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          id={`${uid}-firstName`}
          name="firstName"
          label={isTr ? 'Ad' : 'First name'}
          autoComplete="given-name"
          register={register}
          error={errors.firstName?.message}
        />
        <Field
          id={`${uid}-lastName`}
          name="lastName"
          label={isTr ? 'Soyad' : 'Last name'}
          autoComplete="family-name"
          register={register}
          error={errors.lastName?.message}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          id={`${uid}-email`}
          name="email"
          label="E-posta"
          type="email"
          inputMode="email"
          autoComplete="email"
          register={register}
          error={errors.email?.message}
        />
        <Field
          id={`${uid}-phone`}
          name="phone"
          label={isTr ? 'Telefon' : 'Phone'}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          register={register}
          error={errors.phone?.message}
        />
      </div>
      <Field
        id={`${uid}-company`}
        name="company"
        label={isTr ? 'Şirket' : 'Company'}
        autoComplete="organization"
        register={register}
        error={errors.company?.message}
      />
      <Field
        id={`${uid}-subject`}
        name="subject"
        label={isTr ? 'Konu' : 'Subject'}
        register={register}
        error={errors.subject?.message}
      />
      <SelectField
        id={`${uid}-budgetRange`}
        name="budgetRange"
        label={isTr ? 'Bütçe aralığı' : 'Budget range'}
        placeholder={isTr ? 'Seç' : 'Select'}
        options={BUDGET_OPTIONS[locale]}
        register={register}
        error={errors.budgetRange?.message}
      />
      <SelectField
        id={`${uid}-timeline`}
        name="timeline"
        label={isTr ? 'Zaman çerçevesi' : 'Timeline'}
        placeholder={isTr ? 'Seç' : 'Select'}
        options={TIMELINE_OPTIONS[locale]}
        register={register}
        error={errors.timeline?.message}
      />
      <div>
        <label htmlFor={messageId} className="typography-label text-ink-700">
          {isTr ? 'Mesaj' : 'Message'}
        </label>
        <Textarea
          id={messageId}
          rows={5}
          maxLength={MESSAGE_MAX}
          aria-required
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={messageDescribedBy}
          className="mt-2"
          {...register('message')}
        />
        {errors.message && (
          <p id={messageErrorId} className="typography-caption text-danger-700 mt-1">
            {errors.message.message}
          </p>
        )}
        {showCounter && (
          <p
            id={messageCounterId}
            className="typography-caption mono tabular text-ink-500 mt-1 text-right"
          >
            {isTr ? `${remaining} karakter kaldı` : `${remaining} characters left`}
          </p>
        )}
      </div>
      {/* Checkbox 13px'ti; 20px kutu + 12px label padding'i dokunma hedefini 44px'e taşır. */}
      <label
        htmlFor={kvkkId}
        className="flex items-start gap-3 typography-body-sm text-ink-700 cursor-pointer py-3"
      >
        <input
          id={kvkkId}
          type="checkbox"
          {...register('kvkkConsent')}
          aria-required
          className="h-5 w-5 mt-0.5 shrink-0 accent-teal-700 cursor-pointer"
        />
        <span>
          {isTr ? (
            <>
              KVKK kapsamında verilerimin işlenmesini kabul ediyorum.{' '}
              <a
                href={kvkkHref}
                onClick={(e) => e.stopPropagation()}
                className="underline decoration-teal-300 hover:decoration-teal-500"
              >
                Aydınlatma metni
              </a>
            </>
          ) : (
            <>
              I consent to processing my data per KVKK.{' '}
              <a
                href={kvkkHref}
                onClick={(e) => e.stopPropagation()}
                className="underline decoration-teal-300 hover:decoration-teal-500"
              >
                Privacy notice
              </a>
            </>
          )}
        </span>
      </label>
      {/* Bal küpü: görsel olarak gizli, klavye/okuyucu erişiminden çıkarılmış.
          İnsan dolduramaz; dolduran bot rota tarafında sahte başarıya düşer. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
        <label>
          Web sitesi (boş bırak)
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>
      {TURNSTILE_ENABLED ? <div ref={turnstileRef} className="cf-turnstile" /> : null}
      <div>
        <Button type="submit" disabled={state === 'submitting' || (TURNSTILE_ENABLED && !turnstileToken) || !kvkkConsent}>
          {state === 'submitting'
            ? isTr
              ? 'Gönderiliyor…'
              : 'Sending…'
            : isTr
              ? 'Gönder'
              : 'Send'}
        </Button>
        <div role="status" aria-live="polite">
          {submitHint && <p className="typography-caption text-ink-500 mt-3">{submitHint}</p>}
        </div>
      </div>
      {state === 'error' && (
        <p role="alert" className="typography-caption text-danger-700">
          {errorKind === 'turnstile'
            ? isTr
              ? 'Güvenlik doğrulaması geçmedi; sayfayı yenileyip tekrar dene.'
              : 'The security check did not pass; refresh the page and try again.'
            : isTr
              ? 'Bir sorun oluştu, tekrar dene.'
              : 'Something went wrong, please retry.'}
        </p>
      )}
    </form>
  );
}
