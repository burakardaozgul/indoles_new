# ADR-011: Background Jobs (Inngest) Kaldırılması

**Durum:** Accepted — uygulandı (kod doğrulaması: 2026-08-19)
**Tarih:** 2026-04-17
**Karar sahibi:** Burak Arda Özgül

## Bağlam

Inngest şu akışlar için planlanmıştı:
- Popup lead → mail queue
- Clerk webhook → Neon sync (ADR-008 ile düşer)
- Payment webhook → receipt mail (ADR-009 ile düşer)
- 24 ay retention cron (ADR-010 ile düşer — DB yok)

Kalan tek use-case: popup lead → mail. Route içinde sync çağrı + 3 retry yeterli.

## Karar

Inngest tamamen kaldırılır. `src/app/api/inngest/*`, `inngest.config.ts` silinir. Mail gönderimi route handler içinde sync olarak yapılır; fail durumunda exponential backoff retry.

## Sonuç

**Olumlu:** `inngest` dependency + ayrı SDK + function schema kalkar.

**Olumsuz:** Launch'ta mail fail'i için queue yok. 3 retry sonrası 500 dönülür, Sentry capture edilir. İlk 12 ay için kabul.

## Yeniden değerlendirme tetikleyicileri

- Mail fail oranı >%1/ay
- Webhook-triggered async iş ihtiyacı doğarsa (örn. Cal.com → CRM sync)
