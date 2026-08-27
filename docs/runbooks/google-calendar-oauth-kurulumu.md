# Runbook — Google Calendar yetkilendirmesi (OAuth + kalıcı refresh token)

> **Kime:** Burak · **Süre:** ~15 dakika · **Sıklık:** bir kez (yetki bozulursa tekrar)
> **Karar dayanağı:** `docs/superpowers/specs/2026-08-27-rezervasyon-sistemi-design.md` §8
> **Yol:** **External + Publish App.** Cloud Console'da `indoles.com.tr` kuruluşu seçilemiyor (Burak, 2026-08-27), dolayısıyla "Internal" kullanıcı tipi yok. Servis hesabı yolları da yönetici paneli olmadığı için kapalı — eleme kaydı spec §8'de.

Bu belgenin sonunda elinde üç değer olacak: **client ID**, **client secret**, **refresh token**. Rezervasyon sistemi bu üçüyle takvimini okur, etkinlik açar ve Meet bağlantısı üretir.

---

## Durum: kurulum tamamlandı (2026-08-27)

Bu prosedür bir kez uygulandı ve doğrulandı. Belge yeniden yetkilendirme gerekirse diye duruyor.

| Ne | Değer |
|---|---|
| **Rezervasyon takvimi** | `digital@indoles.com.tr` · rol `owner` · `Europe/Istanbul` |
| Cloud projesi sahibi | `b.a.ozgul@gmail.com` (kişisel — **launch öncesi kuruma devredilecek**, spec §8b) |
| Yayın durumu | `In production` |
| Kayıtlı redirect URI'lar | `http://localhost` · `http://localhost:8765` |
| Verilen kapsamlar | `calendar.events` + `calendar.events.freebusy` |
| Sırlar | `.env.local` — `GOOGLE_OAUTH_CLIENT_ID`, `_CLIENT_SECRET`, `_REFRESH_TOKEN`, `GOOGLE_CALENDAR_ID` |
| **10. gün testi** | **2026-09-06 civarı** — aşağıdaki bölüm |

**Takvim kimliği `primary` değil, açık yazıldı.** `primary` "token hangi hesaba aitse onun takvimi" demek; yetki bir gün yanlış hesapla verilirse sessizce yanlış takvime yazardı. Açık kimlik aynı durumda `notFound` ile düşer.

**Yeniden yetkilendirme gerekirse elle uğraşma:** `gcal-auth.py` aracı yerel dinleyiciyi açar, izin sayfasını açar, kodu yakalar, token'a çevirir ve `.env.local`'e yazar — hiçbir sırrı ekrana basmadan. Aşağıdaki elle prosedür aracın yaptığı işin adım adım karşılığıdır.

---

## Önce şunu oku — sırayı bozarsan sistem bir hafta sonra durur

Google'ın 7 günlük refresh token kısıtı **token'a değil, izni verdiğin andaki uygulama durumuna** yazılıyor. Resmî ifade: *"Authorizations by a test user will expire seven days from the time of consent."*

Sonuç: **Adım 4'teki "Publish app" adımı, Adım 6'daki yetkilendirmeden ÖNCE tamamlanmak zorunda.** Sırayı ters çevirirsen aldığın token yedi gün sonra ölür ve sonradan yayınlaman onu kurtarmaz — baştan yetkilendirmek gerekir.

Adımlar zaten doğru sırada. Atlama, karıştırma.

---

## Adım 1 — Proje oluştur

https://console.cloud.google.com adresine `burak@indoles.com.tr` ile gir. Proje seçici → **New Project**.

- **Name:** `indoles-rezervasyon`
- **Location:** "No organization" (başka seçenek yok — yol B'de olmamızın sebebi bu)

Oluştur ve üst çubuktan bu projeye geç. Sonraki tüm adımlarda üst çubukta **bu projenin** seçili olduğundan emin ol.

---

## Adım 2 — Calendar API'yi aç

Doğrudan: **https://console.cloud.google.com/apis/library/calendar-json.googleapis.com** → **Enable**

Tek API yeter. Meet bağlantısı Calendar API üzerinden üretiliyor; ayrı bir Meet API'si açman gerekmiyor.

---

## Adım 3 — Uygulama kimliği (Branding)

Doğrudan: **https://console.cloud.google.com/auth/branding**

- **App name:** `INDOLES Rezervasyon`
- **User support email:** `burak@indoles.com.tr`
- **Audience / User type:** `External` (tek seçenek)
- **Developer contact information:** `burak@indoles.com.tr`

Kaydet. Kapsam (scope) ekranında bir şey eklemene gerek yok — kapsamları yetkilendirme bağlantısında biz göndereceğiz.

---

## Adım 4 — Publish app (ATLANMAZ)

Doğrudan: **https://console.cloud.google.com/auth/audience**

Sayfada **Publishing status: Testing** yazıyor olacak. **"Publish app"** düğmesine bas, çıkan kutuyu onayla.

Sayfa **Publishing status: In production** göstermeli. Ekran görüntüsü al veya en azından gözünle teyit et — bu satır yanlışsa kalan her şey boşa gider.

**Doğrulama (verification) gönderme.** Google "sensitive" kapsamlar için doğrulama önerir ama zorunlu tutmaz. Doğrulanmamış olmanın iki sonucu var, ikisi de bizim için sorunsuz:

| Sonuç | Bizim durumumuz |
|---|---|
| İzin ekranında "Google hasn't verified this app" uyarısı | Uyarıyı **yalnız sen** görürsün, bir kez. Ziyaretçiler bu akışa hiç girmez — onlar siteden rezervasyon yapar. |
| Proje ömrü boyunca **100 yeni kullanıcı** sınırı (sıfırlanamaz) | Bize **1** kullanıcı lazım: sen. Sınırın yanına bile yaklaşmıyoruz. |

Buradan çıkan tek kural: **bu Cloud projesini ve bu istemciyi başka hiçbir iş için kullanma.** 100'lük sayaç proje ömrü boyunca geçerli ve geri alınamıyor.

---

## Adım 5 — OAuth istemcisi oluştur

Doğrudan: **https://console.cloud.google.com/auth/clients** → **Create client**

- **Application type:** `Web application`
- **Name:** `indoles-rezervasyon-worker`
- **Authorized redirect URIs → ADD URI:** `http://localhost`

  Tam olarak bu — sonunda eğik çizgi yok, port yok. Google https zorunluluğundan yalnız localhost'u muaf tutuyor. Bu adreste bir sunucu çalıştırmayacağız; sadece yetkilendirme kodunu adres çubuğunda yakalayacağız.

**Create**'e bas. Açılan kutuda **Client ID** ve **Client secret** görünecek — ikisini de kopyala.

---

## Adım 6 — Tek seferlik yetkilendirme

> **Önce Adım 4'ü teyit et.** `console.cloud.google.com/auth/audience` sayfası **In production** diyor mu? Demiyorsa buradan geri dön.

> **Bu akışı gereksiz yere tekrarlama.** Aynı hesap + aynı istemci için üretilen refresh token sayısı 100 ile sınırlı ve sınıra gelindiğinde **en eski token sessizce geçersiz olur** — yani çalışan sistemi durdurabilir.

### 6a. İzin bağlantısını aç

`SENIN_CLIENT_ID` yerine kendi client ID'ni koyup tarayıcıya yapıştır:

```
https://accounts.google.com/o/oauth2/v2/auth?client_id=SENIN_CLIENT_ID&redirect_uri=http%3A%2F%2Flocalhost&response_type=code&access_type=offline&prompt=consent&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar.events%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar.events.freebusy
```

`access_type=offline` ve `prompt=consent` **zorunlu** — bunlar olmadan Google refresh token vermez, yalnız bir saatlik access token verir.

`burak@indoles.com.tr` ile giriş yap.

**"Google hasn't verified this app"** uyarısı çıkacak — beklenen. **Advanced** → **Go to INDOLES Rezervasyon (unsafe)**.

Ardından izin ekranında tam olarak şu iki yetki görünmeli. Başkası görünüyorsa bağlantı yanlış kopyalanmıştır, dur ve kontrol et:

- *"View and edit events on all your calendars"* (`calendar.events`)
- *"See the availability on Google calendars you have access to"* (`calendar.events.freebusy`)

İzin ver.

### 6b. Kodu adres çubuğundan al

Tarayıcı `http://localhost/?code=4%2F0A...&scope=...` adresine gidip **"bağlanılamıyor" hatası verecek. Bu beklenen davranış** — orada bir sunucu yok. Önemli olan adres çubuğu.

`code=` ile `&scope=` arasındaki değeri kopyala. İçindeki `%2F` karakterlerini `/` yap: `4%2F0AVMBsJ...` → `4/0AVMBsJ...`

**Kod birkaç dakikada geçersiz oluyor ve tek kullanımlık.** Sonraki adımı hemen yap; kaçırırsan 6a'yı tekrarla.

### 6c. Kodu refresh token'a çevir

Terminalde, değerleri kendi bilgilerinle değiştirerek:

```bash
curl -s -X POST https://oauth2.googleapis.com/token \
  --data-urlencode "client_id=SENIN_CLIENT_ID" \
  --data-urlencode "client_secret=SENIN_CLIENT_SECRET" \
  --data-urlencode "code=ADIM_6B_DEKI_KOD" \
  --data-urlencode "redirect_uri=http://localhost" \
  --data-urlencode "grant_type=authorization_code"
```

Dönen JSON'da **`refresh_token`** alanı olmalı:

```json
{ "access_token": "ya29...", "expires_in": 3599, "refresh_token": "1//0g...", "scope": "...", "token_type": "Bearer" }
```

---

## Adım 7 — Değerleri sakla

Uygulama henüz yazılmadı, o yüzden şimdilik **`.env.local`** (gitignore'da, repoya girmez):

```
GOOGLE_OAUTH_CLIENT_ID=...
GOOGLE_OAUTH_CLIENT_SECRET=...
GOOGLE_OAUTH_REFRESH_TOKEN=...
GOOGLE_CALENDAR_ID=primary
```

Uygulama devreye girerken bunlar `wrangler secret put` ile Cloudflare'a taşınacak. **Hiçbiri repoya, dokümana veya sohbete yapıştırılmayacak** — bana da göndermene gerek yok, kurulumun bittiğini söylemen yeterli.

Ayrıca **yetkilendirme tarihini not et** — 10. gün testi için lazım.

---

## Adım 8 — Çalıştığını doğrula

`SENIN_*` değerlerini doldurup çalıştır:

```bash
ACCESS=$(curl -s -X POST https://oauth2.googleapis.com/token \
  --data-urlencode "client_id=SENIN_CLIENT_ID" \
  --data-urlencode "client_secret=SENIN_CLIENT_SECRET" \
  --data-urlencode "refresh_token=SENIN_REFRESH_TOKEN" \
  --data-urlencode "grant_type=refresh_token" | sed -n 's/.*"access_token" *: *"\([^"]*\)".*/\1/p')

curl -s -X POST "https://www.googleapis.com/calendar/v3/freeBusy" \
  -H "Authorization: Bearer $ACCESS" -H "Content-Type: application/json" \
  -d '{"timeMin":"2026-08-31T10:00:00Z","timeMax":"2026-08-31T17:00:00Z","items":[{"id":"primary"}]}'
```

`{"kind":"calendar#freeBusy",...,"calendars":{"primary":{"busy":[...]}}}` görüyorsan kurulum tamam. `busy` dizisinin boş olması sorun değil — o saatlerde takvimin boş demek.

---

## Sorun giderme

| Hata | Sebep | Çözüm |
|---|---|---|
| Yanıtta `refresh_token` alanı yok | `access_type=offline` veya `prompt=consent` eksikti | 6a'yı belgedeki bağlantıyla tekrarla |
| `invalid_grant` (kod değişiminde) | Kod süresi doldu veya `%2F` → `/` çevrilmedi | 6a'dan başla |
| `redirect_uri_mismatch` | Adım 5'teki URI ile istekteki birebir aynı değil | İkisini de `http://localhost` yap |
| `Error 400: admin_policy_enforced` veya "Access blocked: authorization error" | **Workspace yöneticisi üçüncü taraf uygulamaları kısıtlamış.** Projemiz `indoles.com.tr` kuruluşuna bağlı olmadığı için Workspace bizi "üçüncü taraf" sayıyor | Tek çözüm yöneticide: Admin Console → Security → Access and data control → API controls → Manage Third-Party App Access → client ID'yi **Trusted** olarak ekleme. Bu 2 dakikalık bir işlem; DWD kurmaktan çok daha küçük bir talep. Bu hatayı alırsan bana söyle, yöneticiye iletilecek metni hazırlarım |
| `insufficient authentication scopes` (freeBusy'de) | İzin ekranında iki kapsam da onaylanmadı | 6a'yı tekrarla, iki yetkinin de göründüğünü teyit et |

---

## 10. gün testi — bu yolun tek açık ucu

Resmî dokümantasyon 7 günlük kısıtı açıkça **"Testing"** durumuna bağlıyor ve yayınlamanın bunu kaldırdığını ikincil kaynaklar da doğruluyor. Yine de "In production ama doğrulanmamış" durumu için Google net bir taahhüt yazmıyor.

**Yetkilendirmeden 8-10 gün sonra Adım 8'i tekrar çalıştır.**

- Çalışıyorsa → yol doğrulandı, konu kapanır.
- `invalid_grant` alırsan → 7 gün kısıtı yayınlanmış uygulamalara da uygulanıyor demektir. O durumda tek kalıcı çözüm projeyi `indoles.com.tr` kuruluşuna bağlayıp Internal'a geçmek, bu da yönetici erişimi gerektirir. Bana söyle, o senaryonun planını çıkarırım.

Bu test uygulama planında bir görev olarak yer alacak; unutulmaya bırakılmıyor.

---

## Yetkinin bozulduğu nasıl anlaşılır

Refresh token kalıcıdır ama sonsuz değildir. Geçersiz olma sebepleri: 6 ay hiç kullanılmaması, Google hesabında "tüm oturumları kapat" denmesi, parola değişikliği sonrası iptal, izinlerin hesap ayarlarından kaldırılması.

Rezervasyon sistemi bu duruma karşı iki savunmayla gelecek (spec §8):

1. **Aylık canlılık işi** — Cloudflare Cron küçük bir `freeBusy` sorgusu atar; hem 6 aylık atıl kalma sayacını sıfırlar hem token'ı erken doğrular.
2. **`invalid_grant` yakalama** — Google bu hatayı döndürdüğünde sana "takvim bağlantısı yeniden yetkilendirme istiyor" maili gider, rezervasyon arayüzü de "uygun saat görünmüyor, bize yazın" davranışına düşer. Sistem sessizce durmaz.

Yeniden yetkilendirme gerekirse **yalnız Adım 6**'yı tekrarla — proje, API, yayın durumu ve istemci yerinde kalır.
