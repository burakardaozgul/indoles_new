import type { ConsentValue } from "./cookie";

type GtagWindow = Window & {
  gtag?: (...args: unknown[]) => void;
};

/**
 * Ziyaretçinin kararını Google'a bildirir.
 *
 * Yalnız `analytics_storage` güncellenir. `ad_*` sinyalleri
 * `buildGaBootstrap`ta her bölge için `denied` bildiriliyor ve öyle
 * kalmalı — reklam ürünü kullanılmadığı için onay istemenin de,
 * güncellemenin de karşılığı yok. Burada açmak, sormadığımız bir şey
 * için izin verildiğini iddia etmek olurdu.
 *
 * Ret de bildirilir: bölgesel varsayılan zaten `denied`, ama `update`
 * göndermek Google'a "kullanıcı karar verdi" der ve modelleme buna göre
 * çalışır.
 */
export function applyConsent(value: ConsentValue): void {
  if (typeof window === "undefined") return;
  const gtag = (window as GtagWindow).gtag;
  // GA kimliği tanımsızken script hiç basılmaz; banner yine çalışır.
  if (typeof gtag !== "function") return;
  gtag("consent", "update", { analytics_storage: value });
}
