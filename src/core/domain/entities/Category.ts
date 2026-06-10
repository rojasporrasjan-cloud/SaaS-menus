export interface Category {
  id: string
  tenantId: string
  menuId: string
  name: string
  description: string | null
  imageUrl: string | null
  sortOrder: number
}
