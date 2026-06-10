import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { MenuService } from '../services/MenuService'
import { menuQueryKeys } from '../types/menu.types'
import type { Category } from '@core/domain/entities/Category'

interface UseMoveCategoryReturn {
  moveUp: (menuId: string, categoryId: string, categories: Category[]) => Promise<void>
  moveDown: (menuId: string, categoryId: string, categories: Category[]) => Promise<void>
  movingId: string | null
}

export function useMoveCategory(tenantId: string): UseMoveCategoryReturn {
  const queryClient = useQueryClient()
  const [movingId, setMovingId] = useState<string | null>(null)

  const move = async (
    menuId: string,
    categoryId: string,
    categories: Category[],
    direction: 'up' | 'down',
  ) => {
    const idx = categories.findIndex((c) => c.id === categoryId)
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1

    if (idx < 0 || swapIdx < 0 || swapIdx >= categories.length) return
    const catA = categories[idx]
    const catB = categories[swapIdx]
    if (!catA || !catB) return

    setMovingId(categoryId)
    try {
      await MenuService.swapCategoryOrder(tenantId, menuId, catA, catB)
      await queryClient.invalidateQueries({
        queryKey: menuQueryKeys.categories(tenantId, menuId),
      })
    } finally {
      setMovingId(null)
    }
  }

  return {
    moveUp: (menuId, categoryId, categories) => move(menuId, categoryId, categories, 'up'),
    moveDown: (menuId, categoryId, categories) => move(menuId, categoryId, categories, 'down'),
    movingId,
  }
}
