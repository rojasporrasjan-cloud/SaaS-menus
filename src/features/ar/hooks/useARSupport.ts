import { useMemo } from 'react'
import type { ARCapabilities, ARDevice } from '../types/ar.types'

/**
 * Detects device AR capabilities without triggering permission prompts.
 * iOS → QuickLook (USDZ), Android → Scene Viewer / WebXR (GLB).
 */
export function useARSupport(): ARCapabilities {
  return useMemo<ARCapabilities>(() => {
    const ua = navigator.userAgent

    const isIOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

    const isAndroid = /Android/.test(ua)

    const device: ARDevice = isIOS
      ? 'ios'
      : isAndroid
        ? 'android'
        : 'desktop'

    // iOS uses QuickLook (always available on iOS 12+)
    // Android uses Scene Viewer or WebXR
    const supportsAR = isIOS || isAndroid || 'xr' in navigator

    const arModes: string = isIOS
      ? 'quick-look'
      : 'scene-viewer webxr'

    return { device, supportsAR, arModes }
  }, [])
}
