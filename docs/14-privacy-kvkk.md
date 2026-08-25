# Gizlilik ve KVKK

> **Kaynak:** Bu belge sadeleştirme kapsamında oluşturulmuştur (2026-04-17, ADR-008).
>
> **Bağlı belgeler:** `docs/superpowers/specs/2026-04-17-simplification-design.md` §2.3, `docs/decisions/ADR-008-remove-clerk-auth.md`, `docs/decisions/ADR-010-remove-database.md`.

INDOLES web platformunun veri işleme yaklaşımı ve KVKK (Kişisel Verilerin Korunması Kanunu) / GDPR uyum prensipleri bu belgede tanımlanır. Launch mimarisi DB-less olduğundan (ADR-010) veri minimizasyonu tasarım gereği sağlanır.

---

## 1. Toplanan Veriler

| Veri | Nerede Tutulur | Süre |
|------|---------------|------|
| Ziyaretçi formu (ad, e-posta, telefon, şirket, mesaj) | Resend mail arşivi | Mail saklama politikasına göre |
| Popup Stage 3 (ad, e-posta, persona, sorunlar) | Yalnız Resend mail arşivi | Resend politikası — kişisel veri analitiğe gitmiyor (ADR-021) |
| Analitik olaylar (sayfa görüntüleme, tıklamalar, funnel) | Google Analytics 4 | GA4 saklama ayarı: 14 ay (Google Ireland Ltd.) |
| Rezervasyon verisi | Cal.com Cloud | Cal.com veri işleme politikasına göre |

Kalıcı PostgreSQL DB yok (ADR-010). Kullanıcı hesabı, session, rol bilgisi tutulmaz.

---

## 2. Veri Saklama ve Silme

### 2.1 Resend mail arşivi

- Kişisel veri içeren mailler (contact form, popup submit) Resend'de saklanır.
- **Silme talebi:** Resend API ile ilgili mail silinir.
- Resend'in veri merkezleri AB bölgesindedir (GDPR uyumlu).

### 2.2 Analitikte kişi kaydı

- `persona`, `industry`, `role`, `company_name`, `first_seen_locale`, `utm_*`, `popup_completed_at`, `selected_problems` gibi özellikler person kaydında tutulur.
- **Silme talebi:** Analitikte kişiye bağlı kayıt tutulmuyor (ADR-021 ile sunucu tarafı `identify()` kaldırıldı); GA4 olayları kişi kimliği taşımaz. Silme talebi mail arşivinde karşılanır.
- GA4 veri sorumlusu Google Ireland Ltd.; AB standart sözleşme maddeleri geçerli. IP anonimleştirme GA4'te varsayılan.

### 2.3 Cal.com

Cal.com rezervasyon verisi doğrudan Cal.com Cloud'da saklanır. Silme talebi Cal.com'un GDPR sürecine yönlendirilir.

---

## 3. Cookie Banner

> **Durum (2026-08-24): uygulandı.** Teknik mimari `docs/12` §9'da; burada
> yalnız hukuki karar duruyor.

- GA4 analitik cookie'leri **EEA + Birleşik Krallık** ziyaretçileri için
  opt-in. Bu bölgelerde onay verilene kadar `analytics_storage` reddedilir
  (Google Consent Mode v2, bölgesel varsayılan).
- Diğer bölgelerde — Türkiye dahil — analitik varsayılan olarak açıktır.
  Gerekçe: KVKK'nın çerez rehberi bağlayıcı bir yaptırım kararına dönüşmüş
  değil ve Türkiye birincil pazar; ölçüm kaybı organik büyüme kararlarını
  körleştiriyor. Bu bilinçli bir risk kabulüdür ve KVKK tarafında bağlayıcı
  bir karar çıkarsa yeniden değerlendirilir.
- **Reklam çerezi hiç kullanılmıyor.** `ad_storage`, `ad_user_data` ve
  `ad_personalization` her bölgede reddedilir; onay da istenmez. Şerit
  metnindeki "reklam takibi yapmıyoruz" iddiası bu yüzden doğrulanabilir.
- Functional cookie'ler (persona merceği, giriş popup'ı durumu, bölge işareti,
  onay kaydı) zorunlu; önceden onay gerekmez.
- Onay 12 ay saklanır, sonra yeniden sorulur. **Ret de kaydedilir** — aksi
  hâlde "hayır" demek her sayfada yeniden sorulmak anlamına gelirdi.
- Şerit TR ve EN; kabul ve ret **eşit ağırlıkta iki gerçek buton** (EDPB
  rehberi: reddetmek kabul etmek kadar kolay olmalı).

---

## 4. Veri Silme Prosedürü (KVKK/GDPR Talebi)

Bir ziyaretçi "kişisel verilerimi silin" talebi ilettiğinde:

1. **E-posta talebi** → `burak@indoles.com.tr` veya iletişim formu.
2. **Kimlik doğrulama** — Talep sahibinin formu dolduran kişi olduğunu doğrula (e-posta + şirket eşleşmesi).
3. **Resend silme** — Talep sahibine ait mail(ler)i Resend dashboard'dan veya API ile sil.
4. **Analitik silme** — Gerekmiyor: GA4'te kişiye bağlanabilir kayıt tutulmuyor (ADR-021).
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
| 2 | Cookie banner vendor seçimi? | `@consent-manager` veya Google Consent Mode v2 | Launch öncesi |
| 3 | Resend data retention policy nedir? | Resend dokümantasyonunu kontrol et | Launch öncesi |
