import { useCallback } from 'react'
import { X, Maximize2, RotateCcw } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { useARLoader } from '../../hooks/useARLoader'
import { useARSupport } from '../../hooks/useARSupport'
import { useModelViewer } from '../../hooks/useModelViewer'
import { ARLoadingState } from '../ARLoadingState'
import { ARErrorState } from '../ARErrorState'
import type { ARViewerProps } from '../../types/ar.types'

/**
 * Full-screen AR viewer overlay.
 * Lazy-loaded via React.lazy — never bundled in initial JS.
 * Injects model-viewer CDN script on first mount.
 */
export function ARViewer({ asset, onClose }: ARViewerProps) {
  const { isReady: isScriptReady, isError: isScriptError } = useARLoader()
  const { supportsAR, arModes } = useARSupport()
  const { ref, loadProgress, isModelReady, isError: isModelError, launchAR } = useModelViewer()

  const handleRetry = useCallback(() => {
    window.location.reload()
  }, [])

  if (isScriptError) {
    return (
      <AROverlayShell onClose={onClose}>
        <ARErrorState type="script" onRetry={handleRetry} onClose={onClose} />
      </AROverlayShell>
    )
  }

  if (!supportsAR && isModelReady) {
    return (
      <AROverlayShell onClose={onClose}>
        <ARErrorState type="unsupported" onClose={onClose} />
      </AROverlayShell>
    )
  }

  if (isModelError) {
    return (
      <AROverlayShell onClose={onClose}>
        <ARErrorState type="model" onRetry={handleRetry} onClose={onClose} />
      </AROverlayShell>
    )
  }

  return (
    <AROverlayShell onClose={onClose}>
      {/* Loading overlay — fades out when model is ready */}
      {(!isScriptReady || !isModelReady) && (
        <div
          className={cn(
            'absolute inset-0 z-10 flex items-center justify-center',
            'bg-surface-0 transition-opacity duration-300',
            isModelReady && 'opacity-0 pointer-events-none',
          )}
        >
          <ARLoadingState
            progress={!isScriptReady ? undefined : loadProgress}
            message={!isScriptReady ? 'Iniciando AR…' : 'Cargando modelo 3D…'}
          />
        </div>
      )}

      {/* model-viewer — renders only when script is injected */}
      {isScriptReady && (
        <model-viewer
          ref={ref as React.RefObject<HTMLElement>}
          src={asset.glbUrl}
          ios-src={asset.usdzUrl ?? undefined}
          alt={asset.alt}
          poster={asset.posterUrl ?? undefined}
          ar={true}
          ar-modes={arModes}
          ar-scale="auto"
          camera-controls={true}
          auto-rotate={true}
          auto-rotate-delay={3000}
          shadow-intensity="1"
          shadow-softness="0.5"
          exposure="1"
          loading="eager"
          reveal="auto"
          style={{ width: '100%', height: '100%', background: 'transparent' }}
        />
      )}

      {/* Controls bar */}
      {isModelReady && (
        <div className="absolute bottom-safe bottom-6 left-0 right-0 flex justify-center gap-3 px-6 z-20">
          <button
            onClick={launchAR}
            className={cn(
              'flex flex-1 max-w-xs items-center justify-center gap-2',
              'rounded-xl bg-brand-500 px-5 py-3.5',
              'text-sm font-semibold text-white shadow-lg',
              'active:scale-95 transition-transform duration-100',
              !supportsAR && 'opacity-40 pointer-events-none',
            )}
          >
            <Maximize2 size={16} />
            {supportsAR ? 'Ver en tu espacio' : 'AR no disponible'}
          </button>
        </div>
      )}

      {/* Model info */}
      {isModelReady && (
        <div className="absolute top-16 left-0 right-0 flex justify-center z-20 pointer-events-none">
          <p className="text-xs text-white/70 bg-black/20 rounded-full px-3 py-1 backdrop-blur-sm">
            {asset.alt} · Arrastra para rotar
          </p>
        </div>
      )}

      {/* Reset rotation hint */}
      {isModelReady && (
        <button
          className="absolute bottom-24 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm"
          aria-label="Resetear rotación"
          onClick={() => {
            const mv = ref.current as HTMLElement & { resetTurntableRotation?: () => void }
            mv?.resetTurntableRotation?.()
          }}
        >
          <RotateCcw size={16} />
        </button>
      )}
    </AROverlayShell>
  )
}

// ── Shell ─────────────────────────────────────────────────────────────────────

function AROverlayShell({
  onClose,
  children,
}: {
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-surface-900"
      role="dialog"
      aria-modal="true"
      aria-label="Vista AR del plato"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-surface-900/80 backdrop-blur-sm">
        <span className="text-sm font-medium text-white/80">Vista 3D</span>
        <button
          onClick={onClose}
          aria-label="Cerrar vista AR"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Viewer area */}
      <div className="relative flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
