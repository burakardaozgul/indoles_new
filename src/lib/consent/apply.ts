import type { ConsentState } from "./cookie";
import { MARKETING_CONSENT_EVENT } from "@/lib/analytics/ga-bootstrap";
import { loadMetaPixel } from "@/lib/analytics/meta-pixel";

type GtagWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
};

/**
 * Ziyaretçinin kararını Google'a bildirir.
 *
 * ADR-033 ÖNCESİ DURUM
 * --------------------
 * Yalnız `analytics_storage` güncelleniyordu; `ad_*` her bölgede `denied`
 * sabitlenmişti çünkü site hiçbir reklam ürünü kullanmıyordu. Google Ads
 * ve Meta devreye girince bu geçersiz kaldı: reklam sinyalleri kapalıyken
 * dönüşüm ölçümü çalışmaz, etiketler yalnız modellemeye düşer.
 *
 * ÜÇ REKLAM SİNYALİ TEK KARARDAN
 * ------------------------------
 * `ad_storage`, `ad_user_data` ve `ad_personalization` ayrı ayrı
 * sorulmuyor, üçü de pazarlama onayına bağlı. Ziyaretçiye üç ayrı teknik
 * kavramı ayrıştırtmak anlamlı bir seçim üretmez; sorulan şey "reklam
 * amacıyla izlenmeyi kabul ediyor musun" sorusudur ve karşılığı bu üçüdür.
 *
 * Ret de bildirilir: varsayılan zaten `denied`, ama `update` göndermek
 * Google'a "kullanıcı karar verdi" der ve modelleme buna göre çalışır.
 */
export function applyConsent(state: ConsentState): void {
  if (typeof window === "undefined") return;
  const gtag = (window as GtagWindow).gtag;
  // GA kimliği tanımsızken script hiç basılmaz; banner yine çalışır.
  if (typeof gtag !== "function") return;

  gtag("consent", "update", {
    analytics_storage: state.analytics,
    ad_storage: state.marketing,
    ad_user_data: state.marketing,
    ad_personalization: state.marketing,
  });

  // Reklam etiketleri bu olaya bağlı — gerekçe `MARKETING_CONSENT_EVENT`
  // tanımında. Şeritte "Kabul et" denen an da, sonraki sayfa yüklemeleri
  // de (açılış script'i) aynı olayı basar.
  if (state.marketing === "granted") {
    const w = window as GtagWindow;
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event: MARKETING_CONSENT_EVENT });
    // Pixel GTM'de değil kodda: gerekçe `meta-pixel.ts` başlığında.
    loadMetaPixel(process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "");
  }
}
