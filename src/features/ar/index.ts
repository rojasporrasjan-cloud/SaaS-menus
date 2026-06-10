// ── Public API — only ARButton is exported for consumers ──────────────────────
// ARViewer is internally lazy-loaded. External code never imports it directly.

export { ARButton } from './components/ARButton'
export { ARPremiumGate } from './components/ARPremiumGate'
export { ARAssetService } from './services/ARAssetService'

export type { ARAsset, ARButtonProps, ARViewerProps, ARCapabilities } from './types/ar.types'
