import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { DishService } from '../services/DishService'
import { dishQueryKeys } from '../types/dish.types'
import type { DishFormValues } from '../types/dish.types'

interface UseUpdateDishReturn {
  updateDish: (
    menuId: string,
    dishId: string,
    values: DishFormValues,
    imageUrl: string | null,
  ) => Promise<void>
  isLoading: boolean
  error: string | null
  setError: (error: string | null) => void
}

export function useUpdateDish(tenantId: string): UseUpdateDishReturn {
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateDish = async (
    menuId: string,
    dishId: string,
    values: DishFormValues,
    imageUrl: string | null,
  ) => {
    setIsLoading(true)
    setError(null)
    try {
      await DishService.updateDish(tenantId, menuId, dishId, values, imageUrl)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: dishQueryKeys.byMenu(tenantId, menuId) }),
        queryClient.invalidateQueries({ queryKey: dishQueryKeys.all(tenantId) }),
        queryClient.invalidateQueries({ queryKey: dishQueryKeys.detail(tenantId, menuId, dishId) }),
      ])
    } catch {
      setError('No se pudo actualizar el plato. Intenta de nuevo.')
      throw new Error('update failed')
    }
  }

  return { updateDish, isLoading, error, setError }
}
