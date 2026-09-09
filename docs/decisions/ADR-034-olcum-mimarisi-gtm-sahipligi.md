# ADR-034 — GA4'ü GTM sahiplenir; çift sayım ve parametre sızıntısı kapatılır

- **Statü:** Kabul edildi
- **Tarih:** 2026-09-09
- **Karar veren:** Burak Arda Özgül
- **Bağlam:** Ölçüm sisteminin uçtan uca denetimi (GTM + GA4 + Meta)
- **İlgili:** ADR-021 (GA4 tek sağlayıcı — değiştirir) · ADR-033 (GTM eklenir — kısmen değiştirir)
- **Etkilenen dosyalar:** `src/lib/analytics/{ga,events,ga-bootstrap}.ts`, `src/lib/popup/analytics.ts`, `src/app/layout.tsx`, GTM konteyneri `GTM-TFKLN9V`, GA4 mülkü `553152492`

## Bağlam

ADR-033 mimariyi şöyle kurmuştu: GA4 doğrudan `gtag` ile ölçülür, GTM yalnız
Meta Pixel ve Google Ads etiketlerini taşır. Denetim üç şeyin de fiilen
böyle olmadığını gösterdi.

**1. Sitedeki GA4 script etiketi ölüydü.** `layout.tsx`,
`https://www.googletagmanager.com/gtag/js?id=G-HC44KJ9ZP4` yüklüyordu. O adres
bu ölçüm kimliği için **HTTP 404 + `text/html`** dönüyor; Chrome yanıtı ORB ile
blokluyor (`net::ERR_BLOCKED_BY_ORB`). Karşılaştırma net: aynı adres
`G-236D96V8XL` ve başka kimliklerle `200 application/javascript` dönüyor,
`gtag/destination?id=G-HC44KJ9ZP4` de `200` dönüyor. Yani sorun ağ ya da tarayıcı
değil, tam olarak bu kimlik + bu uç nokta.

GA4 buna rağmen ölçüyordu — çünkü gtag çekirdeğini `gtm.js` sağlıyordu.
Açılış script'inin `dataLayer`a bıraktığı `config` komutunu GTM konteyneri
işliyordu. Yani ADR-033'ün kararı zaten tersine dönmüştü: GTM kaldırılsa
ölçüm tamamen dururdu, ve bunu hiçbir yer yazmıyordu.

**2. Her olay GA4'e iki kez gidiyordu.** `ga.ts` olayı iki biçimde yazıyordu:
`gtag('event', …)` (bu `dataLayer`a bir `arguments` nesnesi düşürür) ve ayrıca
açık bir `{event: …}` push'u. İkincisinin gerekçesi GTM'in Custom Event
tetikleyicisinin yalnız `{event: …}` biçimini gördüğü varsayımıydı.
**Varsayım yanlıştı:** GTM gtag'in `arguments` push'unu da olay olarak tanıyor.
Konteynere sonradan bir GA4 olay etiketi (`GA4 - Olay Koprusu`) eklenince her
iki kayıt da onu ateşledi.

Canlıda ölçüldü — tek bir üretim çağrısı, iki `/g/collect`:

```
en=tool_roadmap_item_expanded                                        ← parametresiz
en=tool_roadmap_item_expanded&ep.slug=…&ep.category=…&ep.locale=…    ← doğru
```

İlk kopya parametresiz gidiyor çünkü `arguments` push'u `dataLayer`ın üst düzey
anahtarlarını güncellemiyor; GTM'in Data Layer Variable'ları o an hâlâ eski
değeri (ya da hiçbir şeyi) görüyor. Sonuç: tüm olay sayıları ~2×, ve her özel
boyut kırılımının yarısı `(not set)`. Çarpan sabit de değil — ilk sayfa
yüklemesinde `gtag` henüz tanımsız olduğu için görüntüleme olayları tek
sayılıyor, sonrakiler çift. Bölünerek düzeltilemeyecek bir kirlilik.

`ga.ts`'in kendi yorumu bu riski zaten yazmıştı: *"GTM'e bir GA4 etiketi
eklenirse bu değişir — o durumda ya etiket ya `gtag` çağrısı kalmalı, ikisi
birden çift sayım demektir."* Etiket eklendi, çağrı kaldırılmadı.

**3. Parametreler olaylar arası sızıyordu.** GTM'in Data Layer Variable'ları
push'lar arası kalıcı. Yalnız `{event:'pillar_viewed', pillar, locale}` push
edildiğinde GA4'e giden:

```
en=pillar_viewed&ep.slug=cro&ep.pillar=…&ep.locale=tr&ep.surface=service
```

`slug` ve `surface` bir önceki olaydan kalmaydı. Her olay öncekinin
parametrelerini miras alıyordu ve hiçbir rapor bunu görünür kılmıyordu.

Ayrıca kayıtsız bir parametre bulundu: `popup_booking_submitted`
`preferred_slot` gönderiyordu ama ne `PopupEventMap` sözleşmesinde, ne GTM'de,
ne GA4'te vardı — hem sızıyor hem hiç raporlanmıyordu.

## Karar

**GA4'ü GTM sahiplenir.** Sitedeki `gtag/js` script etiketi ve `gtag('config')`
çağrısı kaldırılır; GA4'ü konteynerdeki tek Google etiketi yapılandırır.
Örtük bağımlılık açık hâle gelir. ADR-021'in "tek sağlayıcı" kararı ölçüm
sağlayıcısı için korunur (hâlâ yalnız GA4), taşıyıcı değişir.

Rıza sinyalleri (`consent default/update`) sitede kalır ve GTM'den **önce**
basılır — konteyner etiketlerini değerlendirmeye başladığında rıza durumu
yerinde olmalı. Bunlar olay değil, sinyal.

**Olay `dataLayer`a TEK kayıt olarak yazılır.** `gaEvent` artık
`gtag('event', …)` çağırmıyor. Bir eylem → bir `dataLayer` kaydı → bir GA4 olayı.

**Her olay önceki olayın parametrelerini temizler.** `gaEvent` kaydı
`{event, ...tümParametrelerUndefined, ...olayınParametreleri}` biçiminde yazar.
GTM modelinde `undefined` olan anahtar için değişken de `undefined` döner ve
parametre hiç gönderilmez.

**Parametre adları kapalı bir kümedir.** `EVENT_PARAM_NAMES` (`events.ts`) tek
kaynak; `EventParams` tipi ona bağlı. Kayıtsız bir ad artık **derleme hatası** —
teste değil derleyiciye bağlı, çünkü kaçan ad iki sessiz hata birden üretiyor
(sızıntı + raporda görünmeme). `PopupEventMap` için de ayrı bir derleme
zamanı iddiası var.

**Olay tanımı kodda kalır.** GTM yalnız taşıyıcı: taksonomi `events.ts`te tipli
ve testli. GTM'deki köprü etiketinin parametre listesi `EVENT_PARAM_NAMES` ile
birebir aynı olmalı — orada olup GTM'de olmayan parametre GA4'e ulaşmaz.

**Tıklama dönüşümleri GTM'e ait.** `tel:` ve `mailto:` linkleri üç/dört
bileşende ve bazıları RSC; her birine istemci sarmalayıcı eklemek yerine GTM'in
"Just Links" tetikleyicisi kullanılır. Bunlar köprü tetikleyicisinin regex'ine
**bilerek eklenmez** — kendi GA4 etiketleri var, eklenirse çift sayılır.

## Konteyner temizliği

Silinenler (hepsi zaten duraklatılmıştı ya da hiç çalışmıyordu):

| Kaynak | Neden |
|---|---|
| `KOD - CF7 Dinleyici`, iki CF7 tetikleyicisi | WordPress Contact Form 7 kalıntısı |
| `Ads - Dönüşüm - İletişim Formu` | CF7 tetikleyicili **ve** yanlış Ads hesabı (`585141919`; GA4'e bağlı hesap `3719440582`) |
| `Google Analytics Ayarları` değişkeni | `UA-126757873-1` — Universal Analytics 2023'te kapandı |
| İki adet `G-236D96V8XL` Google etiketi | Eski GA4 mülkü |
| `Meta Pixel - Temel Kod`, `Meta Pixel - Lead` | ADR-033 ile koda alındı (`meta-pixel.ts`); açılırsa çift `Lead` |

Korunanlar: `Dönüşüm Bağlayıcı` (Ads için gerekli) ve dört lead tetikleyicisi
(`22`–`25`) + `Consent - Pazarlama Rizasi Verildi` (`30`) — Google Ads dönüşüm
etiketleri kurulunca bunlara bağlanacak.

Konteyner 10 etiketten 5'e indi; kalanların hepsi aktif ve amaçlı.

## Dönüşüm tanımlarının düzeltilmesi

Denetim, dönüşüm sayımının da bozuk olduğunu gösterdi ve ADR aynı oturumda
şunları kapsayacak şekilde genişletildi (Burak kararı):

**Ölçülmeyen bir dönüşüm vardı.** `/iletisim`in gömülü randevu ekranı yalnız
`brief_submitted` yazıyordu ve o olay anahtar olay değil — popup da aynı olayı
yazdığı için anahtar yapılsaydı popup gönderimleri iki dönüşüm sayardı. Sonuç:
iletişim sayfasından gelen randevular hiçbir dönüşüme sayılmıyordu. Taksonomiye
`contact_booking_submitted` eklendi; Meta tarafında da `Lead` sayılıyor.

**Ölü dönüşümler silindi.** `qualify_lead` ve `close_convert_lead` GA4
varsayılanlarıydı ve sitede hiç emit edilmiyorlar. `diagnoo_report_requested`
`tool_report_requested`ten türetildiği için bir Diagnoo raporu iki dönüşüm
sayıyordu — türetilmiş olay raporlamada kaldı, anahtar olmaktan çıktı.
`purchase` silinemedi (GA4 sabit varsayılanı, `"The event cannot be deleted."`);
hiç emit edilmediği için 0 katkı veriyor.

**Kural yazıldı:** her lead yüzeyi tam olarak bir dönüşüm üretir. Liste tek
kaynakta (`SITE_KEY_EVENTS`, `ga4-admin.ts`) ve `pnpm ga4:setup` onu idempotent
uyguluyor — önceden script tek bir Diagnoo anahtar olayı kuruyordu ve yeniden
çalıştırıldığında silinen dönüşümü geri getirirdi.

**Google Ads dönüşümleri GA4'ten içe aktarılacak** (Burak kararı): GTM'de Ads
etiketi kurulmuyor, dönüşüm tanımı tek yerde kalıyor. Bkz. `docs/12` §2.8.

## Sonuçlar

- Artı: Olay sayıları gerçek. Çift sayım ve parametre sızıntısı yapısal olarak
  imkânsız hâle geldi (biri tek yazımla, öbürü kapalı tiple).
- Artı: `gtag/js` 404'üne olan örtük bağımlılık açık ve belgeli.
- Artı: GA4'te 26 özel boyut + 3 özel metrik kayıtlı — popup hunisi ve iletişim
  formu kırılımları ilk kez raporlanabilir.
- Eksi: GTM yüklenmezse (reklam engelleyici) GA4 hiç ölçmez. Önceden de fiilen
  böyleydi, ama artık tasarım gereği böyle.
- Eksi: **Geçmiş veri kirli.** 2026-09-08 (mülk kurulumu) ile 2026-09-09
  arasındaki olay sayıları şişkin ve kırılımların yarısı `(not set)`.
  Karşılaştırmalarda bu aralık dışlanmalı.
- Artı: Dönüşüm sayımı yüzey başına tekil; `/iletisim` randevusu ilk kez
  ölçülüyor. Google Ads bu listeyi GA4'ten içe aktarabilir.
- Açık kalan: Ads tarafındaki içe aktarma Ads arayüzünden yapılmalı (API'de
  değil). Bkz. `docs/12` §2.8.

## Yayın

Konteyner sürüm **16** — "ADR-034 — Ölçüm Düzeltmesi(Yeniden kurulum)",
2026-09-09'da yayınlandı: 5 etiket, 8 tetikleyici, 31 değişken.
`contact_booking_submitted` köprü tetikleyicisinin regex'ine sonradan eklendi
ve **ayrı bir workspace'te** (`ADR-034b`) bekliyor — yayınlanmadan o dönüşüm
GA4'e ulaşmaz.
