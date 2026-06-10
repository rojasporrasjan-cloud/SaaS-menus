import { useQuery } from '@tanstack/react-query'
import { DishService } from '../services/DishService'
import { dishQueryKeys } from '../types/dish.types'

export function useAdminMenus(tenantId: string | null) {
  return useQuery({
    queryKey: dishQueryKeys.menus(tenantId ?? ''),
    queryFn: () => DishService.getMenus(tenantId ?? ''),
    enabled: !!tenantId,
    staleTime: 5 * 60 * 1000,
  })
}
