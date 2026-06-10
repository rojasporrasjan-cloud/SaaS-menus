import { Check } from 'lucide-react'
import { ONBOARDING_STEPS, STEP_LABELS } from '../../types/onboarding.types'
import type { OnboardingStep } from '../../types/onboarding.types'

interface StepIndicatorProps {
  activeStep: OnboardingStep
}

export function StepIndicator({ activeStep }: StepIndicatorProps) {
  const activeIdx = ONBOARDING_STEPS.indexOf(activeStep)

  return (
    <ol className="flex items-center gap-1.5">
      {ONBOARDING_STEPS.map((step, idx) => {
        const isPast = idx < activeIdx
        const isCurrent = idx === activeIdx
        const isFuture = idx > activeIdx

        return (
          <li key={step} className="flex items-center gap-1.5">
            <div
              className={[
                'flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors',
                isPast    && 'bg-brand-600 text-white',
                isCurrent && 'bg-brand-600 text-white ring-4 ring-brand-100',
                isFuture  && 'bg-surface-100 text-surface-400',
              ].filter(Boolean).join(' ')}
              aria-current={isCurrent ? 'step' : undefined}
            >
              {isPast ? <Check size={13} /> : idx + 1}
            </div>
            <span
              className={[
                'hidden sm:inline text-xs font-medium',
                isCurrent ? 'text-surface-900' : 'text-surface-400',
              ].join(' ')}
            >
              {STEP_LABELS[step]}
            </span>
            {idx < ONBOARDING_STEPS.length - 1 && (
              <span
                className={[
                  'mx-1 h-px w-6 sm:w-10',
                  idx < activeIdx ? 'bg-brand-300' : 'bg-surface-200',
                ].join(' ')}
                aria-hidden
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
