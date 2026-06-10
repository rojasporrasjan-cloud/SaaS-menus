import { useQuery } from '@tanstack/react-query'
import { MenuService } from '../services/MenuService'
import { menuQueryKeys } from '../types/menu.types'
import type { Dish } from '@core/domain/entities/Dish'

export function useDish(
  tenantId: string | undefined,
  menuId: string | undefined,
  dishId: string | undefined,
): {
  data: Dish | undefined
  isLoading: boolean
  isError: boolean
} {
  return useQuery({
    queryKey: menuQueryKeys.dish(tenantId ?? '', menuId ?? '', dishId ?? ''),
    queryFn: () => MenuService.dishRepository.getById(tenantId ?? '', menuId ?? '', dishId ?? ''),
    enabled: Boolean(tenantId) && Boolean(menuId) && Boolean(dishId),
    staleTime: 1000 * 60 * 5,
  })
}
