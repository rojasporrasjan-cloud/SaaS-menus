import { useQuery } from '@tanstack/react-query'
import { AnalyticsPageService } from '../services/AnalyticsPageService'
import { analyticsQueryKeys } from '../types/analytics.types'
import type { DateRange } from '../types/analytics.types'

export function useAnalyticsSummaries(tenantId: string | null, days: DateRange) {
  return useQuery({
    queryKey: analyticsQueryKeys.summaries(tenantId ?? '', days),
    queryFn: async () => {
      const raw = await AnalyticsPageService.getDailySummaries(tenantId ?? '', days)
      return AnalyticsPageService.fillDateGaps(raw, days)
    },
    enabled: !!tenantId,
    staleTime: 10 * 60 * 1000,
  })
}
