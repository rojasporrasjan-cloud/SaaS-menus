export type UserRole = 'owner' | 'manager' | 'staff'

export interface User {
  id: string
  tenantId: string
  email: string
  displayName: string | null
  role: UserRole
  avatarUrl: string | null
  createdAt: Date
  lastLoginAt: Date | null
}
