import { ArrowRight, CheckCircle2, Circle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { Card, CardContent } from '@/components/ui/Card'
import { OverallStatusBadge } from '@/components/shared/StatusBadge'
import { ErrorState, LoadingState } from '@/components/shared/States'
import { useDaysQuery } from '@/hooks/useCourse'
import { useDerivedProgress } from '@/hooks/useProgress'
import { cn, formatScheduledDate } from '@/lib/utils'
import { ROUTES } from '@/routes'
import type { LearningDay } from '@/domain/course'
import type { OverallStatus } from '@/domain/progress'

function StatusMarker({ status }: { status: OverallStatus }) {
  if (status === 'COMPLETED') return <CheckCircle2 className="h-5 w-5 shrink-0 text-success-600" aria-hidden />
  if (status === 'IN_PROGRESS') return <ArrowRight className="h-5 w-5 shrink-0 text-brand-600" aria-hidden />
  return <Circle className="h-5 w-5 shrink-0 text-slate-300" aria-hidden />
}

export function LearningPathPage() {
  const { user } = useAuth()
  const daysQuery = useDaysQuery()
  const derivedQuery = useDerivedProgress(user?.id)

  if (!user) return null

  if (daysQuery.isLoading || derivedQuery.isLoading) {
    return <LoadingState label="Loading the learning path…" />
  }

  const error = daysQuery.error ?? derivedQuery.error
  if (error) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : 'Failed to load the learning path'}
        onRetry={() => {
          void daysQuery.refetch()
          void derivedQuery.refetch()
        }}
      />
    )
  }

  const days = daysQuery.data ?? []
  const derived = derivedQuery.data ?? []
  const derivedByDayId = new Map(derived.map((d) => [d.dayId, d]))

  const weeks = new Map<number, LearningDay[]>()
  for (const day of days) {
    const list = weeks.get(day.weekNumber) ?? []
    list.push(day)
    weeks.set(day.weekNumber, list)
  }
  const sortedWeeks = [...weeks.entries()].sort(([a], [b]) => a - b)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink">Learning Path</h1>
        <p className="mt-1 text-sm text-muted">10-day BI Visualization Accelerator</p>
      </div>

      {sortedWeeks.map(([weekNumber, weekDays]) => (
        <section key={weekNumber}>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted">Week {weekNumber}</p>
          <div className="space-y-3">
            {weekDays
              .slice()
              .sort((a, b) => a.dayNumber - b.dayNumber)
              .map((day) => {
                const status = derivedByDayId.get(day.id)?.overallStatus ?? 'NOT_STARTED'
                return (
                  <Link key={day.id} to={ROUTES.learningDay(day.id)} className="block">
                    <Card
                      className={cn(
                        'transition-colors hover:border-brand-300',
                        status === 'IN_PROGRESS' && 'border-brand-400',
                        status === 'NOT_STARTED' && 'opacity-80',
                      )}
                    >
                      <CardContent className="flex items-center gap-4">
                        <StatusMarker status={status} />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                            Day {day.dayNumber}
                            {day.scheduledDate && <span className="normal-case text-muted"> · {formatScheduledDate(day.scheduledDate)}</span>}
                          </p>
                          <h3 className="mt-0.5 text-base font-semibold text-ink">{day.title}</h3>
                          <p className="mt-0.5 truncate text-sm text-muted">{day.description}</p>
                        </div>
                        <OverallStatusBadge status={status} />
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
          </div>
        </section>
      ))}
    </div>
  )
}
