# Runbook — `www.indoles.com.tr` cutover (WordPress → Cloudflare Workers)

> **Statü:** Hazırlık · **Karar dayanağı:** ADR-024 · **Ölçüm tarihi:** 2026-08-28
> **Geri dönüşü:** Var ama dakikalar sürer — bkz. son bölüm.

## Mevcut altyapı (ölçüldü, varsayım değil)

| Ne | Nerede | Cutover'da |
|---|---|---|
| Site (`www`) | Veridyen bayi hosting, WordPress + LiteSpeed | **Worker'a geçiyor** |
| Apex (`indoles.com.tr`) | 301 → `www` | Değişmiyor — **ama bkz. uyarı** |
| **Mail** | Veridyen · MX `polo.veridyen.com` | **DOKUNULMUYOR** |
| SPF | `v=spf1 +a +mx +ip4:45.151.248.13 +ip4:45.151.249.52 +include:_spf.protection.veridyen.com +include:relay.mailchannels.net ~all` | **DOKUNULMUYOR** |
| DMARC | `v=DMARC1; p=quarantine;` | **DOKUNULMUYOR** |
| `mail.indoles.com.tr` | Cloudflare proxy arkasında | Değişmiyor |
| `leadload.indoles.com.tr` | **DNS kaydı yok** | Ayrı iş — bu cutover'ın parçası değil |
| GSC doğrulaması | Apex TXT'te `google-site-verification=...` | Zaten var, meta tag gerekmiyor |
| OpenAI doğrulaması | Apex TXT'te `openai-domain-verification=...` | Zaten var |

**Worker'ı `www`ye almak mail'i etkilemez.** Mail apex'teki MX kaydından yürüyor; cutover yalnız `www` A/CNAME kaydını değiştiriyor. İkisi ayrı kayıtlar.

---

## Mail: DNS'e hiç dokunulmuyor (ADR-026)

Mail gönderimi Veridyen'in kendi SMTP sunucusundan yapılıyor. Alan adının SPF, DKIM ve DMARC kaydı **zaten Veridyen'i yetkilendiriyor**, dolayısıyla cutover için **hiçbir mail DNS kaydı eklenmiyor veya değiştirilmiyor.**

Bu, planın önceki halindeki en büyük riski ortadan kaldırdı: dış bir gönderici (Resend) eklemek kök SPF kaydına dokunmayı gerektiriyordu ve alan adında tek bir SPF kaydı olabildiği için hatalı bir ekleme Veridyen'den giden normal mailleri de bozardı — üstelik DMARC `p=quarantine` olduğu için sessizce.

| Ne | Değer |
|---|---|
| Sunucu | `polo.veridyen.com:587` · STARTTLS · AUTH LOGIN |
| Kimlik | `noreply@indoles.com.tr` — yalnız gönderim için açılmış ayrı kutu |
| From | `INDOLES <noreply@indoles.com.tr>` — **sunucu dayatıyor**, değiştirilemez |
| Reply-To | `digital@indoles.com.tr` — yanıtlar buraya döner |

**Neden From `digital@` değil:** Exim, zarf ve header From'un kimlik doğrulanan kutuya eşit olmasını şart koşuyor. Denendi, `550 Gonderici adres ile header bigisi eslesmeli` ile reddedildi.

> **Parola ASCII olmak zorunda.** `worker-mailer` kimlik bilgilerini `btoa()` ile kodluyor; `İ ı ş ğ ü ö ç` gibi bir karakter doğrudan `InvalidCharacterError` fırlatıyor ve mail hiç gönderilmiyor. Sunucu UTF-8 parolayı kabul etse bile istemci o noktaya varamıyor.

---

## Cutover öncesi kapatılması gerekenler

| # | Ne | Durum | Kim |
|---|---|---|---|
| ~~Resend anahtarı + DNS kayıtları~~ | | ✅ **Konu kapandı** — ADR-026 ile Veridyen SMTP'ye geçildi, DNS değişikliği gerekmiyor | — |
| ~~GA4 Measurement ID~~ | | ✅ `G-236D96V8XL` | — |
| ~~Gönderen/lead adresi kararı~~ | | ✅ From `noreply@`, Reply-To + lead kutusu `digital@` + `burak@` + kişisel Gmail | — |
| ~~Turnstile anahtarları~~ | | ⚠️ Alındı ama **bayrakla devre dışı** (ADR-028): challenge host'u IPv4'te çözülmüyor, hiçbir ağda form geçmiyordu. Savunma: bal küpü + süre tuzağı. Geri açma tetikleyicisi ADR'de | — |
| 1 | **`noreply@` parolasının ASCII'ye çevrilmesi** | Mevcut parola `İ` ile başlıyor — `worker-mailer` bunu gönderemez | Burak |
| 2 | Worker secret'ları | `wrangler secret list` → boş | Claude (parola gelince) |
| 3 | `www` DNS kaydının ekran görüntüsü | Token DNS okuyamıyor; geri dönüş için gerekli | Burak |

**Turnstile site anahtarı ve GA4 kimliği build zamanında koda gömülüyor** (`NEXT_PUBLIC_*`) — sonradan `wrangler secret` eklemek bunları düzeltmiyor; üretim build'i doğru değerlerle alınmalı. Kalan üçü (Resend anahtarı, Turnstile secret, adresler) çalışma zamanında okunuyor, secret olarak geçilebilir.

**GSC doğrulaması ayrı bir madde değil:** apex TXT'inde zaten duruyor, meta tag gerekmiyor.

---

## Anahtarları nereden alacaksın (tamamlandı — kayıt için duruyor)

### Turnstile (spam koruması)

1. [dash.cloudflare.com](https://dash.cloudflare.com) → sol menü **Turnstile** → **Add widget**
2. Widget name: `indoles-web`
3. **Hostnames** — üçünü de ekle, eksik olan hostta doğrulama sessizce başarısız olur:
   - `www.indoles.com.tr`
   - `preview.indoles.com.tr`
   - `localhost`
4. Widget Mode: **Managed** (Cloudflare'in önerdiği varsayılan; yalnız şüpheli trafikte kutucuk gösterir)
5. **Create** → iki değer çıkar:
   - **Site Key** → `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (gizli değil, sayfa kaynağında görünür)
   - **Secret Key** → `TURNSTILE_SECRET_KEY` (gizli, yalnız sunucuda)

> Not: `CLAUDE.md` Turnstile'ı "Invisible" diye kaydediyor. Form görünür bir kapsayıcıyla render ediyor ve token gelene kadar gönder düğmesini kilitliyor — iki mod da çalışır. Managed daha güçlü koruma verdiği için önerilen o; Invisible tercih edilirse `CLAUDE.md` satırı zaten doğru kalır.

### Değerleri nereye koyacaksın

Üçünü `.env.local`'e ekle, bana göndermene gerek yok:

```
RESEND_API_KEY=re_...
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAA...
TURNSTILE_SECRET_KEY=0x4AAA...
```

"Bitti" demen yeterli; sırları Cloudflare'e taşımak ve üretim build'ini almak bende.

---

## Sıra (değerler geldikten sonra)

1. `.env.local`'e gerçek değerler yazılır
2. Sunucu tarafı sırlar Cloudflare'e taşınır: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `TURNSTILE_SECRET_KEY`, `MAIL_FROM`, `MAIL_REPLY_TO`, `LEAD_INBOX_EMAIL`, `SALES_INBOX_EMAIL`
3. `wrangler.jsonc`'de `www.indoles.com.tr` custom domain satırı açılır
4. **Üretim** build + deploy: `pnpm cf:deploy` (preview değil — `NEXT_PUBLIC_APP_STAGE=production`, robots `Allow`)
5. `scripts/cf-smoke.sh https://www.indoles.com.tr` — 29 kontrol
6. Elle doğrulama: iletişim formu gerçekten mail gönderiyor mu (üç alıcıya da), Turnstile gerçekten doğruluyor mu, GA4 olay düşüyor mu
7. Eski WP URL'lerinden örnek 301 kontrolü (45 yönlendirme haritası)
8. GSC + Bing'e sitemap gönderimi, IndexNow

**4. adımda `www` DNS kaydı Veridyen'den Worker'a geçer.** Cloudflare mevcut kaydı ezer; o an eski site erişilemez olur.

---

## Uyarı: Veridyen hosting'i hemen kapatma

Cutover'dan sonra `www` Worker'da olsa da **apex hâlâ Veridyen'e bakıyor** ve 301'i Veridyen'in sunucusu üretiyor. Hosting kapatılırsa `indoles.com.tr` → `www` yönlendirmesi kırılır — kök alan adı doğrudan yazan ziyaretçiler ve kök adrese verilmiş eski backlink'ler kaybolur.

Kapatmadan önce apex de Worker'a alınmalı (ikinci custom domain) veya Cloudflare redirect rule'u ile karşılanmalı. Bu ayrı bir adım; cutover'ı bloke etmiyor ama unutulmamalı.

Mail zaten Veridyen'de kalmaya devam ettiği için hosting paketinin mail tarafı her hâlükârda açık kalacak.

---

## Geri dönüş

Bir şey ters giderse `www`yi WordPress'e döndürmek:

1. Cloudflare panel → Workers & Pages → `indoles-web` → Settings → Domains & Routes → `www.indoles.com.tr` **kaldır**
2. DNS → `www` kaydını Veridyen sunucusuna geri ver (cutover öncesi değeri kaydedilmiş olmalı — **adım 3'ten önce ekran görüntüsü al**)
3. Yayılma birkaç dakika

Site içeriği WordPress'te durmaya devam ettiği için veri kaybı riski yok; geri dönüş yalnız DNS meselesi.

> **Cutover öncesi mutlaka:** Cloudflare DNS panelinde `www` kaydının mevcut değerinin ekran görüntüsünü al. Token DNS okuyamadığı için bu değeri programatik olarak kaydedemiyorum.

---

## Cutover kaydı (2026-08-28, tamamlandı)

| Adım | Sonuç |
|---|---|
| Eski `www` A kaydının silinmesi | Burak (Cloudflare elle oluşturulmuş kaydın üstüne yazmıyor — `code 100117`) |
| Worker custom domain | `www.indoles.com.tr` bağlandı |
| Duman testi | **30/30** |
| robots.txt | `Allow: /` + AI crawler'lar açık |
| Sitemap | 136 URL · GSC'ye gönderildi, 136 bağlantı okundu |
| GA4 | `G-236D96V8XL` canlıda |
| Apex | 301 → `www` (Veridyen üretiyor) |
| İletişim formu | Canlıda uçtan uca: HTTP 200, mail üç kutuya |

**`preview.indoles.com.tr` kaldırıldı.** Tek Worker'da iki host olduğu için preview
kendi `robots.txt`'sini alamıyor, üretim robots'unu (`Allow`) servis ediyordu —
indekslenme riski. Cutover'dan sonra doğrulama adresine ihtiyaç kalmadığı için
host tamamen kaldırıldı; DNS kaydı da wrangler tarafından silindi.

Aynı sebeple `cf:build:preview` ve `cf:deploy:preview` script'leri de silindi:
preview host'u yokken bu script'ler üretim Worker'ına `Disallow: /` basardı —
LG-02'nin en pahalı biçimi. Doğrulama artık `pnpm cf:preview` (yerel Workers
çalışma zamanı) ve CI'daki robots/SEO kontrolleriyle yapılıyor.

Yeniden bir doğrulama adresi gerekirse **ayrı bir Worker script'i** olarak
kurulmalı — aynı script'e ikinci host bağlamak bu sorunu geri getirir.

### Hâlâ açık

- **Veridyen kapatılmayacak:** apex 301'ini ve mail'i o taşıyor (Burak: "bir süre açık")
- Apex'i de Worker'a almak — ayrı iş, launch'ı bloke etmiyor
- Bing Webmaster sitemap gönderimi
