import { Link } from 'react-router-dom'
import { Cuboid } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { Badge } from '@shared/ui/components/Badge'
import { formatCurrency } from '@shared/utils/formatCurrency'
import type { DishCardProps } from '../../types/menu.types'

const FALLBACK_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f3f3f3"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23ccc" font-size="48"%3E🍽%3C/text%3E%3C/svg%3E'

export function DishCard({ dish, tenantId, menuId, isFeatured = false }: DishCardProps) {
  const { assets, nutrition } = dish
  const detailPath = `/${tenantId}/menu/${menuId}/dish/${dish.id}`
  const hasImage = isFeatured && Boolean(assets.thumbnailUrl || assets.imageUrl)

  return (
    <Link
      to={detailPath}
      className={cn(
        'group flex flex-col w-full rounded-2xl bg-[#141416]/70 backdrop-blur-md border border-white/[0.06]',
        'hover:bg-[#1A1A1D]/80 hover:border-brand-500/30 hover:shadow-[0_12px_24px_rgba(233,154,14,0.08)]',
        'active:scale-[0.98] transition-all duration-300',
        dish.status === 'unavailable' && 'opacity-50 pointer-events-none',
      )}
      aria-label={`Ver ${dish.name}`}
    >
      {/* Thumbnail (On Top) */}
      {hasImage ? (
        <div className="relative w-full aspect-[16/10] shrink-0 overflow-hidden bg-neutral-950/40">
          <img
            src={assets.thumbnailUrl ?? assets.imageUrl ?? FALLBACK_IMAGE}
            alt={dish.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE
            }}
          />

          {/* Premium Floating AR Badge */}
          {assets.hasAR && (
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 bg-neutral-950/75 backdrop-blur-md text-brand-400 rounded-full px-2.5 py-1 border border-brand-500/25 shadow-md shadow-brand-500/5 scale-90 group-hover:scale-95 transition-transform duration-300">
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-500"></span>
              </span>
              <Cuboid size={9} className="stroke-[2.5]" />
              <span className="text-[8px] font-black uppercase tracking-wider">3D AR</span>
            </div>
          )}

          {dish.status === 'unavailable' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
              <span className="text-[11px] font-black uppercase tracking-widest text-white">No disponible</span>
            </div>
          )}
        </div>
      ) : (
        /* Minimalist decorative gradient line for text-only dishes */
        <div className="h-1.5 w-full bg-gradient-to-r from-brand-500/40 via-brand-500/10 to-transparent shrink-0 rounded-t-2xl" />
      )}

      {/* Info (Below) */}
      <div className="flex flex-1 flex-col p-4.5 gap-1.5 justify-between">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-extrabold text-neutral-100 tracking-tight leading-snug line-clamp-1 group-hover:text-brand-400 transition-colors duration-200">
              {dish.name}
            </h3>
            {/* Show AR Badge inside info section if there is no image */}
            {!hasImage && assets.hasAR && (
              <span
                title="Vista en 3D / Realidad Aumentada disponible"
                className="shrink-0 flex items-center gap-1.5 rounded-full bg-brand-950/30 text-brand-400 border border-brand-500/20 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider"
              >
                <span className="relative flex h-1 w-1 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1 w-1 bg-brand-500"></span>
                </span>
                <Cuboid size={8} className="stroke-[2.5]" />
                3D
              </span>
            )}
          </div>

          {dish.description && (
            <p className="text-[11px] leading-relaxed text-neutral-400 line-clamp-2 h-8.5">
              {dish.description}
            </p>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between pt-2 border-t border-white/[0.06]">
          <span className="text-[13px] font-black text-brand-400">
            {formatCurrency(dish.price.amount, dish.price.currency)}
          </span>

          <div className="flex gap-1.5">
            {nutrition.isVegetarian && (
              <Badge variant="success" className="text-[8px] px-1.5 py-0.5 bg-emerald-950/30 text-emerald-400 border border-emerald-500/20 rounded-md font-bold">VEG</Badge>
            )}
            {nutrition.isGlutenFree && (
              <Badge variant="default" className="text-[8px] px-1.5 py-0.5 bg-white/[0.04] text-neutral-300 border border-white/10 rounded-md font-bold">SIN TACC</Badge>
            )}
            {dish.status === 'seasonal' && (
              <Badge variant="warning" className="text-[8px] px-1.5 py-0.5 bg-amber-950/30 text-amber-400 border border-amber-500/20 rounded-md font-bold">TEMPO</Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
