import { useRef, useState } from 'react'
import { UploadCloud, ImagePlus, AlertCircle, CheckCircle2, Loader2, ScanSearch } from 'lucide-react'
import type { TemplateId } from '@core/domain/entities/Tenant'
import { useExtractMenuFromImage } from '@features/editor/hooks/useExtractMenuFromImage'
import type { ExtractPhase } from '@features/editor/hooks/useExtractMenuFromImage'
import { LIMITS } from '@shared/constants/limits'

// ─── Props ────────────────────────────────────────────────────────────────────

interface MenuImageUploaderProps {
  readonly tenantId: string
  readonly templateId: TemplateId
  readonly onDone?: () => void
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCEPTED_MIME_TYPES = [
  ...LIMITS.upload.acceptedImageTypes,
  'application/pdf',
] as const

const ACCEPTED_ACCEPT_ATTR = ACCEPTED_MIME_TYPES.join(',')

const MAX_SIZE_MB = LIMITS.upload.maxFileSizeBytes / (1024 * 1024)

// ─── File validation ──────────────────────────────────────────────────────────

type ValidationError = 'TYPE_NOT_SUPPORTED' | 'FILE_TOO_LARGE'

function validateFile(file: File): ValidationError | null {
  const isAcceptedType = (ACCEPTED_MIME_TYPES as readonly string[]).includes(file.type)
  if (!isAcceptedType) return 'TYPE_NOT_SUPPORTED'
  if (file.size > LIMITS.upload.maxFileSizeBytes) return 'FILE_TOO_LARGE'
  return null
}

const VALIDATION_MESSAGES: Record<ValidationError, string> = {
  TYPE_NOT_SUPPORTED: `Solo se aceptan imágenes JPG, PNG, WebP o PDF`,
  FILE_TOO_LARGE:     `El archivo supera el límite de ${MAX_SIZE_MB} MB`,
}

// ─── Base64 conversion ────────────────────────────────────────────────────────

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = () => {
      const result = reader.result
      if (typeof result !== 'string') { reject(new Error('FileReader did not return a string')); return }
      // Strip the data URL prefix (e.g. "data:image/jpeg;base64,") — Cloud Function expects raw base64
      const base64 = result.split(',')[1]
      if (!base64) { reject(new Error('Could not extract base64 from data URL')); return }
      resolve(base64)
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

// ─── Phase UI descriptors ─────────────────────────────────────────────────────

interface PhaseDescriptor {
  readonly icon: React.ReactNode
  readonly title: string
  readonly subtitle: string
  readonly showProgress: boolean
}

function getPhaseDescriptor(phase: ExtractPhase): PhaseDescriptor | null {
  switch (phase.phase) {
    case 'idle':  return null
    case 'done':  return null

    case 'extracting':
      return {
        icon: <Loader2 size={32} className="animate-spin text-brand-500" />,
        title: 'Analizando imagen…',
        subtitle: 'La IA está leyendo tu menú físico. Puede tardar unos segundos.',
        showProgress: true,
      }

    case 'parsing':
      return {
        icon: <ScanSearch size={32} className="animate-pulse text-brand-500" />,
        title: 'Mapeando coordenadas…',
        subtitle: 'Calculando la posición de cada platillo y precio en el lienzo.',
        showProgress: true,
      }

    case 'error':
      return {
        icon: <AlertCircle size={32} className="text-red-500" />,
        title: 'No se pudo procesar la imagen',
        subtitle: phase.message,
        showProgress: false,
      }
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MenuImageUploader({ tenantId, templateId, onDone }: MenuImageUploaderProps) {
  const [isDragOver, setIsDragOver]       = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { status, extract, reset } = useExtractMenuFromImage(tenantId, templateId)

  const isProcessing = status.phase === 'extracting' || status.phase === 'parsing'

  async function processFile(file: File): Promise<void> {
    setValidationError(null)

    const error = validateFile(file)
    if (error) {
      setValidationError(VALIDATION_MESSAGES[error])
      return
    }

    const base64 = await fileToBase64(file)
    await extract(base64, file.type)

    if (status.phase === 'done') onDone?.()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    // Reset input so the same file can be re-uploaded after an error
    e.target.value = ''
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>): void {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>): void {
    e.preventDefault()
    setIsDragOver(true)
  }

  function handleDragLeave(): void {
    setIsDragOver(false)
  }

  function handleRetry(): void {
    reset()
    setValidationError(null)
  }

  // ── Render: done ─────────────────────────────────────────────────────────────

  if (status.phase === 'done') {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-6 py-8 text-center">
        <CheckCircle2 size={36} className="text-green-500" />
        <p className="font-semibold text-green-800">¡Menú digitalizado con éxito!</p>
        <p className="text-sm text-green-600">
          Las capas de datos se han cargado en el lienzo. Ajusta las posiciones según necesites.
        </p>
        <button
          onClick={handleRetry}
          className="mt-1 text-xs text-green-700 underline underline-offset-2 hover:text-green-900"
        >
          Subir otra imagen
        </button>
      </div>
    )
  }

  // ── Render: processing overlay ────────────────────────────────────────────────

  const phaseDescriptor = getPhaseDescriptor(status)

  if (phaseDescriptor) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-surface-100 bg-surface-50 px-6 py-10 text-center">
        {phaseDescriptor.icon}
        <div>
          <p className="font-semibold text-surface-900">{phaseDescriptor.title}</p>
          <p className="mt-1 text-sm text-surface-500">{phaseDescriptor.subtitle}</p>
        </div>

        {phaseDescriptor.showProgress && (
          <div className="w-full max-w-xs overflow-hidden rounded-full bg-surface-100">
            <div
              className="h-1.5 animate-pulse rounded-full bg-brand-400"
              style={{ width: status.phase === 'parsing' ? '85%' : '45%' }}
            />
          </div>
        )}

        {status.phase === 'error' && (
          <button
            onClick={handleRetry}
            className="mt-1 rounded-lg border border-surface-200 px-4 py-1.5 text-sm font-medium text-surface-700 hover:bg-surface-100 active:bg-surface-200"
          >
            Intentar de nuevo
          </button>
        )}
      </div>
    )
  }

  // ── Render: drop zone (idle) ──────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-3">
      <div
        role="button"
        tabIndex={0}
        aria-label="Zona de carga de imagen del menú"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isProcessing && inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click() }}
        className={[
          'flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors',
          isDragOver
            ? 'border-brand-400 bg-brand-50'
            : 'border-surface-200 bg-surface-50 hover:border-brand-300 hover:bg-brand-50/40',
        ].join(' ')}
      >
        <div className={[
          'flex h-14 w-14 items-center justify-center rounded-2xl transition-colors',
          isDragOver ? 'bg-brand-100' : 'bg-surface-100',
        ].join(' ')}>
          {isDragOver
            ? <UploadCloud size={28} className="text-brand-500" />
            : <ImagePlus  size={28} className="text-surface-400" />
          }
        </div>

        <div>
          <p className="font-semibold text-surface-800">
            {isDragOver ? 'Suelta aquí tu imagen' : 'Sube la foto de tu menú físico'}
          </p>
          <p className="mt-1 text-sm text-surface-500">
            Arrastra o haz clic · JPG, PNG, WebP o PDF · Máx. {MAX_SIZE_MB} MB
          </p>
        </div>

        <span className="rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 active:bg-brand-700">
          Elegir archivo
        </span>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_ACCEPT_ATTR}
          onChange={handleFileChange}
          className="sr-only"
          aria-hidden="true"
        />
      </div>

      {validationError && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
          <p className="text-sm text-red-700">{validationError}</p>
        </div>
      )}
    </div>
  )
}
