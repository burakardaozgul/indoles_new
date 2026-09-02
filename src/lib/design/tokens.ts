/**
 * INDOLES Design Tokens — v2 (Claude Studio disiplini)
 *
 * Tek kaynak: tüm renk, tipografi, spacing, radius, elevation, breakpoint
 * ve motion değerleri bu dosyadan okunur. `src/styles/globals.css` içindeki
 * Tailwind v4 `@theme` bloğu bu dosyanın birebir yansımasıdır.
 *
 * Değişiklik gerekirse: önce bu dosyayı güncelle, sonra `globals.css`, sonra kullan.
 *
 * @see docs/04-design-system-principles.md — tasarım kararlarının otoritesi
 * @see docs/decisions/ADR-015-design-system-v2.md — v1 → v2 geçiş gerekçesi
 */

// ---------------------------------------------------------------------------
// Renkler
// ---------------------------------------------------------------------------

/**
 * Teal — INDOLES logosundan türetilmiş tek marka rengi.
 * `teal-700` (#2C5566) logo rengidir ve birincil interaction anchor'dır.
 * Tailwind'de `brand-*` adıyla da yayımlanır (aynı değerler, semantik takma ad).
 */
export const teal = {
  900: '#1A3A47',
  800: '#234959',
  700: '#2C5566',
  600: '#3A6B7D',
  500: '#4F8294',
  400: '#7AA4B3',
  300: '#AEC7D1',
  200: '#D4E2E8',
  100: '#EAF1F4',
  50: '#F5F8FA',
} as const;

/**
 * Gold — tek accent rengi. Yalnızca dark yüzeylerde (Vision, Footer, dark kart)
 * ve teknik illüstrasyonlarda vurgu olarak kullanılır. Light zeminde CTA rengi
 * değildir; light zeminin birincil aksiyonu siyahtır.
 */
export const gold = {
  700: '#8F7142',
  600: '#A88857',
  500: '#B8956A',
  400: '#C9A881',
  300: '#DDC3A3',
  100: '#F2E9DA',
} as const;

/** Nötrler — warm-neutral zemin + soğuk gri mürekkep skalası. */
export const neutral = {
  /** Ana tuval — sayfa arka planı */
  bg: '#FAFAF7',
  /** Kart/panel zemini */
  bgPure: '#FFFFFF',
  ink: {
    900: '#000000',
    800: '#0A0A0A',
    700: '#1A1A1A',
    600: '#4A5A64',
    500: '#6B7880',
    400: '#8F9AA2',
    300: '#B8C0C6',
    200: '#E2E6E9',
    100: '#EEF1F3',
  },
} as const;

/**
 * Surface — zemin üstü katmanlar. v1'deki `surface-1/2/3` adları korunur,
 * değerleri v2 paletine bağlanmıştır.
 */
export const surface = {
  1: '#FFFFFF',
  2: '#F5F8FA',
  3: '#EAF1F4',
} as const;

/** Semantic renkler — sessiz, editorial tonlar. */
export const semantic = {
  success: { 50: '#EDF5F0', 500: '#3F7A56', 700: '#2D5A3E' },
  warning: { 50: '#F2E9DA', 500: '#B8956A', 700: '#8F7142' },
  danger: { 50: '#FAEDEC', 500: '#A8453D', 700: '#7D3230' },
  // info = teal (ayrı renk yok)
} as const;

export const colors = {
  bg: neutral.bg,
  bgPure: neutral.bgPure,
  paper: neutral.bg,
  ink: neutral.ink,
  teal,
  /** `teal` ile aynı — Tailwind `brand-*` utility'lerinin kaynağı. */
  brand: teal,
  gold,
  surface,
  semantic,
} as const;

// ---------------------------------------------------------------------------
// Tipografi
// ---------------------------------------------------------------------------

export const fonts = {
  /** Başlıklar, metrikler, marka ifadeleri */
  display: 'Lexend',
  /** Gövde metni, UI */
  body: 'Inter',
  /** Eyebrow, etiket, sayaç, teknik meta */
  mono: 'JetBrains Mono',
} as const;

/**
 * Fluid tip skalası — 1.2 (mobil) → 1.25 (desktop) modüler oran.
 * Tailwind'de `text-step-{n}` utility'si olarak yayımlanır.
 */
export const typeScale = {
  '-2': 'clamp(0.69rem, 0.68rem + 0.07vw, 0.72rem)',
  '-1': 'clamp(0.83rem, 0.80rem + 0.14vw, 0.90rem)',
  '0': 'clamp(1.00rem, 0.95rem + 0.23vw, 1.13rem)',
  '1': 'clamp(1.20rem, 1.13rem + 0.34vw, 1.41rem)',
  '2': 'clamp(1.44rem, 1.34rem + 0.50vw, 1.76rem)',
  '3': 'clamp(1.73rem, 1.58rem + 0.72vw, 2.20rem)',
  '4': 'clamp(2.07rem, 1.86rem + 1.05vw, 2.75rem)',
  '5': 'clamp(2.49rem, 2.19rem + 1.50vw, 3.43rem)',
  '6': 'clamp(2.99rem, 2.57rem + 2.10vw, 4.29rem)',
  '7': 'clamp(3.58rem, 3.00rem + 2.92vw, 5.37rem)',
  '8': 'clamp(4.30rem, 3.50rem + 4.02vw, 6.71rem)',
} as const;

/** Başlık tracking'i — display font büyüdükçe sıkışır. */
export const tracking = {
  display: '-0.035em',
  heading: '-0.028em',
  title: '-0.02em',
  body: '-0.005em',
  /** eyebrow / mono etiketler */
  label: '0.18em',
} as const;

// ---------------------------------------------------------------------------
// Spacing
// ---------------------------------------------------------------------------

/**
 * 4px tabanlı skala. Tailwind'in varsayılan `--spacing` çarpanıyla birebir
 * örtüşür (sp-5 = 24px = `p-6`), bu yüzden ayrı utility yayımlanmaz.
 */
export const spacing = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '24px',
  6: '32px',
  7: '48px',
  8: '64px',
  9: '96px',
  10: '128px',
  11: '192px',
} as const;

/** Section dikey ritmi — bölüm tipine göre. */
export const sectionRhythm = {
  /** Yoğun bant (marquee, sektör grid) */
  tight: '96px',
  /** Standart içerik bölümü */
  base: '140px',
  /** Nefes alan bölüm (manifesto, CTA) */
  loose: '180px',
} as const;

// ---------------------------------------------------------------------------
// Radius
// ---------------------------------------------------------------------------

/** v2 radius'ları belirgin şekilde küçüktür — "yumuşak kutu" değil, basılı kenar. */
export const radius = {
  sm: '2px',
  md: '4px',
  lg: '6px',
  xl: '8px',
  '2xl': '10px',
} as const;

// ---------------------------------------------------------------------------
// Elevation
// ---------------------------------------------------------------------------

/**
 * Çok katmanlı, uzun-yayılımlı gölgeler. Her seviye en az iki katman taşır:
 * yakın kontak gölgesi + uzak ortam gölgesi. Teal tonlu (nötr gri değil).
 */
export const shadow = {
  sm: '0 1px 2px rgba(15,28,35,.04), 0 1px 3px rgba(15,28,35,.04)',
  md: '0 2px 4px rgba(15,28,35,.04), 0 8px 20px -4px rgba(15,28,35,.08), 0 16px 32px -12px rgba(44,85,102,.1)',
  lg: '0 4px 8px rgba(15,28,35,.05), 0 20px 40px -12px rgba(15,28,35,.12), 0 40px 80px -24px rgba(44,85,102,.18)',
  xl: '0 8px 16px rgba(15,28,35,.06), 0 40px 80px -20px rgba(44,85,102,.22), 0 60px 120px -40px rgba(15,28,35,.16)',
  /** İç highlight + hairline + iki ambient katman — kart ve nav için */
  '3d': '0 1px 0 0 rgba(255,255,255,0.8) inset, 0 0 0 1px rgba(44,85,102,0.06), 0 12px 24px -8px rgba(15,28,35,0.12), 0 32px 64px -24px rgba(44,85,102,0.2)',
  /** Yüzen kontrol (araç giriş çubuğu): kontak + iki ambient katman, kremden ayrılır ama modal gibi kalkmaz */
  float: '0 1px 2px rgba(15,28,35,.06), 0 12px 32px -8px rgba(15,28,35,.14), 0 24px 56px -16px rgba(44,85,102,.22)',
} as const;

// ---------------------------------------------------------------------------
// Motion
// ---------------------------------------------------------------------------

export const easing = {
  /** Varsayılan — güçlü çıkış yavaşlaması, "ağır ama akıcı" his */
  out: 'cubic-bezier(0.16, 1, 0.3, 1)',
  inOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
} as const;

export const duration = {
  /** Hover, focus, renk geçişi */
  fast: '300ms',
  /** Buton, kart, nav */
  base: '400ms',
  /** Kart yükselme, timeline dolumu */
  slow: '600ms',
  /** Scroll reveal */
  reveal: '1000ms',
} as const;

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

export const breakpoints = {
  mobile: '375px',
  tablet: '768px',
  desktop: '1280px',
  wide: '1536px',
} as const;

export const containers = {
  /** Standart içerik genişliği */
  base: '1440px',
  /** Full-bleed bölümler (services track, nav) */
  wide: '1680px',
  /** Editorial okuma kolonu */
  prose: '1120px',
  /** Entry popup — varsayılan aşamalar */
  popup: '35rem',
  /** Entry popup — booking aşaması, 2 kolon */
  popupWide: '57.5rem',
  /** Araç sayfası kolonu — ortalı ürün yüzeyi (docs/04 §12.10 araç istisnası) */
  tool: '760px',
} as const;

/**
 * Kontrol yükseklikleri — araç giriş çubuğu (docs/04 §12.10).
 *
 * Değerler çubuğun DIŞ yüksekliğidir; içindeki gönder düğmesi 1 px kenarlık
 * ve 8 px dolgudan arta kalan yüksekliği alır. Mobil 60 px'te bu 42 px
 * kalıyordu — 44 px'lik dokunma hedefi eşiğinin altı (2026-09-02 ölçüm).
 * 64 px'te düğme 46 px'e çıkar.
 */
export const controls = {
  scanBar: '72px',
  scanBarMobile: '64px',
} as const;

export const zIndex = {
  base: 0,
  raised: 2,
  sticky: 40,
  nav: 100,
  topbar: 101,
  popup: 200,
} as const;

// ---------------------------------------------------------------------------
// Aggregate
// ---------------------------------------------------------------------------

export const tokens = {
  colors,
  fonts,
  typeScale,
  tracking,
  spacing,
  sectionRhythm,
  radius,
  shadow,
  easing,
  duration,
  breakpoints,
  containers,
  controls,
  zIndex,
} as const;

export type Tokens = typeof tokens;
