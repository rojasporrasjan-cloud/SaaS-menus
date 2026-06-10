import { Link } from 'react-router-dom'
import { Pencil, Trash2, ImageOff, Leaf, Wheat, ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { Spinner } from '@shared/ui/components/Spinner'
import { formatCurrency } from '@shared/utils/formatCurrency'
import { ROUTES } from '@shared/constants/routes'
import type { Dish, DishStatus } from '@core/domain/entities/Dish'

interface AdminDishCardProps {
  readonly dish: Dish
  readonly isDeleting: boolean
  readonly isFirst?: boolean
  readonly isLast?: boolean
  readonly isMoving?: boolean
  readonly onDelete: (dishId: string) => void
  readonly onToggleStatus: (dishId: string, newStatus: DishStatus) => void
  readonly onMoveUp?: () => void
  readonly onMoveDown?: () => void
}

const STATUS_LABELS: Record<DishStatus, string> = {
  available:   'Disponible',
  unavailable: 'No disponible',
  seasonal:    'Temporada',
}

const STATUS_STYLES: Record<DishStatus, string> = {
  available:   'bg-emerald-50 text-emerald-700 border border-emerald-200/50',
  unavailable: 'bg-zinc-100 text-zinc-650 border border-zinc-200/50',
  seasonal:    'bg-amber-50 text-amber-700 border border-amber-200/50',
}

const NEXT_STATUS: Record<DishStatus, DishStatus> = {
  available:   'unavailable',
  unavailable: 'available',
  seasonal:    'available',
}

export function AdminDishCard({
  dish,
  isDeleting,
  isFirst = false,
  isLast = false,
  isMoving = false,
  onDelete,
  onToggleStatus,
  onMoveUp,
  onMoveDown,
}: AdminDishCardProps) {
  const editUrl =
    `${ROUTES.admin.dishes.editor.replace(':dishId', dish.id)}?menuId=${dish.menuId}`

  const handleDelete = () => {
    if (confirm(`¿Eliminar "${dish.name}"? Esta acción no se puede deshacer.`)) {
      onDelete(dish.id)
    }
  }

  return (
    <div
      className="group relative flex flex-col rounded-2xl border border-zinc-200 bg-white shadow-sm hover:shadow-md hover:border-zinc-300 transition-all duration-200"
      style={{
        opacity:     (isDeleting || isMoving) ? 0.5 : 1,
        pointerEvents: (isDeleting || isMoving) ? 'none' : undefined,
      }}
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden rounded-t-2xl bg-zinc-50 border-b border-zinc-100">
        {dish.assets.imageUrl ? (
          <img
            src={dish.assets.imageUrl}
            alt={dish.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-400">
            <ImageOff size={32} strokeWidth={1} />
          </div>
        )}

        {/* Status badge */}
        <span
          className={cn(
            "absolute left-2 top-2 rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase shadow-sm",
            STATUS_STYLES[dish.status]
          )}
        >
          {STATUS_LABELS[dish.status]}
        </span>

        {/* Reorder controls — top-right, visible on hover */}
        {(onMoveUp || onMoveDown) && (
          <div className="absolute right-2 top-2 flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={onMoveUp}
              disabled={isFirst || isMoving}
              className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/90 text-zinc-600 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-amber-700 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Mover arriba"
            >
              <ChevronUp size={12} />
            </button>
            <button
              type="button"
              onClick={onMoveDown}
              disabled={isLast || isMoving}
              className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/90 text-zinc-600 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-amber-700 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Mover abajo"
            >
              <ChevronDown size={12} />
            </button>
          </div>
        )}

        {/* Delete spinner */}
        {(isDeleting || isMoving) && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <Spinner size="sm" />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[13px] font-bold leading-snug text-zinc-800">
            {dish.name}
          </p>
          <p className="shrink-0 text-[13px] font-extrabold text-amber-600">
            {formatCurrency(dish.price.amount, dish.price.currency)}
          </p>
        </div>

        {dish.description && (
          <p className="line-clamp-2 text-[11px] text-zinc-500 leading-normal">
            {dish.description}
          </p>
        )}

        {/* Dietary badges */}
        {(dish.nutrition.isVegetarian || dish.nutrition.isVegan || dish.nutrition.isGlutenFree) && (
          <div className="flex flex-wrap gap-1 mt-1">
            {dish.nutrition.isVegan && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/50 px-2 py-0.5 text-[10px] font-semibold">
                <Leaf size={9} />
                Vegano
              </span>
            )}
            {dish.nutrition.isVegetarian && !dish.nutrition.isVegan && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/50 px-2 py-0.5 text-[10px] font-semibold">
                <Leaf size={9} />
                Vegetariano
              </span>
            )}
            {dish.nutrition.isGlutenFree && (
              <span className="flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 border-amber-200/50 px-2 py-0.5 text-[10px] font-semibold">
                <Wheat size={9} />
                Sin gluten
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="flex items-center gap-1.5 border-t border-zinc-100 p-2.5">
        <button
          type="button"
          onClick={() => onToggleStatus(dish.id, NEXT_STATUS[dish.status])}
          className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-[11px] font-semibold text-zinc-600 transition-all hover:bg-zinc-100 hover:text-zinc-800"
        >
          {dish.status === 'available' ? 'Marcar no disponible' : 'Marcar disponible'}
        </button>
        <Link
          to={editUrl}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-500 transition-all hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700"
          aria-label="Editar plato"
        >
          <Pencil size={13} />
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-500 transition-all hover:bg-red-50 hover:border-red-200 hover:text-red-600 disabled:opacity-50"
          aria-label="Eliminar plato"
        >
          {isDeleting ? <Spinner size="sm" /> : <Trash2 size={13} />}
        </button>
      </div>
    </div>
  )
}
