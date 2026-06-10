import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PlusCircle, ChefHat, AlertCircle } from 'lucide-react'
import { useTenantContext } from '@app/providers/TenantProvider'
import { cn } from '@shared/utils/cn'
import {
  AdminDishCard,
  useAdminMenus,
  useAdminDishes,
  useDeleteDish,
  useToggleDishStatus,
  useMoveDish,
} from '@features/dishes'
import { Button } from '@shared/ui/components/Button'
import { Spinner } from '@shared/ui/components/Spinner'
import { ROUTES } from '@shared/constants/routes'
import type { DishStatus } from '@core/domain/entities/Dish'

export default function DishListPage() {
  const { tenantId } = useTenantContext()
  const { data: menus, isLoading: menusLoading } = useAdminMenus(tenantId)
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)

  const resolvedMenuId = activeMenuId ?? menus?.[0]?.id ?? null

  const { data: dishes, isLoading: dishesLoading, error } = useAdminDishes(tenantId, resolvedMenuId)
  const { deleteDish, deletingId } = useDeleteDish(tenantId)
  const { toggleStatus, togglingId } = useToggleDishStatus(tenantId)
  const { moveUp, moveDown, movingId } = useMoveDish(tenantId)

  const isLoading = menusLoading || dishesLoading

  const handleToggleStatus = (dishId: string, newStatus: DishStatus) => {
    if (!resolvedMenuId) return
    void toggleStatus(resolvedMenuId, dishId, newStatus)
  }

  const newDishUrl = resolvedMenuId
    ? `${ROUTES.admin.dishes.new}?menuId=${resolvedMenuId}`
    : ROUTES.admin.dishes.new

  return (
    <div className="flex flex-col gap-7">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
            Carta digital
          </p>
          <h1 className="text-[26px] font-bold tracking-[-0.02em] text-zinc-900">
            Platos
          </h1>
          <p className="text-[13px] text-zinc-500">
            Administra los platos de tu menú digital.
          </p>
        </div>
        <Button asChild className="rounded-xl shadow-sm">
          <Link to={newDishUrl}>
            <PlusCircle size={15} className="mr-2" />
            Nuevo plato
          </Link>
        </Button>
      </div>

      {/* Menu tabs */}
      {menus && menus.length > 1 && (
        <div className="flex gap-1 overflow-x-auto border-b border-zinc-200/80 pb-px">
          {menus.map((menu) => {
            const isActive = (activeMenuId ?? menus[0]?.id) === menu.id
            return (
              <button
                key={menu.id}
                type="button"
                onClick={() => setActiveMenuId(menu.id)}
                className={cn(
                  "shrink-0 border-b-2 px-4 py-2.5 text-[13px] font-medium transition-all outline-none",
                  isActive
                    ? "border-amber-600 text-amber-700"
                    : "border-transparent text-zinc-500 hover:text-zinc-800"
                )}
              >
                {menu.name}
              </button>
            )
          })}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div
          className="flex items-center gap-3 rounded-2xl px-4 py-3 bg-red-50 border border-red-100"
        >
          <AlertCircle size={15} className="text-red-500 shrink-0" />
          <p className="text-[13px] text-red-700">
            Error cargando los platos. Recarga la página.
          </p>
        </div>
      )}

      {/* No menus yet */}
      {!isLoading && !menus?.length && (
        <EmptyState
          icon={<ChefHat size={24} strokeWidth={1.5} />}
          title="Sin menús"
          description="Primero crea un menú antes de agregar platos."
          action={<Button asChild className="rounded-xl shadow-sm"><Link to={ROUTES.admin.menu.list}>Crear menú</Link></Button>}
        />
      )}

      {/* Empty dishes */}
      {!isLoading && menus?.length && !dishes?.length && (
        <EmptyState
          icon={<ChefHat size={24} strokeWidth={1.5} />}
          title="Sin platos en este menú"
          description="Agrega tu primer plato para que aparezca en el menú digital."
          action={
            <Button asChild className="rounded-xl shadow-sm">
              <Link to={newDishUrl}>
                <PlusCircle size={15} className="mr-2" />
                Agregar plato
              </Link>
            </Button>
          }
        />
      )}

      {/* Dishes grid */}
      {!isLoading && dishes && dishes.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {dishes.map((dish, idx) => (
            <AdminDishCard
              key={dish.id}
              dish={dish}
              isDeleting={deletingId === dish.id || togglingId === dish.id}
              isMoving={movingId === dish.id}
              isFirst={idx === 0}
              isLast={idx === dishes.length - 1}
              onDelete={(dishId) => resolvedMenuId && void deleteDish(resolvedMenuId, dishId)}
              onToggleStatus={handleToggleStatus}
              onMoveUp={() => resolvedMenuId && void moveUp(resolvedMenuId, dish.id, dishes)}
              onMoveDown={() => resolvedMenuId && void moveDown(resolvedMenuId, dish.id, dishes)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Empty state ────────────────────────────────────────────────────────────────

function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode
  title: string
  description: string
  action: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-white px-6 py-12 text-center gap-4">
      <div className="text-zinc-300">{icon}</div>
      <div className="flex flex-col gap-1">
        <p className="font-medium text-zinc-700">{title}</p>
        <p className="text-zinc-400 text-sm">{description}</p>
      </div>
      {action}
    </div>
  )
}
