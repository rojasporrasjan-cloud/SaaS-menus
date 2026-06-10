import type { Menu } from '../entities/Menu'

export interface IMenuRepository {
  getActiveByTenantId(tenantId: string): Promise<Menu[]>
  getById(tenantId: string, menuId: string): Promise<Menu>
}
