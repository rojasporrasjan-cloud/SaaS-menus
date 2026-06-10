import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { DishService } from '../services/DishService'
import { dishQueryKeys } from '../types/dish.types'
import type { Dish } from '@core/domain/entities/Dish'

interface UseMoveDishReturn {
  moveUp: (menuId: string, dishId: string, dishes: Dish[]) => Promise<void>
  moveDown: (menuId: string, dishId: string, dishes: Dish[]) => Promise<void>
  movingId: string | null
}

export function useMoveDish(tenantId: string): UseMoveDishReturn {
  const queryClient = useQueryClient()
  const [movingId, setMovingId] = useState<string | null>(null)

  const move = async (
    menuId: string,
    dishId: string,
    dishes: Dish[],
    direction: 'up' | 'down',
  ) => {
    const idx = dishes.findIndex((d) => d.id === dishId)
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1

    if (idx < 0 || swapIdx < 0 || swapIdx >= dishes.length) return
    const dishA = dishes[idx]
    const dishB = dishes[swapIdx]
    if (!dishA || !dishB) return

    setMovingId(dishId)
    try {
      await DishService.swapDishOrder(tenantId, menuId, dishA, dishB)
      await queryClient.invalidateQueries({
        queryKey: dishQueryKeys.byMenu(tenantId, menuId),
      })
    } finally {
      setMovingId(null)
    }
  }

  return {
    moveUp: (menuId, dishId, dishes) => move(menuId, dishId, dishes, 'up'),
    moveDown: (menuId, dishId, dishes) => move(menuId, dishId, dishes, 'down'),
    movingId,
  }
}
