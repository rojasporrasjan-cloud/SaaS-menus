import { useState, useCallback } from 'react'

/**
 * Controls the active category filter tab.
 * Initialized with the first category; resets when menu changes.
 */
export function useActiveCategory(defaultId: string | null = null) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(defaultId)

  const select = useCallback((id: string) => {
    setActiveCategoryId(id)
  }, [])

  const reset = useCallback(() => {
    setActiveCategoryId(defaultId)
  }, [defaultId])

  return { activeCategoryId, select, reset }
}
