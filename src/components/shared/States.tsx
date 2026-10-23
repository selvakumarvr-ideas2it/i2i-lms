import { AlertTriangle, Inbox, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted">
      <Loader2 className="h-6 w-6 animate-spin text-brand-500" aria-hidden />
      <p className="text-sm">{label}</p>
    </div>
  )
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-card border border-dashed border-line bg-white py-16 text-center">
      <Inbox className="h-8 w-8 text-slate-300" aria-hidden />
      <div>
        <p className="text-sm font-semibold text-ink">{title}</p>
        {description && <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-card border border-danger-500/30 bg-danger-50 py-16 text-center">
      <AlertTriangle className="h-8 w-8 text-danger-500" aria-hidden />
      <div>
        <p className="text-sm font-semibold text-danger-700">Something went wrong</p>
        <p className="mt-1 max-w-sm text-sm text-danger-600">{message}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
