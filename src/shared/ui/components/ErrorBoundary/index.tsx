import { Component, type ReactNode, type ErrorInfo } from 'react'
import { RefreshCw, AlertTriangle } from 'lucide-react'

interface ErrorBoundaryProps {
  readonly children: ReactNode
  readonly fallback?: ReactNode
}

interface ErrorBoundaryState {
  readonly hasError: boolean
  readonly error: Error | null
}

function DefaultFallback({
  error,
  onRetry,
}: {
  error: Error | null
  onRetry: () => void
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 p-8 text-center">
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full"
        style={{ background: 'rgba(220,38,38,0.08)' }}
      >
        <AlertTriangle size={26} style={{ color: '#dc2626' }} />
      </div>
      <div className="flex flex-col gap-1.5">
        <h2 className="text-[18px] font-bold" style={{ color: '#17150f' }}>
          Algo salió mal
        </h2>
        <p className="max-w-sm text-[13px]" style={{ color: '#908c85' }}>
          Ocurrió un error inesperado. Podés intentar recargar la página o volver más tarde.
        </p>
        {error?.message && (
          <p
            className="mt-1 max-w-sm rounded-lg px-3 py-2 font-mono text-[11px]"
            style={{ background: '#fef2f2', color: '#b91c1c' }}
          >
            {error.message}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold text-white transition active:scale-95"
        style={{ background: '#b45309' }}
      >
        <RefreshCw size={14} />
        Reintentar
      </button>
    </div>
  )
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // In production this would feed into a monitoring service (Sentry, etc.)
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <DefaultFallback error={this.state.error} onRetry={this.handleRetry} />
        )
      )
    }
    return this.props.children
  }
}
