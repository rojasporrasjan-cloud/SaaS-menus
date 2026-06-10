export interface ARAsset {
  glbUrl: string
  usdzUrl: string | null
  posterUrl: string | null
  alt: string
}

export type ARLoadState =
  | 'idle'
  | 'loading-script'
  | 'script-ready'
  | 'loading-model'
  | 'ready'
  | 'error'

export type ARDevice = 'ios' | 'android' | 'desktop' | 'unknown'

export interface ARCapabilities {
  device: ARDevice
  supportsAR: boolean
  arModes: string
}

export interface ARViewerProps {
  asset: ARAsset
  onClose: () => void
}

export interface ARButtonProps {
  asset: ARAsset | null
  isFeatureEnabled: boolean
}
