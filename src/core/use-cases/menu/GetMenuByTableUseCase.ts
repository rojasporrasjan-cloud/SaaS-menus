import type { ITableRepository } from '@core/domain/repositories/ITableRepository'
import type { IMenuRepository } from '@core/domain/repositories/IMenuRepository'
import type { Menu } from '@core/domain/entities/Menu'
import type { Table } from '@core/domain/entities/Table'

export interface GetMenuByTableResult {
  menu: Menu
  table: Table
}

export class GetMenuByTableUseCase {
  private readonly tableRepository: ITableRepository
  private readonly menuRepository: IMenuRepository

  constructor(tableRepository: ITableRepository, menuRepository: IMenuRepository) {
    this.tableRepository = tableRepository
    this.menuRepository = menuRepository
  }

  async execute(tenantId: string, tableId: string): Promise<GetMenuByTableResult> {
    const table = await this.tableRepository.getById(tenantId, tableId)
    const menu = await this.menuRepository.getById(tenantId, table.menuId)
    return { menu, table }
  }
}
