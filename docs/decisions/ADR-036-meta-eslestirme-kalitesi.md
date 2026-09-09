# ADR-036 — Meta eşleştirme kalitesi: Lead sunucudan, tek kapı, kalıcı ziyaretçi kimliği

- **Statü:** Kabul edildi
- **Tarih:** 2026-09-09
- **Karar veren:** Burak Arda Özgül
- **Bağlam:** Meta Events Manager'ın ViewContent olayları için eşleştirme kalitesi (EMQ) tavsiyesi
- **İlgili:** ADR-033 (Meta Pixel + CAPI) · ADR-034 (ölçüm mimarisi) · ADR-035 (varsayılan onay) · `docs/14` §3a
- **Etkilenen dosyalar:** `src/lib/analytics/{ga,meta-events,meta-capi,meta-pixel,visitor-id,meta-lead}.ts`, `src/app/api/{contact,booking,visitor-profile,meta/capi}/route.ts`, `src/app/api/tools/{geo-report,diagnoo-unlock}/route.ts`

## Bağlam

Meta, ViewContent olaylarına şu parametrelerin eklenmesini önerdi ve benzer
reklamverenlerde ek dönüşümlerde **medyan %68.03** artış bildirdi:
`fbc`, `email`, `phone`, `external_id`, `zip`, `dob`, `fn`, `ln`, `ct`, `st`.

Tavsiyeyi uygulamak için kodu incelerken **daha büyük bir hata çıktı.**

**Meta, lead'lerin %60'ını hiç görmüyordu.** Meta'ya giden tek kapı `track()`
idi; `gaEvent()` Meta'yı hiç aramıyordu. `LEAD_EVENTS` listesindeki beş
dönüşümden üçü `gaEvent` ile atılıyor:

| Dönüşüm | Çağrı | Meta'ya gidiyor mu |
|---|---|---|
| `contact_form_submitted` | `gaEvent` (`ContactForm.tsx`) | **Hayır** |
| `popup_booking_submitted` | `trackPopupEvent` → `gaEvent` | **Hayır** |
| `popup_contact_submitted` | `trackPopupEvent` → `gaEvent` | **Hayır** |
| `tool_report_requested` | `track()` | Evet |
| `contact_booking_submitted` | `track()` | Evet |

Eşleme doğruydu, `toMetaEvent` üçünü de `Lead`e çeviriyordu, birim testleri de
geçiyordu — çünkü test edilen şey saf fonksiyondu ve o çalışıyordu. Sorun onu
o üç olay için **kimsenin çağırmaması**. `ga.ts`'in kendi yorumu tersini iddia
ediyordu: *"`track` her dönüşümün geçtiği tek kapı olduğu için yeni bir olay
eklendiğinde Pixel çağrısını unutmak mümkün değil."* `gaEvent` de dışa açıktı.

Bu, ADR-034'teki hataların aynı sınıfı: listede yazılı, doğru eşlenmiş, hiç
çağrılmayan. Eşleştirme kalitesi parametrelerini eklemek, ana boru sızarken
cilalamak olurdu.

## Karar

### 1. Meta'nın tek kapısı `gaEvent`

Meta çağrısı `track()`ten `gaEvent()`e indi. `track` artık yalnız tipli bir
sarmalayıcı. Taksonomi içi ve dışı her olay aynı kapıdan geçiyor, dolayısıyla
"yeni dönüşümde Meta çağrısını unutmak" yapısal olarak mümkün değil.

`toMetaEvent`in girdisi de `AnalyticsEvent`ten **ad + parametre**ye indi —
serbest olayların eşlemeden geçebilmesi için gereken şey buydu.

### 2. Lead YALNIZ sunucudan gider

`MetaEventPayload` artık bir `channel` taşıyor:

- **`browser`** — ViewContent. Tarayıcı Pixel'i gönderir. Kimlik verisi yoktur
  ve olamaz: ViewContent anonim yüzeylerde tetikleniyor (hizmet, paket, vaka,
  tamamlanan tarama), sitede login yok (ADR-008), DB yok (ADR-010).
- **`server`** — Lead. Yalnız form handler'ı gönderir (`meta-lead.ts`).

Üç gerekçe:

1. **Eşleştirme kalitesi.** E-posta, telefon, ad ve soyad ancak form
   handler'ında var ve orada zaten şemayla doğrulanmış.
2. **Teslim.** Reklam engelleyici tarayıcı Pixel'ini kesebilir, sunucu
   çağrısını kesemez. Dönüşüm en kritik olay, en dayanıklı yoldan gider.
3. **`event_id` koordinasyonu hiç oluşmuyor.** Tek gönderici olduğu için
   paylaşılacak kimlik yok. İki taraf farklı kimlik üretirse dönüşüm iki kez
   sayılır — bu denetimin tamamı tam olarak o sınıf hatayla geçti.

Bedeli: Meta tarayıcı tarafında Lead görmüyor. Meta ikisini birden öneriyor,
ama sunucu kopyası **strictly** daha zengin (kimlik taşıyor) ve daha dayanıklı;
tarayıcı kopyasının eklediği tek şey yedeklilik olurdu ve onun karşılığı
paylaşılan kimlik riski.

Beş dönüşümün her birinin bir handler karşılığı var:

| Dönüşüm | Handler | Gönderilen kimlik |
|---|---|---|
| `contact_form_submitted` | `/api/contact` | e-posta, telefon, ad, soyad |
| `popup_booking_submitted` | `/api/booking` (`source: popup`) | e-posta, telefon, ad, soyad |
| `contact_booking_submitted` | `/api/booking` (`source: contact`) | e-posta, telefon, ad, soyad |
| `popup_contact_submitted` | `/api/visitor-profile` | e-posta, telefon, ad, soyad |
| `tool_report_requested` | `/api/tools/geo-report`, `/api/tools/diagnoo-unlock` | e-posta |

Çağrı her handler'da **bal küpü yolundan sonra**: sahte başarı dönüşüne
(`spamSignal`) ulaşan istek Meta'ya hiç yazılmaz.

### 3. Kalıcı ziyaretçi kimliği — `external_id`

`indoles_vid` çerezi: `v1.<uuid>`, 12 ay, pazarlama rızasına bağlı.

`sessionId()` (`session.ts`) bu iş için yetmiyor: `sessionStorage` sekme başına
ayrı ve sekme kapanınca gidiyor. `external_id`in işi aynı kişinin **ayrı
oturumlardaki** olaylarını bağlamak — oturum kimliği bunu tanım gereği yapamaz.

Bu, **anonim ViewContent'te gönderilebilen tek eşleştirme anahtarı**, yani
Meta'nın tavsiyesinin o yüzeyde karşılığı olan tek maddesi.

### 4. `fbc` iki kaynaktan çözülür

Önce Pixel'in yazdığı `_fbc`. Yoksa kendi yakaladığımız ham `fbclid`den
kurulur (`fb.1.<tıklamaZamanı>.<fbclid>`).

Meta'nın `_fbc` çerezine **yazmıyoruz** — onu Pixel yönetiyor, aynı çereze iki
taraf yazarsa biri diğerini bozar. Ham `fbclid` ayrı bir çerezde
(`indoles_fbclid`, 90 gün) duruyor. İkinci yol iki boşluğu kapatıyor: Pixel
yüklenmeden önce gerçekleşen dönüşümler, ve reklam engelleyicinin Pixel'i hiç
yüklemediği durumlar. Dönüşüm neredeyse hiçbir zaman iniş sayfasında olmadığı
için `fbclid`i saklamak zorunlu — gezinirken adresten kayboluyor.

### 5. `ct`, `st`, `zip`, `dob` GÖNDERİLMİYOR

Site hiçbirini **toplamıyor**. İki seçenek de reddedildi:

- **IP'den türetmek** (Cloudflare `cf-ipcity` / `cf-region`): Meta müşterinin
  *beyan ettiği* konumu bekliyor. Tahmin uyuşmazlık üretir ve eşleştirme
  kalitesini **düşürür** — amacın tersi.
- **Form alanı eklemek:** B2B lead formuna doğum tarihi ve posta kodu koymak
  dönüşüm oranına zarar verir ve toplanan veriyi gerekmeden genişletir (KVKK
  veri minimizasyonu).

`buildUserData` bu dört alanı hiç üretmiyor ve bir test bunu kilitliyor.

## %68.03 hakkında

Bu, "benzer reklamverenlerin" medyanı ve o küme büyük olasılıkla giriş yapmış
kullanıcısı ve sepet verisi olan e-ticaret hesaplarını içeriyor. Bizim yapıda
karşılığını bulmaz: login yok, e-ticaret yok, ve ViewContent'te gönderilebilen
kimlik anahtarı yalnız `external_id`.

Daha önemlisi şu anki darboğaz eşleştirme kalitesi değil, **trafik** — son 7
günde 39 kullanıcı. Bu ADR'nin gerçek kazancı yüzde değil, **eksik olan üç
Lead'in Meta'ya ulaşması**: reklam optimizasyonu ilk kez lead'lerin tamamını
görüyor.

## Sonuçlar

- Artı: Beş Lead'in beşi Meta'da; optimizasyon gerçek dönüşüm kümesiyle çalışır.
- Artı: Lead olayları kimlik taşıyor (e-posta, telefon, ad, soyad hash'li) ve
  reklam engelleyiciden etkilenmiyor.
- Artı: `external_id` hem Lead'de hem anonim ViewContent'te gönderiliyor.
- Artı: Herkese açık beacon uç noktası PII'siz kaldı — ADR-034'te kapatılan
  açık geri açılmadı, kimlik yalnız sunucunun kendi doğruladığı veriden geliyor.
- Eksi: **Yeni bir kalıcı takip tanımlayıcısı** (`indoles_vid`, 12 ay). KVKK
  yüzeyi genişledi; aydınlatma metni güncellenmeli (`docs/14` §3a).
- Eksi: Meta tarayıcı tarafında Lead görmüyor; sunucu çağrısı düşerse dönüşüm
  hiç ölçülmez (loglanıyor, `reportError` → `meta_lead`).
- Eksi: Yeni bir Meta olayı eklemek artık iki yerde iş istiyor — `LEAD_EVENTS`
  listesi **ve** ilgili handler'da `sendMetaLead` çağrısı. Liste tek başına
  yetmez; bu ADR'nin başındaki hatanın aynısı bu yüzden yeniden mümkün.
  `meta-lead.ts` başlığındaki handler tablosu bu riski görünür tutuyor.
- Doğrulanacak: CAPI'nin Meta'ya gerçekten ulaştığı Events Manager → Test
  Events ile görülmeli. `META_CAPI_TEST_CODE` bilerek boş (canlıda kalırsa tüm
  olaylar "test" sayılır), uç nokta hata durumunda sessizce düşüyor.
