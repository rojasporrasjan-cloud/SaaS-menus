export const PATHS = {
  tenant: (id: string) => `tenants/${id}`,
  tenantMenus: (tenantId: string) => `tenants/${tenantId}/menus`,
  tenantMenu: (tenantId: string, menuId: string) => `tenants/${tenantId}/menus/${menuId}`,
  tenantDishes: (tenantId: string) => `tenants/${tenantId}/dishes`,
  tenantDish: (tenantId: string, dishId: string) => `tenants/${tenantId}/dishes/${dishId}`,
  tenantCategories: (tenantId: string) => `tenants/${tenantId}/categories`,
  tenantTables: (tenantId: string) => `tenants/${tenantId}/tables`,
  tenantAnalytics: (tenantId: string) => `tenants/${tenantId}/analytics`,
  editor: {
    // `editor` es una colección: `published` es un documento dentro de ella.
    published: (tenantId: string) => `tenants/${tenantId}/editor/published`,
    // Los borradores viven en una subcolección `items` bajo el doc `drafts`,
    // para que la paridad de segmentos sea válida en Firestore:
    //   drafts  → .../editor/drafts/items            (5 segmentos = colección)
    //   draft   → .../editor/drafts/items/{id}        (6 segmentos = documento)
    // Sigue bajo `editor/**`, así que las reglas existentes lo cubren.
    drafts: (tenantId: string) => `tenants/${tenantId}/editor/drafts/items`,
    draft: (tenantId: string, snapshotId: string) =>
      `tenants/${tenantId}/editor/drafts/items/${snapshotId}`,
  },
  storage: {
    dishImage: (tenantId: string, dishId: string) =>
      `tenants/${tenantId}/dishes/${dishId}/image`,
    tenantLogo: (tenantId: string) =>
      `tenants/${tenantId}/branding/logo`,
    tenantCover: (tenantId: string) =>
      `tenants/${tenantId}/branding/cover`,
    arModel: (tenantId: string, dishId: string) =>
      `tenants/${tenantId}/ar-models/${dishId}`,
    canvaTemplate: (tenantId: string, fileName: string) =>
      `tenants/${tenantId}/templates/${fileName}`,
  },
} as const
