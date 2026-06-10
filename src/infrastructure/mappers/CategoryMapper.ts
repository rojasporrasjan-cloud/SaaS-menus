import type { DocumentSnapshot, QueryDocumentSnapshot } from 'firebase/firestore'
import type { Category } from '@core/domain/entities/Category'

type FirestoreDoc = DocumentSnapshot | QueryDocumentSnapshot

export class CategoryMapper {
  static toDomain(doc: FirestoreDoc, tenantId: string, menuId: string): Category {
    const data = doc.data()!

    return {
      id: doc.id,
      tenantId,
      menuId,
      name: data['name'] as string,
      description: (data['description'] as string | null) ?? null,
      imageUrl: (data['imageUrl'] as string | null) ?? null,
      sortOrder: (data['sortOrder'] as number) ?? 0,
    }
  }
}
