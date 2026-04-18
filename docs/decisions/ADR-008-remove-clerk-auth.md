# ADR-008: Clerk / Auth Kaldırılması

**Durum:** Önerildi
**Tarih:** 2026-04-17
**Karar sahibi:** Burak Arda Özgül
**Bağlı:** `docs/superpowers/specs/2026-04-17-simplification-design.md`

## Bağlam

`docs/09-auth-roles-permissions.md` 4 rol (guest/user/expert/admin) tanımlıyor. Launch'ta:
- Self-signup kullanıcı yok
- Danışan vitrini iç ekip (Faz 1), self-signup yok
- Admin panel ihtiyacı somutlaşmadı (mail + PostHog yeterli)
- Müşteri portalı Faz 2'ye ertelendi (CLAUDE.md §6)

## Karar

Clerk + sign-in/sign-up route'ları + role permission kodu kaldırılır. `docs/09`'daki KVKK bölümü `docs/14-privacy-kvkk.md`'ye taşınır; rollerle ilgili bölümler arşivlenir.

## Sonuç

**Olumlu:** `@clerk/nextjs`, `svix`, auth middleware, webhook handler, role-check kod bloğu (~800 satır) kalkar.

**Olumsuz:** Sign-up/sign-in URL'leri 410 veya homepage'e redirect olur; gelen 404 için SEO etkisi — robots.txt ve redirect mapping eklenir.

## Yeniden değerlendirme tetikleyicileri

- Müşteri portalı ihtiyacı somutlaşırsa (Faz 2)
- Danışan self-signup açılırsa — ama bu CLAUDE.md §6'da explicit dışlandı
