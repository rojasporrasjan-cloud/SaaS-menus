import { useRef, useEffect, useState, useCallback } from 'react'

interface ModelViewerState {
  loadProgress: number
  isModelReady: boolean
  isARActive: boolean
  isError: boolean
}

/**
 * Manages the ref and event lifecycle of a <model-viewer> element.
 * Cleans up WebGL resources on unmount to free GPU memory on low-end devices.
 */
export function useModelViewer() {
  const ref = useRef<HTMLElement>(null)

  const [state, setState] = useState<ModelViewerState>({
    loadProgress: 0,
    isModelReady: false,
    isARActive: false,
    isError: false,
  })

  const launchAR = useCallback(() => {
    // Programmatic AR activation via model-viewer public API
    const mv = ref.current as HTMLElement & { activateAR?: () => void }
    mv?.activateAR?.()
  }, [])

  useEffect(() => {
    const mv = ref.current
    if (!mv) return

    const onProgress = (e: Event) => {
      const detail = (e as CustomEvent<{ totalProgress: number }>).detail
      setState((prev) => ({
        ...prev,
        loadProgress: Math.round(detail.totalProgress * 100),
      }))
    }

    const onLoad = () =>
      setState((prev) => ({ ...prev, isModelReady: true, loadProgress: 100 }))

    const onError = () =>
      setState((prev) => ({ ...prev, isError: true }))

    const onARStatus = (e: Event) => {
      const detail = (e as CustomEvent<{ status: string }>).detail
      setState((prev) => ({
        ...prev,
        isARActive: detail.status === 'session-started',
      }))
    }

    mv.addEventListener('progress', onProgress)
    mv.addEventListener('load', onLoad)
    mv.addEventListener('error', onError)
    mv.addEventListener('ar-status', onARStatus)

    return () => {
      mv.removeEventListener('progress', onProgress)
      mv.removeEventListener('load', onLoad)
      mv.removeEventListener('error', onError)
      mv.removeEventListener('ar-status', onARStatus)
    }
  }, [])

  return { ref, ...state, launchAR }
}
