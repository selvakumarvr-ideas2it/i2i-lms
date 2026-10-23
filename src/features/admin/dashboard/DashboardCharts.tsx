import { useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { EmptyState, ErrorState, LoadingState } from '@/components/shared/States'
import { useAssignmentStatusBreakdown, useCohortDailyCompletion, useCohortQuizPerformance } from '@/hooks/useAdmin'
import { useDaysQuery } from '@/hooks/useCourse'
import type { SubmissionStatus } from '@/domain/submission'

const CHART_COLORS = {
  brand: '#6d3df5',
  info: '#2563eb',
  success: '#159a65',
  warning: '#f59e0b',
  danger: '#ef4444',
}

const STATUS_LABEL: Record<SubmissionStatus, string> = {
  NOT_SUBMITTED: 'Not Submitted',
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  PASSED: 'Passed',
  NEEDS_IMPROVEMENT: 'Needs Improvement',
}

const STATUS_COLOR: Record<SubmissionStatus, string> = {
  NOT_SUBMITTED: '#94a3b8',
  SUBMITTED: CHART_COLORS.info,
  UNDER_REVIEW: CHART_COLORS.warning,
  PASSED: CHART_COLORS.success,
  NEEDS_IMPROVEMENT: CHART_COLORS.warning,
}

export function DailyCompletionChart() {
  const { data, isLoading, isError, error, refetch } = useCohortDailyCompletion()

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Daily Completion</CardTitle>
          <CardDescription>Cohort-wide average completion percent per day</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && <LoadingState label="Loading daily completion…" />}
        {isError && (
          <ErrorState message={error instanceof Error ? error.message : 'Unable to load daily completion.'} onRetry={() => refetch()} />
        )}
        {!isLoading && !isError && (!data || data.length === 0) && (
          <EmptyState title="No day data yet" description="Daily completion will appear once trainees start progressing." />
        )}
        {!isLoading && !isError && data && data.length > 0 && (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="dayNumber" tickFormatter={(v: number) => `Day ${v}`} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Completion']}
                  labelFormatter={(label) => `Day ${label}`}
                />
                <Bar dataKey="completionPercent" fill={CHART_COLORS.brand} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function QuizPerformanceChart() {
  const { data, isLoading, isError, error, refetch } = useCohortQuizPerformance()

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Quiz Performance</CardTitle>
          <CardDescription>Cohort-wide average quiz score per day</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && <LoadingState label="Loading quiz performance…" />}
        {isError && (
          <ErrorState message={error instanceof Error ? error.message : 'Unable to load quiz performance.'} onRetry={() => refetch()} />
        )}
        {!isLoading && !isError && (!data || data.length === 0) && (
          <EmptyState title="No quiz data yet" description="Quiz performance will appear once trainees start taking quizzes." />
        )}
        {!isLoading && !isError && data && data.length > 0 && (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="dayNumber" tickFormatter={(v: number) => `Day ${v}`} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Avg. Score']}
                  labelFormatter={(label) => `Day ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="averageScorePercent"
                  stroke={CHART_COLORS.info}
                  strokeWidth={2}
                  dot={{ r: 3, fill: CHART_COLORS.info }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function AssignmentStatusChart() {
  const [selectedDayId, setSelectedDayId] = useState<string>('all')
  const daysQuery = useDaysQuery()
  const { data, isLoading, isError, error, refetch } = useAssignmentStatusBreakdown(
    selectedDayId === 'all' ? undefined : selectedDayId,
  )
  const total = data?.reduce((sum, item) => sum + item.count, 0) ?? 0

  const assignmentDays = [...(daysQuery.data ?? [])].filter((d) => d.assignmentId).sort((a, b) => a.dayNumber - b.dayNumber)
  const selectedDay = assignmentDays.find((d) => d.id === selectedDayId)

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>Assignment Status</CardTitle>
            <CardDescription>
              {selectedDay ? `Breakdown of submissions for Day ${selectedDay.dayNumber} — ${selectedDay.title}` : 'Breakdown of assignment submissions across the cohort'}
            </CardDescription>
          </div>
          <Select value={selectedDayId} onValueChange={setSelectedDayId}>
            <SelectTrigger className="w-44" aria-label="Filter by day">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Days</SelectItem>
              {assignmentDays.map((day) => (
                <SelectItem key={day.id} value={day.id}>
                  Day {day.dayNumber} — {day.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && <LoadingState label="Loading assignment status…" />}
        {isError && (
          <ErrorState message={error instanceof Error ? error.message : 'Unable to load assignment status.'} onRetry={() => refetch()} />
        )}
        {!isLoading && !isError && (!data || total === 0) && (
          <EmptyState title="No assignment data yet" description="Assignment status will appear once submissions come in." />
        )}
        {!isLoading && !isError && data && total > 0 && (
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="h-64 w-full max-w-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="count"
                    nameKey="status"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {data.map((entry) => (
                      <Cell key={entry.status} fill={STATUS_COLOR[entry.status]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, _name, item) => [
                      value,
                      STATUS_LABEL[(item.payload as { status: SubmissionStatus }).status],
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="flex-1 space-y-2">
              {data.map((item) => (
                <li key={item.status} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2 text-ink">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: STATUS_COLOR[item.status] }} />
                    {STATUS_LABEL[item.status]}
                  </span>
                  <span className="font-semibold text-ink">{item.count}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
