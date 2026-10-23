import { formatDistanceToNow } from 'date-fns'
import { Link } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { buttonVariants } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { EmptyState, ErrorState, LoadingState } from '@/components/shared/States'
import { useAtRiskTrainees } from '@/hooks/useAdmin'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/routes'

export function AtRiskTraineesPanel() {
  const { data, isLoading, isError, error, refetch } = useAtRiskTrainees()

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>At Risk Trainees</CardTitle>
          <CardDescription>Trainees flagged for low progress, inactivity, or weak quiz scores</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && <LoadingState label="Loading at-risk trainees…" />}
        {isError && (
          <ErrorState message={error instanceof Error ? error.message : 'Unable to load at-risk trainees.'} onRetry={() => refetch()} />
        )}
        {!isLoading && !isError && data && data.length === 0 && (
          <EmptyState title="Cohort is healthy — no at-risk trainees" description="No trainees currently meet the at-risk criteria." />
        )}
        {!isLoading && !isError && data && data.length > 0 && (
          <ul className="divide-y divide-line">
            {data.map((trainee) => (
              <li key={trainee.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <Avatar initials={trainee.avatarInitials} />
                  <div>
                    <p className="text-sm font-semibold text-ink">{trainee.name}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                      <span>{trainee.summary.overallCompletionPercent}% complete</span>
                      <span aria-hidden>•</span>
                      <span>Quiz avg {trainee.summary.quizAveragePercent}%</span>
                      <span aria-hidden>•</span>
                      <span>
                        {trainee.summary.lastActiveAt
                          ? `Active ${formatDistanceToNow(new Date(trainee.summary.lastActiveAt), { addSuffix: true })}`
                          : 'Never active'}
                      </span>
                    </div>
                    {trainee.summary.atRiskReasons.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {trainee.summary.atRiskReasons.map((reason) => (
                          <Badge key={reason} tone="danger" className="gap-1">
                            <AlertTriangle className="h-3 w-3" aria-hidden />
                            {reason}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <Link to={ROUTES.adminTrainee(trainee.id)} className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'shrink-0')}>
                  View Trainee
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
