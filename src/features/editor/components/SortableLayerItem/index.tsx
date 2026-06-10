import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Eye, EyeOff } from 'lucide-react'
import type { DataLayer } from '@features/editor/types/blocks.types'

// ─── Binding type label ────────────────────────────────────────────────────────

const BINDING_LABELS: Record<DataLayer['binding']['type'], string> = {
  'dish-field':    'Campo de plato',
  'category-name': 'Categoría',
  'dish-list':     'Lista de platos',
  'static':        'Texto fijo',
  'tenant-field':  'Dato del local',
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface SortableLayerItemProps {
  readonly layer:      DataLayer
  readonly isSelected: boolean
  readonly onSelect:   (id: string) => void
  readonly onToggle:   (id: string) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SortableLayerItem({
  layer,
  isSelected,
  onSelect,
  onToggle,
}: SortableLayerItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: layer.id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    // Lift effect while dragging — layer rises above siblings
    zIndex: isDragging ? 50 : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        'group relative flex items-center gap-2 rounded-xl border px-2 py-2 transition-all duration-150 select-none',
        isDragging
          ? 'border-brand-500/60 bg-zinc-800 shadow-2xl shadow-black/50 opacity-95 scale-[1.02]'
          : isSelected
          ? 'border-brand-500/40 bg-brand-500/10'
          : layer.visible
          ? 'border-zinc-800/80 bg-zinc-950/40 hover:border-zinc-700/60 hover:bg-zinc-900/60'
          : 'border-zinc-800/40 bg-zinc-950/20 opacity-50',
      ].join(' ')}
    >
      {/* Drag handle — only this element activates drag, not the whole row */}
      <button
        {...attributes}
        {...listeners}
        aria-label="Arrastrar capa"
        className={[
          'flex h-6 w-5 shrink-0 cursor-grab items-center justify-center rounded-md text-zinc-600 transition-colors active:cursor-grabbing',
          isDragging ? 'text-brand-400' : 'group-hover:text-zinc-400',
        ].join(' ')}
        tabIndex={-1}
      >
        <GripVertical size={14} />
      </button>

      {/* Layer info — clicking selects the layer */}
      <button
        onClick={() => onSelect(layer.id)}
        className="flex min-w-0 flex-1 flex-col items-start text-left"
      >
        <span className={[
          'max-w-full truncate text-[11px] font-semibold leading-tight',
          isSelected ? 'text-brand-300' : layer.visible ? 'text-zinc-200' : 'text-zinc-500',
        ].join(' ')}>
          {layer.label ?? `Capa ${layer.id.substring(0, 6)}…`}
        </span>
        <span className="mt-0.5 text-[9px] font-medium uppercase tracking-wide text-zinc-600">
          {BINDING_LABELS[layer.binding.type]}
        </span>
      </button>

      {/* Z-index badge */}
      <span className="shrink-0 rounded-md border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 text-[8px] font-bold tracking-wider text-zinc-500">
        Z{layer.position.zIndex}
      </span>

      {/* Visibility toggle */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggle(layer.id) }}
        aria-label={layer.visible ? 'Ocultar capa' : 'Mostrar capa'}
        className={[
          'flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors',
          layer.visible
            ? 'text-zinc-500 hover:text-zinc-200'
            : 'text-zinc-700 hover:text-zinc-400',
        ].join(' ')}
      >
        {layer.visible ? <Eye size={13} /> : <EyeOff size={13} />}
      </button>
    </div>
  )
}
