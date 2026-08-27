import { render } from '@react-email/render';
import type { ReactElement } from 'react';

/**
 * Mail gönderimi Veridyen'in kendi SMTP sunucusundan yapılıyor (ADR-026).
 *
 * Neden dış bir servis değil: alan adının SPF/DKIM/DMARC kaydı zaten Veridyen'i
 * yetkilendiriyor, dolayısıyla bu yol hiçbir DNS değişikliği istemiyor. Üçüncü
 * bir gönderici eklemek kök SPF kaydına dokunmayı gerektirirdi; alan adında tek
 * bir SPF kaydı olabildiği için hatalı bir ekleme normal mail trafiğini de
 * bozardı ve DMARC `p=quarantine` olduğu için bunu sessizce yapardı.
 */

type SendInput = {
  to: string | string[];
  subject: string;
  react: ReactElement;
  /** Ziyaretçi yanıtının döneceği adres. Varsayılan: `MAIL_REPLY_TO`. */
  replyTo?: string;
};

type RetryOpts = { maxAttempts?: number; baseDelayMs?: number };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Alıcı listesi tek bir env değişkeninde virgülle ayrılıyor
 * (`SALES_INBOX_EMAIL=a@x.com,b@y.com`). Virgüllü tek string SMTP'de tek ve
 * geçersiz bir adres sayılır; ayrıştırma env okunan her yerde değil burada,
 * tek yerde yapılıyor ki iki rota ayrışmasın.
 */
export function recipients(value: string | undefined, fallback: string): string[] {
  const list = (value ?? fallback)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return list.length > 0 ? list : [fallback];
}

/**
 * Gönderen adresi sunucu tarafından dayatılıyor, çağıran seçemiyor.
 *
 * Ölçüldü (2026-08-28): Veridyen'in Exim'i kimlik doğrulanan hesaptan başka bir
 * adres adına gönderimi `550 Gönderici adres ile header bilgisi eşleşmeli` ile
 * reddediyor — zarf ve header'ın ikisi de kimlik doğrulanan kutuya eşit olmak
 * zorunda. Bu yüzden From `noreply@`, yanıtlar ise Reply-To ile `digital@`ya
 * yönleniyor. `from`u parametre yapmak, çağıranlara var olmayan bir özgürlük
 * vaat etmek olurdu.
 */
const FROM = process.env.MAIL_FROM ?? 'INDOLES <noreply@indoles.com.tr>';
const REPLY_TO = process.env.MAIL_REPLY_TO ?? 'digital@indoles.com.tr';

function parseAddress(value: string): { name?: string; email: string } {
  const m = value.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  const email = m?.[2];
  if (!email) return { email: value.trim() };
  // `exactOptionalPropertyTypes` açık: `name: undefined` geçerli değil,
  // anahtarın hiç bulunmaması gerekiyor.
  const name = m?.[1]?.trim();
  return name ? { name, email } : { email };
}

/**
 * `worker-mailer` `cloudflare:sockets` üzerine kurulu; Node altında bu modül
 * çözümlenemiyor. Import bu yüzden çağrı anında ve dinamik: rota dosyası
 * Workers dışında da yüklenebilsin, hata ancak gerçekten mail gönderilmeye
 * çalışıldığında ortaya çıksın.
 */
async function loadMailer() {
  const mod = await import('worker-mailer');
  return mod.WorkerMailer;
}

function smtpConfig() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    throw new Error('SMTP yapılandırması eksik: SMTP_HOST / SMTP_USER / SMTP_PASS');
  }
  const port = Number(process.env.SMTP_PORT ?? 587);
  return {
    host,
    port,
    // 465 örtük TLS ile açılır; 587 düz açılıp STARTTLS ile yükseltilir.
    secure: port === 465,
    startTls: port !== 465,
    credentials: { username: user, password: pass },
    // Sunucu AUTH PLAIN ve LOGIN sunuyor (ölçüldü). LOGIN daha yaygın kabul görüyor.
    authType: 'login' as const,
  };
}

export async function sendMailWithRetry(
  input: SendInput,
  opts: RetryOpts = {},
): Promise<void> {
  const maxAttempts = opts.maxAttempts ?? 3;
  const baseDelayMs = opts.baseDelayMs ?? 500;

  const html = await render(input.react);
  const text = await render(input.react, { plainText: true });
  const to = Array.isArray(input.to) ? input.to : [input.to];

  const message = {
    from: parseAddress(FROM),
    to,
    reply: { email: input.replyTo ?? REPLY_TO },
    subject: input.subject,
    html,
    text,
  };

  let lastErr: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const WorkerMailer = await loadMailer();
      await WorkerMailer.send(smtpConfig(), message);
      return;
    } catch (err) {
      lastErr = err;
      if (attempt < maxAttempts) {
        await sleep(baseDelayMs * Math.pow(3, attempt - 1));
      }
    }
  }
  throw new Error(
    `SMTP gönderimi ${maxAttempts} denemede başarısız: ${
      lastErr instanceof Error ? lastErr.message : JSON.stringify(lastErr)
    }`,
  );
}
