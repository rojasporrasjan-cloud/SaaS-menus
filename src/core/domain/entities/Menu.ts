export type MenuStatus = 'active' | 'draft' | 'archived'

export interface MenuSchedule {
  daysOfWeek: number[]
  startTime: string
  endTime: string
}

export interface Menu {
  id: string
  tenantId: string
  name: string
  description: string | null
  status: MenuStatus
  categoryOrder: string[]
  schedule: MenuSchedule | null
  createdAt: Date
  updatedAt: Date
}
