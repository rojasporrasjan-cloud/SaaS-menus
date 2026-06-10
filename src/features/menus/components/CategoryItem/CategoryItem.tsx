import { Pencil, Trash2, ChevronUp, ChevronDown, GripVertical } from 'lucide-react'
import { Spinner } from '@shared/ui/components/Spinner'
import type { Category } from '@core/domain/entities/Category'

interface CategoryItemProps {
  category: Category
  index: number
  total: number
  isDeleting: boolean
  isMoving: boolean
  onEdit: () => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}

export function CategoryItem({
  category,
  index,
  total,
  isDeleting,
  isMoving,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}: CategoryItemProps) {
  const isBusy = isDeleting || isMoving

  return (
    <div
      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all"
      style={{
        background:    '#ffffff',
        border:        '1px solid #efede9',
        opacity:       isBusy ? 0.5 : 1,
        pointerEvents: isBusy ? 'none' : undefined,
      }}
    >
      {/* Drag handle visual (decorative) */}
      <GripVertical size={14} className="shrink-0" style={{ color: '#bfbbb4' }} />

      {/* Name */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium" style={{ color: '#27251f' }}>
          {category.name}
        </p>
        {category.description && (
          <p className="truncate text-[11px]" style={{ color: '#908c85' }}>
            {category.description}
          </p>
        )}
      </div>

      {/* Busy indicator */}
      {isBusy && <Spinner size="sm" />}

      {/* Actions */}
      {!isBusy && (
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="flex h-6 w-6 items-center justify-center rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-30"
            style={{ color: '#908c85' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#faf9f7'; e.currentTarget.style.color = '#3d3b38' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#908c85' }}
            aria-label="Mover arriba"
          >
            <ChevronUp size={13} />
          </button>

          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="flex h-6 w-6 items-center justify-center rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-30"
            style={{ color: '#908c85' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#faf9f7'; e.currentTarget.style.color = '#3d3b38' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#908c85' }}
            aria-label="Mover abajo"
          >
            <ChevronDown size={13} />
          </button>

          <button
            type="button"
            onClick={onEdit}
            className="flex h-6 w-6 items-center justify-center rounded-md transition-colors"
            style={{ color: '#908c85' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(233,154,14,0.08)'; e.currentTarget.style.color = '#cc7809' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#908c85' }}
            aria-label="Editar categoría"
          >
            <Pencil size={12} />
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm(`¿Eliminar la categoría "${category.name}"?`)) onDelete()
            }}
            className="flex h-6 w-6 items-center justify-center rounded-md transition-colors"
            style={{ color: '#908c85' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.07)'; e.currentTarget.style.color = '#dc2626' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#908c85' }}
            aria-label="Eliminar categoría"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}
    </div>
  )
}
