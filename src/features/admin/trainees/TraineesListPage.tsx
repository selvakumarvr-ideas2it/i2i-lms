import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { buttonVariants } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@/components/ui/Table'
import { EmptyState, ErrorState, LoadingState } from '@/components/shared/States'
import { useTrainees } from '@/hooks/useAdmin'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/routes'

type StatusFilter = 'ALL' | 'AT_RISK' | 'COMPLETED' | 'ACTIVE'

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'AT_RISK', label: 'At Risk' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'ACTIVE', label: 'Active' },
]

function StatusCell({ isAtRisk, overallCompletionPercent }: { isAtRisk: boolean; overallCompletionPercent: number }) {
  if (isAtRisk) return <Badge tone="danger">At Risk</Badge>
  if (overallCompletionPercent >= 100) return <Badge tone="success">Completed</Badge>
  if (overallCompletionPercent <= 0) return <Badge tone="neutral">Not Started</Badge>
  return <Badge tone="brand">Active</Badge>
}

export function TraineesListPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<StatusFilter>('ALL')
  const { data, isLoading, isError, error, refetch } = useTrainees({ search: search.trim() || undefined, status })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Trainees</h1>
        <p className="mt-1 text-sm text-muted">Search and filter trainees across the cohort.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="pl-9"
            aria-label="Search trainees"
          />
        </div>
        <Select value={status} onValueChange={(value) => setStatus(value as StatusFilter)}>
          <SelectTrigger className="sm:w-48">
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

      {isLoading && <LoadingState label="Loading trainees…" />}
      {isError && (
        <ErrorState message={error instanceof Error ? error.message : 'Unable to load trainees.'} onRetry={() => refetch()} />
      )}
      {!isLoading && !isError && data && data.length === 0 && (
        <EmptyState title="No trainees found" description="Try adjusting your search or filter." />
      )}
      {!isLoading && !isError && data && data.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>Progress</TableHeaderCell>
              <TableHeaderCell>Quiz Avg.</TableHeaderCell>
              <TableHeaderCell>Assignments</TableHeaderCell>
              <TableHeaderCell>Last Active</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell className="text-right">Action</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((trainee) => (
              <TableRow key={trainee.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar initials={trainee.avatarInitials} />
                    <span className="font-medium text-ink">{trainee.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted">{trainee.email}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <ProgressBar value={trainee.summary.overallCompletionPercent} className="w-24" />
                    <span className="text-xs font-medium text-muted">{trainee.summary.overallCompletionPercent}%</span>
                  </div>
                </TableCell>
                <TableCell>{trainee.summary.quizAveragePercent}%</TableCell>
                <TableCell>
                  {trainee.summary.assignmentsCompleted}/{trainee.summary.assignmentsTotal}
                </TableCell>
                <TableCell className="text-muted">
                  {trainee.summary.lastActiveAt
                    ? formatDistanceToNow(new Date(trainee.summary.lastActiveAt), { addSuffix: true })
                    : 'Never'}
                </TableCell>
                <TableCell>
                  <StatusCell isAtRisk={trainee.summary.isAtRisk} overallCompletionPercent={trainee.summary.overallCompletionPercent} />
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    to={ROUTES.adminTrainee(trainee.id)}
                    className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }))}
                  >
                    View
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
