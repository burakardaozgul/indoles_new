import { Resend } from 'resend';

type SendInput = Parameters<Resend['emails']['send']>[0];
type RetryOpts = { maxAttempts?: number; baseDelayMs?: number };

let cachedClient: Resend | null = null;
function client(): Resend {
  if (!cachedClient) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error('RESEND_API_KEY yok');
    cachedClient = new Resend(key);
  }
  return cachedClient;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function sendMailWithRetry(
  input: SendInput,
  opts: RetryOpts = {},
): Promise<void> {
  const maxAttempts = opts.maxAttempts ?? 3;
  const baseDelayMs = opts.baseDelayMs ?? 500;
  let lastErr: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const { data, error } = await client().emails.send(input);
    if (data && !error) return;
    lastErr = error;
    if (attempt < maxAttempts) {
      await sleep(baseDelayMs * Math.pow(3, attempt - 1));
    }
  }
  throw new Error(`Resend failed after ${maxAttempts}: ${JSON.stringify(lastErr)}`);
}

/**
 * Alıcı listesi tek bir env değişkeninde virgülle ayrılıyor
 * (`SALES_INBOX_EMAIL=a@x.com,b@y.com`). Resend `to` alanında dizi kabul
 * ediyor; virgüllü tek string gönderilirse bunu tek bir adres sanıp
 * reddediyor. Bu yüzden ayrıştırma env okunduğu yerde değil burada, tek
 * yerde yapılıyor.
 */
export function recipients(value: string | undefined, fallback: string): string[] {
  const list = (value ?? fallback)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return list.length > 0 ? list : [fallback];
}
