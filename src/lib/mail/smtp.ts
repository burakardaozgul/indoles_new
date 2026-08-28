/**
 * Workers üzerinde çalışan asgari SMTP istemcisi (ADR-026).
 *
 * Neden hazır bir paket değil: `worker-mailer` dahil tüm Workers SMTP
 * paketleri `cloudflare:sockets` modülünü *literal* olarak import ediyor.
 * Bu şema yalnız Workers çalışma zamanında var; webpack ve OpenNext'in
 * esbuild adımı ikisi de onu çözemeyip build'i düşürüyor ve adaptörde
 * "şunu external say" diyebileceğimiz bir ayar yok (bakıldı: yalnız
 * `.wasm`/`.bin` için bir plugin var). Aşağıdaki `loadConnect()` şemayı
 * değişkene alarak statik analizden kaçırıyor; import çalışma zamanına
 * kalıyor ve Workers onu yerel olarak çözüyor.
 *
 * Yan fayda: kritik yolda (lead bildirimi) üçüncü taraf bir bağımlılık
 * kalmıyor. SMTP donmuş bir protokol; buradaki yüzey küçük ve bizim.
 */

type CfSocket = {
  readable: ReadableStream<Uint8Array>;
  writable: WritableStream<Uint8Array>;
  startTls: () => CfSocket;
  close: () => Promise<void>;
};

type ConnectFn = (
  address: { hostname: string; port: number },
  options?: { secureTransport?: 'off' | 'on' | 'starttls'; allowHalfOpen?: boolean },
) => CfSocket;

async function loadConnect(): Promise<ConnectFn> {
  const specifier = 'cloudflare:sockets';
  /**
   * `.catch()` şart ve süs değil.
   *
   * Değişkene almak webpack'i durdurmuyor — sabiti katlayıp literale geri
   * çeviriyor. Sonraki adımdaki esbuild ise şemayı çözemeyip build'i
   * düşürüyor. esbuild'in kendi hata mesajı çıkışı söylüyor: `.catch()`
   * eklenmiş bir dinamik import, çözümlenemediğinde build'i kırmak yerine
   * ifadeyi olduğu gibi bırakıp hatayı çalışma zamanına erteliyor. Workers
   * çalışma zamanında `cloudflare:sockets` zaten mevcut, dolayısıyla import
   * orada sorunsuz çözülüyor.
   */
  /**
   * `webpackIgnore` de şart: yorum olmadan webpack ifadeyi kendi modül
   * sistemine çevirir ve çalışma zamanında "Cannot find module" fırlatır
   * (canlıda ölçüldü). Yorumla birlikte webpack native import() bırakır,
   * onu da workerd kendisi çözer.
   */
  const mod = (await import(/* webpackIgnore: true */ specifier).catch((e: unknown) => {
    throw new Error(
      `cloudflare:sockets yüklenemedi — Workers dışı bir ortamda mı çalışıyoruz? ${String(e)}`,
    );
  })) as { connect: ConnectFn };
  return mod.connect;
}

const CRLF = '\r\n';
const enc = new TextEncoder();
const dec = new TextDecoder();

function b64(input: string): string {
  // btoa yalnız Latin1 kabul ediyor; UTF-8 baytlarına kendimiz çeviriyoruz ki
  // ASCII olmayan parola veya başlık sessizce patlamasın.
  const bytes = enc.encode(input);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

/**
 * ASCII dışı karakter içeren başlıklar RFC 2047 ile kodlanır. Kodlanmazsa
 * Türkçe konu satırları alıcıda bozuk görünür.
 */
export function encodeHeader(value: string): string {
  // eslint-disable-next-line no-control-regex
  return /^[\x20-\x7E]*$/.test(value) ? value : `=?UTF-8?B?${b64(value)}?=`;
}

/**
 * DATA gövdesinde satır başındaki tek nokta gövdenin sonu sayılıyor.
 * Kaçırılmazsa nokta ile başlayan bir satır maili yarıda keser.
 */
export function dotStuff(body: string): string {
  return body.replace(/\r\n\./g, '\r\n..').replace(/^\./, '..');
}

function base64Body(text: string): string {
  const raw = b64(text);
  return (raw.match(/.{1,76}/g) ?? []).join(CRLF);
}

export type MailAddress = { name?: string; email: string };

function formatAddress(a: MailAddress): string {
  return a.name ? `${encodeHeader(a.name)} <${a.email}>` : a.email;
}

export type MimeInput = {
  from: MailAddress;
  to: string[];
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
  date?: string;
  boundary?: string;
  messageId?: string;
};

/**
 * multipart/alternative gövde. Her iki parça da base64 — satır uzunluğu ve
 * kodlama sorunlarını tek seferde kapatıyor.
 */
export function buildMime(input: MimeInput): string {
  const boundary = input.boundary ?? `indoles-${Math.random().toString(36).slice(2)}`;
  const headers = [
    `From: ${formatAddress(input.from)}`,
    `To: ${input.to.join(', ')}`,
    ...(input.replyTo ? [`Reply-To: ${input.replyTo}`] : []),
    `Subject: ${encodeHeader(input.subject)}`,
    `Date: ${input.date ?? new Date().toUTCString()}`,
    ...(input.messageId ? [`Message-ID: ${input.messageId}`] : []),
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
  ];
  const parts = [
    `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    base64Body(input.text),
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    base64Body(input.html),
    `--${boundary}--`,
  ];
  return [...headers, '', ...parts].join(CRLF);
}

/** Satır bazlı okuyucu: SMTP yanıtları çok satırlı olabiliyor (`250-...`). */
class Reader {
  private buf = '';
  constructor(private reader: ReadableStreamDefaultReader<Uint8Array>) {}

  /** startTls öncesi: kilidi bırak ki akış yeni TLS soketine devredilebilsin. */
  release(): void {
    this.reader.releaseLock();
  }

  async readResponse(): Promise<{ code: number; text: string }> {
    for (;;) {
      const lines = this.buf.split(CRLF);
      // Son eleman yarım satır olabilir; tam satırlar arasında bitirici ara.
      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i] ?? '';
        // Bitirici satır: "250 mesaj" (4. karakter boşluk). "250-" devam ediyor.
        if (/^\d{3} /.test(line)) {
          const consumed = lines.slice(0, i + 1).join(CRLF) + CRLF;
          this.buf = this.buf.slice(consumed.length);
          return { code: Number(line.slice(0, 3)), text: lines.slice(0, i + 1).join('\n') };
        }
      }
      const { value, done } = await this.reader.read();
      if (done) throw new Error(`SMTP bağlantısı beklenmedik şekilde kapandı: ${this.buf.slice(0, 200)}`);
      this.buf += dec.decode(value, { stream: true });
    }
  }
}

export type SmtpOptions = {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: MailAddress;
  to: string[];
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
};

export async function sendSmtpMail(o: SmtpOptions): Promise<void> {
  const connect = await loadConnect();
  const implicitTls = o.port === 465;
  let socket = connect(
    { hostname: o.host, port: o.port },
    { secureTransport: implicitTls ? 'on' : 'starttls', allowHalfOpen: false },
  );

  let writer = socket.writable.getWriter();
  let reader = new Reader(socket.readable.getReader());

  const expect = async (want: number[], step: string) => {
    const r = await reader.readResponse();
    if (!want.includes(r.code)) throw new Error(`SMTP ${step} başarısız: ${r.code} ${r.text}`);
    return r;
  };
  const send = async (line: string) => writer.write(enc.encode(line + CRLF));

  try {
    await expect([220], 'karşılama');
    await send(`EHLO ${o.host}`);
    await expect([250], 'EHLO');

    if (!implicitTls) {
      await send('STARTTLS');
      await expect([220], 'STARTTLS');
      /**
       * Kilitler bırakılır, akış KAPATILMAZ: `writer.close()` yazma yarısını
       * kapatır ve sunucu bağlantıyı FIN ile sonlandırır — TLS'e yükselecek
       * bağlantı kalmaz. `releaseLock` yalnız tutamacı bırakır; startTls aynı
       * bağlantının üstüne TLS kurar.
       */
      writer.releaseLock();
      reader.release();
      socket = socket.startTls();
      writer = socket.writable.getWriter();
      reader = new Reader(socket.readable.getReader());
      await send(`EHLO ${o.host}`);
      await expect([250], 'TLS sonrası EHLO');
    }

    await send('AUTH LOGIN');
    await expect([334], 'AUTH LOGIN');
    await send(b64(o.user));
    await expect([334], 'kullanıcı adı');
    await send(b64(o.pass));
    await expect([235], 'kimlik doğrulama');

    await send(`MAIL FROM:<${o.from.email}>`);
    await expect([250], 'MAIL FROM');
    for (const rcpt of o.to) {
      await send(`RCPT TO:<${rcpt}>`);
      await expect([250, 251], `RCPT TO ${rcpt}`);
    }

    await send('DATA');
    await expect([354], 'DATA');
    const mime = buildMime({
      from: o.from,
      to: o.to,
      ...(o.replyTo ? { replyTo: o.replyTo } : {}),
      subject: o.subject,
      text: o.text,
      html: o.html,
    });
    await send(dotStuff(mime) + CRLF + '.');
    await expect([250], 'gövde teslimi');

    await send('QUIT');
  } finally {
    await writer.close().catch(() => {});
    await socket.close().catch(() => {});
  }
}
