import { useMemo } from 'react'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import { SubmissionStatusBadge } from '@/components/shared/StatusBadge'
import { EmptyState, ErrorState, LoadingState } from '@/components/shared/States'
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@/components/ui/Table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { useAllAssignmentSubmissions, useTrainees } from '@/hooks/useAdmin'
import { useAssignmentsQuery } from '@/hooks/useCourse'
import { ROUTES } from '@/routes'
import type { AssignmentSubmission } from '@/domain/assignment'
import { AssignmentEvaluationDialog } from './AssignmentEvaluationDialog'

function truncate(text: string, max = 80) {
  const trimmed = text.trim()
  if (trimmed.length <= max) return trimmed || '—'
  return `${trimmed.slice(0, max).trimEnd()}…`
}

export function EvaluationsPage() {
  const submissionsQuery = useAllAssignmentSubmissions()
  const traineesQuery = useTrainees()
  const assignmentsQuery = useAssignmentsQuery()

  const traineeById = useMemo(() => new Map((traineesQuery.data ?? []).map((t) => [t.id, t])), [traineesQuery.data])
  const dayIdByAssignment = useMemo(
    () => new Map((assignmentsQuery.data ?? []).map((a) => [a.id, a.dayId])),
    [assignmentsQuery.data],
  )

  const queries = [submissionsQuery, traineesQuery, assignmentsQuery]
  const isLoading = queries.some((q) => q.isLoading)
  const failedQuery = queries.find((q) => q.isError)

  function refetchAll() {
    for (const q of queries) q.refetch()
  }

  const rows = submissionsQuery.data ?? []
  const pendingRows = rows.filter((r) => r.status === 'SUBMITTED' || r.status === 'UNDER_REVIEW')
  const evaluatedRows = rows.filter((r) => r.status === 'PASSED' || r.status === 'NEEDS_IMPROVEMENT')

  function renderTable(list: AssignmentSubmission[], emptyTitle: string, emptyDescription: string) {
    if (list.length === 0) return <EmptyState title={emptyTitle} description={emptyDescription} />
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Trainee</TableHeaderCell>
            <TableHeaderCell>Notes</TableHeaderCell>
            <TableHeaderCell>Repo</TableHeaderCell>
            <TableHeaderCell>Submitted</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Score</TableHeaderCell>
            <TableHeaderCell className="text-right">Action</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list.map((submission) => {
            const trainee = traineeById.get(submission.traineeId)
            const dayId = dayIdByAssignment.get(submission.assignmentId)
            return (
              <TableRow key={submission.id}>
                <TableCell>
                  {trainee ? (
                    <Link to={ROUTES.adminTrainee(trainee.id)} className="font-medium text-ink hover:text-brand-600">
                      {trainee.name}
                    </Link>
                  ) : (
                    <span className="text-muted">Unknown trainee</span>
                  )}
                </TableCell>
                <TableCell className="max-w-xs text-muted">{truncate(submission.notes)}</TableCell>
                <TableCell>
                  <a
                    href={submission.githubRepoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-600 underline-offset-4 hover:underline"
                  >
                    Repo
                  </a>
                </TableCell>
                <TableCell className="text-muted">{format(new Date(submission.submittedAt), 'MMM d, yyyy')}</TableCell>
                <TableCell>
                  <SubmissionStatusBadge status={submission.status} />
                </TableCell>
                <TableCell>{submission.score !== null ? `${submission.score}/${submission.maxScore}` : '—'}</TableCell>
                <TableCell className="text-right">
                  <AssignmentEvaluationDialog submission={submission} traineeName={trainee?.name ?? 'Unknown trainee'} dayId={dayId} />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Assignment Evaluations</h1>
        <p className="mt-1 text-sm text-muted">Review and evaluate assignment submissions across the cohort.</p>
      </div>

      {isLoading && <LoadingState label="Loading assignment submissions…" />}
      {!isLoading && failedQuery && (
        <ErrorState
          message={failedQuery.error instanceof Error ? failedQuery.error.message : 'Unable to load assignment submissions.'}
          onRetry={refetchAll}
        />
      )}
      {!isLoading && !failedQuery && (
        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">Pending ({pendingRows.length})</TabsTrigger>
            <TabsTrigger value="evaluated">Evaluated ({evaluatedRows.length})</TabsTrigger>
            <TabsTrigger value="all">All ({rows.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            {renderTable(pendingRows, 'No assignments pending review', 'All caught up — nothing needs review right now.')}
          </TabsContent>
          <TabsContent value="evaluated">
            {renderTable(evaluatedRows, 'No evaluated assignments yet', 'Evaluated submissions will show up here.')}
          </TabsContent>
          <TabsContent value="all">
            {renderTable(rows, 'No assignment submissions yet', 'Submissions will appear once trainees submit assignments.')}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
