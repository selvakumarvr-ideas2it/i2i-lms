import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@/components/ui/Table'
import { SubmissionStatusBadge } from '@/components/shared/StatusBadge'
import { EmptyState, ErrorState, LoadingState } from '@/components/shared/States'
import { useAllGithubSubmissions, useTrainees } from '@/hooks/useAdmin'
import { useAssignmentsQuery, useDaysQuery, useExercisesQuery } from '@/hooks/useCourse'
import { ROUTES } from '@/routes'
import type { GithubSubmission, SubmissionContextType, SubmissionStatus } from '@/domain/submission'
import { GithubReviewDialog } from './GithubReviewDialog'

type StatusFilter = 'ALL' | SubmissionStatus

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'PASSED', label: 'Passed' },
  { value: 'NEEDS_IMPROVEMENT', label: 'Needs Improvement' },
]

const CONTEXT_LABEL: Record<SubmissionContextType, string> = {
  EXERCISE: 'Exercise',
  ASSIGNMENT: 'Assignment',
  CAPSTONE: 'Capstone',
}

export function GithubSubmissionsAdminPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<StatusFilter>('ALL')

  const submissionsQuery = useAllGithubSubmissions()
  const traineesQuery = useTrainees()
  const daysQuery = useDaysQuery()
  const exercisesQuery = useExercisesQuery()
  const assignmentsQuery = useAssignmentsQuery()

  const traineeById = useMemo(() => new Map((traineesQuery.data ?? []).map((t) => [t.id, t])), [traineesQuery.data])

  const dayIdByContext = useMemo(() => {
    const map = new Map<string, string>()
    const capstoneDay = (daysQuery.data ?? []).find((d) => d.dayNumber === 9)?.id
    for (const exercise of exercisesQuery.data ?? []) map.set(`EXERCISE:${exercise.id}`, exercise.dayId)
    for (const assignment of assignmentsQuery.data ?? []) map.set(`ASSIGNMENT:${assignment.id}`, assignment.dayId)
    if (capstoneDay) map.set('CAPSTONE', capstoneDay)
    return map
  }, [daysQuery.data, exercisesQuery.data, assignmentsQuery.data])

  function resolveDayId(submission: GithubSubmission): string | undefined {
    if (submission.contextType === 'CAPSTONE') return dayIdByContext.get('CAPSTONE')
    return dayIdByContext.get(`${submission.contextType}:${submission.contextId}`)
  }

  const filtered = useMemo(() => {
    let rows = submissionsQuery.data ?? []
    if (status !== 'ALL') rows = rows.filter((s) => s.status === status)
    const query = search.trim().toLowerCase()
    if (query) {
      rows = rows.filter((s) => {
        const trainee = traineeById.get(s.traineeId)
        return trainee ? trainee.name.toLowerCase().includes(query) || trainee.email.toLowerCase().includes(query) : false
      })
    }
    return rows
  }, [submissionsQuery.data, status, search, traineeById])

  const queries = [submissionsQuery, traineesQuery, daysQuery, exercisesQuery, assignmentsQuery]
  const isLoading = queries.some((q) => q.isLoading)
  const failedQuery = queries.find((q) => q.isError)

  function refetchAll() {
    for (const q of queries) q.refetch()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">GitHub Submissions</h1>
        <p className="mt-1 text-sm text-muted">Review GitHub submissions for exercises, assignments, and capstones across the cohort.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by trainee name or email…"
            className="pl-9"
            aria-label="Search by trainee"
          />
        </div>
        <Select value={status} onValueChange={(value) => setStatus(value as StatusFilter)}>
          <SelectTrigger className="sm:w-52">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && <LoadingState label="Loading GitHub submissions…" />}
      {!isLoading && failedQuery && (
        <ErrorState
          message={failedQuery.error instanceof Error ? failedQuery.error.message : 'Unable to load GitHub submissions.'}
          onRetry={refetchAll}
        />
      )}
      {!isLoading && !failedQuery && filtered.length === 0 && (
        <EmptyState title="No submissions found" description="Try adjusting your search or status filter." />
      )}
      {!isLoading && !failedQuery && filtered.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Trainee</TableHeaderCell>
              <TableHeaderCell>Context</TableHeaderCell>
              <TableHeaderCell>Repo URL</TableHeaderCell>
              <TableHeaderCell>Branch</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Submitted / Updated</TableHeaderCell>
              <TableHeaderCell className="text-right">Action</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((submission) => {
              const trainee = traineeById.get(submission.traineeId)
              const dayId = resolveDayId(submission)
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
                  <TableCell>
                    <span className="font-medium text-ink">{CONTEXT_LABEL[submission.contextType]}</span>
                  </TableCell>
                  <TableCell>
                    <a
                      href={submission.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-600 underline-offset-4 hover:underline"
                    >
                      {submission.repoUrl}
                    </a>
                  </TableCell>
                  <TableCell className="text-muted">{submission.branch}</TableCell>
                  <TableCell>
                    <SubmissionStatusBadge status={submission.status} />
                  </TableCell>
                  <TableCell className="text-xs text-muted">
                    <div>Submitted {format(new Date(submission.submittedAt), 'MMM d, yyyy')}</div>
                    <div>Updated {format(new Date(submission.updatedAt), 'MMM d, yyyy')}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <GithubReviewDialog submission={submission} traineeName={trainee?.name ?? 'Unknown trainee'} dayId={dayId} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
