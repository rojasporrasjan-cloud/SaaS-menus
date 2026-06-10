import { BookOpen, ChevronRight, Archive } from 'lucide-react'
import type { Menu } from '@core/domain/entities/Menu'

interface MenuCardProps {
  menu: Menu
  categoryCount: number
  dishCount?: number
  isSelected: boolean
  isArchiving: boolean
  onSelect: () => void
  onEdit: () => void
  onArchive: () => void
}

const STATUS_STYLES: Record<Menu['status'], string> = {
  active: 'bg-green-50 text-green-700',
  draft: 'bg-amber-50 text-amber-700',
  archived: 'bg-surface-100 text-surface-500',
}

const STATUS_LABELS: Record<Menu['status'], string> = {
  active: 'Activo',
  draft: 'Borrador',
  archived: 'Archivado',
}

export function MenuCard({
  menu,
  categoryCount,
  isSelected,
  isArchiving,
  onSelect,
  onEdit,
  onArchive,
}: MenuCardProps) {
  const isArchived = menu.status === 'archived'

  return (
    <div
      className={[
        'group relative rounded-2xl border p-4 transition-all cursor-pointer',
        isSelected
          ? 'border-brand-300 bg-brand-50 shadow-sm'
          : 'border-surface-100 bg-surface-0 hover:border-surface-200 hover:shadow-sm',
        isArchived ? 'opacity-60' : '',
      ].join(' ')}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3">
        <div
          className={[
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors',
            isSelected ? 'bg-brand-100 text-brand-600' : 'bg-surface-100 text-surface-500',
          ].join(' ')}
        >
          <BookOpen size={16} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-surface-900">{menu.name}</p>
            <span
              className={`shrink-0 rounded-full px-1.5 py-0.5 text-xs font-medium ${STATUS_STYLES[menu.status]}`}
            >
              {STATUS_LABELS[menu.status]}
            </span>
          </div>

          {menu.description && (
            <p className="mt-0.5 truncate text-xs text-surface-400">{menu.description}</p>
          )}

          <p className="mt-1 text-xs text-surface-400">
            {categoryCount} {categoryCount === 1 ? 'categoría' : 'categorías'}
          </p>
        </div>

        <ChevronRight
          size={15}
          className={`shrink-0 transition-transform ${isSelected ? 'text-brand-400 rotate-90' : 'text-surface-300'}`}
        />
      </div>

      {/* Inline action buttons — visible on hover or when selected */}
      <div
        className={[
          'mt-3 flex gap-2 transition-opacity',
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
        ].join(' ')}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onEdit}
          className="flex-1 rounded-lg border border-surface-200 py-1 text-xs font-medium text-surface-600 hover:bg-surface-50 transition-colors"
        >
          Editar
        </button>

        {!isArchived && (
          <button
            type="button"
            onClick={() => {
              if (confirm(`¿Archivar "${menu.name}"? Dejará de ser visible en el menú público.`)) {
                onArchive()
              }
            }}
            disabled={isArchiving}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-surface-200 text-surface-400 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition-colors disabled:opacity-50"
            aria-label="Archivar menú"
          >
            <Archive size={13} />
          </button>
        )}
      </div>
    </div>
  )
}
