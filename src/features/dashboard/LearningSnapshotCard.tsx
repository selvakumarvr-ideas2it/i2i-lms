import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatPercent } from '@/lib/utils'
import type { TraineeSummary } from '@/domain/progress'

export function LearningSnapshotCard({ summary }: { summary: TraineeSummary }) {
  const metrics = [
    { label: 'Quiz Average', value: formatPercent(summary.quizAveragePercent) },
    { label: 'Assignments', value: `${summary.assignmentsCompleted}/${summary.assignmentsTotal}` },
    { label: 'Exercises', value: `${summary.exercisesCompleted}/${summary.exercisesTotal}` },
    { label: 'Course Progress', value: formatPercent(summary.overallCompletionPercent) },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Learning Snapshot</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-lg bg-surface p-4">
              <b className="block text-2xl font-bold text-ink">{metric.value}</b>
              <span className="text-xs text-muted">{metric.label}</span>
            </div>
          ))}
        </div>
        {summary.isAtRisk && summary.atRiskReasons.length > 0 && (
          <div className="mt-4 rounded-lg bg-warning-50 p-3 text-xs text-warning-600">
            <p className="font-semibold">Needs attention</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-4">
              {summary.atRiskReasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
