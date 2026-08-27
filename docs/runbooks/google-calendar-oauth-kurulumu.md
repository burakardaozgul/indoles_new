# Runbook — Google Calendar yetkilendirmesi (OAuth + kalıcı refresh token)

> **Kime:** Burak · **Süre:** ~15 dakika · **Sıklık:** bir kez (yetki bozulursa tekrar)
> **Karar dayanağı:** `docs/superpowers/specs/2026-08-27-rezervasyon-sistemi-design.md` §8
> **Neden servis hesabı değil:** Yönetici paneli erişimi yok → domain-wide delegation uygulanamıyor. Ayrıntılı eleme kaydı spec §8'de.

Bu belgenin sonunda elinde üç değer olacak: **client ID**, **client secret**, **refresh token**. Rezervasyon sistemi bu üçüyle takvimini okur, etkinlik açar ve Meet bağlantısı üretir.

---

## Adım 0 — Belirleyici kontrol: proje organizasyona bağlı mı?

**Bu adım her şeyi belirliyor, önce bunu yap.**

1. https://console.cloud.google.com adresine `burak@indoles.com.tr` ile gir.
2. Üst çubuktaki proje seçiciye tıkla.
3. Açılan pencerede sol üstte bir **kuruluş (organization) seçici** var. Orada `indoles.com.tr` yazıyor mu?

| Gördüğün | Anlamı | İzleyeceğin yol |
|---|---|---|
| `indoles.com.tr` seçilebiliyor | Projeler organizasyona bağlanabiliyor | **A yolu** — Internal. Token kalıcı. |
| Yalnız "No organization" var | Proje kişisel alanda | **B yolu** — External + Publish. Kurulumdan 8-10 gün sonra test şart. |

Sonucu bana söyle; kalan adımlar iki yol için de aşağıda, ama hangi yolda olduğumuzu bilmem gerekiyor.

---

## Adım 1 — Proje oluştur

Proje seçici → **New Project**.

- **Name:** `indoles-rezervasyon`
- **Organization / Location:** A yolundaysan **`indoles.com.tr`** seç. Bu alan sonradan değiştirilemez; yanlış seçersen projeyi silip yeniden açman gerekir.

Oluştur ve üst çubuktan bu projeye geç.

---

## Adım 2 — Calendar API'yi aç

Sol menü → **APIs & Services → Library** → arama kutusuna `Google Calendar API` → **Enable**.

Tek API yeter. Meet bağlantısı Calendar API üzerinden üretiliyor, ayrı bir Meet API'si açman gerekmiyor.

---

## Adım 3 — İzin ekranı (OAuth consent screen)

Sol menü → **APIs & Services → OAuth consent screen**.

### A yolu — Internal (tercih edilen)

- **User type: Internal** → Create
- App name: `INDOLES Rezervasyon`
- User support email: `burak@indoles.com.tr`
- Developer contact: `burak@indoles.com.tr`
- Kaydet.

Kapsam (scope) ekranında bir şey eklemene gerek yok — kapsamları yetkilendirme bağlantısında biz göndereceğiz.

**Internal'ın kazandırdığı:** refresh token'ın 7 günlük ömrü yok, doğrulama süreci yok, "bu uygulama doğrulanmamış" uyarısı yok.

### B yolu — External

- **User type: External** → Create
- Aynı alanları doldur, kaydet.
- Sonra izin ekranı sayfasının başındaki **"Publish App" → Confirm**'e bas. **Bu adım atlanırsa uygulama "Testing" durumunda kalır ve aldığın refresh token 7 gün sonra ölür** — sistem bir hafta sonra sessizce durur.
- Doğrulama (verification) **gönderme**. Gerek yok; tek kullanıcı sensin.

---

## Adım 4 — OAuth istemcisi oluştur

Sol menü → **APIs & Services → Credentials → Create Credentials → OAuth client ID**.

- **Application type:** `Web application`
- **Name:** `indoles-rezervasyon-worker`
- **Authorized redirect URIs → ADD URI:** `http://localhost`

  Tam olarak bu, sonunda eğik çizgi yok. Google yalnız localhost için http'ye izin veriyor; bu adres sadece yetkilendirme kodunu yakalamak için, bir sunucu çalıştırmayacağız.

**Create**'e bas. Açılan kutuda **Client ID** ve **Client secret** görünecek — ikisini de kopyala, bir sonraki adımda lazım.

---

## Adım 5 — Tek seferlik yetkilendirme

> **Uyarı:** Bu akışı gereksiz yere tekrarlama. Aynı istemci için üretilen refresh token sayısı sınırlı (100) ve sınır aşılınca **eski token'lar sessizce geçersiz olur** — yani çalışan sistemi durdurabilir.

### 5a. İzin bağlantısını aç

Aşağıdaki adreste `SENIN_CLIENT_ID` yerine kendi client ID'ni koy, tarayıcıya yapıştır:

```
https://accounts.google.com/o/oauth2/v2/auth?client_id=SENIN_CLIENT_ID&redirect_uri=http%3A%2F%2Flocalhost&response_type=code&access_type=offline&prompt=consent&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar.events%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar.events.freebusy
```

`access_type=offline` ve `prompt=consent` **zorunlu** — bunlar olmadan Google refresh token vermez, yalnız bir saatlik access token verir.

`burak@indoles.com.tr` ile giriş yap. İzin ekranında tam olarak şu iki yetki görünmeli — başkası görünüyorsa bağlantı yanlış kopyalanmıştır:

- *"View and edit events on all your calendars"* (`calendar.events`)
- *"See the availability on Google calendars you have access to"* (`calendar.events.freebusy`)

İzin ver.

### 5b. Kodu adres çubuğundan al

Tarayıcı `http://localhost/?code=4%2F0A...&scope=...` adresine gidip **"bağlanılamıyor" hatası verecek. Bu beklenen davranış** — orada bir sunucu yok. Önemli olan adres çubuğu.

Adres çubuğundan `code=` ile `&scope=` arasındaki değeri kopyala. İçindeki `%2F` karakterlerini `/` yap: `4%2F0AVMBsJ...` → `4/0AVMBsJ...`

**Kod birkaç dakikada geçersiz oluyor ve tek kullanımlık.** Sonraki adımı hemen yap; kaçırırsan 5a'yı tekrarla.

### 5c. Kodu refresh token'a çevir

Terminalde, değerleri kendi bilgilerinle değiştirerek:

```bash
curl -s -X POST https://oauth2.googleapis.com/token \
  --data-urlencode "client_id=SENIN_CLIENT_ID" \
  --data-urlencode "client_secret=SENIN_CLIENT_SECRET" \
  --data-urlencode "code=ADIM_5B_DEKI_KOD" \
  --data-urlencode "redirect_uri=http://localhost" \
  --data-urlencode "grant_type=authorization_code"
```

Dönen JSON'da **`refresh_token`** alanı olmalı:

```json
{ "access_token": "ya29...", "expires_in": 3599, "refresh_token": "1//0g...", "scope": "...", "token_type": "Bearer" }
```

| Sorun | Sebep |
|---|---|
| `refresh_token` alanı yok | `access_type=offline` veya `prompt=consent` eksikti. 5a'yı doğru bağlantıyla tekrarla. |
| `invalid_grant` | Kod süresi doldu veya `%2F` çevrilmedi. 5a'dan başla. |
| `redirect_uri_mismatch` | Adım 4'teki URI ile buradaki birebir aynı değil. |

---

## Adım 6 — Değerleri sakla

Uygulama henüz yazılmadı, o yüzden şimdilik **`.env.local`** (gitignore'da, repoya girmez):

```
GOOGLE_OAUTH_CLIENT_ID=...
GOOGLE_OAUTH_CLIENT_SECRET=...
GOOGLE_OAUTH_REFRESH_TOKEN=...
GOOGLE_CALENDAR_ID=primary
```

Uygulama devreye girerken bunlar `wrangler secret put` ile Cloudflare'a taşınacak. **Hiçbiri repoya, dokümana veya sohbete yapıştırılmayacak** — bana da göndermene gerek yok, kurulumun bittiğini söylemen yeterli.

---

## Adım 7 — Çalıştığını doğrula

`SENIN_*` değerlerini doldurup çalıştır; bugünün doluluk bilgisini döndürmeli:

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

`{"kind":"calendar#freeBusy", ...,"calendars":{"primary":{"busy":[...]}}}` görüyorsan kurulum tamam. `busy` dizisinin boş olması sorun değil — o saatlerde takvimin boş demek.

---

## Yetkinin bozulduğu nasıl anlaşılır

Refresh token kalıcıdır ama **sonsuz değildir**. Geçersiz olma sebepleri: 6 ay hiç kullanılmaması, Google hesabında "tüm oturumları kapat" denmesi, parola değişikliği sonrası iptal, veya (B yolundaysan) izin ekranının Testing'e düşmesi.

Rezervasyon sistemi bu duruma karşı iki savunmayla gelecek (spec §8):

1. **Aylık canlılık işi** — Cloudflare Cron küçük bir `freeBusy` sorgusu atar; hem 6 aylık atıl kalma sayacını sıfırlar hem token'ı erken doğrular.
2. **`invalid_grant` yakalama** — Google bu hatayı döndürdüğünde sana "takvim bağlantısı yeniden yetkilendirme istiyor" maili gider, rezervasyon arayüzü de "uygun saat görünmüyor, bize yazın" davranışına düşer. Sistem sessizce durmaz.

Yeniden yetkilendirme gerekirse **yalnız Adım 5**'i tekrarla — proje, API ve istemci yerinde kalır.

### B yolundaysan: 10. günde test

External + Publish yolunun 7 gün kısıtından gerçekten muaf olduğunu resmî dokümantasyon açıkça yazmıyor. Kurulumdan **8-10 gün sonra Adım 7'yi tekrar çalıştır.** Hâlâ çalışıyorsa yol doğrulanmış olur; `invalid_grant` alırsan Internal'a geçmek için projeyi organizasyona bağlamanın yolunu ararız.
