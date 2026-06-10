import { addDoc, collection } from 'firebase/firestore'
import { db } from '@infrastructure/firebase/firestore'
import { firestorePaths } from '@infrastructure/firebase/paths'
import type { IAnalyticsRepository } from '@core/domain/repositories/IAnalyticsRepository'
import type { AnalyticsEvent, AnalyticsEventType } from '@core/domain/entities/AnalyticsEvent'

export class AnalyticsService implements IAnalyticsRepository {
  async track(
    tenantId: string,
    event: Omit<AnalyticsEvent, 'id' | 'tenantId'>,
  ): Promise<void> {
    await addDoc(collection(db, firestorePaths.analyticsEvents(tenantId)), {
      ...event,
      tenantId,
      timestamp: new Date(),
    })
  }

  async getEventsByType(
    _tenantId: string,
    _type: AnalyticsEventType,
    _limit: number,
  ): Promise<AnalyticsEvent[]> {
    // Aggregated analytics are built by Cloud Functions (Step 6).
    // Raw event queries are intentionally deferred to the analytics feature.
    return []
  }
}
