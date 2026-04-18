# ADR-013: Popup Altkatman — tRPC → REST, DB → Mail+PostHog

**Durum:** Önerildi
**Tarih:** 2026-04-17
**Karar sahibi:** Burak Arda Özgül
**Bağlı:** `docs/superpowers/specs/2026-04-17-entry-popup-design.md`, `docs/superpowers/specs/2026-04-17-simplification-design.md` §5.1

## Bağlam

Entry popup spec (2026-04-17) tRPC mutation + `popup_submissions` Neon tablosu + Inngest queue tabanlı lead akışı öneriyordu. Sadeleştirme ile tRPC/DB/Inngest düşüyor ama popup davranışı (3-stage, problem taxonomy, cookie, chip pattern, KVKK, event taksonomisi) korunacak.

## Karar

Popup altkatmanı:
- `tRPC popup.submit` → `POST /api/visitor-profile`
- `INSERT popup_submissions` → Resend mail (iç + autoreply) + PostHog `identify` + `capture`
- Server-side Cal.com API call → Cal.com embed client-side prefill URL ile değiştirilir
- Inngest queue → route içinde sync, 3 retry
- Chatbot context injection (entry-popup §8) → tamamen düşer (ADR-007 agent kaldırıldı)
- 24 ay retention cron → düşer (DB yok; mail arşivi + PostHog retention policy)
- Duplicate submission kontrolü (entry-popup §15.2) → tamamen düşer
- Cal.com booking ID ↔ popup submission eşleşmesi → Faz 2'ye ertelendi

Davranışsal spec (Stage 1/2/3, copy, cookie kuralları, a11y, viewport, layout, event taksonomisi, KVKK metin, i18n surface'leri) %100 korunur.

## Sonuç

**Olumlu:** Popup backend kod ~500 satırdan ~80 satıra iner. Migration disiplini, queue takibi kalkar.

**Olumsuz:** Popup-design §16'da planlanan ADR-004 (1 saat booking duration) ve ADR-005 (quickbook guest path) bu sadeleştirmede gereksizdir — yazılmayacak olarak işaretlenir; quickbook zaten auth'suz ve süre Cal.com event type'ında tanımlanır.

## Yeniden değerlendirme tetikleyicileri

- Popup conversion rate hedefi (%5-8) tutmazsa flow/backend ayrı değerlendirme
- Mail/PostHog yetmez hale gelirse ADR-010 ile birlikte revize

---

## Güncelleme — 2026-04-17: Cal.com embed → capture-only booking

**Karar sahibi:** Burak Arda Özgül

Booking stage'de Cal.com embed açma kaldırıldı. Yeni akış:

- Stage 3 → "booking" CTA → özel 2 kolonlu ekran (takvim + danışman kartı + form)
- Kullanıcı istediği gün + saati seçer; bu `preferredSlot {date, time}` olarak `visitorProfileSchema`'ya eklendi
- Backend: Cal.com API çağrısı yok, `buildCalEmbedUrl` kaldırıldı, yanıt `{ ok: true }` döner
- Mail template'e `preferredSlot` eklendi; Burak/ekip seçilen sloту görür ve manuel onaylar
- PostHog event'e `preferred_slot` property eklendi

**Gerekçe:** Cal.com API entegrasyonu gerçek müsaitlik kontrolü gerektiriyor; launch'ta ihtiyaç yok. Mail + manuel onay daha az karmaşıklık, aynı müşteri bilgisi.

**Faz 2 notu:** `src/lib/content/consultants.ts` ile persona-aware danışman eşleştirmesi ve gerçek Cal.com API entegrasyonu (availability check) değerlendirilecek.
