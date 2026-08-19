# ADR-010: DB (Neon + Drizzle) Kaldırılması

**Durum:** Accepted — uygulandı (kod doğrulaması: 2026-08-19)
**Tarih:** 2026-04-17
**Karar sahibi:** Burak Arda Özgül
**Bağlı:** `docs/superpowers/specs/2026-04-17-simplification-design.md` §5, `ADR-008`, `ADR-009`

## Bağlam

Neon + Drizzle katmanı şu ihtiyaçlar için kuruldu:
- Auth user storage → ADR-008 ile düşer
- Payment transactions → ADR-009 ile düşer
- `popup_submissions` lead tablosu → spec ile Resend + PostHog'a devrediliyor
- Consultant profile, service, package content → ADR-006 ile statik TS + MDX'e geçti

DB için sürdürülen nedenler kalmadı.

## Karar

`src/server/db/*` (schema, migrations, mutations, client), `drizzle.config.ts`, Neon env değişkenleri kaldırılır. Lead verisi Resend mail + PostHog person properties'te yaşar.

## Sonuç

**Olumlu:** 
- `drizzle-orm`, `drizzle-kit`, `drizzle-zod`, `@neondatabase/serverless`, `pg`, `@types/pg` çıkar
- DB migration disiplini kalkar
- Neon maliyeti sıfır

**Olumsuz:**
- "Son 30 gün lead" gibi sorgular PostHog'a taşınır
- Duplicate submission kontrolü launch'ta yok (Spec §5.1.4)
- Popup → Cal.com booking ID eşleşmesi launch'ta yok (spec §12 risk)

## Yeniden değerlendirme tetikleyicileri

- PostHog event volume free tier limitini aşarsa (1M/ay)
- Lead raporlama mail aramaktan daha yapılandırılmış ihtiyaca dönüşürse
- CRM entegrasyonu kritikleşirse (HubSpot/Pipedrive) → ayrı ADR
