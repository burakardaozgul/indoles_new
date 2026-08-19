# ADR-016 — v2: Kalıcı WebGL blob'lu anasayfa, yeni tasarım yönü

**Statü:** Accepted — yön onaylandı, migrasyon bekliyor
**Tarih:** 2026-08-19
**Karar veren:** Burak Arda Özgül (Kurucu / Marka Stratejisti ve Kreatif Direktör)
**Kaynak spec:** Burak tarafından yazılan 12 bölümlük etkileşim spesifikasyonu (itsoffbrand.com referanslı)
**İlişki:** `ADR-015-design-system-v2.md` (token katmanı korunur), `ADR-014-full-persona-adaptivity.md` (persona korunur)
**Etkilenen dosyalar:** `src/app/(v2)/**`, `src/components/v2/**`, `src/lib/v2/**`, `src/styles/v2.css`, `docs/02`, `docs/04`, `CLAUDE.md`, `README.md`

---

## Bağlam

ADR-015 ile design system v2'ye (Lexend + teal/gold + çok katmanlı elevation) geçildi ve anasayfa 11 bölüm olarak yeniden kuruldu. O anasayfa statik-editorial bir dildi: bölümler birbirini takip eden bağımsız bloklardı, sayfa boyunca süreklilik taşıyan bir görsel öğe yoktu.

Burak, itsoffbrand.com'un etkileşim mimarisini birebir tarif eden bir spesifikasyon yazdı. Spec'in merkezindeki iddia şu: sayfa boyunca **asla unmount edilmeyen tek bir fixed WebGL canvas**, bölümler arasında koreografiye bağlı hareket eden bir blob, ve hero'da metnin iki katmana bölünüp blobun arasından geçirilmesi.

Bu, bölüm-bölüm kurgulanmış bir sayfadan **tek bir sürekli sahne**ye geçiş demek — mimari bir karar, kozmetik bir tercih değil.

Karar verilmezse: iki anasayfa (`/tr` ve `/tr/v2`) paralel yaşamaya devam eder, hangisinin canlıya çıkacağı belirsiz kalır, iki ayrı chrome ve iki ayrı motion katmanı bakım yükü üretir.

## Değerlendirilen seçenekler

### A) Mevcut v2 anasayfasında kal (11 bölüm, statik-editorial) — reddedildi
- **Artı:** Zaten çalışıyor, ek bağımlılık yok, en hafif sayfa.
- **Eksi:** Bölümler arasında görsel süreklilik yok; "ajans vitrini" değil "kurumsal broşür" okuyor. Teknoloji vaadi tipografiyle taşınıyor ama deneyimle desteklenmiyor.

### B) Spec'i ayrı route'ta prototiple, karar sonra (seçilen yol) — uygulandı
- `/tr/v2` ve `/en/v2` üzerinde tam uygulama, `noindex`.
- Mevcut anasayfa dokunulmadan kaldı; iki yön yan yana değerlendirildi.
- **Sonuç:** Yön onaylandı (2026-08-19). Bu ADR o onayı kayda geçirir.

### C) Doğrudan `/tr`'yi değiştir — reddedildi
- Geri dönüş commit revert'ü gerektirirdi; iki yönü aynı anda görme imkânı olmazdı.

## Karar

**v2 (blob) tasarımı INDOLES'in yeni anasayfa yönüdür.** Geliştirme bu tasarım üzerinden devam eder.

`/tr/v2` şu an prototip route'udur ve `noindex`'tir. **Canlı anasayfaya terfi ayrı bir adımdır ve Burak'ın sinyalini bekler** (bkz. §Migrasyon).

### Kabul edilen mimari

| Katman | Karar |
|---|---|
| Render | Sayfa boyunca tek `position: fixed` WebGL canvas, hiç unmount edilmez |
| Katman sırası | z-0 arka metin · z-10 canvas · z-20 içerik · z-50 cursor |
| 3D | Three.js + @react-three/fiber, custom GLSL (hazır materyal yok) |
| Smooth scroll | Lenis, `gsap.ticker` ile senkron |
| Scroll animasyon | GSAP + ScrollTrigger, Lenis scroll olayına bağlı |
| Koreografi | 7 keyframe, segment başına ScrollTrigger, fonksiyon start/end |
| Cursor | Gecikmeli takip eden nokta; `pointer: fine` dışında hiç mount edilmez |
| Tipografi | ADR-015'ten devralındı — Lexend / Inter / JetBrains Mono |
| Palet | ADR-015'ten devralındı — teal + tek gold accent |
| Persona | ADR-014 korunur — pillar ve hizmet copy'si cookie'ye göre değişir |

### Blob paleti — tek accent disiplini korunuyor

Spec beş renkli bir gradyan ve üç farklı hero accent'i istiyordu (referansta lacivert/yeşil/turuncu). Bunun yerine palet **teal + gold'dan türetildi**: `teal-700 → teal-500 → teal-300 → gold-400 → beyaz`, shader içinde %50 beyaza lift'lenerek. ADR-015'in tek accent kuralı bozulmadı; sedefli his lift ve iki lobelı specular'dan geliyor.

---

## Spec'ten bilinçli sapmalar

Spec "sapma kabul edilmez" diyordu. Aşağıdaki dört sapma, spec'in **kendi teslim kriterlerini** karşılayabilmek için zorunlu oldu; her biri kodda gerekçesiyle birlikte yorumlanmıştır.

### 1. Hero metin katmanlarının sırası ters çevrildi

**Spec §2:** renkli kopya z-0 (canvas ALTINDA), siyah kopya z-20 (ÜSTÜNDE).

**Sorun:** Opak bir blob'la bu sıralama görünür etki üretmiyor. Blob renkli katmanı tamamen kapatıyor, siyah katman ise blobun üstünde kaldığı için hiçbir harf renklenmiyor — iki katman da kayboluyor.

**Uygulanan:** siyah kopya z-0 (blobun arkasında, TÜM harfler), accent kopyası z-20 (blobun önünde, YALNIZ vurgu harfleri; diğerleri `visibility: hidden` ile saklanır, kaldırılmaz — piksel hizası harf genişliklerine bağlı).

Spec'in teslim kriteri #3 ("top metnin üzerinden geçerken arkadaki renkli harfler görünüyor mu") ancak bu düzenle sağlanıyor.

### 2. Koreografi tek timeline yerine segment başına ScrollTrigger

**Spec §2.1:** "tüm sayfayı kapsayan tek timeline".

İki deneme bırakıldı:
1. Keyframe başına `start: "top bottom"` / `end: "bottom center"` — aralıklar üst üste biniyor, sonraki tween öncekini eziyor, blob bazı hedeflere (özellikle `work`) hiç ulaşmıyordu.
2. Tek timeline + sayfa yüksekliğine normalize konumlar — konumlar mount anındaki yüksekliğe göre hesaplandığı için sayfa sonradan uzayınca (bölüm eklenmesi, görsel yüklenmesi) son segment sayfa bitmeden tamamlanıyor, blob kalan scroll boyunca duruyordu.

**Uygulanan:** her segment kendi ScrollTrigger'ını taşır, `start`/`end` **fonksiyon** olarak verilir (`() => segmentRanges()[i].start`). Fonksiyonlar her `refresh`'te yeniden değerlendiği için bölüm eklemek veya görsel yüklenmesi aralıkları kendiliğinden günceller.

Ek koruma: son bölüm sayfanın en altındaysa çapası `maxScroll`'un ötesine düşebiliyor (827px'lik outro, 829px'lik viewport'ta tam olarak bunu yapıyordu). Son segmentin başlangıcı `maxScroll − 0.6×viewport`'a çekilir, ama bir önceki çapanın gerisine düşmez.

### 3. Shader'lar `.glsl` yerine `.glsl.ts`

Turbopack'te `.glsl` loader'ı dev ve prod derleyicilerinde ayrı yapılandırma istiyor. Dosya ayrımı ve include mantığı spec'teki gibi korundu (`noise` / `blob.vert` / `blob.frag`), yalnız uzantı farklı — shader'lar template string olarak dışa aktarılıyor.

### 4. Geometri detayı 96 → 32, koreografi `noiseAmp` değerleri yarıya

**Spec §3.1:** `IcosahedronGeometry(1, 96)`. **Spec §2.1 tablosu:** `noiseAmp` 0.15–0.35.

Detail 96, 188.180 üçgen / 564.540 vertex üretiyor. Normal yeniden hesabı deformasyon fonksiyonunu vertex başına ÜÇ kez çağırdığı için (nokta + iki komşu) frame başına **~5 milyon simplex noise** çıkıyordu — 60fps'te saniyede 305 milyon. Hero'da gözle görülür takılma bundandı.

Uygulanan: detail **32** (8.6× ucuz), vertex yolunda FBM 3 → **2 oktav**, fragment'teki renk lekesi noise'u **vertex varying**'e taşındı (DPR 2'de saniyede 5,2 milyon fragment çağrısı sıfırlandı), DPR tavanı 2 → **1.75**. Toplam **11,1× ucuz**; ölçülen fps 61 → 105.

`noiseAmp` değerleri de yarıya indirildi: spec tablosundaki aralık silüeti "yumru" gösteriyordu. Sıvı his bunun yerine **yüzey gerilimi salınımından** geliyor (aşağıda).

---

## Spec'e eklenenler

### Yüzey gerilimi salınımı (`wobbleAmp`)

Spec'in vertex shader'ı FBM noise + mouse çukurundan ibaretti. Bu haliyle blob "ağır kütle" gibi okunuyordu; referanstaki his sıfır yerçekimindeki su damlası.

Eklenen: düşük dereceli küresel harmonikler (l=2 ve l=3), birbirine oransız hızlarda (0.9 / 1.27 / 0.71 / 1.53 rad·s⁻¹). Gövde bir eksende yassılırken diğerinde uzuyor — gerçek damlaların yüzey gerilimi modları. Yüzeye yumru eklemez, silüeti bütün olarak esnetir.

Beraberinde: `timeScale` 0.15 → 0.5 (0.15'te yüzey donmuş görünüyordu), normalin küresel normale %30 harmanlanması (cam gövde), çok yavaş gövde sürüklenmesi (parlamalar yüzeyde gezinsin).

### Fragment: iç renk lekeleri ve iki lobelı specular

Spec §3.3 tek geniş specular tarif ediyordu. Referanstaki "sedefli bulut" hissi için eklendi: `vPosLocal` tabanlı düşük frekanslı renk lekesi alanı (vertex'te örneklenip interpolasyona bırakılıyor) + iki lobelı specular (yayılım pow 5 + sıkı pow 42 + dolgu ışığı pow 12).

### Mobil davranışı

Spec §10 mobil için yalnız "custom cursor kapalı, harf saçılması kapalı, tek kolon" diyordu. Uygulamada üç ek karar gerekti:

| Sorun | Karar |
|---|---|
| Ölçek viewport **yüksekliğine** göre; portrede blob 390px ekranda 549px çapa ulaşıp başlığın siyah katmanını tamamen örtüyordu | `mobileScaleFactor: 0.5` + `mobileYOffset: 0.3` — gövde küçülüp yukarı çıkar, metin altta serbest kalır |
| İki nav linki + pill + logo 390px'e sığmıyor, flex logoyu 0 genişliğe eziyordu | Logo `flex-shrink: 0`; metin linkleri ≤640px'te düşer |
| Hizmet portföyü dikey listeye düşünce 13 kart boyunca uzuyor, "portföyü gezme" hissi kayboluyordu | Snap slider: ortadaki kart net, komşular blurlu ve küçük |

### Reduced-motion sözleşmesi

Spec §6 "scrub animasyonları anlık son-state'e set edilir" diyor. Bir yerde bu yanlış olurdu: **hizmet portföyünün yatay track'i dekorasyon değil, tek gezinme aracı.** Transform kapatılırsa kartların çoğuna hiç ulaşılamıyor. Reduced-motion altında doğru davranış animasyonu kaldırmak değil, mekanizmayı native scroll'a çeviren **slider'a düşmek**.

---

## Sonuçlar

### Olumlu
- Sayfa boyunca süreklilik taşıyan tek bir görsel öğe; bölümler bağımsız bloklar olmaktan çıktı.
- Koreografi tek config dosyasında (`choreography.ts`); bölüm eklemek/çıkarmak konumları bozmuyor.
- Tüm süre/easing/threshold değerleri `anim-config.ts`'te toplandı — spec'in açık talebi.
- Persona sistemi (ADR-014) yeni tasarımda da çalışıyor.
- ADR-015 token katmanı olduğu gibi devralındı; iki tasarım tek palet ve tek tipografi paylaşıyor.

### Olumsuz / trade-off
- **Beş yeni bağımlılık:** `three`, `@react-three/fiber`, `@react-three/drei`, `lenis`, `gsap`. Bundle etkisi ölçülmedi (bkz. Açık işler).
- İki chrome bakımı: `/tr` (liquid-glass nav + entry popup) ve `/tr/v2` (kendi şeridi, nav'ı, cursor'ı, Lenis'i). Migrasyon tamamlanana kadar sürüyor; nav link seti iki layout'ta elle senkron tutuluyor.
- Featured Work görselleri **geçici stok** (Unsplash). `alt=""` ile dekoratif işaretli — içerikleri doğrulanmadığı için betimleyici alt metin yanlış bilgi üretirdi.
- `/tr/v2` entry popup'ı mount etmiyor; persona yalnızca ana sitede seçilebiliyor, v2 cookie'yi okuyor.
- Safari/iOS'ta ölçüm yapılmadı; `backdrop-filter` + WebGL birlikte test edilmeli.

### Yeniden değerlendirme tetikleyicileri
- Lighthouse Performance < 85 (spec §10 hedefi) → DPR ve geometri detayı yeniden düşülür.
- Safari/iOS'ta jank → nav glass tek katmana, blob statik SVG fallback'e.
- WebGL desteği olmayan tarayıcı oranı anlamlı çıkarsa → canvas'sız fallback gerekir (şu an yok).

---

## Migrasyon — canlı anasayfaya terfi

Bu ADR yönü onaylar; terfi **ayrı bir iştir ve Burak'ın sinyalini bekler**. Gerekenler:

| # | İş | Durum |
|---|---|---|
| 1 | `/tr/v2` içeriğini `(marketing)/[locale]/page.tsx`'e taşı; `(v2)` route grubu kaldırılır | Açık |
| 2 | Chrome kararı: v2 nav mı kalacak, `SiteNav` (liquid glass) mi? İkisi birden olamaz | **Kapandı** — bkz. §Chrome kararı |
| 3 | Entry popup'ı v2 layout'una bağla — persona seçimi anasayfada yapılabilmeli (ADR-014) | Açık |
| 4 | `robots: noindex` kaldır, `sitemap.ts`'e ekle | Açık |
| 5 | İç sayfalar (hizmetler, paketler, vakalar…) hangi chrome'u kullanacak? | v2 chrome'u — uygulaması açık |
| 6 | Featured Work'e orijinal görseller + gerçek alt metinler | Açık (Burak) |
| 7 | Lighthouse ölçümü, Safari/iOS testi | Açık |
| 8 | Eski 11 bölümlük anasayfa component'lerinin akıbeti (silinecek mi, arşiv mi) | Açık |

### Chrome kararı (2026-08-19)

**Karar:** v2 chrome'u kalır; `SiteNav`'ın liquid-glass pill'i terfiyle birlikte
kalkar. Burak: *"v2 tasarım onaylandı. Artık tüm sitemiz bu tasarımda olacak."*

| Katman | Karar |
|---|---|
| Siyah bilgi şeridi | Sayfanın **en üstünde**, sabit. Telefon, e-posta, konum, çalışma saati, sosyal |
| Nav | Şeridin altında, sabit. Tepede tamamen saydam; scroll başlayınca krem yüzey + hairline |
| Logo | 56px — ADR-015'teki 44px'ten büyütüldü, marka nav'ın ağırlık merkezi |
| Link seti | Hakkımızda · Hizmetler · Paketler · Vakalar · Bilgi Kütüphanesi |
| Aksiyonlar | Dil değiştirici + "Görüşme rezerve et" (ink pill) |
| Konum | Layout seviyesinde (`V2Chrome` → `chrome` prop), hero'nun içinde değil |

Gerekçeler:

1. **Nav layout'a taşındı.** Hero'nun içindeyken sayfa boyunca yaşamıyordu; v2
   tüm siteye yayılacağı için chrome'un hero'dan bağımsız olması şart.
2. **Şerit sabit ve en üstte.** `position: fixed` olduğu için akıştan çıkar;
   `.v2-root` `padding-top` ile boşluğu telafi eder ve hero `min-height`'ı aynı
   değişkeni düşer — aksi hâlde sayfa 36px taşıyor, "kaydır" etiketi ekranın
   dışında kalıyordu.
3. **Saydam → krem geçişi.** Nav tepede saydam kalır ki hero kompozisyonuna
   girmesin. Scroll'da 0.82 opaklık denendi: altındaki 8.5rem başlık nav'ın
   içinden okunuyordu, blur tek başına yutmuyor. 0.96'ya çıkarıldı.
4. **Danışmanlar nav'dan çıktı.** Kadro `/hakkimizda` ile birleştirilecek; sayfa
   ve footer bağlantısı duruyor.
5. **"Yazılar" → "Bilgi Kütüphanesi".** Slug (`/yazilar`) değişmedi; etiket
   `common.nav.articles`'tan gelir ve nav, breadcrumb, sayfa eyebrow'u aynı
   anahtarı okur.
6. **Dil değiştirici sayfayı koruyor.** `locale-href.ts` ilk segmenti
   `routing.pathnames`'ten map eder, slug'ı taşır. Bu, ADR-016 §Bilinen sınırlar
   listesindeki 307-atlaması sorununun v2 tarafındaki çözümüdür — `V2Nav`
   `next-intl` `Link`'i kullanır.

Terfiye kadar iki chrome birlikte yaşar. Link seti iki layout'ta da elle senkron
tutulur; ortak bir modüle çıkarmak terfiden sonra anlamlı olacak (o noktada
`SiteNav` zaten silinecek).

## Açık işler

| # | İş | Sahip |
|---|---|---|
| 1 | Bundle boyutu ölçümü (three + gsap + lenis) | — |
| 2 | Lighthouse Performance ≥ 85 doğrulaması | — |
| 3 | Safari / iOS performans ve `backdrop-filter` testi | — |
| 4 | `prefers-reduced-motion` canlı doğrulaması — kod yolu doğru, medya sorgusuyla test edilmedi | — |
| 5 | Featured Work orijinal görselleri + alt metinler | Burak |
| 6 | `COMPANY.phone` placeholder (ADR-015'ten devam) | Burak |
