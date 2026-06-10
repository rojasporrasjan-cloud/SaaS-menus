import type { Table } from '../entities/Table'

export interface ITableRepository {
  getById(tenantId: string, tableId: string): Promise<Table>
  getAll(tenantId: string): Promise<Table[]>
}
