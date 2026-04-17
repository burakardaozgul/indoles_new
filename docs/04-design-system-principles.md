# Tasarım Sistem Prensipleri (Design System Principles)

Bu doküman INDOLES web platformunun görsel dilini tanımlar: tipografi, renk, grid, spacing, motion, ikonografi, component prensipleri ve erişilebilirlik kuralları. İlk kod implementasyonundan önce tamamlanmış olması zorunludur (bkz. CLAUDE.md Bölüm 8). Tasarım kararları alternatifsiz ve kesindir — bu belge seçenekler sunmaz, kararları dokümante eder.

**Bağımlılıklar:**
- Upstream: `01-vision-positioning.md` (persona'lar, ton gerilimi), `03-brand-voice-tone.md` (editorial dil, mikro-copy)
- Downstream: `lib/design/tokens.ts` (kod-seviyesi token tanımları), `tailwind.config.ts`, `components/ui/*`
- İlişkili: `02-information-architecture.md` (sayfa tipolojileri, layout gereksinimleri)

**Token kaynağı:** Bu belgede tanımlanan her değer `lib/design/tokens.ts` dosyasında type-safe olarak export edilir. Tailwind config bu dosyadan beslenir. Belge ile token dosyası arasında tutarsızlık varsa, belge otoritedir — token dosyası güncellenir.

---

## 1. Tasarım Felsefesi

Bir tasarım sistemi sadece renk ve font seçmek değildir; markanın görsel dilini kodlamaktır. INDOLES'in görsel dili editorial-minimalist light olarak tanımlanır. Bu üç kelime kasıtlıdır.

### Editorial

"Editorial" demek gazete veya dergi demek değil. Bir tasarımın editorial olması, içeriğin görsel hiyerarşisinin okunabilirliği yönetmesi demektir: tipografi kendi başına konuşur, whitespace bilgiyi çerçeveler, detaylar (hairline, drop cap, marginalia) zenginlik katar ama dikkat çalmaz. Referans ailesi: Stripe Press'in kitap estetiği, Pentagram'ın tipografik disiplini, a16z Future'ın editorial grid'i, McKinsey Insights'ın veri sunumu.

Bu referanslar ilham kaynağıdır, authority değildir. Bir UI kararı için "Stripe Press böyle yapıyor" yetmez; karar bu belgede tanımlanan prensiplere uymalıdır (bkz. CLAUDE.md Bölüm 8, Inspiration vs. Authority).

### Minimalist

Minimalizm boşluk bırakmak değil, gereksizi çıkarmaktır. Her görsel öğe bir iş yapar — dekorasyon için değil, iletişim için vardır. Gradient yok, particle flow yok, glassmorphism yok, stok fotoğraf yok. Zenginlik yüzeyden değil derinlikten gelir: Fraunces'ın optical size varyasyonları, hairline rule'ların nefes alan zarfları, marginalia'nın editorial katmanı.

### Light

Sıcak kırık-beyaz kağıt yüzeyleri üzerine koyu mürekkep — bir basılı yayının dijital karşılığı. Dark mode Faz 1'de yoktur. Gerekçe: editorial-light dil dark base ile çelişir, tek renk disiplini (brand mavisi) dark palette'te yeterli kontrast katmanı üretmez, ve dark mode doğru yapılmak için ayrı bir token seti gerektirir — bu da launch öncesi kapsam dışıdır. Dark mode ileride ADR ile değerlendirilir.

### İki Persona, Bir Görsel Dil

Persona ayrımı renkte değil, içerikte ve layout'ta yapılır. Sanayici de ticaretçi de aynı kağıt üzerinde, aynı Fraunces başlıklarla, aynı brand mavisiyle karşılanır. Fark: cümlelerin ritmi (`03-brand-voice-tone.md`), öne çıkan vaka çalışması tipi, section sıralaması ve veri sunumu formatı. Görsel dil sabittir; ton ve içerik persona'ya göre adapte olur.

---

## 2. Tipografi Sistemi

Tipografi, editorial tasarımın birincil aracıdır. INDOLES'in tipografi sistemi üç font ailesinden oluşur — her biri kesin bir rol taşır, çapraz kullanım yoktur.

### Font Aileleri

| Aile | Font | Rol | Kaynak | Format |
|------|------|-----|--------|--------|
| **Heading** | Fraunces | Display, H1-H3, pullquote, drop cap | Google Fonts | Variable (weight + opsz) |
| **Body + UI** | Inter | Body, caption, label, button, input, nav, H4 | Google Fonts | Variable (weight) |
| **Mono** | JetBrains Mono | Kod bloğu, metrik chip, tabular number | Google Fonts | Variable (weight) |

**Neden Fraunces?** Old-style serif'lerin sıcaklığını taşır ama variable font olarak modern kontrol sunar. Optical size aksı (opsz 9–144) tek bir font dosyasıyla display'den heading'e geçiş sağlar. Ücretsiz, açık kaynak, performance-friendly.

**Neden Inter?** UI fontlarının de facto standardı. Geniş dil desteği, tutarlı metrikler, x-height oranı okunabilirlik için optimize. shadcn/ui ile doğal uyum.

**H4 neden Inter?** Fraunces 18px ve altında dekoratif karakterini kaybeder, okunabilirlik avantajı kalmaz. H4 boyutunda Inter'ın netliği daha değerli.

### Fraunces Optical Size Eşleşmeleri

Fraunces'ın `opsz` aksı 9 (SuperSoft — en dekoratif, yuvarlak terminaller) ile 144 (Sharp — en konvansiyonel) arasında çalışır. Büyük boyutlarda dekoratif karakter editorial imza yaratır; küçük boyutlarda okunabilirlik kazanır.

| Token | opsz | Karakter | Kullanım |
|-------|------|----------|----------|
| display-2xl | 9 | SuperSoft | Hero headline — maksimum editorial imza |
| display-xl | 9 | SuperSoft | Section hero, büyük manifesto başlığı |
| display-lg | 18 | Soft | Sayfa başlığı, pillar landing hero |
| h1 | 18 | Soft | Ana sayfa bölüm başlığı |
| h2 | 48 | Normal | Alt-bölüm başlığı |
| h3 | 72 | Sharp | Detay başlığı, body'ye yakın boyut |
| pullquote | 9 | SuperSoft | Dekoratif vurgu çekmesi |
| drop cap | 9 | SuperSoft | Prose açılış harfi |

CSS'te: `font-variation-settings: 'opsz' 9;` veya `font-optical-sizing: auto;` ile tarayıcı kontrolüne bırakma. INDOLES'te manuel kontrol tercih edilir — her token için opsz değeri sabittir.

### Tipografi Scale

Base: 16px = 1rem. Fluid responsive: clamp() ile mobile → desktop arası akışkan geçiş.

| Token | Font | Desktop | Mobile | clamp() | Line-height | Weight | Letter-spacing | opsz |
|-------|------|---------|--------|---------|-------------|--------|----------------|------|
| display-2xl | Fraunces | 4.5rem (72px) | 2.75rem (44px) | `clamp(2.75rem, 4vw + 1rem, 4.5rem)` | 1.1 | 400 | -0.02em | 9 |
| display-xl | Fraunces | 3.5rem (56px) | 2.25rem (36px) | `clamp(2.25rem, 3vw + 1rem, 3.5rem)` | 1.1 | 400 | -0.02em | 9 |
| display-lg | Fraunces | 2.75rem (44px) | 2rem (32px) | `clamp(2rem, 2vw + 1rem, 2.75rem)` | 1.15 | 400 | -0.01em | 18 |
| h1 | Fraunces | 2.25rem (36px) | 1.75rem (28px) | `clamp(1.75rem, 1.5vw + 1rem, 2.25rem)` | 1.2 | 500 | -0.01em | 18 |
| h2 | Fraunces | 1.75rem (28px) | 1.5rem (24px) | `clamp(1.5rem, 1vw + 0.75rem, 1.75rem)` | 1.25 | 500 | 0 | 48 |
| h3 | Fraunces | 1.375rem (22px) | 1.25rem (20px) | `clamp(1.25rem, 0.5vw + 0.75rem, 1.375rem)` | 1.3 | 600 | 0 | 72 |
| h4 | Inter | 1.125rem (18px) | 1.125rem (18px) | sabit | 1.4 | 600 | 0 | — |
| body-lg | Inter | 1.25rem (20px) | 1.125rem (18px) | `clamp(1.125rem, 0.5vw + 0.75rem, 1.25rem)` | 1.6 | 400 | 0 | — |
| body-md | Inter | 1rem (16px) | 1rem (16px) | sabit | 1.6 | 400 | 0 | — |
| body-sm | Inter | 0.875rem (14px) | 0.875rem (14px) | sabit | 1.5 | 400 | 0 | — |
| caption | Inter | 0.8125rem (13px) | 0.8125rem (13px) | sabit | 1.4 | 400 | 0.01em | — |
| label | Inter | 0.75rem (12px) | 0.75rem (12px) | sabit | 1.4 | 500 | 0.02em | — |

**Scale prensipleri:**

- Fraunces weight'leri 400-600 aralığında: display boyutlarda 400 (zarif, hava veren), heading boyutlarda 500-600 (otoriter, yapısal)
- Negatif letter-spacing yalnızca display boyutlarda — büyük metinde harfler optik olarak daha ayrık görünür, sıkılaştırma dengeler
- body-md (16px) ve altı fluid değil, sabit — küçük metin boyutlarında fluid scale okunabilirliği bozar
- Line-height display'den body'ye doğru artar: display'de satırlar birbirine yakın (vurgu), body'de ayrık (okunabilirlik)

### Drop Cap Kuralı

Uzun prose bölümlerinin açılışında ilk harf 3–4 satır yüksekliğinde, Fraunces opsz 9 (SuperSoft). Dekoratif bir editorial dokunuş — okuyucuya "bu metin okunmaya değer" sinyali verir.

**Nerede kullanılır:** Journal yazıları, manifesto metni, Hakkımızda sayfasındaki uzun editorial bölümler.

**Nerede kullanılmaz:** Hizmet sayfaları, paket detay, form sayfaları, araç sonuçları — buralarda drop cap gereksiz dekorasyon olur.

**CSS yaklaşımı:**

```css
.drop-cap::first-letter {
  font-family: 'Fraunces', Georgia, serif;
  font-variation-settings: 'opsz' 9;
  font-weight: 400;
  float: left;
  font-size: 3.5em;
  line-height: 0.8;
  padding-right: 0.08em;
  color: var(--ink-900);
}
```

---

## 3. Renk Sistemi

INDOLES'in renk sistemi tek renk disiplinine dayanır: brand mavisi + nötrler + semantic renkler. İkinci bir brand accent rengi, gradient veya dekoratif renk kategorisi yoktur. Bu kısıtlama bilinçlidir — editorial tasarımda renk kısıtlaması zenginlik kaybı değil, netlik kazanımıdır.

### Palet

#### Base Surface (Kağıt Hissi)

Saf beyaz (#FFFFFF) kullanılmaz. Tüm yüzeyler sıcak kırık-beyaz tonlardadır — basılı bir kitabın kağıt hissi.

| Token | Hex | Rol | Kullanım Örneği |
|-------|-----|-----|-----------------|
| paper | #FBFAF7 | Ana tuval | Sayfa arka planı, tüm body |
| surface-1 | #F5F3EE | İkincil bölüm | Alternatif section bg, footer bg |
| surface-2 | #EDEAE3 | Kart arka planı | Default card bg, sidebar bg |
| surface-3 | #E4E0D7 | Elevated/hover state | Hover bg, active state, selected row |

#### Ink (Metin — Pure Black Değil)

Pure black (#000000) kullanılmaz. Metin renkleri sıcak koyu tonlardadır — dijital mürekkep, siyah değil.

| Token | Hex | Rol | Kullanım Örneği | Paper Üzerinde Kontrast |
|-------|-----|-----|-----------------|------------------------|
| ink-900 | #1A1F24 | Başlık, vurgu | H1-H4, bold vurgu, nav aktif | ~14:1 (AAA) |
| ink-700 | #3E454D | Body metin | Paragraf, liste, tablo hücresi | ~8.8:1 (AAA) |
| ink-500 | #6B7380 | Meta, caption | Tarih, yazar, yardımcı metin | ~4.6:1 (AA) |
| ink-300 | #A5ABB3 | Placeholder, disabled | Input placeholder, disabled buton metin | ~2.2:1 (dekoratif) |

**Not:** ink-300 WCAG AA'yı karşılamaz ve karşılaması gerekmez — yalnızca placeholder ve disabled state için kullanılır, bu kullanımlar WCAG'de kontrast muafiyetindedir.

#### Brand (INDOLES Mavisi — Logo Rengi)

Tek marka rengi. Tüm interactive, accent ve vurgu kullanımları bu skaladandır.

| Token | Hex | Rol | Kullanım Örneği | Paper Üzerinde Kontrast |
|-------|-----|-----|-----------------|------------------------|
| brand-50 | #E8EEF3 | Light hover, selection | Text selection bg, hover tint | — (bg kullanım) |
| brand-100 | #D1DCE6 | Muted fill | Tag bg, subtle highlight | — (bg kullanım) |
| brand-200 | #A8BECE | Tint, dekoratif | İllüstrasyon tint, hairline | — (dekoratif) |
| brand-300 | #839FB5 | Orta tint | Data viz ikincil seri | ~3.1:1 |
| brand-400 | #6E8EA6 | Orta vurgu | Data viz üçüncü seri | ~3.6:1 |
| brand-500 | #567B97 | Logo rengi | Icon, border, large text link | ~4.3:1 (AA large text) |
| brand-600 | #4A6B85 | Koyu vurgu | Visited link, active state | ~5.3:1 (AA) |
| brand-700 | #3E5C73 | Birincil interaction | Button bg, text link, primary CTA | ~6.8:1 (AA) |
| brand-800 | #2E4557 | Hover state | Button hover bg | ~8.9:1 (AAA) |
| brand-900 | #1F3040 | En derin vurgu | Footer bg vurgu, dark accent | ~11.5:1 (AAA) |

**Kritik kontrast kuralı:** brand-500 body text boyutunda (16px ve altı) WCAG AA'yı karşılamaz (~4.3:1 < 4.5:1). Bu yüzden:
- Body metin içindeki linkler: **brand-700** kullanır (6.8:1)
- Large text (18px+ veya 14px+ bold): brand-500 kullanılabilir
- Icon, border, non-text element: brand-500 kullanılabilir (non-text contrast minimum 3:1)

#### Semantic Renkler

Sessiz, editorial tonlarda. Göze vurmayan ama anlamını net ileten renkler. Her semantic kategoride 3 varyant: -50 (arka plan), -500 (ikon/border), -700 (metin).

| Kategori | Token | Hex | Rol | Paper Kontrast |
|----------|-------|-----|-----|----------------|
| **Success** | success-50 | #EDF5F0 | Alert/toast bg | — (bg) |
| | success-500 | #3F7A56 | Icon, border, large text | ~4.9:1 (AA) |
| | success-700 | #2D5A3E | Metin | ~7.6:1 (AAA) |
| **Warning** | warning-50 | #FDF6E8 | Alert/toast bg | — (bg) |
| | warning-500 | #B88A2F | Icon, border | ~3.0:1 (non-text) |
| | warning-700 | #8A6720 | Metin | ~5.1:1 (AA) |
| **Danger** | danger-50 | #FAEDEC | Alert/toast bg | — (bg) |
| | danger-500 | #A8453D | Icon, border, large text | ~5.7:1 (AA) |
| | danger-700 | #7D3230 | Metin | ~8.5:1 (AAA) |
| **Info** | — | = brand-500/700 | Ayrı renk yok, brand kullanılır | (brand ile aynı) |

**Kritik kontrast kuralı:** warning-500 metin olarak kullanılamaz (~3.0:1 < 4.5:1). Warning metni her zaman warning-700 ile yazılır. warning-500 yalnızca icon ve border için geçerlidir.

**Semantic kullanım senaryoları:**

| Renk | Ne Zaman Kullanılır | Örnek |
|------|---------------------|-------|
| Success | Pozitif sonuç, tamamlanmış işlem, pozitif metrik | Form gönderim onayı, ödeme başarılı, "Brief başarıyla gönderildi", vaka çalışmasında maliyet düşüşü (pozitif sonuç) |
| Warning | Dikkat gerektiren ama kritik olmayan durum | Eksik opsiyonel alan, bekleyen işlem, draft kaydedildi ama gönderilmedi, yaklaşan deadline |
| Danger | Hata, yıkıcı işlem onayı, gerçek olumsuz durum | Validation hatası, brief silme onayı, başarısız ödeme, sunucu hatası |
| Info (brand) | Nötr bilgilendirme | Tooltip, yardım metni, "Profiliniz güncellendi", feature duyurusu |

**Dikkat:** Vaka çalışmalarında "maliyet %18 düştü" veya "CAC %47 azaldı" pozitif sonuçlardır — success rengi alır, danger değil. Danger yalnızca kullanıcının dikkatini çekmesi gereken gerçek olumsuz durumlar içindir.

### Tek Renk Disiplini

Brand accent veya ikinci marka rengi yoktur. Bu kısıtlamanın üç gerekçesi var:

1. **Editorial netlik:** Tek renk, okuyucunun dikkatini yönetmeyi kolaylaştırır — brand mavisi gördüğünde "bu interactive veya vurgulanmış" bilir
2. **Renk körlüğü uyumu:** Tek renk + nötrler + semantic (anlam taşıyan) renkler, renk körlüğü olan kullanıcılar için doğal olarak daha erişilebilir
3. **Bakım kolaylığı:** Daha az renk = daha az tutarsızlık riski, daha kolay dark mode geçişi (ileride)

### Data Visualization Renk Disiplini

Vaka çalışmaları grafikleri, dashboard metrikleri ve veri görselleri tek renk disiplinini korur. Çoklu veri serisi gerektiğinde:

| Seri | Token | Kullanım |
|------|-------|----------|
| Birincil | brand-500 | Ana veri serisi |
| İkincil | brand-300 | Karşılaştırma serisi |
| Üçüncül | brand-700 | Vurgu serisi |
| Dördüncül | ink-700 | Referans çizgisi |
| Beşincil | ink-500 | Gri referans |

Ek renk kategorisi eklenmez. Gerçekten anlamsal ayrıştırma gerekiyorsa (pozitif/negatif metrik) semantic renkler kullanılır: success-500 (pozitif), danger-500 (negatif).

### Selection ve Hover State Renkleri

| State | Değer | Kullanım |
|-------|-------|----------|
| Text selection | brand-50 bg (#E8EEF3) | `::selection { background: var(--brand-50); }` |
| Link hover | brand-800 text | Body link hover'da brand-700 → brand-800 |
| Button hover (primary) | brand-800 bg | brand-700 → brand-800 |
| Row hover (tablo) | surface-3 bg | Tablo satırı hover |
| Card hover | elevation-2 shadow | Kart yükselme efekti |

---

## 4. Spacing ve Grid

Spacing sistemi 4px base unit üzerine kurulur. Her spacing değeri 4'ün katıdır — rastgele piksel değeri kullanılmaz. Grid sistemi 12-kolon asimetrik editorial yapıdadır — simetrik kutu düzeni değil.

### Spacing Scale

| Token | Değer | Piksel | Kullanım |
|-------|-------|--------|----------|
| spacing-0 | 0 | 0px | — |
| spacing-1 | 0.25rem | 4px | Hairline offset, ince ayar |
| spacing-2 | 0.5rem | 8px | Icon-text gap, tight padding |
| spacing-3 | 0.75rem | 12px | Input padding, compact gap |
| spacing-4 | 1rem | 16px | Card inner padding, base gap |
| spacing-5 | 1.25rem | 20px | Form field gap |
| spacing-6 | 1.5rem | 24px | Section iç padding, standart gap |
| spacing-8 | 2rem | 32px | Gutter, bölüm arası gap |
| spacing-10 | 2.5rem | 40px | Section iç boşluk |
| spacing-12 | 3rem | 48px | Section padding (mobile) |
| spacing-16 | 4rem | 64px | Section padding (desktop) |
| spacing-20 | 5rem | 80px | Büyük bölüm arası boşluk |
| spacing-24 | 6rem | 96px | Hero padding |
| spacing-32 | 8rem | 128px | Major section arası |
| spacing-40 | 10rem | 160px | Sayfa üst/alt padding |
| spacing-48 | 12rem | 192px | Maksimum whitespace |

**Spacing disiplini:** "Normal" spacing = spacing-2 (8px). Interface'i crowd etmeyen ama kalabalık da yapmayan temel birim. Liste elemanları arasında divider çizgisi değil spacing ile ayrıştırma yapılır (zero-divider policy). İstisna: hairline rules bölüm ayraçlarında editorial kural olarak kullanılır (bkz. Bölüm 6).

### Grid Sistemi

| Parametre | Değer |
|-----------|-------|
| Kolon sayısı | 12 |
| Max-width (container) | 1280px |
| Gutter | 32px (spacing-8) |
| Margin (mobile) | 16px (spacing-4) |
| Margin (tablet) | 24px (spacing-6) |
| Margin (desktop) | auto (centered) |

### Breakpoints

| Token | Değer | Yaklaşım |
|-------|-------|----------|
| mobile | 375px | Default (mobile-first) |
| tablet | 768px | min-width media query |
| desktop | 1280px | min-width media query |
| wide | 1536px | min-width media query |

### Asimetrik Layout Pattern'ları

Editorial tasarımın simetrik kutu düzeninden ayrıldığı nokta asimetrik grid kullanımıdır. Asimetri rastgele değil, kasıtlıdır — her pattern belirli bir iletişim amacı taşır.

| Pattern | Kolon Dağılımı | Kullanım | Gerekçe |
|---------|----------------|----------|---------|
| Hero split | 8/4 | Hero section, büyük başlık + yan görsel/metrik | Sol geniş → başlık dominantlığı |
| Editorial split | 7/5 | İçerik + yan detay, metin + vaka özeti | Dengesizlik dikkat çeker, statik hissettirmez |
| Full-width | 12/12 | Referans logoları, CTA bandı, tam-genişlik section | Belirli section'larda nefes |
| Prose centered | 6 (ortalanmış) | Journal yazısı, manifesto, uzun editorial | max-width 680px, okunabilirlik optimumu |

**Prose max-width kuralı:** Uzun metin blokları (journal, manifesto, hizmet detay prose'u) 680px genişliği aşmaz. Bu editorial kitap standardıdır — 60-75 karakter/satır okunabilirliğin altın aralığıdır. Tailwind'de: `max-w-prose` (varsayılan 65ch) veya custom `max-w-[680px]`.

**Sol-dar sağ-geniş prensibi:** Editorial section'larda sol kolon dar (etiket, numara, meta), sağ kolon geniş (içerik). Bu pattern Stitch belgesinden taşınmıştır — ama "her zaman" değil, "editorial bölümlerde" geçerlidir. Hero'da ters dönebilir (başlık solda geniş, görsel sağda dar).

---

## 5. Radius ve Elevation

Köşe yuvarlaklığı ve gölge sistemi, editorial-minimalist dilin fiziksel katman hissini oluşturur. Keskin köşeler soğuk, aşırı yuvarlak köşeler çocuksu — INDOLES'in radius'u ikisinin arasında, hafif yumuşatılmış ama disiplinli.

### Radius Scale

| Token | Değer | Kullanım |
|-------|-------|----------|
| radius-none | 0 | Hairline rule, tam-kenar section |
| radius-sm | 4px | Chip, small badge, tag |
| radius-md | 8px | Button, input, small card, toast |
| radius-lg | 12px | Card, modal, dropdown |
| radius-xl | 16px | Hero card, featured section |
| radius-2xl | 24px | Nadiren — özel kullanım (büyük featured card) |
| radius-full | 9999px | Avatar, pill badge, toggle |

### Elevation Sistemi (Soft Layering)

Gölge sistemi pure black shadow kullanmaz. Tüm gölgeler ink-900 (#1A1F24, sıcak koyu) veya ink-500 (#6B7380) tonlarındadır — soğuk siyah değil, kağıt üzerindeki doğal gölge.

| Token | Tanım | CSS Değeri | Kullanım |
|-------|-------|-----------|----------|
| elevation-0 | Düz yüzey | Yok (ne shadow ne border) | Default surface, inline element |
| elevation-1 | Ghost hairline | `inset 0 0 0 1px rgba(107,115,128, 0.08)` | Subtle kart ayrımı, liste öğesi |
| elevation-2 | Soft card | `0 8px 16px -2px rgba(26,31,36, 0.04)` | Standard kart, dropdown |
| elevation-3 | Floating | `0 16px 32px -4px rgba(26,31,36, 0.06), inset 0 0 0 1px rgba(107,115,128, 0.12)` | Modal, floating panel, featured card |
| elevation-4 | Ambient nav | elevation-2 + `backdrop-filter: blur(8px)` | Sticky header, floating nav |

**Kurallar:**
- Pure black (`rgba(0,0,0,...)`) shadow kesinlikle yasak — ink-900 veya ink-500 tonları kullanılır
- Glassmorphism yasak — backdrop-blur maksimum 8px (elevation-4), 24px veya üzeri kesinlikle yok
- Elevation 4'ün `backdrop-blur: 8px` değeri performans sınırıdır — bu değerin üzerine çıkmak Safari/iOS'ta jank yaratır
- Kart gölgeleri hover'da bir üst elevation'a geçebilir (elevation-1 → elevation-2) — bu tek izin verilen gölge animasyonu

---

## 6. Gizli Zenginlik Katmanları (Editorial Detay)

Minimalizm "hiçbir şey yok" demek değildir. Editorial tasarımın gücü, dikkatli bakıldığında ortaya çıkan detaylardadır. Bu katmanlar ilk bakışta görünmez ama genel deneyime derinlik, zanaat hissi ve prestij katar.

### Hairline Rules

İnce çizgiler bölüm ayraçları olarak kullanılır — listelerde değil, editorial section geçişlerinde.

```css
.hairline {
  border-top: 1px solid rgba(107, 115, 128, 0.12); /* ink-500 @ 12% */
}
```

**Nerede:** Major section'lar arası (hero → referanslar, referanslar → video, vb.), footer üstü, sidebar bölüm ayraçları.

**Nerede değil:** Liste öğeleri arasında (zero-divider policy — spacing ile ayrıştırma), tablo satırları arasında (yalnızca thead altında), kart içi bölümlerde.

### Drop Cap

Bölüm 2'de tanımlanan tipografi kuralı burada görsel bağlamıyla tamamlanır.

- **Boyut:** 3-4 satır yüksekliğinde (font-size: ~3.5em)
- **Font:** Fraunces, opsz 9 (SuperSoft), weight 400
- **Renk:** ink-900 — body metinden ayrışmaz, sadece boyutla dikkat çeker
- **Float:** left, sağında 0.08em padding
- **Kullanım yerleri:** Journal yazıları, manifesto, Hakkımızda editorial bölümleri
- **Kullanılmayan yerler:** Hizmet sayfaları, paket detay, form sayfaları, araç sonuçları

### Marginalia

Desktop genişliğinde (1280px+) ana içerik bloğunun yanında dar bir kolonda yer alan yardımcı bilgi katmanı: anahtar cümle, istatistik, yazar notu veya çapraz referans.

**Desktop davranışı (≥1280px):**
- Prose centered (6 kolon) layout'ta: sağ veya sol 2-3 kolonluk alanda
- Editorial split (7/5) layout'ta: dar kolonda inline olarak
- Tipografi: caption boyutu (0.8125rem), ink-500 rengi
- Alignment: prose satır yüksekliğine hizalı (optik olarak ilgili paragrafın karşısında)

**Mobile/tablet davranışı (<1280px):**
- Normal prose akışına düşer
- Subtle farklılaşma: surface-2 bg, radius-md, spacing-4 padding ile blockquote benzeri görünüm
- Tam genişlik, ana akış içinde

### Scroll-Linked Revelation

Major bölüm girişlerinde sayfa aşağı kaydırıldığında öğeler nazikçe görünür hale gelir. Agresif değil, fark edilir ama baskın değil.

| Parametre | Değer |
|-----------|-------|
| Animasyon | fade-in + translate-up |
| Translate mesafesi | 8-16px (öğe boyutuna göre) |
| Süre | 800ms |
| Easing | `cubic-bezier(0.25, 0.1, 0.25, 1)` (editorial easing) |
| Tetikleme | Viewport'un %20'sine girdiğinde (Intersection Observer) |
| Stagger | Aynı section'daki öğeler 100ms aralıkla (maksimum 5 öğe) |

**prefers-reduced-motion davranışı:** Tüm translate ve süre devre dışı kalır. Öğe anında tam opacity'de görünür (opacity: 0 → 1, süre: 0ms). Animasyon yok, içerik kaybı yok.

### Pullquote

Uzun prose içinde öne çıkarılmış alıntı veya vurgu cümlesi.

| Parametre | Değer |
|-----------|-------|
| Font | Fraunces, opsz 9 (SuperSoft) |
| Boyut | body-lg (1.25rem) veya h3 eşdeğeri, bağlama göre |
| Weight | 400 (italic değil, regular) |
| Renk | ink-900 |
| Sol border | 2px solid brand-500 |
| Sol padding | spacing-6 (24px) |
| Margin | spacing-12 (48px) üst/alt |

### Blockquote (Standart Alıntı)

Prose içindeki düzenli alıntılar için — pullquote'dan daha mütevazı.

| Parametre | Değer |
|-----------|-------|
| Font | Inter (body akışında kalır) |
| Boyut | body-md (1rem) |
| Renk | ink-700 |
| Sol border | 2px solid brand-200 |
| Sol padding | spacing-6 (24px) |
| Stil | Italic |

---

## 7. Motion Prensipleri

Hareket, INDOLES'in tasarım dilinde bir lüks değil araçtır. Doğru kullanıldığında kullanıcıya bağlam verir (bu nereden geldi, nereye gidiyor), yanlış kullanıldığında dikkat çalar ve performans düşürür. Framer Motion birincil animasyon kütüphanesidir.

### Timing Tokens

| Token | Süre | Kullanım |
|-------|------|----------|
| duration-micro | 150ms | Button hover, icon rotation, tooltip appear/disappear |
| duration-interaction | 300ms | Accordion open/close, dropdown, modal enter/exit, tab geçişi |
| duration-editorial | 800ms | Scroll-linked reveal, hero entrance, page section animate-in |

### Easing Tokens

| Token | Değer | Kullanım |
|-------|-------|----------|
| ease-out | `cubic-bezier(0.0, 0.0, 0.2, 1)` | Giren öğeler (modal appear, dropdown open) |
| ease-in | `cubic-bezier(0.4, 0.0, 1, 1)` | Çıkan öğeler (modal dismiss, toast exit) |
| ease-in-out | `cubic-bezier(0.4, 0.0, 0.2, 1)` | Hareket eden öğeler (slide, resize) |
| ease-editorial | `cubic-bezier(0.25, 0.1, 0.25, 1)` | Scroll-linked reveal, hero animasyonları |

### Neyi Animate Ederiz

| Öğe | Animasyon | Timing | Easing |
|-----|-----------|--------|--------|
| Button hover | color + background-color | micro (150ms) | ease-out |
| Button ok ikonu (→) | translate-x: 2px | micro (150ms) | ease-out |
| Accordion panel | height + opacity | interaction (300ms) | ease-out |
| Dropdown menu | opacity + scale(0.95→1) + translateY(-4px→0) | interaction (300ms) | ease-out |
| Modal | opacity + scale(0.98→1) | interaction (300ms) | ease-out |
| Toast | translateY(16px→0) + opacity | interaction (300ms) | ease-out |
| Tooltip | opacity + translateY(4px→0) | micro (150ms) | ease-out |
| Scroll reveal | opacity + translateY(8-16px→0) | editorial (800ms) | ease-editorial |
| Kart hover | box-shadow (elevation geçişi) | micro (150ms) | ease-out |
| Page route transition | opacity | interaction (300ms) | ease-in-out |

### Neyi Animate Etmeyiz

| Öğe | Neden |
|-----|-------|
| Text color (prose içinde) | Okunabilirliği bozar, dikkat dağıtır |
| Layout shift (grid kolon değişimi) | CLS (Cumulative Layout Shift) — Core Web Vitals cezası |
| Font size değişimi | Reflow tetikler, performans maliyeti yüksek |
| Background pattern/texture | Dikkat çalar, editorial dille çelişir |
| Veri yükleme (spinner) | Skeleton kullan, spinner değil — skeleton mevcut layout'u korur |
| Infinite loop animasyon | Dikkat çalar, erişilebilirlik sorunu — tek istisna: loading skeleton pulse |

### prefers-reduced-motion Davranışı

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Tüm motion süreleri pratikte sıfıra düşer. Scroll-linked reveal'lar anında görünür (opacity: 0 → 1, translate yok). Sayfa geçişleri anında olur. Tek istisna: loading skeleton'ın pulse animasyonu korunabilir (kullanıcıya "yükleniyor" sinyali vermek için gerekli) ama süre artırılır (2s → 4s).

---

## 8. İkonografi ve Görsel Dil

İkonlar ve görseller editorial-minimalist dilin sessiz ama etkili araçlarıdır. Kural basit: her görsel öğe bir iş yapar, dekorasyon için kullanılmaz.

### İkon Kütüphanesi ve Stili

| Parametre | Değer | Gerekçe |
|-----------|-------|---------|
| Kütüphane | Lucide | shadcn/ui default, tutarlı stroke, zengin set, aktif bakım |
| Stroke weight | Light (1.5px) | Inter Medium ile optik uyum, Thin (1px) çok zayıf, Regular (2px) çok kalın |
| Fill kullanımı | Yasak | Sadece outline — filled ikonlar editorial dille çelişir |
| Boyut skalası | 16 / 20 / 24 / 32 | 16: inline metin yanı, 20: button içi, 24: standart, 32: hero/feature |
| Renk | Bağlama göre ink veya brand | Metin yanında ink-700, interactive'de brand-500/700 |

### Fotoğraf Politikası

**Stok fotoğraf kesinlikle yasaktır.** Stok fotoğraf prestijli bir marka için en büyük itibar riskidir — "sahte" hissi verir, herkesin kullandığı görüntüler markayı jenerikleştirir.

Fotoğraf kullanılacaksa:
- **Özel çekim:** Dokümantasyon/reportaj stili, sahne kurgulanmamış, doğal aydınlatma
- **Post-production:** Doygunluk düşük (editorial ton), kontrast hafif artırılmış, sıcak ton
- **Konu:** Gerçek çalışma ortamı, gerçek insanlar, gerçek süreçler — "mutlu iş insanı stok" değil
- **Alternatif (fotoğraf yokken):** Soyut geometrik illüstrasyon veya tipografik çözüm — kötü stok fotoğraftan iyidir

### İllüstrasyon Kuralları

Abstract, minimal, geometrik. Brand paletinden: brand-200/300 + ink-500 tonlarında.

| Kural | Açıklama |
|-------|----------|
| Palet | brand-200, brand-300, ink-500 — diğer renkler yok |
| Stil | Geometrik, flat, tek kalınlık çizgi (ikon stiliyle uyumlu) |
| Detay seviyesi | Düşük — kavramı iletecek minimum çizgi |
| İnsan figürü | Yok — soyut formlar, geometrik şekiller |
| 3D | Yok — flat only |

### Kesin Yasaklar

| Yasak | Gerekçe |
|-------|---------|
| Gradient (CTA, arka plan, hiçbir yerde) | Flat disiplin kararı, gradient 2018-2022 trend'i, editorial dille çelişir |
| Glassmorphism | Performans yükü (Safari/iOS), 2020-2022 trend'i, editorial değil |
| Particle flow | Performans yükü, 2020-2022 trend'i, dikkat çalar |
| Pure white (#FFFFFF) arka plan | paper (#FBFAF7) kullanılır — saf beyaz soğuk ve dijital hisseder |
| Stok fotoğraf | Prestij kırar, jenerik hisseder |
| Emoji (dekoratif) | CLAUDE.md kuralı — yalnızca işlevsel ikon olarak |

---

## 9. Component Tasarım Prensipleri

INDOLES'in component sistemi shadcn/ui üzerine kuruludur. shadcn/ui, dependency değil pattern kaynağıdır — component'ler projeye kopyalanır ve INDOLES'in token'larıyla özelleştirilir. Bu yaklaşım tam kontrol sağlar.

### Token → Tailwind → Component Akışı

```
lib/design/tokens.ts  →  tailwind.config.ts  →  components/ui/*.tsx
     (kaynak)              (config)               (kullanım)
```

1. `lib/design/tokens.ts` tüm değerleri type-safe olarak tanımlar
2. `tailwind.config.ts` bu değerleri import ederek Tailwind theme'ini yapılandırır
3. Component'ler Tailwind class'larını kullanır — literal değer (`text-[#567B97]`) yasak, token referansı (`text-brand-700`) zorunlu
4. Yeni bir token gerekirse: önce `tokens.ts` güncelle, sonra Tailwind config'e ekle, sonra kullan. Sıralama tersine çevrilmez.

Tailwind v4 entegrasyonunun teknik detayları (CSS-first config, `@theme` direktifi) `05-tech-architecture.md`'de tanımlanır.

### Component Organizasyonu

```
components/ui/
├── button.tsx
├── input.tsx
├── select.tsx
├── checkbox.tsx
├── radio.tsx
├── toggle.tsx
├── textarea.tsx
├── card.tsx
├── dialog.tsx
├── toast.tsx
├── tooltip.tsx
├── badge.tsx
├── avatar.tsx
├── breadcrumb.tsx
├── tabs.tsx
├── table.tsx
├── alert.tsx
├── separator.tsx         # hairline rule component
├── skeleton.tsx
└── editorial/
    ├── drop-cap.tsx      # editorial-only component'ler
    ├── pullquote.tsx
    └── marginalia.tsx
```

`editorial/` alt dizini INDOLES'e özgü editorial component'leri barındırır — shadcn/ui'da karşılığı yoktur.

### Button Varyantları

Her butonun temel kuralı: **sentence case** (All Caps kesinlikle yasak), sağ ok işareti (`→`) primary ve secondary'de.

#### Primary Button

| Parametre | Değer |
|-----------|-------|
| Background | brand-700 |
| Text | paper |
| Border | Yok |
| Radius | radius-md (8px) |
| Padding | spacing-3 (12px) vertical, spacing-6 (24px) horizontal |
| Height | 44px (touch-friendly minimum) |
| Font | Inter, body-md (1rem), weight 500 |
| İkon | Sağda `→` oku |
| Hover | bg → brand-800, ok `translate-x: 2px` (150ms ease-out) |
| Active | bg → brand-900 |
| Focus | ring-2 ring-brand-500 ring-offset-2 ring-offset-paper |
| Disabled | bg → ink-300, text → paper, cursor: not-allowed |

```tsx
// Kullanım örneği
<Button variant="primary">Görüşme Rezerve Et →</Button>
```

#### Secondary Button

| Parametre | Değer |
|-----------|-------|
| Background | transparent |
| Text | brand-700 |
| Border | 1px solid brand-500 |
| Radius | radius-md (8px) |
| Hover | bg → brand-50, ok `translate-x: 2px` |
| Active | bg → brand-100 |

#### Tertiary Button

| Parametre | Değer |
|-----------|-------|
| Background | transparent |
| Text | ink-700 |
| Border | Yok |
| Underline | brand-500 @ 40% opacity |
| Hover | underline → brand-500 @ 100% opacity |
| Active | text → ink-900 |

#### Ghost Button

| Parametre | Değer |
|-----------|-------|
| Background | transparent |
| Text | ink-500 |
| Border | Yok |
| Hover | bg → surface-2 |
| Kullanım | Kapatma (X), ikincil aksiyonlar, toolbar |

#### Destructive Button

| Parametre | Değer |
|-----------|-------|
| Background | transparent |
| Text | danger-700 |
| Border | 1px solid danger-500 |
| Hover | bg → danger-50 |
| Kullanım | Brief silme, hesap kapatma onayı |

### Input Varyantları

| Parametre | Değer |
|-----------|-------|
| Border | 1px solid ink-300 |
| Radius | radius-md (8px) |
| Height | 44px |
| Padding | spacing-3 (12px) horizontal |
| Font | Inter, body-md |
| Label | Inter, label boyutu (0.75rem), ink-700, weight 500 |
| Placeholder | Inter, body-md, ink-300 |
| Focus | ring-2 ring-brand-500 ring-offset-2 ring-offset-paper |
| Error | border → 1px solid danger-500, altında danger-700 metin |
| Disabled | bg → surface-1, border → ink-300 @ 50%, text → ink-300 |

### Card Varyantları

| Varyant | Background | Radius | Elevation | Kullanım |
|---------|-----------|--------|-----------|----------|
| Default | surface-2 | radius-lg (12px) | elevation-1 | Standart kart (hizmet, paket, danışman) |
| Elevated | paper | radius-lg (12px) | elevation-2 | Öne çıkan kart (featured case study) |
| Featured | paper | radius-xl (16px) | elevation-3 | Hero kart, büyük vaka çalışması |

Kart hover'da bir üst elevation'a geçer (elevation-1 → elevation-2), 150ms ease-out.

---

## 10. Accessibility (WCAG 2.2 AA)

Erişilebilirlik, özellik değil gerekliliktir. INDOLES'in tasarım sistemi WCAG 2.2 AA seviyesini taban olarak alır — her renk kombinasyonu, her interactive element ve her hareket bu standarda uyar.

### Kontrast Tablosu

Tüm metin + arka plan kombinasyonlarının kontrast oranları:

| Kombinasyon | Kontrast | WCAG AA | Kullanım Notu |
|-------------|----------|---------|---------------|
| ink-900 on paper | ~14:1 | AAA | Başlıklar, bold vurgu |
| ink-700 on paper | ~8.8:1 | AAA | Body metin, tablo |
| ink-500 on paper | ~4.6:1 | AA | Caption, meta, yardımcı metin |
| ink-300 on paper | ~2.2:1 | Fail | Yalnızca placeholder/disabled (muaf) |
| brand-700 on paper | ~6.8:1 | AA | Body link, primary button text | 
| brand-500 on paper | ~4.3:1 | AA-large | Yalnızca large text (≥18px), icon, border |
| paper on brand-700 | ~6.8:1 | AA | Primary button üzerindeki metin |
| paper on brand-800 | ~8.9:1 | AAA | Hover state button metin |
| success-700 on paper | ~7.6:1 | AAA | Success metin |
| success-500 on paper | ~4.9:1 | AA | Success icon, large text |
| warning-700 on paper | ~5.1:1 | AA | Warning metin |
| warning-500 on paper | ~3.0:1 | Fail-text | Yalnızca icon/border (non-text 3:1 OK) |
| danger-700 on paper | ~8.5:1 | AAA | Error metin |
| danger-500 on paper | ~5.7:1 | AA | Error icon, border |
| success-700 on success-50 | ~7.2:1 | AAA | Alert box içi metin |
| warning-700 on warning-50 | ~5.0:1 | AA | Alert box içi metin |
| danger-700 on danger-50 | ~8.0:1 | AAA | Alert box içi metin |

**Uygulama kuralı:** Yeni bir renk kombinasyonu kullanılmadan önce kontrast oranı bu tabloya eklenir ve AA doğrulaması yapılır.

### Focus State Tasarımı

Tüm interactive element'ler (button, input, link, select, checkbox, radio, tab, accordion trigger) için:

```css
:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px var(--paper),       /* ring-offset: 2px, paper rengi */
    0 0 0 4px var(--brand-500);   /* ring: 2px, brand rengi */
}
```

Tailwind karşılığı: `focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-paper`

| Parametre | Değer | Gerekçe |
|-----------|-------|---------|
| Tetikleme | `focus-visible` | Yalnızca keyboard nav'da görünür, mouse click'te gizli |
| Ring kalınlık | 2px | WCAG 2.2 minimum 1.5px, 2px güvenli marj |
| Ring renk | brand-500 | Marka tutarlılığı, paper üzerinde yeterli görünürlük |
| Ring offset | 2px | Ring'i element kenarından ayırarak görünürlük artırır |
| Offset renk | paper (#FBFAF7) | Ring ile element arasında kağıt rengi boşluk |

Focus ring tüm component'lerde tutarlıdır — component bazlı farklılaşma yoktur. Destructive button'da bile brand-500 ring kullanılır (focus != semantic anlam).

### Keyboard Navigation

| Öğe | Klavye Davranışı |
|-----|-----------------|
| Button | Enter veya Space ile tetikleme |
| Link | Enter ile tetikleme |
| Dropdown/Select | Arrow keys ile seçenekler arası, Enter ile seçim, Escape ile kapatma |
| Modal/Dialog | Escape ile kapatma, Tab focus'u modal içinde kilitli (focus trap) |
| Accordion | Enter veya Space ile aç/kapa, Arrow keys ile accordion'lar arası |
| Tab group | Arrow keys ile tablar arası, Tab ile tab panel'e geçiş |
| Toast | Otomatik kaybolma dışında, focus'lanabilir değil (aria-live ile duyurulur) |

### Semantic HTML ve ARIA

| Prensip | Kural |
|---------|-------|
| Semantic HTML önce | `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<header>`, `<footer>` — ARIA landmark yerine native element |
| Heading hiyerarşisi | Sıralı: H1 → H2 → H3, atlama yok (H1 → H3 yasak) |
| Button vs. Link | Navigasyon = `<a>`, aksiyon = `<button>` — `<div onClick>` yasak |
| Görsel metin | Her `<img>` için anlamlı `alt` veya dekoratif ise `alt=""` + `role="presentation"` |
| Form | Her input'un `<label>` ile ilişkilendirilmesi zorunlu (`htmlFor` + `id`) |
| Live region | Toast ve dinamik içerik için `aria-live="polite"`, acil hatalar için `aria-live="assertive"` |
| Skip link | Sayfa başında gizli "İçeriğe atla" linki — keyboard kullanıcılar için |

### Renk Körlüğü Uyumu

Tek renk disiplini (Bölüm 3) doğal olarak renk körlüğü dostudur: bilgi asla yalnızca renkle iletilmez. Ek kurallar:

- Grafiklerde renk + pattern (çizgi stili, dolgu pattern'ı) birlikte kullanılır
- Semantic renklerde ikon + metin birlikte: sadece kırmızı border yetmez, yanında hata ikonu + hata metni gerekir
- Success/danger ayrımı yalnızca renk ile değil, ikon (check mark / X) ile de yapılır
- Data visualization'da brand scale'in farklı tonları (500, 300, 700) yeterli açıklık farkı sağlar — ek renk kategorisi gerekmez

### prefers-reduced-motion

Bölüm 7'de detaylandırıldı. Özet: tüm motion süreleri pratikte sıfıra düşer, scroll reveal'lar anında görünür, skeleton pulse korunabilir.

### prefers-color-scheme

Faz 1'de dark mode yoktur. `prefers-color-scheme: dark` algılansa bile light tema uygulanır. Kullanıcıya "dark mode ileride gelecek" gibi bir bildirim gösterilmez — sessizce light kalır.

---

## 11. Stitch Belgesi Taşıma/Reddetme Notları

INDOLES'in önceki tasarım referans belgesi (Stitch belgesi) bu design system'e dönüştürülürken bazı kararlar korunmuş, bazıları reddedilmiştir. Detaylı gerekçeler `docs/decisions/ADR-002-stitch-design-reject.md`'de yer alır. Aşağıda özet.

### Taşınan Kararlar

| Karar | Bu Belgedeki Karşılığı |
|-------|------------------------|
| Asimetrik layout prensibi | Bölüm 4 — editorial section'larda 8/4, 7/5 split |
| Logo mavisi birincil interaction anchor | Bölüm 3 — brand-500 (#567B97) |
| Pure black yasağı | Bölüm 3 — ink-900 (#1A1F24) kullanılır |
| Standart shadow yasağı | Bölüm 5 — soft/tonal shadow, ink-900 bazlı |
| Tutarlı icon stroke weight | Bölüm 8 — Light (1.5px), Lucide |
| "Interface crowd etme" prensibi | Bölüm 4 — spacing-2 (8px) normal birim, zero-divider |
| Zero-divider policy | Bölüm 4 + 6 — listelerde çizgi yok, hairline yalnızca editorial section ayraçlarında |

### Reddedilen Kararlar

| Karar | Ret Gerekçesi |
|-------|---------------|
| Dark base surface (#767779) | WCAG AA fail, editorial-light dille çelişir |
| Deep Sea Blue + Industrial Slate palette | Tech-SaaS dark dili, INDOLES editorial-light dili değil |
| Particle flow animations | Performans yükü, 2020-2022 trend'i, editorial değil |
| Glassmorphism (24px backdrop blur) | Performans + Safari/iOS sorunları + editorial değil |
| Gradient CTA (135° linear) | Flat disiplin tercih edildi |
| All Caps button + letter-spacing | 2010'lar tech dili, editorial sentence-case kararı ile çelişir |
| Tertiary kahverengi (#57390c) | Tek renk disiplini kararıyla çelişir |
| Overlapping negative margin cards | Responsive fail riski, bakım zorluğu |

---

## 12. Açık Sorular

- **Dark mode timeline:** Faz 2'de değerlendirilecek. Gerekirse ADR ile karar alınır, ayrı token seti oluşturulur.
- **Özel fotoğraf prodüksiyonu:** Launch'a kadar fotoğraf yerine tipografik ve geometrik çözümler kullanılır. Özel çekim prodüksiyonu launch sonrası planlanır.
- **Fraunces italic kullanımı:** Şu an yalnızca regular (upright) tanımlı. İtalic varyantın pullquote veya emphasis'te kullanılıp kullanılmayacağı implementation sırasında değerlendirilir.
- **Component Storybook:** Faz 2'de opsiyonel. Faz 1'de component katalogu doğrudan kod ve bu belge üzerinden yönetilir.
- **Motion library alternatifi:** Framer Motion bundle size'ı büyükse, CSS-only animation'lara geçiş ADR ile değerlendirilir.
- **Tailwind v4 @theme entegrasyonu:** tokens.ts'in Tailwind v4'ün CSS-first config yapısıyla nasıl bağlanacağı `05-tech-architecture.md`'de detaylandırılır.

---

## 13. Cinematic Hero Zone (istisna bölge)

> **Kapsam:** Bu bölüm **sadece anasayfanın ilk 100vh hero alanı** için geçerlidir. Diğer tüm sayfalar ve hero sonrası section'lar light editorial paleti kullanmaya devam eder. Karar gerekçesi: `docs/decisions/ADR-003-cinematic-hero-zone.md`.

### 13.1 Amaç
İlk saniyede ziyaretçiye "INDOLES: prestij + cesur teknoloji" izlenimi vermek. TIWIS benzeri dark metallic blue dalga arkaplan, floating glass nav, massive wordmark kompozisyonu.

### 13.2 Palet (yalnız hero zone'da kullanılır)

| Token | Hex | Kullanım |
|---|---|---|
| `hero.void` | `#05080F` | En derin karanlık — gradient alt ucu |
| `hero.deep` | `#0A1628` | Ana dark navy — base |
| `hero.metal` | `#1B3A5C` | Metallic mid-tone — blob katmanı |
| `hero.light` | `#3B6FA0` | Işık spot rengi — mouse-tracked highlight |
| `hero.paper` | `#F5F3EE` | Wordmark + tagline text |
| `hero.accent` | `#A8BECE` | Hover/focus underline (hero zone'unda link accent) |

Hero palette'i `brand.*` token'larından **bağımsızdır** — marka mavisi `brand-500` değişmemiştir.

### 13.3 Motion

- **Yaklaşım:** Canvas 2D, 3 radial-gradient blob. İki blob sinüs-bazlı yavaş drift, bir blob mouse-tracked. Canvas 0.5x render scale; CSS `filter: blur(40px)` ile metallic bulutsu geçiş.
- **Frame rate:** `requestAnimationFrame`, 60fps hedef. Hero zone'dan scroll ile çıkıldığında loop durur (IntersectionObserver).
- **Accessibility:**
  - `prefers-reduced-motion: reduce` → motion durur, statik gradient mesh gösterilir.
  - Viewport width < 768px → motion disable (pil + perf), statik fallback.
- **Mouse interaction:** `pointermove` ile ana "ışık" blob'unun konumu güncellenir. Lerp ile yumuşak takip.

### 13.4 Floating glass nav

| Özellik | Değer |
|---|---|
| Konum | `position: fixed; top: 16px; left: 50%; translate-x: -50%` |
| Background | `rgba(251, 250, 247, 0.06)` (hero üstünde) → `rgba(251, 250, 247, 0.85)` (scroll sonrası) |
| Backdrop-filter | `blur(16px) saturate(140%)` |
| Border | `1px solid rgba(245, 243, 238, 0.12)` (hero üstü), `1px solid var(--color-surface-2)` (scroll sonrası) |
| Radius | `full` (pill) |
| Padding | 8px 20px |
| Typography | `body-sm`, medium weight |
| Text color | `hero.paper` (hero) → `ink-700` (scroll sonrası) |

### 13.5 Hero içeriği (kompozisyon)

- **Wordmark:** `INDOLES` — Fraunces, `clamp(5rem, 12vw, 12rem)`, weight 500, letter-spacing -0.04em, color `hero.paper`. Position: bottom-left, 48px inset.
- **Tagline:** 2 satır, `body-lg`, color `hero.paper`. Position: sağ orta, max-width 32ch.
- **CTA pill (opsiyonel):** Sol orta, outline beyaz pill, `body-sm`.

### 13.6 Hero → Light geçişi

Hero zone (100vh) biter bitmez bir sonraki section **tam light** paletle açılır. Arada gri ara tonu, gradient fade yok — sharp cut, editorial sadelikle. Sadece floating nav rengi ~80vh noktasında opaklaşmaya başlar.

### 13.7 Performans bütçesi
- Hero canvas JS: < 8 KB gzipped
- İlk paint'te canvas boş başlar, ilk `requestAnimationFrame`'de dolar (FOUC engelleme için CSS fallback gradient)
- LCP kandidatı wordmark veya tagline — canvas **LCP'ye girmez**

### 13.8 Accessibility kontrolleri
- Wordmark vs `hero.deep`: kontrast ≈ 15:1 ✓ AA+
- Floating nav text vs `hero.deep`: kontrast ≈ 13:1 ✓ AA+
- `prefers-reduced-motion` respect edilir
- `aria-hidden` → canvas'a uygulanır (decorative), wordmark semantic `<h1>`
