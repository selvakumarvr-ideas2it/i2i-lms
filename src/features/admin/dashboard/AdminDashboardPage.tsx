import type { LucideIcon } from 'lucide-react'
import { AlertOctagon, CheckCircle2, ClipboardList, FileWarning, Gauge, TrendingUp, Users, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { ErrorState, LoadingState } from '@/components/shared/States'
import { cn } from '@/lib/utils'
import { useCohortOverviewStats } from '@/hooks/useAdmin'
import { AtRiskTraineesPanel } from './AtRiskTraineesPanel'
import { AssignmentStatusChart, DailyCompletionChart, QuizPerformanceChart } from './DashboardCharts'

interface StatCardProps {
  label: string
  value: string
  icon: LucideIcon
  tone: 'brand' | 'info' | 'success' | 'warning' | 'danger'
}

const TONE_CLASSES: Record<StatCardProps['tone'], string> = {
  brand: 'bg-brand-50 text-brand-600',
  info: 'bg-info-50 text-info-600',
  success: 'bg-success-50 text-success-700',
  warning: 'bg-warning-50 text-warning-600',
  danger: 'bg-danger-50 text-danger-600',
}

function StatCard({ label, value, icon: Icon, tone }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', TONE_CLASSES[tone])}>
          <Icon className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <p className="text-xs font-medium text-muted">{label}</p>
          <p className="text-xl font-bold text-ink">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export function AdminDashboardPage() {
  const { data: stats, isLoading, isError, error, refetch } = useCohortOverviewStats()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Cohort Dashboard</h1>
        <p className="mt-1 text-sm text-muted">A real-time overview of trainee progress across the BI Visualization Accelerator.</p>
      </div>

      {isLoading && <LoadingState label="Loading cohort overview…" />}
      {isError && (
        <ErrorState message={error instanceof Error ? error.message : 'Unable to load cohort overview.'} onRetry={() => refetch()} />
      )}
      {!isLoading && !isError && stats && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Total Trainees" value={String(stats.totalTrainees)} icon={Users} tone="brand" />
          <StatCard label="Active" value={String(stats.active)} icon={Zap} tone="info" />
          <StatCard label="Completed" value={String(stats.completed)} icon={CheckCircle2} tone="success" />
          <StatCard label="At Risk" value={String(stats.atRisk)} icon={AlertOctagon} tone="danger" />
          <StatCard label="Avg. Progress" value={`${stats.averageProgressPercent}%`} icon={Gauge} tone="brand" />
          <StatCard label="Avg. Quiz Score" value={`${stats.averageQuizScorePercent}%`} icon={TrendingUp} tone="info" />
          <StatCard label="Assignments Pending" value={String(stats.assignmentsPending)} icon={ClipboardList} tone="warning" />
          <StatCard label="Exercises Pending" value={String(stats.exercisesPending)} icon={FileWarning} tone="warning" />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <DailyCompletionChart />
        <QuizPerformanceChart />
      </div>

      <AssignmentStatusChart />

      <AtRiskTraineesPanel />
    </div>
  )
}
