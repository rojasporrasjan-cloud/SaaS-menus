import { cn } from '@shared/utils/cn'
import type { CSSProperties } from 'react'

interface SkeletonBoxProps {
  className?: string
  style?: CSSProperties
}

function SkeletonBox({ className, style }: SkeletonBoxProps) {
  return (
    <div
      className={cn('animate-pulse rounded-lg bg-surface-200', className)}
      style={style}
    />
  )
}

function DishCardSkeleton() {
  return (
    <div className="flex gap-3 rounded-xl border border-surface-100 bg-surface-0 p-3">
      <div className="flex flex-1 flex-col gap-2">
        <SkeletonBox className="h-4 w-3/4" />
        <SkeletonBox className="h-3 w-full" />
        <SkeletonBox className="h-3 w-1/2" />
        <SkeletonBox className="mt-1 h-5 w-16" />
      </div>
      <SkeletonBox className="h-24 w-24 shrink-0" />
    </div>
  )
}

export function MenuSkeleton() {
  return (
    <div className="flex flex-col">
      {/* Header skeleton */}
      <div className="h-48 animate-pulse bg-surface-200" />
      <div className="flex items-center gap-3 border-b border-surface-100 bg-surface-0 p-4">
        <SkeletonBox className="h-10 w-10 rounded-lg" />
        <div className="flex flex-1 flex-col gap-1.5">
          <SkeletonBox className="h-4 w-32" />
          <SkeletonBox className="h-3 w-16" />
        </div>
      </div>

      {/* Category filter skeleton */}
      <div className="flex gap-2 border-b border-surface-100 bg-surface-0 px-4 py-3">
        {[80, 100, 70, 90].map((w, i) => (
          <SkeletonBox key={i} className="h-8 rounded-full" style={{ width: w }} />
        ))}
      </div>

      {/* Dish list skeleton */}
      <div className="flex flex-col gap-8 px-4 py-4">
        {[1, 2].map((group) => (
          <div key={group} className="flex flex-col gap-3">
            <SkeletonBox className="h-5 w-28" />
            {[1, 2, 3].map((i) => (
              <DishCardSkeleton key={i} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
