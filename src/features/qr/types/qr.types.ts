export interface GenerateQRPayload {
  tenantId: string
  tableId: string
  menuUrl: string
}

export interface GenerateQRResult {
  qrCodeUrl: string
}

export interface TableFormValues {
  number: string
  label: string
  menuId: string
}

export const qrQueryKeys = {
  all: (tenantId: string) => ['qr', tenantId] as const,
  tables: (tenantId: string) => ['qr', tenantId, 'tables'] as const,
}
