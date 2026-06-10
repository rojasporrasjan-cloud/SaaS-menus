import type { Dish } from '../entities/Dish'

export interface IDishRepository {
  getByMenuId(tenantId: string, menuId: string): Promise<Dish[]>
  getById(tenantId: string, menuId: string, dishId: string): Promise<Dish>
  getByCategoryId(tenantId: string, menuId: string, categoryId: string): Promise<Dish[]>
}
