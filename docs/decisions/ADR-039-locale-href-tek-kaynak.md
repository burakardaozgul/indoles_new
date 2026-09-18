# ADR-039 — Locale segment sözlüğü tek kaynakta, karışık locale URL'leri 308

- **Statü:** Kabul edildi
- **Tarih:** 2026-09-18
- **Karar veren:** Burak Arda Özgül
- **Bağlam:** GSC'de `/en/` altında TR segmentli URL'lerin gösterim alması (indeks denetimi 2026-09-18)
- **İlgili:** ADR-018 (çapraz locale slug çözümü yok) · ADR-019 · ADR-020 (lokalize slug'lar)
- **Etkilenen:** `src/lib/i18n/segments.ts` (yeni), `src/lib/i18n/routing.ts`, `src/lib/i18n/locale-href.ts`, `src/lib/seo/legacy-redirects.ts`, `next.config.ts`, 20 sayfa/bileşen, `docs/08-seo-i18n-strategy.md`

## Bağlam

Google Search Console dört karışık locale adresini gösterimde tutuyordu:

| URL                                                    | Durum (18 Eyl)                      |
| ------------------------------------------------------ | ----------------------------------- |
| `/en/danismanlar/mert-kaplan`                          | 307 → `/en/consultants/mert-kaplan` |
| `/en/hizmetler/build`                                  | 5 gösterim, ortalama pozisyon 12,4  |
| `/en/yazilar/why-professional-video-is-non-negotiable` | gösterimde                          |
| `/en/case-studies/gymwolves-12-kat-satis`              | gösterimde (EN segment + TR slug)   |

İki ayrı sorun tek belirtide birleşmişti.

**Birincisi, linkler.** Segment sözlüğü (`hizmetler↔services`, `vakalar↔case-studies`,
`yazilar↔articles`, `danismanlar↔consultants`, `araclar↔tools`, `paketler↔packages`)
kodda en az yedi yerde ayrı ayrı yazılıydı: `routing.ts` pathnames tablosu,
`locale-href.ts`, `service-detail.tsx` kök haritası, `llms.ts` ve
`llms-full.txt` kökleri, `sitemap.ts` yolları ve sayfa dosyalarındaki
`loc === "tr" ? "hizmetler" : "services"` üçlüleri. Bu kadar kopya varken bazı
yerlerde çeviri hiç yapılmamıştı — locale değişkeni TR segmentin önüne
yapıştırılıyordu:

| Dosya:satır (değişiklikten önce)                               | Ürettiği EN href                      |
| -------------------------------------------------------------- | ------------------------------------- |
| `src/app/(marketing)/[locale]/hizmetler/page.tsx:151`          | `/en/hizmetler/<pillar>`              |
| `src/components/marketing/pillars-section.tsx:83`              | `/en/hizmetler/<pillar>`              |
| `src/app/(marketing)/[locale]/danismanlar/page.tsx:111`        | `/en/danismanlar/<slug>`              |
| `src/app/(marketing)/[locale]/hakkimizda/page.tsx:252`         | `/en/danismanlar/<slug>`              |
| `src/app/(marketing)/[locale]/danismanlar/[slug]/page.tsx:251` | `/en/yazilar/<slug>`                  |
| `src/app/(marketing)/[locale]/paketler/page.tsx:175, 308`      | `/en/paketler/<slug>`                 |
| `src/components/marketing/pillar-detail.tsx:258, 272`          | `/en/paketler`, `/en/paketler/<slug>` |

`/en/case-studies/gymwolves-12-kat-satis` bu kümede değil: 2026-08-29 EN vaka
slug lokalizasyonundan kalma bir adres ve `EN_CASE_SLUG_REDIRECTS` onu zaten
taşıyordu.

**İkincisi, yönlendirmenin kalıcı olmaması.** next-intl middleware'i TR segmenti
EN yola çeviriyordu ama **307** ile. 307 geçicidir: Google eski adresi indekste
tutar, yeni adrese sinyal aktarmaz, canonical bölünür. Nitekim denetimde
`/en/hizmetler/build` "hâlâ listede" görünüyordu.

Karar verilmezse: her yanlış href bir atlama kaybeder, GSC'de dört ayrı karışık
adres gösterim almaya devam eder ve sözlüğün yedi kopyası bir sonraki içerik
türünde sekizinci kopyayı üretir.

## Değerlendirilen seçenekler

### A) Sadece hatalı href'leri düzelt

- Artı: en küçük değişiklik, risk yok.
- Eksi: sözlüğün yedi kopyası duruyor; aynı hata sekizinci yerde tekrar doğar.
- Eksi: indekste duran adresler 307 ile kalır.

### B) Sözlüğü tek kaynağa al + 308 yönlendirme (seçilen)

- Artı: kopya kalmaz; yeni bir içerik türü tek yere eklenir.
- Artı: `routing.ts` de sözlüğün türevi olur, ikisi sapamaz.
- Artı: birim test her içerik kaydını sözlüğe karşı denetleyebilir.
- Eksi: 20 dosyada çağrı yeri değişir; kaynak-tarayan bir regresyon testi
  (`page-metadata.test.ts`) güncellenmek zorunda.

### C) next-intl middleware'ini 308'e zorla

- Artı: tek satırlık ayar gibi görünüyor.
- Eksi: next-intl locale yönlendirmesini 307 yapar ve bu ayarlanabilir değil;
  ayrıca middleware her istekte çalışır, config yönlendirmesi kenar
  düğümünde ondan önce biter.
- Eksi: href'lerdeki asıl hatayı hiç çözmez.

## Karar

**B seçildi.** Segment sözlüğü `src/lib/i18n/segments.ts`e alındı; tüm iç link
üretimi `localizedHref(locale, kind, ...segments)` ve `segmentRoot(locale, kind)`
üzerinden geçiyor. `/en/<tr-segment>/*` adresleri `EN_SEGMENT_REDIRECTS` ile
**308** dönüyor.

`segments.ts` **import içermez**: `next.config.ts` onu `legacy-redirects.ts`
üzerinden config yükleme bağlamında çözüyor ve o bağlamda `@/` alias'ı yok.

## Gerekçe

1. **Sözlük türev üretir, kopya üretmez.** `routing.ts` pathnames tablosu artık
   `LOCALE_SEGMENTS`ten kuruluyor; `locale-href.ts` de aynı kaynağı okuyor.
   Bir segment adı değişirse üç yüzey (next-intl route'ları, dil değiştirici,
   href üretimi) birlikte değişir.
2. **308 Google'a imzadır.** 307 eski adresi indekste tutuyordu; kalıcı
   yönlendirme sinyali hedefe aktarır. Config yönlendirmesi middleware'den
   önce çalıştığı için next-intl'in 307'sine hiç sıra gelmiyor.
3. **ADR-018 korunuyor.** Slug çevrilmiyor: `/en/hizmetler/e-ticaret` bir
   atlamayla `/en/services/e-ticaret`e gider ve orada 404 olur. Çapraz locale
   slug çözümü iki URL'in aynı içeriği sunması demekti; o karar değişmedi.
4. **A reddedildi** çünkü belirtiyi silip nedeni bırakıyordu; **C** hem teknik
   olarak yapılamıyor hem de href hatasına dokunmuyordu.

## Sonuçlar

### Pozitif

- Render edilen 74 EN sayfanın hiçbirinde TR segmentli href yok (doğrulandı);
  74 TR sayfada da EN segmentli href yok.
- Dört GSC adresinin dördü de 308 ile doğru EN adrese iniyor.
- `tests/unit/locale-href-segments.test.ts` her `SERVICES`, `PILLARS`,
  `PACKAGES`, `CASES`, `ARTICLES`, yayınlanmış `TOOLS` ve
  `BOOKABLE_CONSULTANTS` kaydı için TR/EN yolunu ve hreflang üçlüsünü
  denetliyor (206 assertion).
- `sitemap.ts`, `llms.txt`, `llms-full.txt` ve JSON-LD `url` alanları da aynı
  kaynaktan geçiyor — sözlük değişirse hiçbiri sessizce eskimez.

### Negatif / trade-off

- **İki atlamalı kalıntı:** `/en/vakalar/<tr-slug>` önce
  `/en/case-studies/<tr-slug>` olur, oradan `EN_CASE_SLUG_REDIRECTS` ikinci bir
  308 ile EN slug'a taşır. Tekil çözüm için vaka kayıtlarının
  `legacy-redirects.ts`e import edilmesi gerekirdi; o dosya config bağlamında
  çözüldüğü için içerik katmanına bağlanamaz. GSC'de bu biçimde bir adres yok.
- **Araç slug'ları sözlükte değil.** `geo-gorunurluk-denetleyicisi ↔
geo-visibility-checker` bir segment değil, `routing.ts`teki tam-yol çiftidir.
  `EN_SEGMENT_REDIRECTS` bu ikisi için joker kuraldan önce iki açık satır
  taşıyor; yeni bir araç eklenirse o satır da eklenmelidir.
- **Araç sayfalarının `PATHS` sabitleri literal kaldı.**
  `page-metadata.test.ts` sayfa kaynaklarını regex'le tarayıp her sayfanın
  benzersiz bir canonical ilan ettiğini doğruluyor; araç sonuç/rapor
  sayfalarındaki yorumlar bu taramanın literal biçime bağlı olduğunu açıkça
  yazıyor. Test hem literal hem sözlük çağrısı biçimini tanıyacak şekilde
  genişletildi, araç sayfaları literalde bırakıldı.

### Yeniden değerlendirme tetikleyicileri

- Üçüncü bir dil eklenirse (`SegmentLocale` iki değerle sınırlı).
- next-intl `pathnames` API'si değişir ve sözlükten türetme mümkün olmazsa.
- GSC'de `/en/<tr-segment>` adresleri 90 gün sonra hâlâ gösterim alıyorsa —
  308 okunmamış demektir, o zaman GSC kaldırma aracı gündeme gelir.

## Implementasyon notları

- **Yeni:** `src/lib/i18n/segments.ts` — `LOCALE_SEGMENTS`, `localizedHref`,
  `segmentRoot`, `segmentKindOf`, `translateSegment`. Import yok, saf veri.
- **Türevler:** `routing.ts` pathnames tablosu, `locale-href.ts` çeviri sözlüğü.
- **Yönlendirme:** `legacy-redirects.ts` → `EN_SEGMENT_REDIRECTS`;
  `next.config.ts` üç listeyi bu sırayla açar: `LEGACY_REDIRECTS`,
  `EN_CASE_SLUG_REDIRECTS`, `EN_SEGMENT_REDIRECTS` (spesifik önce).
  `EN_SEGMENT_REDIRECTS` eski-URL sitemap'ine girmez — `legacySitemapPaths()`
  yalnız `LEGACY_REDIRECTS` okur.
- **Rollback:** `next.config.ts`ten `EN_SEGMENT_REDIRECTS` spread'ini çıkarmak
  yönlendirmeleri geri alır (href düzeltmeleri bağımsız çalışır).

## Referanslar

- `docs/08-seo-i18n-strategy.md` — hreflang ve canonical kuralları
- `docs/strateji/Indeks-Denetimi-2026-09-18.md` §2 — eski URL zincirleri
- ADR-018 — `/en` altında TR slug 404 döner
- `tests/unit/locale-href-segments.test.ts`, `tests/unit/page-metadata.test.ts`
