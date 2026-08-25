---
name: indoles-design-tokens
description: >
  INDOLES design system (v2, teknik-editorial) token enforcer. Herhangi bir UI kodu
  (React component, page, layout, Tailwind class, CSS, canvas/WebGL sahne parametresi)
  yazılırken veya güncellenirken ZORUNLU çağrılır. Tetikleyici: "component yaz", "sayfa
  yap", "section ekle", "stil ver", "card tasarla", "hero yap", "motion ekle",
  "responsive yap", veya bir UI dosyasında (.tsx, .css) stil değişikliği.
---

# INDOLES Design Tokens Enforcer — v2

UI implementasyonunun `docs/04-design-system-principles.md` (v2, teknik-editorial) ve
`src/lib/design/tokens.ts`'e uyumunu sağlar. v1'in "editorial-serif" dili ADR-015 ile
emekliye ayrıldı — Fraunces, brand mavisi, Framer Motion referansları geçersizdir.

## Adım 0 — Otorite Zinciri (her tetiklenmede aç, hafızadan okuma)

```
docs/04-design-system-principles.md  →  src/lib/design/tokens.ts
→  src/styles/globals.css (@theme + primitives)
→  src/styles/sections.css (Tailwind'le ifade edilemeyen yapılar)
→  src/lib/v2/anim-config.ts + src/styles/v2.css (v2 motion katmanı, ADR-016)
→  component
```

- `tailwind.config.ts` otorite DEĞİLDİR — yalnız content path'leri içerir; token'ların
  Tailwind karşılığı `globals.css` `@theme` bloğundadır.
- Değişiklik sırası zorunlu: docs/04 → tokens.ts → globals.css → component. Sapma ADR ister.

## Adım 1 — Tipografi

| Kural | Değer |
|-------|-------|
| Aileler | Lexend (display/h1–h6/metrik), Inter (gövde/form/buton), JetBrains Mono (eyebrow, sayaç, teknik etiket) |
| Skala | `text-step--2` … `text-step-8` fluid clamp; sayfa kodunda tercih: semantik `typography-*` sınıfları |
| Başlık ağırlığı | Tek ağırlık: **600** (ADR-017). 700 fazla kalın, 500 cılız — ikisi de yasak |
| Display ölçeği | Yalnız `V2PageHeader` kullanır. Bölüm başlığı `h1`, kart başlığı `h2` ölçeği. Sayfa başına tek `<h1>` |
| İtalik vurgu | `accent-em` (light) / `accent-em-gold` (dark) — başlık başına EN FAZLA BİR |
| Tracking | Punto büyüdükçe sıkışır (`--tracking-display` −0.035em), mono etikette açılır (+0.18em) |

Yasak: `text-[23px]` arbitrary değer, `font-bold`/`font-light`, inline `font-family`,
manuel `clamp()`, all-caps okuma metni (uppercase yalnız mono etiket/eyebrow'da).

## Adım 2 — Renk

| Kural | Değer |
|-------|-------|
| Marka skalası | `teal-*` (11 basamak, `teal-700` #2C5566 = logo + birincil interaction). `brand-*` aynı değerlerin legacy alias'ı — YENİ KODDA `teal-*` |
| Accent | `gold-*` — YALNIZ dark yüzeyde vurgu + teknik illüstrasyon. **Light zeminde CTA rengi gold DEĞİL, siyahtır** (`.btn-primary` = ink-900) |
| Tuval | `bg` (#FAFAF7 krem). Bölüm seviyesinde opak zemin verme — krem tuval tektir (docs/04 §12.10) |
| Yüzey | Kart/panel beyaz (`bg-pure`/`surface-1`) veya yarı saydam `.v2-surface`. Saf beyaz kart OK — bu v2'de serbesttir |
| Siyah | `ink-900` (#000000) bir *yüzey* rengidir (topbar, footer, birincil buton). Gövde paragrafı asla saf siyah değil: metin `ink-600`, başlık `ink-800/900` |
| Dark bölümler | Vision, Footer, kapanış kartı — `color-scheme: dark` set edilir. Site geneli dark mode YOK; `dark:` utility ile tema kurma yasak |
| Semantic | success #3F7A56 · warning = gold · danger #A8453D · info = teal (ayrı renk yok) |

Yasak: `bg-[#...]` literal hex, Tailwind default nötrleri (`slate-*`, `gray-*`, `zinc-*`),
teal + gold dışında accent.

## Adım 3 — Spacing, Grid, Container

- 4px skala; Tailwind default `--spacing` ile örtüşür → `p-[14px]` gibi arbitrary yasak.
- Bölüm ritmi: sıkı 96px · temel 140px · geniş 180px.
- Container: `.ds-container` (1440) standart, `.ds-container-wide` (1680) nav/track,
  `--container-prose` (1120) manifesto. **Aynı sayfada her bölüm aynı sol kenardan başlar** —
  karışık container yasak.
- Breakpoint: 375 / 768 / 1280 / 1536 + davranış eşiği **900px** (sticky yatay track ve
  timeline bu değerin altında dikey/snap-slider düzene döner).
- Sabit chrome telafisi: TopBar (36px) + Nav yükseklikleri `v2.css` değişkenlerinden okunur;
  üç ayrı yerde sabit tutulmaz.

## Adım 4 — Radius ve Elevation

- Radius kasıtlı küçük: `sm 2` · `md 4` · `lg 6` · `xl 8` · `2xl 10px`. 10px üstü yalnız
  tam yuvarlak eleman (nokta, avatar). "Yumuşak uygulama kutusu" radius'u yasak.
- Gölge çok katmanlı ve **teal tonlu** ambient taşır: `shadow-sm/md/lg/xl` + `shadow-3d`
  (inset highlight → teal hairline → orta → uzak). Tek katman `shadow-[0_4px...]` literal yasak.
- Kartlarda `backdrop-filter` yok (compositing bütçesi, docs/04 §12.10).

## Adım 5 — Primitives (yeniden icat etme)

Tek kaynak `globals.css`: `.eyebrow` (+ `-gold`, `-bare`), `.btn` (+ `-primary`, `-ghost`,
`-invert`, `-lg`), `.reveal` (+ `.d1–.d5`, tek `RevealObserver` — bölüm başına observer
kurma), `.mono`, `.tabular`, `.divider`, `.grain`, `.marquee-track`.

`.arrow` hover'ı `translate(2px, -2px)` — marka imzasıdır, tüm CTA'larda aynı.
Yeni primitive gerekiyorsa `src/components/ui/` altında tek kaynak olarak tanımla;
page içinde inline primitive yazma.

## Adım 6 — Motion

Framer Motion KULLANILMAZ (ana siteden kaldırıldı). İki katman var:

| Katman | Kaynak | Araç |
|--------|--------|------|
| Ana site | `globals.css` token'ları: `--ease-out` `cubic-bezier(0.16,1,0.3,1)`, `--ease-in-out`; süreler 300/400/600/1000ms | CSS transition + Canvas 2D (`WaveCanvas`, `ParticleField`) |
| v2 sahne | `src/lib/v2/anim-config.ts` — Lenis, cursor, blob, koreografi sabitleri | Three.js/GLSL + GSAP ScrollTrigger + Lenis |

Kurallar:
- Hiçbir süre/easing/threshold component'e gömülmez — token veya `anim-config.ts`.
- **`prefers-reduced-motion` sözleşmesi kabul kriteridir:** geçişler 0.01ms, `.reveal`
  anında görünür, canvas tek kare çizip durur, sayaç hedefe atlar, Lenis kapanır.
- **İçeriğe erişim animasyona bağlanmaz:** scroll-bağlı gezinme (yatay track) hareket
  kısıtında kaldırılmaz, native snap-slider'a düşer.
- Performans bütçesi (docs/04 §12.6): blob detail 32, DPR tavanı 1.75, `will-change` yok.

## Adım 7 — Reddedilenler (görüldüğü anda düzelt, gerekirse ADR öner)

| Pattern | Neden |
|---------|-------|
| Stok fotoğraf, genel amaçlı ikon seti | Her görsel bir mekanizma anlatır (docs/04 §1) |
| Dekoratif parçacık yağmuru, sonsuz döngü animasyonu | Süsleme değil iletişim (mevcut `ParticleField` ağ metaforudur — istisna değil, mekanizma) |
| Teal + gold dışında accent | Tek marka skalası |
| Light zeminde gradient buton | Birincil aksiyon siyahtır |
| All-caps okuma metni | Yalnız mono etiket uppercase |
| Negative-margin ile binen kartlar | Basılı kenar disiplini |
| Doğrulanmamış istatistik/metrik | İçerik dürüstlüğü — §10; sayı ya `cases.ts`/içerik katmanından türer ya girmez (`TODO(burak)` ile işaretle) |
| Site geneli dark mode | Yalnız tanımlı dark bölümler |
| `bg-paper` benzeri bölüm zemini | Krem tuval tek; zemin ancak kontrast gerekçesiyle |

## Adım 8 — Erişilebilirlik (WCAG 2.2 AA)

- Focus: `2px solid teal-700`, 2px offset, `radius-md` — tarayıcı varsayılanı kullanılmaz.
- Her `<section>` `aria-labelledby` veya `aria-label` taşır.
- Dekoratif her şey (`WaveCanvas`, `ParticleField`, filigran, glyph) `aria-hidden="true"`.
- Touch hedefi min 44×44px; skip link zorunlu; kapalı çekmece `inert`.
- Kontrast tablosu docs/04 §3'ten doğrulanır (gövde `ink-600`/bg ≈ 7.4:1).

## Adım 9 — Pre-Commit Lint

```
1. Literal renk (#xxx, rgb() — sections.css'in yorumlu alpha varyantları hariç) → grep
2. Arbitrary Tailwind value ([NNpx], [NNrem]) → grep
3. slate-/gray-/zinc-, dark: utility, font-bold → grep
4. Component içine gömülü süre/easing → grep (transition={{, duration: 0.)
5. src/components/ui/ dışında primitive tanımı → review
6. prefers-reduced-motion handling → motion içeren dosyada zorunlu
7. focus-visible state → interactive element dosyasında zorunlu
8. Kaynaksız sayı/metrik → review (§10)
```

## Çıktı Formatı

```markdown
## Token Compliance Report
| Kontrol | Durum |
|---------|-------|
| Literal değer yok | OK / FAIL |
| teal/gold disiplini (yeni kodda teal-*) | OK / FAIL |
| Tipografi (600, typography-*, tek h1, tek accent-em) | OK / FAIL |
| Container/section ritmi doğru | OK / FAIL |
| Reddedilenler listesi temiz | OK / FAIL |
| Reduced motion sözleşmesi | OK / FAIL / NA |
| WCAG 2.2 AA (focus, aria, 44px) | OK / FAIL |
| İçerik dürüstlüğü (kaynaksız sayı yok) | OK / FAIL |

## Eklenen/Değişen Token'lar
- {liste — docs/04 + tokens.ts + globals.css üçü birden güncellendi mi?}

## ADR Gerekiyor mu?
{evet/hayır + gerekçe}
```

## Subagent Kullanımı

`indoles-design-craftsman` ajanı her UI turunda bu skill'i çağırır. Skill'in disiplini
"ajan davranışı" değil, "UI yazım protokolü"dür.
