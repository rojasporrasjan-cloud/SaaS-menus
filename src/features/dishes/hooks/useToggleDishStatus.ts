import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { DishService } from '../services/DishService'
import { dishQueryKeys } from '../types/dish.types'
import type { DishStatus } from '@core/domain/entities/Dish'

interface UseToggleDishStatusReturn {
  toggleStatus: (menuId: string, dishId: string, newStatus: DishStatus) => Promise<void>
  togglingId: string | null
}

export function useToggleDishStatus(tenantId: string): UseToggleDishStatusReturn {
  const queryClient = useQueryClient()
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const toggleStatus = async (menuId: string, dishId: string, newStatus: DishStatus) => {
    setTogglingId(dishId)
    try {
      await DishService.toggleDishStatus(tenantId, menuId, dishId, newStatus)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: dishQueryKeys.byMenu(tenantId, menuId) }),
        queryClient.invalidateQueries({ queryKey: dishQueryKeys.all(tenantId) }),
      ])
    } catch {
      // revert optimistic update handled by parent
    }
  }

  return { toggleStatus, togglingId }
}
