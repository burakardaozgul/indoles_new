# Rezervasyon Sistemi — Tasarım

> **Tarih:** 2026-08-27 · **Statü:** Onaylı (Burak, üç bölüm ayrı ayrı)
> **Karar girdileri:** Gerçek rezervasyon (tercih toplama değil) · müsaitlik Google Calendar'dan · launch'ta tek takvim · anında kesinleşme · mail linkiyle iptal/erteleme · Google Meet · **90 dk görüşme, 15 dk tampon, 13:00-20:00, Pzt-Cmt, ilk gün 31 Ağustos 2026**
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
| **Kendi veritabanımız (D1)** | "Bu slotu biz sattık mı" sorusu + iptal anahtarı + asgari kimlik (ad, e-posta) | Eşzamanlılık garantisi. Calendar API aynı saate iki etkinlik oluşturmayı engellemiyor; anında kesinleşen bir sistemde bu kabul edilemez. **Lead bağlamı burada tutulmaz** — §2.2b |
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
| `name` | metin | Calendar etkinlik başlığı ve mail hitabı için gerekli |
| `email` | metin | İptal linki doğrulaması ve "aktif randevusu var mı" kontrolü için gerekli |
| `locale` | metin | tr / en — mailin dili |
| `status` | metin | `confirmed` · `cancelled` · `failed` |
| `created_at`, `updated_at` | metin | ISO |

**Çakışma kilidi:** `(consultant_id, starts_at_utc)` üzerinde **benzersizlik kısıtı**, yalnız `status = 'confirmed'` satırlar için geçerli olacak biçimde (kısmi indeks). İki eşzamanlı istekten ikincisi veritabanı seviyesinde reddedilir; uygulama kodunda kilit alınmaz, "önce kontrol et sonra yaz" gibi yarışa açık bir desen kurulmaz. İptal edilen bir slot yeniden satılabilir olmalı — kısmi indeks bunu sağlar.

### 2.2b Veri minimizasyonu ve saklama (KVKK — `docs/14` hizalaması)

`docs/14` veri minimizasyonunu "mimari DB-less olduğu için tasarım gereği sağlanır" diye gerekçelendiriyor. Rezervasyon veritabanı bu dayanağı ortadan kaldırıyor, dolayısıyla minimizasyon **artık bilinçli bir tasarım kararı olmak zorunda**. Kural şu: veritabanına yalnız randevunun *işlemesi için zorunlu* olan veri yazılır.

| Veri | Nerede | Neden |
|---|---|---|
| Ad, e-posta | **Veritabanı** + mail | Ad Calendar etkinliğinde ve mail hitabında; e-posta iptal doğrulaması ve çift rezervasyon kontrolünde zorunlu |
| Telefon, şirket, unvan | **Yalnız mail** (+ Calendar etkinlik açıklaması) | Randevunun işlemesi için gerekli değil. Burak'a bildirim mailinde ve takvim etkinliğinin açıklamasında görünür — toplantıya girerken bağlam elinde olur |
| Persona, üç problem | **Yalnız mail** (+ Calendar etkinlik açıklaması) | Aynı gerekçe. Satış bağlamı, sistem verisi değil |

Bu ayrım popup akışını değiştirmiyor — form aynı alanları topluyor, yalnız hepsi veritabanına yazılmıyor.

**Saklama süresi: görüşme tarihinden 90 gün sonra satır tamamen silinir.** Gerekçe: işleme amacı (görüşmeyi gerçekleştirmek) tamamlandıktan sonra kaydın tutulmasını gerektiren tek şey teklif/takip süreci; 90 gün bunu karşılar. Lead bilgisi zaten Resend mail arşivinde yaşıyor ve `docs/14` §2.1'e göre silme talepleri orada karşılanıyor — veritabanı ikinci bir kalıcı kopya oluşturmamalı.

Silme, Cloudflare Cron Trigger ile günlük çalışan bir temizlik işiyle yapılır. `docs/14` §4'teki silme prosedürüne bir adım eklenir: talep sahibinin aktif randevusu varsa o kayıt da silinir.

**`docs/14` güncellenmeli** (bu spec onaylandığında): §1 tablosundaki "Rezervasyon verisi | Cal.com Cloud" satırı ve §2.3 "Cal.com" bölümü geçersiz hale geliyor.

### 2.3 Taşınabilirlik

Veri erişimi tek arayüzün arkasında: `createBooking`, `findBookingByToken`, `cancelBooking`, `rescheduleBooking`, `listSoldSlots`. D1 bugünkü uygulaması; sağlayıcı değişirse yalnız o dosya değişir. Bu, 2026-08-27 performans incelemesinde altyapı taşınabilirliğinin gündeme gelmesi üzerine bilinçli olarak eklendi.

---

## 3. Akışlar

### 3.1 Müsaitlik listesi

1. İstemci takvimi açar, sunucudan dört haftalık müsaitlik ister.
2. Sunucu paralel iki sorgu yapar: Calendar `freeBusy` (dolu aralıklar) ve `listSoldSlots` (bizim sattıklarımız).
3. Temel çalışma penceresinden (§3.1b'deki gün, saat ve slot tanımı) bu ikisi düşülür.
4. Sonuç kısa süreli önbelleğe alınır (birkaç dakika). Önbellek **yalnız gösterim içindir** — kesinleşme her zaman veritabanı kısıtından geçer, dolayısıyla bayat listeden seçim yapılsa bile çift rezervasyon oluşmaz.

### 3.1b Slot yapılandırması (Burak kararı, 2026-08-27)

| Parametre | Değer |
|---|---|
| Görüşme süresi | **90 dakika** |
| Görüşmeler arası tampon | **15 dakika** |
| Günlük pencere | **13:00 – 20:00** (görüşme pencere içinde **bitmeli**) |
| Açık günler | **Pazartesi – Cumartesi** (Pazar kapalı) |
| İlk müsait gün | **2026-08-31 Pazartesi** (tek seferlik başlangıç) |
| En erken rezervasyon | **24 saat sonrası** (sürekli kural) |

Bu parametrelerden üreyen slotlar:

| # | Saat |
|---|---|
| 1 | 13:00 – 14:30 |
| 2 | 14:45 – 16:15 |
| 3 | 16:30 – 18:00 |
| 4 | 18:15 – 19:45 |

**Günde 4 slot · haftada 24 slot.** Pencere tam kullanılıyor: dördüncü görüşme 19:45'te bitiyor, 20:00 sınırının 15 dakika altında kalıyor ve gün sonunda artık zaman kalmıyor.

Tampon neden var: dört görüşme arasız yapıldığında altı saat kesintisiz konuşma demek olurdu; bir görüşme on dakika uzadığında zincirleme gecikme başlardı. 15 dakikalık aralık hem not almaya yer bırakıyor hem gecikmeyi soğuruyor.

**Bu değerler koda gömülmez**, tek bir yapılandırma dosyasında durur (süre, tampon, pencere, açık günler, ilk müsait gün). Değişmesi kod değişikliği değil, değer değişikliği olmalı — özellikle çoklu danışmana geçilirse her danışmanın kendi penceresi olacak.

**24 saat kuralı.** "31 Ağustos'tan itibaren" tek seferlik bir başlangıç; asıl kural sürekli işleyen şu: **bir slot, başlangıcına 24 saatten az kaldıysa gösterilmez.** Bugün 14:00'te giren biri en erken yarın 14:00'ten sonraki slotları görür. Hazırlıksız yakalanmayı önler ve son dakika iptallerini azaltır. Kural hem istemcide (slot listesi) hem sunucuda (rezervasyon anı) uygulanır — istemci tek başına koruma değildir.

**Cumartesi notu:** Bugünkü `CalendarPicker` hafta sonunu kapalı gösteriyor; Cumartesi'yi açmak o bileşende bir kural değişikliği gerektiriyor. Pazar kapalı kalıyor.

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
- Slot üretimi doğru mu: 13:00/14:45/16:30/18:15 üretiliyor, dördüncüden sonrası pencereyi aştığı için üretilmiyor, Pazar hiç slot vermiyor
- 24 saat kuralı hem listede hem sunucuda uygulanıyor mu (istemci atlatılırsa sunucu reddetmeli)
- Veritabanına telefon/şirket/unvan/persona/problem **yazılmıyor** mu — minimizasyon regresyonu
- `invalid_grant` döndüğünde sistem sessiz kalmıyor mu: uyarı maili gidiyor ve arayüz iletişim formuna düşüyor mu

Calendar API testlerde taklit edilir — gerçek takvime test randevusu düşmemeli.

---

## 8. Yetkilendirme ve sırlar

**Yöntem: OAuth 2.0 + kalıcı refresh token (servis hesabı DEĞİL).**

Karar iki elemeyle buraya geldi:

*Servis hesabı + Domain-Wide Delegation* — teknik olarak en sağlam yol ama **Workspace yönetici paneli gerektiriyor** ve bu hesapta yönetici erişimi yok (Burak, 2026-08-27). Uygulanamaz.

*Servis hesabı + takvimi paylaşma (davetsiz)* — **elendi, iki nedenle.** Birincisi 2 Mart 2020'den sonra oluşturulan servis hesapları DWD olmadan etkinliğe davetli ekleyemiyor (`forbiddenForServiceAccounts`). İkincisi ve daha ağırı: davet edilmemiş bir ziyaretçi Meet bağlantısına tıkladığında, Workspace'in varsayılan erişim ayarı (`TRUSTED` veya `RESTRICTED`) yüzünden **kapıda "katılma isteği" ekranında bekler** ve Burak'ın o an manuel onay vermesi gerekir. Bu, otomatik rezervasyonun amacını doğrudan çürütür.

*OAuth + refresh token* — **seçilen yol.** Burak bir kez tarayıcıdan izin verir; sunucu refresh token'ı saklar ve sürekli kullanır. Servis hesabı hiç devreye girmediği için yukarıdaki kısıtların ikisi de yok: etkinlik gerçek kullanıcı adına oluşur, ziyaretçi gerçek davetli olur, Meet bağlantısı sorunsuz üretilir. Yönetici paneli gerekmez.

**Kritik kurulum ayrıntısı — "Internal" kullanıcı tipi.** Google'ın izin ekranı "Testing" modundayken refresh token **7 günde** geçersiz oluyor; bu kurulursa sistem bir hafta sonra sessizce durur. Kaçınmanın yolu, Cloud projesinin OAuth izin ekranında **"Internal"** seçmek. Bu seçenek proje `indoles.com.tr` organizasyonuna bağlıysa görünür ve **proje sahibi tarafından seçilebilir — Workspace yöneticisi olmak gerekmez.** Internal seçildiğinde 7 gün kısıtı, doğrulama zorunluluğu ve "doğrulanmamış uygulama" uyarısı ortadan kalkar; token kalıcı olur.

Proje organizasyona bağlanamıyorsa yedek yol: "External" seçip **Publish App** ile Production'a geçirmek (doğrulama göndermeden). Resmî dokümantasyon 7 gün kısıtını açıkça "Testing" durumuna bağlıyor, ancak ikincil kaynaklar Production-doğrulanmamış durumu net teyit etmiyor — **bu yola gidilirse kurulumdan 8-10 gün sonra token'ın hâlâ çalıştığı fiilen test edilmelidir.**

**Sessiz bozulmaya karşı sağlık kontrolü — zorunlu.** OAuth yolunun gerçek riski yetkinin sessizce ölmesi: token 6 ay kullanılmazsa Google iptal eder, güvenlik olayı sonrası "tüm oturumları kapat" da iptal edebilir. İki önlem birlikte kurulur:

1. **Aylık canlılık işi** (Cloudflare Cron): küçük bir `freeBusy` sorgusu çalıştırır. Hem 6 aylık atıl kalma sayacını sıfırlar hem token'ın geçerliliğini erken doğrular.
2. **`invalid_grant` yakalama:** Google bu hatayı döndürdüğünde sistem sessiz kalmaz — Burak'a "takvim bağlantısı yeniden yetkilendirme istiyor" maili gider ve rezervasyon arayüzü §4'teki "uygun saat görünmüyor, bize yazın" davranışına düşer.

Bu iki madde spec'in gereği; uygulama planında atlanamaz.

**Tek seferlik yetkilendirme uyarısı:** Yetkilendirme akışı gereksiz yere tekrar tekrar çalıştırılmamalı. Aynı istemci için üretilen refresh token sayısı sınırlı (resmî rakam 100) ve sınır aşılınca eski token'lar sessizce geçersiz olur. Bir kez alınır, `wrangler secret` ile saklanır.

**Kapsamlar** (en dar set — geniş `auth/calendar` gerekmiyor):
- `https://www.googleapis.com/auth/calendar.events` — etkinlik oluştur/güncelle/sil + Meet üretimi (ayrı bir "Meet kapsamı" yok)
- `https://www.googleapis.com/auth/calendar.events.freebusy` — yalnız müsaitlik sorgusu

Her ikisi de Google'ın **"sensitive"** sınıfında ("restricted" değil). Bu ayrım önemli: Internal kullanıcı tipinde doğrulama gerektirmiyor, External-Production'da ise yalnız bir kereye mahsus "doğrulanmamış uygulama" uyarısı gösteriyor — ziyaretçiler bu uyarıyı hiç görmez, yalnız yetkilendirmeyi yapan kişi görür.

**Workers kısıtı — önemli:** Resmî `googleapis` npm paketi **kullanılmayacak**; Node.js'e bağımlı ve Worker paketini şişirir (boyut sınırında yalnız ~15 KB payımız var — ADR-024). Bunun yerine doğrudan REST çağrısı: saklanan refresh token `oauth2.googleapis.com/token` adresine `grant_type=refresh_token` ile gönderilip kısa ömürlü access token alınır, sonra Calendar uç noktalarına `fetch` ile gidilir. Ek bağımlılık gerektirmeyen küçük bir modül; JWT imzalama gerekmiyor (o yalnız servis hesabı yolunda gerekliydi).

**Sırlar:** OAuth istemci kimliği/parolası ve refresh token repoya **girmez**; `wrangler secret` ile saklanır (ADR-024 sır politikası).

**API davranışı (araştırmayla doğrulandı):**

| İşlem | Yöntem |
|---|---|
| Etkinlik + Meet | `events.insert?conferenceDataVersion=1`, `conferenceData.createRequest` içinde benzersiz `requestId` ve `conferenceSolutionKey.type: "hangoutsMeet"`. Yanıt genelde Meet bağlantısıyla döner; `status.statusCode` `success` değilse tek `events.get` ile teyit edilir |
| İptal | `events.delete` + `sendUpdates=all` — katılımcıya otomatik iptal maili gider. (`status: cancelled` patch'lemek tekil randevu için resmî yöntem değil) |
| Erteleme | `events.patch` ile yalnız `start`/`end`. `conferenceData`'ya dokunulmaz ve `conferenceDataVersion` gönderilmez → **Meet bağlantısı korunur**, yenisi üretilmez |
| Müsaitlik | `freeBusy` POST; yanıt `calendars.<id>.busy[]` |

**Kota:** Proje başına dakikada 10.000, kullanıcı başına dakikada 600 istek. Günde 4 randevu + takvim açılışı başına bir `freeBusy` çağrısı bu sınırların çok altında — kota pratik bir kısıt değil.

---

## 9. Gereken karar kaydı

**ADR-025 yazılacak.** ADR-010 ("DB yok") bu kararla *delinmiyor*, kapsamı daraltılıyor. O karar "DB'yi tutan tek sebep lead saklamaktı, o da maile devredildi" diyordu. Rezervasyon sistemi yeni ve farklı bir sebep getiriyor: **eşzamanlılık garantisi**, ki maille çözülemez. ADR-025 bunu, D1 seçimini, taşınabilirlik kısıtını ve reddedilen alternatifleri (Durable Object + KV; yalnız-Calendar) kayda geçirir.

---

## 10. Açık girdiler

| Girdi | Sahip | Durum |
|---|---|---|
| ~~Görüşme süresi ve çalışma penceresi~~ | — | ✅ **Karara bağlandı** (2026-08-27): 90 dk · 15 dk tampon · 13:00-20:00 · Pzt-Cmt · ilk gün 31 Ağustos. Ayrıntı §3.1b |
| ~~En erken rezervasyon mesafesi~~ | — | ✅ **Karara bağlandı:** 24 saat. Ayrıntı §3.1b |
| ~~Veri saklama süresi (KVKK)~~ | — | ✅ **Hizalandı:** minimizasyon + 90 gün sonra silme. Ayrıntı §2.2b. **`docs/14` güncellenecek** (Cal.com satırları geçersiz) |
| **Google OAuth istemcisi + tek seferlik yetkilendirme** | Burak | **Açık — uygulama öncesi hazırlık.** Yöntem netleşti (§8): OAuth + kalıcı refresh token, tercihen "Internal" kullanıcı tipiyle. Yönetici paneli gerekmiyor. Bu olmadan müsaitlik okunamaz ve etkinlik oluşturulamaz |
| Günlük üst sınır | — | Gerekmiyor: pencere ve süre zaten günde 4 slotla sınırlıyor |
