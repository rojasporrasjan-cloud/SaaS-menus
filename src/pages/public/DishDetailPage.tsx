import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Leaf, Wheat, Pencil } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { useDish } from '@features/menu'
import { ARButton, ARAssetService } from '@features/ar'
import { useTenantContext } from '@app/providers/TenantProvider'
import { useAuth } from '@features/auth'
import { formatCurrency } from '@shared/utils/formatCurrency'
import { Badge } from '@shared/ui/components/Badge'
import { Button } from '@shared/ui/components/Button'
import { Spinner } from '@shared/ui/components/Spinner'
import { ROUTES } from '@shared/constants/routes'

const FALLBACK_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f3f3f3"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23ccc" font-size="64"%3E🍽%3C/text%3E%3C/svg%3E'

export default function DishDetailPage() {
  const { tenantId, menuId, dishId } = useParams<{
    tenantId: string
    menuId: string
    dishId: string
  }>()

  const { tenant } = useTenantContext()
  const { user } = useAuth()
  const backPath = `/${tenantId}/menu`
  const editPath = ROUTES.admin.dishes.editor.replace(':dishId', dishId ?? '') + `?menuId=${menuId ?? ''}`

  const { data: dish, isLoading, isError } = useDish(tenantId, menuId, dishId)

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (isError || !dish) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="text-5xl">😕</span>
        <p className="text-sm text-surface-500">Plato no encontrado</p>
        <Button asChild variant="secondary" size="sm">
          <Link to={backPath}>Volver al menú</Link>
        </Button>
      </div>
    )
  }

  const { assets, nutrition, price } = dish
  const arAsset = ARAssetService.fromDish(dish)
  const isAREnabled = tenant?.features.arEnabled ?? false

  const isFeatured = dish.categoryId === 'destacados'

  return (
    <div className="flex min-h-svh flex-col bg-[#0B0B0C] text-neutral-100 pb-12 relative overflow-y-auto">
      {/* Admin edit FAB — only visible for authenticated users */}
      {user && (
        <Link
          to={editPath}
          aria-label="Editar plato"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-brand-500/30 transition-all hover:bg-brand-400 hover:scale-105 active:scale-95"
        >
          <Pencil size={13} />
          Editar plato
        </Link>
      )}
      {isFeatured ? (
        <>
          {/* Hero image for featured dishes */}
          <div className="relative h-72 w-full overflow-hidden bg-neutral-950 sm:h-96">
            <img
              src={assets.imageUrl ?? FALLBACK_IMAGE}
              alt={dish.name}
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover opacity-80"
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE
              }}
            />
            <Link
              to={backPath}
              aria-label="Volver al menú"
              className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md border border-white/10 hover:bg-black/80 transition-colors duration-200"
            >
              <ArrowLeft size={18} className="stroke-[2.5]" />
            </Link>
          </div>

          {/* Content card for featured dishes */}
          <div className="flex flex-1 flex-col gap-6 rounded-t-[2.5rem] bg-gradient-to-b from-[#141416] to-[#0C0C0E] border-t border-white/[0.08] -mt-8 px-6 pt-8 pb-12 shadow-2xl relative z-10">
            {/* Ambient glow behind card contents */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[300px] h-[100px] bg-brand-500/10 blur-[60px] pointer-events-none rounded-full" />

            {/* Header */}
            <div className="flex items-start justify-between gap-4 relative z-10">
              <div className="flex-1 min-w-0">
                <span className="text-[9px] uppercase font-black tracking-widest text-brand-400 bg-brand-500/5 px-2 py-0.5 rounded border border-brand-500/10 inline-block mb-1.5">Plato Destacado</span>
                <h1 className="text-2xl font-black text-white leading-tight tracking-tight mt-0.5">
                  {dish.name}
                </h1>
                {dish.status === 'seasonal' && (
                  <Badge variant="warning" className="mt-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-bold px-2 py-0.5 rounded-md">Estacional</Badge>
                )}
              </div>
              <span className="text-xl font-black text-brand-400 bg-brand-500/10 px-3.5 py-1.5 rounded-xl border border-brand-500/20 shadow-md shadow-brand-500/5 shrink-0">
                {formatCurrency(price.amount, price.currency)}
              </span>
            </div>

            {/* Description */}
            {dish.description && (
              <p className="text-sm leading-relaxed text-neutral-300 font-medium relative z-10">
                {dish.description}
              </p>
            )}

            {/* Dietary info */}
            {(nutrition.isVegetarian || nutrition.isVegan || nutrition.isGlutenFree) && (
              <div className="flex flex-wrap gap-2 relative z-10">
                {nutrition.isVegan && (
                  <DietaryBadge icon={<Leaf size={12} />} label="Vegano" color="green" />
                )}
                {nutrition.isVegetarian && !nutrition.isVegan && (
                  <DietaryBadge icon={<Leaf size={12} />} label="Vegetariano" color="green" />
                )}
                {nutrition.isGlutenFree && (
                  <DietaryBadge icon={<Wheat size={12} />} label="Sin gluten" color="amber" />
                )}
              </div>
            )}

            {/* Nutrition Info Grid */}
            {(nutrition.calories !== null || nutrition.allergens.length > 0) && (
              <div className="grid grid-cols-2 gap-3 relative z-10">
                {nutrition.calories !== null && (
                  <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-3.5 flex flex-col gap-1">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-neutral-500">Calorías</span>
                    <span className="text-sm font-extrabold text-white">{nutrition.calories} kcal</span>
                  </div>
                )}
                <div className={cn(
                  "rounded-2xl p-3.5 flex flex-col gap-1 border",
                  nutrition.allergens.length > 0
                    ? "bg-amber-500/[0.02] border-amber-500/15"
                    : "bg-white/[0.02] border border-white/[0.05]"
                )}>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-neutral-500">Alérgenos</span>
                  <span className={cn(
                    "text-xs font-extrabold truncate",
                    nutrition.allergens.length > 0 ? "text-amber-400" : "text-green-400"
                  )}>
                    {nutrition.allergens.length > 0 ? nutrition.allergens.join(', ') : 'Libre de alérgenos'}
                  </span>
                </div>
              </div>
            )}

            {/* Tags */}
            {dish.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 relative z-10">
                {dish.tags.map((tag) => (
                  <Badge key={tag} variant="default" className="text-[10px] bg-white/5 text-neutral-300 border border-white/10 rounded-md py-0.5 px-2 font-semibold">{tag}</Badge>
                ))}
              </div>
            )}

            {/* AR Button — lazy-loaded, feature-flagged */}
            <div className="mt-auto pt-4 relative z-10">
              <ARButton asset={arAsset} isFeatureEnabled={isAREnabled} />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Back Header for standard dishes */}
          <div className="w-full max-w-lg mx-auto px-6 pt-6 pb-2 relative z-20">
            <Link
              to={backPath}
              aria-label="Volver al menú"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.03] border border-white/[0.08] text-neutral-300 hover:text-white hover:bg-white/[0.06] transition-all duration-200 shadow-sm"
            >
              <ArrowLeft size={18} className="stroke-[2.5]" />
            </Link>
          </div>

          {/* Simple Clean Full-Bleed Layout for standard dishes */}
          <div className="flex-1 w-full max-w-lg mx-auto px-6 flex flex-col gap-6 justify-start relative z-10 mt-6 pb-12">
            {/* Ambient glow behind contents */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[280px] h-[280px] rounded-full bg-brand-500/[0.04] blur-[80px] pointer-events-none select-none" />

            {/* Category subtitle */}
            <div className="relative z-20">
              <span className="text-[9px] uppercase font-black tracking-widest text-brand-400 bg-brand-500/5 px-2 py-0.5 rounded border border-brand-500/10 inline-block mb-1.5">Especificaciones</span>
              <h1 className="text-3xl font-black text-white leading-tight tracking-tight mt-0.5">
                {dish.name}
              </h1>
              {dish.status === 'seasonal' && (
                <Badge variant="warning" className="mt-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-bold px-2 py-0.5 rounded-md">Estacional</Badge>
              )}
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-white/[0.06] relative z-20" />

            {/* Price block */}
            <div className="flex items-center justify-between bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4.5 relative z-20">
              <span className="text-xs font-semibold text-neutral-400">Precio individual</span>
              <span className="text-xl font-black text-brand-400 bg-brand-500/10 px-3.5 py-1.5 rounded-xl border border-brand-500/20 shadow-md shadow-brand-500/5">
                {formatCurrency(price.amount, price.currency)}
              </span>
            </div>

            {/* Description */}
            {dish.description && (
              <p className="text-sm leading-relaxed text-neutral-300 font-medium relative z-20">
                {dish.description}
              </p>
            )}

            {/* Dietary info */}
            {(nutrition.isVegetarian || nutrition.isVegan || nutrition.isGlutenFree) && (
              <div className="flex flex-wrap gap-2 relative z-20">
                {nutrition.isVegan && (
                  <DietaryBadge icon={<Leaf size={12} />} label="Vegano" color="green" />
                )}
                {nutrition.isVegetarian && !nutrition.isVegan && (
                  <DietaryBadge icon={<Leaf size={12} />} label="Vegetariano" color="green" />
                )}
                {nutrition.isGlutenFree && (
                  <DietaryBadge icon={<Wheat size={12} />} label="Sin gluten" color="amber" />
                )}
              </div>
            )}

            {/* Nutrition Info Grid */}
            {(nutrition.calories !== null || nutrition.allergens.length > 0) && (
              <div className="grid grid-cols-2 gap-3 relative z-20">
                {nutrition.calories !== null && (
                  <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-3 flex flex-col gap-1">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-neutral-500">Calorías</span>
                    <span className="text-sm font-extrabold text-white">{nutrition.calories} kcal</span>
                  </div>
                )}
                <div className={cn(
                  "rounded-2xl p-3 flex flex-col gap-1 border",
                  nutrition.allergens.length > 0
                    ? "bg-amber-500/[0.02] border-amber-500/15"
                    : "bg-white/[0.02] border border-white/[0.05]"
                )}>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-neutral-500">Alérgenos</span>
                  <span className={cn(
                    "text-xs font-extrabold truncate",
                    nutrition.allergens.length > 0 ? "text-amber-400" : "text-green-400"
                  )}>
                    {nutrition.allergens.length > 0 ? nutrition.allergens.join(', ') : 'Libre de alérgenos'}
                  </span>
                </div>
              </div>
            )}

            {/* Variants */}
            {dish.variantGroups && dish.variantGroups.length > 0 && (
              <div className="flex flex-col gap-3 relative z-20">
                {dish.variantGroups.map((group) => (
                  <div key={group.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                        {group.name}
                      </span>
                      {group.required && (
                        <span className="rounded-full bg-brand-500/15 px-2 py-0.5 text-[9px] font-bold text-brand-400">
                          Requerido
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {group.options.filter((o) => o.available).map((opt) => (
                        <div
                          key={opt.id}
                          className="flex items-center justify-between rounded-xl bg-white/[0.03] border border-white/[0.04] px-3 py-2"
                        >
                          <span className="text-sm text-neutral-200">{opt.name}</span>
                          <span className={cn(
                            'text-xs font-bold',
                            opt.priceDelta === 0 ? 'text-neutral-500' : 'text-brand-400'
                          )}>
                            {opt.priceDelta === 0 ? 'Incluido' : `+${formatCurrency(opt.priceDelta, price.currency)}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tags */}
            {dish.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 relative z-20">
                {dish.tags.map((tag) => (
                  <Badge key={tag} variant="default" className="text-[10px] bg-white/5 text-neutral-300 border border-white/10 rounded-md py-0.5 px-2 font-semibold">{tag}</Badge>
                ))}
              </div>
            )}

            {/* AR Button */}
            <div className="mt-auto pt-4 relative z-20">
              <ARButton asset={arAsset} isFeatureEnabled={isAREnabled} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

interface DietaryBadgeProps {
  icon: React.ReactNode
  label: string
  color: 'green' | 'amber'
}

function DietaryBadge({ icon, label, color }: DietaryBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold border',
      color === 'green'
        ? 'bg-green-500/10 text-green-400 border-green-500/20'
        : 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    )}>
      {icon}
      {label}
    </span>
  )
}
