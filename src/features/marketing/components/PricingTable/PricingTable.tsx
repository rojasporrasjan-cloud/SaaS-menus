import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { ROUTES } from '@shared/constants/routes'
import { cn } from '@shared/utils/cn'
import { Button } from '@shared/ui/components/Button'
import { PLANS, type PlanContent } from '../../constants/marketing.content'

const colonesFormatter = new Intl.NumberFormat('es-CR', {
  style: 'currency',
  currency: 'CRC',
  maximumFractionDigits: 0,
})

function priceLabel(plan: PlanContent): { amount: string; suffix: string | null } {
  if (plan.priceMonthly === null) return { amount: 'A convenir', suffix: null }
  if (plan.priceMonthly === 0) return { amount: 'Gratis', suffix: null }
  return { amount: colonesFormatter.format(plan.priceMonthly), suffix: '/mes' }
}

function ctaHref(plan: PlanContent): string {
  if (plan.id === 'enterprise') return ROUTES.marketing.quote
  return ROUTES.auth.register
}

export function PricingTable() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {PLANS.map((plan) => {
        const price = priceLabel(plan)
        return (
          <div
            key={plan.id}
            className={cn(
              'flex flex-col gap-5 rounded-2xl border bg-white p-6',
              plan.highlighted
                ? 'border-[#e99a0e] shadow-[0_12px_32px_rgba(233,154,14,0.16)] ring-1 ring-[#e99a0e]'
                : 'border-[#efede9] shadow-[0_1px_4px_rgba(0,0,0,0.05)]',
            )}
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#17150f]">{plan.name}</h3>
                {plan.highlighted && (
                  <span className="rounded-full bg-[linear-gradient(135deg,#e99a0e_0%,#cc7809_100%)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    Popular
                  </span>
                )}
              </div>
              <p className="text-sm text-[#57544f]">{plan.tagline}</p>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold tracking-tight text-[#17150f]">
                {price.amount}
              </span>
              {price.suffix && <span className="text-sm text-[#9a968e]">{price.suffix}</span>}
            </div>

            <ul className="flex flex-1 flex-col gap-2.5">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-[#3d3b38]">
                  <Check size={16} className="mt-0.5 shrink-0 text-[#16a34a]" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              asChild
              size="lg"
              variant={plan.highlighted ? 'primary' : 'secondary'}
              className="w-full"
            >
              <Link to={ctaHref(plan)}>{plan.ctaLabel}</Link>
            </Button>
          </div>
        )
      })}
    </div>
  )
}
