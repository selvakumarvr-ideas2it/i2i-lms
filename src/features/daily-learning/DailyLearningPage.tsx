import { ArrowLeft, ArrowRight, CheckCircle2, Circle } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { buttonVariants } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ErrorState, LoadingState } from '@/components/shared/States'
import { useDayQuery } from '@/hooks/useCourse'
import { useDerivedProgress } from '@/hooks/useProgress'
import { cn, formatPercent, formatScheduledDate } from '@/lib/utils'
import { ROUTES } from '@/routes'

type StepState = 'done' | 'current' | 'pending'

function StepIcon({ state }: { state: StepState }) {
  if (state === 'done') return <CheckCircle2 className="h-5 w-5 shrink-0 text-success-600" aria-hidden />
  if (state === 'current') return <ArrowRight className="h-5 w-5 shrink-0 text-brand-600" aria-hidden />
  return <Circle className="h-5 w-5 shrink-0 text-slate-300" aria-hidden />
}

export function DailyLearningPage() {
  const { user } = useAuth()
  const { dayId } = useParams<{ dayId: string }>()

  const dayQuery = useDayQuery(dayId)
  const derivedQuery = useDerivedProgress(user?.id)

  if (!user) return null

  if (dayQuery.isLoading || derivedQuery.isLoading) {
    return <LoadingState label="Loading day…" />
  }

  const error = dayQuery.error ?? derivedQuery.error
  if (error) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : 'Failed to load this day'}
        onRetry={() => {
          void dayQuery.refetch()
          void derivedQuery.refetch()
        }}
      />
    )
  }

  const day = dayQuery.data
  if (!day) {
    return <ErrorState message="This learning day could not be found." />
  }

  const progress = (derivedQuery.data ?? []).find((d) => d.dayId === day.id)
  const completionPercent = progress?.completionPercent ?? 0

  const studyDone = progress?.studyCompleted ?? false
  const exerciseDone = progress?.exerciseCompleted ?? false
  const exerciseStarted = progress?.exerciseStarted ?? false
  const quizDone = progress?.quizCompleted ?? false
  const assignmentDone = progress?.assignmentSubmitted ?? false

  const rows: { key: string; label: string; description: string; state: StepState; actionLabel: string; to: string }[] = [
    {
      key: 'study',
      label: 'Study Material',
      description: 'Read the core concepts and reference material',
      state: studyDone ? 'done' : 'pending',
      actionLabel: studyDone ? 'Review' : 'Open',
      to: ROUTES.study(day.studyMaterialId),
    },
    {
      key: 'exercise',
      label: 'Exercise',
      description: 'Apply what you learned in a hands-on lab',
      state: exerciseDone ? 'done' : exerciseStarted ? 'current' : 'pending',
      actionLabel: exerciseDone ? 'Review' : exerciseStarted ? 'Continue' : 'Start',
      to: ROUTES.exercise(day.exerciseId),
    },
    {
      key: 'quiz',
      label: 'Quiz',
      description:
        progress?.quizScorePercent != null
          ? `Last score ${formatPercent(progress.quizScorePercent)} • ${progress.quizAttempts} attempt(s)`
          : 'Test your understanding of the day',
      state: quizDone ? 'done' : 'pending',
      actionLabel: quizDone ? 'Retake Quiz' : 'Take Quiz',
      to: ROUTES.quiz(day.quizId),
    },
  ]

  if (day.assignmentId) {
    rows.push({
      key: 'assignment',
      label: 'Assignment',
      description: 'Submit your work for trainer evaluation',
      state: assignmentDone ? 'done' : 'pending',
      actionLabel: assignmentDone ? 'View Submission' : 'Submit',
      to: ROUTES.assignment(day.assignmentId),
    })
  }

  return (
    <div className="space-y-6">
      <Link to={ROUTES.learningPath} className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline">
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to Learning Path
      </Link>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Day {day.dayNumber}
          {day.scheduledDate && <span className="normal-case text-muted"> · {formatScheduledDate(day.scheduledDate)}</span>}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-ink">{day.title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">{day.description}</p>
      </div>

      <Card>
        <CardContent className="pt-5">
          <div className="flex items-center justify-between text-sm font-semibold text-ink">
            <span>Day Progress</span>
            <span>{formatPercent(completionPercent)}</span>
          </div>
          <ProgressBar value={completionPercent} className="mt-3" />
        </CardContent>
      </Card>

      {day.learningObjectives.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Learning Objectives</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-1.5 pl-5 text-sm text-ink/90">
              {day.learningObjectives.map((objective) => (
                <li key={objective}>{objective}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Day Activities</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-line">
          {rows.map((row) => (
            <div key={row.key} className="flex items-center gap-3 py-3.5 first:pt-1 last:pb-1">
              <StepIcon state={row.state} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink">{row.label}</p>
                <p className="mt-0.5 text-xs text-muted">{row.description}</p>
              </div>
              <Link to={row.to} className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'shrink-0')}>
                {row.actionLabel}
              </Link>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
