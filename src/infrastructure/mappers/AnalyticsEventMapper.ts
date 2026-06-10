import type { DocumentData, QueryDocumentSnapshot, Timestamp } from 'firebase/firestore'
import type { AnalyticsEvent, AnalyticsEventType, DeviceType } from '@core/domain/entities/AnalyticsEvent'

export class AnalyticsEventMapper {
  static toDomain(doc: QueryDocumentSnapshot<DocumentData>): AnalyticsEvent {
    const data = doc.data()

    return {
      id: doc.id,
      tenantId: data['tenantId'] as string,
      type: data['type'] as AnalyticsEventType,
      menuId: (data['menuId'] as string | null) ?? null,
      dishId: (data['dishId'] as string | null) ?? null,
      tableId: (data['tableId'] as string | null) ?? null,
      sessionId: data['sessionId'] as string,
      deviceType: (data['deviceType'] as DeviceType) ?? 'mobile',
      timestamp: (data['timestamp'] as Timestamp).toDate(),
    }
  }
}
