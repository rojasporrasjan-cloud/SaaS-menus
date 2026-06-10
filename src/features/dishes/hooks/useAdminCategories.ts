import { useQuery } from '@tanstack/react-query'
import { DishService } from '../services/DishService'
import { dishQueryKeys } from '../types/dish.types'

export function useAdminCategories(tenantId: string | null, menuId: string | null) {
  return useQuery({
    queryKey: dishQueryKeys.categories(tenantId ?? '', menuId ?? ''),
    queryFn: () => DishService.getCategories(tenantId ?? '', menuId ?? ''),
    enabled: !!tenantId && !!menuId,
    staleTime: 5 * 60 * 1000,
  })
}
