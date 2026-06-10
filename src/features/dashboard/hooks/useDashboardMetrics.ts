import { useQuery } from '@tanstack/react-query'
import { DashboardService } from '../services/DashboardService'
import type { DashboardMetrics } from '../types/dashboard.types'

export function useDashboardMetrics(tenantId: string) {
  return useQuery<DashboardMetrics>({
    queryKey: ['dashboard', 'metrics', tenantId],
    queryFn: () => DashboardService.getMetrics(tenantId),
    enabled: Boolean(tenantId),
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 10,
  })
}
