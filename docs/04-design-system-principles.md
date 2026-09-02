# Tasarım Sistem Prensipleri (Design System Principles) — v2

> **Statü:** Onaylı — estetik kararların tek otoritesi.
> **Sürüm:** v2 (2026-08-19). v1 (editorial-serif) `docs/decisions/ADR-015-design-system-v2.md` ile emekliye ayrıldı.
> **Kaynak kod:** `src/lib/design/tokens.ts` → `src/styles/globals.css` (`@theme`) → `src/styles/sections.css` → component.
> **Upstream:** `01-vision-positioning.md` (iki eksen, ton gerilimi), `03-brand-voice-tone.md` (persona ton matrisi).

Bu doküman değişmeden hiçbir UI kararı değişmez. Bir component bu dokümana aykırı bir değer istiyorsa: önce burası güncellenir, sonra `tokens.ts`, sonra kod. Sapma ADR gerektirir.

---

## 1. Tasarım Felsefesi

### Teknik-editorial

INDOLES'in görsel dili iki kaynaktan beslenir: **editorial yayıncılık** (net hiyerarşi, geniş boşluk, tipografi öncelikli sayfa) ve **teknik dokümantasyon** (mono etiketler, numaralandırılmış bölümler, diyagramlar, ölçüm dili). Bu ikisi çatışmaz — bir mühendislik dergisinin sayfa disiplinidir.

Üç kural bu dili taşır:

| Kural | Anlamı |
|---|---|
| **Tipografi taşır, dekorasyon taşımaz** | Bir bölümün ağırlığı punto, boşluk ve hiyerarşiden gelir; renk lekesinden veya görselden değil |
| **Her görsel bir mekanizma anlatır** | Kullanılan her SVG bir süreci, ilişkiyi veya yapıyı gösterir. Süsleme amaçlı ikon veya stok fotoğraf yoktur |
| **Ölçü görünür** | Sayaçlar, numaralar, ilerleme çubukları, koordinatlar, süre etiketleri — arayüz kendi konumunu söyler |

### İki persona, bir görsel dil

Sanayici (dingin-kurumsal) ve ticaret (dinamik-atletik) ayrımı **copy** ekseninde yaşar, görsel dilde değil. Aynı grid, aynı palet, aynı motion; değişen yalnızca metin. Gerekçe: iki görsel dil iki marka demektir.

### Reddedilenler

Aşağıdakiler bilinçli olarak dışarıdadır. Biri gerekirse ADR yazılır:

- Stok fotoğraf ve genel amaçlı ikon setleri
- Dekoratif parçacık yağmuru, sonsuz döngü animasyonları
- Çoklu marka rengi (teal + gold dışında accent)
- Light zeminde gradient buton
- All-caps okuma metni
- Kartların birbirine binen negative-margin düzenleri
- Doğrulanmamış istatistik ve metrik (bkz. §10)

---

## 2. Tipografi

### Aileler

| Rol | Aile | Ağırlıklar | Nerede |
|---|---|---|---|
| Display | **Lexend** | 300, 400, 500, 600, 700 | h1–h6, metrik rakamları, alıntılar, marka ifadeleri |
| Gövde | **Inter** | 400, 500, 600 | Paragraf, liste, form, buton |
| Mono | **JetBrains Mono** | 400, 500 | `eyebrow`, kart meta, sayaç, koordinat, teknik etiket |

Lexend geometrik ve okunabilirlik için tasarlanmış bir sans'tır; teknoloji vaadini serif'in taşıyamadığı yerde taşır. Yükleme `next/font/google` ile yapılır (`--font-display-sans`, `--font-body-sans`, `--font-mono-code`); CDN link'i yoktur.

### Fluid skala

11 basamak, `clamp()` tabanlı. Mobilde 1.2, desktop'ta 1.25 modüler oran. Tailwind'de `text-step-{n}`:

| Token | Min → Max | Tipik kullanım |
|---|---|---|
| `step--2` | 0.69 → 0.72rem | Caption, dipnot |
| `step--1` | 0.83 → 0.90rem | Küçük gövde, kart açıklaması |
| `step-0` | 1.00 → 1.13rem | Gövde metni |
| `step-1` | 1.20 → 1.41rem | Lede, öne çıkan paragraf |
| `step-2` | 1.44 → 1.76rem | h3 |
| `step-3` | 1.73 → 2.20rem | h2, bölüm başlığı |
| `step-4` | 2.07 → 2.75rem | Vaka başlığı, metrik |
| `step-5` | 2.49 → 3.43rem | Manifesto, h1 |
| `step-6` | 2.99 → 4.29rem | Hero başlığı, display |
| `step-7` | 3.58 → 5.37rem | Vizyon başlığı |
| `step-8` | 4.30 → 6.71rem | Kapanış CTA |

### Semantik sınıflar

`typography-*` sınıfları skalanın üstüne semantik bir katman koyar ve sayfa kodunda tercih edilir:

`typography-display-2xl` (step-8) · `display-xl` (step-7) · `display-lg` (step-6) · `h1` (step-5) · `h2` (step-3) · `h3` (step-2) · `body-lg` (step-1) · `body-md` (step-0) · `body-sm` (step--1) · `caption` (step--2) · `label` (mono 11px)

#### Ağırlık ve satır aralığı (ADR-017)

Tek ağırlık: **başlıklar 600**. Önceden taban `h1–h6` kuralı 700, `typography-*`
sınıfları 500 veriyordu — aynı sayfada iki farklı başlık ağırlığı vardı.
Lexend'de 700 fazla kalın, 500 ise anasayfanın başlıklarının yanında cılız
kalıyor.

| Sınıf | Satır aralığı | Tracking |
|---|---|---|
| `display-2xl` | 0.94 | `--tracking-display` |
| `display-xl` | 0.98 | `--tracking-display` |
| `display-lg` | 1.00 | `--tracking-display` |
| `h1` | 1.02 | `--tracking-heading` |
| `h2` | 1.08 | `--tracking-heading` |
| `h3` | 1.15 | `--tracking-title` |
| `body-lg` | 1.60 | — |
| `body-md` | 1.68 | — |
| `body-sm` | 1.60 | — |

Başlıklarda sıkı, gövdede açık. Gövdenin eski 1.5–1.55 değeri uzun paragraflarda
satırları birbirine yapıştırıyordu; anasayfanın lede'leri 1.65'te nefes alıyor
ve iç sayfaların da aynı ritmi taşıması gerekiyor.

#### Display ölçeği sayfa başlığınındır

Bir iç sayfada **display ölçeğini yalnız `V2PageHeader` kullanır.** Bölüm
başlıkları `h1`, kart ve liste başlıkları `h2` ölçeğindedir.

Kural bir hatadan doğdu: `h2` etiketli bölüm başlıkları `display-xl` (step-7,
5.37rem'e kadar) kullanıyordu — yani sayfanın kendi `h1`'inden **büyüktüler**.
Ağırlık 500'ken bu göze batmıyordu; 600'e çıkınca hiyerarşi tamamen ters
göründü. 24 kullanım bir basamak indirildi.

Sayfa başına bir `h1` vardır ve o `V2PageHeader`'ındır.

### Tracking

| Token | Değer | Nerede |
|---|---|---|
| `tracking-display` | −0.035em | step-6 ve üstü |
| `tracking-heading` | −0.028em | step-3…step-5 |
| `tracking-title` | −0.02em | h3, alıntı |
| `tracking-label` | +0.18em | mono etiketler, eyebrow |

Kural: punto büyüdükçe tracking sıkışır, mono etiketlerde açılır.

### İtalik vurgu — `accent-em`

Başlıkların içinde ikinci bir ses: Lexend italik, weight 400, `teal-700`. Bir başlıkta **en fazla bir** `accent-em` bloğu bulunur; iki tane vurgu değil gürültü üretir. Dark yüzeyde `accent-em-gold` kullanılır.

---

## 3. Renk

### Teal — tek marka skalası

Logo renginden (`teal-700` = **#2C5566**) türetilmiş 11 basamak. Tailwind'de hem `teal-*` hem `brand-*` adıyla yayımlanır (aynı değerler; `brand-*` v1'den gelen çağrı yerlerinin uyumluluğu için, yeni kod `teal-*` kullanır).

| Token | Hex | Rol |
|---|---|---|
| `teal-50` | #F5F8FA | Bölüm zemini, etiket arka planı |
| `teal-100` | #EAF1F4 | Kart zemini, gradient ucu |
| `teal-200` | #D4E2E8 | Görsel zemin |
| `teal-300` | #AEC7D1 | Diyagram ikincil |
| `teal-400` | #7AA4B3 | Scrollbar hover, dalga katmanı |
| `teal-500` | #4F8294 | Liste işareti, dalga katmanı |
| **`teal-700`** | **#2C5566** | **Logo · birincil interaction · eyebrow · accent-em · timeline** |
| `teal-800` | #234959 | Koyu vurgu |
| `teal-900` | #1A3A47 | Vizyon zemini (üst) |
| `teal-950` | #0F1C23 | Vizyon zemini (alt), portre bloğu |

### Gold — tek accent

| Token | Hex | Rol |
|---|---|---|
| `gold-400` | #C9A881 | Dark yüzeyde eyebrow, italik vurgu, footer imzası |
| `gold-500` | #B8956A | Teknik illüstrasyonlarda ikincil seri |
| `gold-700` | #8F7142 | Semantic warning metni |

**Gold light zeminde CTA rengi değildir.** Light zeminin birincil aksiyonu siyahtır. Gold'un işi dark yüzeyde sıcaklık ve tek bir vurgu noktası üretmektir.

### Nötrler

| Token | Hex | Rol |
|---|---|---|
| `bg` | #FAFAF7 | Ana tuval |
| `bg-pure` / `surface-1` | #FFFFFF | Kart, panel |
| `surface-2` | #F5F8FA | Alternatif bölüm |
| `surface-3` | #EAF1F4 | Hover, elevated |
| `ink-900` | #000000 | Yapısal siyah yüzey (topbar, footer, birincil buton) |
| `ink-800` | #0A0A0A | Başlık metni |
| `ink-700` | #1A1A1A | Güçlü gövde, nav link |
| `ink-600` | #4A5A64 | Gövde metni |
| `ink-500` | #6B7880 | Meta, caption |
| `ink-400` | #8F9AA2 | Sessiz meta |
| `ink-300` | #B8C0C6 | Placeholder, pasif ok |
| `ink-200` | #E2E6E9 | Kenarlık, ayraç |
| `ink-100` | #EEF1F3 | İnce ayraç |

**Siyah kuralı:** `ink-900` bir *yüzey* rengidir. Okuma metni `ink-600`, başlık `ink-800/900` — ama gövde paragrafı asla saf siyah değildir.

### Kontrast

| Kombinasyon | Oran | Durum |
|---|---|---|
| ink-800 / bg | ~19:1 | AAA |
| ink-600 / bg | ~7.4:1 | AAA |
| ink-500 / bg | 4.34:1 (ölçüm 2026-09-02, §12.10) | Yalnız büyük metin (AA large) — gövde caption'ı için ayrı karar bekliyor |
| teal-700 / bg | ~8.2:1 | AAA |
| white / teal-900 | ~11:1 | AAA |
| gold-400 / teal-950 | ~7.6:1 | AAA |
| ink-300 / bg | ~2.3:1 | Yalnız placeholder/disabled — muaf |

Dark bölümlerde (Vision, Footer, services kapanış kartı) `color-scheme: dark` set edilir.

### Semantic

`success` #3F7A56 · `warning` #B8956A (gold ile aynı) · `danger` #A8453D. Her biri 50/500/700 varyantlı. `info` ayrı renk almaz — teal kullanılır.

---

## 4. Spacing ve Grid

4px tabanlı skala; Tailwind'in varsayılan `--spacing` çarpanıyla birebir örtüşür, ayrı utility yayımlanmaz.

`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 192`

### Bölüm ritmi

| Ritim | Değer | Nerede |
|---|---|---|
| Sıkı | 96px | Marquee bandı, sektör grid |
| Temel | 140px | Standart içerik bölümü |
| Geniş | 180px | Manifesto, kapanış CTA |

### Container

| Token | Genişlik | Padding | Nerede |
|---|---|---|---|
| `.ds-container` | 1440px | `clamp(20px, 5vw, 72px)` | Tüm standart bölümler ve iç sayfalar |
| `.ds-container-wide` | 1680px | `clamp(20px, 4vw, 56px)` | Nav, services track başlığı |
| `--container-prose` | 1120px | — | Manifesto, marquee |

Kural: aynı sayfadaki her bölüm aynı sol kenardan başlar. Karışık container kullanımı yasaktır.

### Breakpoints

`mobile 375` · `tablet 768` · `desktop 1280` · `wide 1536`

Ek bir davranış eşiği: **900px** — scroll-bağlı yatay track ve sticky timeline bu değerin altında kapanır ve dikey düzene döner.

---

## 5. Radius ve Elevation

### Radius

`sm 2px` · `md 4px` · `lg 6px` · `xl 8px` · `2xl 10px`

v2 radius'ları kasıtlı olarak küçüktür. Büyük radius "yumuşak uygulama kutusu" hissi verir; INDOLES basılı bir kenar arar. 10px üstü radius yalnız tam yuvarlak elemanlarda (nokta, avatar halkası) kullanılır.

### Elevation

Her seviye **en az iki katman** taşır: yakın kontak gölgesi + uzak ambient gölge. Ambient katman nötr gri değil **teal tonludur** (`rgb(44 85 102 / …)`) — yüzey markanın rengine oturur.

| Token | Kullanım |
|---|---|
| `shadow-sm` | Sessiz kart, ayrık liste öğesi |
| `shadow-md` | Standart kart |
| `shadow-lg` | Öne çıkan kart, modal |
| `shadow-xl` | Popup, en üst katman |
| `shadow-3d` | İç highlight + hairline + iki ambient katman — nav ve hizmet kartı |
| `shadow-float` | Yüzen kontrol — araç giriş çubuğu; kontak + iki ambient katman, modal kadar kalkmaz |

`shadow-3d` deseni: `inset beyaz highlight` → `0 0 0 1px teal hairline` → `orta mesafe` → `uzak yayılım`. Bu dört katman "basılı kart" hissini üretir; tek katmanlı gölge bunun yerini tutmaz.

---

## 6. Primitives

Tek kaynak: `globals.css`. Sayfa kodunda yeniden icat edilmez.

### `.eyebrow`
Mono, 11px, uppercase, `tracking-label`, teal-700. Solunda 22px hairline (`::before`). Varyantlar: `.eyebrow-gold` (dark yüzey), `.eyebrow-bare` (çizgisiz, chip içi).

### `.btn`
14px Inter medium, 14/22px padding, `radius-md`, dört katmanlı gölge, `0.4s var(--ease-out)` geçiş.

| Varyant | Zemin | Hover |
|---|---|---|
| `.btn-primary` | ink-900 | ink-700 + `translateY(-2px)` + derin gölge |
| `.btn-ghost` | beyaz gradient + ink-200 kenar | teal-700 kenar ve metin |
| `.btn-invert` | beyaz (dark yüzey için) | gold-400 |
| `.btn-lg` | 18/28px padding, 15px | — |

`.arrow` alt elemanı hover'da `translate(2px, -2px)` yapar — bu hareket markanın imzasıdır, tüm CTA'larda aynıdır.

### `.reveal`
`opacity 0 → 1` + `translateY(24px) → 0`, 1s. `.d1`–`.d5` gecikme sınıfları. Tek bir `RevealObserver` (layout seviyesinde) `.in` sınıfını ekler; her bölüm kendi observer'ını kurmaz. `prefers-reduced-motion` altında anında görünür.

### `.mono` / `.tabular` / `.divider` / `.grain` / `.marquee-track`
Sırasıyla: mono aile, tabular rakam, gradient hairline ayraç, SVG turbulence dokusu, 60s sonsuz yatay kayış.

---

## 7. Motion

| Token | Değer | Nerede |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Varsayılan — güçlü çıkış yavaşlaması |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Simetrik geçişler |

| Süre | Değer | Nerede |
|---|---|---|
| fast | 300ms | Hover, focus, renk |
| base | 400ms | Buton, kart, nav |
| slow | 600ms | Kart yükselme, timeline dolumu |
| reveal | 1000ms | Scroll reveal |

### Motion envanteri

| Mekanizma | Bölüm | Notlar |
|---|---|---|
| `WaveCanvas` | Hero, CTA, Vizyon, iç sayfa başlığı | Canvas 2D, 3–6 katman sinüs dolgusu + 3 kontur çizgisi, fare takipli. `light` ve `dark` tonu var |
| `ParticleField` | Metodoloji | 35 nokta + 120px altı mesafede bağlantı çizgisi. Ağ metaforu |
| Sticky yatay track | Hizmetler | Dikey scroll → `translate3d` yatay. ≤900px kapalı |
| Sticky timeline | Metodoloji | Scroll oranı → aktif aşama. ≤900px kapalı |
| Parallax | Vakalar | Görsel `translateY(±24px)`, `scale(1.08)` |
| Kelime mürekkeplemesi | Manifesto | Scroll ilerledikçe kelimeler `rgb(26 43 52 / .22)` → `ink-900` |
| Sayaç | Vizyon | `1 - (1-p)³` easing, 1600ms, viewport'a girince |
| Marquee | Referanslar | 60s linear, hover'da durur |

**`prefers-reduced-motion` sözleşmesi:** tüm animasyon ve geçişler 0.01ms'ye iner, `.reveal` anında görünür, canvas döngüleri tek kare çizip durur, sayaç doğrudan hedef değere atlar, team slider otomatik dönmez. Bu bir "nice to have" değil, kabul kriteridir.

---

## 8. Sayfa Mimarisi

### Chrome

| Katman | Davranış |
|---|---|
| `TopBar` | `position: fixed`, 36px, ink-900. Telefon, e-posta, konum, saat, sosyal, dil. ≤960px'te konum ve saat gizlenir, ≤640px'te metinler düşer, ikonlar kalır |
| `SiteNav` | `position: fixed`, top 52px, ortalanmış pill, genişlik `calc((100% - 32px) * 0.9)`, max 1404px. Scroll >40px'te sıkışır ve blur artar. ≤960px'te hamburger + çekmece |
| `SiteFooter` | ink-900, 4 kolon + bülten + mega INDOLES filigranı (`rgb(255 255 255 / .04)`, `aria-hidden`) |
| Skip link | `#main`'e atlar, yalnız `:focus-visible`'da görünür |

**Sabit chrome sonucu:** scroll'la başlayan her bölümün üst boşluğu TopBar (36) + Nav (~68) + nefesi karşılamalıdır. Sticky bölümler `padding-top: 148px`, iç sayfa başlığı `.page-hero` 200px kullanır.

### Anasayfa bölüm sırası

| # | Bölüm | İşlevi | Persona-aware |
|---|---|---|---|
| 1 | Hero | Vaat + persona chip + iki CTA | **Evet** |
| 2 | Referans marquee | Kanıt — 15 marka | Hayır |
| 3 | Manifesto | Duruş | Hayır |
| 4 | Kadro slider | İnsan | Hayır |
| 5 | Üç pillar | Kapsam | **Evet** |
| 6 | Hizmet track | Derinlik — 12 disiplin | **Evet** (kart açıklamaları) |
| 7 | Metodoloji | Yöntem — INDOLES Frame | Hayır |
| 8 | Vakalar | Sonuç | **Evet** (başlık, lede) |
| 9 | Sektörler | Alan | Hayır |
| 10 | Vizyon | Hedef | Hayır |
| 11 | Kapanış CTA | Aksiyon | **Evet** |

Sıra bir argümandır: *ne vaat ediyoruz → kimler güveniyor → neye inanıyoruz → kimiz → ne yapıyoruz → nasıl yapıyoruz → ne oldu → nerede → nereye → başla.* Bölüm eklenirken bu akıştaki yeri gerekçelendirilir.

### İç sayfa

`V2PageHeader` (breadcrumb + eyebrow + başlık + sağ kolonda lede, dekorsuz) →
içerik bölümleri (`.ds-container`, zeminsiz) → `ContactCallout`. Arkada blob
`page` modunda sessizce durur. Ayrıntı §12.10.

Araç sayfaları bu düzenin istisnasıdır: `.tool-hero` (tek merkezî sütun,
giriş alanı ilk ekranda) + `tool-hero` blob varyantı. Gerekçe §12.10.

> Eski `PageHeader` (`.page-hero` + dalga zemin) ADR-017 ile kullanımdan kalktı.

---

## 9. Erişilebilirlik

- WCAG 2.2 AA zorunlu. Kontrast tablosu §3'te.
- Focus: `2px solid teal-700`, 2px offset, `radius-md`. Tarayıcı varsayılanı kullanılmaz.
- Her `<section>` ya `aria-labelledby` ile başlığına bağlıdır ya da `aria-label` taşır.
- Dekoratif her şey (`WaveCanvas`, `ParticleField`, filigran, ok ikonları, glyph'ler, mega wordmark) `aria-hidden="true"`.
- Slider'larda ok butonları ve nokta göstergeleri gerçek `<button>`'dır, `aria-label` taşır; aktif nokta `aria-current`.
- Marquee'nin ikinci kopyası `aria-hidden` ve `alt=""` — ekran okuyucu logoları iki kez okumaz.
- Manifesto'nun kelime kelime renklenen metni: kapsayıcıda `aria-label` ile tam cümle, kelimeler `aria-hidden`.
- Touch hedefi minimum 44×44px (`.ts-arrow`, `.f-btn`, nav burger bu ölçüde).
- Skip link zorunlu.

---

## 10. İçerik Dürüstlüğü Kuralı

Arayüzde görünen her sayı doğrulanabilir olmalıdır.

- Metrikler ya gerçek bir vaka çalışmasından (`cases.ts`) ya da içerik katmanından türetilir (`PILLARS.length` gibi).
- "20.000+ ekip", "140+ dönüşüm", "%98 memnuniyet" tarzı kaynaksız rakamlar sisteme girmez.
- Kaynağı belirsiz bir veri gerekiyorsa ya alan boş bırakılır ya da `TODO(burak)` ile işaretlenip kod yorumunda gerekçesi yazılır (`src/lib/content/company.ts` örneği).

Bu kural estetik değil, `03-brand-voice-tone.md`'deki "kanıt-odaklı ses" ilkesinin arayüz karşılığıdır.

---

## 11. Değişiklik Protokolü

1. Yeni bir değer mi gerekiyor? → `docs/04` (bu dosya) güncellenir.
2. → `src/lib/design/tokens.ts` güncellenir.
3. → `src/styles/globals.css` `@theme` bloğu senkronlanır.
4. → Component yazılır.

Ham hex, ham px ve ham easing değeri component dosyasına yazılmaz. İstisna: `sections.css` içindeki `rgb(… / alpha)` kullanımları — bunlar token renklerinin alpha varyantlarıdır ve her biri yorumda hangi token'dan geldiğini söyler.

---

## 12. Motion ve Etkileşim Katmanı (v2 blob anasayfası)

> **Kapsam:** Bu bölüm `/tr/v2` prototipinde uygulanan sürekli-sahne mimarisini
> tanımlar. Karar kaydı: `docs/decisions/ADR-016-v2-blob-design-direction.md`.
> §1–11 (renk, tipografi, spacing, elevation) aynen geçerlidir — v2 token
> katmanını olduğu gibi devralır.

### 12.1 Sürekli sahne ilkesi

Bölümler bağımsız bloklar değil, **tek bir sahnenin evreleri**dir. Sahneyi
taşıyan öğe sayfa boyunca hiç unmount edilmeyen bir `position: fixed` WebGL
canvas'tır. Yeni bir bölüm eklenirken sorulacak soru "bu blok nereye girer"
değil, "bu evrede sahne ne yapar" olmalıdır.

### 12.2 Katman sözleşmesi

| z | Katman |
|---|---|
| 0 | Arka metin katmanı + dekoratif yörünge halkaları |
| 10 | WebGL canvas (`fixed`, `pointer-events: none`) |
| 20 | Tüm normal içerik — nav, başlıklar, kartlar, grid |
| 50 | Custom cursor |
| 60 | Skip link |

Bu sıralama "gövdenin içinden renkli metin görünüyor" etkisinin tek
mekanizmasıdır; refraction veya post-processing yoktur.

**Kritik not:** Etki için ön katmanda YALNIZ vurgu harfleri bulunur, arka
katmanda harflerin tamamı siyah durur. Ters kurgu (renkli arkada, siyah önde)
opak bir gövdeyle hiçbir şey göstermez — iki katman da kaybolur.

### 12.3 Koreografi

Blob'un yolu `components/v2/webgl/choreography.ts` içinde 7 keyframe olarak
tanımlıdır: `x`/`y` (ekran merkezine oran), `scale` (viewport yüksekliğine
oran), `noiseAmp`, `opacity`.

Kurallar:
- Her segment, kendi çapasının üstünden **bir sonraki çapanın üstüne** kadar
  scrub'lanır. Aralıklar bu tanımla ardışıktır ve çakışmaz.
- `start`/`end` **fonksiyon** olarak verilir; her `refresh`'te yeniden
  hesaplanır. Sabit oranlar sayfa uzayınca geçersiz kalır.
- Bölüm id'si koreografinin çapasıdır. Id değişirse `choreography.ts` de
  değişmelidir.
- Son segment için `maxScroll − 0.6×viewport` payı ayrılır; kısa bir kapanış
  bölümü aksi halde scroll'un dışında kalır.

### 12.4 Yüzey dili

Blob'un "sıvı" okuması üç şeyden gelir; üçü birden gerekir:

1. **Düşük dereceli harmonik salınım** (l=2/l=3, oransız hızlarda) — gövdeyi
   bütün olarak esnetir, yüzeye yumru eklemez.
2. **Düşük frekanslı FBM** — birkaç büyük lob, çakıl dokusu değil.
3. **Fark edilir zaman ilerlemesi** — çok yavaş bir noise donmuş cisim okur.

Renk: teal + gold'dan türetilmiş 5 duraklı gradyan, shader içinde %50 beyaza
lift. Kenarlarda fresnel rim, iki lobelı specular (geniş + sıkı), hiçbir bölge
saf siyaha inmez.

### 12.5 İşaretçi etkileşimi

- Yumuşatma **saniye başına** hesaplanır (`1 − exp(−rate·delta)`), kare başına
  değil — 120Hz ekranda kare-başına sabit lerp gerçek zamanda yarı hızda çalışır.
- Takip hızı mesafeyle artar, ama kare başına alınabilecek yol tavanlıdır
  (`mouseMaxStep`); tavansız yetişme ışınlanma gibi görünür.
- Hız kare başına ölçülür, olay başına değil — olay sayısı tarayıcıya bağlıdır.
- Gövde döndüğü için dünya→obje dönüşümü `worldToLocal()` ile yapılır; konum ve
  ölçeği elle çıkarmak rotasyonu atlar ve çukur cursor'dan kayar.

### 12.6 Performans bütçesi

Vertex shader'da normal yeniden hesabı deformasyon fonksiyonunu vertex başına
**üç kez** çağırır. Geometri detayı seçilirken bu çarpan hesaba katılmalıdır.

| Karar | Değer | Gerekçe |
|---|---|---|
| `IcosahedronGeometry` detail | 32 | 96'da 564.540 vertex × 9 noise = frame başına 5M çağrı |
| Vertex FBM oktavı | 2 | Üçüncü oktav 3× bedelle geliyor, düşük frekansta katkısı yok |
| Fragment noise | yok | Renk lekesi vertex'te örneklenip varying ile taşınır |
| DPR tavanı | 1.75 | Retina'da 2 → 1.75 fragment yükünü ~%23 düşürür |
| `will-change` | yok | 54 harfin her biri ayrı compositing katmanı oluyordu |

### 12.7 Dar ekran ve reduced-motion

| Mekanizma | ≤900px | `prefers-reduced-motion` |
|---|---|---|
| Blob | Ölçek ×0.5, dikey offset +0.3 | Noise %70 yavaş, dönüş durur |
| Harf saçılması | Kapalı, yalnız fade | Kapalı |
| Custom cursor | Hiç mount edilmez | Mount edilir, hareket eder |
| Lenis | Aktif | Kapalı, native scroll |
| Yatay hizmet track'i | **Snap slider** | **Snap slider** |
| Kart etiketleri | Kalıcı görünür (`hover: none`) | Kalıcı görünür |
| Kolon parallax'ı | Kapalı | Kapalı |

**Yatay track kuralı:** Bu mekanizma dekorasyon değil, portföyün tek gezinme
aracıdır. Hareket kısıtlıyken doğru davranış animasyonu kaldırmak değil,
mekanizmayı native scroll'a çeviren slider'a düşmektir. Aynı ilke başka bir
scroll-bağlı gezinme eklenirse de geçerlidir: **içeriğe erişimi animasyona
bağlama.**

### 12.8 İçerik dürüstlüğü — geçici görseller

Geçici stok görseller `alt=""` ile dekoratif işaretlenir. İçeriği doğrulanmamış
bir görsele betimleyici alt metin yazmak yanlış bilgi üretir; kartın erişilebilir
adı zaten başlıktan gelir. Orijinal görsel geldiğinde gerçek alt metin yazılır.
Bu, §10'daki içerik dürüstlüğü kuralının görsel karşılığıdır.

### 12.9 Chrome — siyah şerit ve nav

Chrome sayfanın değil **layout'un** parçasıdır. Hero'nun içinde yaşayan bir nav,
tasarım tüm siteye yayıldığında iç sayfalarda yok olur; bu yüzden şerit ve nav
`V2Chrome`'un `chrome` slot'undan mount edilir.

| Katman | Kural |
|---|---|
| Siyah şerit | Sayfanın en üstü, `position: fixed`, `--v2-topbar-h` |
| Nav | Şeridin altı, sabit, `--v2-nav-h` |
| Logo | 56px — nav'ın ağırlık merkezi, scroll'da küçülmez |
| Yüzey | Tepede saydam → scroll'da krem (`0.96`) + hairline |
| Aksiyonlar | Dil değiştirici (ikincil) + CTA (ink pill, birincil) |

**Sabit chrome akıştan çıkar.** İki yükseklik `v2.css`'te değişken olarak
tanımlanır; `.v2-root` `padding-top` ile boşluğu telafi eder ve hero
`min-height`'ı aynı değişkeni düşer. Üç yerde ayrı sabit tutulmaz — biri
değişince diğer ikisi sessizce bozulur.

**Saydamlık okunabilirliğe tabidir.** Nav tepede saydam kalır ki hero
kompozisyonuna girmesin. Scroll'da yüzey kazanır: `backdrop-filter` tek başına
8.5rem punto bir başlığı yutmuyor, opaklık gerekiyor. Ölçüm: `0.82`'de alttaki
metin nav'ın içinden okunuyordu, `0.96`'da temiz.

**Çekmece açıkken nav da opaklaşır.** Saydam kalırsa arkadaki sahne logonun ve
kapatma düğmesinin arkasından görünür, çekmece havada durur.

**Kapalı çekmece `inert`'tir.** `display: none` geçiş animasyonunu öldürür;
`inert` görünürlüğü kapatırken klavye sırasını ve ekran okuyucuyu da temizler.

**Dil değiştirici bulunulan sayfayı korur.** Kök sayfaya atmak kullanıcının
yerini kaybettirir. Segment çevirisi `lib/i18n/locale-href.ts`'tedir: yalnız ilk
segment map edilir, slug taşınır.

### 12.10 İç sayfa dili (ADR-017)

v2 tüm siteye taşındığında iç sayfaların anasayfayı taklit etmesi gerekmez;
aynı **malzemeden** yapılmış olması gerekir.

| Katman | Anasayfa | İç sayfa |
|---|---|---|
| Blob | Anlatının kendisi — 7 duraklı koreografi | Sessiz eşlikçi — sabit konum, 0.26 opaklık |
| Başlık | İki katmanlı, blob'un içinden geçer | `V2PageHeader` — tek katman, dekorsuz |
| Zemin | Krem tuval | Aynı krem tuval |
| Kart | Yarı saydam beyaz | Aynı (`.v2-surface`) |

**Krem tuval tektir.** Bölüm seviyesinde opak zemin kullanılmaz. `bg-paper`
sayfanın rengiyle birebir aynıydı (#FAFAF7); tek yaptığı arkadaki katmanı
örtmekti. Yeni bir bölüm yazarken zemin vermeyin — vermek istiyorsanız
gerekçesi kontrast olmalı, alışkanlık değil.

**Kartlarda `backdrop-filter` yok.** Bir iç sayfada onlarca kart olabiliyor;
hepsini ayrı compositing katmanına promote etmek §12.6'daki performans
bütçesini deler. Yarı saydamlık krem zeminin üstünde zaten yeterli.

**Blob okuma kolonuna girmez.** Konumu ölçümle bulunur, tahminle değil: iki
ayrı turda önce sayfa başlığının lede'ini, sonra paket sayfasının fiyat
kolonunu örttüğü görülüp geri çekildi. Yeni bir sayfa düzeni eklendiğinde aynı
kontrol yapılır — "arkada duruyor" varsayımı yeterli değil.

#### Bilinçli istisna: araç sayfası hero'su (`tool-hero` varyantı)

Araç sayfaları üçüncü bir sayfa tipidir. Hizmet/vaka/yazı sayfası *okunur*;
araç sayfası *kullanılır* — ilk ekranı bir metin bloğu değil bir giriş alanıdır
("adresini gir, tara"). Bu sayfalarda blob sessiz eşlikçi olarak kalırsa ilk
ekran boş bir formdan ibaret kalıyor; sayfanın INDOLES'e ait olduğunu söyleyen
tek malzeme kayboluyor.

Bu yüzden araç sayfası hero'sunda blob anasayfadaki gibi **merkezî ve
belirgin** durur. Anasayfanın 7 duraklı koreografisi **kopyalanmaz** — o
koreografi bir scroll anlatısıdır ve araç sayfasının anlatısı yoktur.

**Kompozisyon kuralı: "camın altındaki küre".** Kürenin çekirdeği giriş
çubuğunun arkasındadır; başlık ve lede kürenin yumuşak üst kenarının
ÜSTÜNDE, temiz kremde durur. Küre metnin arkasına değil, aksiyonun arkasına
yerleşir — ilk ekranda gözün gittiği yer giriş alanıdır.

Geometri viewport'a oranlıdır: ekran y'si `vh * (1 - y) / 2`, yarıçap
`scale * vh / 2`. Bu yüzden "çekirdek çubuğun arkasında" koşulu ölçekten
bağımsız sağlanamaz — yarıçap büyüdükçe üst kenar başlığın da üstüne çıkar.
İlk sürüm (`y: -0.28`, `scale: 0.78`, opaklık 0.85) tam bunu yapıyordu:
yarıçap 0.39·vh olunca küre altı viewport'ta da koca, sert kenarlı bir diske
dönüşüp h1'i, lede'i ve altındaki bölümü birlikte kaplıyordu (2026-09-02
görsel tur). Çekirdek bir tık aşağı indirildi, gövde küçültüldü.

| | Anasayfa | Araç hero'su | Diğer iç sayfalar |
|---|---|---|---|
| Konum | Koreografi, 7 durak | Merkezî (`x: 0`), `y: -0.55` (mobil -0.5) | Sağ üst, `x: 0.88` |
| Ölçek | 0.35 – 1.6 arası gezer | 0.52 sabit (mobil 0.56 × 0.72) | 0.4 sabit |
| Opaklık | 0.45 – 1.0 | 0.58 (mobil 0.46) | 0.26 |
| Scroll | Anlatıyı sürer | Hero'dan sonra `page` hâline **çekilir** | Hafif dikey kayma |

**"Okuma kolonuna girmez" kuralı iptal edilmedi, kapsamı daraltıldı.** Kural
okuma bölümleri için aynen geçerli: `tool-hero` varyantı ilk ekran boyunca
belirgin durur, sonra tek bir scrub tween'le `BLOB_PAGE` değerlerine yerleşir.
Kullanıcı "Nasıl çalışır", "Ne ölçüyoruz" ve SSS bölümlerine ulaştığında
arkasında yine 0.26 opaklıklı sessiz eşlikçi vardır.

*Bilinen sınır:* blob viewport'a çapalı, hero içeriği ise belgeye. Uzun ve dar
bir viewport'ta (ölçülen: 768x1024 dikey tablet) hero içeriği ekranın üst
yarısında biterken küre alt yarıda kalır ve scroll 0'da "Nasıl çalışır"
bölümünün üstüne düşer. Kürenin o bölgesi açık olduğu için okunabilirlik
ölçümde eşiğin üstünde; sorun estetiktir, kullanıcı ilk kaydırmayla çözer.
Viewport'a değil belgeye çapalanmış bir konum bu katmanın (tek, sürekli,
`fixed` canvas) sözleşmesini değiştirir — ayrı bir kararın konusudur.

**Okunabilirlik ölçümle güvenceye alınır, varsayımla değil.** Hero metni
canvas'ın (z-10) üstündedir (`.tool-hero` z-20) ve anasayfadaki iki katmanlı
başlık sandviçi burada kullanılmaz. Blob paleti shader'da %50 beyaza lift'lendiği
için en koyu bölgesi bile krem üstünde açık kalır.

Ölçüm yöntemi: hero metni gizlenip (`visibility: hidden` — kutu yerinde
kalır, canvas görünür) ekran görüntüsü alınır, her metin dikdörtgeninin
ARKASINDAKİ en koyu piksel bulunur, kontrast o pikselle hesaplanır. Aşağıdaki
tablo 375 / 768 / 1280 / 1536 viewport'unda ölçülen değerlerin **en
düşüğünü** taşır (2026-09-02, üretim derlemesi):

| Metin | En düşük kontrast | Hangi viewport | Eşik |
|---|---|---|---|
| `h1` (ink-900) | 20.08:1 | dördü de | 4.5:1 |
| Lede (ink-700) | 14.59:1 | 1280 | 4.5:1 |
| Eyebrow (teal-700) | 7.73:1 | dördü de | 4.5:1 |
| Yardım satırı (ink-600) | 5.26:1 | 1280 | 4.5:1 |
| Kanıt şeridi (ink-600) | 4.75:1 | 375 | 4.5:1 |

**Blobun üstündeki ikincil metin ink-500 değil ink-600'dür.** Yardım satırı
ve kanıt şeridi kürenin sıcak gövdesinin tam üstünde durur. ink-500 krem
tuvalde zaten 4.34:1 veriyor (§5'teki ~4.8 tahmini ölçümle doğrulanmıyor),
kürenin üstünde 2.89'a iniyordu. ink-600 en kötü pikselde bile eşiğin
üstünde. Bu, tuvalin ikincil metin rengini genel olarak değiştirmez —
yalnız blobun üstünde duran metin için geçerli yerel kuraldır.

**Sonuç durumu (skor kartı).** Kart `.v2-surface` yarı saydam beyazdır;
kürenin bir kısmı arkasından geçer. Aynı yöntemle ölçülen en düşükler:

| Kart içi metin | En düşük kontrast | Eşik |
|---|---|---|
| Skor sayısı (ink-900) | 20.62:1 | 4.5:1 |
| Bant cümlesi (ink-700) | 16.39:1 | 4.5:1 |
| Aktif bant etiketi (ink-900) | 15.90:1 | 4.5:1 |
| Pasif bant etiketleri (ink-600) | 6.64:1 | 4.5:1 |

Pasif bant etiketleri de aynı sebeple ink-600'e çekildi: ink-500 kart
zemininde 4.46:1'de kalıyordu. Kural `.tool-band-scale text:not([data-active])`
üzerinden CSS'te — `BandScale` bileşeni OG kartıyla ortaktır, oraya dokunulmaz.

Yeni bir araç sayfası eklendiğinde bu ölçüm tekrarlanır. Ölçüme custom cursor
noktası (`mix-blend-difference`, z-60) dahil EDİLMEZ — o zemin değil imleçtir.
Aynı gerekçeyle ölçek işaretçisi (`[data-part="marker"]`) de dışarıda kalır:
etiketin sınırlayıcı kutusuna girer ama harflerin arkasında değildir.

Değerler `src/lib/v2/anim-config.ts` → `BLOB_TOOL_HERO`. Varyant seçimi
`V2Chrome`'da route listesinden yapılır; sayfa dosyasına gömülmez.
