// Components
export { TenantThemeBoundary } from './components/TenantThemeBoundary'
export { ThemePreview } from './components/ThemePreview'

// Hooks
export { useTenantTheme } from './hooks/useTenantTheme'

// Services
export { ThemeService } from './services/ThemeService'

// Utils re-export for convenience
export {
  generateScale,
  isValidHex,
  hexToHsl,
  hslToHex,
  SHADE_KEYS,
} from '@shared/utils/colorScale'
export type { ColorScale, ShadeKey } from '@shared/utils/colorScale'
