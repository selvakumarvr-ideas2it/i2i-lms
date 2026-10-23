import { ArrowRight, CheckCircle2, Circle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { cn, formatPercent, formatScheduledDate } from '@/lib/utils'
import { ROUTES } from '@/routes'
import type { LearningDay } from '@/domain/course'
import type { DerivedDayProgress } from '@/domain/progress'

type StepState = 'done' | 'current' | 'pending'

function StepIcon({ state }: { state: StepState }) {
  if (state === 'done') return <CheckCircle2 className="h-5 w-5 shrink-0 text-success-600" aria-hidden />
  if (state === 'current') return <ArrowRight className="h-5 w-5 shrink-0 text-brand-600" aria-hidden />
  return <Circle className="h-5 w-5 shrink-0 text-slate-300" aria-hidden />
}

interface Row {
  key: string
  label: string
  description: string
  state: StepState
  actionLabel: string
  to: string
}

export function TodayLearningCard({
  day,
  progress,
}: {
  day: LearningDay
  progress: DerivedDayProgress | undefined
}) {
  const studyDone = progress?.studyCompleted ?? false
  const exerciseDone = progress?.exerciseCompleted ?? false
  const exerciseStarted = progress?.exerciseStarted ?? false
  const quizDone = progress?.quizCompleted ?? false
  const assignmentDone = progress?.assignmentSubmitted ?? false

  const rows: Row[] = [
    {
      key: 'study',
      label: 'Study Material',
      description: "Read today's core concepts and reference material",
      state: studyDone ? 'done' : 'current',
      actionLabel: studyDone ? 'Review' : 'Open',
      to: ROUTES.study(day.studyMaterialId),
    },
    {
      key: 'exercise',
      label: 'Exercise',
      description: 'Apply what you learned in a hands-on lab',
      state: exerciseDone ? 'done' : studyDone || exerciseStarted ? 'current' : 'pending',
      actionLabel: exerciseDone ? 'Review' : exerciseStarted ? 'Continue' : 'Start',
      to: ROUTES.exercise(day.exerciseId),
    },
    {
      key: 'quiz',
      label: 'Quiz',
      description:
        progress?.quizScorePercent != null
          ? `Last score ${formatPercent(progress.quizScorePercent)}`
          : 'Test your understanding of the day',
      state: quizDone ? 'done' : exerciseDone ? 'current' : 'pending',
      actionLabel: quizDone ? 'Retake Quiz' : 'Take Quiz',
      to: ROUTES.quiz(day.quizId),
    },
  ]

  if (day.assignmentId) {
    rows.push({
      key: 'assignment',
      label: 'Assignment',
      description: 'Submit your work for trainer evaluation',
      state: assignmentDone ? 'done' : quizDone ? 'current' : 'pending',
      actionLabel: assignmentDone ? 'View Submission' : 'Submit',
      to: ROUTES.assignment(day.assignmentId),
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Today&rsquo;s Learning — Day {day.dayNumber}
          {day.scheduledDate && <span className="ml-2 text-sm font-normal text-muted">{formatScheduledDate(day.scheduledDate)}</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="divide-y divide-line">
        {rows.map((row) => (
          <div key={row.key} className="flex items-center gap-3 py-3.5 first:pt-1 last:pb-1">
            <StepIcon state={row.state} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink">{row.label}</p>
              <p className="mt-0.5 truncate text-xs text-muted">{row.description}</p>
            </div>
            <Link to={row.to} className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'shrink-0')}>
              {row.actionLabel}
            </Link>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
