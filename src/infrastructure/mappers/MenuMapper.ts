import type { DocumentSnapshot, QueryDocumentSnapshot } from 'firebase/firestore'
import type { Menu, MenuStatus, MenuSchedule } from '@core/domain/entities/Menu'

type FirestoreDoc = DocumentSnapshot | QueryDocumentSnapshot

export class MenuMapper {
  static toDomain(doc: FirestoreDoc, tenantId: string): Menu {
    const data = doc.data()!

    return {
      id: doc.id,
      tenantId,
      name: data['name'] as string,
      description: (data['description'] as string | null) ?? null,
      status: data['status'] as MenuStatus,
      categoryOrder: (data['categoryOrder'] as string[]) ?? [],
      schedule: (data['schedule'] as MenuSchedule | null) ?? null,
      createdAt: data['createdAt'].toDate() as Date,
      updatedAt: data['updatedAt'].toDate() as Date,
    }
  }
}
