import { useQuery } from '@tanstack/react-query'
import { QRService } from '../services/QRService'
import { qrQueryKeys } from '../types/qr.types'

export function useTables(tenantId: string | null) {
  return useQuery({
    queryKey: qrQueryKeys.tables(tenantId ?? ''),
    queryFn: () => tenantId ? QRService.getTables(tenantId) : Promise.resolve([]),
    enabled: Boolean(tenantId),
    staleTime: 2 * 60 * 1000,
  })
}
