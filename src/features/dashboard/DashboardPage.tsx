import { Link } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { buttonVariants } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ErrorState, LoadingState } from '@/components/shared/States'
import { useDaysQuery } from '@/hooks/useCourse'
import { useDerivedProgress, useNextIncompleteDay, useTraineeSummary } from '@/hooks/useProgress'
import { cn, formatPercent } from '@/lib/utils'
import { ROUTES } from '@/routes'
import { DayProgressStrip } from '@/features/dashboard/DayProgressStrip'
import { LearningSnapshotCard } from '@/features/dashboard/LearningSnapshotCard'
import { RecentActivityList } from '@/features/dashboard/RecentActivityList'
import { TodayLearningCard } from '@/features/dashboard/TodayLearningCard'

export function DashboardPage() {
  const { user } = useAuth()
  const traineeId = user?.id

  const summaryQuery = useTraineeSummary(traineeId)
  const nextDayQuery = useNextIncompleteDay(traineeId)
  const daysQuery = useDaysQuery()
  const derivedQuery = useDerivedProgress(traineeId)

  if (!user) return null

  const isLoading = summaryQuery.isLoading || nextDayQuery.isLoading || daysQuery.isLoading || derivedQuery.isLoading
  const firstError = summaryQuery.error ?? nextDayQuery.error ?? daysQuery.error ?? derivedQuery.error

  const refetchAll = () => {
    void summaryQuery.refetch()
    void nextDayQuery.refetch()
    void daysQuery.refetch()
    void derivedQuery.refetch()
  }

  if (isLoading) {
    return <LoadingState label="Loading your dashboard…" />
  }

  if (firstError) {
    return (
      <ErrorState
        message={firstError instanceof Error ? firstError.message : 'Failed to load your dashboard'}
        onRetry={refetchAll}
      />
    )
  }

  const summary = summaryQuery.data
  const days = daysQuery.data ?? []
  const derived = derivedQuery.data ?? []

  if (!summary || days.length === 0) {
    return <ErrorState message="No course data is available right now." onRetry={refetchAll} />
  }

  const derivedByDayId = new Map(derived.map((d) => [d.dayId, d]))
  const continueDay = nextDayQuery.data ?? days[days.length - 1]
  const continueDayProgress = continueDay ? derivedByDayId.get(continueDay.id) : undefined
  const isCourseComplete = continueDayProgress?.overallStatus === 'COMPLETED'

  return (
    <div className="space-y-8">
      <section className="brand-gradient overflow-hidden rounded-card p-8 text-white sm:p-10">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-200">Developer Enablement</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">BI Visualization Accelerator</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
          Welcome, {user.name}. Learn to transform SQL and business requirements into analytical reports through a
          focused 10-day program covering Power Query, semantic modelling, DAX, UX, AI-assisted development and
          legacy migration.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          {continueDay && (
            <Link
              to={ROUTES.learningDay(continueDay.id)}
              className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }), 'bg-white text-ink hover:bg-slate-100')}
            >
              {isCourseComplete ? `Course Complete — Review Day ${continueDay.dayNumber}` : `Continue Day ${continueDay.dayNumber} →`}
            </Link>
          )}
        </div>

        <div className="mt-8 max-w-xl">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>Overall Course Progress</span>
            <span>{formatPercent(summary.overallCompletionPercent)}</span>
          </div>
          <ProgressBar
            value={summary.overallCompletionPercent}
            className="mt-3 bg-white/15"
            trackClassName="bg-white/15"
          />
        </div>
      </section>

      <DayProgressStrip days={days} derivedByDayId={derivedByDayId} currentDayId={continueDay?.id} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
        {continueDay && <TodayLearningCard day={continueDay} progress={continueDayProgress} />}
        <LearningSnapshotCard summary={summary} />
      </div>

      <RecentActivityList traineeId={user.id} days={days} />
    </div>
  )
}
