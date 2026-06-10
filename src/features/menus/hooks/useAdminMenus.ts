import { useQuery } from '@tanstack/react-query'
import { MenuService } from '../services/MenuService'
import { menuQueryKeys } from '../types/menu.types'

export function useAdminMenus(tenantId: string | null) {
  return useQuery({
    queryKey: menuQueryKeys.all(tenantId ?? ''),
    queryFn: () => MenuService.getMenus(tenantId ?? ''),
    enabled: !!tenantId,
    staleTime: 5 * 60 * 1000,
  })
}
