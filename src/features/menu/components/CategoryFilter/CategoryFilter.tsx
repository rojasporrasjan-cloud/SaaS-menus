import { useRef, useEffect } from 'react'
import { cn } from '@shared/utils/cn'
import type { CategoryFilterProps } from '../../types/menu.types'

export function CategoryFilter({ categories, activeId, onSelect }: CategoryFilterProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLButtonElement>(null)

  // Auto-scroll active tab horizontally into view when it changes
  useEffect(() => {
    const listEl = listRef.current
    const activeEl = activeRef.current
    if (!listEl || !activeEl) return

    const listRect = listEl.getBoundingClientRect()
    const activeRect = activeEl.getBoundingClientRect()

    const activeLeft = activeRect.left - listRect.left + listEl.scrollLeft
    const activeWidth = activeRect.width
    const listWidth = listRect.width

    listEl.scrollTo({
      left: activeLeft - listWidth / 2 + activeWidth / 2,
      behavior: 'smooth',
    })
  }, [activeId])

  if (categories.length === 0) return null

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="Categorías del menú"
      className={cn(
        'flex gap-2 overflow-x-auto px-4 py-3',
        'scrollbar-none scroll-smooth bg-transparent',
      )}
      style={{ scrollbarWidth: 'none' }}
    >
      {categories.map((cat) => {
        const isActive = cat.id === activeId

        return (
          <button
            key={cat.id}
            ref={isActive ? activeRef : undefined}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(cat.id)}
            className={cn(
              'shrink-0 rounded-full px-5 py-2 text-[10px] font-extrabold tracking-wider uppercase',
              'transition-all duration-200 focus-visible:outline-none',
              'focus-visible:ring-2 focus-visible:ring-brand-400',
              'active:scale-95',
              isActive
                ? 'bg-gradient-to-r from-brand-500 to-amber-500 text-neutral-950 shadow-lg shadow-brand-500/20'
                : 'bg-white/[0.03] text-neutral-400 hover:bg-white/[0.07] hover:text-white border border-white/[0.04] shadow-sm',
            )}
          >
            {cat.name}
          </button>
        )
      })}
    </div>
  )
}
