# ADR-019 — Gerçek Vaka Çalışmaları Migrasyonu ve Vaka Medya Katmanı

> **Durum:** Kabul edildi
> **Tarih:** 2026-08-20
> **Karar sahibi:** Burak Arda Özgül
> **Bağlı belgeler:** `docs/02-information-architecture.md`, `docs/03-brand-voice-tone.md`, `docs/04-design-system-principles.md` (§10 içerik dürüstlüğü, §12.10 iç sayfa dili), `docs/08-seo-i18n-strategy.md`
> **İlişkili kararlar:** ADR-017 (site geneli v2), ADR-018 (hizmet detay sayfaları)
> **Revize edildi (2026-08-29):** Karar 6'daki "slug locale'den bağımsız" kısmı
> geçerli değil — vaka slug'ları locale-bazlı yapıldı. Belge sonundaki
> "Revizyon — 2026-08-29" bölümüne bakın.

---

## Bağlam

Launch içeriğindeki 4 vaka anonimdi ("Sanayi Şirketi A", "D2C Markası B") ve
bir kısmı gerçek projelerin genelleştirilmiş haliydi. Eski WordPress sitesinde
(`indoles_eski/`) ise 9 gerçek, isimli portfolyo vakası yayında ve link equity
taşıyor. Vaka detay sayfasında görsel alanı hiç yoktu — eski vakaların fotoğraf,
tasarım ve video varlıkları taşınamıyordu.

## Kararlar

### 1. Anonim vakalar silindi, gerçek isimler kullanılır

Burak'ın 2026-08-20 kararı: 4 anonim vaka `cases.ts`'ten silindi. Eski
sitedeki 9 vakadan 7'si gerçek müşteri adıyla taşınır: SOYLU AVM, GYMWOLVES,
MKComputer, İstanbul Ortez Protez, FYR, Feruza Elegance, SIM Baskı Malzemeleri.
Turkcell-BIP ve CaffeBO (saf prodüksiyon işleri) yeni siteye **taşınmaz** —
problem-tipi bazlı vaka yapısına oturmuyorlar.

Gerçek isim SEO ve güven için anonim etiketten güçlüdür; rakamların sahibi
belli olur ve marka aramalarında sayfa yakalanır.

### 2. Anlatıdan yapılandırılmış şemaya dönüştürme

Eski anlatısal içerik yeni şemaya (problem → yaklaşım → sonuç madde listeleri)
dönüştürülür, birebir kopyalanmaz. Metinler `docs/03` ton kurallarına göre
yeniden yazılır (vaka doğal alıcısının tonunda; SOYLU AVM = ticaret tonu).

### 3. Metrik bağlamlandırma zorunlu

`metrics[].context` alanı eklendi: her metrik ölçüm çerçevesini söyler
(dönem, baz, yöntem — "İlk 30 gün, reklam harcaması bazında"). Gerekçe:
"1:1000 ROI" gibi iddialı gerçek rakamlar bağlamsız basıldığında E-E-A-T
sinyali düşer; docs/04 §10 içerik dürüstlüğü kuralının metrik karşılığıdır.
Doğrulanamayan alanlar (`durationWeeks` gibi) `TODO(burak)` ile işaretlenir
ve Burak'tan gelen veriyle güncellenir.

### 4. Vaka medya katmanı

`CaseStudyContent` genişletildi: `year`, `clientLogo`, `services`,
`approachFlow`, `heroMedia`, `media[]` (tip `CaseMedia`: image | video,
zorunlu `width/height`, lokalize `alt` + `caption`).

- Dosyalar `public/work/<slug>/` altında yaşar; remote görsel kalmadı
  (Unsplash remote pattern `next.config.ts`'ten kaldırıldı).
- Galeri altyazıları `FIG.0N` figür numarası taşır — teknik-editorial dilin
  "ölçü görünür" kuralı.
- Video `controls` ile basılır, otomatik oynatma yok.
- Alt metinler görsele bakılarak yazılır; doğrulanmamış betimleme yazılmaz
  (docs/04 §12.8).

### 5. Ölçüm bandı — tek koyu iç sayfa bölümü

Vaka detayında metrikler `teal-950` zeminli, sayaç animasyonlu bir bantta
sunulur (`CaseMetricBand`). docs/04 §12.10 "krem tuval tektir; zemin
gerekçesi kontrast olmalı" kuralının bilinçli istisnasıdır: vakanın kanıtı
sayfanın tek vurgu anıdır ve Vizyon bölümüyle aynı malzemeyi kullanır
(teal-950 + gold eyebrow + sayaç). Sayaç `prefers-reduced-motion`'da hedefe
atlar.

### 6. SEO: metadata + redirect + JSON-LD

- Vaka detayına `generateMetadata` eklendi (`buildMetadata`; canonical +
  hreflang, `/tr/vakalar/[slug]` ↔ `/en/case-studies/[slug]`).
- `BreadcrumbList` + `Organization` JSON-LD basılır.
- Eski portfolyo URL'lerinden 308 redirect: vaka taşındıkça
  `next.config.ts`'e satır eklenir. Taşınmayan portfolyo sayfaları 404'te
  bırakılır (konu dışı redirect soft-404 sayılır).

### 7. Kapak, logo ve kart

`cover` alanı galeriden ayrıdır: kartlarda (benzer vakalar, `/vakalar`,
anasayfa) 4:3 kırpılan kapak görseli kullanılır, aynı görsel galeriye
girmez. Kart tek kaynaktır (`case-card.tsx`) ve üç şey taşır: kapak üzerinde
beyaz rozetli **müşteri logosu**, sol altta **ilk metrik rozeti**, altında
problem tipi + pillar + başlık. Detay sayfasında logo künyenin ilk öğesidir
ve 56/64px yüksekliğe çıkar — müşteri markası vakanın kanıtıdır, dipnotu
değil.

### 8. Metriksiz vaka ve süre birimi

Ölçüm bandı yalnız `metrics.length > 0` olduğunda basılır. Sayısal metriği
olmayan vakada (Feruza) boş band "ölçmedik" demenin en gürültülü yolu
olurdu; sonuç anlatısı bölümü bu işi taşır.

Künyede süre 16 haftadan (~4 ay) uzun işlerde ay cinsinden yazılır: "65
hafta" okunmuyor, "15 ay" okunuyor.

### 9. YouTube gömme — facade

Reklam filmi taşıyan vakalarda (OdorGo) video YouTube'da kalır, indirilip
servis edilmez. Gömme **facade** ile yapılır: kapak karesi lokal bir
görseldir (`poster`), iframe yalnız kullanıcı oynat düğmesine bastığında
`youtube-nocookie.com` üzerinden mount edilir.

İki gerekçe: izlenmeyen bir video için üçüncü taraf çerezi düşmemeli
(docs/14 KVKK), ve dört iframe'i açılışta yüklemek sayfayı megabaytlarca
script'e bağlar. Ölçüm: sayfa açılışında 0 iframe, tıklamadan sonra 1.

## Sonuçlar

- **7 vakanın tamamı taşındı** (2026-08-21): SOYLU AVM, GYMWOLVES,
  MKComputer, İstanbul Ortez Protez, FYR Luxury, Feruza Elegance, SIM Baskı
  Malzemeleri. Turkcell-BIP ve CaffeBO taşınmadı (karar 1).
- Eski portfolyodan 7 kalıcı yönlendirme tanımlı; sitemap 14 vaka URL'sini
  (7 vaka × 2 dil) listeler.
- SIM vakası eski AI-içerik çalışmasının değil, 2026'daki Next.js yeniden
  platform projesinin üzerine kuruldu — 5 dilli webapp, 15× organik trafik,
  sıfırdan 40.000 GEO görünürlüğü. INDOLES'in GEO iddiasının en güçlü kanıtı
  bu vakadır.
- Anasayfa Featured Work'te yalnız sayısal metriği olan vakalar görünür
  (kart metrik rozeti taşıdığı için); Feruza `/vakalar` listesinde yer alır.
- Açık iş: `messages/{tr,en}.json` persona akış metinleri hâlâ eski anonim
  vaka özetlerine atıf yapıyor — gerçek vakalarla güncellenecek.
- Açık iş: MKComputer ve Feruza süreleri `TODO(burak)` ile geçici.
- **Meccanotecnica Umbra Türkiye** (2026-08-21) eski portfolyoda olmayan
  yeni bir vakadır; migrasyonun değil, aynı şablonun ürünüdür. Redirect
  gerekmez. Şablona kattığı tek yeni parça `advise` glyph'idir (sohbet
  balonu + kıvılcım — AI danışman adımı).
- **OdorGo** (2026-08-21) migrasyonun değil, aynı şablonun ürünü: sıfırdan
  kategori yaratma vakası. Şablona iki parça kattı — `film` glyph'i ve
  YouTube facade (karar 9).
- Toplam 9 vaka: Growth 6, Build 3. `/vakalar` listesi ve anasayfa kartları
  aynı `case-card.tsx` kaynağından beslenir.

---

## Revizyon — 2026-08-29: Vaka slug'ları locale-bazlı yapıldı

> **Durum:** Kabul edildi · **Karar sahibi:** Burak Arda Özgül
> **Revize edilen:** Karar 6 (SEO: metadata + redirect + JSON-LD) — slug'ın
> locale'den bağımsız tek değer olması
> **Tetikleyen:** `docs/18-seo-geo-puanlama-2026-08-24.md` §9 "Tek gerçek eksik"

### Ne değişti

`CaseStudyContent.slug` `string` iken `Localized<string>` oldu. TR slug'ların
**hiçbiri değişmedi**; 9 vakaya EN karşılık eklendi:

| TR (değişmedi) | EN (yeni) |
|---|---|
| `soylu-avm-e-ticaret-buyume` | `soylu-avm-ecommerce-growth` |
| `gymwolves-12-kat-satis` | `gymwolves-12x-sales-growth` |
| `mkcomputer-dropshipping-otomasyonu` | `mkcomputer-dropshipping-automation` |
| `istanbul-ortez-protez-arama-gorunurlugu` | `istanbul-orthosis-prosthetics-search-visibility` |
| `fyr-luks-dekorasyon-lansmani` | `fyr-luxury-decor-launch` |
| `feruza-luks-perakende-anlasmasi` | `feruza-luxury-retail-deal` |
| `sim-baski-ihracat-icerigi` | `sim-printing-export-content` |
| `meccanotecnica-umbra-teklif-portali` | `meccanotecnica-umbra-quote-portal` |
| `odorgo-kategori-yaratma` | `odorgo-category-creation` |

### Gerekçe

1. **EN SERP güveni ve CTR.** URL, sonuç satırında başlığın üstünde okunur ve
   tıklama kararına girer. `/en/case-studies/sim-baski-ihracat-icerigi` EN
   okur için anlamsız bir karakter dizisiydi; arama motoru da URL'deki
   kelimelerden konu sinyali alamıyordu. Yazılar ve hizmetler zaten lokalize
   slug taşıyordu (ADR-020, ADR-018) — vakalar tek istisnaydı, yani kusur
   tutarsızlıktı, tercih değil.
2. **EN ölçüm netliği.** EN kanıt sayfalarının arama performansı GSC'de
   Türkçe URL'ler altında toplanıyordu; EN kümesinin kendi başına okunması
   zorlaşıyordu.
3. **301 maliyeti launch+1'de sıfıra yakın.** Site 2026-08-28'de canlıya
   çıktı. Eski 9 EN URL henüz yaş, backlink veya sıralama biriktirmemişti;
   aynı değişim üç ay sonra çok daha pahalı olurdu. ADR-019'un orijinal
   kararı bu pencereyi hesaba katmıyordu.

### Korumalar

- **Eski 9 EN URL 301 (Next `permanent: true` → 308) ile taşınır**
  (`next.config.ts`): `/en/case-studies/<tr-slug>` → `/en/case-studies/<en-slug>`.
  URL'ler launch günü GSC ve IndexNow'a bildirildiği için yönlendirme şart.
  Eski WordPress `/portfolyo/*` kuralları TR hedefli — dokunulmadı.
- **Çapraz locale çözülmez** (ADR-018 disiplini): `/tr/vakalar/<en-slug>` ve
  `/en/case-studies/<tr-slug>` (301 öncesi) 404 döner. İki URL'in aynı içeriği
  sunması canonical sinyalini böler.
- **Analitik kimliği TR slug kalır** (`view-events.ts`): EN sayfa aynı vakanın
  ikinci satırını açmaz. Hizmet ve paket olaylarındaki kuralın aynısı.
- **Kanonik iç bağlantı konvansiyonu korundu:** `articles.ts` gövdelerindeki
  `/vakalar/<tr-slug>` linkleri değişmedi; `resolveInlineHref` EN'de gerçek EN
  slug'a çözer (hizmet ve yazı dallarıyla aynı desen).
- **Regresyon ağı:** `cases-content.test.ts` EN slug'ın Türkçe harf
  taşımadığını, TR'den farklı olduğunu ve iki havuzun kesişmediğini doğrular.

### Yan düzeltme — iç bağlantılarda 307 atlaması kaldırıldı

Slug denetimi sırasında ayrı bir kusur görüldü: vaka linkleri ham
`/${locale}/vakalar/${slug}` olarak basılıyordu. TR'de doğru, EN'de değil —
next-intl middleware `/en/vakalar/...` adresini `/en/case-studies/...`e 307 ile
çeviriyordu, yani **her iç EN vaka bağlantısı bir yönlendirme atlaması**
yiyordu. 8 bağlantı (5 detay + 3 liste) `localeHref` kanonik yardımcısına
geçirildi (`article-card.tsx` deseni). Kural `tests/unit/case-links.test.tsx`
ile kilitlendi.
