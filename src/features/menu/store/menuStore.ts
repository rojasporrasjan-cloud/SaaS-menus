import { create } from 'zustand'

interface MenuUIState {
  activeCategoryId: string | null
  isFilterSticky: boolean

  setActiveCategory: (id: string) => void
  setFilterSticky: (sticky: boolean) => void
  reset: () => void
}

const initialState = {
  activeCategoryId: null,
  isFilterSticky: false,
}

export const useMenuStore = create<MenuUIState>((set) => ({
  ...initialState,

  setActiveCategory: (id) => set({ activeCategoryId: id }),
  setFilterSticky: (sticky) => set({ isFilterSticky: sticky }),
  reset: () => set(initialState),
}))
