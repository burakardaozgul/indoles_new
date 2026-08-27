# ADR-026 — Mail gönderimi Resend yerine Veridyen SMTP

- **Tarih:** 2026-08-28
- **Statü:** Kabul edildi
- **Bağlam:** ADR-024 (Cloudflare Workers), `docs/runbooks/cutover-www-indoles.md`
- **Yerine geçtiği:** `docs/05-tech-architecture.md` ve `CLAUDE.md`'deki "Email: Resend" satırı

## Karar

Transactional mail (iletişim formu bildirimi, otomatik yanıt, popup lead
bildirimi) Resend yerine **Veridyen'in kendi SMTP sunucusundan** gönderilir.
Gönderim `worker-mailer` ile `polo.veridyen.com:587` üzerinden, STARTTLS ve
AUTH LOGIN ile yapılır.

## Neden

Soru Burak'tan geldi: mail zaten Veridyen'de dururken neden ayrıca Resend
kuruyoruz. Savunulabilir bir cevabı yoktu; üstelik projenin kendi kuralı
(`CLAUDE.md` §3) yeni bağımlılığın gerekçelendirilmesini istiyor ve burada
yeni olan Resend'di.

**Belirleyici gerekçe DNS riski.** Resend'i `indoles.com.tr` için kurmak
gönderici kayıtları eklemeyi gerektiriyordu. Bir alan adında yalnız tek bir SPF
TXT kaydı olabilir; ikinci bir kayıt eklendiğinde ikisi birden geçersiz olur ve
Veridyen'den giden normal mail trafiği de bozulur. DMARC `p=quarantine` olduğu
için bu bozulma gürültülü değil sessiz olurdu — mailler spam klasörüne düşer,
kimse fark etmez. SMTP yolunda bu risk **tamamen** ortadan kalkıyor: alan adının
SPF, DKIM ve DMARC kaydı zaten Veridyen'i yetkilendiriyor, hiçbir DNS
değişikliği gerekmiyor.

İkincil kazançlar: Worker paketinden `resend` çıkıyor (3 MB sınırında yalnız
~16 KiB boşluğumuz vardı) ve cutover'dan bir blokaj eksiliyor — Resend
anahtarı ve domain doğrulaması artık beklenmiyor.

## Bunun mümkün olduğu nasıl doğrulandı

"Workers SMTP konuşamaz" bilgisi eskimiş. `cloudflare:sockets` ile giden TCP
mümkün; port 25 kapalı ama 587 ve 465 açık. Ölçüldü (2026-08-28):

```
polo.veridyen.com:587  açık        Exim 4.99.5
250-AUTH PLAIN LOGIN               worker-mailer ikisini de destekliyor
250-STARTTLS                       ✓
250-LIMITS MAILMAX=1000            form hacminin çok üstünde
```

`nodejs_compat` zaten açıktı, `@react-email/render` zaten bağımlılıktaydı —
şablonları HTML'e çevirmek ek maliyet getirmedi.

## Ölçümle gelen iki kısıt

**1. Gönderen adresi sunucu tarafından dayatılıyor.** `noreply@` ile kimlik
doğrulayıp `digital@` adına gönderme denendi ve reddedildi:

```
550 Gonderici adres ile header bigisi eslesmeli
```

Zarf ve header From'un ikisi de kimlik doğrulanan kutuya eşit olmak zorunda.
Bu yüzden `from` çağıranların parametresi değil, modülün sabiti: **From
`noreply@indoles.com.tr`, Reply-To `digital@indoles.com.tr`.** Yanıtlar yine
doğru kutuya düşüyor.

**2. Parola ASCII olmak zorunda.** `worker-mailer` kimlik bilgilerini `btoa()`
ile kodluyor; Latin1 dışı bir karakter (ör. `İ`, U+0130) doğrudan
`InvalidCharacterError` fırlatıyor. Sunucu UTF-8 parolayı kabul etse bile
istemci o noktaya varamıyor. `noreply@` kutusunun parolası bu yüzden yalnız
ASCII karakterlerden oluşur — kurulum runbook'una yazıldı.

## Kabul edilen ödünler

**`worker-mailer` küçük bir topluluk kütüphanesi** (230 yıldız, 43 commit) ve
lead yakalama yolunda duruyor. Dış bağımlılığı yok ve SMTP donmuş bir protokol;
terk edilirse kod kendimize alınabilecek kadar küçük. Mevcut üç deneme + backoff
ve Sentry kaydı yerinde kalıyor.

**Teslimat günlüğü ve bounce webhook'u yok.** Resend bunları veriyordu. Karşılığında
başarısızlık zaten Sentry'ye düşüyor; ayrı bir gözlem katmanı launch için
gerekli görülmedi.

**Paylaşımlı hosting gönderim limitleri** var (`MAILMAX=1000`). İletişim formu
hacmi bunun çok altında.

## Alternatifler

| Seçenek | Neden seçilmedi |
|---|---|
| Resend (önceki plan) | Yeni bağımlılık, DNS/SPF riski, cutover'ı bloke ediyordu |
| `nodemailer` | Node `net` modülüne bağlı, Workers'da çalışmıyor |
| Cloudflare Email Workers | Gelen mail içindir, giden transactional mail için değil |

## Sonuçlar

- `resend` paketi kaldırıldı, `worker-mailer` eklendi
- `src/lib/email/client.ts` silindi (ölüydü, hiçbir yerden import edilmiyordu)
- `RESEND_*` env değişkenleri yerine `SMTP_*` + `MAIL_FROM` + `MAIL_REPLY_TO`
- `sendMailWithRetry` artık `from` almıyor; React şablonu HTML ve düz metne
  kendisi çeviriyor
- Cutover'dan Resend blokajı düştü
