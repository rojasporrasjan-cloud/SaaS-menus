import { useMemo } from 'react'
import { generateScale, isValidHex, SHADE_KEYS } from '@shared/utils/colorScale'

interface ThemePreviewProps {
  hex: string
}

/**
 * Inline visualisation of the 11-shade scale derived from `hex`.
 * Pure UI — does NOT mutate the document. Useful as a live preview
 * next to a ColorPicker, before the user commits a save.
 */
export function ThemePreview({ hex }: ThemePreviewProps) {
  const scale = useMemo(
    () => (isValidHex(hex) ? generateScale(hex) : null),
    [hex],
  )

  if (!scale) {
    return (
      <p className="text-xs text-surface-400">
        Color inválido — la paleta no puede generarse.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-surface-600">
        Paleta generada
      </p>
      <div className="flex overflow-hidden rounded-xl ring-1 ring-surface-200">
        {SHADE_KEYS.map((key) => (
          <div
            key={key}
            className="group relative flex-1"
            style={{ backgroundColor: scale[key] }}
            title={`${key} · ${scale[key]}`}
          >
            {/* 8:1 ratio swatch */}
            <div className="h-8" aria-hidden />
            {/* Hover-revealed shade label */}
            <span
              className={[
                'absolute inset-x-0 bottom-0 hidden text-center text-[9px] font-medium tracking-wide group-hover:block',
                key < 500 ? 'text-surface-900' : 'text-white',
              ].join(' ')}
            >
              {key}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
