import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from '@infrastructure/firebase/firestore'
import { firestorePaths } from '@infrastructure/firebase/paths'
import { CategoryMapper } from '@infrastructure/mappers/CategoryMapper'
import type { ICategoryRepository } from '@core/domain/repositories/ICategoryRepository'
import type { Category } from '@core/domain/entities/Category'
import { NotFoundError } from '@core/errors/NotFoundError'

export class FirestoreCategoryRepository implements ICategoryRepository {
  async getByMenuId(tenantId: string, menuId: string): Promise<Category[]> {
    const q = query(
      collection(db, firestorePaths.categories(tenantId, menuId)),
      orderBy('sortOrder', 'asc'),
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => CategoryMapper.toDomain(d, tenantId, menuId))
  }

  async getById(tenantId: string, menuId: string, categoryId: string): Promise<Category> {
    const snap = await getDoc(
      doc(db, firestorePaths.category(tenantId, menuId, categoryId)),
    )
    if (!snap.exists()) throw new NotFoundError('Category', categoryId)
    return CategoryMapper.toDomain(snap, tenantId, menuId)
  }
}
