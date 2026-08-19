# ADR-015 — Design System v2: editorial-serif'ten teknik-editorial'e

**Statü:** Accepted
**Tarih:** 2026-08-19
**Karar veren:** Burak Arda Özgül (Kurucu / Marka Stratejisti ve Kreatif Direktör)
**Kaynak:** Claude Studio `INDOLES` tasarım projesi (`INDOLES.html` + `styles.css` + 9 component)
**Supersedes:** `ADR-002-stitch-design-reject.md` (kısmen — §1, §3, §4, §5, §7), `ADR-003-cinematic-hero-zone.md` (tamamen)
**Korur:** `ADR-014-full-persona-adaptivity.md`
**Etkilenen dosyalar:** `docs/04-design-system-principles.md`, `src/lib/design/tokens.ts`, `src/styles/globals.css`, `src/styles/sections.css`, `src/app/layout.tsx`, `src/components/**`, `CLAUDE.md`, `README.md`

---

## Bağlam

v1 design system (docs/04, Nisan 2026) "editorial-minimalist" bir dil tanımlıyordu: Fraunces serif başlıklar, kırık-beyaz `paper` zemin, tek marka rengi olarak logo mavisi (#567B97), gölge yasağı yerine "soft/tonal" gölge, gradient/glassmorphism/particle yasağı, 4-24px radius skalası.

Bu dil kağıt hissini iyi taşıyordu ama üç somut gerilim üretti:

1. **Serif başlık, teknoloji vaadiyle çelişiyordu.** INDOLES'in iki ekseninden biri "AI, otomasyon, Endüstri 5.0" — Fraunces bu vaadi taşımak yerine yumuşatıyordu. Sanayici alıcıya "danışmanlık raporu" hissi veriyor, ticaret alıcısına ise yavaş geliyordu.
2. **Tek renk disiplini dark yüzeyde çalışmıyordu.** Mavi-üstü-mavi bir vizyon veya footer bölümünde vurgu yaratacak ikinci bir değer yoktu; her şey aynı tonda düzleşiyordu.
3. **Yüzey derinliği yoktu.** Gölge kısıtı ve düz yüzey disiplini, ekranda "prestij" yerine "taslak" hissi bırakıyordu. Editorial referanslar basılı işten geliyordu; ekranda karşılığı eksikti.

Nisan-Ağustos arasında repoda commit edilmemiş bir görsel yön arayışı biriktirdi (turuncu accent `#FF8D28`, stok fotoğraflı hero, uydurma metrikler). Bu arayış karar kaydı olmadan ilerlediği için hem ADR-002'nin renk disiplinini hem ADR-014'ün hero persona bağlantısını sessizce geçersizleştirmişti; typecheck ve 3 test kırıktı.

**Karar verilmezse ne olur:** İki yarım tasarım dili aynı repoda yaşamaya devam eder. `docs/04` uygulamayı tarif etmemeye devam eder, `tokens.ts` iki farklı palette ile çelişir, her yeni bölümde "hangi dile göre" sorusu yeniden açılır.

## Değerlendirilen seçenekler

### A) v1'e geri dön — commit edilmemiş arayışı sil, Fraunces/paper diline sadık kal
- **Artı:** `docs/04` zaten yazılı; sıfır doküman borcu. Tek renk disiplini korunur.
- **Eksi:** Yukarıdaki üç gerilimin hiçbirini çözmez. Turuncu arayışının ortaya çıkma sebebi (dark yüzeyde vurgu ihtiyacı) yerinde kalır.
- **Reddedildi:** problem tanımını değil, semptomu siler.

### B) Commit edilmemiş arayışı ADR'leştir — turuncu accent + modern hero
- **Artı:** En az kod değişikliği.
- **Eksi:** Arayış tutarlı bir sistem değildi: stok fotoğraf, uydurma metrikler (18K müşteri / 720+ proje), literal hex'ler, hero'da ölü persona bağlantısı. Sistemleştirilecek bir bütün yoktu.
- **Reddedildi:** ADR bir sistemi kayda geçirir; yarım kalmış bir denemeyi değil.

### C) Claude Studio'da tamamlanan disiplini tam uygula (seçilen)
- Tipografi: **Lexend** (display) + **Inter** (gövde) + **JetBrains Mono** (etiket/meta).
- Renk: logo teal'inden türetilmiş 10 basamaklı `teal` skalası + tek accent olarak `gold`.
- Yüzey: çok katmanlı uzun-yayılımlı gölge sistemi, küçük radius (2-10px), teal tonlu hairline'lar.
- Motion: canvas dalga zemin, scroll-bağlı yatay track, sticky timeline, scroll-reveal.
- **Artı:** Bütün bir sistem — token, primitive, bölüm mimarisi ve 14 bölümlük referans uygulama birlikte geliyor. Marka vaadiyle (teknoloji + dönüşüm) tipografik olarak hizalı.
- **Eksi:** ADR-002'nin dört red kararı açıkça geçersizleşiyor; `docs/04` baştan yazılıyor; 21 component siliniyor, 15 yenisi yazılıyor.
- **Trade-off kabul edildi:** doküman ve kod maliyeti tek seferlik; gerilim ise her yeni sayfada tekrar ediyordu.

## Karar

**C seçildi.** Claude Studio `INDOLES` projesindeki tasarım disiplini tüm siteye uygulanır. İçerik katmanı korunur — copy, pillar/hizmet/paket/vaka verisi, i18n ve persona sistemi taşınır, tasarım dosyasındaki örnek içerik (uydurma vaka isimleri, doğrulanmamış istatistikler) alınmaz.

### Kabul edilen sistem

| Katman | v1 | v2 |
|---|---|---|
| Display font | Fraunces (serif, `opsz` ekseni) | **Lexend** (geometrik sans, 300-700) |
| Gövde font | Inter | Inter (değişmedi) |
| Mono | JetBrains Mono | JetBrains Mono — artık `eyebrow` ve tüm etiketlerin taşıyıcısı |
| Ana zemin | `paper` #FBFAF7 | `bg` **#FAFAF7** |
| Marka rengi | `brand-500` #567B97 | `teal-700` **#2C5566** (logo rengi, birincil interaction) |
| Accent | yok | `gold-500` **#B8956A** — yalnız dark yüzey ve teknik illüstrasyon |
| Mürekkep | ink-900 #1A1F24 (pure black yasak) | ink-900 **#000000** (yasak kaldırıldı, aşağıda) |
| Radius | 4 / 8 / 12 / 16 / 24px | **2 / 4 / 6 / 8 / 10px** |
| Gölge | soft/tonal, tek katman | **çok katmanlı**, teal tonlu, uzun yayılım + inset highlight |
| Tip skalası | 8 semantik sınıf | 11 basamaklı fluid `step` skalası (-2…8) + semantik sınıflar üstüne bindirildi |
| Easing | `cubic-bezier(0,0,0.2,1)` | **`cubic-bezier(0.16,1,0.3,1)`** — daha uzun çıkış yavaşlaması |

### ADR-002 red kararlarının yeni durumu

| ADR-002 §  | Red | v2 durumu | Gerekçe |
|---|---|---|---|
| §1 | Dark base surface | **Kısmen geçersiz** | Dark artık *bölüm* seviyesinde meşru: Vision, Footer, services kapanış kartı. Sayfanın *base*'i hâlâ light. Kontrast AA doğrulaması bu üç yüzey için ayrı yapılır. |
| §2 | Deep Sea Blue + çoklu palet | **Geçerli** | Hâlâ tek marka skalası (teal) + tek accent (gold). Çoklu marka rengi yok. |
| §3 | Particle flow animasyonları | **Kısmen geçersiz** | `ParticleField` yalnız metodoloji bölümünde, 35 nokta, bağlantı çizgileriyle — dekoratif yağmur değil, ağ/sistem metaforu. `prefers-reduced-motion` altında donar. |
| §4 | Glassmorphism (24px blur) | **Kısmen geçersiz** | Yalnız nav yüzeyi. Dört katmanlı lens + SVG displacement. Kart, panel, buton opak kalır. |
| §5 | Gradient CTA | **Kısmen geçersiz** | CTA hâlâ düz (`btn-primary` = ink-900 düz). Gradient yalnız *zemin* ve *kart yüzeyi* geçişlerinde (180deg, ≤%4 delta). |
| §6 | All-caps buton + letter-spacing | **Geçerli** | Butonlar sentence case. All-caps yalnız mono etiketlerde (eyebrow, kart meta) — okuma metni değil. |
| §7 | Tertiary kahverengi | **Geçersiz** | `gold` accent kabul edildi. Ama kahverengi olarak değil: dark yüzeyde vurgu, illüstrasyonda ikincil seri, footer imzası. Light zeminde CTA rengi **değildir**. |
| §8 | Overlapping negative margin kart | **Geçerli** | Kullanılmıyor. |

### Pure black yasağının kaldırılması

v1 `#000000` kullanımını yasaklıyordu ("dijital mürekkep, siyah değil"). v2 `ink-900 = #000000` yapar. Gerekçe: v2'nin siyahı bir *metin* rengi değil, bir *yüzey* rengidir — TopBar, footer ve birincil buton zemini. Metin hiyerarşisi `ink-800` (#0A0A0A) ve `ink-700` (#1A1A1A) üzerinden kurulur; gövde metni `ink-600` (#4A5A64). Yani "sıcak mürekkep" prensibi metinde korunur, siyah yalnız yapısal yüzeylerde kullanılır.

### ADR-003 ile ilişki

ADR-003 (Cinematic Hero Zone) aynı gün supersede edilmişti; v2 onu tamamen kapatır. v2 hero'su **light** zeminde canvas dalga taşır — dark metallic değil. `hero-*` token namespace'i (`hero.void`, `hero.deep`, …) kaldırıldı. Bu ADR ile ADR-003 arşiv durumuna geçer.

### ADR-014 ile ilişki

Persona adaptivity **korunur ve onarılır**. Nisan'da hero'daki persona bağlantısı commit edilmemiş `ModernHero` tarafından koparılmıştı. v2'de:
- `usePersonaState()` hook'u `ready` bayrağı döndürür; persona-bağımlı metinler cookie okunana kadar opaklık geçişiyle bekler (UX audit 2026-04-18 bulgu **C3 — FOIC** kapandı).
- Hero, Pillars, Services, Cases, CTA bölümleri persona-aware.
- `PersonaChip` hero'da yeniden görünür; tıklanınca popup açılır.

## Sonuçlar

### Olumlu
- Tek bir tasarım otoritesi: `tokens.ts` → `globals.css @theme` → `sections.css` → component. Ara katman yok.
- 21 ölü/çakışan component silindi (`modern-hero`, `editorial-hero`, `cinematic-hero*`, `proof-section`, `packages-section`, `unlock-potential-section`, `floating-nav`, `section-navigator`, `compare` sayfası dahil).
- Uydurma metrikler siteden kalktı. Vizyon bölümündeki sayaçlar içerik katmanından türetiliyor (`PILLARS.length`, hizmet sayısı, `PACKAGES.length`, `CLIENT_LOGO_COUNT`) — elle bakım gerektirmez, drift edemez.
- Stok fotoğraf kalktı; görsel dil tamamen kendi ürettiğimiz SVG diyagramlar + canvas.
- Skip link eklendi (UX audit **C1** kapandı). Mobil navigasyon çekmecesi eklendi (**C2** kapandı).
- Typecheck ve test paketi yeşil; zaman-bombası olan cookie testi göreli tarihe çevrildi.

### Olumsuz / trade-off
- `brand-*` Tailwind adı korundu ama artık teal skalasını gösteriyor. İki isim tek skala — geçiş maliyetini düşürdü, ama `brand-*` ile `teal-*` eşanlamlı olduğunun bilinmesi gerekiyor. Yeni kod `teal-*` kullanır.
- Nav'ın `backdrop-filter` + SVG `feDisplacementMap` katmanı Safari'de ölçülmedi. Performans bütçesi doğrulanana kadar risk açık (bkz. Açık işler).
- Services ve Method bölümleri scroll'a bağlı; `100svh` sticky + hesaplanan bölüm yüksekliği kullanıyorlar. 900px altında mekanizma kapanıp dikey grid'e dönüyor — iki ayrı düzen bakımı demek.
- Design token leak testi hâlâ `it.skip`. v2 literal hex'leri `sections.css`'e topladı ama tarayıcı kural setini güncellemeden test açılamaz.

### Yeniden değerlendirme tetikleyicileri
- Nav glass katmanı Safari/iOS'ta ölçülebilir jank üretirse → tek katmanlı `backdrop-filter`'a düşülür, `feDisplacementMap` kaldırılır.
- LCP > 2.5s: hero canvas'ı statik SVG fallback'e alınır.
- Kadro fotoğrafları geldiğinde: `portraitTone` tabanlı baş harf bloğu `<Image>` ile değişir, `ConsultantContent.portraitTone` alanı kaldırılır.
- Gold accent light zeminde CTA olarak kullanılmak istenirse → kontrast ölçümü + yeni ADR.

## Açık işler

| # | İş | Sahip |
|---|---|---|
| 1 | `COMPANY.phone` placeholder (`+90 212 111 22 33`) gerçek numarayla değişmeli | Burak |
| 2 | `COMPANY.locations` — Londra/Dubai varlığı teyit edilmeli | Burak |
| 3 | Nav glass Safari/iOS performans ölçümü | — |
| 4 | Dark yüzeylerde (Vision, Footer) WCAG AA kontrast doğrulaması | — |
| 5 | Design token leak testinin açılması | — |
| 6 | Kadro portre fotoğrafları | Burak |
