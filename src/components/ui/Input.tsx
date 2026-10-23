import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        'focus-ring h-10 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50',
        className,
      )}
      {...props}
    />
  )
})

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(
          'focus-ring min-h-24 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50',
          className,
        )}
        {...props}
      />
    )
  },
)

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn('mb-1.5 block text-sm font-medium text-ink', className)} {...props} />
}

export function FieldError({ children }: { children?: string }) {
  if (!children) return null
  return <p className="mt-1.5 text-xs font-medium text-danger-600">{children}</p>
}

export function HelpText({ children }: { children?: React.ReactNode }) {
  if (!children) return null
  return <p className="mt-1.5 text-xs text-muted">{children}</p>
}
