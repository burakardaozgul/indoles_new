# Bilgi Mimarisi (Information Architecture)

> **Statü:** Onaylı — routing ve navigasyon kararlarının tek otoritesi.
> **Son revizyon:** 2026-08-19 (ADR-015, ADR-016). Bu revizyon dokümanı **uygulanan koda göre** düzeltti; Nisan sürümü kaldırılmış katmanları (auth alanı, admin paneli, AI chatbot, journal kategorileri, araçlar) hâlâ tarif ediyordu.
> **Upstream:** `01-vision-positioning.md` (persona, pillar yapısı, problem-tipi filtreleme)
> **Downstream:** `04-design-system-principles.md` §8 (sayfa mimarisi), `11-funnel-customer-flows.md` (dinamik akışlar)

---

## 0. Kapsam Dışı Bırakılanlar

Nisan sürümünde tanımlı olan aşağıdaki alanlar **yoktur** ve bu dokümanda tarif edilmez. Gerekçeleri ilgili ADR'lerdedir:

| Kaldırılan | ADR |
|---|---|
| `/app/*` authenticated alan (dashboard, brief geçmişi, profil) | ADR-008 |
| `/admin/*` yönetim paneli | ADR-008 |
| AI chatbot widget'ı ve her sayfadaki floating tetikleyicisi | ADR-007 |
| `/studio` (Sanity embedded editor) | ADR-006 |
| Ödeme/checkout akışı | ADR-009 |
| `/araclar` interaktif teşhis araçları | Launch kapsamı dışı — Faz 2 |
| `/journal/kategori/[slug]` kategori sayfaları | Yazı hacmi kategori taksonomisini haklı çıkarmıyor |
| `/brief/basit`, `/brief/detayli` ayrı sayfaları | Tek iletişim formuna indirgendi (`/iletisim`) |
| `/rezervasyon` sayfası | Entry popup içinde çözülüyor (ADR-013) |
| Site içi arama sayfası | Sayfa sayısı arama gerektirmiyor |

---

## 1. Navigasyon

### Birincil

| Sıra | TR | EN | Hedef |
|---|---|---|---|
| 1 | Hakkımızda | About | `/{locale}/hakkimizda` |
| 2 | Hizmetler | Services | `/{locale}/hizmetler` |
| 3 | Paketler | Packages | `/{locale}/paketler` |
| 4 | Vakalar | Case studies | `/{locale}/vakalar` |
| 5 | Bilgi Kütüphanesi | Knowledge Library | `/{locale}/yazilar` |

Pillar isimleri (Growth, Transform, Build) navigasyonda ayrı madde değildir; `/hizmetler` altında yaşarlar ve her iki dilde de İngilizce kalır — marka terminolojisidir.

**Danışmanlar nav'da değildir** (Burak, 2026-08-19). Kadro `/hakkimizda` ile
birleştirilecek; birleşene kadar `/danismanlar` sayfası ve footer bağlantısı
duruyor, yalnız birincil navigasyondan çıktı.

`/yazilar` route slug'ı değişmedi — değişen yalnız etiket. Etiket `messages/
{tr,en}.json` → `common.nav.articles`'tan gelir ve nav, breadcrumb ile sayfa
eyebrow'u aynı anahtarı okur; üç yerde ayrı metin tutulmaz.

Link seti iki chrome'da da aynıdır: `(marketing)/[locale]/layout.tsx` ve
`(v2)/[locale]/v2/layout.tsx`. Biri değişirse diğeri de değişmelidir.

### Utility

| Öğe | Konum | Davranış |
|---|---|---|
| Dil değiştirici | Nav sağ | Bulunulan sayfanın karşı dildeki karşılığına gider |
| Birincil CTA | Nav sağ, sabit | "Görüşme rezerve et" |
| Siyah bilgi şeridi | Sayfanın en üstü, sabit | Telefon, e-posta, konum, çalışma saati, sosyal |

**Dil değiştirici** artık kök sayfaya değil, bulunulan sayfanın karşılığına
gider (`/tr/hizmetler/veri-altyapisi` → `/en/services/veri-altyapisi`). Segment
çevirisi `src/lib/i18n/locale-href.ts`'te yapılır: yalnız **ilk segment**
`routing.pathnames`'ten map edilir, slug olduğu gibi taşınır — slug'lar tek
kaynaktan gelir ve iki dilde aynıdır. Haritada olmayan route'lar (ör. `/v2`)
çevrilmeden ön ek alır. Davranış `__tests__/locale-href.test.ts` ile kayıtlı.

> **Bilinen sapma (yalnız `(marketing)` chrome'u):** `SiteNav` bağlantıları her
> iki dilde de TR segmentini kullanır (`/en/hizmetler`); `next-intl` middleware
> bunu `/en/services`'e **307** ile yönlendirir. Hedef doğrudur ama her EN
> tıklamasında bir redirect atlaması vardır. v2 chrome'unda bu sorun yoktur —
> `V2Nav` `next-intl`'in `Link`'ini kullanır. Marketing chrome'u v2'ye
> taşındığında sapma kendiliğinden kapanacaktır.

### Mobil

| Chrome | Kırılım | Davranış |
|---|---|---|
| `(marketing)` `SiteNav` | ≤960px | Hamburger → nav pill'in içinde çekmece; cam katman opaklaşır (`.nav-open`) |
| v2 `V2Nav` | ≤1180px | Hamburger → tam ekran çekmece; nav opaklaşır, sayfa kaymaz, `Esc` kapatır |

v2'de kırılım 1180px'tir çünkü beş link + büyük logo + iki aksiyon bu
genişlikten sonra sığmıyor. Çekmece kapalıyken DOM'da kalır ama `inert`'tir:
klavye sırasına ve ekran okuyucuya girmez, geçiş animasyonu korunur.
Dil değiştirici ve CTA çekmecenin altında tekrarlanır.

### Footer

| Kolon | İçerik |
|---|---|
| Hizmetler | Growth, Transform, Build, Tüm hizmetler, Paketler |
| Kurumsal | Hakkımızda, Vakalar, Danışmanlar, İletişim |
| Kaynaklar | Bilgi Kütüphanesi, Gizlilik ve KVKK |
| Marka bloğu | Logo, EVOLVE · BUILD · GROW imzası, tagline, bülten formu |
| Alt şerit | Telif, yasal linkler, LinkedIn |

---

## 2. Sayfa Haritası

```
/{locale}                          Anasayfa (11 bölüm — bkz. §5)
├── /hakkimizda                    Hakkımızda
├── /hizmetler                     Pillar + 12 hizmet listesi
│   └── /hizmetler/[slug]          Pillar detay (growth | transform | build)
│                                  VEYA hizmet detayı (12 hizmet) — ADR-018
├── /paketler                      4 ürünleşmiş paket
│   └── /paketler/[slug]           Paket detay
├── /vakalar                       Vaka çalışmaları (problem tipine göre)
│   └── /vakalar/[slug]            Vaka detay
├── /danismanlar                   Kadro
│   └── /danismanlar/[slug]        Danışman profili
├── /yazilar                       Bilgi Kütüphanesi
│   └── /yazilar/[slug]            Yazı detay
├── /iletisim                      İletişim formu
└── /gizlilik-kvkk                 Gizlilik ve KVKK (EN: /privacy)
```

Teknik route'lar (dil bağımsız): `/sitemap.xml` · `/robots.txt` · `/llms.txt` · `/api/contact` · `/api/visitor-profile` · `/api/health`

### Anasayfa — sürekli sahne

`/{locale}` ADR-016'nın sürekli-sahne kurgusudur: sayfa boyunca hiç unmount
edilmeyen tek bir WebGL blob, 7 duraklı koreografi, iki katmanlı hero metni.
`(v2)` prototip route grubu ADR-017 ile kaldırıldı; `/tr/v2` artık 404'tür.

Bölüm id'leri (`v2-hero` … `v2-outro`) koreografinin çapalarıdır. Biri
değişirse `components/v2/webgl/choreography.ts` de değişmelidir.

Chrome layout seviyesindedir (`V2Chrome`): siyah bilgi şeridi, nav, blob
canvas, cursor ve footer tüm sayfalarda aynı bileşenlerden gelir. Blob iki
modda çalışır — anasayfada koreografili, iç sayfada sessiz eşlikçi (ADR-017).


## 3. URL Yapısı

### 3a. Path-based i18n

| Kural | Değer |
|---|---|
| Format | `/tr/*` ve `/en/*` |
| Varsayılan | `tr` — `/` → `/tr` |
| Prefix | `always` (`localePrefix: "always"`) |
| Segment çevirisi | `routing.pathnames` ile: `/hizmetler` ↔ `/services`, `/paketler` ↔ `/packages`, `/vakalar` ↔ `/case-studies`, `/yazilar` ↔ `/articles`, `/danismanlar` ↔ `/consultants`, `/iletisim` ↔ `/contact`, `/hakkimizda` ↔ `/about` |
| hreflang | Her sayfada tr + en + x-default üçlüsü |

### 3b. Karakter kuralları

ASCII-only, kebab-case, lowercase, maksimum 5 kelime, tarih içermez. Türkçe karakter dönüşümü: `ş→s ğ→g ü→u ö→o ç→c ı→i İ→i`.

### 3c. Trailing slash

Yok. `trailingSlash: false`.

### 3d. Redirect

| Senaryo | Davranış |
|---|---|
| `/` | → `/tr` |
| `/en/hizmetler` | 307 → `/en/services` (middleware) |
| Olmayan locale (`/fr/*`) | 404 |
| Olmayan slug | 404 (`not-found.tsx`) |

---

## 4. Sayfa Tipolojileri

Ortak yapı: `PageHeader` (breadcrumb + eyebrow + display başlık + lede, düşük yoğunluklu dalga zemin) → içerik bölümleri → `ContactCallout`.

| Sayfa | Bölümler | Persona-aware |
|---|---|---|
| `/hizmetler` | Hero, 3 pillar bloğu (her biri: tagline, açıklama, metodoloji, hizmet listesi) | **Evet** (ADR-014) |
| `/hizmetler/[slug]` — pillar | Pillar hero, metodoloji, hizmet listesi (linkli), ilgili paket ve vakalar | Orta ton (ADR-014) |
| `/hizmetler/[slug]` — hizmet | Hero + teşhis föyü, kimin için, kapsam, yöntem, teslim listesi, aylık yönetim planları (opsiyonel `retainerPlans` — Paketler'den ayrı retainer modeli; 2026-08-27, ilk kullanım: performans-pazarlama), SSS, ilgili içerik (ADR-018) | Orta ton, tek versiyon |
| `/paketler` | Hero, 4 paket kartı (isim, pillar, süre, fiyat, outcome) | **Evet** |
| `/paketler/[slug]` | Hero, kapsam, çıktılar, kimin için, SSS, fiyat, CTA | **Evet** |
| `/vakalar` | Hero, problem-tipi filtresi, vaka kartları | Orta ton |
| `/vakalar/[slug]` | Hero, sorun, yaklaşım, sonuç metrikleri, süre, ilgili hizmetler | Orta ton |
| `/danismanlar` | Hero, kadro grid (baş harf portresi + unvan + kısa bio + pillar etiketleri) | Orta ton |
| `/danismanlar/[slug]` | Profil kartı (sticky), alıntı bloğu, biyografi, yazıları, CTA | Orta ton |
| `/yazilar` | Hero, yazı listesi | Orta ton |
| `/yazilar/[slug]` | Başlık, meta, gövde, yazar, ilgili yazılar | Orta ton |
| `/hakkimizda` | Manifesto, kurucu, değerler | Orta ton |
| `/iletisim` | Form (Turnstile korumalı), doğrudan kanallar | Orta ton |
| `/gizlilik-kvkk` | MDX içerik | Orta ton |

Kadro listesinde **Chief Mood Officer profil sayfası almaz** — `BOOKABLE_CONSULTANTS` filtresi `pillars.length > 0` koşuluyla çalışır.

---

## 5. Anasayfa Bölüm Sırası

`docs/04` §8 ile aynı tabloyu paylaşır; otorite orasıdır. Özet:

Hero → Referans marquee → Manifesto → Kadro → Üç pillar → Hizmet track (12) → Metodoloji (INDOLES Frame, 5 aşama) → Vakalar → Sektörler → Vizyon → Kapanış CTA

Persona-aware olanlar: Hero, Üç pillar, Hizmet track, Vakalar, Kapanış CTA.

---

## 6. Breadcrumb

| Sayfa | Format |
|---|---|
| Pillar | INDOLES › Hizmetler › [Pillar] |
| Paket | INDOLES › Paketler › [Paket] |
| Danışman | INDOLES › Danışmanlar › [Ad] |
| Vaka | INDOLES › Vakalar › [Vaka] |
| Yazı | INDOLES › Bilgi Kütüphanesi › [Başlık] |

Vaka breadcrumb'ında problem-tipi ara kırılımı **uygulanmadı** — 4 vaka için ekstra hiyerarşi seviyesi gereksiz. Problem tipi vaka sayfasında etiket olarak görünür. (Nisan sürümündeki 5b kararı bu şekilde sadeleşti.)

---

## 7. Cross-link

| Sayfa | Verdiği linkler |
|---|---|
| Pillar detay | İlgili paketler, ilgili vakalar, CTA |
| Paket detay | İlgili vakalar, ilgili hizmetler, CTA |
| Vaka detay | İlgili hizmetler, ilgili paketler |
| Danışman profil | Yazıları, rezervasyon CTA |
| Yazı detay | İlgili yazılar, yazar profili |
| Sektör hücresi (anasayfa) | `/vakalar` |
| Hizmet kartı (anasayfa) | İlgili pillar sayfası |

İlişkiler `src/lib/content/*.ts` içinde statik referans olarak yönetilir (ADR-006).

---

## 8. Edge State'ler

| Senaryo | Davranış |
|---|---|
| Olmayan slug | `not-found.tsx` — 404, anasayfa ve iletişim CTA'sı |
| Filtre sonucu boş | "Bu kriterlere uygun sonuç yok" + filtre sıfırlama |
| EN çevirisi olmayan içerik | Launch kuralı: TR'siz EN yayınlanmaz, EN'siz TR yayınlanmaz — parite testi (`src/i18n/__tests__/parity.test.ts`) bunu koruyor |
| Popup daha önce tamamlanmış | Cookie'den okunur; "mevcut rezervasyon" ekranı açılır (ADR-013) |
| `prefers-reduced-motion` | Tüm scroll-bağlı mekanizmalar durur, içerik statik görünür |
| Ekran ≤900px | Yatay hizmet track'i ve sticky timeline kapanır, dikey düzene döner |

---

## 9. Teknik Sayfalar

| Dosya | Üretim | Not |
|---|---|---|
| `sitemap.xml` | `src/app/sitemap.ts` | 8 route × 2 dil, hreflang alternates dahil |
| `robots.txt` | `src/app/robots.ts` | Production dışı tüm ortamlarda `disallow: /` |
| `llms.txt` | `src/app/llms.txt/route.ts` | Statik, pillar ve hizmet listesi |

> **Bakım borcu:** `llms.txt` hâlâ `/app/brief/yeni` adresini gösteriyor; bu route ADR-008 ile kaldırıldı. `robots.ts` de artık var olmayan `/app/`, `/admin/`, `/studio/` yollarını disallow ediyor — zararsız ama ölü.

---

## 10. Açık Sorular

- Nav bağlantılarının `next-intl` `Link`'ine geçirilmesi (307 atlamasını kaldırır)
- Vaka listelemesinde problem-tipi filtresinin UI'ı (şu an tüm vakalar listeleniyor)
- Yazı sayısı 15'i geçtiğinde kategori taksonomisi
