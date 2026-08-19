# 12 Hizmet Detay Sayfası — Tasarım Spec

> **Tarih:** 2026-08-19
> **Durum:** Onaylandı (Burak, 2026-08-19)
> **Karar sahibi:** Burak Arda Özgül
> **Bağlı belgeler:** `docs/02-information-architecture.md`, `docs/03-brand-voice-tone.md`, `docs/04-design-system-principles.md`, `docs/08-seo-i18n-strategy.md`, `docs/15-content-audit.md`, `docs/decisions/ADR-015-design-system-v2.md`, `docs/decisions/ADR-017-v2-site-wide-migration.md`

---

## 1. Amaç ve Scope

### 1.1 Problem

Anasayfadaki hizmet portföyü 12 uzmanlık gösteriyor (`ServicesScroll`), ama her kartın "Keşfet" bağlantısı hizmete değil **pillar sayfasına** gidiyor (`/hizmetler/growth`). Ziyaretçi "Performans pazarlama"ya tıklayıp beş hizmetin listelendiği bir disiplin sayfasına düşüyor; aradığı hizmetin tek cümlelik açıklamasını ikinci kez okuyor.

Bunun üç sonucu var:

1. **Dönüşüm.** Satın alma niyeti hizmet düzeyinde oluşuyor, pillar düzeyinde değil. Ziyaretçi niyetini ifade ettiği anda genelleştirilmiş bir sayfaya gönderiliyor.
2. **SEO.** "performans pazarlama ajansı", "iş zekası danışmanlığı" gibi ticari niyetli sorguların ineceği bir sayfa yok. 12 uzmanlık tek bir `/hizmetler/{pillar}` sayfasında yarışıyor.
3. **GEO.** AI motorları hizmet düzeyinde soru alıyor ("Türkiye'de ERP entegrasyonu danışmanlığı kim yapıyor"). Alıntılayacakları, o hizmete ayrılmış, kendine yeten bir pasaj yok.

### 1.2 Çözüm

12 hizmetin her biri için, sitenin v2 tasarım diline uygun, dokuz bloklu bir detay sayfası. Sayfalar tek bir içerik modelinden (`ServiceContent`) türer; SEO ve GEO katmanı yeniden kullanılabilir bir kütüphane (`src/lib/seo/`) olarak yazılır ve önce bu hizmet ailesine uygulanır.

### 1.3 Hedefler

- 12 hizmetin her biri için ticari niyetli sorgunun inebileceği, tek başına ayakta duran bir sayfa.
- Her sayfa AI motorları tarafından **alıntılanabilir**: kendine yeten cevaplar, açık varlık adları, geçerli `Service` + `FAQPage` JSON-LD.
- `/hizmetler` → pillar → hizmet zinciri ve 12 hizmetin birbirine bağlanmasıyla topikal küme oluşması.
- Yeniden kullanılabilir SEO altyapısı: paket, vaka, yazı sayfaları sonraki işte aynı kütüphaneyi kullanır.

### 1.4 Kapsam dışı

| Kapsam dışı | Sebep |
|---|---|
| Paket / vaka / yazı / danışman sayfalarına metadata uygulanması | Aynı `lib/seo` ile ayrı iş; bu işi 12 sayfadan uzaklaştırır |
| Dinamik OG görsel üretimi (`/api/og`) | docs/08 §7.2'de planlı, ayrı iş. Şimdilik statik OG |
| Hizmet düzeyinde performans metriği iddiası | Doğrulanabilir veri yok — §5.6'ya bakınız |
| Deploy / Vercel / prod yayını | Burak sinyali bekler; iş lokalde biter |
| Hizmet başına ayrı vaka çalışması yazımı | Mevcut `CASES` verisi pillar düzeyinde eşlenir |

---

## 2. Kararlar Özeti

| Karar | Seçim | Alternatif ve neden reddedildi |
|---|---|---|
| URL yapısı | Düz: `/tr/hizmetler/{slug}` | İç içe (`/hizmetler/growth/{slug}`) — hizmeti pillar'a kalıcı çiviler, pillar değişiminde 301 gerektirir |
| Slug | Locale başına ayrı (`Localized<string>`) | Tek TR slug — EN tarafında arama hacmi olan terimi kaybeder |
| Sayfa derinliği | Tam — 9 blok, ~700-900 kelime | Orta (6 blok) — uzun kuyruk ve AI alıntı yüzeyini daraltır |
| Persona kapsamı | **Yaklaşım A:** kanonik gövde + 2 hedefli persona slotu | Tam persona — indekslenebilir metni ikiye katlar, `FAQPage` şemasını geçersizleştirir (§6) |
| İçerik yerleşimi | Hizmet başına bir dosya, `content/services/` | `pillars.ts` içine gömme — dosya ~150KB'a çıkar |
| SEO kapsamı | Genel `lib/seo` + hizmet ailesine uygulama | Tüm site — 12 sayfanın teslimini geciktirir |
| Copy üretimi | Pilot → onay → kalan 11 | 12'si birden — ton yanlışsa 12 sayfa revize |
| Hizmet metriği | Olgusal taahhüt (süre/ekip/giriş paketi) | Performans metriği — uydurma iddia, GEO'da riskli |

---

## 3. Bilgi Mimarisi ve URL

### 3.1 Yapı

```
/tr/hizmetler                        → hizmet ekranı (mevcut)
/en/services

/tr/hizmetler/growth                 → pillar detay (mevcut)
/en/services/growth

/tr/hizmetler/performans-pazarlama   → hizmet detay (YENİ)
/en/services/performance-marketing
```

Pillar hiyerarşisi URL'de değil, **breadcrumb + `BreadcrumbList` JSON-LD + iç linklerde** ifade edilir:

```
INDOLES › Hizmetler › Growth › Performans pazarlama
```

### 3.2 Slug haritası

| Pillar | TR slug | EN slug |
|---|---|---|
| growth | `marka-stratejisi` | `brand-strategy` |
| growth | `performans-pazarlama` | `performance-marketing` |
| growth | `cro` | `cro` |
| growth | `e-ticaret` | `e-commerce` |
| growth | `ui-ux-tasarim` | `ui-ux-design` |
| transform | `ai-danismanlik` | `ai-consulting` |
| transform | `dijital-donusum` | `digital-transformation` |
| transform | `is-otomasyonlari` | `business-automation` |
| transform | `is-zekasi` | `business-intelligence` |
| transform | `isletme-muhendisligi` | `business-engineering` |
| build | `ozel-yazilim-ve-mobil` | `custom-software-development` |
| build | `teknoloji-ve-altyapi` | `technology-infrastructure` |

`cro` iki dilde de aynı: kısaltma her iki pazarda da arama hacmine sahip. Self-hreflang yine de her iki locale'i listeler.

### 3.3 Çakışma kuralı

Pillar anahtarları (`growth`, `transform`, `build`) ile 24 slug'ın hiçbiri çakışmaz. Çözüm sırası pillar-önce olduğu için, ileride eklenecek `growth` adlı bir hizmet **sessizce** pillar sayfasını gölgelerdi. Bunu yakalayan bir test yazılır (§11).

### 3.4 Eski site 301 haritası

`indoles_eski/` altındaki WordPress sayfaları hâlâ link equity taşıyor. `next.config` redirect'leri:

| Eski yol | Yeni hedef |
|---|---|
| `/dijital-pazarlama-hizmetleri` | `/tr/hizmetler/performans-pazarlama` |
| `/cro-donusum-orani-optimizasyonu` | `/tr/hizmetler/cro` |
| `/donusum-optimizasyonu-yontemleri` | `/tr/hizmetler/cro` |
| `/e-ticaret-danismanligi` | `/tr/hizmetler/e-ticaret` |
| `/kreatif-hizmetler` | `/tr/hizmetler/ui-ux-tasarim` |
| `/mobil-uygulama-ve-yazilim-cozumleri` | `/tr/hizmetler/ozel-yazilim-ve-mobil` |
| `/our-services` | `/en/services` |

Kalıcı (308) redirect. Eşleşmeyen eski hizmet sayfaları `/tr/hizmetler`'e gitmez — konu dışı yönlendirme soft-404 sayılır; eşleşmeyenler bu işte dokunulmadan bırakılır.

---

## 4. Veri Modeli

### 4.1 Yerleşim

```
src/lib/content/services/
  index.ts                        → SERVICES, getService, SERVICE_ORDER, getServicesByPillar
  marka-stratejisi.ts
  performans-pazarlama.ts
  cro.ts
  e-ticaret.ts
  ui-ux-tasarim.ts
  ai-danismanlik.ts
  dijital-donusum.ts
  is-otomasyonlari.ts
  is-zekasi.ts
  isletme-muhendisligi.ts
  ozel-yazilim-ve-mobil.ts
  teknoloji-ve-altyapi.ts
```

Hizmet başına bir dosya (~200 satır). Tek dosyada 12 hizmet ~2500 satır olurdu; bir hizmetin copy'sini düzenlerken diğer 11'ini bağlamda tutmak gereksiz.

### 4.2 Tip

`src/lib/content/types.ts` içine eklenir:

```ts
export type ServiceDeliverableKind = "document" | "system" | "training" | "access";

export type ServiceContent = {
  slug: Localized<string>;
  pillar: Pillar;
  name: Localized<string>;

  /** Kart metni — `pillars.ts`'ten taşındı. Persona-aware kalır. */
  shortDescription: PersonaText;

  /** Hero, 1. cümle. Kanonik — H1'in hemen altında, tek ses. */
  lede: Localized<string>;
  /** Hero, 2. cümle. Persona slot 1. */
  ledePersona: PersonaText;

  /** "Bu sayfa kimin için" — 3 durum sinyali. Persona slot 2. */
  signals: PersonaList;

  scope: {
    includes: Localized<string[]>;   // 6-8
    excludes: Localized<string[]>;   // 3-4
  };

  method: Array<{
    step: string;                    // "01"
    title: Localized<string>;
    description: Localized<string>;
    output: Localized<string>;       // bu adımın sonunda elinizde ne olur
  }>;

  deliverables: Array<{
    kind: ServiceDeliverableKind;
    label: Localized<string>;
  }>;

  /** Üç olgusal taahhüt. Performans metriği DEĞİL — §5.6. */
  commitments: Array<{
    value: Localized<string>;
    label: Localized<string>;
  }>;

  /** Tek sesli. Persona-aware olamaz — §6.3. */
  faq: Array<{
    question: Localized<string>;
    answer: Localized<string>;
  }>;

  seo: {
    title: Localized<string>;        // ≤60 karakter, "— INDOLES" hariç
    description: Localized<string>;  // ≤160 karakter
    /** GEO varlık kontrol listesi — sayfada açık isimle geçmesi gerekenler. */
    entities: Localized<string[]>;
  };

  /** Paket slug'ı (TR). Boş bırakılırsa pillar eşlemesine düşer. */
  relatedPackages: string[];
  /** Komşu hizmet slug'ı (TR), 3 adet. */
  relatedServices: string[];
};
```

### 4.3 `pillars.ts` refactor

`PillarContent.services` satır içi dizi olmaktan çıkar; `SERVICES`'ten türetilir:

```ts
// types.ts — PillarContent.services alanı kaldırılır
// pillars.ts
export function pillarServices(key: Pillar) {
  return getServicesByPillar(key);
}
```

Tüketiciler (`ServicesScroll`, `/hizmetler`, pillar detay) bu türetilmiş listeyi kullanır. Kart metni ile detay sayfası tek kaynaktan beslenir; iki yerde tutulursa sessizce ayrışır.

`SERVICE_ORDER` **açık dizi** olarak `services/index.ts`'te kalır. `ServiceIllustration` diyagramını indeksle seçiyor — sıra türetilirse bir hizmet eklendiğinde 12 sayfanın görseli sessizce kayar.

### 4.4 Migration notu

`shortDescription` metinleri `pillars.ts`'ten **birebir kopyalanır**, yeniden yazılmaz. 12 kartın mevcut metni onaylanmış içerik.

**Geçici çoğullama, bilinçli.** Faz 1-4 boyunca `shortDescription` iki yerde durur: `pillars.ts` içindeki satır içi dizide ve yeni `services/*.ts` dosyalarında. `pillars.ts` refactor'u Faz 5'e bırakıldı, çünkü hizmet sayfaları yazılırken üç tüketicinin (`ServicesScroll`, `/hizmetler`, pillar detay) çalışmaya devam etmesi gerekiyor — refactor'u öne almak, sayfalar yokken bu üç yüzeyi kırar. Faz 5'te satır içi dizi silinir ve tek kaynak `SERVICES` olur; §11'deki "SERVICE_ORDER ile SERVICES örtüşüyor" testi bu geçişi bekler.

Çoğullamanın penceresi kısa ve tek yönlü: Faz 1-4'te `pillars.ts`'teki metne **dokunulmaz**, yalnız okunur.

---

## 5. Sayfa İskeleti

Dokuz blok. Her blok ters piramit: ilk cümle tanımı verir, sonrası açar.

### 5.1 Hero

- Breadcrumb (mevcut `V2PageHeader` `crumbs` API'si): `INDOLES › Hizmetler › {Pillar} › {Hizmet}`
- Eyebrow: `{Pillar adı} · Hizmet {NN} / 12`
- **H1:** hizmet adı. Sayfadaki tek `h1`.
- Lede: `lede` (kanonik) + `ledePersona` (persona)
- Aside: `ServiceIllustration` büyük ölçekte + `PersonaSwitch`
- CTA: birincil "Görüşme planla" (`PopupCTAButton`), ikincil ilgili pakete

### 5.2 Kimin için

`h2` — "Bu üç durumdan biri sizdeyse". `signals` üç madde, persona-aware. Ziyaretçinin kendini teşhis ettiği blok; AI motorlarının en sık alıntıladığı yapı.

### 5.3 Kapsam

İki sütun, `h2` + iki `h3`:

- **Kapsar** — 6-8 madde (`scope.includes`)
- **Kapsamaz** — 3-4 madde (`scope.excludes`)

"Kapsamaz" sütunu bilinçli. İki işlevi var: satış öncesi beklenti hizalar, ve GEO'da ayrıştırıcı sinyal üretir — rakip hizmet sayfalarında bulunmayan cümleler alıntılanmaya daha yatkın.

### 5.4 Yöntem

`ol`, dört adım. Her adım: numara, başlık, açıklama, **çıktı** satırı. Pillar yönteminden miras alınmaz — pillar düzeyindeki "Teşhis / Strateji / Uygulama / Ölçek" hizmet düzeyinde fazla soyut kalıyor.

### 5.5 Çıktılar

`dl`. 5-7 kalem, her birinde tür etiketi (döküman / sistem / eğitim / erişim). Somut isim listesi — uzun kuyruk aramaların indiği yer ("pazarlama audit raporu", "ERP entegrasyon şeması").

### 5.6 Taahhüt şeridi

Üç olgu: **tipik süre · ekip şekli · giriş paketi**.

Pillar sayfalarındaki metrik şeridinin (`3.2× ROAS`) hizmet düzeyinde karşılığı yok ve üretilmeyecek. Doğrulanamayan sayı GEO'da özel olarak riskli: AI motoru ya pasajı atar ya da iddiayı yanlış atfeder; ikincisi marka için daha kötü. Gerçek hizmet düzeyinde metrik verisi geldiğinde bu blok tipi değişebilir.

### 5.7 SSS

4-6 soru, **tek sesli**. `FAQPage` JSON-LD buradan üretilir.

Yazım kuralları (§8'de gerekçesi):
- Soru gerçek müşteri diliyle ("Ne kadar sürede sonuç görürüz?" — "Süre nedir?" değil)
- Cevap kendine yeter: ilk cümle soruyu tam yanıtlar, anafora yok
- 40-80 kelime
- Hizmet adı ve "INDOLES" cevabın içinde açık isimle geçer

### 5.8 İlgili

Dört grup: ilgili paket(ler) → ilgili vaka → **komşu 3 hizmet** → ilgili yazı. Komşu hizmet linkleri topikal kümenin taşıyıcısı; 12 sayfa birbirine bağlanmazsa küme oluşmaz, 12 ayrı yaprak sayfa kalır.

### 5.9 CTA

Mevcut `ContactCallout`. Yeni bileşen yok.

---

## 6. Persona Sınırı (Yaklaşım A)

### 6.1 Tespit

`PersonaText` her iki varyantı da DOM'a basar; görüneni `globals.css:485` `display:none` ile seçer. Ekranda doğru davranış — hydration uyuşmazlığını ve FOIC'i birlikte çözüyor. Ama crawler ve LLM ham HTML okur.

### 6.2 Her bloğu persona-aware yapmanın maliyeti

1. 12 sayfanın indekslenebilir metni ikiye katlanır, yarısı gizli.
2. Yan yana çelişen iki cümle oluşur — AI motoru hangisini alıntılayacağını bilemez.
3. `FAQPage` şeması "görünen metinle eşleşme" kuralını ihlal eder: iki cevap görünür, şemada bir tane var.

### 6.3 Karar

Persona **iki slotla sınırlanır**: `ledePersona` (hero 2. cümle) ve `signals` ("kimin için"). Diğer her şey tek sesli.

| Yüzey | Ses |
|---|---|
| H1, meta title/description | kanonik |
| Hero lede 1. cümle | kanonik |
| Hero lede 2. cümle | **persona** |
| Kimin için | **persona** |
| Kapsam, yöntem, çıktılar, taahhüt | kanonik |
| SSS | kanonik |
| JSON-LD | kanonik |

Ölçülebilir eşik: sayfa metninin **≤%20**'si çift varyant. Audit script'i bunu doğrular (§9).

Persona sistemi ziyaretçi için tam da satın alma niyetinin ayrıştığı yerde — "bu benim durumum mu" sorusunda — çalışmaya devam eder. Bilgi katmanı tek ses konuşur.

---

## 7. SEO Katmanı

### 7.1 `src/lib/seo/`

Şu an boş klasör; docs/08'de planlanmış, yazılmamış. Genel yazılır:

| Dosya | Sorumluluk |
|---|---|
| `alternates.ts` | `buildAlternates(trPath, enPath)` → self-canonical + hreflang tr/en/x-default |
| `metadata.ts` | `buildMetadata({title, description, path, locale, ogType})` → Next `Metadata` |
| `json-ld.ts` | `organizationLd`, `serviceLd`, `breadcrumbLd`, `faqLd`, `webPageLd` |
| `JsonLd.tsx` | `<script type="application/ld+json">` sarmalayıcı, `@graph` birleştirir |

Bağımlılık yönü tek yönlü: `lib/seo` içerik katmanını **bilmez**; çağıran sayfa veriyi hazırlayıp verir. Böylece paket/vaka/yazı sayfaları aynı kütüphaneyi kullanabilir.

### 7.2 Uygulama alanı

12 hizmet + 3 pillar + `/hizmetler`. Pillar ve liste sayfaları da dahil, çünkü kümenin tepesi metadata'sız kalırsa 12 yaprak sayfa bağlamsız kalır.

### 7.3 JSON-LD grafiği (hizmet sayfası)

Tek `@graph`, dört düğüm:

- `Service` — `serviceType`, `provider` → Organization, `areaServed: TR`, `availableLanguage: [tr, en]`, `hasOfferCatalog` → ilgili paketler (`packages.ts`'teki **gerçek** fiyatlarla)
- `BreadcrumbList` — 4 seviye
- `FAQPage` — §5.7 verisinden, görünen metinle birebir
- `WebPage` — `inLanguage`, `isPartOf`

### 7.4 Sitemap

`sitemap.ts` 15 route ile genişler (12 hizmet + 3 pillar; `/hizmetler` zaten var), hepsi hreflang alternatifleriyle. Priority: hizmet detay `0.8`, pillar `0.9` (docs/08 §4.3 tablosuna uygun).

### 7.5 Başlık ve açıklama kalıbı

| Alan | Kalıp | Sınır |
|---|---|---|
| Title | `{Hizmet adı} — INDOLES` (template layout'ta) | 60 karakter |
| Description | Ne yapıldığı + kime + ayrıştırıcı | 160 karakter |

`seo.title` ve `seo.description` her hizmet dosyasında elle yazılır — `name` ve `lede`'den otomatik türetilmez, çünkü ikisi de karakter sınırına göre yazılmamış.

---

## 8. GEO Katmanı

SEO ile aynı şey değil: hedef sıralama değil, **alıntılanma**.

| # | Önlem | Uygulama |
|---|---|---|
| 1 | Kendine yeten cevap | SSS cevapları ve bölüm açılış cümleleri anafora içermez ("bu hizmet", "yukarıda belirtildiği gibi" yok). Pasaj bağlamından koparıldığında anlamını korur |
| 2 | Varlık yoğunluğu | "INDOLES", hizmet adı, sektör adları zamirle değil açık isimle. `seo.entities` kontrol listesi |
| 3 | Cevap-önce paragraf | Her bölüm ilk cümlede tanımı verir |
| 4 | Doğrulanabilir iddia | Uydurma metrik yok (§5.6) |
| 5 | `llms.txt` genişletmesi | Mevcut dosya 12 hizmeti **isim olarak** sayıyor, hiçbirine link vermiyor. 24 URL eklenir (TR+EN) |
| 6 | Semantik HTML | h1→h2→h3 sırası, çıktılar `dl`, yöntem `ol` |
| 7 | Kapsam-dışı beyanı | §5.3'teki "Kapsamaz" sütunu — ayrıştırıcı, alıntılanabilir |

**`FAQPage` hakkında not:** Google FAQ rich result'larını 2023'te devlet/sağlık sitelerine daralttı; şema artık SERP'te görsel kazanç getirmiyor. Yine de konuyor, çünkü GEO tarafında birinci sınıf sinyal: soru-cevap blokları AI motorları tarafından doğrudan alıntılanıyor. Bu, soruların **SERP için değil AI için** yazılmasını gerektiriyor — §5.7 kuralları buradan çıkıyor.

---

## 9. Audit Döngüsü

Her sayfa bittikten sonra tek tek çalıştırılır. 12 kez göz kararı yerine script.

### 9.1 `scripts/seo-audit.mjs`

Dev sunucudan render edilmiş HTML'i çeker, denetler:

| Kontrol | Eşik |
|---|---|
| `<h1>` sayısı | tam 1 |
| Title uzunluğu | ≤60 karakter |
| Description uzunluğu | ≤160 karakter |
| Canonical | var, self |
| hreflang | tr + en + x-default, self dahil |
| JSON-LD | parse ediliyor; `Service`, `BreadcrumbList`, `FAQPage` mevcut |
| Başlık sırası | atlama yok |
| SSS cevabı | ≥40 kelime, anafora kalıbı yok |
| İç link | ≥6; komşu hizmetlere ≥3 |
| Persona çift metni | sayfa metninin ≤%20'si |
| `alt` metni | dekoratif olmayan her görselde |
| Varlık kontrolü | `seo.entities` maddelerinin her biri metinde geçiyor |

Çıktı: sayfa başına PASS/FAIL listesi.

### 9.2 Döngü

1. Sayfa yazılır
2. `pnpm typecheck && pnpm test`
3. `node scripts/seo-audit.mjs {slug}` — TR ve EN
4. FAIL bulguları düzeltilir, 3 tekrarlanır
5. Sonuç `docs/16-service-pages-seo-audit.md`'ye işlenir

Pilot sayfada ek olarak Chrome DevTools ile Lighthouse (performans / erişilebilirlik / SEO) ve 390px + 1440px görsel doğrulama.

---

## 10. Dosya Değişiklikleri

### 10.1 Yeni

```
src/lib/content/services/index.ts
src/lib/content/services/{12 hizmet}.ts
src/lib/seo/alternates.ts
src/lib/seo/metadata.ts
src/lib/seo/json-ld.ts
src/lib/seo/JsonLd.tsx
src/components/marketing/service-detail.tsx      → 9 blokluk şablon
src/components/marketing/pillar-detail.tsx       → mevcut şablon taşınır
src/components/marketing/scope-columns.tsx       → kapsar/kapsamaz
scripts/seo-audit.mjs
docs/16-service-pages-seo-audit.md
docs/decisions/ADR-018-service-detail-pages.md
```

### 10.2 Değişen

```
src/lib/content/types.ts                         → ServiceContent, PillarContent.services kaldırılır
src/lib/content/pillars.ts                       → services türetilir
src/app/(marketing)/[locale]/hizmetler/[slug]/page.tsx  → ince çözücü
src/app/(marketing)/[locale]/hizmetler/page.tsx  → hizmet linkleri + metadata
src/components/v2/sections/ServicesScroll.tsx    → kart linki hizmete gider
src/app/sitemap.ts                               → 15 route
src/app/llms.txt/route.ts                        → 24 hizmet URL'i
next.config.ts                                   → 7 adet 308 redirect
```

---

## 11. Test Stratejisi

| Test | Konu |
|---|---|
| `services.test.ts` | 12 hizmet var; her birinin TR+EN slug'ı dolu; slug'lar benzersiz |
| `services.test.ts` | Hiçbir slug pillar anahtarıyla çakışmıyor (`growth`/`transform`/`build`) |
| `services.test.ts` | `SERVICE_ORDER` 12 slug içeriyor ve `SERVICES` ile birebir örtüşüyor |
| `services.test.ts` | `relatedServices` yalnızca var olan slug'lara işaret ediyor; kendine referans yok |
| `services.test.ts` | `seo.title` ≤60, `seo.description` ≤160 (TR ve EN) |
| `seo.test.ts` | `buildAlternates` self-hreflang + x-default üretiyor |
| `seo.test.ts` | `faqLd` görünen soru/cevap sayısıyla eşleşiyor |
| `seo.test.ts` | `serviceLd` `hasOfferCatalog`'a yalnızca var olan paketleri koyuyor |
| e2e | 12 hizmet URL'i 200 dönüyor (TR+EN); bilinmeyen slug 404 |
| e2e | Ana sayfa hizmet kartı → doğru hizmet sayfası |

---

## 12. Uygulama Sırası

| Faz | İçerik | Çıktı |
|---|---|---|
| 0 | `lib/seo` + `ServiceContent` tipi + testler | Altyapı, sayfa yok |
| 1 | `services/index.ts` + **pilot**: `performans-pazarlama` | Tam sayfa, TR+EN, audit geçmiş |
| — | **Burak onayı** — ton, iskelet, uzunluk | — |
| 2 | Growth kalan 4 | 5 sayfa, her biri auditli |
| 3 | Transform 5 | 10 sayfa |
| 4 | Build 2 | 12 sayfa |
| 5 | `pillars.ts` refactor, `ServicesScroll` link, sitemap, llms.txt, 301'ler | Küme kapanır |
| 6 | Tam site doğrulama: typecheck, test, e2e, 24 URL audit, Lighthouse | ADR-018 + audit raporu |

---

## 13. Riskler

| Risk | Etki | Önlem |
|---|---|---|
| Copy hacmi (12 × 2 dil × 9 blok) ton kayması üretir | Yüksek | Pilot onayı; sonraki 11 aynı kalıptan |
| `pillars.ts` refactor 3 tüketiciyi kırar | Orta | Türetilmiş liste aynı şekli döner; typecheck + mevcut testler yakalar |
| EN copy çeviri gibi okunur | Orta | docs/03 §7: EN yeniden yazım, çeviri değil. Audit'te varlık kontrolü EN için ayrı koşar |
| 12 sayfa birbirine benzeyip thin content'e düşer | Orta | Her hizmetin `scope.excludes` ve `method` bloğu hizmete özel yazılır; audit kelime sayısı eşiği |
| Diyagram indeksi kayar | Düşük | `SERVICE_ORDER` açık dizi + test |

---

## 14. Açık Nokta

**Hizmet düzeyinde gerçek metrik.** *(Burak, 2026-08-19: metrikler sonra verilecek — bu iş olgusal taahhüt şeridiyle tamamlanır.)*

**Kapsam:** §5.6 uydurma sayıyı reddediyor ve olgusal taahhüde düşüyor. Elde doğrulanabilir hizmet metriği (ör. "ortalama CRO testi kazanma oranı") varsa taahhüt şeridi metrik şeridine dönüşebilir — bu spec'i geçersizleştirmez, `commitments` alanının içeriğini değiştirir.
