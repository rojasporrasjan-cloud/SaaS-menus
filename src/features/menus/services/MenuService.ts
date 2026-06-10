import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@infrastructure/firebase/firestore'
import { firestorePaths } from '@infrastructure/firebase/paths'
import { MenuMapper } from '@infrastructure/mappers/MenuMapper'
import { CategoryMapper } from '@infrastructure/mappers/CategoryMapper'
import type { Menu } from '@core/domain/entities/Menu'
import type { Category } from '@core/domain/entities/Category'
import type { MenuFormValues, CategoryFormValues } from '../types/menu.types'

export const MenuService = {
  // ── Menus ──────────────────────────────────────────────────────────────────

  async getMenus(tenantId: string): Promise<Menu[]> {
    const snap = await getDocs(
      query(collection(db, firestorePaths.menus(tenantId)), orderBy('createdAt', 'asc')),
    )
    return snap.docs.map((d) => MenuMapper.toDomain(d, tenantId))
  },

  async createMenu(tenantId: string, values: MenuFormValues): Promise<string> {
    const schedulePayload = values.schedule.enabled && values.schedule.daysOfWeek.length > 0
      ? { daysOfWeek: values.schedule.daysOfWeek, startTime: values.schedule.startTime, endTime: values.schedule.endTime }
      : null
    const ref = await addDoc(collection(db, firestorePaths.menus(tenantId)), {
      tenantId,
      name: values.name,
      description: values.description || null,
      status: values.status,
      categoryOrder: [],
      schedule: schedulePayload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return ref.id
  },

  async updateMenu(tenantId: string, menuId: string, values: MenuFormValues): Promise<void> {
    const schedulePayload = values.schedule.enabled && values.schedule.daysOfWeek.length > 0
      ? { daysOfWeek: values.schedule.daysOfWeek, startTime: values.schedule.startTime, endTime: values.schedule.endTime }
      : null
    await updateDoc(doc(db, firestorePaths.menu(tenantId, menuId)), {
      name: values.name,
      description: values.description || null,
      status: values.status,
      schedule: schedulePayload,
      updatedAt: serverTimestamp(),
    })
  },

  async archiveMenu(tenantId: string, menuId: string): Promise<void> {
    await updateDoc(doc(db, firestorePaths.menu(tenantId, menuId)), {
      status: 'archived',
      updatedAt: serverTimestamp(),
    })
  },

  // ── Categories ─────────────────────────────────────────────────────────────

  async getCategories(tenantId: string, menuId: string): Promise<Category[]> {
    const snap = await getDocs(
      query(
        collection(db, firestorePaths.categories(tenantId, menuId)),
        orderBy('sortOrder', 'asc'),
      ),
    )
    return snap.docs.map((d) => CategoryMapper.toDomain(d, tenantId, menuId))
  },

  async createCategory(
    tenantId: string,
    menuId: string,
    values: CategoryFormValues,
    currentCount: number,
  ): Promise<void> {
    await addDoc(collection(db, firestorePaths.categories(tenantId, menuId)), {
      tenantId,
      menuId,
      name: values.name,
      description: values.description || null,
      imageUrl: null,
      sortOrder: currentCount,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  },

  async updateCategory(
    tenantId: string,
    menuId: string,
    categoryId: string,
    values: CategoryFormValues,
  ): Promise<void> {
    await updateDoc(doc(db, firestorePaths.category(tenantId, menuId, categoryId)), {
      name: values.name,
      description: values.description || null,
      updatedAt: serverTimestamp(),
    })
  },

  async deleteCategory(
    tenantId: string,
    menuId: string,
    categoryId: string,
  ): Promise<void> {
    await deleteDoc(doc(db, firestorePaths.category(tenantId, menuId, categoryId)))
  },

  async swapCategoryOrder(
    tenantId: string,
    menuId: string,
    catA: Category,
    catB: Category,
  ): Promise<void> {
    const batch = writeBatch(db)
    batch.update(doc(db, firestorePaths.category(tenantId, menuId, catA.id)), {
      sortOrder: catB.sortOrder,
      updatedAt: serverTimestamp(),
    })
    batch.update(doc(db, firestorePaths.category(tenantId, menuId, catB.id)), {
      sortOrder: catA.sortOrder,
      updatedAt: serverTimestamp(),
    })
    await batch.commit()
  },
}
