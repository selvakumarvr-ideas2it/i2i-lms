import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cn } from '@/lib/utils'

export interface ProgressBarProps {
  value: number
  className?: string
  trackClassName?: string
  fillClassName?: string
}

export function ProgressBar({ value, className, trackClassName, fillClassName }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <ProgressPrimitive.Root
      value={clamped}
      className={cn('h-2.5 w-full overflow-hidden rounded-pill bg-slate-100', trackClassName, className)}
    >
      <ProgressPrimitive.Indicator
        className={cn('brand-gradient-accent h-full rounded-pill transition-transform duration-500', fillClassName)}
        style={{ transform: `translateX(-${100 - clamped}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}
