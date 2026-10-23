import { cn } from '@/lib/utils'

export function Avatar({ initials, className }: { initials: string; className?: string }) {
  return (
    <div
      className={cn(
        'brand-gradient-accent flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white',
        className,
      )}
      aria-hidden
    >
      {initials}
    </div>
  )
}
