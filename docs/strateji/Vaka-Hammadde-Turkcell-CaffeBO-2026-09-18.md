# Vaka Hammaddesi — Turkcell BiP ve CaffeBO (2026-09-18)

> **Amaç:** İki eski portfolyo sayfasının vaka olarak geri alınması için gereken her şeyi tek dosyada toplamak. Anlatı metnini Burak yazacak; bu belge anlatı dışındaki her alanı, kod parçalarını, test etkilerini ve doğrulama adımlarını hazır tutar.
> **Kapsam kararı:** Burak, 21:25 — vaka içeriğini kendisi yazacak. Bu dalda `src/lib/content/cases.ts` ve `src/lib/seo/legacy-redirects.ts` DEĞİŞTİRİLMEDİ; yalnız bu belge eklendi.
> **Bağlam:** ADR-019 (Karar 1: iki vaka taşınmaz) · `docs/strateji/Indeks-Denetimi-2026-09-18.md` · Burak'ın 10 Eylül kararı (c seçeneği: ikisi de vaka olarak girilecek).
> **Kritik sıra:** Yönlendirme satırları vaka sayfaları yayına girmeden EKLENMEZ. Eklenirse eski URL 404'e yönlendirilmiş olur — bugünkü düz 404'ten daha kötü bir sinyal.

İlgili eski URL'ler ve 28 günlük Search Console verisi:

| Eski URL                                                        | Gösterim | Ortalama poz. | Tık |
| --------------------------------------------------------------- | -------- | ------------- | --- |
| `/portfolyo/turkcell-bip-televizyon-reklam-filmi-produksiyonu/` | 17       | 9,6           | 0   |
| `/portfolyo/luks-kafe-tanitimi-sinematik-marka-promosyonu/`     | 24       | 22,9          | 1   |

---

## 1. Wayback Machine — ham metin bulunamadı

**Sonuç: iki portfolyo sayfasının hiçbir arşiv kopyası yok. Eski site metni bu belgeye yazılamadı.**

Denenen adresler ve dönen cevaplar (hepsi 2026-09-18, bu oturumda):

| Deneme   | Adres                                                                                                                      | Sonuç                                                           |
| -------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Snapshot | `https://web.archive.org/web/2025/https://www.indoles.com.tr/portfolyo/turkcell-bip-televizyon-reklam-filmi-produksiyonu/` | HTTP 404 — kayıt yok                                            |
| Snapshot | `https://web.archive.org/web/2025/https://www.indoles.com.tr/portfolyo/luks-kafe-tanitimi-sinematik-marka-promosyonu/`     | HTTP 404 — kayıt yok                                            |
| Snapshot | `https://web.archive.org/web/2024/https://indoles.com.tr/portfolyo/turkcell-bip-televizyon-reklam-filmi-produksiyonu/`     | HTTP 404 — kayıt yok                                            |
| CDX      | `cdx/search/cdx?url=indoles.com.tr/portfolyo/turkcell-bip-televizyon-reklam-filmi-produksiyonu*`                           | HTTP 200, boş yanıt                                             |
| CDX      | `cdx/search/cdx?url=www.indoles.com.tr/portfolyo/*`                                                                        | HTTP 200, boş yanıt                                             |
| CDX      | `cdx/search/cdx?url=indoles.com.tr/portfolyo&matchType=prefix`                                                             | HTTP 200, boş yanıt                                             |
| CDX      | `cdx/search/cdx?url=www.indoles.com.tr&matchType=prefix`                                                                   | Yalnız apex kök adresi döndü, `www.` konağına ait hiç kayıt yok |
| CDX      | `cdx/search/cdx?url=indoles.com.tr&matchType=domain&collapse=urlkey`                                                       | Tüm alan adı için **10 tekil urlkey**                           |

Alan adının Wayback'teki tüm envanteri, tarama sırasının kanıtıyla birlikte:

```
tr,com,indoles)/                20240907064629  http://indoles.com.tr/     text/html  403
tr,com,indoles)/                20240907064629  https://indoles.com.tr/    revisit    -
tr,com,indoles)/                20250107174023  https://indoles.com.tr/    revisit    -
tr,com,indoles,autodiscover)/   ...  (cPanel servis alt alanları)
tr,com,indoles,cpanel)/         ...
tr,com,indoles,cpcalendars)/    ...
tr,com,indoles,cpcontacts)/     ...
tr,com,indoles,mail)/           ...
tr,com,indoles,tr)/             20250209195037  http://tr.indoles.com.tr/  text/html  403
tr,com,indoles,webdisk)/        ...
tr,com,indoles,webmail)/        ...
```

**Okuma.** Arşivde yalnız kök adres ve barındırma servisinin alt alanları var; kök çekimlerinin ikisi de **HTTP 403** ile kaydedilmiş, yani Wayback'in tarayıcısı eski WordPress sitesine hiçbir zaman girememiş. Portfolyo, hizmet veya blog sayfalarının tek bir kopyası bile yok. API çalışıyor (`example.com` kontrol sorgusu normal sonuç döndürdü), sorun bizim alan adımızda.

Aynı oturumda repo ve disk de tarandı:

- `indoles_eski/` klasörü repoda yok; git geçmişinde de hiç olmamış (`git log --all -- "*indoles_eski*"` boş). ADR-019 ve `articles.ts` yorumlarındaki `indoles_eski/wp-icerik/...` yolları repo dışı bir kaynağa işaret ediyor.
- `/Users/burakardaozgul` altında 7 seviye derinliğe kadar `indoles_eski`, `wp-icerik`, `portfolyo__*` araması: sonuç yok.
- `content/` yalnız KVKK MDX dosyalarını taşıyor; `docs/15-content-audit.md`'de Turkcell tek bir yerde geçiyor ve o da logo şeridiyle ilgili (B4 bulgusu), portfolyo metni değil.

### Burak'tan istenecek: kaynak metin

Metin yalnız aşağıdaki kaynaklardan gelebilir. En az biri gerekiyor:

1. **WordPress yedeği / veritabanı dökümü** — `indoles_eski/wp-icerik/` klasörünün bulunduğu yer. ADR-019'a göre 2026-08 migrasyonunda bu klasör kullanılmış; büyük olasılıkla harici disk veya eski bilgisayarda duruyor.
2. **Hosting (cPanel) yedeği** — eski site aynı barındırmada duruyorsa `wp_posts` tablosu yeterli.
3. **Burak'ın kendi hafızası + proje dosyaları** — iki iş de prodüksiyon işi; brief, senaryo, teslim listesi, montaj dosyaları tarih ve kapsam için yeterli kaynak.
4. **Yayınlanmış filmler** — YouTube/Vimeo/sosyal medya bağlantıları. Hem metin bağlamı hem de medya (bkz. §2) buradan çıkar.

Kaynak metin gelmezse vaka yazılamaz: repoda doğrulanabilir tek bir cümle yok ve rakam uydurulmaz (docs/04 §10).

---

## 2. Görsel envanteri — mevcut vakalar ve iki vaka için istenecek dosyalar

`public/work/` altında bugün bulunan her dosya (ölçüler piksel, boyut bayt):

| Vaka klasörü             | Dosya                                                 | Ölçü                | Boyut        | Rolü                        |
| ------------------------ | ----------------------------------------------------- | ------------------- | ------------ | --------------------------- |
| `feruza/`                | `logo.png`                                            | 1000x500            | 17 KB        | `clientLogo`                |
|                          | `kapak.jpg`                                           | 1230x1537           | 266 KB       | `cover`                     |
|                          | `kampanya-takim.jpg`                                  | 1223x1529           | 221 KB       | `media`                     |
|                          | `urun-sandalet.jpg`                                   | 1245x1556           | 72 KB        | `media`                     |
|                          | `urun-stiletto.jpg`                                   | 1230x1537           | 78 KB        | `media`                     |
| `fyr/`                   | `logo.png`                                            | 1000x500            | 32 KB        | `clientLogo`                |
|                          | `kapak.jpg`                                           | 2048x2560           | 318 KB       | `cover`                     |
|                          | `mekan.jpg` / `mum.jpg`                               | 2048x2560           | 333 / 294 KB | `media`                     |
|                          | `vazo.jpg`                                            | 2000x2500           | 220 KB       | `media`                     |
| `gymwolves/`             | `logo.png`                                            | 1000x500            | 11 KB        | `clientLogo`                |
|                          | `kampanya-kapak.jpg`                                  | 1190x1487           | 142 KB       | `cover`                     |
|                          | `pist-sicrama.jpg` / `salon.jpg` / `tribun-kosu.jpg`  | 1284x1284           | 124-196 KB   | `media`                     |
| `istanbul-ortez-protez/` | `logo.png`                                            | 1000x500            | 9 KB         | `clientLogo`                |
|                          | `kapak.jpg`                                           | 1920x1080           | 298 KB       | `cover`                     |
|                          | `kimlik-tisort.jpg` / `mobil.jpg` / `web-tasarim.jpg` | 1920x1080           | 167-217 KB   | `media`                     |
|                          | `urun-brosuru.jpg`                                    | 1810x2560           | 328 KB       | `media`                     |
| `meccanotecnica/`        | `logo.svg`                                            | 700x229             | 17 KB        | `clientLogo` (tek SVG logo) |
|                          | `kapak.jpg`                                           | 1600x1009           | 401 KB       | `cover`                     |
|                          | `teklif-portali.jpg`                                  | 1600x1039           | 202 KB       | `media`                     |
| `mkcomputer/`            | `logo.png`                                            | 1000x500            | 33 KB        | `clientLogo`                |
|                          | `kapak.jpg`                                           | 2048x2560           | 376 KB       | `cover`                     |
|                          | `vitrin.jpg`                                          | 1665x1040           | 161 KB       | `media`                     |
| `odorgo/`                | `logo.png`                                            | 1500x750            | 19 KB        | `clientLogo`                |
|                          | `icindekiler.jpg`                                     | 1440x1800           | 420 KB       | `cover`                     |
|                          | `odeme-sayfasi.jpg`                                   | 1600x906            | 133 KB       | `media`                     |
|                          | `yt-<videoId>.jpg` (4 adet)                           | 1280x720 ve 640x480 | 37-118 KB    | YouTube facade `poster`     |
| `sim/`                   | `logo.png`                                            | 1000x500            | 94 KB        | `clientLogo`                |
|                          | `kapak.jpg`                                           | 1600x1002           | 291 KB       | `cover`                     |
|                          | `blog.jpg` / `vitrin.jpg`                             | 1600x1002           | 342-424 KB   | `media`                     |
|                          | `renk-uretimi.jpg`                                    | 1920x1200           | 203 KB       | `media`                     |
|                          | `urun-evcolor.jpg`                                    | 1000x667            | 70 KB        | `media`                     |
| `soylu-avm/`             | `logo.png`                                            | 1000x500            | 13 KB        | `clientLogo`                |
|                          | `vitrin.jpg`                                          | 2400x1368           | 634 KB       | `cover` ve `media`          |
|                          | `mobil-vitrin.jpg`                                    | 2048x2560           | 340 KB       | `media`                     |

Okunan desen:

- Klasör adı TR slug değil, kısa marka adı (`fyr`, `sim`, `soylu-avm`). Yeni klasörler: `public/work/turkcell-bip/` ve `public/work/caffebo/`.
- `logo.png` her yerde **1000x500** (OdorGo 1500x750 ile aynı 2:1 oranı). Şeffaf zeminli PNG.
- Kapak ve galeri görselleri JPG, en küçüğü 1000 piksel genişlikte; kart 4:3 kırptığı için kapağın merkezinde okunabilir kompozisyon aranıyor.
- Reklam filmi taşıyan tek vaka OdorGo ve orada video YouTube'da kalıyor; sayfaya yalnız **lokal kapak karesi** (`poster`) iniyor, iframe tıklamayla `youtube-nocookie` üzerinden yükleniyor (ADR-019 Karar 9). `width: 16`, `height: 9` olarak yazılıyor.

### Burak'tan istenecek: dosyalar

**Turkcell BiP reklam filmi vakası için**

| Alan         | İstenen                                                                            | Not                                                                                                                                                                                                                                               |
| ------------ | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `clientLogo` | `public/work/turkcell-bip/logo.png`, 1000x500, şeffaf PNG                          | `public/musteri_logolari/Turkcell.png` repoda var ama o dosya anasayfa logo şeridinin varlığı; vaka künyesi için ayrı kopya alınmalı. Ayrıca marka kullanım izni doğrulanmalı (docs/15 B4 bulgusu: logoların hangi kapsamda kullanıldığı ayrımı). |
| `cover`      | 1 kapak karesi, en az 1600 piksel genişlik, JPG                                    | Karttaki 4:3 kırpımına dayanan bir kare                                                                                                                                                                                                           |
| `media`      | Filmin YouTube/Vimeo bağlantısı + her video için lokal kapak karesi (1280x720 JPG) | Film yayında değilse galeri sahne kareleriyle kurulur                                                                                                                                                                                             |
| Ek           | Kamera arkası / storyboard / kadraj kareleri                                       | Opsiyonel; galeri zenginleştirir                                                                                                                                                                                                                  |

**CaffeBO sinematik marka tanıtımı vakası için**

| Alan         | İstenen                                               | Not                                                                  |
| ------------ | ----------------------------------------------------- | -------------------------------------------------------------------- |
| `clientLogo` | `public/work/caffebo/logo.png`, 1000x500, şeffaf PNG  | Repoda CaffeBO logosu YOK — `public/musteri_logolari/` içinde de yok |
| `cover`      | 1 kapak karesi, en az 1600 piksel genişlik, JPG       |                                                                      |
| `media`      | Filmin bağlantısı + lokal kapak karesi (1280x720 JPG) |                                                                      |
| Ek           | Mekan ve ürün kareleri                                | Kafe işi; mekan çekimi galeri için doğal malzeme                     |

**Yer tutucu koyulmayacak.** `cover`, `heroMedia`, `media` ve `clientLogo` alanlarının hepsi tipte opsiyonel; `case-card.tsx` kapak yoksa logoya, logo da yoksa metin kartına düşüyor. Yani görsel gelmeden vaka yayına girebilir — ama kart görselsiz görünür. Görseller gelene kadar vaka metni yazılıp alanlar boş bırakılabilir, sonradan tek commit'le doldurulur.

---

## 3. `CaseStudyContent` alanları ve hazır şablon

### 3.1 Tipteki zorunlu ve opsiyonel alanlar

Kaynak: `src/lib/content/types.ts`.

**Zorunlu (TypeScript):** `slug`, `clientName`, `clientSector`, `problemType`, `pillar`, `title`, `lead`, `challenge`, `approach`, `outcome`, `metrics`, `durationWeeks`.

**Opsiyonel (TypeScript):** `period`, `clientLogo`, `services`, `serviceSlugs`, `approachFlow`, `approachFlowIcons`, `cover`, `heroMedia`, `media`, `testimonial`, `faq`, `seo`.

**Testlerin fiilen zorunlu kıldıkları** (`tests/unit/cases-content.test.ts` — typecheck geçse bile bunlar olmadan `pnpm test` düşer):

| Alan                  | Kural                                                                                                                                                                 |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `slug.tr` / `slug.en` | Küçük harf, rakam, tire; Türkçe harf yok. EN slug TR'den farklı. İki havuz kesişmez.                                                                                  |
| `serviceSlugs`        | En az 1 kalem, hepsi gerçek bir `SERVICES` TR slug'ına çözülmeli, tekrarsız.                                                                                          |
| `faq`                 | **En az 10 soru.** Her cevap iki dilde de **en az 40 kelime**. Cevaplar anafora ile başlayamaz (`bu`, `bunu`, `o `, `ayrıca`, `ancak`, `yukarıda`). Soru tekrarı yok. |
| `seo.title`           | İki dilde de dolu. `"<title> — INDOLES"` toplamı 15-60 karakter, yani **title ≤ 50 karakter**. İki nokta öncesi parça `clientName`'in başlangıcı olmak zorunda.       |
| `seo.description`     | İki dilde de dolu, **80-160 karakter**. İçindeki her rakam vakanın kendi metninde (başlık, lede, challenge, approach, outcome, metrics) geçmeli.                      |
| `metrics`             | `[]` olabilir (Feruza örneği). Doluysa `value` ve `label` iki dilde dolu; EN değer Türkçe sayı biçimi taşıyamaz (`%90`, `200.000`, `İlk`, `dk/sn/ay/zincir`).         |
| İngilizce metin       | İngiliz imlası (`tests/unit/en-spelling.test.ts` — `title.en`, `lead.en`, `challenge.en`, `approach.en`, `outcome.en`, `faq.en` taranıyor).                           |

`approachFlowIcons` kullanılacaksa `approachFlow` ile aynı uzunlukta olmalı ve anahtarlar mevcut union'dan seçilmeli: `measure`, `segment`, `broadcast`, `grid`, `build`, `design`, `content`, `search`, `sync`, `server`, `advise`, `film`. **Reklam filmi işinde `film` glyph'i zaten var** (OdorGo için eklenmişti) — yeni glyph gerekmiyor.

### 3.2 Union seçimleri ve gerekçesi

`CaseStudyContent`'te `category` diye bir alan **yok**; kapalı iki union `problemType` ve `pillar`.

`ProblemType` seçenekleri: `efficiency_loss`, `cost_optimization`, `market_expansion`, `digital_transformation`, `customer_acquisition`.

**Öneri — her iki vaka için `market_expansion`, pillar `growth`.**

Gerekçe: ikisi de bir markanın algısını ve görünürlüğünü büyütmek için yapılmış kreatif işler; en yakın emsal OdorGo (reklam filmi + kategori kurma, `market_expansion` / `growth`) ve FYR (lüks lansman, `market_expansion` / `growth`). `customer_acquisition` da savunulabilir, ama o eksen SOYLU AVM'deki gibi ölçülmüş edinim hunisi anlatan vakalarda kullanılıyor; elimizde edinim rakamı yoksa `market_expansion` daha dürüst.

**Union genişletilmedi ve genişletilmemeli.** "Prodüksiyon" veya "marka bilinirliği" diye bir problem tipi yok; ADR-019'un iki vakayı dışarıda bırakma gerekçesi tam olarak buydu. Yukarıdaki eşleme bu gerekçeyi ortadan kaldırmıyor, yalnız en yakın kutuya yerleştiriyor. **Burak'a soru:** bu eşleme kabul mü, yoksa `/vakalar` filtresine yeni bir problem tipi mi açılsın? Yeni tip açılırsa `types.ts` + `messages/{tr,en}.json` filtre etiketleri + ADR güncellemesi gerekir.

### 3.3 Turkcell BiP — doldurulmuş şablon

Anlatı alanları `<<Burak yazacak>>` ile işaretli. `CASES` dizisinin **SONUNA** eklenir (mevcut hizmet sayfalarının vitrin vakası değişmesin diye — `relatedCaseForService` dizideki ilk eşleşmeyi seçiyor; `marka-stratejisi` bugün FYR'yi gösteriyor ve öyle kalmalı).

```ts
  {
    slug: { tr: "turkcell-bip-reklam-filmi", en: "turkcell-bip-commercial" },
    clientName: { tr: "Turkcell BiP", en: "Turkcell BiP" },
    clientSector: {
      tr: "Telekomünikasyon — mesajlaşma uygulaması",
      en: "Telecommunications — messaging app",
    },
    problemType: "market_expansion",
    pillar: "growth",
    // period: { tr: "<<Burak: ay ve yıl>>", en: "<<Burak: month and year>>" },
    // clientLogo: "/work/turkcell-bip/logo.png",
    services: {
      tr: [
        "Kreatif yönetim",
        "Televizyon reklam filmi prodüksiyonu",
        // <<Burak: künyede gerçekten verilen disiplinler>>
      ],
      en: [
        "Creative direction",
        "TV commercial production",
        // <<Burak: the disciplines actually delivered>>
      ],
    },
    serviceSlugs: ["marka-stratejisi"],
    title: {
      tr: "<<Burak yazacak>>",
      en: "<<Burak yazacak>>",
    },
    lead: {
      tr: "<<Burak yazacak>>",
      en: "<<Burak yazacak>>",
    },
    challenge: {
      tr: ["<<Burak yazacak — 3 madde>>"],
      en: ["<<Burak yazacak — 3 items>>"],
    },
    approach: {
      tr: ["<<Burak yazacak — 3-4 madde>>"],
      en: ["<<Burak yazacak — 3-4 items>>"],
    },
    outcome: {
      tr: ["<<Burak yazacak — süreç ve çıktı odaklı>>"],
      en: ["<<Burak yazacak — process and output focused>>"],
    },
    // approachFlow ve approachFlowIcons opsiyonel; reklam filmi işinde
    // "film" glyph'i hazır. Örnek iskelet:
    // approachFlow: {
    //   tr: ["Brief ve senaryo", "Kreatif yön", "Prodüksiyon", "Yayın"],
    //   en: ["Brief & script", "Creative direction", "Production", "Broadcast"],
    // },
    // approachFlowIcons: ["search", "design", "film", "broadcast"],
    //
    // METRIK: ölçülebilir ve doğrulanabilir rakam yoksa dizi BOŞ bırakılır.
    // Ölçüm bandı yalnız metrics.length > 0 olduğunda basılır (ADR-019
    // Karar 8); boş dizi hata değil, bilinçli karardır. Feruza aynı durumda
    // ve SSS'inde bunu açıkça söylüyor — aynı dürüstlük cümlesi buraya da
    // yazılır. Rakam uydurulmaz (docs/04 §10).
    metrics: [],
    durationWeeks: 0, // <<Burak: gerçek süre, hafta cinsinden>>
    seo: {
      title: {
        tr: "<<Burak yazacak — Turkcell BiP ile başlar, ≤50 karakter>>",
        en: "<<Burak yazacak — starts with Turkcell BiP, ≤50 chars>>",
      },
      description: {
        tr: "<<Burak yazacak — 80-160 karakter, içindeki her rakam vaka metninde geçmeli>>",
        en: "<<Burak yazacak — 80-160 chars, every number must appear in the case body>>",
      },
    },
    faq: [
      // <<Burak yazacak — EN AZ 10 soru, her cevap iki dilde de en az 40
      // kelime, cevaplar "Bu/O/Ayrıca" ile başlamaz, işi adıyla anar.>>
    ],
    // cover / heroMedia / media / testimonial: görsel gelince doldurulur.
  },
```

### 3.4 CaffeBO — doldurulmuş şablon

```ts
  {
    slug: {
      tr: "caffebo-sinematik-marka-tanitimi",
      en: "caffebo-cinematic-brand-film",
    },
    clientName: { tr: "CaffeBO", en: "CaffeBO" },
    clientSector: {
      tr: "Kafe ve gastronomi",
      en: "Cafe & hospitality",
    },
    problemType: "market_expansion",
    pillar: "growth",
    // period: { tr: "<<Burak: ay ve yıl>>", en: "<<Burak: month and year>>" },
    // clientLogo: "/work/caffebo/logo.png",
    services: {
      tr: [
        "Marka tanıtım filmi",
        "Kreatif yönetim",
        // <<Burak: künyede gerçekten verilen disiplinler>>
      ],
      en: [
        "Brand film",
        "Creative direction",
        // <<Burak: the disciplines actually delivered>>
      ],
    },
    serviceSlugs: ["marka-stratejisi"],
    title: {
      tr: "<<Burak yazacak>>",
      en: "<<Burak yazacak>>",
    },
    lead: {
      tr: "<<Burak yazacak>>",
      en: "<<Burak yazacak>>",
    },
    challenge: {
      tr: ["<<Burak yazacak — 3 madde>>"],
      en: ["<<Burak yazacak — 3 items>>"],
    },
    approach: {
      tr: ["<<Burak yazacak — 3-4 madde>>"],
      en: ["<<Burak yazacak — 3-4 items>>"],
    },
    outcome: {
      tr: ["<<Burak yazacak — süreç ve çıktı odaklı>>"],
      en: ["<<Burak yazacak — process and output focused>>"],
    },
    metrics: [],
    durationWeeks: 0, // <<Burak: gerçek süre, hafta cinsinden>>
    seo: {
      title: {
        tr: "<<Burak yazacak — CaffeBO ile başlar, ≤50 karakter>>",
        en: "<<Burak yazacak — starts with CaffeBO, ≤50 chars>>",
      },
      description: {
        tr: "<<Burak yazacak — 80-160 karakter>>",
        en: "<<Burak yazacak — 80-160 chars>>",
      },
    },
    faq: [
      // <<Burak yazacak — EN AZ 10 soru, kurallar yukarıdaki gibi>>
    ],
  },
```

### 3.5 `serviceSlugs` seçimi üzerine not

`marka-stratejisi` ikisinde de önerildi: prodüksiyon işi ADR-019'un FYR notunda "marka stratejisinin uygulama tarafı" olarak tanımlanmış ve `SERVICES` içinde ayrı bir "video prodüksiyon" hizmeti yok.

İki yan etki bilinerek kabul ediliyor:

1. **Hizmet sayfasının vitrin vakası değişmez.** `marka-stratejisi` sayfasında bugün FYR görünüyor (`CASES` sırasındaki ilk eşleşme). Yeni vakalar dizinin sonuna eklendiği sürece bu değişmez.
2. **"İlgili yazılar" bloğu yalnız `marka-hikaye` konusundan beslenir.** `topics.ts`te `video-kreatif` konusunun `serviceSlug` değeri `null` — yani `neden-profesyonel-video-sart` yazısı vaka sayfasına otomatik olarak inmez. Ters yön (yazıdan vakaya) §4.3'teki elle bağlantılarla kurulur. **Burak'a soru:** `video-kreatif` konusuna `marka-stratejisi` hizmeti bağlansın mı? Bağlanırsa iki yön de otomatik olur, ama `marka-stratejisi` hizmet sayfasının "İlgili yazılar" havuzu da değişir; ayrı bir karar.

---

## 4. Hazır yapıştırılacak kod parçaları

### 4.1 `src/lib/seo/legacy-redirects.ts`

**Önce şu yorum değiştirilir** (dosyada `LEGACY_REDIRECTS` içindeki portfolyo bloğunun başında):

Mevcut hâli:

```ts
// Eski portfolyo → yeni vaka sayfaları (ADR-019). Vakalar taşındıkça
// buraya birer satır eklenir; taşınmayanlar (Turkcell, CaffeBO) 404'te
// kalır — konu dışı yönlendirme soft-404 sayılır.
```

Yeni hâli:

```ts
// Eski portfolyo → yeni vaka sayfaları (ADR-019). Vakalar taşındıkça
// buraya birer satır eklenir. Turkcell BiP ve CaffeBO 2026-09-18'e kadar
// bilinçli 404'teydi (saf prodüksiyon işleri, problem-tipi şemaya
// oturmadığı gerekçesiyle); ikisi de sinyal taşıdığı için Burak'ın
// 2026-09-10 kararıyla vaka olarak yazıldı ve aşağıya alındı. Karşılığı
// olmayan portfolyo sayfası hâlâ yönlendirilmez — konu dışı yönlendirme
// soft-404 sayılır.
```

**Sonra portfolyo bloğunun sonuna iki satır** (sıra önemsiz, ama okunurluk için diğer portfolyo satırlarının hemen ardına):

```ts
  {
    source: "/portfolyo/turkcell-bip-televizyon-reklam-filmi-produksiyonu",
    destination: "/tr/vakalar/turkcell-bip-reklam-filmi",
    permanent: true,
  },
  {
    source: "/portfolyo/luks-kafe-tanitimi-sinematik-marka-promosyonu",
    destination: "/tr/vakalar/caffebo-sinematik-marka-tanitimi",
    permanent: true,
  },
```

Notlar:

- `source` **eğik çizgisiz** yazılır; mevcut satırların tamamı böyle. Eski sitenin indekslediği eğik çizgili biçim (`/x/`) Next'in `trailingSlash` normalizasyonuyla 308 alır ve buradaki kurala düşer, yani zincir `/x/` → 308 `/x` → 308 `/tr/vakalar/<slug>` olur. İki atlamalı bu zincir tüm eski URL'lerde aynı; düzleştirme ayrı bir iş olarak Görev 07'de değerlendiriliyor (Indeks-Denetimi §2 yan bulgusu).
- `/sitemap-eski.xml` bu listeden otomatik türüyor (`legacySitemapPaths()`), ayrı bir ekleme gerekmiyor. Joker taşımayan kaynak sayısı 41'den 43'e çıkar.
- **Sıra kuralı: bu iki satır, `cases.ts` içindeki iki vaka yayına girmeden eklenmez.** Hedef sayfa yoksa yönlendirme 404'e iner.

### 4.2 Yan bulgu — `/portfolyo/*` için catch-all kural yok

Görev tanımında "`/portfolyo/*` kuralı bu ikisini `/tr/portfolyo/*`'a düşürüyor (fallback)" deniyordu. Dosya okundu: **öyle bir kural yok.** `LEGACY_REDIRECTS` içinde `/portfolyo` (tam eşleşme) ve `/portfolyo-kategori/:slug*` var, ama `/portfolyo/:slug*` yok. Eşleşmeyen bir `/portfolyo/<slug>` adresi yönlendirme katmanından hiç geçmiyor, next-intl middleware'ine düşüyor, locale öneki alıp `/tr/portfolyo/<slug>` oluyor ve orada route bulunmadığı için 404 dönüyor. Sonuç aynı, mekanizma farklı.

Strateji Ek A kuralı ("eşleşmeyen tüm `/portfolyo/*` doğrudan `/tr/vakalar` listesine gitmeli") uygulanmak istenirse eklenecek kural — **ama iki tekil vaka satırından SONRA gelmeli**, yoksa onları da yutar:

```ts
  // Eşleşmeyen portfolyo kalemleri liste sayfasına iner (Strateji Ek A).
  // Bu satır tekil portfolyo eşlemelerinin ARDINDAN gelmeli — Next
  // yönlendirmeleri sırayla değerlendirir ve ilk eşleşen kazanır.
  { source: "/portfolyo/:slug*", destination: "/tr/vakalar", permanent: true },
```

**Burak'a soru:** bu catch-all eklensin mi? Eklenirse `/portfolyo/` altındaki her bilinmeyen adres vaka listesine iner. Konu eşleşmesi korunduğu için soft-404 riski düşük (`/portfolyo-kategori/:slug*` için aynı gerekçe zaten kabul edilmiş), ama bu ADR-019'un "taşınmayan portfolyo sayfası 404'te kalır" kararını değiştirir — kapsamı bu görevin dışında, ayrı karar.

### 4.3 `docs/decisions/ADR-019-real-case-studies-migration.md` güncellemesi

Üç dokunuş gerekiyor. Belgenin gövdesindeki tarihli kararlar silinmez; ADR disiplini gereği revizyon bölüm olarak eklenir ve eski cümlelere işaret bırakılır.

**(a) Karar 1'deki cümleye işaret** — mevcut:

```
Turkcell-BIP ve CaffeBO (saf prodüksiyon işleri) yeni siteye **taşınmaz** —
problem-tipi bazlı vaka yapısına oturmuyorlar.
```

olarak değiştirilir:

```
Turkcell-BIP ve CaffeBO (saf prodüksiyon işleri) yeni siteye **taşınmaz** —
problem-tipi bazlı vaka yapısına oturmuyorlar.
*(Bu karar 2026-09-18'de geri alındı; belgenin sonundaki "Revizyon —
2026-09-18" bölümüne bakın.)*
```

**(b) "Sonuçlar" bölümündeki satır** — mevcut:

```
- **7 vakanın tamamı taşındı** (2026-08-21): ... Turkcell-BIP ve CaffeBO taşınmadı (karar 1).
```

sonuna eklenir: `Turkcell BiP ve CaffeBO 2026-09-18'de taşındı (revizyon).`

**(c) Belgenin sonuna yeni bölüm:**

```markdown
---

## Revizyon — 2026-09-18: Turkcell BiP ve CaffeBO vaka olarak geri alındı

> **Durum:** Kabul edildi · **Karar sahibi:** Burak Arda Özgül (karar tarihi 2026-09-10, uygulama 2026-09-18)
> **Revize edilen:** Karar 1 — "Turkcell-BIP ve CaffeBO yeni siteye taşınmaz"
> **Tetikleyen:** `docs/strateji/Indeks-Denetimi-2026-09-18.md` ve GSC 28 günlük veri

### Ne değişti

İki portfolyo sayfası bilinçli olarak 404'te bırakılmıştı. İkisi de vaka
olarak yazıldı ve eski URL'lerinden kalıcı yönlendirme aldı:

| Eski URL                                                        | Yeni vaka (TR)                     | Yeni vaka (EN)                 |
| --------------------------------------------------------------- | ---------------------------------- | ------------------------------ |
| `/portfolyo/turkcell-bip-televizyon-reklam-filmi-produksiyonu/` | `turkcell-bip-reklam-filmi`        | `turkcell-bip-commercial`      |
| `/portfolyo/luks-kafe-tanitimi-sinematik-marka-promosyonu/`     | `caffebo-sinematik-marka-tanitimi` | `caffebo-cinematic-brand-film` |

### Gerekçe

1. **İki URL hâlâ sinyal taşıyor.** 28 günlük GSC verisinde Turkcell sayfası
   17 gösterim / 9,6 ortalama pozisyon, CaffeBO sayfası 24 gösterim / 22,9
   pozisyon ve 1 tık üretiyor. Karar 1 yazıldığında bu veri yoktu; 404'te
   bırakılan adres ölü değil, çalışan bir adresti.
2. **Şema itirazı içerikle çözülüyor, yönlendirmeyle değil.** Karar 1'in
   gerekçesi "problem-tipi yapısına oturmuyorlar"dı. İtiraz konu dışı bir
   yönlendirmeye değil, vakanın yazılmamış olmasına işaret ediyor. İkisi de
   `market_expansion` / `growth` ekseninde yazıldı — OdorGo ve FYR ile aynı
   eksen, ikisi de kreatif prodüksiyonun marka algısını büyütmesi üzerine
   kurulu.
3. **Soft-404 riski kalkıyor.** Yönlendirme artık konu dışı değil: eski
   sayfanın anlattığı işin kendisi hedefte duruyor.

### Korumalar

- Vakalar `CASES` dizisinin **sonuna** eklendi; `relatedCaseForService`
  dizideki ilk eşleşmeyi seçtiği için mevcut hizmet sayfalarının vitrin
  vakası değişmedi (`marka-stratejisi` hâlâ FYR'yi gösteriyor).
- Yönlendirme satırları vaka sayfaları yayına girdikten sonra eklendi;
  hedefsiz 301 yazılmadı.
- Ölçülebilir rakam olmayan vakada `metrics` boş bırakıldı ve bu, Feruza
  vakasındaki gibi SSS'te açıkça söylendi (Karar 8 ve docs/04 §10).
```

### 4.4 `neden-profesyonel-video-sart` yazısına çift yönlü bağlantı

Yazı bugün son paragrafında yalnız liste sayfasına bağlanıyor (`[vaka sayfalarımıza](/vakalar)`). İki vakaya elle bağlantı, "Markanızın geleceğini şansa bırakmayın" (`id: markanizin-gelecegini-sansa-birakmayin`) bölümündeki son paragrafın **önüne** yeni bir `p` bloğu olarak eklenir:

```ts
      {
        type: "p",
        text: {
          tr: "Aynı kararın iki farklı ölçekte nasıl göründüğünü sitede okuyabilirsiniz: [Turkcell BiP reklam filmi](/vakalar/turkcell-bip-reklam-filmi) ulusal yayına çıkan bir kampanyanın prodüksiyonu, [CaffeBO sinematik marka tanıtımı](/vakalar/caffebo-sinematik-marka-tanitimi) ise tek mekanlı bir markanın kendini anlatma biçimi. İkisinde de belirleyici olan kamera değil, kararın kendisiydi.",
          en: "You can read how the same decision looks at two different scales: the [Turkcell BiP commercial](/vakalar/turkcell-bip-reklam-filmi) is the production behind a nationally broadcast campaign, while the [CaffeBO cinematic brand film](/vakalar/caffebo-sinematik-marka-tanitimi) is how a single-venue brand tells its own story. In both, what mattered was not the camera but the decision itself.",
        },
      },
```

Kurallar:

- Bağlantı hedefi **her iki dilde de TR slug** yazılır (`/vakalar/<tr-slug>`). `resolveInlineHref` EN sayfada gerçek EN slug'a çözüyor; mevcut OdorGo, FYR ve GYMWOLVES bağlantıları aynı desende.
- Cümleler bilinçli olarak rakamsız. Metin rakam taşıyacaksa o rakamın vaka gövdesinde de geçmesi gerekir.
- EN metin İngiliz imlasıyla yazılır (`tests/unit/en-spelling.test.ts` yazı bloklarını da tarıyor).
- `updatedAt` ve `updateNote`: yazı daha önce 2026-08-28'de güncellendi. Gövdeye yeni bağlantı eklendiği için `updatedAt: "2026-09-18"` yapılır ve `updateNote`'a bir cümle eklenir — "18 Eylül 2026'da Turkcell BiP ve CaffeBO vakalarına bağlantı eklendi." (ADR-020: güncellenen yazı bunu okura açıkça söyler.)

Ters yön (vakadan yazıya) `serviceSlugs` üzerinden otomatik; ayrıntı §3.5'te.

### 4.5 Beklenen test etkileri

| Test                                                                                           | Etki                                                                                                                                    | Yapılacak                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tests/unit/content-claims.test.ts:113` — "dokuz vaka yayında", `expect(CASES.length).toBe(9)` | **Düşer.**                                                                                                                              | Sayı 11'e çekilir ve test adı güncellenir. Testin kendi yorumu sabitin niye orada durduğunu söylüyor: "sayının değiştiğinde yukarıdaki türetmelerin hâlâ çalıştığını görmek için". Yani sabit bilinçli bir kanca; türetilmiş kaynağa bağlanması testin amacını ortadan kaldırır. Gerekçeli güncelleme doğru hamle: `it("on bir vaka yayında")` + `expect(CASES.length).toBe(11)` ve yoruma "2026-09-18: Turkcell BiP ve CaffeBO eklendi (ADR-019 revizyonu)" satırı. |
| `tests/unit/content-claims.test.ts:48` — `/vakalar` açıklamasının `CASES.length` içermesi      | Geçmeye devam eder; sayfa metni zaten türetiyor.                                                                                        | Yok                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `tests/unit/legacy-sitemap.test.ts` — `expect(list.length).toBeGreaterThan(30)`                | Geçer (41 → 43).                                                                                                                        | İsteğe bağlı: iki yeni URL'i pinleyen bir `it` eklenebilir, "indeks denetimindeki dört eski hizmet URL'i" testiyle aynı desende.                                                                                                                                                                                                                                                                                                                                     |
| `tests/unit/cases-content.test.ts`                                                             | Yeni vakalar §3.1'deki kuralların tamamına uymalı; özellikle **10 soruluk SSS** ve **40 kelimelik cevaplar** en çok emek isteyen kısım. | Kural yok, içerik işi                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `tests/unit/related-articles.test.ts`                                                          | Geçer. "En az bir vaka İlgili yazılar bloğunu doldurur" testi mevcut vakalarla zaten sağlanıyor.                                        | Yok                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `tests/unit/en-spelling.test.ts`                                                               | Yeni EN metin otomatik korpusa giriyor; Amerikan imlası düşürür.                                                                        | İçerik işi                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `tests/unit/case-links.test.tsx`, `sitemap.test.ts`, `seo-*`                                   | Sabit sayı taşımıyor; otomatik kapsar.                                                                                                  | Yok                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `pnpm seo:audit`                                                                               | Yeni iki URL title/description kurallarından geçmeli.                                                                                   | §3.1 sınırlarına uyulursa sorun yok                                                                                                                                                                                                                                                                                                                                                                                                                                  |

---

## 5. Doğrulama planı (içerik girildikten sonra)

Sırayla, hepsi worktree kökünde:

```bash
pnpm install --frozen-lockfile     # yalnız ilk kurulumda
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Ardından yerel sunucuyla yönlendirme ve liste kontrolü:

```bash
pnpm start -p 3123 &

# Eski URL'ler — eğik çizgili biçim, zincirin tamamı izlenir.
curl -sIL http://localhost:3123/portfolyo/turkcell-bip-televizyon-reklam-filmi-produksiyonu/ \
  | grep -E "^HTTP|^location"
curl -sIL http://localhost:3123/portfolyo/luks-kafe-tanitimi-sinematik-marka-promosyonu/ \
  | grep -E "^HTTP|^location"

# Eğik çizgisiz biçim — tek 308 ile hedefe inmeli.
curl -sI http://localhost:3123/portfolyo/turkcell-bip-televizyon-reklam-filmi-produksiyonu \
  | grep -E "^HTTP|^location"
curl -sI http://localhost:3123/portfolyo/luks-kafe-tanitimi-sinematik-marka-promosyonu \
  | grep -E "^HTTP|^location"

# Vaka sayfalarının kendisi 200 dönmeli.
curl -sI http://localhost:3123/tr/vakalar/turkcell-bip-reklam-filmi | head -1
curl -sI http://localhost:3123/tr/vakalar/caffebo-sinematik-marka-tanitimi | head -1
curl -sI http://localhost:3123/en/case-studies/turkcell-bip-commercial | head -1
curl -sI http://localhost:3123/en/case-studies/caffebo-cinematic-brand-film | head -1

# Liste sayfalarında iki vaka görünüyor mu.
curl -s http://localhost:3123/tr/vakalar | grep -c "turkcell-bip-reklam-filmi"
curl -s http://localhost:3123/tr/vakalar | grep -c "caffebo-sinematik-marka-tanitimi"
curl -s http://localhost:3123/en/case-studies | grep -c "turkcell-bip-commercial"
curl -s http://localhost:3123/en/case-studies | grep -c "caffebo-cinematic-brand-film"

# Eski-URL sitemap'i iki adresi de listelemeli (eğik çizgili biçimde).
curl -s http://localhost:3123/sitemap-eski.xml | grep -c "portfolyo/turkcell-bip"
curl -s http://localhost:3123/sitemap-eski.xml | grep -c "portfolyo/luks-kafe"

lsof -ti:3123 | xargs kill
```

Beklenen çıktılar:

- Eğik çizgili istek: `308` → `/portfolyo/<slug>` → `308` → `/tr/vakalar/<yeni-slug>` → `200`.
- Eğik çizgisiz istek: tek `308` → `200`.
- Dört vaka URL'i de `200`.
- Dört `grep -c` çağrısı da en az `1`.
- Sitemap sayaçları `1`.

Deploy sonrası (yalnız Burak, bu görevin kapsamı dışında): `pnpm cf:deploy`, ardından `pnpm seo:indexnow` ve GSC'de iki eski URL için URL Inspection ile "canlı URL'yi test et" → yönlendirmenin görüldüğünün doğrulanması.

---

## 6. Burak'a sorular

1. **Kaynak metin nereden gelecek?** Wayback'te iki sayfanın hiçbir kopyası yok (§1). WordPress yedeği, hosting yedeği veya proje dosyaları olmadan vaka yazılamaz.
2. **`problemType` eşlemesi kabul mü?** İkisi de `market_expansion` / `growth` önerildi (§3.2). Alternatif: `/vakalar` filtresine yeni bir problem tipi açmak — o durumda `types.ts`, i18n etiketleri ve yeni bir ADR gerekir.
3. **Rakam var mı?** Yoksa `metrics: []` ile süreç-çıktı odaklı yazılır ve SSS'te Feruza'daki gibi açıkça söylenir. Varsa kaynağı ve ölçüm penceresi (`context`) ile birlikte gerekli.
4. **Turkcell logosu ve marka adı kullanımı.** `public/musteri_logolari/Turkcell.png` repoda var ama vaka künyesinde kullanmak logo şeridinden farklı bir iddia. İzin durumu ve çalışmanın kapsamı (doğrudan INDOLES işi mi, kurucunun önceki ajans geçmişi mi — docs/15 B4 bulgusu) netleşmeli.
5. **CaffeBO'nun resmi marka yazımı** nedir: "CaffeBO", "Caffe BO", "CAFFEBO"? Künye, başlık ve `seo.title` bu yazıma göre kurulur ve test `seo.title`ın müşteri adıyla başlamasını zorunlu kılıyor.
6. **`/portfolyo/:slug*` catch-all kuralı eklensin mi?** (§4.2) Bu, ADR-019'un "taşınmayan portfolyo sayfası 404'te kalır" kararını değiştirir.
7. **`video-kreatif` konusuna `marka-stratejisi` hizmeti bağlansın mı?** (§3.5) Bağlanırsa vaka-yazı köprüsü iki yönde de otomatik olur.
