import { lazy, Suspense, useState } from 'react'

declare global {
  interface Window { MSStream?: unknown }
}
import { Cuboid } from 'lucide-react'
import { Button } from '@shared/ui/components/Button'
import { ARLoadingState } from '../ARLoadingState'
import { ARPremiumGate } from '../ARPremiumGate'
import type { ARButtonProps } from '../../types/ar.types'

/**
 * The only export consumers use from this module.
 *
 * Responsibilities:
 * 1. Guard: checks feature flag → shows <ARPremiumGate> if disabled
 * 2. Guard: checks asset availability → hides if no model
 * 3. Lazy-loads <ARViewer> — zero cost until first click
 * 4. Manages open/close state of the viewer overlay
 */

const LazyARViewer = lazy(() =>
  import('../ARViewer').then((m) => ({ default: m.ARViewer })),
)

export function ARButton({ asset, isFeatureEnabled }: ARButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  // No model → render nothing
  if (!asset) return null

  // Plan gate → show upgrade CTA
  if (!isFeatureEnabled) return <ARPremiumGate />

  const handleARClick = (e: React.MouseEvent) => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    const isAndroid = /Android/.test(navigator.userAgent)

    if (isIOS && asset.usdzUrl) {
      e.preventDefault()
      // Create temporary <a> element with single <img> child to launch native iOS Quick Look AR camera
      const link = document.createElement('a')
      link.setAttribute('rel', 'ar')
      link.setAttribute('href', asset.usdzUrl)
      
      const img = document.createElement('img')
      img.setAttribute('src', asset.posterUrl || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1" height="1"%3E%3C/svg%3E')
      img.style.width = '1px'
      img.style.height = '1px'
      img.style.opacity = '0'
      img.style.position = 'absolute'
      img.style.pointerEvents = 'none'
      
      link.appendChild(img)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      return
    }

    if (isAndroid && asset.glbUrl) {
      e.preventDefault()
      // Direct redirect to native Android Scene Viewer Google Play Services AR camera
      const intentUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(
        asset.glbUrl,
      )}&mode=ar_only&title=${encodeURIComponent(
        asset.alt || 'Plato 3D',
      )}#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;end`
      window.location.href = intentUrl
      return
    }

    // Fallback: WebGL modal on desktop
    setIsOpen(true)
  }

  return (
    <>
      <Button
        size="lg"
        className="w-full gap-2"
        onClick={handleARClick}
        aria-label={`Ver ${asset.alt} en realidad aumentada`}
      >
        <Cuboid size={18} />
        Ver en tu espacio (AR)
      </Button>

      {isOpen && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-900">
              <ARLoadingState message="Iniciando AR…" />
            </div>
          }
        >
          <LazyARViewer
            asset={asset}
            onClose={() => setIsOpen(false)}
          />
        </Suspense>
      )}
    </>
  )
}
