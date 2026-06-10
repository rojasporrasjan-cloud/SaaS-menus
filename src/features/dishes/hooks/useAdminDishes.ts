import { useQuery } from '@tanstack/react-query'
import { DishService } from '../services/DishService'
import { dishQueryKeys } from '../types/dish.types'

export function useAdminDishes(tenantId: string | null, menuId: string | null) {
  return useQuery({
    queryKey: dishQueryKeys.byMenu(tenantId ?? '', menuId ?? ''),
    queryFn: () => DishService.getDishesByMenu(tenantId ?? '', menuId ?? ''),
    enabled: !!tenantId && !!menuId,
    staleTime: 2 * 60 * 1000,
  })
}
