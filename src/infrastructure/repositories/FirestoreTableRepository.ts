import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore'
import { db } from '@infrastructure/firebase/firestore'
import { firestorePaths } from '@infrastructure/firebase/paths'
import { TableMapper } from '@infrastructure/mappers/TableMapper'
import type { ITableRepository } from '@core/domain/repositories/ITableRepository'
import type { Table } from '@core/domain/entities/Table'
import { NotFoundError } from '@core/errors/NotFoundError'

export class FirestoreTableRepository implements ITableRepository {
  async getById(tenantId: string, tableId: string): Promise<Table> {
    const snap = await getDoc(doc(db, firestorePaths.table(tenantId, tableId)))
    if (!snap.exists()) throw new NotFoundError('Table', tableId)
    return TableMapper.toDomain(snap, tenantId)
  }

  async getAll(tenantId: string): Promise<Table[]> {
    const q = query(
      collection(db, firestorePaths.tables(tenantId)),
      where('status', '==', 'active'),
      orderBy('number', 'asc'),
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => TableMapper.toDomain(d, tenantId))
  }
}
