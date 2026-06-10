import { useRef } from 'react'

interface ColorPickerProps {
  value: string
  onChange: (hex: string) => void
  error?: string
}

export function ColorPicker({ value, onChange, error }: ColorPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleHexInput = (raw: string) => {
    // Allow typing without # prefix
    const normalized = raw.startsWith('#') ? raw : `#${raw}`
    onChange(normalized)
  }

  const isValidHex = /^#[0-9a-fA-F]{6}$/.test(value)

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-surface-700">Color principal</label>

      <div className="flex items-center gap-3">
        {/* Color swatch — clicking opens native color picker */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="h-10 w-10 shrink-0 rounded-xl border-2 border-white shadow-md ring-1 ring-surface-200 transition-transform hover:scale-105 active:scale-95"
          style={{ background: isValidHex ? value : '#e85d04' }}
          aria-label="Abrir selector de color"
        />

        {/* Hidden native color input */}
        <input
          ref={inputRef}
          type="color"
          value={isValidHex ? value : '#e85d04'}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
        />

        {/* Hex text input */}
        <input
          type="text"
          value={value}
          onChange={(e) => handleHexInput(e.target.value)}
          placeholder="#e85d04"
          maxLength={7}
          className={[
            'w-32 rounded-xl border bg-surface-0 px-3 py-2 font-mono text-sm',
            'focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400',
            error ? 'border-red-400' : 'border-surface-200',
          ].join(' ')}
        />

        {/* Preview text on white + dark background */}
        <div className="flex gap-2">
          <div
            className="flex h-8 w-16 items-center justify-center rounded-lg text-xs font-semibold"
            style={{ background: isValidHex ? value : '#e85d04', color: '#fff' }}
          >
            Aa
          </div>
        </div>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
