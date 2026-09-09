# ADR-035 — Türkiye'de çerezler varsayılan açık, şerit bilgilendirir

- **Statü:** Kabul edildi
- **Tarih:** 2026-09-09
- **Karar veren:** Burak Arda Özgül
- **Bağlam:** Ölçüm sisteminin uçtan uca denetimi; ADR-033'ün funnel maliyeti
- **İlgili:** ADR-033 (kategorili onay — Türkiye için tersine çevirir) · ADR-034 (ölçüm mimarisi) · `docs/14` §3
- **Etkilenen dosyalar:** `src/lib/analytics/ga-bootstrap.ts`, `src/components/marketing/consent-banner.tsx`, `src/app/(marketing)/[locale]/layout.tsx`, `messages/{tr,en}.json`

## Bağlam

ADR-033 pazarlama çerezini her bölgede açık rızaya bağladı ve şeridi her
ziyaretçiye çıkardı. Kendi "Sonuçlar" bölümü iki maliyeti önceden yazmıştı:

> Eksi: Giriş popup'ı artık her bölgede çerez kararı beklediği için daha geç
> açılıyor. Funnel etkisi ölçülmeli.
> Eksi: Türkiye'de daha önce hiç şerit görmeyen ziyaretçiler artık görüyor;
> dönüşüme etkisi izlenmeli.

Türkiye birincil pazar. Ziyaretçinin ilk gördüğü şeyin bir onay kutusu olması
hem lead hunisinin başına ek bir engel koyuyor hem de reklam ölçümünü rıza
oranına bağlıyor — reddedenlerde Meta ve Ads dönüşümleri hiç ölçülmüyor,
optimizasyon modellemeye düşüyor.

## Karar

**Türkiye ve EEA/UK dışındaki tüm bölgelerde dört Consent Mode sinyali de
varsayılan `granted`.** Şerit kaldırılmıyor ama işlevi değişiyor: soru
sormuyor, **bilgilendiriyor**.

| | EEA + UK | Türkiye ve diğerleri |
|---|---|---|
| Varsayılan | Dört sinyal `denied` | Dört sinyal `granted` |
| Şerit ne yapar | **Sorar** | **Bildirir** |
| Başlık | "Çerez tercihiniz." | "Çerez kullanımı." |
| Düğmeler | Kabul et / **Reddet** | Kabul et / **Kapat** |
| İkinci düğme ne yazar | `dd` (ikisi de kapalı) | `gg` (varsayılanı korur) |
| Meta Pixel | Onay beklenir | İlk sayfada yüklenir |

"Kapat" varsayılanı geri almaz — geri alınacak bir soru sorulmadı. Ayrıntı ve
kapatma yolu aydınlatma metninde (`/tr/gizlilik-kvkk`), şeritten linkli.

**EEA/UK yüzeyi hiç değişmiyor.** Bölgesel `default` komutu Google tarafında
daha özgül olduğu için kazanmaya devam ediyor; "Reddet" hâlâ gerçek bir ret ve
iki düğme hâlâ eşit ağırlıkta gerçek buton (EDPB'nin "eşit kolaylık" şartı ret
düğmesinin bulunduğu yerde geçerli).

**Pixel varsayılandan da yüklenir.** Diğer bölgelerde Pixel şeride
tıklanmasını beklemez. Beklerse "varsayılan açık" kararı yalnız Google
sinyallerinde geçerli olur, Meta'da olmazdı; iki sağlayıcı ayrışır ve dönüşüm
sayıları birbirini tutmazdı.

## Hukuki değerlendirme — bilinçli risk kabulü

Bu, ADR-033'ün kendi hukuki gerekçesini Türkiye için tersine çeviriyor.
ADR-033 şöyle diyordu: *"KVKK m.5 ve GDPR pazarlama çerezinde açık rıza
istiyor ve bunu analitik için öne sürülebilen meşru menfaat kapsamına
sokmuyor."* O değerlendirme geçersiz olmadı; **kabul edilen risk değişti.**

Dayanak, ADR-033 öncesinde analitik için kullanılan gerekçenin aynısı: KVKK'nın
çerez rehberi henüz bağlayıcı bir yaptırım kararına dönüşmedi ve Türkiye
birincil pazar. Fark şu ki bu sefer kapsam pazarlama çerezlerini de içeriyor,
yani risk daha büyük — GDPR'da bu yaklaşım savunulamaz, KVKK'da ise
denetlenmemiş bir alan.

Riski sınırlayan üç şey:
1. **Coğrafi sınır.** EEA/UK ziyaretçisi bu davranışı hiç görmüyor; orada
   opt-in aynen duruyor. Sınır tek listeden okunuyor (`consent/region.ts`),
   dolayısıyla ikisi ayrışamaz.
2. **Şerit duruyor.** Ziyaretçi bilgilendiriliyor ve aydınlatma metnine
   yönlendiriliyor; sessiz izleme yapılmıyor.
3. **Geri dönüş tek dosyada.** `ga-bootstrap.ts`teki `global` nesnesinin dört
   alanı `denied`e çevrilir, banner otomatik olarak soru yüzeyine döner
   (`isEea` mantığı zaten iki varyantı taşıyor).

KVKK tarafında bağlayıcı bir karar çıkarsa bu ADR yeniden değerlendirilir.

## Açık kalan

**Giriş popup'ı hâlâ şerit kararını bekliyor** (`consent/gate.ts`). Gerekçe
ADR-033'te geçerliydi: şerit bir karar kapısıydı ve iki katmanlı engel
kurulmasın diye popup sıraya alınmıştı. Türkiye'de şerit artık karar kapısı
değil, dolayısıyla bu bekleme funnel maliyeti üretiyor ama hukuki bir karşılığı
kalmadı. Değiştirilmedi: popup zamanlamasının lead dönüşümüne etkisi ölçülebilir
bir ürün kararı ve bu ADR'nin kapsamı değil.

## Sonuçlar

- Artı: Türkiye'de ölçüm ve reklam dönüşümü rıza oranına bağlı değil; Ads ve
  Meta optimizasyonu tam sinyalle çalışır.
- Artı: Şerit huninin başında bir karar engeli değil.
- Eksi: KVKK riski ADR-033'e göre arttı ve pazarlama çerezlerini kapsıyor.
- Eksi: Türkiye'de ziyaretçinin çerezleri şeritten kapatma yolu yok; yalnız
  aydınlatma metni üzerinden iletişim. Tercih merkezi eklenirse bu kapanır.
