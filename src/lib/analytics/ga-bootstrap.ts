import { CONSENT_REGIONS } from "../consent/region";

/**
 * GA4 açılış script'i — Consent Mode v2 ile birlikte.
 *
 * NEDEN AYRI BİR FONKSİYON
 * ------------------------
 * Bu dizge `layout.tsx` içinde satır içi duruyordu ve test edilemiyordu.
 * Test edilmesi gereken tek bir şey var ama o şey pahalı: **`consent`
 * `default` komutları `config`ten önce basılmalı.** Sıra bozulursa hiçbir
 * hata çıkmaz, sayfa normal çalışır, yalnız EEA ziyaretçisinin ilk
 * `page_view`i onaysız gider. Sessiz uyum hatası — ancak testle yakalanır.
 *
 * NEDEN İKİ VARSAYILAN
 * --------------------
 * Bölgesel karar (docs/14 §3): EEA + Birleşik Krallık'ta analitik opt-in,
 * diğer bölgelerde varsayılan açık. Google `default` komutunda birden çok
 * bölge tanımına izin veriyor ve **daha özgül bölge kazanıyor**; bölgesiz
 * varsayılan da genel kural olarak kalıyor. Bu yüzden önce bölgeye bağlı
 * `denied`, sonra bölgesiz `granted` basılır.
 *
 * REKLAM SİNYALLERİ
 * -----------------
 * Dördü de bildirilir (v2 gereği) ama `ad_*` her yerde `denied`: INDOLES
 * Google reklam ürünlerini bu site üzerinden kullanmıyor. Bildirmeyip
 * boş bırakmak "belirtilmemiş" sayılır ve modellemeyi bozar.
 */
export function buildGaBootstrap(gaId: string): string {
  const denied = {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    region: CONSENT_REGIONS,
  };

  const granted = {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "granted",
  };

  // `JSON.stringify` hem nesneleri hem ölçüm kimliğini kaçırır: kimlik
  // env'den geliyor ve tırnak taşıyan bozuk bir değer script'i kırmamalı.
  return (
    `window.dataLayer=window.dataLayer||[];` +
    `function gtag(){dataLayer.push(arguments)}` +
    `gtag('consent','default',${JSON.stringify(denied)});` +
    `gtag('consent','default',${JSON.stringify(granted)});` +
    `gtag('js',new Date());` +
    `gtag('config',${JSON.stringify(gaId)});`
  );
}
