import { useRef, useEffect } from 'react'
import { DishCard } from '../DishCard'
import type { DishGridProps } from '../../types/menu.types'

/**
 * Renders all dish groups. When activeCategoryId changes,
 * smoothly scrolls to the matching section.
 */
export function DishGrid({ groups, tenantId, menuId, activeCategoryId }: DishGridProps) {
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map())
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (!activeCategoryId) return

    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    const section = sectionRefs.current.get(activeCategoryId)
    if (!section) return
    section.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [activeCategoryId])

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-surface-400">
        <span className="text-4xl">🍽</span>
        <p className="text-sm font-medium">No hay platos disponibles</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-10 py-6">
      {groups.map(({ category, dishes }) => (
        <section
          key={category.id}
          ref={(el) => {
            if (el) sectionRefs.current.set(category.id, el)
            else sectionRefs.current.delete(category.id)
          }}
          aria-labelledby={`category-${category.id}`}
        >
          {/* Category header */}
          <div className="mb-5 mt-6 flex items-baseline justify-between border-b border-white/[0.04] pb-2">
            <h2
              id={`category-${category.id}`}
              className="text-base font-extrabold text-white tracking-tight"
            >
              {category.name}
            </h2>
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
              {dishes.length} {dishes.length === 1 ? 'plato' : 'platos'}
            </span>
          </div>

          {/* Dish list in grid */}
          <ul className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6" role="list">
            {dishes.map((dish) => (
              <li key={dish.id} className="flex">
                <DishCard
                  dish={dish}
                  tenantId={tenantId}
                  menuId={menuId}
                  isFeatured={category.id === 'destacados'}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
