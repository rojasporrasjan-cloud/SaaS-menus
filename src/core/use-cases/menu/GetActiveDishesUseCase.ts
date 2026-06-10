import type { IDishRepository } from '@core/domain/repositories/IDishRepository'
import type { ICategoryRepository } from '@core/domain/repositories/ICategoryRepository'
import type { Dish } from '@core/domain/entities/Dish'
import type { Category } from '@core/domain/entities/Category'

export interface DishesGroupedByCategory {
  category: Category
  dishes: Dish[]
}

export class GetActiveDishesUseCase {
  private readonly dishRepository: IDishRepository
  private readonly categoryRepository: ICategoryRepository

  constructor(dishRepository: IDishRepository, categoryRepository: ICategoryRepository) {
    this.dishRepository = dishRepository
    this.categoryRepository = categoryRepository
  }

  async execute(
    tenantId: string,
    menuId: string,
    categoryOrder: string[],
  ): Promise<DishesGroupedByCategory[]> {
    const [dishes, categories] = await Promise.all([
      this.dishRepository.getByMenuId(tenantId, menuId),
      this.categoryRepository.getByMenuId(tenantId, menuId),
    ])

    const categoryMap = new Map(categories.map((c) => [c.id, c]))
    const dishesByCategory = new Map<string, Dish[]>()

    for (const dish of dishes) {
      const existing = dishesByCategory.get(dish.categoryId) ?? []
      existing.push(dish)
      dishesByCategory.set(dish.categoryId, existing)
    }

    const orderedIds =
      categoryOrder.length > 0 ? categoryOrder : categories.map((c) => c.id)

    return orderedIds
      .filter((id) => dishesByCategory.has(id) && categoryMap.has(id))
      .flatMap((id) => {
        const category = categoryMap.get(id)
        const dishes = dishesByCategory.get(id)
        if (!category || !dishes) return []
        return [{ category, dishes }]
      })
  }
}
