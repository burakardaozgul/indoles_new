---
name: indoles-design-tokens
description: >
  INDOLES design system token enforcer. Herhangi bir UI kodu (React component, page, layout,
  Tailwind class, CSS, inline style, Framer Motion config, shadcn varyantı) yazılırken/güncellenirken
  ZORUNLU çağrılır. Renk, tipografi, spacing, radius, shadow, breakpoint, z-index, motion
  duration/easing değerlerinin literal yazımını yasaklar; tüm değerler `lib/design/tokens.ts`
  ve `tailwind.config.ts`'den okunur. docs/04-design-system-principles.md'yi authoritative
  kabul eder. Yeni token gereksinimi tespit ederse önce token dosyasını günceller, sonra
  kullanır. Editorial-minimalist disipline aykırı pattern'leri (gradient, glassmorphism,
  particle, stok foto, dark mode, çoklu accent renk, agresif easing) reddeder. Tetikleyici:
  "component yaz", "sayfa yap", "Tailwind class ekle", "stil ver", "card tasarla", "hero yap",
  "section ekle", "button styling", "color/spacing/font ayarla", "motion ekle", "responsive yap",
  veya bir UI dosyası (.tsx, .jsx, .css, .scss) içinde stil değişikliği.
---

# INDOLES Design Tokens Enforcer

UI implementasyonunun docs/04-design-system-principles.md ve `lib/design/tokens.ts`'e %100 uyumlu olmasını sağlar. Her UI dosyası bu skill'in disiplininden geçer.

## Adım 0 — Otorite Kaynakları Yükle

Her tetiklenmede şu dosyaları aç ve aktif tut:

1. `docs/04-design-system-principles.md` — Tasarım felsefesi, tipografi/renk/spacing/motion prensipleri (authority)
2. `lib/design/tokens.ts` — Type-safe token tanımları (kod kaynağı)
3. `tailwind.config.ts` — Tailwind extension (token'ların class karşılığı)
4. `components/ui/` — Mevcut component library (yeniden icat etme!)

Hafızadan değil, dosyadan oku.

## Adım 1 — Token Otorite Hiyerarşisi

```
docs/04 → lib/design/tokens.ts → tailwind.config.ts → components/ui/* → kullanım yeri
```

Bir değer kullanmadan önce zinciri yukarı doğru takip et. Eksik halka varsa önce yukarıyı tamamla, sonra kullan.

## Adım 2 — Literal Değer Yasakları

### 2a. Renk

| Yasak | Doğru |
|-------|-------|
| `bg-[#FBFAF7]`, `text-[#1A1F24]`, `style={{ color: '#567B97' }}` | `bg-paper`, `text-ink-900`, `text-brand-500` |
| `bg-white`, `text-black` | `bg-paper`, `text-ink-900` (saf beyaz/siyah yasak — docs/04 §3) |
| `bg-gray-100`, `text-slate-700` | `bg-surface-1`, `text-ink-700` (Tailwind default neutral'lar yasak) |

### 2b. Tipografi

| Yasak | Doğru |
|-------|-------|
| `text-[23px]`, `text-[1.4rem]` | `text-h2`, `text-body-lg` (token-defined scale) |
| `font-bold`, `font-light` | `font-medium`, `font-semibold` (sadece token'da olan weight'ler) |
| `font-family: 'Inter'` inline | Token'dan: `font-body`, `font-heading`, `font-mono` |
| Fluid scale manuel `clamp()` | Token zaten fluid — direkt class kullan |

### 2c. Spacing

| Yasak | Doğru |
|-------|-------|
| `p-[14px]`, `gap-[18px]`, `mt-[2.3rem]` | Tailwind scale (`p-4`, `gap-5`, `mt-10`) |
| `space-y-[24px]` | `space-y-6` |
| Inline `style={{ padding: '20px' }}` | className |

### 2d. Radius / Shadow

| Yasak | Doğru |
|-------|-------|
| `rounded-[6px]`, `rounded-[18px]` | `rounded-md`, `rounded-lg` (token'da tanımlı |
| `shadow-[0_4px_12px_rgba(0,0,0,0.1)]` | `shadow-card`, `shadow-elevated` |

### 2e. Z-Index

| Yasak | Doğru |
|-------|-------|
| `z-[9999]`, `z-50` ad-hoc | Token'dan: `z-base`, `z-dropdown`, `z-modal`, `z-toast` |

### 2f. Motion (Framer Motion)

| Yasak | Doğru |
|-------|-------|
| `transition={{ duration: 0.3, ease: 'easeInOut' }}` literal | Token'dan import: `motionTokens.duration.md`, `motionTokens.ease.standard` |
| Random easing array `[0.42, 0, 0.58, 1]` | Token easing curve'leri |

## Adım 3 — Editorial-Minimalist Anti-Pattern Reddi

docs/04 §1'deki "minimalizm" prensibinin koruyucusu. Şu pattern'ler GÖRÜLDÜĞÜ ANDA reddedilir:

| Pattern | Neden Yasak |
|---------|-------------|
| Linear/radial gradient (CSS `linear-gradient`, Tailwind `bg-gradient-*`) | Editorial-minimalist tek renk disiplini |
| Glassmorphism (`backdrop-blur`, transparent overlay'ler) | Trend, zaman dışı değil |
| Particle / animated background / Three.js sahnesi | Dekorasyon değil iletişim, prensibi |
| Stok fotoğraf | docs/04'te explicitly yasak |
| Dark mode CSS class'ları (`dark:bg-*`) | Faz 1'de dark mode YOK (ADR ile değişir) |
| Brand mavisi dışında accent renk | Tek renk disiplini — semantic dışında accent yok |
| Saf beyaz/siyah (`#fff`, `#000`) | Sıcak kağıt + sıcak mürekkep prensibi |
| Drop shadow ile derinlik abartısı | Hairline + spacing ile derinlik |
| Skeuomorphic detaylar | Düz, editorial |
| Default Tailwind UI / shadcn temaları | INDOLES design dilini override etmeli |
| 60+ özellikli component import (örn. `@nextui-org/*`) | Bundle + brand uyumsuz |

## Adım 4 — Component Reuse Kuralı

Yeni bir UI pattern'e ihtiyaç duyulduğunda:

1. **Önce ara:** `components/ui/` içinde mevcut mu?
2. **Mevcutsa:** Onu kullan. Varyant gerekirse `cva` ile varyant ekle.
3. **Yoksa:** `components/ui/` altında **tek kaynak** olarak tanımla.
4. **Sayfa içinde icat etme:** Page component'i içinde inline UI primitive yazma — hep `components/ui/`'dan import.

## Adım 5 — Responsive ve Breakpoint Disiplini

Token breakpoint'leri (docs/04'ten geliyor):

| Token | Değer | Kullanım |
|-------|-------|----------|
| (default) | 0-374px | Çok dar — fallback |
| `sm` | 375px+ | Mobile (iPhone baseline) |
| `md` | 768px+ | Tablet |
| `lg` | 1280px+ | Desktop |
| `xl` | 1536px+ | Wide desktop |

### Kurallar

- **Mobile-first:** Default class mobile, `md:` ve `lg:` ile büyüt
- **Container query (Tailwind v4):** Section-bazlı responsive için `@container` + `@md:` kullanımı tercih edilir
- **Fluid type:** `text-display-2xl` zaten clamp() içerir — manuel responsive type yazma
- **Touch target:** Mobile interaktif element min 44×44px (WCAG 2.2 AA)
- **Container max-width:** `max-w-content` (token'da tanımlı), genelde `mx-auto`
- **Grid → stack:** `grid-cols-3` mobile'da `grid-cols-1`, breakpoint'lerde aç

## Adım 6 — Erişilebilirlik (WCAG 2.2 AA — docs/04'ten)

Her interactive component için ZORUNLU:

| Kontrol | Gereksinim |
|---------|-----------|
| Keyboard navigation | Tab order doğal, `tabIndex` manipülasyonu yalnızca gerekli yerde |
| Focus state | `focus-visible:ring-2 ring-brand-500 ring-offset-2` (token'dan) |
| ARIA labels | Icon-only button'larda `aria-label` zorunlu |
| Kontrast | Body text brand-700 (6.8:1), `brand-500` body text'te kullanma |
| Reduced motion | `prefers-reduced-motion` ile motion bypass |
| Screen reader | Decorative icon'da `aria-hidden`, anlamlıda `<title>` veya label |
| Form | `<label htmlFor>` zorunlu, `aria-describedby` ile help/error |
| Heading hierarchy | h1 → h2 → h3 atlama yok, sayfa başına bir h1 |

## Adım 7 — Yeni Token Eklenmesi Gerekiyorsa

Akış:

1. **Stop:** Önce `lib/design/tokens.ts`'i güncelle, sonra kullan
2. **docs/04'ü güncelle:** Yeni token'ın felsefe gerekçesi belgede olmalı
3. **Tailwind config'e ekle:** Token Tailwind class'ı olarak görünür olmalı
4. **ADR gerekiyor mu?** Sapma içeriyorsa `docs/decisions/ADR-XXX.md` (`indoles-doc-architect` ajanını çağır)
5. **Sonra kullan:** Component'te kullan

## Adım 8 — Pre-Commit Lint Akışı

UI değişikliği yazıldıktan sonra şu kontrolleri uygula:

```
1. Literal renk var mı? (#xxx, rgb(), hsl()) → grep
2. Arbitrary Tailwind value var mı? ([NN], [NNpx], [NNrem]) → grep
3. Yasak Tailwind class var mı? (gradient, dark:, bg-white, text-black) → grep
4. components/ui/ dışında primitive tanımı var mı? → manuel review
5. font-family inline var mı? → grep
6. Inline style attribute var mı? → grep (motion gerekçesi hariç)
7. Reduced motion handling var mı? → motion içeren dosyada zorunlu
8. focus-visible state tanımlı mı? → interactive element içeren dosyada zorunlu
```

Bir tane bile yakalanırsa düzeltilir, ondan sonra completion.

## Çıktı Formatı

UI değişikliği yapıldıktan sonra:

```markdown
## Token Compliance Report

| Kontrol | Durum |
|---------|-------|
| Literal renk yok | OK / FAIL |
| Arbitrary value yok | OK / FAIL |
| Editorial-minimalist anti-pattern yok | OK / FAIL |
| components/ui/ reuse | OK / FAIL |
| Responsive (mobile-first) | OK / FAIL |
| WCAG 2.2 AA (focus, label, kontrast) | OK / FAIL |
| Reduced motion handled | OK / FAIL / NA |

## Eklenen/Değişen Token'lar
- {liste}

## ADR Gerekiyor mu?
{evet/hayır + gerekçe}
```

## Subagent Kullanımı

Bu skill `indoles-design-craftsman` ajanı tarafından her UI tasarım/implementasyon turunda otomatik çağrılır. Ajan kendisi bağımsız çalışsa bile bu SKILL.md'nin disiplini "ajan davranışı" değil, "UI yazım protokolü"dür.
