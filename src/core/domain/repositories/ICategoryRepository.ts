import type { Category } from '../entities/Category'

export interface ICategoryRepository {
  getByMenuId(tenantId: string, menuId: string): Promise<Category[]>
  getById(tenantId: string, menuId: string, categoryId: string): Promise<Category>
}
