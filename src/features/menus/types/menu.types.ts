import { z } from 'zod'

// ── Query keys ────────────────────────────────────────────────────────────────

export const menuQueryKeys = {
  all: (tenantId: string) => ['admin-menus', tenantId] as const,
  categories: (tenantId: string, menuId: string) =>
    ['admin-categories', tenantId, menuId] as const,
}

// ── Schedule types ────────────────────────────────────────────────────────────

export interface MenuScheduleValues {
  enabled: boolean
  daysOfWeek: number[]    // 0=Sun … 6=Sat
  startTime: string       // "HH:MM"
  endTime: string         // "HH:MM"
}

export const defaultScheduleValues: MenuScheduleValues = {
  enabled: false,
  daysOfWeek: [],
  startTime: '08:00',
  endTime: '22:00',
}

// ── Zod schemas ───────────────────────────────────────────────────────────────

export const menuFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(80),
  description: z.string().max(300).optional(),
  status: z.enum(['active', 'draft', 'archived']),
})

export const categoryFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(60),
  description: z.string().max(200).optional(),
})

export type MenuFormSchemaValues = z.infer<typeof menuFormSchema>
export type CategoryFormValues = z.infer<typeof categoryFormSchema>

export interface MenuFormValues extends MenuFormSchemaValues {
  schedule: MenuScheduleValues
}

export const defaultMenuFormValues: MenuFormValues = {
  name: '',
  description: '',
  status: 'active',
  schedule: defaultScheduleValues,
}

export const defaultCategoryFormValues: CategoryFormValues = {
  name: '',
  description: '',
}
