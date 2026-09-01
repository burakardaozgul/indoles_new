/**
 * SSRF korumalı tarama fetch katmanı. Kullanıcı bir URL girer, motor bu
 * URL'i tarar; girdi kontrolsüz bırakılırsa dahili ağa (localhost, private
 * IP, kendi API'lerimiz) istek zorlanabilir. Spec §2, Görev 7.
 *
 * `validateTargetUrl` iki noktada çağrılır: (1) kullanıcı girdisi üzerinde,
 * (2) `fetchScanTargets` içinde HER yönlendirme hop'unun (`Location`
 * başlığından çözülen) hedefinde. Yönlendirmeler `redirect: "manual"` ile
 * elle takip edilir — `fetch`'in kendi `redirect: "follow"` modu ara
 * adımları asla dışarı vermez, yalnız zincirin son `res.url`'i görünür olur.
 * Bu, public→localhost→public gibi bir ara sekmenin son adımda temiz
 * görünüp gözden kaçmasına yol açardı (fix round 1: iki bağımsız güvenlik
 * incelemesinin ortak bulgusu). En fazla `MAX_REDIRECT_HOPS` hop izlenir;
 * aşılırsa veya herhangi bir hop reddedilirse hedef erişilemez sayılır.
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
 *
 * Host karşılaştırmaları öncesi `hostname`'in sonundaki BİR VEYA DAHA FAZLA
 * nokta kırpılır (`indoles.com.tr.` gibi FQDN gösterimleri, `localhost..`
 * gibi çok-nokta biçimleri dahil). WHATWG URL ayrıştırıcısı bu noktaları
 * domain host'larda korur ve TEKİL değil ÇOĞUL da olabilir (`new
 * URL("http://localhost../").hostname === "localhost.."`); yalnız tek bir
 * nokta kırpan bir kural (`/\.$/`) `localhost..`'yi `localhost.`'e indirger
 * ve dört predicate'in (IP-literal, local/internal, own-API, own-host)
 * hiçbirine uymadan sızardı (final review C-borç, spec Görev 7'nin deferred
 * notu: "final review'da uygula"). Sonek TÜM noktaları kırpan `/\.+$/` ile
 * bu sınıfın tamamı kapatılır — `indoles.com.tr.` hem kendi API döngü
 * korumasını hem de localhost/*.local/*.internal reddini atlatabilirdi (fix
 * round 1, critical).
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

/**
 * Öncü slash sayısından bağımsız `/api/` kontrolü. WHATWG URL ayrıştırıcısı
 * `//api/contact` gibi çift öncü slash'ı normalize ETMEZ (pathname birebir
 * korunur) — sabit `pathname.startsWith("/api/")` kontrolü bu biçimi
 * atlatılabilir bırakırdı (fix round 1, minor).
 */
function isOwnApiPath(pathname: string): boolean {
  const trimmed = pathname.replace(/^\/+/, "");
  return trimmed === "api" || trimmed.startsWith("api/");
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

  // TÜM trailing nokta(lar) kırpılır — bkz. modül başı doküman notu.
  const hostname = url.hostname.toLowerCase().replace(/\.+$/, "");

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
const MAX_BODY_BYTES = 2_000_000;
const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);
const MAX_REDIRECT_HOPS = 3;

export type ScanTargets = {
  pageHtml: string;
  robotsTxt: string | null;
  llmsTxt: string | null;
};

function isHtmlContentType(res: Response): boolean {
  const contentType = (res.headers.get("content-type") ?? "").toLowerCase();
  return contentType.includes("text/html");
}

/**
 * Yanıt gövdesini `ReadableStream` reader döngüsüyle okur, `maxBytes`'a
 * ulaşınca kalan akışı iptal edip döngüden çıkar. Tüm gövdeyi belleğe alıp
 * sonradan kesmek yerine akış üzerinde erken durmak, kötü niyetli/aşırı
 * büyük bir yanıtın tüm baytlarının işçi belleğine taşınmasını önler. Sayfa,
 * robots.txt ve llms.txt — üçü de aynı üst sınırdan geçer (fix round 1: eskiden
 * yalnız sayfa kesiliyordu, robots/llms `.text()` ile sınırsız belleğe
 * alınıyordu — public endpoint'te OOM vektörüydü).
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
 * `redirect: "manual"` ile yönlendirmeleri kendimiz takip ederiz — zincirin
 * yalnız son adımını değil HER hop'unu `validateTargetUrl`'den geçirmek
 * için (bkz. modül başı doküman notu). `Location` başlığı `currentUrl`'e
 * göre çözülür (göreli yönlendirmeler için). Ağ hatası (zaman aşımı, DNS,
 * bağlantı reddi) veya herhangi bir hop'un reddi `null` ile sonuçlanır;
 * ham hata hiçbir zaman çağırana sızmaz — çağıran taraf `null`'ı sayfa için
 * `target-unreachable`'a, robots/llms için "yok say"a çevirir.
 */
async function fetchWithValidatedRedirects(
  initialUrl: URL,
  fetcher: typeof fetch,
  headers: Record<string, string>
): Promise<Response | null> {
  let currentUrl = initialUrl;

  for (let hop = 0; ; hop++) {
    if (!validateTargetUrl(currentUrl.href).ok) return null;

    let res: Response;
    try {
      res = await fetcher(currentUrl, {
        headers,
        redirect: "manual",
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
    } catch {
      return null;
    }

    if (!REDIRECT_STATUSES.has(res.status)) return res;
    if (hop >= MAX_REDIRECT_HOPS) return null;

    const location = res.headers.get("location");
    if (!location) return null;

    try {
      currentUrl = new URL(location, currentUrl);
    } catch {
      return null;
    }
  }
}

/**
 * robots.txt/llms.txt için 200 dışı durumu VE gövde-fazı hatasını (zaman
 * aşımı gövde okurken ateşlenirse, bağlantı kopması) aynı "yok say"
 * sözleşmesine indirger — sert hata değil, `null`. Aksi hâlde gövde
 * okunurken düşen bir hata ham haliyle tüm taramayı düşürürdü (fix round 1,
 * important).
 */
async function readBodyOrNull(res: Response | null, maxBytes: number): Promise<string | null> {
  if (!res || res.status !== 200) return null;
  try {
    return await readTruncatedText(res, maxBytes);
  } catch {
    return null;
  }
}

/**
 * Hedef sayfayı ve `origin/robots.txt` + `origin/llms.txt`'i paralel çeker.
 * Sayfa erişilemezse (200 dışı durum, `text/html` olmayan içerik türü,
 * reddedilen/aşırı uzun yönlendirme zinciri veya gövde-fazı hatası)
 * `Error("target-unreachable")` fırlatılır — bu, motorun skorlayacağı bir
 * veri yok demektir. robots.txt ve llms.txt için aynı durum sert bir hata
 * değil, `null` demektir: bu dosyaların yokluğu motorun kendi kontrol
 * mantığının (ai-access, llms-txt) yorumlayacağı bir sinyaldir, tarama
 * düşmez.
 */
export async function fetchScanTargets(
  url: URL,
  fetcher: typeof fetch = fetch
): Promise<ScanTargets> {
  const origin = url.origin;
  const headers = { "User-Agent": SCANNER_USER_AGENT };

  const [pageRes, robotsRes, llmsRes] = await Promise.all([
    fetchWithValidatedRedirects(url, fetcher, headers),
    fetchWithValidatedRedirects(new URL("/robots.txt", origin), fetcher, headers),
    fetchWithValidatedRedirects(new URL("/llms.txt", origin), fetcher, headers),
  ]);

  if (!pageRes || pageRes.status !== 200 || !isHtmlContentType(pageRes)) {
    throw new Error("target-unreachable");
  }

  let pageHtml: string;
  try {
    pageHtml = await readTruncatedText(pageRes, MAX_BODY_BYTES);
  } catch {
    throw new Error("target-unreachable");
  }

  const robotsTxt = await readBodyOrNull(robotsRes, MAX_BODY_BYTES);
  const llmsTxt = await readBodyOrNull(llmsRes, MAX_BODY_BYTES);

  return { pageHtml, robotsTxt, llmsTxt };
}
