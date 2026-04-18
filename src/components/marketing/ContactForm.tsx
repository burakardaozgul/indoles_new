'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { contactSchema } from '@/lib/schemas/contact';
import { Button } from '@/components/ui/button';

// kvkkConsent is boolean in the form (not literal true) — we force it to true on submit
type FormValues = z.infer<typeof formSchema>;

const formSchema = contactSchema.omit({ turnstileToken: true, locale: true }).extend({
  kvkkConsent: z.boolean(),
});

// ---- Field helper ----

type FieldProps = {
  name: keyof FormValues;
  label: string;
  type?: string;
  register: ReturnType<typeof useForm<FormValues>>['register'];
  error?: string | undefined;
};

function Field({ name, label, type = 'text', register, error }: FieldProps) {
  return (
    <div>
      <label className="typography-label text-ink-700">{label}</label>
      <input
        type={type}
        {...register(name)}
        className="mt-2 w-full border border-surface-2 rounded-xl px-4 py-3 bg-paper focus:outline-none focus:ring-2 focus:ring-brand-500 typography-body-md text-ink-900"
      />
      {error && <p className="typography-caption text-danger-700 mt-1">{error}</p>}
    </div>
  );
}

// ---- Select helper ----

type SelectOption = string | [string, string];

type SelectProps = {
  name: keyof FormValues;
  label: string;
  options: SelectOption[];
  register: ReturnType<typeof useForm<FormValues>>['register'];
  error?: string | undefined;
};

function Select({ name, label, options, register, error }: SelectProps) {
  return (
    <div>
      <label className="typography-label text-ink-700">{label}</label>
      <select
        {...register(name)}
        className="mt-2 w-full border border-surface-2 rounded-xl px-4 py-3 bg-paper focus:outline-none focus:ring-2 focus:ring-brand-500 typography-body-md text-ink-900"
      >
        <option value="" />
        {options.map((opt) => {
          const value = Array.isArray(opt) ? opt[0] : opt;
          const display = Array.isArray(opt) ? opt[1] : opt;
          return (
            <option key={value} value={value}>
              {display}
            </option>
          );
        })}
      </select>
      {error && <p className="typography-caption text-danger-700 mt-1">{error}</p>}
    </div>
  );
}

// ---- ContactForm ----

export function ContactForm({ locale }: { locale: 'tr' | 'en' }) {
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const turnstileRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, watch, formState } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { kvkkConsent: false },
  });

  const errors = formState.errors;
  const kvkkConsent = watch('kvkkConsent');

  useEffect(() => {
    const w = window as unknown as {
      turnstile?: { render: (el: Element, opts: unknown) => void };
    };
    if (w.turnstile && turnstileRef.current) {
      w.turnstile.render(turnstileRef.current, {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
        callback: (token: string) => setTurnstileToken(token),
      });
    }
  }, []);

  async function onSubmit(values: FormValues): Promise<void> {
    setState('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...values, locale, turnstileToken, kvkkConsent: true }),
      });
      setState(res.ok ? 'success' : 'error');
    } catch {
      setState('error');
    }
  }

  if (state === 'success') {
    return (
      <div className="bg-surface-1 border border-surface-2 rounded-2xl p-10 text-center">
        <h3 className="typography-h3 text-ink-900">
          {locale === 'tr' ? 'Mesajın elimizde.' : 'We got your message.'}
        </h3>
        <p className="typography-body-md text-ink-700 mt-3">
          {locale === 'tr'
            ? '1 iş günü içinde dönüyoruz.'
            : 'We will reply within one business day.'}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          name="firstName"
          label={locale === 'tr' ? 'Ad' : 'First name'}
          register={register}
          error={errors.firstName?.message}
        />
        <Field
          name="lastName"
          label={locale === 'tr' ? 'Soyad' : 'Last name'}
          register={register}
          error={errors.lastName?.message}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          name="email"
          label="E-posta"
          type="email"
          register={register}
          error={errors.email?.message}
        />
        <Field
          name="phone"
          label={locale === 'tr' ? 'Telefon' : 'Phone'}
          register={register}
          error={errors.phone?.message}
        />
      </div>
      <Field
        name="company"
        label={locale === 'tr' ? 'Şirket' : 'Company'}
        register={register}
        error={errors.company?.message}
      />
      <Field
        name="subject"
        label={locale === 'tr' ? 'Konu' : 'Subject'}
        register={register}
        error={errors.subject?.message}
      />
      <Select
        name="budgetRange"
        label={locale === 'tr' ? 'Bütçe aralığı' : 'Budget range'}
        register={register}
        error={errors.budgetRange?.message}
        options={['<25k', '25k-100k', '100k-250k', '250k-1m', '>1m', 'other']}
      />
      <Select
        name="timeline"
        label={locale === 'tr' ? 'Zaman çerçevesi' : 'Timeline'}
        register={register}
        error={errors.timeline?.message}
        options={
          locale === 'tr'
            ? [
                ['asap', 'Mümkünse hemen'],
                ['1-3-months', '1-3 ay'],
                ['3-6-months', '3-6 ay'],
                ['exploring', 'Araştırma aşaması'],
              ]
            : [
                ['asap', 'ASAP'],
                ['1-3-months', '1-3 months'],
                ['3-6-months', '3-6 months'],
                ['exploring', 'Exploring'],
              ]
        }
      />
      <div>
        <label className="typography-label text-ink-700">
          {locale === 'tr' ? 'Mesaj' : 'Message'}
        </label>
        <textarea
          {...register('message')}
          rows={5}
          className="mt-2 w-full border border-surface-2 rounded-xl px-4 py-3 bg-paper focus:outline-none focus:ring-2 focus:ring-brand-500 typography-body-md text-ink-900"
        />
        {errors.message && (
          <p className="typography-caption text-danger-700 mt-1">
            {locale === 'tr' ? 'En az 20 karakter yaz.' : 'Minimum 20 characters.'}
          </p>
        )}
      </div>
      <label className="flex items-start gap-3 typography-body-sm text-ink-700 cursor-pointer">
        <input type="checkbox" {...register('kvkkConsent')} className="mt-1" />
        <span>
          {locale === 'tr' ? (
            <>
              KVKK kapsamında verilerimin işlenmesini kabul ediyorum.{' '}
              <a
                href={`/${locale}/gizlilik-kvkk`}
                className="underline decoration-brand-300 hover:decoration-brand-500"
              >
                Aydınlatma metni
              </a>
            </>
          ) : (
            <>
              I consent to processing my data per KVKK.{' '}
              <a
                href={`/${locale}/gizlilik-kvkk`}
                className="underline decoration-brand-300 hover:decoration-brand-500"
              >
                Privacy notice
              </a>
            </>
          )}
        </span>
      </label>
      <div ref={turnstileRef} className="cf-turnstile" />
      <Button
        type="submit"
        disabled={state === 'submitting' || !turnstileToken || !kvkkConsent}
      >
        {state === 'submitting'
          ? locale === 'tr'
            ? 'Gönderiliyor…'
            : 'Sending…'
          : locale === 'tr'
            ? 'Gönder'
            : 'Send'}
      </Button>
      {state === 'error' && (
        <p className="typography-caption text-danger-700">
          {locale === 'tr'
            ? 'Bir sorun oluştu, tekrar dene.'
            : 'Something went wrong, please retry.'}
        </p>
      )}
    </form>
  );
}
