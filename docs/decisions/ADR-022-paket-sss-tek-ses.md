# ADR-022 — Paket SSS'leri persona-aware olmaktan çıkar

- **Durum:** Kabul edildi
- **Tarih:** 2026-08-24
- **Karar veren:** Burak Arda Özgül
- **Bağlam:** Bağımsız SEO/GEO denetimi (2026-08-24) sonrası Dalga 0 · Karar 1
- **İlgili:** ADR-014 (full persona adaptivity), ADR-018 (hizmet sayfaları), `docs/03-brand-voice-tone.md` §1
- **Etkilenen dosyalar:** `docs/03-brand-voice-tone.md`, `src/lib/content/types.ts`, `src/lib/content/packages.ts`, `src/app/(marketing)/[locale]/paketler/[slug]/page.tsx`

---

## Bağlam

ADR-014 siteyi baştan sona persona-aware yaptı; `docs/03` §1 tablosu paket
detay sayfasını "persona-aware, çift versiyon" olarak sabitledi. Gerekçe
doğruydu: satın alma psikolojisi sanayici ve ticaret alıcısında gerçekten
ayrışıyor.

Persona-aware metin `PersonaText` ile taşınıyor ve **iki varyantı da DOM'a
basıyor**; görüneni CSS seçiyor (`globals.css` → persona merceği). Bu mimari
hidrasyon uyuşmazlığını ve FOIC'i çözmek için bilinçle seçildi ve sayfaların
SSG kalmasını sağlıyor.

2026-08-24 denetimi bu mimarinin paket sayfalarındaki üç sonucunu ölçtü:

| Ölçüm | Değer |
|---|---|
| Persona-aware TR metin (site geneli) | industrial 3.294 · commerce 3.065 kelime |
| Bunun paket detaylarındaki payı | **%91** |
| Paket sayfasındaki persona-aware metnin SSS payı | **%70** (paket başına ~510 kelime) |
| Paket SSS metin sayısı | 44 soru × 2 persona × 2 dil = **176** |
| Persona çiftinin birebir aynı olduğu soru | **0 / 88** |

Üç sonuç:

1. **Şema ile görünen metin uyuşmuyor.** `paketler/[slug]/page.tsx` `FAQPage`
   şemasına yalnız `industrial` cevabını basıyor (bilinçli: iki varyantı
   birleştirmek kendini tekrar eden bir pasaj üretiyordu). Ticaret merceğindeki
   ziyaretçi ekranda A cevabını okuyor, Google'a B cevabı gidiyor. Google'ın
   FAQ kuralı şemanın **görünen metinle eşleşmesini** şart koşuyor.
2. **Google commerce kopyasını hiç görmüyor.** Googlebot'ta çerez yok, yani
   `data-persona` yazılmıyor ve commerce varyantı `display:none` kalıyor.
   Ticaret alıcısı — stratejinin iki birincil SEO persona'sından biri — için
   yazılmış kopya indekslenmiyor.
3. **AI crawler'ları iki varyantı da okuyor.** GPTBot, ClaudeBot ve
   PerplexityBot CSS çalıştırmıyor; her soruya yan yana iki farklı cevap
   görüyorlar. GEO stratejisi (docs/strateji §5) bu motorlarda alıntılanmayı
   ana kaldıraç sayıyor.

## Değerlendirilen seçenekler

### A) Dokunma
- Sıfır iş.
- Üç sonuç da sürer; şema/görünen uyuşmazlığı bir Search Console uyarısına
  dönebilir.

### B) Paket detayını tamamen tek sese indir
- Sorun kökten biter, bakım yükü yarılanır.
- ADR-014'ün ürün kararını geri alır. `outcome`, `whoFor` ve `scope` gerçekten
  ayrışan alanlar — "bu paket kime uygun" sorusunun cevabı iki alıcı için
  farklı ve bu fark satış değeri taşıyor.

### C) Yalnız SSS'i tek sese indir
- Somut kusur (şema uyuşmazlığı) SSS'te; çift metnin %70'i de SSS'te.
- Persona adaptivitesi en çok anlam taşıdığı yerde korunur.
- 44 sorunun 88 cevabı yeniden yazılacak — hiçbir persona çifti birebir aynı
  değil, yani mekanik birleştirme yok.

### D) Commerce metnini JSON'a alıp senkron script'le değiştir
- Her şey korunur, DOM tek varyant kalır.
- Yeni ve kırılgan bir mekanizma; `docs/04`'ün "gerekçesiz kurnazlık yok"
  ilkesine aykırı. Ölçülmemiş bir kazanç için mimari karmaşıklık.

## Karar

**C seçildi: yalnız `PackageContent.faq[].answer` persona-aware olmaktan
çıkar.** `outcome`, `summary`, `scope`, `deliverables` ve `whoFor`
persona-aware kalır.

## Gerekçe

1. **Düzeltilen şey bir kusur, geri alınan bir karar değil.** Şema ile görünen
   metnin ayrışması ADR-014'ün öngörmediği bir yan etki; SSS'i tek sese
   indirmek o yan etkiyi ortadan kaldırır, persona kararını değil.
2. **Kazanç/maliyet oranı burada en yüksek.** Paket sayfasındaki çift metnin
   %70'i SSS; anlatı alanları paket başına ~210 kelime ve gerçekten ayrışıyor.
3. **SSS zaten yarı tekildi.** Şema tek varyant basıyordu; karar bunu dürüst
   hâle getiriyor — sayfa artık şemanın söylediğini gösteriyor.
4. **B reddedildi** çünkü `whoFor` ve `outcome` ayrımı satış değeri taşıyor;
   **D reddedildi** çünkü ölçülmemiş bir kazanç için yeni bir mekanizma
   getiriyor.

## Sonuçlar

### Pozitif
- `FAQPage` şeması sayfada görünen metnin aynısını taşır.
- Paket SSS'leri Google'a ve AI motorlarına tek, tutarlı cevap olarak gider.
- Bakım yükü: 176 metin → 88.
- Kalan persona-aware yüzeyler daha küçük ve daha savunulabilir.

### Negatif / trade-off
- Ticaret merceğindeki ziyaretçi SSS'te kendi diline özel bir ton görmez.
  Karşılığı: cevaplar orta tonda ve **iki tarafın maddi bilgisini de** taşır —
  kitleye özgü bir kalem varsa cümle içinde açıkça adlandırılır.
- 88 cevabın yeniden yazımı gerçek editoryal iştir; mekanik dönüştürme yok.

### Yeniden değerlendirme tetikleyicileri
- Search Console `FAQPage` uyarısı üretirse (şema/görünen ayrımı geri gelirse).
- Paket sayfalarının dönüşüm oranı persona kırılımında anlamlı biçimde
  düşerse (`package_viewed` → `booking_cta_clicked`, ADR-021 ölçüm katmanı).
- Persona merceği DOM çift-render'ından vazgeçilirse (ör. sunucu tarafı
  seçim), bu ADR'nin gerekçesi ortadan kalkar.

## Implementasyon notları

- `PackageContent.faq[].answer`: `PersonaText` → `Localized<string>`.
- `paketler/[slug]/page.tsx`: `faqLd` artık `f.answer[loc]` okur; render
  `PersonaText` sarmalayıcısını bırakır.
- Kalite kuralları gevşemez: cevap anafora ile başlamaz ve ≥40 kelimedir, her
  dilde ayrı (`services-content.test.ts:198-225` deseni).
- Migration tek yönlü; geri dönüş için git geçmişi yeterli.

## Referanslar

- `docs/03-brand-voice-tone.md` §1 — içerik versiyonu kararı tablosu
- `docs/08-seo-i18n-strategy.md` §8.6 — FAQPage
- ADR-014 — full persona adaptivity
- ADR-018 — hizmet sayfalarının "orta ton, tek versiyon" kararı (aynı gerekçe)
- `docs/strateji/INDOLES-Organik-Strateji-SEO-GEO-v1.md` §5 — GEO kaldıracı
