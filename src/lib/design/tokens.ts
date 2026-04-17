/**
 * INDOLES Design Tokens
 *
 * Tek kaynak: tüm renk, tipografi, spacing, radius, elevation, breakpoint
 * ve motion değerleri bu dosyadan okunur. Tailwind config bu dosyayı import eder.
 *
 * Değişiklik gerekirse: önce bu dosyayı güncelle, sonra kullan.
 * Yeni token eklenirse docs/04-design-system-principles.md de güncellenir.
 *
 * @see docs/04-design-system-principles.md — tasarım kararlarının otoritesi
 */

// ---------------------------------------------------------------------------
// Renkler
// ---------------------------------------------------------------------------

export const colors = {
  paper: '#FBFAF7',

  surface: {
    1: '#F5F3EE',
    2: '#EDEAE3',
    3: '#E4E0D7',
  },

  ink: {
    900: '#1A1F24',
    700: '#3E454D',
    500: '#6B7380',
    300: '#A5ABB3',
  },

  brand: {
    50: '#E8EEF3',
    100: '#D1DCE6',
    200: '#A8BECE',
    300: '#839FB5',
    400: '#6E8EA6',
    500: '#567B97',
    600: '#4A6B85',
    700: '#3E5C73',
    800: '#2E4557',
    900: '#1F3040',
  },

  semantic: {
    success: {
      50: '#EDF5F0',
      500: '#3F7A56',
      700: '#2D5A3E',
    },
    warning: {
      50: '#FDF6E8',
      500: '#B88A2F',
      700: '#8A6720',
    },
    danger: {
      50: '#FAEDEC',
      500: '#A8453D',
      700: '#7D3230',
    },
    // info = brand (ayrı renk yok)
  },

  /**
   * Hero zone — yalnız anasayfa hero (100vh) için.
   * Gerekçe: docs/decisions/ADR-003-cinematic-hero-zone.md
   * Kural: bu palette hero zone dışında kullanılamaz.
   */
  hero: {
    void: '#05080F',
    deep: '#0A1628',
    metal: '#1B3A5C',
    light: '#3B6FA0',
    paper: '#F5F3EE',
    accent: '#A8BECE',
  },
} as const;

// ---------------------------------------------------------------------------
// Tipografi
// ---------------------------------------------------------------------------

export const fontFamily = {
  heading: "'Fraunces', Georgia, serif",
  body: "'Inter', system-ui, -apple-system, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
} as const;

/**
 * Tipografi scale.
 * Her token: font ailesi, desktop/mobile boyut, clamp() formülü, line-height,
 * weight, letter-spacing ve Fraunces opsz değerini içerir.
 *
 * clamp() değerleri mobile-first fluid responsive için kullanılır.
 * "null" clamp = sabit boyut (fluid değil).
 */
export const typography = {
  'display-2xl': {
    fontFamily: fontFamily.heading,
    fontSize: '4.5rem',
    fontSizeMobile: '2.75rem',
    clamp: 'clamp(2.75rem, 4vw + 1rem, 4.5rem)',
    lineHeight: '1.1',
    fontWeight: fontWeight.regular,
    letterSpacing: '-0.02em',
    opsz: 9,
  },
  'display-xl': {
    fontFamily: fontFamily.heading,
    fontSize: '3.5rem',
    fontSizeMobile: '2.25rem',
    clamp: 'clamp(2.25rem, 3vw + 1rem, 3.5rem)',
    lineHeight: '1.1',
    fontWeight: fontWeight.regular,
    letterSpacing: '-0.02em',
    opsz: 9,
  },
  'display-lg': {
    fontFamily: fontFamily.heading,
    fontSize: '2.75rem',
    fontSizeMobile: '2rem',
    clamp: 'clamp(2rem, 2vw + 1rem, 2.75rem)',
    lineHeight: '1.15',
    fontWeight: fontWeight.regular,
    letterSpacing: '-0.01em',
    opsz: 18,
  },
  h1: {
    fontFamily: fontFamily.heading,
    fontSize: '2.25rem',
    fontSizeMobile: '1.75rem',
    clamp: 'clamp(1.75rem, 1.5vw + 1rem, 2.25rem)',
    lineHeight: '1.2',
    fontWeight: fontWeight.medium,
    letterSpacing: '-0.01em',
    opsz: 18,
  },
  h2: {
    fontFamily: fontFamily.heading,
    fontSize: '1.75rem',
    fontSizeMobile: '1.5rem',
    clamp: 'clamp(1.5rem, 1vw + 0.75rem, 1.75rem)',
    lineHeight: '1.25',
    fontWeight: fontWeight.medium,
    letterSpacing: '0',
    opsz: 48,
  },
  h3: {
    fontFamily: fontFamily.heading,
    fontSize: '1.375rem',
    fontSizeMobile: '1.25rem',
    clamp: 'clamp(1.25rem, 0.5vw + 0.75rem, 1.375rem)',
    lineHeight: '1.3',
    fontWeight: fontWeight.semibold,
    letterSpacing: '0',
    opsz: 72,
  },
  h4: {
    fontFamily: fontFamily.body,
    fontSize: '1.125rem',
    fontSizeMobile: '1.125rem',
    clamp: null,
    lineHeight: '1.4',
    fontWeight: fontWeight.semibold,
    letterSpacing: '0',
    opsz: null,
  },
  'body-lg': {
    fontFamily: fontFamily.body,
    fontSize: '1.25rem',
    fontSizeMobile: '1.125rem',
    clamp: 'clamp(1.125rem, 0.5vw + 0.75rem, 1.25rem)',
    lineHeight: '1.6',
    fontWeight: fontWeight.regular,
    letterSpacing: '0',
    opsz: null,
  },
  'body-md': {
    fontFamily: fontFamily.body,
    fontSize: '1rem',
    fontSizeMobile: '1rem',
    clamp: null,
    lineHeight: '1.6',
    fontWeight: fontWeight.regular,
    letterSpacing: '0',
    opsz: null,
  },
  'body-sm': {
    fontFamily: fontFamily.body,
    fontSize: '0.875rem',
    fontSizeMobile: '0.875rem',
    clamp: null,
    lineHeight: '1.5',
    fontWeight: fontWeight.regular,
    letterSpacing: '0',
    opsz: null,
  },
  caption: {
    fontFamily: fontFamily.body,
    fontSize: '0.8125rem',
    fontSizeMobile: '0.8125rem',
    clamp: null,
    lineHeight: '1.4',
    fontWeight: fontWeight.regular,
    letterSpacing: '0.01em',
    opsz: null,
  },
  label: {
    fontFamily: fontFamily.body,
    fontSize: '0.75rem',
    fontSizeMobile: '0.75rem',
    clamp: null,
    lineHeight: '1.4',
    fontWeight: fontWeight.medium,
    letterSpacing: '0.02em',
    opsz: null,
  },
} as const;

// ---------------------------------------------------------------------------
// Spacing (4px base unit)
// ---------------------------------------------------------------------------

export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
  40: '10rem',    // 160px
  48: '12rem',    // 192px
} as const;

// ---------------------------------------------------------------------------
// Radius
// ---------------------------------------------------------------------------

export const radius = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  full: '9999px',
} as const;

// ---------------------------------------------------------------------------
// Elevation (shadow + optional backdrop-blur)
// ---------------------------------------------------------------------------

export const elevation = {
  0: 'none',
  1: 'inset 0 0 0 1px rgba(107, 115, 128, 0.08)',
  2: '0 8px 16px -2px rgba(26, 31, 36, 0.04)',
  3: '0 16px 32px -4px rgba(26, 31, 36, 0.06), inset 0 0 0 1px rgba(107, 115, 128, 0.12)',
  // elevation-4 = elevation-2 shadow + backdrop-filter: blur(8px)
  // backdrop-blur ayrı uygulanır, shadow kısmı:
  4: '0 8px 16px -2px rgba(26, 31, 36, 0.04)',
} as const;

/** elevation-4 için backdrop-blur değeri (max 8px) */
export const backdropBlur = {
  nav: '8px',
} as const;

// ---------------------------------------------------------------------------
// Breakpoints
// ---------------------------------------------------------------------------

export const breakpoints = {
  mobile: '375px',
  tablet: '768px',
  desktop: '1280px',
  wide: '1536px',
} as const;

// ---------------------------------------------------------------------------
// Grid
// ---------------------------------------------------------------------------

export const grid = {
  columns: 12,
  maxWidth: '1280px',
  gutter: spacing[8],    // 32px
  marginMobile: spacing[4],   // 16px
  marginTablet: spacing[6],   // 24px
  proseMaxWidth: '680px',
} as const;

// ---------------------------------------------------------------------------
// Motion
// ---------------------------------------------------------------------------

export const duration = {
  micro: '150ms',
  interaction: '300ms',
  editorial: '800ms',
} as const;

export const easing = {
  out: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  in: 'cubic-bezier(0.4, 0.0, 1, 1)',
  inOut: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  editorial: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
} as const;

// ---------------------------------------------------------------------------
// Icon
// ---------------------------------------------------------------------------

export const icon = {
  strokeWeight: '1.5',  // Light
  sizes: {
    sm: '16px',
    md: '20px',
    lg: '24px',
    xl: '32px',
  },
} as const;

// ---------------------------------------------------------------------------
// Type exports
// ---------------------------------------------------------------------------

export type Colors = typeof colors;
export type Typography = typeof typography;
export type Spacing = typeof spacing;
export type Radius = typeof radius;
export type Elevation = typeof elevation;
export type Breakpoints = typeof breakpoints;
export type Duration = typeof duration;
export type Easing = typeof easing;
