import { format } from 'date-fns'
import { useAuth } from '@/auth/AuthContext'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ErrorState, LoadingState } from '@/components/shared/States'
import { useTraineeSummary } from '@/hooks/useProgress'
import { formatPercent } from '@/lib/utils'
import { StatCard } from '@/features/profile/StatCard'
import type { Trainee } from '@/domain/user'

export function ProfilePage() {
  const { user } = useAuth()
  const summaryQuery = useTraineeSummary(user?.id)

  if (!user) return null

  const trainee = user.role === 'TRAINEE' ? (user as Trainee) : null

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-ink">My Profile</h1>

      <Card>
        <CardContent className="flex flex-col gap-5 pt-6 sm:flex-row sm:items-center">
          <Avatar initials={user.avatarInitials} className="h-16 w-16 text-lg" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold text-ink">{user.name}</h2>
              <Badge tone="brand">{user.role === 'TRAINEE' ? 'Trainee' : 'Admin'}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted">{user.email}</p>
            <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
              {trainee && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Cohort</dt>
                  <dd className="mt-0.5 text-ink">{trainee.cohort}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Joined</dt>
                <dd className="mt-0.5 text-ink">{format(new Date(user.joinedAt), 'MMMM d, yyyy')}</dd>
              </div>
            </dl>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Learning Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {summaryQuery.isLoading && <LoadingState label="Loading summary…" />}
          {summaryQuery.error && (
            <ErrorState
              message={summaryQuery.error instanceof Error ? summaryQuery.error.message : 'Failed to load summary'}
              onRetry={() => void summaryQuery.refetch()}
            />
          )}
          {summaryQuery.data && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard label="Course Progress" value={formatPercent(summaryQuery.data.overallCompletionPercent)} />
              <StatCard label="Quiz Average" value={formatPercent(summaryQuery.data.quizAveragePercent)} />
              <StatCard
                label="Assignments"
                value={`${summaryQuery.data.assignmentsCompleted}/${summaryQuery.data.assignmentsTotal}`}
              />
              <StatCard
                label="Exercises"
                value={`${summaryQuery.data.exercisesCompleted}/${summaryQuery.data.exercisesTotal}`}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
