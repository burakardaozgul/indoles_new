# ADR-027 — Sentry kaldırıldı, hata raporlama Cloudflare observability'ye bırakıldı

- **Tarih:** 2026-08-28
- **Statü:** Kabul edildi
- **Bağlam:** ADR-024 (Cloudflare Workers), denetim bulgusu O-03
- **Tetikleyen:** Worker paketi 3 MB sınırını aştı ve deploy reddedildi

## Karar

`@sentry/nextjs` bağımlılığı kaldırıldı. Hata raporlama
`src/lib/observability/report.ts` içindeki tek bir `reportError()` fonksiyonuna
indirildi; bu fonksiyon yapılandırılmış bir satır olarak `console.error`'a
yazıyor ve kayıt Cloudflare Workers observability üzerinden aranabiliyor
(`wrangler.jsonc` içinde `observability.enabled: true`).

## Neden

**Sentry hiçbir şey yapmıyordu.** `Sentry.init` kod tabanının hiçbir yerinde
çağrılmıyordu — denetim O-03 bunu zaten kaydetmişti. SDK yükleniyor,
`captureException` çağrıları yapılıyor ama hiçbir olay hiçbir yere
gönderilmiyordu. Yani maliyet vardı, karşılığı yoktu.

**Maliyet ölçüldü ve küçük değildi.** Kendi SMTP istemcimiz (ADR-026) eklenince
Worker paketi 3 MB sınırını aştı ve Cloudflare deploy'u reddetti. Sentry
çıkarıldığında:

```
öncesi : gzip 3063 KiB  -> "exceeded size limits", deploy reddedildi
sonrası: gzip 2199 KiB  -> deploy başarılı
```

Tek bir ölü bağımlılık **~864 KiB** taşıyormuş; sınırın %28'i.

## Gözlemlenebilirlikte gerileme var mı

Hayır — çünkü gerileyecek bir şey yoktu. Sentry init edilmediği için bugüne
kadar tek bir hata bile toplanmadı. `console.error` ise Cloudflare panelinde
gerçekten görünüyor ve aranabiliyor. Bugünkü durum, dünkünden **daha iyi**.

Kaybedilen potansiyel: stack trace gruplama, sürüm ilişkilendirme, uyarı
kuralları. Bunlar Sentry doğru kurulsaydı gelecek faydalardı; ihtiyaç
duyulursa Workers Paid planında (10 MB sınır) yeniden değerlendirilebilir.

## Alternatifler

| Seçenek | Neden seçilmedi |
|---|---|
| Workers Paid'e geçmek (10 MB) | Ayda 5 dolar ödeyip çalışmayan bir SDK'yı taşımak; sorun boyut değil ölü kod |
| Sentry'yi düzgün kurmak (`init` eklemek) | Boyut sorununu büyütürdü ve launch'ta gereken bir şey değil |
| Kaldırıp hiçbir şey koymamak | `captureException` çağrı yerleri anlamsız kalırdı; tek fonksiyona indirmek niyeti koruyor |

## Sonuçlar

- `@sentry/nextjs` kaldırıldı, `next.config.ts`'ten `withSentryConfig` çıktı
- `src/lib/observability/report.ts` eklendi; üç çağrı yeri ona bağlandı
- Worker paketinde ~864 KiB boşaldı — sınırın altına inildi
- `CLAUDE.md` gözlemlenebilirlik satırı ve denetim O-03 güncellenmeli
