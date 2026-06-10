import { useQuery } from '@tanstack/react-query'
import { MenuService } from '../services/MenuService'
import { menuQueryKeys } from '../types/menu.types'

/**
 * Resolves the menu and table for a given QR scan.
 * Result is cached indefinitely per session (menus rarely change mid-service).
 */
export function useTableMenu(tenantId: string, tableId: string) {
  return useQuery({
    queryKey: menuQueryKeys.tableMenu(tenantId, tableId),
    queryFn: () => MenuService.getMenuByTable.execute(tenantId, tableId),
    enabled: Boolean(tenantId) && Boolean(tableId),
    staleTime: 1000 * 60 * 10,
  })
}
