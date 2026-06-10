import type { DishesGroupedByCategory } from '@core/use-cases/menu/GetActiveDishesUseCase'
import type { Menu } from '@core/domain/entities/Menu'
import type { Table } from '@core/domain/entities/Table'
import type { Dish } from '@core/domain/entities/Dish'

// ── Re-exports for consumers (single import point) ───────────────────────────
export type { Menu, Table, Dish, DishesGroupedByCategory }

// ── Query key factory ─────────────────────────────────────────────────────────
export const menuQueryKeys = {
  all: ['menu'] as const,
  tableMenu: (tenantId: string, tableId: string) =>
    ['menu', 'table', tenantId, tableId] as const,
  dishes: (tenantId: string, menuId: string) =>
    ['menu', 'dishes', tenantId, menuId] as const,
  dish: (tenantId: string, menuId: string, dishId: string) =>
    ['menu', 'dish', tenantId, menuId, dishId] as const,
}

// ── Component prop types ──────────────────────────────────────────────────────
export interface DishCardProps {
  dish: Dish
  tenantId: string
  menuId: string
  isFeatured?: boolean
}

export interface CategoryFilterProps {
  categories: Array<{ id: string; name: string }>
  activeId: string | null
  onSelect: (categoryId: string) => void
}

export interface DishGridProps {
  groups: DishesGroupedByCategory[]
  tenantId: string
  menuId: string
  activeCategoryId: string | null
}
