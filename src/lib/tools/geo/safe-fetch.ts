/**
 * SSRF korumalı tarama fetch katmanı. Kullanıcı bir URL girer, motor bu
 * URL'i tarar; girdi kontrolsüz bırakılırsa dahili ağa (localhost, private
 * IP, kendi API'lerimiz) istek zorlanabilir. Spec §2, Görev 7.
 *
 * `validateTargetUrl` iki noktada çağrılır: (1) kullanıcı girdisi üzerinde,
 * (2) `fetchScanTargets` içinde her yanıtın `res.url`'i üzerinde — sunucu
 * izinli bir hedeften izinsiz bir hedefe yönlendirebilir (redirect-based
 * SSRF), bu yüzden ilk kontrol tek başına yetmez.
 *
 * IP-literal reddi kasten geniştir: yalnız private aralıklar (10/8,
 * 172.16/12, 192.168/16, 127/8, 169.254/16) değil, TÜM IP-literal host'lar
 * (v4 ve v6) reddedilir. Gerekçe: WHATWG URL ayrıştırıcısı ondalık/onaltılık/
 * oktal gibi gizlenmiş IPv4 biçimlerini (`2130706433` → `127.0.0.1`) zaten
 * kurallı forma çeviriyor — `hostname` üzerinde tek bir dörtlü-nokta deseni
 * kontrolü bu gizlemeleri de yakalıyor. Ayrıca bu araç bir tarama hedefinin
 * her zaman bir alan adı olmasını bekler; IP ile taranan bir hedefin private
 * olup olmadığını coğrafi/kurumsal DNS bağlamı olmadan güvenle ayırt etmek
 * mümkün değildir (ör. `[::ffff:127.0.0.1]` gibi IPv6-eşlemeli biçimler).
 */

import { Localized } from "@/lib/content/types";

export type ValidateTargetUrlResult = { ok: true; url: URL } | { ok: false; reason: Localized<string> };

const IPV4_LITERAL = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;

const REASON_INVALID_URL: Localized<string> = {
  tr: "Geçersiz adres: bu dizge bir URL olarak ayrıştırılamadı.",
  en: "Invalid address: this string could not be parsed as a URL.",
};

const REASON_PROTOCOL: Localized<string> = {
  tr: "Yalnızca http ve https protokolleri taranabilir.",
  en: "Only the http and https protocols can be scanned.",
};

const REASON_IP_LITERAL: Localized<string> = {
  tr: "IP adresiyle verilen hedefler taranmaz; bir alan adı gerekir.",
  en: "Targets given as a raw IP address are not scanned; a domain name is required.",
};

const REASON_LOCAL_HOST: Localized<string> = {
  tr: "Yerel veya iç ağ adresleri (localhost, .local, .internal) taranmaz.",
  en: "Local or internal network hostnames (localhost, .local, .internal) are not scanned.",
};

const REASON_OWN_API: Localized<string> = {
  tr: "indoles.com.tr altındaki /api/ yolları döngü koruması nedeniyle taranmaz.",
  en: "The /api/ paths under indoles.com.tr are not scanned, to prevent request loops.",
};

/** Host'un IP-literal olup olmadığını denetler — IPv4 dörtlü-nokta veya köşeli parantezli IPv6. */
function isIpLiteralHost(hostname: string): boolean {
  if (hostname.startsWith("[") && hostname.endsWith("]")) return true;
  return IPV4_LITERAL.test(hostname);
}

/** Host'un yerel/iç ağ takma adı sayılıp sayılmadığını denetler. */
function isLocalOrInternalHost(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal")
  );
}

/** Host'un kendi API yüzeyimiz olup olmadığını denetler (indoles.com.tr + alt alan adları). */
function isOwnHost(hostname: string): boolean {
  return hostname === "indoles.com.tr" || hostname.endsWith(".indoles.com.tr");
}

function isOwnApiPath(pathname: string): boolean {
  return pathname === "/api" || pathname.startsWith("/api/");
}

/**
 * Bir tarama hedefinin SSRF reddetme matrisinden geçip geçmediğini
 * denetler. Yalnızca http/https, IP-literal olmayan, yerel/iç ağ olmayan ve
 * kendi `/api/` yüzeyimize düşmeyen hedefler kabul edilir.
 */
export function validateTargetUrl(raw: string): ValidateTargetUrlResult {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return { ok: false, reason: REASON_INVALID_URL };
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { ok: false, reason: REASON_PROTOCOL };
  }

  const hostname = url.hostname.toLowerCase();

  if (isIpLiteralHost(hostname)) {
    return { ok: false, reason: REASON_IP_LITERAL };
  }

  if (isLocalOrInternalHost(hostname)) {
    return { ok: false, reason: REASON_LOCAL_HOST };
  }

  if (isOwnHost(hostname) && isOwnApiPath(url.pathname)) {
    return { ok: false, reason: REASON_OWN_API };
  }

  return { ok: true, url };
}

export const SCANNER_USER_AGENT =
  "INDOLES-GEO-Denetleyici/1.0 (+https://www.indoles.com.tr/tr/araclar/geo-gorunurluk-denetleyicisi)";

const REQUEST_TIMEOUT_MS = 10_000;
const MAX_PAGE_BYTES = 2_000_000;

export type ScanTargets = {
  pageHtml: string;
  robotsTxt: string | null;
  llmsTxt: string | null;
};

/**
 * Doğrudan test amaçlı oluşturulan `Response` nesnelerinde `url` boş
 * dizgedir (Fetch standardı: yalnız gerçek bir ağ isteğinden dönen yanıt bu
 * alanı doldurur). Boşsa hedef zaten çağıran tarafta doğrulanmış demektir —
 * revalidasyon atlanır. Gerçek `fetch` her zaman doldurduğu için üretimde bu
 * kısayol devre dışıdır; SSRF reddi yalnız gerçek yönlendirmelerde çalışır.
 */
function isFinalUrlSafe(res: Response): boolean {
  if (!res.url) return true;
  return validateTargetUrl(res.url).ok;
}

function isHtmlContentType(res: Response): boolean {
  const contentType = res.headers.get("content-type") ?? "";
  return contentType.includes("text/html");
}

/**
 * Yanıt gövdesini `ReadableStream` reader döngüsüyle okur, `maxBytes`'a
 * ulaşınca kalan akışı iptal edip döngüden çıkar. Tüm gövdeyi belleğe alıp
 * sonradan kesmek yerine akış üzerinde erken durmak, kötü niyetli/aşırı
 * büyük bir yanıtın tüm baytlarının işçi belleğine taşınmasını önler.
 */
async function readTruncatedText(res: Response, maxBytes: number): Promise<string> {
  const body = res.body;
  if (!body) return "";

  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done || !value) break;

    const remaining = maxBytes - received;
    const slice = value.byteLength > remaining ? value.subarray(0, remaining) : value;
    chunks.push(slice);
    received += slice.byteLength;

    if (received >= maxBytes) {
      await reader.cancel().catch(() => {});
      break;
    }
  }

  const merged = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return new TextDecoder().decode(merged);
}

/**
 * Hedef sayfayı ve `origin/robots.txt` + `origin/llms.txt`'i paralel çeker.
 * Sayfa erişilemezse (200 dışı durum, `text/html` olmayan içerik türü veya
 * yönlendirme sonrası reddedilen hedef) `Error("target-unreachable")`
 * fırlatılır — bu, motorun skorlayacağı bir veri yok demektir. robots.txt
 * ve llms.txt için aynı durum sert bir hata değil, `null` demektir: bu
 * dosyaların yokluğu motorun kendi kontrol mantığının (ai-access, llms-txt)
 * yorumlayacağı bir sinyaldir, tarama düşmez.
 */
/**
 * Ağ hatası (zaman aşımı, DNS, bağlantı reddi) fırlatan bir isteği `null`'a
 * indirger. robots.txt/llms.txt için bu, 200 dışı durumla aynı anlama gelir
 * (dosya yok say). Sayfa isteği için de aynı yoldan geçer — çağıran taraf
 * `pageRes === null`'ı 200-dışı durumla birlikte tek bir
 * `Error("target-unreachable")`'a indirger; ham ağ hatası (`TypeError:
 * fetch failed`, `AbortError`) hiçbir zaman çağırana sızmaz.
 */
async function safeRequest(
  target: string | URL,
  fetcher: typeof fetch,
  headers: Record<string, string>
): Promise<Response | null> {
  try {
    return await fetcher(target, {
      headers,
      redirect: "follow",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch {
    return null;
  }
}

export async function fetchScanTargets(
  url: URL,
  fetcher: typeof fetch = fetch
): Promise<ScanTargets> {
  const origin = url.origin;
  const headers = { "User-Agent": SCANNER_USER_AGENT };

  const [pageRes, robotsRes, llmsRes] = await Promise.all([
    safeRequest(url, fetcher, headers),
    safeRequest(`${origin}/robots.txt`, fetcher, headers),
    safeRequest(`${origin}/llms.txt`, fetcher, headers),
  ]);

  if (!pageRes || !isFinalUrlSafe(pageRes) || pageRes.status !== 200 || !isHtmlContentType(pageRes)) {
    throw new Error("target-unreachable");
  }

  const pageHtml = await readTruncatedText(pageRes, MAX_PAGE_BYTES);
  const robotsTxt =
    robotsRes && isFinalUrlSafe(robotsRes) && robotsRes.status === 200 ? await robotsRes.text() : null;
  const llmsTxt =
    llmsRes && isFinalUrlSafe(llmsRes) && llmsRes.status === 200 ? await llmsRes.text() : null;

  return { pageHtml, robotsTxt, llmsTxt };
}
