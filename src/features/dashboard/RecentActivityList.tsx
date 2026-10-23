import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { EmptyState, ErrorState, LoadingState } from '@/components/shared/States'
import { getActivityForTrainee } from '@/services/activityService'
import type { ActivityEvent } from '@/domain/activity'
import type { LearningDay } from '@/domain/course'

function describeEvent(event: ActivityEvent, days: LearningDay[]): string {
  const day = event.dayId ? days.find((d) => d.id === event.dayId) : undefined
  const dayLabel = day ? `Day ${day.dayNumber}` : 'Course'

  switch (event.type) {
    case 'LOGIN':
      return 'Logged in to the platform'
    case 'STUDY_STARTED':
      return `${dayLabel} study material started`
    case 'STUDY_COMPLETED':
      return `${dayLabel} study material completed`
    case 'EXERCISE_STARTED':
      return `${dayLabel} exercise started`
    case 'EXERCISE_COMPLETED':
      return `${dayLabel} exercise completed`
    case 'QUIZ_STARTED':
      return `${dayLabel} quiz started`
    case 'QUIZ_COMPLETED': {
      const score = event.metadata?.scorePercent
      return typeof score === 'number' ? `${dayLabel} quiz completed — Score ${Math.round(score)}%` : `${dayLabel} quiz completed`
    }
    case 'ASSIGNMENT_SUBMITTED':
      return `${dayLabel} assignment submitted`
    case 'GITHUB_SUBMITTED':
      return `${dayLabel} GitHub repository submitted`
    case 'EVALUATION_COMPLETED': {
      const status = event.metadata?.status
      return typeof status === 'string'
        ? `${dayLabel} evaluation completed — ${status.replace(/_/g, ' ').toLowerCase()}`
        : `${dayLabel} evaluation completed`
    }
    case 'COURSE_COMPLETED':
      return 'Course completed'
    default:
      return 'Activity recorded'
  }
}

export function RecentActivityList({ traineeId, days }: { traineeId: string; days: LearningDay[] }) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['activity', traineeId],
    queryFn: () => getActivityForTrainee(traineeId, 8),
  })

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest learning activity</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && <LoadingState label="Loading activity…" />}
        {error && (
          <ErrorState
            message={error instanceof Error ? error.message : 'Failed to load activity'}
            onRetry={() => refetch()}
          />
        )}
        {!isLoading && !error && (!data || data.length === 0) && (
          <EmptyState title="No activity yet" description="Your learning activity will show up here as you progress." />
        )}
        {!isLoading && !error && data && data.length > 0 && (
          <div className="divide-y divide-line">
            {data.map((event) => (
              <div key={event.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span className="h-2 w-2 shrink-0 rounded-full bg-brand-500" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{describeEvent(event, days)}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
