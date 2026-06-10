import { useRef } from 'react'
import { ImagePlus, X } from 'lucide-react'

interface DishImageUploadProps {
  previewUrl: string | null
  uploadProgress: number
  isUploading: boolean
  onFileSelect: (file: File) => void
  onClear: () => void
}

export function DishImageUpload({
  previewUrl,
  uploadProgress,
  isUploading,
  onFileSelect,
  onClear,
}: DishImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) onFileSelect(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFileSelect(file)
    e.target.value = ''
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-surface-700">Imagen del plato</label>

      {previewUrl ? (
        <div className="relative rounded-xl overflow-hidden border border-surface-200 bg-surface-50">
          <img
            src={previewUrl}
            alt="Preview"
            className="h-48 w-full object-cover"
          />

          {/* Upload progress overlay */}
          {isUploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
              <p className="text-sm font-medium text-white">{uploadProgress}%</p>
              <div className="mt-2 h-1.5 w-32 overflow-hidden rounded-full bg-white/30">
                <div
                  className="h-full bg-white transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Clear button */}
          {!isUploading && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="Eliminar imagen"
            >
              <X size={14} />
            </button>
          )}
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex h-48 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-surface-200 bg-surface-50 text-surface-400 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-500"
        >
          <ImagePlus size={28} strokeWidth={1.5} />
          <div className="text-center">
            <p className="text-sm font-medium">Arrastra o haz clic para subir</p>
            <p className="text-xs">PNG, JPG o WEBP · Máx. 5MB</p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={handleFileChange}
      />
    </div>
  )
}
