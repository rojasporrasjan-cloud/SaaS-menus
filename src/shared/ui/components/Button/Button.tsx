import { Slot } from '@radix-ui/react-slot'
import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@shared/utils/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive'
type Size    = 'sm' | 'md' | 'lg'

const variantClasses: Record<Variant, string> = {
  primary:
    [
      'text-white font-semibold shadow-sm',
      'bg-[linear-gradient(135deg,#e99a0e_0%,#cc7809_100%)]',
      'hover:bg-[linear-gradient(135deg,#f5b520_0%,#e99a0e_100%)]',
      'active:scale-[0.98]',
      'shadow-[0_1px_3px_rgba(233,154,14,0.4),inset_0_1px_0_rgba(255,255,255,0.15)]',
      'hover:shadow-[0_2px_8px_rgba(233,154,14,0.45)]',
    ].join(' '),
  secondary:
    [
      'font-medium',
      'bg-white text-[#3d3b38]',
      'border border-[#dbd8d2]',
      'hover:border-[#bfbbb4] hover:bg-[#faf9f7]',
      'active:scale-[0.98]',
      'shadow-[0_1px_2px_rgba(0,0,0,0.06)]',
    ].join(' '),
  ghost:
    [
      'font-medium',
      'text-[#57544f] bg-transparent',
      'hover:bg-[#efede9] hover:text-[#17150f]',
      'active:scale-[0.98]',
    ].join(' '),
  destructive:
    [
      'font-semibold text-white',
      'bg-[linear-gradient(135deg,#ef4444_0%,#dc2626_100%)]',
      'hover:bg-[linear-gradient(135deg,#f87171_0%,#ef4444_100%)]',
      'active:scale-[0.98]',
      'shadow-[0_1px_3px_rgba(239,68,68,0.35)]',
    ].join(' '),
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-8  px-3   text-[12px] gap-1.5 rounded-lg',
  md: 'h-9  px-3.5 text-[13px] gap-2   rounded-lg',
  lg: 'h-11 px-5   text-[14px] gap-2   rounded-xl',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  Variant
  size?:     Size
  asChild?:  boolean
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant   = 'primary',
      size      = 'md',
      asChild   = false,
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        ref={ref}
        disabled={disabled ?? isLoading}
        className={cn(
          'inline-flex items-center justify-center',
          'transition-all duration-150 focus-visible:outline-none',
          'focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
        ) : (
          children
        )}
      </Comp>
    )
  },
)

Button.displayName = 'Button'
