import { useQuery } from '@tanstack/react-query'
import { DishService } from '../services/DishService'
import { dishQueryKeys } from '../types/dish.types'

export function useAdminDish(
  tenantId: string | null,
  menuId: string | null,
  dishId: string | null,
) {
  return useQuery({
    queryKey: dishQueryKeys.detail(tenantId ?? '', menuId ?? '', dishId ?? ''),
    queryFn: () => DishService.getDishById(tenantId ?? '', menuId ?? '', dishId ?? ''),
    enabled: !!tenantId && !!menuId && !!dishId,
    staleTime: 2 * 60 * 1000,
  })
}
