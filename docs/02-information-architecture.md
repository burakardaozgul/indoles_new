# Bilgi Mimarisi (Information Architecture)

Bu doküman INDOLES web platformunun sayfa haritasını, URL yapısını, navigasyon hiyerarşisini, sayfa tipolojilerini ve breadcrumb stratejisini tanımlar. Tüm frontend geliştirme, routing ve navigasyon kararları bu dokümandan türer.

**Bağımlılıklar:**
- Upstream: `01-vision-positioning.md` (persona'lar, pillar yapısı, problem-tipi filtreleme kararı)
- Downstream: `04-design-system-principles.md` (sayfa layout'ları), `10-content-model-sanity.md` (Sanity schema'ları), `11-funnel-customer-flows.md` (dinamik müşteri yolculuğu)

**Scope notu:** Bu doküman sayfaların statik yapısını ve ilişkilerini tanımlar. Müşteri yolculuğu dinamik akışları `docs/11-funnel-customer-flows.md`'de ele alınır.

---

## 1. Navigasyon Hiyerarşisi

### Birincil Navigasyon (Header)

| Sıra | Etiket (TR) | Etiket (EN) | Hedef | Not |
|------|-------------|-------------|-------|-----|
| 1 | Growth | Growth | `/tr/growth` | Pillar landing |
| 2 | Transform | Transform | `/tr/transform` | Pillar landing |
| 3 | Build | Build | `/tr/build` | Pillar landing |
| 4 | Paketler | Packages | `/tr/paketler` | Ürünleşmiş paket listeleme |
| 5 | Uzmanlar | Experts | `/tr/uzmanlar` | Danışman vitrini |
| 6 | Vakalar | Cases | `/tr/vakalar` | Vaka çalışmaları |
| 7 | Journal | Journal | `/tr/journal` | İçerik merkezi |
| 8 | Araçlar | Tools | `/tr/araclar` | İnteraktif teşhis araçları |

Pillar isimleri (Growth, Transform, Build) her iki dilde de İngilizce kalır — marka terminolojisidir, çevrilmez.

### Utility Navigasyon

| Öğe | Konum | Davranış |
|-----|-------|----------|
| Dil değiştirici (TR/EN) | Header sağ üst | Toggle, mevcut sayfanın karşı dil versiyonuna yönlendirir |
| CTA butonu | Header sağ üst, sabit | "Görüşme Rezerve Et" / "Book a Meeting" — `/tr/rezervasyon`'a yönlendirir |
| AI chatbot | Floating widget, sağ alt | Tüm public sayfalarda aktif, `/app/*`'da context-aware (kullanıcı profilini bilir), `/admin/*`'da pasif |

### AI Chatbot Yerleşim Kararı

| Karar | Değer |
|-------|-------|
| Form factor | Floating widget (sağ alt köşe, bubble ikon) |
| Ayrı sayfa | Yok — widget-only |
| Public sayfalar | Aktif |
| Auth sayfalar (`/app/*`) | Aktif, context-aware |
| Admin sayfalar (`/admin/*`) | Pasif |
| Araç/teşhis sayfaları | Aktif, araç tamamlandıktan sonra öneri modu |
| Tetikleyici UI | Bubble ikon (tıkla → panel açılır) |

### İkincil Navigasyon (Footer)

| Grup | İçerik |
|------|--------|
| Şirket | Hakkımızda, İletişim |
| Yasal | Gizlilik Politikası, KVKK Aydınlatma, Çerez Politikası, Kullanım Koşulları |
| Sosyal | LinkedIn, Twitter/X, YouTube (varsa) |
| Hızlı erişim | Paketler, Uzmanlar, Vakalar, Journal |

### Mobil Navigasyon

- Hamburger menü (header sağ), tam ekran overlay
- Birincil navigasyon dikey liste olarak açılır
- CTA butonu menü içinde ve menü dışında (sticky bottom bar) sabit
- AI chatbot widget'ı mobilde de aktif, ama sticky bottom bar ile çakışmamalı — chatbot buton'u CTA butonunun soluna yerleşir
- Dil değiştirici menü içinde

---

## 2. Sayfa Haritası (Site Map)

### Public Sayfalar

```
Anasayfa (/)
├── Growth (/growth)
│   ├── Marka Stratejisi ve Pazarlama Danışmanlığı
│   ├── Performans Pazarlama
│   ├── CRO
│   ├── E-Ticaret
│   └── UI/UX Tasarım
├── Transform (/transform)
│   ├── AI Danışmanlığı
│   ├── Dijital Dönüşüm
│   ├── İş Otomasyonları
│   ├── İş Zekası
│   └── İşletme Mühendisliği
├── Build (/build)
│   ├── Özel Yazılım ve Mobil Uygulama
│   └── Teknoloji ve Altyapı Danışmanlığı
├── Paketler (/paketler)
│   └── [Paket Detay] (/paketler/[slug])
├── Uzmanlar (/uzmanlar)
│   └── [Danışman Profil] (/uzmanlar/[slug])
├── Vakalar (/vakalar)
│   └── [Vaka Detay] (/vakalar/[slug])
├── Journal (/journal)
│   ├── [Kategori] (/journal/kategori/[slug])
│   └── [Yazı Detay] (/journal/[slug])
├── Araçlar (/araclar)
│   └── [Araç Detay] (/araclar/[slug])
├── Hakkımızda (/hakkimizda)
├── İletişim (/iletisim)
├── Rezervasyon (/rezervasyon)
├── Brief — Basit (/brief/basit)
└── Brief — Detaylı (/brief/detayli)
```

### Authenticated Sayfalar

```
Dashboard (/app)
├── Briefler (/app/briefler)
├── Rezervasyonlar (/app/rezervasyonlar)
└── Profil (/app/profil)
```

### Admin Sayfalar

```
Admin Dashboard (/admin)
├── Kullanıcılar (/admin/kullanicilar)
├── Briefler (/admin/briefler)
├── Paketler (/admin/paketler)
├── İçerik (/admin/icerik) → Sanity Studio redirect
└── Analitik (/admin/analitik) → PostHog redirect
```

### Teknik Sayfalar

```
/sitemap.xml
/robots.txt
/llms.txt
/tr/gizlilik
/tr/kvkk
/tr/cerezler
/tr/kullanim-kosullari
/404
/500
```

---

## 3. URL Yapısı

### 3a. Path-Based i18n Stratejisi

| Kural | Değer |
|-------|-------|
| Format | `/tr/*` ve `/en/*` |
| Default locale | `/tr` — kök URL (`/`) `/tr`'ye 301 redirect yapar |
| Dil algılama | `Accept-Language` header'ına göre ilk ziyarette öneri, zorlama yok |
| Locale cookie | Kullanıcı seçimi cookie'de saklanır, sonraki ziyaretlerde hatırlanır |
| hreflang | Her sayfada `<link rel="alternate" hreflang="tr">` ve `hreflang="en"` karşılıklı |

### 3b. URL Karakter Kuralları

**Karar: ASCII-only.** URL'lerde Türkçe karakter (ş, ğ, ü, ö, ç, ı, İ) kullanılmaz.

| Gerekçe | Açıklama |
|---------|----------|
| Paylaşım temizliği | Slack, WhatsApp, e-posta'da URL percent-encode'lanmaz, temiz görünür |
| Analytics tutarlılığı | PostHog, Google Analytics'te filtreleme sorunu olmaz |
| SEO etkisi | Google her iki formatı eşit indeksler; ASCII'de dezavantaj yok |
| Endüstri standardı | Stripe, Vercel, Linear, Shopify hepsi ASCII kullanır |

Türkçe karakter dönüşüm kuralları:

| Karakter | ASCII karşılığı |
|----------|-----------------|
| ş | s |
| ğ | g |
| ü | u |
| ö | o |
| ç | c |
| ı | i |
| İ | i |

### 3c. URL Pattern'ları

| Sayfa Tipi | Pattern | Örnek |
|------------|---------|-------|
| Pillar | `/tr/[pillar]` | `/tr/growth` |
| Hizmet | `/tr/[pillar]/[hizmet-slug]` | `/tr/transform/ai-danismanligi` |
| Paket | `/tr/paketler/[paket-slug]` | `/tr/paketler/e-ticaret-buyume-teshisi` |
| Danışman | `/tr/uzmanlar/[ad-soyad]` | `/tr/uzmanlar/burak-ozgul` |
| Vaka | `/tr/vakalar/[vaka-slug]` | `/tr/vakalar/uretim-hatti-otomasyon` |
| Journal yazı | `/tr/journal/[yazi-slug]` | `/tr/journal/ai-sanayi-donusumu-rehberi` |
| Journal kategori | `/tr/journal/kategori/[kategori-slug]` | `/tr/journal/kategori/dijital-donusum` |
| Araç | `/tr/araclar/[arac-slug]` | `/tr/araclar/dijital-olgunluk-testi` |

Slug kuralları:
- Kebab-case, ASCII-only, lowercase
- Maksimum 5 kelime
- Tarih içermez (evergreen URL)
- Slug değiştiğinde eski URL → yeni URL 301 redirect

### 3d. Trailing Slash Politikası

**Karar: Trailing slash yok.** `/tr/growth` canonical, `/tr/growth/` → 301 redirect to `/tr/growth`.

Next.js `trailingSlash: false` config ile uygulanır.

### 3e. Redirect Stratejisi

| Senaryo | Davranış |
|---------|----------|
| `/` (kök) | 301 → `/tr` |
| Trailing slash | 301 → slash'sız versiyon |
| Slug değişikliği | Eski slug → yeni slug 301 (Sanity'de redirect map tutulur) |
| Silinen sayfa | 301 → en yakın parent sayfa veya 410 Gone |
| TR → EN karşılık | hreflang ile belirtilir, otomatik redirect yapılmaz |
| Olmayan dil | `/fr/growth` → 404 |

### 3f. Tüm Route Listesi

**Public Route'lar:**

| TR Route | EN Route | Sayfa |
|----------|----------|-------|
| `/tr` | `/en` | Anasayfa |
| `/tr/growth` | `/en/growth` | Growth pillar |
| `/tr/transform` | `/en/transform` | Transform pillar |
| `/tr/build` | `/en/build` | Build pillar |
| `/tr/growth/[hizmet-slug]` | `/en/growth/[service-slug]` | Hizmet detay |
| `/tr/transform/[hizmet-slug]` | `/en/transform/[service-slug]` | Hizmet detay |
| `/tr/build/[hizmet-slug]` | `/en/build/[service-slug]` | Hizmet detay |
| `/tr/paketler` | `/en/packages` | Paket listeleme |
| `/tr/paketler/[paket-slug]` | `/en/packages/[package-slug]` | Paket detay |
| `/tr/uzmanlar` | `/en/experts` | Danışman listeleme |
| `/tr/uzmanlar/[slug]` | `/en/experts/[slug]` | Danışman profil |
| `/tr/vakalar` | `/en/cases` | Vaka listeleme |
| `/tr/vakalar/[slug]` | `/en/cases/[slug]` | Vaka detay |
| `/tr/journal` | `/en/journal` | Journal ana sayfa |
| `/tr/journal/kategori/[slug]` | `/en/journal/category/[slug]` | Journal kategori |
| `/tr/journal/[slug]` | `/en/journal/[slug]` | Journal yazı |
| `/tr/araclar` | `/en/tools` | Araçlar listeleme |
| `/tr/araclar/[slug]` | `/en/tools/[slug]` | Araç detay |
| `/tr/hakkimizda` | `/en/about` | Hakkımızda |
| `/tr/iletisim` | `/en/contact` | İletişim |
| `/tr/rezervasyon` | `/en/booking` | Rezervasyon |
| `/tr/brief/basit` | `/en/brief/quick` | Basit brief |
| `/tr/brief/detayli` | `/en/brief/detailed` | Detaylı brief |

**Authenticated Route'lar:**

| TR Route | EN Route | Sayfa |
|----------|----------|-------|
| `/tr/app` | `/en/app` | Dashboard |
| `/tr/app/briefler` | `/en/app/briefs` | Brief geçmişi |
| `/tr/app/rezervasyonlar` | `/en/app/bookings` | Rezervasyon geçmişi |
| `/tr/app/profil` | `/en/app/profile` | Profil yönetimi |

**Admin Route'lar:**

| TR Route | EN Route | Sayfa |
|----------|----------|-------|
| `/tr/admin` | `/en/admin` | Admin dashboard |
| `/tr/admin/kullanicilar` | `/en/admin/users` | Kullanıcı yönetimi |
| `/tr/admin/briefler` | `/en/admin/briefs` | Brief yönetimi |
| `/tr/admin/paketler` | `/en/admin/packages` | Paket yönetimi |
| `/tr/admin/icerik` | `/en/admin/content` | Sanity Studio redirect |
| `/tr/admin/analitik` | `/en/admin/analytics` | PostHog redirect |

**Teknik Route'lar (dil-bağımsız):**

| Route | Sayfa |
|-------|-------|
| `/sitemap.xml` | XML sitemap |
| `/robots.txt` | Robots |
| `/llms.txt` | LLM-friendly site tanıtımı |

**Yasal Sayfalar:**

| TR Route | EN Route | Sayfa |
|----------|----------|-------|
| `/tr/gizlilik` | `/en/privacy` | Gizlilik politikası |
| `/tr/kvkk` | `/en/data-protection` | KVKK aydınlatma |
| `/tr/cerezler` | `/en/cookies` | Çerez politikası |
| `/tr/kullanim-kosullari` | `/en/terms` | Kullanım koşulları |

---

## 4. Sayfa Tipolojileri ve İç Yapıları

### 4a. Homepage

Persona switch'li, adaptif anasayfa. Ziyaretçi kendini "Sanayi" veya "Ticaret" olarak etiketler; sonraki bölümlerde öne çıkan içerik buna göre değişir.

**Section sırası:**

| Sıra | Section | İçerik | Persona-adaptif mi? |
|------|---------|--------|---------------------|
| 1 | Hero + Persona Switch | Üst-çatı mesaj + iki eksen seçimi (Sanayi / Ticaret) | Hayır — nötr açılış |
| 2 | Referans Logoları | Müşteri/iş ortağı logoları bandı | Evet — persona'ya uygun logolar öne çıkar |
| 3 | Video Section | Tanıtım/manifesto videosu | Hayır — tek video, ortak |
| 4 | Positioning Statement | Kanonik positioning cümlesi (bkz. `01-vision-positioning.md` 3d) | Hayır — ortak |
| 5 | Üç Pillar Önizleme | Growth, Transform, Build kartları — kısa açıklama + CTA | Evet — persona'nın ilgili pillar'ları vurgulanır |
| 6 | Öne Çıkan Paketler | 2-3 paket kartı — isim, kısa açıklama, fiyat, CTA | Evet — persona'ya uygun paketler |
| 7 | Hızlı Rezervasyon Takvim | Cal.com embed — hızlı görüşme rezervasyonu | Hayır — ortak |
| 8 | Testimonial | Müşteri yorumları carousel | Evet — persona'ya uygun testimonial'lar öne çıkar |
| 9 | Vaka Çalışmaları | 3-4 vaka kartı — problem tipi, sonuç metrikleri | Evet — persona'ya uygun vakalar |
| 10 | CTA Bandı | "Görüşme Rezerve Et" + alternatif CTA (brief, araç) | Hayır — ortak |
| 11 | Footer | Standart footer | Hayır — ortak |

### 4b. Pillar Landing Page (Growth / Transform / Build)

Üç pillar için ortak şablon, pillar-specific içerikle doldurulur.

| Section | İçerik |
|---------|--------|
| Hero | Pillar adı, tek-paragraf açıklama, pillar'a ait görsel/illüstrasyon |
| Hizmet listesi | Pillar'a ait hizmetlerin kart grid'i — her kart: isim, tek-cümle açıklama, CTA |
| İlgili paketler | Bu pillar'la ilişkili paketler (2-3 kart) |
| İlgili vakalar | Bu pillar'a ait vaka çalışmaları (3-4 kart, problem-tipi badge'li) |
| İlgili danışmanlar | Bu pillar'da uzman danışmanlar (avatar + isim + uzmanlık) |
| CTA bandı | "Görüşme Rezerve Et" |

### 4c. Hizmet Detay Sayfası

12 hizmet için ortak şablon.

| Section | İçerik |
|---------|--------|
| Hero | Hizmet adı, pillar badge, tek-paragraf özet |
| Problem tanımı | Bu hizmetin çözdüğü problem — persona diline uygun |
| Yaklaşım | INDOLES'in bu alandaki yaklaşımı (3-5 adımlı süreç) |
| Beklenen sonuçlar | Somut, ölçülebilir çıktılar listesi |
| İlgili paketler | Bu hizmeti içeren paketler |
| İlgili vakalar | Bu hizmetle ilgili vaka çalışmaları |
| CTA bandı | "Görüşme Rezerve Et" + "Basit Brief Gönder" |

### 4d. Paket Listeleme Sayfası

| Section | İçerik |
|---------|--------|
| Başlık | "Paketler" + kısa açıklama (ürünleşmiş paketlerin ne olduğu) |
| Filtreler | Pillar (Growth / Transform / Build / Hepsi), fiyat aralığı, süre |
| Paket grid | Kart formatında: paket adı, pillar badge, tek-cümle açıklama, fiyat, süre, CTA |
| Karşılaştırma | Seçilen 2-3 paketi yan yana karşılaştırma (opsiyonel, Faz 2) |

### 4e. Paket Detay Sayfası

| Section | İçerik |
|---------|--------|
| Hero | Paket adı, pillar badge, fiyat, süre |
| Kapsam | Ne dahil, ne dahil değil — checklist formatında |
| Süreç | Adım adım nasıl ilerler (timeline/akış diyagramı) |
| Beklenen çıktılar | Deliverable listesi |
| Fiyat ve satın alma | Sabit fiyat açıkça yazılır + "Satın Al" / "Görüşme Rezerve Et" CTA |
| SSS | Pakete özel sık sorulan sorular |
| İlgili vakalar | Bu paketle ilişkili vaka çalışmaları |

### 4f. Danışman Listeleme Sayfası

| Section | İçerik |
|---------|--------|
| Başlık | "Uzmanlarımız" + kısa açıklama |
| Filtreler | Pillar, uzmanlık alanı |
| Danışman grid | Kart formatında: fotoğraf, isim, unvan, uzmanlık etiketleri, saat ücreti, müsaitlik durumu |

### 4g. Danışman Profil Sayfası

| Section | İçerik |
|---------|--------|
| Profil hero | Fotoğraf, isim, unvan, uzmanlık alanları (etiketler), pillar eşleşmesi |
| Bio | 2-3 paragraf kısa özgeçmiş |
| Uzmanlık detay | Hizmet alanları, sektör deneyimi, araçlar/teknolojiler |
| Saat ücreti | Açıkça belirtilir |
| Müsaitlik takvimi | Cal.com embed — doğrudan bu danışmanla görüşme rezervasyonu |
| İlgili vakalar | Bu danışmanın dahil olduğu vaka çalışmaları |
| LinkedIn | Profil linki |

### 4h. Journal

**Ana sayfa:**

| Section | İçerik |
|---------|--------|
| Öne çıkan yazı | Hero formatında, en güncel veya editör seçimi |
| Kategori navigasyonu | Yatay etiket çubuğu |
| Yazı grid | Kart formatında: başlık, kategori, tarih, özet, okuma süresi |
| Pagination | Sayfa bazlı veya infinite scroll (Faz 1'de sayfa bazlı) |

**Kategori sayfası:** Ana sayfa ile aynı layout, filtrelenmiş.

**Yazı detay:**

| Section | İçerik |
|---------|--------|
| Başlık alanı | Başlık, yazar, tarih, okuma süresi, kategori |
| İçerik | Markdown/Portable Text — zengin metin, görsel, kod bloğu, callout destekli |
| Yazar kartı | Mini profil — fotoğraf, isim, bio özeti |
| İlgili yazılar | 3 adet öneri |
| CTA | "Görüşme Rezerve Et" veya ilgili paket önerisi |

### 4i. Vaka Çalışmaları

**Listeleme:**

| Section | İçerik |
|---------|--------|
| Başlık | "Vaka Çalışmaları" + açıklama |
| Filtreler | Problem tipi (verim kaybı, maliyet optimizasyonu, pazara açılma, dijital dönüşüm, müşteri edinimi), pillar etiketleri |
| Vaka grid | Kart formatında: vaka başlığı, problem-tipi badge, pillar badge'ler, temel metrik (ör. "%40 maliyet düşüşü"), sektör |

**Vaka detay:**

| Section | İçerik |
|---------|--------|
| Hero | Vaka başlığı, müşteri (anonim veya izinli), problem-tipi badge, pillar badge'ler |
| Sorun | Müşterinin başlangıç durumu |
| Yaklaşım | INDOLES'in uyguladığı strateji ve süreç |
| Sonuçlar | Öncesi/sonrası metrik tablosu |
| Müşteri yorumu | Alıntı (varsa) |
| Zaman çizelgesi | Projenin süresi ve aşamaları |
| İlgili hizmetler | Bu vakada kullanılan hizmetler |
| İlgili paketler | Bu vaka ile benzer kapsamdaki paketler |

### 4j. Araçlar (İnteraktif Teşhis)

**Listeleme:**

| Section | İçerik |
|---------|--------|
| Başlık | "Araçlar" + açıklama (ücretsiz, düşük taahhütlü teşhis araçları) |
| Araç grid | Kart formatında: araç adı, açıklama, tahmini süre, "Başla" CTA |

**Araç detay:**

| Section | İçerik |
|---------|--------|
| Giriş | Aracın ne yaptığı, ne kadar sürdüğü, ne tür bir sonuç üreteceği |
| Araç UI | İnteraktif form/wizard (araç tipine göre değişir) |
| Sonuç | Skor, benchmark kıyaslama, öneriler |
| CTA | "Sonuçlarınızı bir uzmanla değerlendirin" → rezervasyon veya brief |

### 4k. Hakkımızda ve İletişim

**Hakkımızda:**

| Section | İçerik |
|---------|--------|
| Manifesto | `01-vision-positioning.md` 1c'den türetilmiş about versiyonu |
| Takım | Kurucu profili + ekip (ekip büyüdükçe güncellenir) |
| Değerler | 3-5 değer maddesi |
| Rakamlar | Metrik bandı (proje sayısı, müşteri sayısı vb.) |

**İletişim:**

| Section | İçerik |
|---------|--------|
| İletişim formu | Ad, e-posta, konu, mesaj |
| Doğrudan kanallar | E-posta, telefon, LinkedIn |
| Adres | Ofis adresi (varsa) |
| Harita | Google Maps embed (varsa) |

### 4l. Arama Sonuç Sayfası

| Section | İçerik |
|---------|--------|
| Arama çubuğu | Arama terimi, filtreler (sayfa tipi: hizmet, paket, vaka, journal) |
| Sonuçlar | Kart listesi — başlık, sayfa tipi badge, özet, URL |
| Boş state | "Sonuç bulunamadı" + öneriler (popüler sayfalar, chatbot yönlendirme) |

---

## 5. Navigasyon ve Breadcrumb Stratejisi

### 5a. Breadcrumb Format Kuralları

Her sayfa tipinin breadcrumb formatı:

| Sayfa Tipi | Breadcrumb Formatı |
|------------|-------------------|
| Pillar | Anasayfa > [Pillar] |
| Hizmet | Anasayfa > [Pillar] > [Hizmet] |
| Paket | Anasayfa > Paketler > [Paket] |
| Danışman | Anasayfa > Uzmanlar > [Danışman] |
| Vaka | Anasayfa > Vakalar > [Problem Tipi] > [Vaka] |
| Journal yazı | Anasayfa > Journal > [Kategori] > [Yazı] |
| Araç | Anasayfa > Araçlar > [Araç] |
| Brief | Anasayfa > Brief > [Basit/Detaylı] |

### 5b. Multi-Pillar İçerikler İçin Breadcrumb Kararı

**Karar: Problem-tipi bazlı breadcrumb.**

Bir vaka çalışması birden fazla pillar'a dokunabilir (örn. bir AI dönüşüm projesi hem Transform hem Build). Breadcrumb'da pillar hiyerarşisi yerine problem-tipi hiyerarşisi kullanılır.

Gerekçe: `01-vision-positioning.md`'de "sektör değil, problem-tipi bazlı filtreleme" kararı alındı. Breadcrumb bu kararla tutarlı olmalıdır.

Örnek: `Anasayfa > Vakalar > Dijital Dönüşüm > [Üretim Hattı Otomasyon Vakası]`

Pillar ilişkisi vaka sayfası içinde badge/etiket olarak gösterilir, breadcrumb'da yer almaz.

### 5c. Problem Tipleri (Breadcrumb ve Filtreleme İçin)

`01-vision-positioning.md`'den alınan kanonik liste:

| Problem Tipi (TR) | Problem Tipi (EN) | Slug |
|--------------------|--------------------|------|
| Verim Kaybı | Efficiency Loss | verim-kaybi |
| Maliyet Optimizasyonu | Cost Optimization | maliyet-optimizasyonu |
| Pazara Açılma | Market Entry | pazara-acilma |
| Dijital Dönüşüm | Digital Transformation | dijital-donusum |
| Müşteri Edinimi | Customer Acquisition | musteri-edinimi |

### 5d. Cross-Link Stratejisi

Her sayfa tipinin hangi diğer sayfa tiplerine link verdiği:

| Sayfa Tipi | Linkler |
|------------|---------|
| Hizmet detay | İlgili paketler, ilgili vakalar, CTA |
| Paket detay | İlgili vakalar, ilgili hizmetler, CTA |
| Vaka detay | İlgili hizmetler, ilgili paketler, ilgili danışmanlar |
| Danışman profil | İlgili vakalar, rezervasyon CTA |
| Journal yazı | İlgili yazılar, ilgili hizmet/paket, CTA |
| Araç sonuç | İlgili paket önerisi, rezervasyon CTA |

Cross-link'ler Sanity'de ilişkisel referans olarak yönetilir (detay `10-content-model-sanity.md`'de).

### 5e. Sticky Navigation Davranışı

| Davranış | Açıklama |
|----------|----------|
| Header | Scroll-aware: aşağı scroll'da gizlenir, yukarı scroll'da gösterilir (auto-hide) |
| CTA butonu | Header ile birlikte hareket eder, her zaman erişilebilir |
| TOC (uzun sayfalar) | Journal yazılarında ve hizmet detay sayfalarında sol kenarda sticky table of contents (desktop), mobilde yok |
| Back-to-top | Uzun sayfalarda sağ alt köşede (chatbot widget'ın üstünde) |

---

## 6. Entry Point ve Navigasyon Patterns

**Scope notu:** Bu bölüm sayfaların statik ilişkilerini tanımlar; müşteri yolculuğu dinamik akışları `docs/11-funnel-customer-flows.md`'de ele alınır.

### Persona Bazlı Giriş Sayfaları

`01-vision-positioning.md`'deki persona tablolarından alınmıştır:

| Persona | En Olası Giriş | İlk Tıklama (Homepage'den) |
|---------|----------------|-----------------------------|
| 1A — Geleneksel Sanayici | Referans (doğrudan link), homepage | Hakkımızda veya Uzmanlar |
| 1B — Modern Sanayi Yöneticisi | Google organik, LinkedIn, homepage | Vakalar veya Transform |
| 2 — Ticaret/Perakende | Google organik, LinkedIn, homepage | Paketler veya Growth |
| 3 — Yerli Scale-up | Referans, Twitter/X, homepage | Paketler veya Hakkımızda |

### Persona Switch Sonrası Adaptif İçerik

Homepage'de persona switch seçildikten sonra:

| Section | Sanayi Seçimi | Ticaret Seçimi |
|---------|---------------|----------------|
| Referans logoları | Sanayi müşteri logoları öne çıkar | E-ticaret/perakende marka logoları öne çıkar |
| Pillar vurgusu | Transform ve Build öne çıkar | Growth öne çıkar |
| Öne çıkan paketler | Dönüşüm/verimlilik odaklı paketler | Büyüme/performans odaklı paketler |
| Testimonial | Sanayici CEO/CDO yorumları | E-ticaret founder/CMO yorumları |
| Vaka çalışmaları | Verim kaybı, dijital dönüşüm vakaları | Müşteri edinimi, pazara açılma vakaları |

Persona seçimi cookie'de saklanır; sonraki ziyaretlerde hatırlanır. İstediği zaman değiştirebilir.

---

## 7. Authenticated Alan (`/app/*`)

Kullanıcı hesabı gerektiren sayfalar. Auth: Clerk. Detaylı rol ve permission tanımları `09-auth-roles-permissions.md`'de.

| Sayfa | İçerik | Erişim |
|-------|--------|--------|
| Dashboard | Aktif brief'ler, yaklaşan rezervasyonlar, önerilen paketler | `user` ve üstü |
| Briefler | Gönderilmiş brief'lerin listesi ve durumları (basit/detaylı) | `user` ve üstü |
| Rezervasyonlar | Geçmiş ve gelecek görüşme rezervasyonları | `user` ve üstü |
| Profil | Ad, e-posta, şifre, bildirim tercihleri | `user` ve üstü |

---

## 8. Admin Alan (`/admin/*`)

Role-gated admin sayfaları. Detaylı permission matrix `09-auth-roles-permissions.md`'de tanımlanır.

| Sayfa | İçerik | Erişim |
|-------|--------|--------|
| Dashboard | Genel metrikler, bekleyen brief'ler, günlük rezervasyonlar | `admin` |
| Kullanıcılar | Kullanıcı listesi, rol atama, hesap durumu | `admin` |
| Briefler | Tüm brief'lerin yönetimi, atama, durum güncelleme | `admin` + `expert` (kendi atananları) |
| Paketler | Paket oluşturma/düzenleme/yayınlama (Sanity ile senkron) | `admin` |
| İçerik | Sanity Studio'ya redirect — CMS içerik yönetimi | `admin` |
| Analitik | PostHog dashboard'una redirect — analytics görüntüleme | `admin` |

---

## 9. Teknik Sayfalar

### 9a. SEO ve Makine-Okunabilir Dosyalar

| Dosya | Amaç | Detay |
|-------|------|-------|
| `sitemap.xml` | Tüm public sayfaların arama motorları için haritası | Otomatik üretilir, her iki dil dahil, lastmod bilgisi |
| `robots.txt` | Crawler erişim kuralları | `/app/*` ve `/admin/*` disallow, geri kalan allow |
| `llms.txt` | LLM'ler için site tanıtımı | INDOLES'in ne yaptığı, hizmetler, iletişim — düz metin |

Detaylı SEO stratejisi `08-seo-i18n-strategy.md`'de.

### 9b. Hata ve Yasal Sayfalar

**Hata sayfaları:**

| Sayfa | İçerik |
|-------|--------|
| 404 | Sayfa bulunamadı — arama önerisi, popüler sayfalar, anasayfa linki |
| 500 | Sunucu hatası — "Kısa süre içinde düzelecek" mesajı, iletişim bilgisi |

**Yasal sayfalar:**

| Sayfa | İçerik |
|-------|--------|
| Gizlilik Politikası | Kişisel veri işleme politikası |
| KVKK Aydınlatma | 6698 sayılı kanun kapsamında aydınlatma metni |
| Çerez Politikası | Kullanılan çerez türleri, yönetim seçenekleri |
| Kullanım Koşulları | Platform kullanım şartları |

### 9c. Edge State'ler ve Fallback Davranışları

| Senaryo | Davranış |
|---------|----------|
| Arama sonucu boş | "Sonuç bulunamadı" + popüler sayfa önerileri + chatbot yönlendirmesi |
| Filtrelenmiş sonuç boş | "Bu kriterlere uygun sonuç yok" + filtre sıfırlama butonu + yakın sonuçlar |
| Danışman müsait değil | Takvimde boş slot yok mesajı + alternatif danışman önerisi + "Bildirim al" seçeneği |
| Paket satışı geçici kapalı | "Bu paket şu an satışta değil" + benzer paket önerisi + iletişim CTA |
| Dil olmayan içerik fallback | TR var ama EN çevirisi yok: EN sayfasında "Bu içerik henüz İngilizce'ye çevrilmedi" uyarısı + TR versiyona link |
| Soft-404 | Slug değişmiş ama redirect tanımlanmamış: 404 sayfası + "Bunu mu arıyordunuz?" önerileri |
| Hard-404 | Hiç var olmamış URL: standart 404 sayfası |
| Maintenance mode | Tüm site için: özel maintenance sayfası — tahmini süre, iletişim bilgisi |

---

## 10. Açık Sorular

- **Site içi arama implementasyonu:** Faz 1'de basit Sanity-tabanlı arama mı, yoksa Algolia/Meilisearch gibi dedicated arama servisi mi?
- **Journal kategori taksonomisi:** Hangi kategoriler olacak? Pillar bazlı mı, konu bazlı mı, hibrit mi?
- **Araç listesi:** İlk launch'ta hangi interaktif teşhis araçları olacak? (ör. dijital olgunluk testi, CRO audit, AI hazırlık skoru)
- **Homepage video:** Manifesto videosu mu, müşteri testimonial derlemesi mi, ürün tanıtım mı?
- **Karşılaştırma özelliği (paketler):** Faz 1'de var mı yok mu?
- **Danışman filtreleme:** Faz 1'de müsaitlik durumuna göre filtreleme olacak mı?
- **Persona seçimi persistance:** Cookie yeterli mi, yoksa auth'lu kullanıcılar için DB'de mi saklanacak?
