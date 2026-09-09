/**
 * Meta Pixel — kodda, rızaya bağlı (ADR-033).
 *
 * NEDEN GTM'DE DEĞİL
 * ------------------
 * Pixel önce GTM'de Custom HTML etiketi olarak kuruldu ve hiç ateşlenmedi.
 * Canlı doğrulamada (2026-09-08) sırayla elendi: tarayıcı engeli yok
 * (`fbevents.js` elle yüklendi), konteyner güncel (yayınlanan `gtm.js`
 * içinde tetikleyici ve pixel kimliği var), etiket HTML'i kusursuz,
 * `dataLayer` sırası doğru (`consent:update` → `gtm.js` → olay), tetikleyici
 * olayı elle basıldığında da ateşlenmedi, etiket düzeyindeki `ad_storage`
 * koşulu kaldırıldığında da. GTM'in neden çalıştırmadığı dışarıdan
 * görülemiyor.
 *
 * Kodda tutmanın karşılığı: yükleme anı deterministik, rıza kapısı tek
 * yerde ve testli, davranış GTM sürümlerinden bağımsız.
 *
 * RIZA KAPISI
 * -----------
 * Yalnız pazarlama onayı verilmişse yüklenir. İki giriş noktası var ve
 * ikisi de aynı kapıdan geçer: sayfa yüklenirken çerezden okunan karar,
 * ve şeritte "Kabul et" denen an (`applyConsent`).
 */

type PixelWindow = Window & {
  fbq?: ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[] };
  _fbq?: unknown;
};

const SCRIPT_SRC = "https://connect.facebook.net/en_US/fbevents.js";

type PendingEvent = {
  name: string;
  params?: Record<string, string | number | readonly string[]>;
};

/**
 * Pixel hazır olmadan tetiklenen olaylar.
 *
 * NEDEN GEREKLİ
 * -------------
 * `ConsentBanner` Pixel'i bir `useEffect`te yüklüyor, `TrackView` olayı
 * başka bir `useEffect`te basıyor; React ikisinin sırasını garanti etmiyor.
 * Olay önce gelirse Pixel yoktur ve sessizce kaybolur — canlı doğrulamada
 * hizmet sayfasının `ViewContent`i tam olarak böyle kayboldu (2026-09-08).
 *
 * Sınır var: rıza hiç verilmezse kuyruk sayfa ömrü boyunca birikir.
 */
const MAX_PENDING = 20;
let pending: PendingEvent[] = [];

/**
 * Pixel'i yükler ve `PageView` gönderir. Tekrar çağrılması güvenli:
 * `fbq` zaten tanımlıysa hiçbir şey yapmaz.
 */
export function loadMetaPixel(
  pixelId: string,
  opts?: {
    /**
     * Pixel hazır olmadan biriken olaylar da gönderilsin mi?
     *
     * Çerezde rıza ZATEN varken (sayfa yüklenmesi) `true`: olaylar rıza
     * altında gerçekleşti, yalnız teknik sıra yüzünden gecikti.
     *
     * Ziyaretçi şeritte yeni onay verdiğinde `false`: o andan önce olanlar
     * rızasız gerçekleşmişti, geriye dönük gönderilmemeli.
     */
    flushPending?: boolean;
  },
): void {
  if (typeof window === "undefined" || !pixelId) return;
  const w = window as PixelWindow;
  if (typeof w.fbq === "function") return;

  // Meta'nın resmi açılış kalıbı: `fbq` önce bir kuyruk biriktirici olarak
  // tanımlanır, script yüklenince gerçek uygulama kuyruğu boşaltır. Bu
  // yüzden `init`/`track` çağrıları script'ten önce yapılabilir.
  const fbq = function (...args: unknown[]) {
    const f = fbq as unknown as { callMethod?: (...a: unknown[]) => void; queue: unknown[] };
    if (f.callMethod) f.callMethod(...args);
    else f.queue.push(args);
  } as PixelWindow["fbq"] & { queue: unknown[]; loaded: boolean; version: string; push: unknown };

  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.push = fbq;
  w.fbq = fbq;
  w._fbq = w._fbq ?? fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = SCRIPT_SRC;
  document.head.appendChild(script);

  w.fbq("init", pixelId);
  w.fbq("track", "PageView");

  const queued = pending;
  pending = [];
  if (opts?.flushPending) {
    for (const ev of queued) emit(w, ev.name, ev.params);
  }
}

/**
 * Meta standart olayı gönderir — hem tarayıcı Pixel'ine hem Conversions
 * API'ye, İKİSİNE DE AYNI `eventId` ile.
 *
 * DEDUPLICATION
 * -------------
 * Meta iki kaydı `event_id` üzerinden birleştirir. Kimlikler ayrışırsa
 * aynı dönüşüm iki kez sayılır ve reklam optimizasyonu bozulur; bu yüzden
 * kimlik burada bir kez üretilir ve iki yola da aynısı verilir.
 *
 * Pixel yüklü değilse ikisi de atlanır: pazarlama rızası verilmemişse
 * durum budur ve beklenen davranıştır. Sunucu tarafında da ayrıca çerez
 * kontrolü var (`/api/meta/capi`) — istemciye güvenilmiyor.
 */
export function trackMetaStandardEvent(
  name: string,
  params?: Record<string, string | number | readonly string[]>,
): void {
  if (typeof window === "undefined") return;
  const w = window as PixelWindow;

  // Pixel henüz yüklenmediyse olay kuyruğa alınır; rıza zaten varsa
  // `loadMetaPixel` bunu boşaltır, yoksa hiç gönderilmez.
  if (typeof w.fbq !== "function") {
    if (pending.length < MAX_PENDING) pending.push(params ? { name, params } : { name });
    return;
  }

  emit(w, name, params);
}

function emit(
  w: PixelWindow,
  name: string,
  params?: Record<string, string | number | readonly string[]>,
): void {
  const eventId = newEventId();
  if (params) w.fbq?.("track", name, params, { eventID: eventId });
  else w.fbq?.("track", name, {}, { eventID: eventId });
  sendToCapi(name, eventId, params);
}

/** `crypto.randomUUID` her tarayıcıda yok; sürüm farkında sessizce düşmesin. */
function newEventId(): string {
  const c = globalThis.crypto as Crypto | undefined;
  if (c && typeof c.randomUUID === "function") return c.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

/**
 * Olayın sunucu kopyası. Hata yükseltilmez ve beklenmez: ölçüm sinyali
 * kaybolabilir, ziyaretçinin akışı bundan etkilenmemeli. `keepalive`
 * sayfa geçişinde isteğin iptal edilmesini engeller — dönüşüm olayları
 * çoğu zaman tam da sayfa değişirken tetikleniyor.
 */
function sendToCapi(
  eventName: string,
  eventId: string,
  customData?: Record<string, string | number | readonly string[]>,
): void {
  try {
    void fetch("/api/meta/capi", {
      method: "POST",
      headers: { "content-type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        eventName,
        eventId,
        eventSourceUrl: window.location.href,
        ...(customData ? { customData } : {}),
      }),
    }).catch(() => {});
  } catch {
    // Ağ katmanı hiç kurulamadıysa bile sessiz kal.
  }
}
