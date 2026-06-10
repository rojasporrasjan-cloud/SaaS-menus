import type { DocumentSnapshot, QueryDocumentSnapshot, Timestamp } from 'firebase/firestore'
import type { Table, TableStatus } from '@core/domain/entities/Table'

type FirestoreDoc = DocumentSnapshot | QueryDocumentSnapshot

export class TableMapper {
  static toDomain(doc: FirestoreDoc, tenantId: string): Table {
    const data = doc.data()!
    const qrGeneratedAtRaw = data['qrGeneratedAt'] as Timestamp | null | undefined

    return {
      id: doc.id,
      tenantId,
      menuId: data['menuId'] as string,
      number: data['number'] as string,
      label: (data['label'] as string | null) ?? null,
      status: data['status'] as TableStatus,
      qrCodeUrl: (data['qrCodeUrl'] as string | null) ?? null,
      qrMenuUrl: (data['qrMenuUrl'] as string | null) ?? null,
      qrGeneratedAt: qrGeneratedAtRaw ? qrGeneratedAtRaw.toDate() : null,
      createdAt: (data['createdAt'] as Timestamp).toDate(),
    }
  }
}
