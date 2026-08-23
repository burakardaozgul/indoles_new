# ADR-020 — Blog Migrasyonu: Blok Modeli, Güncelleme Etiketi ve GEO Yapısı

> **Durum:** Kabul edildi
> **Tarih:** 2026-08-22
> **Karar sahibi:** Burak Arda Özgül
> **Bağlı belgeler:** `docs/03-brand-voice-tone.md` (§Journal), `docs/08-seo-i18n-strategy.md`
> **İlişkili kararlar:** ADR-006 (Sanity kaldırıldı, statik içerik), ADR-019 (vaka migrasyonu)

---

## Bağlam

Eski WordPress blogunda 16 yazı var (2024-07 – 2026-01, ~19.700 kelime) ve
Burak eski yazıların anlatım tonunu korumak istiyor. Journal'ın mevcut
gövdesi düz paragraf dizisiydi (`Localized<string[]>`): başlık hiyerarşisi,
liste, alıntı, içindekiler ve soru-cevap taşıyamıyordu. Ayrıca yazı
sayfasında metadata ve Article JSON-LD yoktu.

## Kararlar

### 1. Tipli blok modeli (MDX değil)

`ArticleBlock` union'ı: `p · h2(id) · h3 · list · quote`. MDX reddedildi:
yeni bağımlılık (pipeline + parse), çeviri paritesi denetlenemez, TOC ve
JSON-LD türetmek için ikinci bir parse katmanı gerekirdi. Tipli bloklarda
TR/EN pariteleri typecheck'te yakalanır; içindekiler h2 bloklarından,
FAQPage şeması `faq` alanından türetilir.

### 2. Güncelleme etiketi

Eski tarihli bilgi güncellenmeden yeniden yayımlanmaz. Güncellenen yazı üç
sinyal taşır: meta şeritte "Güncellendi: <tarih>" rozeti, gövde başında
güncelleme notu kutusu (ne değişti, ne eklendi), JSON-LD `dateModified`.
Trend/yıl bağımlı içerik migrasyonda 2026-27 perspektifiyle yeniden ele
alınır ve bu ek bölüm olarak işaretlenir ("2026 güncellemesi: ..." h2'si).

### 3. Ton: eski blogun sesi korunur

docs/03 Journal'ı "orta-editorial, yazarın sesi ön planda" tanımlar. Eski
blogun samimi, hikâye anlatıcı, yer yer esprili sesi Burak'ın açık tercihidir
ve migrasyonda korunur; zenginleştirme yapıyı (başlık hiyerarşisi, kendine
yeten pasajlar, SSS) ekler, sesi törpülemez.

### 4. GEO yapısı

Her taşınan yazıda: h2 çapalı içindekiler (3+ başlıkta basılır), soru-cevap
bloğu (sayfada açık `dl` — `details/summary` değil; kapalı içerik AI
motorları ve ekran okuyucular tarafından atlanabiliyor), FAQPage + Article +
BreadcrumbList JSON-LD, kendine yeten alıntılanabilir pasajlar.

### 5. SEO tesisatı

Yazı sayfasına `generateMetadata` eklendi (canonical + hreflang;
`/tr/yazilar/[slug]` ↔ `/en/articles/[slug]`, slug locale başına ayrı).
Sitemap tüm yazıları iki dilde listeler. Eski kök URL'lerden 308 redirect
yazı taşındıkça eklenir; TR slug mümkünse eski URL ile aynı tutulur.

## Sonuçlar

- İlk taşınan yazı: "Gerilla pazarlama dijital çağda nasıl evriliyor?"
  (2024-07-27 → 2026-08-22 güncellemesi: AI çağı bölümü + 4 soruluk SSS).
- Launch'taki 3 kısa yazı blok modeline çevrildi; `body` alanı kaldırıldı.
- Kalan 15 eski yazı aynı şablonla teker teker taşınacak.
