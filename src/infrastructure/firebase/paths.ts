/**
 * Centralized Firestore path builder.
 * Single source of truth for all collection paths.
 * Never use raw string paths outside this file.
 */
export const firestorePaths = {
  // ── Tenant ────────────────────────────────────────────────────────────────
  tenant: (tenantId: string) =>
    `tenants/${tenantId}`,

  tenants: () => 'tenants',

  // ── User accounts (top-level uid → tenantId mapping, written by backend) ────
  userAccount: (userId: string) =>
    `users/${userId}`,

  // ── Quotes (leads del flujo "Cotizar con nosotros") ─────────────────────────
  quotes: () => 'quotes',

  quote: (quoteId: string) =>
    `quotes/${quoteId}`,

  // ── Members ───────────────────────────────────────────────────────────────
  members: (tenantId: string) =>
    `tenants/${tenantId}/members`,

  member: (tenantId: string, userId: string) =>
    `tenants/${tenantId}/members/${userId}`,

  // ── Menus ─────────────────────────────────────────────────────────────────
  menus: (tenantId: string) =>
    `tenants/${tenantId}/menus`,

  menu: (tenantId: string, menuId: string) =>
    `tenants/${tenantId}/menus/${menuId}`,

  // ── Categories ────────────────────────────────────────────────────────────
  categories: (tenantId: string, menuId: string) =>
    `tenants/${tenantId}/menus/${menuId}/categories`,

  category: (tenantId: string, menuId: string, categoryId: string) =>
    `tenants/${tenantId}/menus/${menuId}/categories/${categoryId}`,

  // ── Dishes ────────────────────────────────────────────────────────────────
  dishes: (tenantId: string, menuId: string) =>
    `tenants/${tenantId}/menus/${menuId}/dishes`,

  dish: (tenantId: string, menuId: string, dishId: string) =>
    `tenants/${tenantId}/menus/${menuId}/dishes/${dishId}`,

  // ── Tables ────────────────────────────────────────────────────────────────
  tables: (tenantId: string) =>
    `tenants/${tenantId}/tables`,

  table: (tenantId: string, tableId: string) =>
    `tenants/${tenantId}/tables/${tableId}`,

  // ── Analytics ─────────────────────────────────────────────────────────────
  analyticsEvents: (tenantId: string) =>
    `tenants/${tenantId}/analyticsEvents`,

  analyticsEvent: (tenantId: string, eventId: string) =>
    `tenants/${tenantId}/analyticsEvents/${eventId}`,

  analyticsDailySummaries: (tenantId: string) =>
    `tenants/${tenantId}/analyticsDailySummaries`,

  analyticsDailySummary: (tenantId: string, date: string) =>
    `tenants/${tenantId}/analyticsDailySummaries/${date}`,

  // ── Settings ──────────────────────────────────────────────────────────────
  settings: (tenantId: string) =>
    `tenants/${tenantId}/settings/config`,
} as const
