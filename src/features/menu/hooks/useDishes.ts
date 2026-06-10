import { useQuery } from '@tanstack/react-query'
import { MenuService } from '../services/MenuService'
import { menuQueryKeys } from '../types/menu.types'
import type { DishesGroupedByCategory } from '../types/menu.types'

/**
 * Fetches all available dishes for a menu, grouped and ordered by category.
 * Depends on menu.categoryOrder to determine display order.
 */
export function useActiveDishes(
  tenantId: string,
  menuId: string,
  categoryOrder: string[],
): {
  groups: DishesGroupedByCategory[]
  isLoading: boolean
  isError: boolean
} {
  const { data, isLoading, isError } = useQuery({
    queryKey: menuQueryKeys.dishes(tenantId, menuId),
    queryFn: () => MenuService.getActiveDishes.execute(tenantId, menuId, categoryOrder),
    enabled: Boolean(tenantId) && Boolean(menuId),
    staleTime: 1000 * 60 * 5,
  })

  return {
    groups: data ?? [],
    isLoading,
    isError,
  }
}
