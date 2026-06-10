export type TableStatus = 'active' | 'inactive'

export interface Table {
  id: string
  tenantId: string
  menuId: string
  number: string
  label: string | null
  status: TableStatus
  qrCodeUrl: string | null
  qrMenuUrl: string | null
  qrGeneratedAt: Date | null
  createdAt: Date
}
