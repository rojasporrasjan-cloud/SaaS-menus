import { SHADE_KEYS } from '@shared/utils/colorScale'
import type { ColorScale } from '@shared/utils/colorScale'

/**
 * Imperatively applies a brand color scale to the document by overriding the
 * `--color-brand-*` CSS custom properties on the root element.
 *
 * Tailwind v4 generates utilities (`bg-brand-600`, `text-brand-700`, …) that
 * resolve to these CSS vars at paint time — so overriding the vars re-themes
 * every existing class in the app without any re-render.
 */
export const ThemeService = {
  /** Apply the given scale to `<html>`. */
  applyScale(scale: ColorScale): void {
    if (typeof document === 'undefined') return // SSR / Node guard
    const root = document.documentElement
    for (const key of SHADE_KEYS) {
      root.style.setProperty(`--color-brand-${key}`, scale[key])
    }
  },

  /**
   * Remove all runtime overrides. The original values from `@theme {}` in
   * index.css take over again — useful before unmounting the tenant context
   * or on logout.
   */
  resetScale(): void {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    for (const key of SHADE_KEYS) {
      root.style.removeProperty(`--color-brand-${key}`)
    }
  },
}
