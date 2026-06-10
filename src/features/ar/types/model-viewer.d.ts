/**
 * Type augmentation for <model-viewer> web component (Google Model Viewer).
 * Script is injected dynamically from CDN — never bundled.
 * @see https://modelviewer.dev
 */

import type { CSSProperties, RefObject } from 'react'

interface ModelViewerHTMLAttributes {
  src?: string
  'ios-src'?: string
  alt: string
  poster?: string
  ref?: RefObject<HTMLElement>

  ar?: boolean
  'ar-modes'?: string
  'ar-scale'?: 'auto' | 'fixed'
  'ar-placement'?: 'floor' | 'wall'

  'camera-controls'?: boolean
  'auto-rotate'?: boolean
  'auto-rotate-delay'?: number | string
  'rotation-per-second'?: string
  'field-of-view'?: string
  'camera-orbit'?: string
  'min-camera-orbit'?: string
  'max-camera-orbit'?: string

  loading?: 'auto' | 'lazy' | 'eager'
  reveal?: 'auto' | 'interaction' | 'manual'

  'shadow-intensity'?: string
  'shadow-softness'?: string
  'environment-image'?: string
  exposure?: string

  'disable-zoom'?: boolean
  'disable-pan'?: boolean

  id?: string
  className?: string
  style?: CSSProperties
  slot?: string
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': ModelViewerHTMLAttributes
    }
  }
}
