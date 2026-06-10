import { AlertTriangle } from 'lucide-react'
import { Button } from '@shared/ui/components/Button'

interface ARErrorStateProps {
  type: 'script' | 'model' | 'unsupported'
  onRetry?: () => void
  onClose?: () => void
}

const MESSAGES = {
  script: {
    title: 'No se pudo cargar AR',
    body: 'Verifica tu conexión a internet e intenta de nuevo.',
  },
  model: {
    title: 'Error al cargar el modelo',
    body: 'El modelo 3D no pudo cargarse. Intenta de nuevo.',
  },
  unsupported: {
    title: 'AR no disponible',
    body: 'Tu dispositivo no soporta realidad aumentada. Prueba desde un smartphone moderno.',
  },
} as const

export function ARErrorState({ type, onRetry, onClose }: ARErrorStateProps) {
  const { title, body } = MESSAGES[type]

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
        <AlertTriangle size={24} className="text-red-500" />
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-surface-900">{title}</p>
        <p className="text-xs text-surface-500 max-w-[240px]">{body}</p>
      </div>

      <div className="flex gap-2">
        {onRetry && type !== 'unsupported' && (
          <Button size="sm" onClick={onRetry}>
            Reintentar
          </Button>
        )}
        {onClose && (
          <Button size="sm" variant="ghost" onClick={onClose}>
            Cerrar
          </Button>
        )}
      </div>
    </div>
  )
}
