export const LIMITS = {
  editor: {
    maxSnapshots: 50,
    autosaveDebounceMs: 1500,
    maxBlocksPerDocument: 30,
    maxImageSizeMb: 5,
  },
  menu: {
    maxDishesPerCategory: 100,
    maxCategoriesPerMenu: 20,
    maxMenusPerTenant: 10,
  },
  search: {
    minQueryLength: 2,
    debounceMs: 300,
  },
  upload: {
    maxFileSizeBytes: 5 * 1024 * 1024,
    acceptedImageTypes: ['image/jpeg', 'image/png', 'image/webp'] as const,
  },
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },
} as const
