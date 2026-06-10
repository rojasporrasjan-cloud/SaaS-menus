import { FirestoreMenuRepository } from '@infrastructure/repositories/FirestoreMenuRepository'
import { FirestoreDishRepository } from '@infrastructure/repositories/FirestoreDishRepository'
import { FirestoreCategoryRepository } from '@infrastructure/repositories/FirestoreCategoryRepository'
import { FirestoreTableRepository } from '@infrastructure/repositories/FirestoreTableRepository'
import {
  MockMenuRepository,
  MockDishRepository,
  MockCategoryRepository,
  MockTableRepository,
} from '@infrastructure/repositories/MockRepositories'
import { isFirebaseConfigured } from '@infrastructure/firebase/config'
import { GetMenuByTableUseCase } from '@core/use-cases/menu/GetMenuByTableUseCase'
import { GetActiveDishesUseCase } from '@core/use-cases/menu/GetActiveDishesUseCase'

/**
 * Composition root for the menu feature.
 * Repositories and use cases are instantiated once (module-level singletons).
 * Swap any repository implementation here without touching hooks or components.
 */
const menuRepository = isFirebaseConfigured
  ? new FirestoreMenuRepository()
  : new MockMenuRepository()
const dishRepository = isFirebaseConfigured
  ? new FirestoreDishRepository()
  : new MockDishRepository()
const categoryRepository = isFirebaseConfigured
  ? new FirestoreCategoryRepository()
  : new MockCategoryRepository()
const tableRepository = isFirebaseConfigured
  ? new FirestoreTableRepository()
  : new MockTableRepository()

export const MenuService = {
  getMenuByTable:  new GetMenuByTableUseCase(tableRepository, menuRepository),
  getActiveDishes: new GetActiveDishesUseCase(dishRepository, categoryRepository),
  dishRepository,
} as const
