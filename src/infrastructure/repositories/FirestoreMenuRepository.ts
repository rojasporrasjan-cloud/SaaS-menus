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
import { MenuMapper } from '@infrastructure/mappers/MenuMapper'
import type { IMenuRepository } from '@core/domain/repositories/IMenuRepository'
import type { Menu } from '@core/domain/entities/Menu'
import { NotFoundError } from '@core/errors/NotFoundError'

export class FirestoreMenuRepository implements IMenuRepository {
  async getActiveByTenantId(tenantId: string): Promise<Menu[]> {
    const q = query(
      collection(db, firestorePaths.menus(tenantId)),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc'),
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => MenuMapper.toDomain(d, tenantId))
  }

  async getById(tenantId: string, menuId: string): Promise<Menu> {
    const snap = await getDoc(doc(db, firestorePaths.menu(tenantId, menuId)))
    if (!snap.exists()) throw new NotFoundError('Menu', menuId)
    return MenuMapper.toDomain(snap, tenantId)
  }
}
