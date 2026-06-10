export const firestorePaths = {
  tenant: (tenantId: string) => `tenants/${tenantId}`,
  member: (tenantId: string, userId: string) => `tenants/${tenantId}/members/${userId}`,
  userAccount: (userId: string) => `users/${userId}`,
  tables: (tenantId: string) => `tenants/${tenantId}/tables`,
  table: (tenantId: string, tableId: string) => `tenants/${tenantId}/tables/${tableId}`,
  menus: (tenantId: string) => `tenants/${tenantId}/menus`,
  menu: (tenantId: string, menuId: string) => `tenants/${tenantId}/menus/${menuId}`,
  dishes: (tenantId: string, menuId: string) => `tenants/${tenantId}/menus/${menuId}/dishes`,
  categories: (tenantId: string, menuId: string) => `tenants/${tenantId}/menus/${menuId}/categories`,
  analyticsEvents: (tenantId: string) => `tenants/${tenantId}/analyticsEvents`,
  analyticsDailySummary: (tenantId: string, date: string) =>
    `tenants/${tenantId}/analyticsDailySummaries/${date}`,
} as const
