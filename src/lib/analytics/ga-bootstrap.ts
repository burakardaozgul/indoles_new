import { CONSENT_REGIONS } from "../consent/region";

/**
 * Ölçüm açılış script'i — Consent Mode v2 varsayılanları (ADR-034).
 *
 * NEDEN ARTIK `config` YOK
 * ------------------------
 * Burada `gtag('js')` ve `gtag('config', GA_ID)` da basılıyordu. İkisi de
 * ADR-034 ile kaldırıldı: GA4'ü artık GTM'deki Google etiketi yapılandırıyor.
 * İkisi birden dursaydı aynı ölçüm kimliği iki kez yapılandırılır ve her
 * sayfa yüklemesi iki `page_view` üretirdi (Google'ın kendi uyarısı).
 *
 * Ayrıca `layout.tsx`teki `gtag/js?id=G-HC44KJ9ZP4` script etiketi de
 * kaldırıldı — o adres bu ölçüm kimliği için **404 dönüyor** ve Chrome
 * yanıtı ORB ile blokluyordu (2026-09-09 doğrulaması). Yani gtag çekirdeği
 * zaten oradan değil, `gtm.js`ten geliyordu; bağımlılık artık örtük değil.
 *
 * GERİYE KALAN: `dataLayer` kurulumu, `gtag` kuyruklayıcısı ve rıza
 * sinyalleri. Bunlar GTM'den ÖNCE çalışmak zorunda — konteyner etiketlerini
 * değerlendirmeye başladığında rıza durumu yerinde olsun diye.
 *
 * NEDEN İKİ VARSAYILAN
 * --------------------
 * Bölgesel karar (docs/14 §3, ADR-035): EEA + Birleşik Krallık'ta her şey
 * opt-in; Türkiye ve diğer bölgelerde hem analitik hem pazarlama varsayılan
 * AÇIK ve şerit yalnız bilgilendirir. Google `default` komutunda birden çok
 * bölge tanımına izin veriyor ve **daha özgül bölge kazanıyor**; bölgesiz
 * varsayılan genel kural olarak kalıyor. Bu yüzden önce bölgeye bağlı
 * `denied`, sonra bölgesiz `granted` basılır.
 *
 * REKLAM SİNYALLERİ
 * -----------------
 * Dördü de bildirilir (v2 gereği). ADR-035'e kadar `ad_*` her bölgede
 * `denied` varsayılıyordu; artık yalnız EEA/UK'de. Bildirmeyip boş bırakmak
 * "belirtilmemiş" sayılır ve modellemeyi bozar.
 */
export function buildGaBootstrap(): string {
  // EEA + UK: hiçbir şey sorulmadan açılmaz.
  const regional = {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    region: CONSENT_REGIONS,
  };

  // Türkiye ve diğer bölgeler: varsayılan açık, şerit bilgilendirir (ADR-035).
  const global = {
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
    analytics_storage: "granted",
  };

  return (
    `window.dataLayer=window.dataLayer||[];` +
    `function gtag(){dataLayer.push(arguments)}` +
    `gtag('consent','default',${JSON.stringify(regional)});` +
    `gtag('consent','default',${JSON.stringify(global)});` +
    CONSENT_REPLAY
  );
}

/**
 * Pazarlama rızası verildiğinde `dataLayer`a basılan açık olay.
 *
 * NEDEN CONSENT SİNYALİ YETMEDİ
 * -----------------------------
 * Reklam etiketleri önce GTM'in kendi "ek izin kontrolü" mekanizmasına
 * bağlanmıştı: `All Pages` tetikleyicisi + `ad_storage` koşulu. Canlı
 * doğrulamada (Tag Assistant, 2026-09-08) rıza durumu doğru okunmasına
 * rağmen — dört sinyal de "İzin verildi" — etiketler hiç ateşlenmedi:
 * sayfada iki kapsayıcı yükleniyor (gtag'in Google tag'i ve GTM) ve
 * `gtm.js` olayı ikisi arasında bölündüğü için `All Pages` Meta Pixel
 * için hiç değerlendirilmiyor.
 *
 * Bu olay o belirsizliği ortadan kaldırır: rıza varsa olay basılır,
 * etiket ona bağlanır. Etiketteki `ad_storage` koşulu YERİNDE KALIR —
 * ikisi birlikte çalışır, olay tetikler, koşul güvenceye alır.
 */
export const MARKETING_CONSENT_EVENT = "consent_marketing_granted";

/**
 * Kayıtlı onayı her sayfa yüklemesinde yeniden bildirir.
 *
 * NEDEN GEREKLİ
 * -------------
 * Consent Mode'da `default` her sayfada basılır ama `update` yalnız
 * ziyaretçi şeritte bir düğmeye bastığı an gönderiliyordu. Karar çerezde
 * duruyor olsa bile SONRAKİ sayfalarda sinyaller varsayılana — yani
 * `denied`e — düşüyordu. Sonucu sessiz ve ağırdı: onay vermiş bir
 * ziyaretçide bile ikinci sayfadan itibaren Meta Pixel hiç yüklenmiyor,
 * EEA'da GA4 ölçmüyordu. Hata ADR-033'ten önce de vardı; kategorilendirme
 * onu görünür yaptı (canlı doğrulama, 2026-09-08).
 *
 * Rıza varsayılanlarından SONRA ve GTM yükleyicisinden ÖNCE çalışır: GTM
 * konteyneri etiketlerini değerlendirmeye başladığında güncel rıza durumu
 * yerinde olur.
 *
 * Biçim `cookie.ts` ile aynı: iki harf (`gd`), artı ADR-033 öncesi tek
 * kelimelik değerler. Regex tanımadığı bir değerde hiçbir şey yapmaz —
 * bozuk çerez "onay var" sayılmaz.
 */
const CONSENT_REPLAY =
  `(function(){` +
  `var m=document.cookie.match(/(?:^|; )indoles_consent=([gd]{2}|granted|denied)/);` +
  `if(!m)return;var v=m[1],a,b;` +
  `if(v==='granted'){a='granted';b='denied';}` +
  `else if(v==='denied'){a='denied';b='denied';}` +
  `else{a=v.charAt(0)==='g'?'granted':'denied';b=v.charAt(1)==='g'?'granted':'denied';}` +
  `gtag('consent','update',{analytics_storage:a,ad_storage:b,ad_user_data:b,ad_personalization:b});` +
  `})();`;

/**
 * Rıza olayını GTM yükleyicisinden SONRA basar.
 *
 * NEDEN AYRI BİR PARÇA
 * --------------------
 * İki şeyin sırası birbirinin tersi:
 *   - `consent update` GTM'den ÖNCE olmalı — konteyner etiketlerini
 *     değerlendirmeye başladığında rıza durumu yerinde olsun diye.
 *   - Tetikleyici olayı GTM'den SONRA olmalı — konteyner henüz
 *     yüklenmemişken basılan olay, tetikleyici hiç kurulmadığı için
 *     kaybolur. Canlı doğrulamada (2026-09-08) tam olarak bu oldu:
 *     rıza doğru okunuyordu, olay `dataLayer`da görünüyordu, ama Meta
 *     Pixel ateşlenmiyordu.
 *
 * Bu yüzden `CONSENT_REPLAY` bootstrap'ın içinde, olay ise GTM
 * yükleyicisinden sonra ayrı bir parça olarak basılır.
 */
export function buildMarketingConsentEvent(): string {
  return (
    `(function(){` +
    `var m=document.cookie.match(/(?:^|; )indoles_consent=([gd]{2})/);` +
    `if(!m||m[1].charAt(1)!=='g')return;` +
    `window.dataLayer=window.dataLayer||[];` +
    `window.dataLayer.push({event:${JSON.stringify(MARKETING_CONSENT_EVENT)}});` +
    `})();`
  );
}

/**
 * GTM konteyner yükleyicisi (ADR-033).
 *
 * NEDEN AYNI SCRIPT ETİKETİNDE, BOOTSTRAP'TAN SONRA
 * -------------------------------------------------
 * GTM yüklenir yüklenmez kendi etiketlerini değerlendirmeye başlar. Consent
 * `default` komutları o andan önce `dataLayer`da olmalı; olmazsa ilk
 * değerlendirme "belirtilmemiş" durumda yapılır ve Meta/Ads etiketleri
 * rıza gelmeden bir kez ateşlenebilir. İki ayrı `<Script>` etiketi aynı
 * `strategy` ile bile sıra garantisi vermez — Next.js yükleme sırasını
 * korumak zorunda değildir. Tek dizge hâlinde birleştirmek sırayı dilin
 * kendi çalışma sırasına bağlar, yani garantiye alır.
 *
 * ADR-034 ile GA4'ü de bu konteyner taşır: içindeki Google etiketi mülkü
 * yapılandırır, tek GA4 olay etiketi `dataLayer` kayıtlarını iletir. Olay
 * taksonomisi yine `events.ts`te tipli ve testli kalır — GTM yalnız
 * taşıyıcı, olay tanımı hâlâ kodda.
 */
export function buildGtmSnippet(gtmId: string): string {
  return (
    `(function(w,d,s,l,i){w[l]=w[l]||[];` +
    `w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});` +
    `var f=d.getElementsByTagName(s)[0],j=d.createElement(s),` +
    `dl=l!='dataLayer'?'&l='+l:'';j.async=true;` +
    `j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;` +
    `f.parentNode.insertBefore(j,f);})` +
    `(window,document,'script','dataLayer',${JSON.stringify(gtmId)});`
  );
}
