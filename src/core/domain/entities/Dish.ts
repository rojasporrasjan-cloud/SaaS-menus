export type DishStatus = 'available' | 'unavailable' | 'seasonal'

export interface DishAssets {
  imageUrl: string | null
  thumbnailUrl: string | null
  modelGlbUrl: string | null
  modelUsdzUrl: string | null
  hasAR: boolean
}

export interface DishNutrition {
  calories: number | null
  allergens: string[]
  isVegetarian: boolean
  isVegan: boolean
  isGlutenFree: boolean
}

export interface DishPrice {
  amount: number
  currency: string
}

// ── Variants ──────────────────────────────────────────────────────────────────

export interface DishVariantOption {
  readonly id: string
  readonly name: string
  readonly priceDelta: number    // extra cost in same currency as dish; 0 = no extra
  readonly available: boolean
}

export interface DishVariantGroup {
  readonly id: string
  readonly name: string          // e.g. "Tamaño", "Extras", "Personalización"
  readonly required: boolean     // customer must choose one option
  readonly multiSelect: boolean  // customer can choose several options
  readonly options: readonly DishVariantOption[]
}

// ── Dish ──────────────────────────────────────────────────────────────────────

export interface Dish {
  id: string
  tenantId: string
  menuId: string
  categoryId: string
  name: string
  description: string | null
  price: DishPrice
  status: DishStatus
  assets: DishAssets
  nutrition: DishNutrition
  tags: string[]
  variantGroups: DishVariantGroup[]
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}
