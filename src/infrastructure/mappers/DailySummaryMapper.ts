import type { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore'
import type { DailySummary } from '@features/analytics/types/analytics.types'
import type { AnalyticsEventType } from '@core/domain/entities/AnalyticsEvent'

export class DailySummaryMapper {
  static toDomain(doc: QueryDocumentSnapshot<DocumentData>): DailySummary {
    const data = doc.data()

    return {
      date: data['date'] as string,
      totalEvents: (data['totalEvents'] as number) ?? 0,
      counts: (data['counts'] as Partial<Record<AnalyticsEventType, number>>) ?? {},
      dishes:
        (data['dishes'] as Record<string, Partial<Record<AnalyticsEventType, number>>>) ?? {},
    }
  }
}
