# Gizlilik ve KVKK

> **Kaynak:** Bu belge `docs/09-auth-roles-permissions.md` §6.3 ve §7.5 bölümlerinden sadeleştirme kapsamında ayrıştırılmıştır (2026-04-17, ADR-008).
>
> **Bağlı belgeler:** `docs/superpowers/specs/2026-04-17-simplification-design.md` §2.3, `docs/decisions/ADR-008-remove-clerk-auth.md`, `docs/decisions/ADR-010-remove-database.md`.

INDOLES web platformunun veri işleme yaklaşımı ve KVKK (Kişisel Verilerin Korunması Kanunu) / GDPR uyum prensipleri bu belgede tanımlanır. Launch mimarisi DB-less olduğundan (ADR-010) veri minimizasyonu tasarım gereği sağlanır.

---

## 1. Toplanan Veriler

| Veri | Nerede Tutulur | Süre |
|------|---------------|------|
| Ziyaretçi formu (ad, e-posta, telefon, şirket, mesaj) | Resend mail arşivi | Mail saklama politikasına göre |
| Popup Stage 3 (ad, e-posta, persona, sorunlar) | Resend mail arşivi + PostHog person properties | Resend politikası + PostHog EU (GDPR uyumlu) |
| Analitik olaylar (sayfa görüntüleme, tıklamalar, funnel) | PostHog EU Cloud | PostHog EU (GDPR uyumlu, opt-in) |
| Rezervasyon verisi | Cal.com Cloud | Cal.com veri işleme politikasına göre |

Kalıcı PostgreSQL DB yok (ADR-010). Kullanıcı hesabı, session, rol bilgisi tutulmaz.

---

## 2. Veri Saklama ve Silme

### 2.1 Resend mail arşivi

- Kişisel veri içeren mailler (contact form, popup submit) Resend'de saklanır.
- **Silme talebi:** Resend API ile ilgili mail silinir.
- Resend'in veri merkezleri AB bölgesindedir (GDPR uyumlu).

### 2.2 PostHog person properties

- `persona`, `industry`, `role`, `company_name`, `first_seen_locale`, `utm_*`, `popup_completed_at`, `selected_problems` gibi özellikler person kaydında tutulur.
- **Silme talebi:** PostHog `/api/person/{distinct_id}` DELETE endpoint'i ile kişi kaydı silinir; tüm ilgili olaylar anonim kalır.
- PostHog EU Cloud GDPR uyumlu; veri merkezi AB içinde.

### 2.3 Cal.com

Cal.com rezervasyon verisi doğrudan Cal.com Cloud'da saklanır. Silme talebi Cal.com'un GDPR sürecine yönlendirilir.

---

## 3. Cookie Banner

- PostHog analitik cookie'leri EEA ziyaretçileri için opt-in.
- Functional cookie'ler (next-intl locale, persona state client cookie) zorunlu; önceden onay gerekmez.

---

## 4. Veri Silme Prosedürü (KVKK/GDPR Talebi)

Bir ziyaretçi "kişisel verilerimi silin" talebi ilettiğinde:

1. **E-posta talebi** → `burak@indoles.com.tr` veya iletişim formu.
2. **Kimlik doğrulama** — Talep sahibinin formu dolduran kişi olduğunu doğrula (e-posta + şirket eşleşmesi).
3. **Resend silme** — Talep sahibine ait mail(ler)i Resend dashboard'dan veya API ile sil.
4. **PostHog silme** — PostHog EU'dan `distinct_id` üzerinden person DELETE.
5. **Onay e-postası** — Silme işlemi tamamlandı bildirimi.

Hedef süre: talepten itibaren **30 gün** içinde.

---

## 5. Faz 2 Notları

Faz 2'de auth sistemi (Clerk veya benzeri) eklenirse bu belge genişletilmelidir:
- Hesap silme akışı (self-serve "Hesabımı sil" UI)
- PII anonymization job (background)
- Clerk GDPR export endpoint
- Neon şema seviyesinde PII tagging

---

## 6. Açık Sorular

| # | Soru | Önerilen cevap | Ne zaman |
|---|------|---------------|---------|
| 1 | KVKK aydınlatma metni hangi sayfada? | Footer'da `/kvkk` sayfası | Launch öncesi |
| 2 | Cookie banner vendor seçimi? | `@consent-manager` veya PostHog built-in | Launch öncesi |
| 3 | Resend data retention policy nedir? | Resend dokümantasyonunu kontrol et | Launch öncesi |
