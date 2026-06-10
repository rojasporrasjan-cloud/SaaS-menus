import { useEffect, useMemo } from 'react'
import { generateScale, isValidHex } from '@shared/utils/colorScale'
import type { ColorScale } from '@shared/utils/colorScale'
import { ThemeService } from '../services/ThemeService'

interface UseTenantThemeReturn {
  scale: ColorScale | null
}

/**
 * Generates a brand-color scale from the given hex and applies it to the
 * document on mount and whenever the input changes. Resets on unmount.
 *
 * If `hex` is null/invalid, leaves the default scale untouched.
 *
 * Returns the computed scale so consumers (e.g. live previews in
 * BrandingForm) can render swatches without recomputing.
 */
export function useTenantTheme(hex: string | null | undefined): UseTenantThemeReturn {
  const scale = useMemo<ColorScale | null>(() => {
    if (!hex || !isValidHex(hex)) return null
    return generateScale(hex)
  }, [hex])

  useEffect(() => {
    if (!scale) return
    ThemeService.applyScale(scale)
    return () => {
      ThemeService.resetScale()
    }
  }, [scale])

  return { scale }
}
