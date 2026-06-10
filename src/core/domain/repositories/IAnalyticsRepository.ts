import type { AnalyticsEvent, AnalyticsEventType } from '../entities/AnalyticsEvent'

export interface IAnalyticsRepository {
  track(tenantId: string, event: Omit<AnalyticsEvent, 'id' | 'tenantId'>): Promise<void>
  getEventsByType(tenantId: string, type: AnalyticsEventType, limit: number): Promise<AnalyticsEvent[]>
}
