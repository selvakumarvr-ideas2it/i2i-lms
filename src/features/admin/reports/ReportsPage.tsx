import { useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@/components/ui/Table'
import { EmptyState, ErrorState, LoadingState } from '@/components/shared/States'
import { useExportCohortCsv, useTrainees } from '@/hooks/useAdmin'

export function ReportsPage() {
  const traineesQuery = useTrainees()
  const exportCsv = useExportCohortCsv()
  const [justExported, setJustExported] = useState(false)

  function handleExport() {
    setJustExported(false)
    exportCsv.mutate(undefined, { onSuccess: () => setJustExported(true) })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Cohort Progress Report</h1>
        <p className="mt-1 text-sm text-muted">
          Export a full cohort progress report as a CSV — one row per trainee, with columns for Trainee, Day 1 through
          Day 9 completion %, Overall %, Quiz Average, Assignments Completed, GitHub Submissions count, and Final
          Score.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Export CSV</CardTitle>
            <CardDescription>Downloads immediately to your browser — no data leaves this session.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={handleExport} disabled={exportCsv.isPending}>
            <Download className="h-4 w-4" aria-hidden />
            {exportCsv.isPending ? 'Preparing export…' : 'Export CSV'}
          </Button>

          {exportCsv.isError && (
            <p className="text-sm text-danger-600">
              {exportCsv.error instanceof Error ? exportCsv.error.message : 'Unable to generate the export.'}
            </p>
          )}
          {justExported && !exportCsv.isPending && (
            <p className="text-sm text-success-700">Export ready — check your browser downloads.</p>
          )}
          <p className="text-xs text-muted">Export includes a day-by-day completion breakdown not shown in the preview below.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Preview</CardTitle>
            <CardDescription>A simplified summary — the exported CSV includes the full per-day breakdown.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {traineesQuery.isLoading && <LoadingState label="Loading cohort data…" />}
          {traineesQuery.isError && (
            <ErrorState
              message={traineesQuery.error instanceof Error ? traineesQuery.error.message : 'Unable to load cohort data.'}
              onRetry={() => traineesQuery.refetch()}
            />
          )}
          {!traineesQuery.isLoading && !traineesQuery.isError && (traineesQuery.data?.length ?? 0) === 0 && (
            <EmptyState title="No trainees yet" description="Trainee data will appear here once the cohort is populated." />
          )}
          {!traineesQuery.isLoading && !traineesQuery.isError && traineesQuery.data && traineesQuery.data.length > 0 && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Trainee</TableHeaderCell>
                  <TableHeaderCell>Overall %</TableHeaderCell>
                  <TableHeaderCell>Quiz Average</TableHeaderCell>
                  <TableHeaderCell>Assignments Completed</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {traineesQuery.data.map((trainee) => (
                  <TableRow key={trainee.id}>
                    <TableCell className="font-medium text-ink">{trainee.name}</TableCell>
                    <TableCell>{trainee.summary.overallCompletionPercent}%</TableCell>
                    <TableCell>{trainee.summary.quizAveragePercent}%</TableCell>
                    <TableCell>
                      {trainee.summary.assignmentsCompleted}/{trainee.summary.assignmentsTotal}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
