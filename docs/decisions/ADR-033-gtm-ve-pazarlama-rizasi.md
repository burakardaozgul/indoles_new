# ADR-033 — GTM eklenir, pazarlama çerezi ayrı rızaya bağlanır

- **Statü:** Kabul edildi
- **Tarih:** 2026-09-08
- **Karar veren:** Burak Arda Özgül
- **Bağlam:** Google Ads ve Meta reklamlarının başlaması; GA4 ölçüm kurulumu oturumu
- **İlgili:** ADR-021 (GA4 tek sağlayıcı — kısmen değiştirir) · ADR-024 (Cloudflare Workers) · `docs/14-privacy-kvkk.md` §3 (bölgesel onay kararı)
- **Etkilenen dosyalar:** `src/lib/consent/{cookie,apply,gate,middleware}.ts`, `src/components/marketing/consent-banner.tsx`, `src/lib/analytics/ga-bootstrap.ts`, `src/app/layout.tsx`, `src/app/(marketing)/[locale]/layout.tsx`, `messages/{tr,en}.json`, `docs/12-analytics-measurement.md`, `docs/14-privacy-kvkk.md`

## Bağlam

Site bugüne kadar hiç reklam ürünü kullanmadı. Ölçüm mimarisi bu varsayım üzerine kuruluydu ve varsayımı üç yerde sabitliyordu:

1. `ga-bootstrap.ts` `ad_storage`, `ad_user_data`, `ad_personalization` sinyallerini **her bölgede** `denied` bildiriyordu.
2. `apply.ts` yalnız `analytics_storage`'ı güncelliyordu; yorumu gerekçeyi açıkça yazıyordu — "sormadığımız bir şey için izin verildiğini iddia etmek olurdu".
3. Çerez onayı tek boyutluydu (`"granted" | "denied"`) ve şerit yalnız EEA/UK'de gösteriliyordu; Türkiye'de analitik varsayılan açıktı (docs/14 §3).

Google Ads ve Meta devreye girince bu yapı hem teknik hem hukuki olarak geçersiz kaldı. Reklam sinyalleri kapalıyken dönüşüm ölçümü çalışmaz, etiketler yalnız modellemeye düşer. Daha önemlisi KVKK m.5 ve GDPR pazarlama çerezinde açık rıza istiyor ve bunu analitik için öne sürülebilen meşru menfaat kapsamına sokmuyor — pazarlama rızası analitik rızasının arkasına saklanamaz.

Ayrıca iki sessiz hata bulundu: `middleware.ts` `x-vercel-ip-country` okuyordu ama ADR-024 ile Cloudflare Workers'a geçilmişti; başlık hiç gelmediği için herkes `other` sayılıyor, **EEA ziyaretçilerine şerit hiç çıkmıyordu**. `ga4-admin.ts`'te bir `displayName` apostrof taşıyordu ve GA4 Admin API'si bunu HTTP 400 ile reddediyordu — kurulum hiç çalıştırılmadığı için görülmemişti.

## Karar

**GTM eklenir ama GA4'ü devralmaz.** Konteyner (`GTM-TFKLN9V`) yalnız Meta Pixel ve Google Ads etiketlerini taşır; GA4 doğrudan `gtag` ile ölçülmeye devam eder. ADR-021'in "tek sağlayıcı" kararı ölçüm için korunur, reklam etiketleri için gevşetilir. Gerekçe: olay taksonomisinin en değerli yanı `events.ts`te tipli ve testli olması; GTM'e devredilseydi derleyici ve test güvencesi kaybolurdu. GTM'in çözdüğü sorun etiket yönetimi, olay tanımı değil.

**Onay kategorilenir.** `ConsentState = { analytics, marketing }`. Üç reklam sinyali tek `marketing` kararına bağlanır — ziyaretçiye üç ayrı teknik kavramı ayrıştırtmak anlamlı bir seçim üretmez.

**Şerit her bölgede gösterilir, bölge yalnız içeriği belirler.** EEA/UK'de analitik ve pazarlama birlikte sorulur. Diğer bölgelerde yalnız pazarlama sorulur; analitik varsayılan açık kalır (docs/14 §3 korunur) ve "Reddet" onu kapatmaz — kapatsaydı hiç sorulmamış bir soruya verilmiş cevap gibi davranmış olurduk.

**Çerez biçimi iki harf** (`gd` = analitik açık, pazarlama kapalı). JSON ya da virgüllü biçimler kaçış gerektirir; bir ara katman kaçışı bozarsa onay sessizce okunamaz hâle gelir. ADR-033 öncesi tek kelimelik çerezler analitik kararı olarak korunur, pazarlama `denied` sayılır.

**Telefon dönüşümü GTM'de yakalanır**, kodda olay tanımlanmaz. `tel:` linkleri üç bileşende ve biri RSC; her birine istemci sarmalayıcı eklemek yerine GTM'in "Just Links" tetikleyicisi kullanılır.

## Canlı doğrulamada çıkan iki düzeltme (2026-09-08)

**Rıza yalnız bir kez bildiriliyordu.** Consent Mode'da `default` her sayfada basılır ama `update` yalnız şeride tıklandığı an gönderiliyordu. Karar çerezde dursa bile sonraki sayfalarda tüm sinyaller varsayılana — `denied`e — düşüyordu; onay vermiş ziyaretçide bile ikinci sayfadan itibaren Meta Pixel hiç yüklenmez, EEA'da GA4 ölçmezdi. Hata ADR-033 öncesinde de vardı, kategorilendirme görünür yaptı. Açılış script'i artık çerezdeki kararı her yüklemede yeniden bildiriyor (`CONSENT_REPLAY`).

**GTM'in ek izin kontrolü tek başına yetmedi.** Tag Assistant rıza durumunu doğru okuyordu (dört sinyal de "İzin verildi") ama `All Pages` tetikleyicisi Meta Pixel için hiç değerlendirilmedi: sayfada iki kapsayıcı yükleniyor (gtag'in Google tag'i ve GTM) ve `gtm.js` olayı ikisi arasında bölünüyor. Reklam etiketleri artık açık bir olaya bağlı (`consent_marketing_granted`); etiketteki `ad_storage` koşulu yerinde kaldı — olay tetikler, koşul güvenceye alır. Davranış GTM'in dahili consent kuyruğuna bırakılmadı.

**Olaylar GTM'e görünür değildi.** `gtag('event', ...)` `dataLayer`a `arguments` nesnesi yazar; GTM'in Custom Event tetikleyicisi yalnız `{event: ...}` biçimini görür. `ga.ts` artık her olayı ikinci bir kayıtla `dataLayer`a da yazıyor — bu olmadan kurulan hiçbir dönüşüm tetikleyicisi ateşlenmezdi ve hata da vermezdi.

**Meta Pixel GTM'den koda alındı.** Pixel önce GTM'de Custom HTML etiketi olarak kuruldu ve hiç ateşlenmedi. Canlı doğrulamada sırayla elendi: tarayıcı engeli yok (`fbevents.js` elle yüklendi), konteyner güncel (yayınlanan `gtm.js` içinde tetikleyici ve pixel kimliği var), etiket HTML'i kusursuz, `dataLayer` sırası doğru, tetikleyici olayı elle basıldığında da ateşlenmedi, etiket düzeyindeki `ad_storage` koşulu kaldırıldığında da. GTM'in neden çalıştırmadığı dışarıdan görülemedi. Pixel artık `src/lib/analytics/meta-pixel.ts`'te; rıza kapısı `applyConsent` ve `ConsentBanner` üzerinden, "Lead" dönüşümü `track()` içinden tek noktadan gidiyor. GTM'deki etiketler silinmedi, duraklatıldı — sebep bulunursa geri açılabilir.

GTM'de kalanlar: Dönüşüm Bağlayıcı ve telefon tıklaması etiketi. Telefon etiketi henüz canlı doğrulanmadı; aynı sorunu yaşıyorsa o da koda alınır.

## Retargeting ve Conversions API (2026-09-08 akşamı)

**Retargeting sinyalleri.** `meta-events.ts` taksonomi olaylarını Meta standart olaylarına eşliyor: hizmet/paket/vaka görüntüleme ve tamamlanan araç taraması → `ViewContent` (paket fiyatı `value`/`currency` olarak gider, değer bazlı kitleler için), dört dönüşüm olayı → `Lead`. Mikro etkileşimler (`faq_opened`, `persona_axis_clicked`, `pillar_viewed`) bilerek eşlenmedi — kitleleri seyreltir, reklam kararını değiştirmez. Eşleme saf fonksiyon ve testli; `track()` her dönüşümün geçtiği tek kapı olduğu için yeni bir olayda Pixel çağrısını unutmak yapısal olarak mümkün değil.

**Conversions API.** Tarayıcı Pixel'i tek başına eksik ölçüyor (ITP, reklam engelleyiciler, iOS). Aynı olay `/api/meta/capi` üzerinden sunucudan da bildiriliyor; Meta iki kaydı **aynı `event_id`** ile birleştiriyor, dolayısıyla kimlik bir kez üretilip iki yola da veriliyor — ayrışırsa dönüşüm iki kez sayılır. Rıza iki kez denetleniyor: istemcide (Pixel yoksa olay üretilmez) ve sunucuda (uç nokta herkese açık olduğu için çerez tekrar okunur). Olay adı kapalı küme (`Lead`, `ViewContent`) — doğrulanmasaydı veri kaynağına keyfi olay yazılabilirdi. E-posta/telefon ham gitmez: normalize edilip SHA-256'lanır. Erişim jetonu gövdede gider, URL'de değil (sorgu dizesi sunucu loglarına düşer).

**İki tuzak çıktı.** (1) `runtime = "edge"` OpenNext'te derlenmiyor — ADR-024 sonrası tüm route'lar `nodejs` olmalı. (2) Olay ve Pixel yüklemesi ayrı `useEffect`lerde olduğu için React sıra garantisi vermiyordu ve `ViewContent` sessizce kayboluyordu; olaylar artık Pixel hazır olana kadar kuyrukta bekliyor. Kuyruk yalnız rıza çerezden okunduğunda boşaltılıyor — ziyaretçi şeritte yeni onay verdiğinde geçmiş olaylar gönderilmiyor, çünkü onlar rıza verilmeden önce gerçekleşti.

## Sonuçlar

- Artı: Reklam ölçümü rızaya dayalı ve KVKK'da savunulabilir; GA4 taksonomisi tipli kalır; etiket eklemek deploy gerektirmez.
- Artı: EEA ziyaretçilerine şerit nihayet çıkıyor — ADR-024'ten beri süren sessiz uyum hatası kapandı.
- Eksi: Giriş popup'ı artık her bölgede çerez kararı beklediği için daha geç açılıyor. Funnel etkisi ölçülmeli; şerit iki katmanlı engel kurmasın diye bu sıra bilinçli (bkz. `gate.ts`).
- Eksi: Türkiye'de daha önce hiç şerit görmeyen ziyaretçiler artık görüyor; dönüşüme etkisi izlenmeli.
- GA4 özel boyutları GTM'den tanımlanamaz — mülk yetkisi gerektirir ve bu ADR onu çözmez.
