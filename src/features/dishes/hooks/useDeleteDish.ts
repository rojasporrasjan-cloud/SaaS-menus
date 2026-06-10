import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { DishService } from '../services/DishService'
import { dishQueryKeys } from '../types/dish.types'

interface UseDeleteDishReturn {
  deleteDish: (menuId: string, dishId: string) => Promise<void>
  isLoading: boolean
  deletingId: string | null
}

export function useDeleteDish(tenantId: string): UseDeleteDishReturn {
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const deleteDish = async (menuId: string, dishId: string) => {
    setIsLoading(true)
    setDeletingId(dishId)
    try {
      await DishService.deleteDish(tenantId, menuId, dishId)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: dishQueryKeys.byMenu(tenantId, menuId) }),
        queryClient.invalidateQueries({ queryKey: dishQueryKeys.all(tenantId) }),
      ])
    } finally {
      setIsLoading(false)
      setDeletingId(null)
    }
  }

  return { deleteDish, isLoading, deletingId }
}
