/**
 * Pure color utilities for runtime theming.
 *
 * Generates an 11-shade Tailwind-compatible color scale (50 → 950) from a
 * single anchor hex color. Anchored at shade 500 — i.e. `generateScale(hex)[500]`
 * round-trips back to (approximately) `hex`.
 *
 * No external dependencies. All math in HSL with controlled saturation drop
 * near extremes to avoid washed-out lights and muddy darks.
 */

export const SHADE_KEYS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

export type ShadeKey = (typeof SHADE_KEYS)[number]

export type ColorScale = Record<ShadeKey, string>

// ── Hex helpers ───────────────────────────────────────────────────────────────

const HEX_REGEX = /^#?([0-9a-fA-F]{6})$/

export function isValidHex(hex: string): boolean {
  return HEX_REGEX.test(hex)
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n))
}

function normalizeHex(hex: string): string {
  const m = HEX_REGEX.exec(hex)
  if (!m) throw new Error(`Invalid hex color: ${hex}`)
  return `#${(m[1] ?? '').toLowerCase()}`
}

// ── HSL ↔ RGB ↔ HEX ───────────────────────────────────────────────────────────

interface Hsl {
  h: number  // [0, 360)
  s: number  // [0, 1]
  l: number  // [0, 1]
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = normalizeHex(hex).slice(1)
  const r = parseInt(clean.slice(0, 2), 16) / 255
  const g = parseInt(clean.slice(2, 4), 16) / 255
  const b = parseInt(clean.slice(4, 6), 16) / 255
  return { r, g, b }
}

function rgbToHex(r: number, g: number, b: number): string {
  const toByte = (v: number) =>
    Math.round(clamp01(v) * 255).toString(16).padStart(2, '0')
  return `#${toByte(r)}${toByte(g)}${toByte(b)}`
}

function rgbToHsl(r: number, g: number, b: number): Hsl {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2

  if (max === min) return { h: 0, s: 0, l }

  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

  let h: number
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60
  else if (max === g) h = ((b - r) / d + 2) * 60
  else h = ((r - g) / d + 4) * 60

  return { h, s, l }
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  if (s === 0) return { r: l, g: l, b: l }

  const hueToRgb = (p: number, q: number, t: number): number => {
    let tt = t
    if (tt < 0) tt += 1
    if (tt > 1) tt -= 1
    if (tt < 1 / 6) return p + (q - p) * 6 * tt
    if (tt < 1 / 2) return q
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6
    return p
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const hNorm = h / 360
  return {
    r: hueToRgb(p, q, hNorm + 1 / 3),
    g: hueToRgb(p, q, hNorm),
    b: hueToRgb(p, q, hNorm - 1 / 3),
  }
}

export function isDarkColor(hex: string): boolean {
  try {
    const { l } = hexToHslInternal(normalizeHex(hex))
    return l < 0.5
  } catch {
    return true
  }
}

function hexToHslInternal(hex: string): Hsl {
  const { r, g, b } = hexToRgb(hex)
  return rgbToHsl(r, g, b)
}

export interface ThemeColors {
  bg: string
  gradient: string
  primary: string
  text: string
  textMuted: string
  surface: string
  border: string
  font: string
  cardRadius: string
  buttonRadius: string
  badgeRadius: string
  imgRadius: string
  textScale: string
  shadow: string
}

function getRadii(style: 'sharp' | 'rounded' | 'pill' = 'rounded') {
  switch (style) {
    case 'sharp': return { card: '6px',  button: '6px',   badge: '4px'   }
    case 'pill':  return { card: '24px', button: '999px', badge: '999px' }
    default:      return { card: '16px', button: '999px', badge: '999px' }
  }
}

function getShadow(depth: 'flat' | 'soft' | 'deep' = 'soft', dark: boolean): string {
  switch (depth) {
    case 'flat': return 'none'
    case 'deep': return dark
      ? '0 8px 32px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.3)'
      : '0 8px 24px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.08)'
    default: return dark
      ? '0 4px 16px rgba(0,0,0,0.35)'
      : '0 2px 8px rgba(0,0,0,0.07)'
  }
}

function getTextScale(scale: 'sm' | 'md' | 'lg' = 'md'): string {
  switch (scale) {
    case 'sm': return '87.5%'
    case 'lg': return '112.5%'
    default:   return '100%'
  }
}

function getImgRadius(rounding: 'none' | 'sm' | 'lg' | 'xl' = 'lg'): string {
  switch (rounding) {
    case 'none': return '0px'
    case 'sm':   return '6px'
    case 'xl':   return '24px'
    default:     return '16px'
  }
}

function getGradient(bg: string, bgGradient?: { enabled: boolean; from: string; to: string; direction: string }): string {
  if (bgGradient?.enabled) {
    return `linear-gradient(${bgGradient.direction}, ${bgGradient.from}, ${bgGradient.to})`
  }
  return bg
}

export function getThemeColors(branding: {
  backgroundColor: string
  primaryColor: string
  fontFamily: string
  cardStyle?: 'sharp' | 'rounded' | 'pill'
  shadowDepth?: 'flat' | 'soft' | 'deep'
  textScale?: 'sm' | 'md' | 'lg'
  imageRounding?: 'none' | 'sm' | 'lg' | 'xl'
  bgGradient?: { enabled: boolean; from: string; to: string; direction: string }
}): ThemeColors {
  const dark = isDarkColor(branding.backgroundColor)
  const radii = getRadii(branding.cardStyle)
  return {
    bg: branding.backgroundColor,
    gradient: getGradient(branding.backgroundColor, branding.bgGradient),
    primary: branding.primaryColor,
    text: dark ? '#ffffff' : '#0f172a',
    textMuted: dark ? 'rgba(255,255,255,0.55)' : 'rgba(15,23,42,0.5)',
    surface: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
    border: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    font: branding.fontFamily || 'Inter',
    cardRadius: radii.card,
    buttonRadius: radii.button,
    badgeRadius: radii.badge,
    imgRadius: getImgRadius(branding.imageRounding),
    textScale: getTextScale(branding.textScale),
    shadow: getShadow(branding.shadowDepth, dark),
  }
}

export function hexToHsl(hex: string): Hsl {
  const { r, g, b } = hexToRgb(hex)
  return rgbToHsl(r, g, b)
}

export function hslToHex(h: number, s: number, l: number): string {
  const { r, g, b } = hslToRgb(h, clamp01(s), clamp01(l))
  return rgbToHex(r, g, b)
}

// ── Scale generation ──────────────────────────────────────────────────────────

/** Off-white target for the lightest shade (50). */
const LIGHT_END = 0.97
/** Near-black target for the darkest shade (950). */
const DARK_END = 0.10

/**
 * Per-shade saturation multiplier — drops saturation near the extremes to
 * avoid neon-bright lights and muddy darks. Pre-tuned so that, with a typical
 * mid-saturation anchor (s ≈ 0.7), the 50 reads as a tinted off-white and the
 * 950 reads as a near-neutral dark tone.
 */
const SATURATION_MULTIPLIER: Record<ShadeKey, number> = {
  50:  0.45,
  100: 0.60,
  200: 0.78,
  300: 0.90,
  400: 0.98,
  500: 1.00,
  600: 1.00,
  700: 0.95,
  800: 0.88,
  900: 0.80,
  950: 0.70,
}

/**
 * Generate an 11-shade scale from a single hex color.
 *
 * Algorithm — piecewise linear interpolation in HSL:
 *   • shade 500 = exact input
 *   • shades 50–400 interpolate L between (50 → LIGHT_END) and (500 → anchorL)
 *   • shades 600–950 interpolate L between (500 → anchorL) and (950 → DARK_END)
 *   • saturation tapered near extremes (see SATURATION_MULTIPLIER)
 *   • hue preserved across the whole scale
 *
 * @example
 * generateScale('#16a34a')[500]  // → near '#16a34a'
 * generateScale('#16a34a')[50]   // → near-white with green tint
 * generateScale('#16a34a')[950]  // → near-black with green tint
 */
export function generateScale(hex: string): ColorScale {
  const { h, s, l: anchorL } = hexToHsl(hex)

  const result = {} as ColorScale
  for (const key of SHADE_KEYS) {
    let targetL: number
    if (key === 500) {
      targetL = anchorL
    } else if (key < 500) {
      // 50 → t=1 (full light); 500 → t=0 (anchor)
      const t = (500 - key) / (500 - 50)
      targetL = anchorL + (LIGHT_END - anchorL) * t
    } else {
      // 500 → t=0 (anchor); 950 → t=1 (full dark)
      const t = (key - 500) / (950 - 500)
      targetL = anchorL + (DARK_END - anchorL) * t
    }

    const targetS = clamp01(s * SATURATION_MULTIPLIER[key])
    result[key] = hslToHex(h, targetS, clamp01(targetL))
  }
  return result
}
