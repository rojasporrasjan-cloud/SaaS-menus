export const Z = {
  base: 0,
  raised: 10,
  nav: 30,
  overlay: 40,
  modal: 50,
  toast: 60,
} as const

export const TRANSITION = {
  fast:   '100ms ease',
  base:   '150ms ease',
  slow:   '300ms ease',
  spring: '150ms cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const

export const RADIUS = {
  sm:   '6px',
  md:   '10px',
  lg:   '14px',
  xl:   '16px',
  '2xl':'20px',
  full: '9999px',
} as const

export const SHADOW = {
  sm: '0 1px 4px rgba(0,0,0,0.08)',
  md: '0 4px 14px rgba(0,0,0,0.10)',
  lg: '0 8px 24px rgba(0,0,0,0.14)',
  xl: '0 16px 40px rgba(0,0,0,0.18)',
} as const

export const SPACING = {
  1:  '4px',
  2:  '8px',
  3:  '12px',
  4:  '16px',
  5:  '20px',
  6:  '24px',
  8:  '32px',
  10: '40px',
  12: '48px',
  16: '64px',
} as const

export const FONT_SIZE = {
  '2xs': '0.6rem',
  xs:    '0.7rem',
  sm:    '0.8rem',
  base:  '0.875rem',
  md:    '1rem',
  lg:    '1.125rem',
  xl:    '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
} as const

export const BREAKPOINT = {
  sm:  640,
  md:  768,
  lg:  1024,
  xl:  1280,
} as const
