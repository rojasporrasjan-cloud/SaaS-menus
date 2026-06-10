import { useRef } from 'react'
import { ImagePlus, X, Upload } from 'lucide-react'

interface TenantAssetUploadProps {
  label: string
  hint?: string
  previewUrl: string | null
  uploadProgress: number
  isUploading: boolean
  aspectClass?: string           // e.g. 'aspect-square' | 'aspect-video'
  onFileSelect: (file: File) => void
  onClear: () => void
}

export function TenantAssetUpload({
  label,
  hint,
  previewUrl,
  uploadProgress,
  isUploading,
  aspectClass = 'aspect-square',
  onFileSelect,
  onClear,
}: TenantAssetUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) onFileSelect(file)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-surface-700">{label}</label>
        {hint && <span className="text-xs text-surface-400">{hint}</span>}
      </div>

      <div className={`relative w-full max-w-xs overflow-hidden rounded-2xl border border-surface-200 ${aspectClass}`}>
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt={label}
              className="h-full w-full object-cover"
            />

            {/* Upload progress overlay */}
            {isUploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                <Upload size={18} className="text-white" />
                <p className="mt-1 text-xs font-medium text-white">{uploadProgress}%</p>
                <div className="mt-2 h-1 w-20 overflow-hidden rounded-full bg-white/30">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Change / clear buttons */}
            {!isUploading && (
              <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/40 to-transparent p-2 opacity-0 transition-opacity hover:opacity-100">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="rounded-lg bg-white/90 px-2 py-1 text-xs font-medium text-surface-800 shadow hover:bg-white"
                >
                  Cambiar
                </button>
                <button
                  type="button"
                  onClick={onClear}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                  aria-label="Eliminar imagen"
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 bg-surface-50 text-surface-400 transition-colors hover:bg-brand-50 hover:text-brand-500"
          >
            <ImagePlus size={22} strokeWidth={1.5} />
            <p className="text-xs font-medium">Subir imagen</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onFileSelect(f)
          e.target.value = ''
        }}
      />
    </div>
  )
}
