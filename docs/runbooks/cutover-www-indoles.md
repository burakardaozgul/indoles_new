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

## Mail riski: Resend'i kurarken kök SPF'e DOKUNMA

İletişim formu Resend üzerinden mail gönderiyor. Resend'i `indoles.com.tr` için kurarken en sık yapılan hata **ikinci bir SPF kaydı eklemek** — bir alan adında yalnız bir SPF TXT kaydı olabilir, ikincisi eklendiğinde **ikisi birden geçersiz olur** ve Veridyen'den giden tüm normal mailler de düşer.

Üstüne DMARC `p=quarantine` olduğu için hizalanmayan gönderim doğrudan spam klasörüne gider.

**Doğru kurulum — kök kayıtlara dokunmadan.** Resend panelinde domain eklerken "custom return path" / subdomain yöntemi kullanılır. Eklenecek üç kayıt da **yeni**, hiçbiri mevcut kaydı değiştirmiyor:

| Tip | Ad | İçerik |
|---|---|---|
| MX | `send.indoles.com.tr` | Resend'in verdiği `feedback-smtp.<bölge>.amazonses.com` (öncelik 10) |
| TXT | `send.indoles.com.tr` | `v=spf1 include:amazonses.com ~all` |
| TXT | `resend._domainkey.indoles.com.tr` | Resend panelindeki DKIM anahtarı |

Gönderen adresi yine `digital@indoles.com.tr` olabilir: DMARC hizalaması **DKIM üzerinden** sağlanıyor, DKIM kaydı kök alan adında duruyor. Yanıtlar Veridyen kutusuna düşmeye devam eder.

> **Kontrol:** kurulumdan sonra apex TXT'te **hâlâ tek bir `v=spf1` kaydı** olmalı. İkinci bir tane görürsen dur.

---

## Cutover öncesi kapatılması gerekenler

| # | Ne | Durum | Kim |
|---|---|---|---|
| 1 | Resend üretim API anahtarı + domain doğrulaması | Eksik (`.env.local`'de 6 karakterlik değer) | Burak |
| 2 | Resend DNS kayıtları (yukarıdaki üç satır) | Eksik | Burak / DNS yetkili token |
| 3 | Turnstile gerçek site + secret anahtarı | Test anahtarı (`1x0000…AA` = her zaman geçer) | Burak |
| 4 | GA4 Measurement ID | Eksik | Burak |
| 5 | Gönderen/lead adresi kararı | Karışık: `hello@` vs `digital@`, lead `burak@` | Burak |
| 6 | Worker secret'ları | `wrangler secret list` → boş | Claude (değerler gelince) |
| 7 | DNS yetkili Cloudflare token | Mevcut token DNS okuyamıyor | Burak |

**3 ve 4 build zamanında koda gömülüyor** — sonradan secret eklemek düzeltmiyor, üretim build'i bu değerlerle alınmalı.

**1 numaralı GSC doğrulaması gerekmiyor:** apex TXT'te zaten var.

---

## Sıra (değerler geldikten sonra)

1. `.env.local`'e gerçek değerler yazılır
2. Sunucu tarafı sırlar Cloudflare'e taşınır: `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `LEAD_INBOX_EMAIL`, `SALES_INBOX_EMAIL`, `RESEND_FROM_EMAIL`, `RESEND_AUTOREPLY_FROM_EMAIL`
3. `wrangler.jsonc`'de `www.indoles.com.tr` custom domain satırı açılır
4. **Üretim** build + deploy: `pnpm cf:deploy` (preview değil — `NEXT_PUBLIC_APP_STAGE=production`, robots `Allow`)
5. `scripts/cf-smoke.sh https://www.indoles.com.tr` — 29 kontrol
6. Elle doğrulama: iletişim formu gerçekten mail gönderiyor mu, Turnstile gerçekten doğruluyor mu, GA4 olay düşüyor mu
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
