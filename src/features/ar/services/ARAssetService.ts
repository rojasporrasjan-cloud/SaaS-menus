import type { ARAsset } from '../types/ar.types'
import type { Dish } from '@core/domain/entities/Dish'

/**
 * Resolves AR asset URLs for a given dish.
 * Centralizes the logic for determining which model files are available.
 * Future: add Draco/KTX2 variant resolution based on device capabilities.
 */
export class ARAssetService {
  static fromDish(dish: Dish): ARAsset | null {
    const { assets } = dish

    if (!assets.hasAR || !assets.modelGlbUrl) return null

    return {
      glbUrl: assets.modelGlbUrl,
      usdzUrl: assets.modelUsdzUrl,
      posterUrl: assets.imageUrl ?? assets.thumbnailUrl,
      alt: dish.name,
    }
  }

  static hasARSupport(dish: Dish): boolean {
    return dish.assets.hasAR && Boolean(dish.assets.modelGlbUrl)
  }
}
