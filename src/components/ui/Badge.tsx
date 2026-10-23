import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const badgeVariants = cva('inline-flex items-center gap-1 rounded-pill px-2.5 py-1 text-xs font-semibold', {
  variants: {
    tone: {
      neutral: 'bg-slate-100 text-muted',
      brand: 'bg-brand-100 text-brand-700',
      info: 'bg-info-50 text-info-600',
      success: 'bg-success-50 text-success-700',
      warning: 'bg-warning-50 text-warning-600',
      danger: 'bg-danger-50 text-danger-600',
    },
  },
  defaultVariants: { tone: 'neutral' },
})

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />
}
