import { useQuery } from '@tanstack/react-query'
import { AnalyticsPageService } from '../services/AnalyticsPageService'
import { analyticsQueryKeys } from '../types/analytics.types'

export function useDishNameMap(tenantId: string | null) {
  return useQuery({
    queryKey: analyticsQueryKeys.dishNames(tenantId ?? ''),
    queryFn: () => AnalyticsPageService.getDishNameMap(tenantId ?? ''),
    enabled: !!tenantId,
    staleTime: 10 * 60 * 1000,
  })
}
