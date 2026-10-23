import { Link } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { EmptyState, ErrorState, LoadingState } from '@/components/shared/States'
import { SubmissionStatusBadge } from '@/components/shared/StatusBadge'
import { useGithubSubmissionsForTrainee, useAssignmentSubmissionsForTrainee } from '@/hooks/useSubmissions'
import { ROUTES } from '@/routes'

const CONTEXT_LABEL: Record<string, string> = {
  EXERCISE: 'Exercise submission',
  ASSIGNMENT: 'Assignment submission',
  CAPSTONE: 'Capstone submission',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export function MySubmissionsPage() {
  const { user } = useAuth()
  const traineeId = user?.id

  const githubQuery = useGithubSubmissionsForTrainee(traineeId)
  const assignmentQuery = useAssignmentSubmissionsForTrainee(traineeId)

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">My Submissions</h1>
        <p className="mt-1 text-sm text-muted">A history of everything you've submitted for review.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>GitHub Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {githubQuery.isLoading && <LoadingState label="Loading submissions…" />}
          {githubQuery.isError && (
            <ErrorState
              message={githubQuery.error instanceof Error ? githubQuery.error.message : 'Unable to load submissions.'}
              onRetry={() => githubQuery.refetch()}
            />
          )}
          {githubQuery.isSuccess && githubQuery.data.length === 0 && (
            <EmptyState title="No submissions yet" description="Repository submissions you make for exercises and assignments will show up here." />
          )}
          {githubQuery.isSuccess && githubQuery.data.length > 0 && (
            <ul className="divide-y divide-line">
              {githubQuery.data.map((submission) => (
                <li key={submission.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div>
                    <p className="text-sm font-medium text-ink">{CONTEXT_LABEL[submission.contextType] ?? 'Submission'}</p>
                    <p className="text-xs text-muted">Submitted {formatDate(submission.submittedAt)}</p>
                    <a
                      href={submission.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-medium text-brand-600 underline-offset-4 hover:underline"
                    >
                      {submission.repoUrl}
                    </a>
                  </div>
                  <SubmissionStatusBadge status={submission.status} />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assignment Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {assignmentQuery.isLoading && <LoadingState label="Loading submissions…" />}
          {assignmentQuery.isError && (
            <ErrorState
              message={assignmentQuery.error instanceof Error ? assignmentQuery.error.message : 'Unable to load submissions.'}
              onRetry={() => assignmentQuery.refetch()}
            />
          )}
          {assignmentQuery.isSuccess && assignmentQuery.data.length === 0 && (
            <EmptyState title="No submissions yet" description="Assignments you submit will show up here with their review status." />
          )}
          {assignmentQuery.isSuccess && assignmentQuery.data.length > 0 && (
            <ul className="divide-y divide-line">
              {assignmentQuery.data.map((submission) => (
                <li key={submission.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div>
                    <Link
                      to={ROUTES.assignment(submission.assignmentId)}
                      className="text-sm font-medium text-ink hover:text-brand-600"
                    >
                      Assignment submission
                    </Link>
                    <p className="text-xs text-muted">Submitted {formatDate(submission.submittedAt)}</p>
                    {submission.score !== null && (
                      <p className="text-xs text-muted">
                        Score: {submission.score} / {submission.maxScore}
                      </p>
                    )}
                  </div>
                  <SubmissionStatusBadge status={submission.status} />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
