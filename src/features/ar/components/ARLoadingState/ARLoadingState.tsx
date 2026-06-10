import { cn } from '@shared/utils/cn'

interface ARLoadingStateProps {
  progress?: number
  message?: string
  className?: string
}

export function ARLoadingState({
  progress,
  message = 'Cargando modelo 3D…',
  className,
}: ARLoadingStateProps) {
  return (
    <div
      role="status"
      aria-label={message}
      className={cn(
        'flex flex-col items-center justify-center gap-4 p-8 text-center',
        className,
      )}
    >
      {/* 3D cube pulse animation */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-xl bg-brand-100 animate-ping opacity-50" />
        <div className="relative flex items-center justify-center w-16 h-16 rounded-xl bg-brand-100">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            className="text-brand-600"
          >
            <path
              d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-surface-700">{message}</p>
        {progress !== undefined && progress > 0 && (
          <p className="text-xs text-surface-400">{progress}%</p>
        )}
      </div>

      {/* Progress bar */}
      {progress !== undefined && (
        <div className="w-48 h-1.5 rounded-full bg-surface-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-brand-500 transition-all duration-300"
            style={{ width: `${Math.max(5, progress)}%` }}
          />
        </div>
      )}
    </div>
  )
}
