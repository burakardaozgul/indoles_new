# Runbook — Rezervasyon takvim bağlantısı (Apple Calendar ↔ `digital@`)

> **Kime:** Burak · **Süre:** ~10 dakika · **Sıklık:** bir kez
> **Karar dayanağı:** `docs/superpowers/specs/2026-08-27-rezervasyon-sistemi-design.md` §2.1b
> **Statü:** Uygulamanın **önkoşulu.** Bu yapılmadan rezervasyon sistemi müsaitliği boş görür ve dolu saatlerini satar.

## Neden gerekli

Rezervasyon sistemi müsaitliği `digital@indoles.com.tr` takviminden okuyor. Ana takvimin Apple Calendar (iCloud) ve `digital@` üzerinde hiç meşguliyetin olmuyor — ölçüldü, üç hafta boyunca üç takvim de boştu. Bu haliyle sistem her saati müsait sanar.

Çözüm takvim uygulamanı değiştirmek değil: **`digital@` hesabını kullandığın Apple Calendar'ın içine alıyoruz.** Böylece oluşturduğun etkinlikler otomatik olarak sisteme kapalı saat olarak geçiyor, gelen rezervasyonlar da aynı uygulamada görünüyor.

Gizlilik açısından ek bir bedeli yok: sistem `freeBusy` sorgusu yapıyor, bu sorgu yalnız **dolu/boş aralık** döndürüyor. Etkinlik başlıkların, katılımcıların ve açıklamaların sisteme hiç gelmiyor.

---

## Adım 1 — macOS Takvim'e hesabı ekle

1. **Takvim** uygulamasını aç
2. Menü çubuğu → **Takvim → Ayarlar** (`⌘ ,`)
3. **Hesaplar** sekmesi → sol alttaki **+**
4. **Google**'ı seç → açılan pencerede `digital@indoles.com.tr` ile giriş yap
5. İzin ekranını onayla
6. Hesap eklendikten sonra **Takvimler** kutusunun işaretli olduğundan emin ol

## Adım 2 — Varsayılan takvimi `digital@` yap (asıl güvence)

Aynı **Ayarlar** penceresinde → **Genel** sekmesi → **Varsayılan takvim** → `digital@indoles.com.tr` altındaki takvimi seç.

Bu adım kritik. Varsayılan takvim `digital@` olduğunda ayrıca düşünmene gerek kalmıyor: oluşturduğun her etkinlik doğru yere düşüyor ve o saati otomatik kapatıyor. Bu ayar yapılmazsa etkinliklerin iCloud'da kalır ve **hiçbirini bloklamaz.**

## Adım 3 — iPhone / iPad

1. **Ayarlar → Uygulamalar → Takvim → Takvim Hesapları → Hesap Ekle → Google**
   *(iOS 17 ve öncesi: Ayarlar → Takvim → Hesaplar → Hesap Ekle)*
2. `digital@indoles.com.tr` ile giriş yap
3. **Ayarlar → Uygulamalar → Takvim → Varsayılan Takvim** → `digital@` altındaki takvimi seç

Telefonda da varsayılanı ayarlamayı atlama — etkinliklerin çoğu telefonda oluşuyor.

## Adım 4 — Kişisel Google takvimini "yalnız müsaitlik" olarak paylaş

Yedek güvence: `b.a.ozgul@gmail.com` takvimine bir şey düşerse o da bloklasın, ama ayrıntısı sisteme gitmesin.

1. [calendar.google.com](https://calendar.google.com) → `b.a.ozgul@gmail.com` ile giriş
2. Sol listede takvimin üzerine gel → **⋮ → Ayarlar ve paylaşım**
3. **Belirli kişiler veya gruplarla paylaş → Kişi ekle** → `digital@indoles.com.tr`
4. İzin düzeyi: **"Yalnızca müsaitlik durumunu görüntüleme (ayrıntıları gizle)"**
5. Aynısını **"iPhone"** takvimi için de yap

## Adım 5 — Yaklaşan iCloud etkinliklerini gözden geçir

İlk rezervasyon günü **31 Ağustos 2026**. Bugün iCloud'da duran etkinlikler `digital@`'a taşınmadıkça bloklamaz.

Önümüzdeki üç haftada **Pazartesi–Cumartesi 13:00–20:00** arasına düşen işlerini kontrol et; bloklaması gerekenleri `digital@` takvimine taşı veya oraya kopyala. Sonrasında varsayılan takvim ayarı bu işi kendiliğinden halledecek.

---

## Doğrulama

Kurulumu bitirince söyle — `digital@` ve `b.a.ozgul@gmail.com` için `freeBusy` sorgusu çalıştırıp ikisine de erişildiğini ve `digital@`'a koyduğun bir test etkinliğinin dolu göründüğünü doğrularım.

Hızlı kendi kontrolün: Apple Calendar'da `digital@` altına 31 Ağustos 14:45'e bir test etkinliği koy. Sistem canlıya alındığında o slot müsait listesinde **görünmemeli**.

---

## Sonrasında nasıl çalışıyor

| Yön | Davranış |
|---|---|
| Sen etkinlik oluşturursun → sistem görür | **Anında.** Apple Calendar kaydederken Google'a yazıyor |
| Sistem rezervasyon oluşturur → sen görürsün | Apple Calendar Google'ı ~15 dakikada bir çekiyor. Gecikme önemsiz: **bildirim maili anında geliyor** |
| Gizlilik | Sisteme yalnız dolu/boş aralık gidiyor; başlık, katılımcı, açıklama gitmiyor |

**Tek kalan kural:** bloklaması gereken bir işi bilerek iCloud takvimine yazarsan sistem onu göremez. Varsayılan takvim ayarı bunu zaten büyük ölçüde imkânsızlaştırıyor.
