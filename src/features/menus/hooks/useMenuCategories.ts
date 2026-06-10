import { useQuery } from '@tanstack/react-query'
import { MenuService } from '../services/MenuService'
import { menuQueryKeys } from '../types/menu.types'

export function useMenuCategories(tenantId: string | null, menuId: string | null) {
  return useQuery({
    queryKey: menuQueryKeys.categories(tenantId ?? '', menuId ?? ''),
    queryFn: () => MenuService.getCategories(tenantId ?? '', menuId ?? ''),
    enabled: !!tenantId && !!menuId,
    staleTime: 2 * 60 * 1000,
  })
}
