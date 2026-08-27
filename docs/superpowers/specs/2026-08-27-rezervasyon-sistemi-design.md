# Rezervasyon Sistemi — Tasarım

> **Tarih:** 2026-08-27 · **Statü:** Onaylı (Burak, üç bölüm ayrı ayrı)
> **Karar girdileri:** Gerçek rezervasyon (tercih toplama değil) · müsaitlik Google Calendar'dan · launch'ta tek takvim · anında kesinleşme · mail linkiyle iptal/erteleme · Google Meet
> **İlgili:** ADR-010 (DB yok — kapsamı daralıyor), ADR-013 (popup REST geçişi), ADR-024 (Cloudflare Workers), `docs/11-funnel-customer-flows.md`
> **Çıktı:** Bu belge onaylandıktan sonra uygulama planı yazılır. Plan onaylanmadan kod yazılmaz.

---

## 1. Problem

Bugünkü akış rezervasyon değil, **niyet toplama**: ziyaretçi bir saat *tercihi* belirtiyor, iki mail gidiyor, Burak manuel onaylıyor. `CalendarPicker` sabit sekiz saat gösteriyor ve kendi kodunda itiraf ediyor — *"no availability check — all shown as available"*. Dolu olduğun saatler de müsait görünüyor, iki kişi aynı saati seçebiliyor, ziyaretçi randevusunu kendisi değiştiremiyor.

Cal.com bu tablonun çözümü değildi ve zaten büyük ölçüde sökülmüş durumda (ADR-013). Bugün tek canlı kalıntısı `/iletisim` sayfasındaki gömülü takvim ve **o da 404 veriyor** (`docs/13` P3, `docs/15` E3, `docs/17` D-04 — üç denetimde kayıtlı).

**Kısıt:** Görsel tasarım korunacak. Popup akışının 14 bileşeninin hiçbiri Cal.com'a bağımlı değil; hepsi base design token'larını kullanıyor. Yani arayüz yeniden çizilmiyor, yalnız veri kaynağı değişiyor.

---

## 2. Mimari

### 2.1 Görev dağılımı

| Katman | Sorumluluk | Neden burada |
|---|---|---|
| **Google Calendar** | Müsaitliğin **tek kaynağı**; etkinlik ve Meet bağlantısının üretildiği yer | Burak takvimini zaten orada yönetiyor. Elle bir toplantı koyduğunda o saat siteye de kapanmalı — çift kayıt tutulmamalı. Meet bağlantısı ancak Calendar etkinliğiyle üretilebiliyor |
| **Kendi veritabanımız (D1)** | "Bu slotu biz sattık mı" sorusu + iptal anahtarı + lead bağlamı | Eşzamanlılık garantisi. Calendar API aynı saate iki etkinlik oluşturmayı engellemiyor; anında kesinleşen bir sistemde bu kabul edilemez |
| **Mevcut mail katmanı** | Onay, bildirim, iptal/erteleme mailleri | `src/lib/mail/client.ts` + `emails/*.tsx` zaten çalışıyor, üç deneme + backoff var |
| **Mevcut popup arayüzü** | Slot seçimi, form, başarı ekranı | Değişmiyor — yalnız `CalendarPicker` verisini sunucudan alacak |

**Veritabanı müsaitlik bilmiyor.** Bu ayrım bilinçli: iki kaynak arasında senkron tutma yükü doğmasın diye. Müsaitlik sorusu her zaman Calendar'a, "sattık mı" sorusu her zaman bize.

### 2.2 Veri modeli

Tek tablo — `bookings`:

| Alan | Tip | Not |
|---|---|---|
| `id` | metin | birincil anahtar |
| `cancel_token` | metin | tahmin edilemez; iptal/erteleme bağlantısının anahtarı, benzersiz |
| `calendar_event_id` | metin, boş olabilir | Calendar yazması başarılı olunca dolar |
| `meet_url` | metin, boş olabilir | aynı anda dolar |
| `consultant_id` | metin | launch'ta tek değer; **çoklu danışman için alan bugünden var** |
| `starts_at_utc` | metin (ISO) | **UTC** |
| `ends_at_utc` | metin (ISO) | UTC |
| `visitor_timezone` | metin | ziyaretçinin seçim anındaki dilimi |
| `name`, `email`, `phone`, `company`, `role` | metin | `LeadFieldsForm` alanları |
| `persona`, `problems` | metin / JSON | popup bağlamı (3 problem) |
| `locale` | metin | tr / en |
| `status` | metin | `confirmed` · `cancelled` · `failed` |
| `created_at`, `updated_at` | metin | ISO |

**Çakışma kilidi:** `(consultant_id, starts_at_utc)` üzerinde **benzersizlik kısıtı**, yalnız `status = 'confirmed'` satırlar için geçerli olacak biçimde (kısmi indeks). İki eşzamanlı istekten ikincisi veritabanı seviyesinde reddedilir; uygulama kodunda kilit alınmaz, "önce kontrol et sonra yaz" gibi yarışa açık bir desen kurulmaz. İptal edilen bir slot yeniden satılabilir olmalı — kısmi indeks bunu sağlar.

### 2.3 Taşınabilirlik

Veri erişimi tek arayüzün arkasında: `createBooking`, `findBookingByToken`, `cancelBooking`, `rescheduleBooking`, `listSoldSlots`. D1 bugünkü uygulaması; sağlayıcı değişirse yalnız o dosya değişir. Bu, 2026-08-27 performans incelemesinde altyapı taşınabilirliğinin gündeme gelmesi üzerine bilinçli olarak eklendi.

---

## 3. Akışlar

### 3.1 Müsaitlik listesi

1. İstemci takvimi açar, sunucudan dört haftalık müsaitlik ister.
2. Sunucu paralel iki sorgu yapar: Calendar `freeBusy` (dolu aralıklar) ve `listSoldSlots` (bizim sattıklarımız).
3. Temel çalışma penceresinden (hafta içi, mesai saatleri, tanımlı slot uzunluğu) bu ikisi düşülür.
4. Sonuç kısa süreli önbelleğe alınır (birkaç dakika). Önbellek **yalnız gösterim içindir** — kesinleşme her zaman veritabanı kısıtından geçer, dolayısıyla bayat listeden seçim yapılsa bile çift rezervasyon oluşmaz.

### 3.2 Rezervasyon

Sıra kritik ve şöyledir:

1. Turnstile doğrulanır (mevcut `verifyTurnstile`).
2. Slot geçmişte mi, çalışma penceresi içinde mi — sunucuda doğrulanır.
3. **Veritabanına yazılır.** Kısıt burada ya geçer ya reddeder.
4. Calendar'a `conferenceData` ile etkinlik açılır; Meet bağlantısı üretilir.
5. `calendar_event_id` ve `meet_url` satıra işlenir.
6. İki mail gider: ziyaretçiye onay (Meet bağlantısı + iptal linki + saat **iki dilimde**), Burak'a bildirim (persona + üç problem + lead alanları).

**Neden önce veritabanı:** Tersi olsaydı Calendar'a etkinlik düşüp veritabanı yazması başarısız olabilir ve ortada kaydı olmayan bir toplantı kalırdı. Bu sırada başarısızlık Calendar adımında olursa satır `failed` işaretlenir — takvimde hayalet etkinlik oluşmaz.

### 3.3 Zaman dilimi

Bu tür sistemlerde en sık hatanın kaynağı olduğu için kural açık: **veritabanında ve Calendar'da her şey UTC.** Ziyaretçiye kendi tarayıcı diliminde gösterilir, seçim anındaki dilim kayda geçer. Onay mailinde saat hem ziyaretçinin dilimiyle hem İstanbul saatiyle yazılır — yurt dışı bir görüşmede "10:00" ifadesinin kimin saati olduğu tartışılmasın.

### 3.4 İptal ve erteleme

Onay mailindeki bağlantı `cancel_token` taşır; oturum açma gerektirmez, yalnız o randevuyu açar.

- **İptal:** Calendar etkinliği silinir, satır `cancelled` olur, Burak'a bildirim gider. Slot yeniden satılabilir hale gelir.
- **Erteleme:** Ziyaretçi aynı `CalendarPicker` arayüzünden yeni saat seçer. Yeni slot için kısıt yeniden çalışır; eski etkinlik güncellenir. **Yeni arayüz çizilmez.**

---

## 4. Hata durumları

| Durum | Davranış |
|---|---|
| Slot az önce doldu | Kısıt reddeder. "Bu saat az önce alındı" + güncel liste yeniden yüklenir. Form içeriği korunur |
| Calendar erişimi kesik | Satır `failed`, ziyaretçiye dürüst mesaj, **bildirim maili yine gider** — lead kaybolmaz, manuel dönülebilir |
| Mail gönderilemedi | Randevu geçerli kalır, silinmez. Hata loglanır ve bildirilir. Ziyaretçiye "onay maili birazdan ulaşacak" denir |
| İptal linki iki kez tıklandı | Hata değil: "bu randevu zaten iptal edilmiş". İşlem tekrarlanabilir yazılır |
| Geçmiş saate rezervasyon | Sunucuda reddedilir. İstemci zaten göstermiyor, ama tek koruma istemci olamaz |
| Aynı e-postadan ikinci randevu | Aktif randevu varsa engellenir, mevcut randevu gösterilir. Popup'ta zaten `ExistingBookingState` var — ona bağlanır |
| Calendar yetkisi koptu | Müsaitlik listesi boş döner; takvim "şu an uygun saat görünmüyor, bize yazın" diyerek iletişim formuna düşer. Sessiz boş kutu gösterilmez |

---

## 5. Mevcut arayüze bağlanma

Görsel tasarım korunuyor. Değişen tek şey verinin kaynağı:

| Bileşen | Değişiklik |
|---|---|
| `CalendarPicker` | Sabit sekiz saat üretmeyi bırakır, sunucudan gerçek müsaitlik alır. Düzen, stil, etkileşim aynı |
| `SuccessState` | Zaten var olan ama hep `null` geçilen `bookingUrl` prop'u canlanır: Meet bağlantısı + iptal linki gösterilir |
| `BookingScreen`, `LeadFieldsForm`, `ConsultantCard`, `ProgressIndicator`, `PersonaChip`, `ExistingBookingState` | **Değişmiyor** |
| `/iletisim` | Kırık Cal.com gömülü takvimi kaldırılır. Yerine **aynı `BookingScreen` bileşeni sayfa içine gömülür** (modal değil, doğrudan sayfada). Böylece iki yüzey tek bileşeni paylaşır; ayrı bir takvim arayüzü yazılmaz. Sayfadaki mevcut `ContactForm` olduğu gibi kalır — ziyaretçi "randevu al" ile "mesaj bırak" arasında seçim yapabilir |

**Cal.com temizliği aynı işin parçası:** `@calcom/embed-react` paketi, `CalcomEmbed.tsx`, `src/lib/calcom/` (ölü), `/api/webhooks/cal` (stub), `src/lib/email/` (ölü, gerçek yol `src/lib/mail/`), `QuickBookForm.tsx` (ölü), `popup_cal_com_redirect` olay tipi, ilgili env değişkenleri.

---

## 6. Kapsam dışı (launch)

| Kalem | Gerekçe |
|---|---|
| Çoklu danışman | Veri modeli destekliyor (`consultant_id`), tek takvim bağlı. Genişleme Workspace hesabı ve yetki işi — kod işi değil |
| Ödeme | ADR-009 duruyor |
| Hatırlatma bildirimleri | Google Calendar kendi hatırlatmasını gönderiyor; ikinci sistem gereksiz |
| No-show takibi, tekrarlayan randevu, takvim dışa aktarma | İhtiyaç doğarsa ayrı karar |

---

## 7. Test stratejisi

**Asıl kanıtlanması gereken çakışmadır.** Tek tek çağrılarla test etmek kanıt değil: test **eşzamanlı iki yazma denemesi** yapıp tam olarak birinin başarılı olduğunu doğrulamalı.

Bunun yanında:

- Geçmiş saate rezervasyon reddediliyor mu
- İptal linki ikinci tıklamada hata vermiyor mu (idempotent)
- Calendar çağrısı başarısız olduğunda satır `failed` işaretlenip **bildirim maili yine gidiyor** mu
- Zaman dilimi dönüşümü yaz saati geçişinde kaymıyor mu
- İptal edilen slot yeniden satılabiliyor mu (kısmi indeks doğrulaması)
- Aktif randevusu olan e-posta ikinci kez rezervasyon yapamıyor mu

Calendar API testlerde taklit edilir — gerçek takvime test randevusu düşmemeli.

---

## 8. Yetkilendirme ve sırlar

Google Workspace **servis hesabı**, yalnız ilgili takvime yetkili. Anahtar `wrangler secret` ile saklanır, repoya girmez (ADR-024'ün sır politikası). Kullanıcı etkileşimi gerektirmez; OAuth yenileme anahtarının sessizce süresi dolma riski yoktur.

---

## 9. Gereken karar kaydı

**ADR-025 yazılacak.** ADR-010 ("DB yok") bu kararla *delinmiyor*, kapsamı daraltılıyor. O karar "DB'yi tutan tek sebep lead saklamaktı, o da maile devredildi" diyordu. Rezervasyon sistemi yeni ve farklı bir sebep getiriyor: **eşzamanlılık garantisi**, ki maille çözülemez. ADR-025 bunu, D1 seçimini, taşınabilirlik kısıtını ve reddedilen alternatifleri (Durable Object + KV; yalnız-Calendar) kayda geçirir.

---

## 10. Açık girdiler

| Girdi | Sahip | Ne için |
|---|---|---|
| Görüşme süresi (30 dk varsayımı) ve çalışma penceresi (hafta içi/saat aralığı) | Burak | Slot üretimi |
| En erken rezervasyon mesafesi (ör. 24 saat sonrası) ve günlük üst sınır olacak mı | Burak | Hazırlıksız yakalanmayı ve takvim işgalini sınırlar |
| Workspace servis hesabı oluşturma ve takvim yetkisi | Burak | Uygulama öncesi hazırlık |
| Veri saklama süresi (KVKK — randevu kaydı ne kadar tutulacak) | Burak | `docs/14` ile hizalanmalı |
