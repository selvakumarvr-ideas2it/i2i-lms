import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/auth/AuthContext'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ErrorState, LoadingState } from '@/components/shared/States'
import { GithubSubmissionForm } from '@/features/submissions/GithubSubmissionForm'
import { useExerciseQuery } from '@/hooks/useCourse'
import { useDerivedProgress, useMarkExerciseCompleted, useMarkExerciseStarted } from '@/hooks/useProgress'
import { ROUTES } from '@/routes'

export function ExercisePage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const traineeId = user?.id
  const exerciseQuery = useExerciseQuery(id)
  const progressQuery = useDerivedProgress(traineeId)
  const markStarted = useMarkExerciseStarted(traineeId ?? '')
  const markCompleted = useMarkExerciseCompleted(traineeId ?? '')

  if (exerciseQuery.isLoading) return <LoadingState label="Loading exercise…" />
  if (exerciseQuery.isError) {
    return (
      <ErrorState
        message={exerciseQuery.error instanceof Error ? exerciseQuery.error.message : 'Unable to load this exercise.'}
        onRetry={() => exerciseQuery.refetch()}
      />
    )
  }

  const exercise = exerciseQuery.data
  if (!exercise) {
    return <ErrorState message="This exercise could not be found." />
  }

  const dayProgress = progressQuery.data?.find((p) => p.dayId === exercise.dayId)
  const exerciseStarted = dayProgress?.exerciseStarted ?? false
  const exerciseCompleted = dayProgress?.exerciseCompleted ?? false

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        to={ROUTES.learningDay(exercise.dayId)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Day
      </Link>

      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Exercise</p>
        <h1 className="mt-1 text-2xl font-bold text-ink">{exercise.title}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Objective</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-ink">{exercise.objective}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business Scenario</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line text-sm text-ink">{exercise.businessScenario}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dataset</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-ink">{exercise.dataset}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-ink">
            {exercise.requirements.map((requirement, index) => (
              <li key={index}>{requirement}</li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expected Outcome</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-ink">{exercise.expectedOutcome}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hints</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted">
            {exercise.hints.map((hint, index) => (
              <li key={index}>{hint}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Acceptance Criteria</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-ink">
            {exercise.acceptanceCriteria.map((criterion, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success-500" aria-hidden />
                <span>{criterion}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Progress</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          {exerciseCompleted ? (
            <Badge tone="success">Exercise Completed</Badge>
          ) : exerciseStarted ? (
            <Button onClick={() => markCompleted.mutate(exercise.dayId)} disabled={markCompleted.isPending}>
              {markCompleted.isPending ? 'Marking…' : 'Mark Exercise Completed'}
            </Button>
          ) : (
            <Button onClick={() => markStarted.mutate(exercise.dayId)} disabled={markStarted.isPending || !traineeId}>
              {markStarted.isPending ? 'Starting…' : 'Start Exercise'}
            </Button>
          )}
        </CardContent>
      </Card>

      {traineeId && (
        <GithubSubmissionForm traineeId={traineeId} dayId={exercise.dayId} contextType="EXERCISE" contextId={exercise.id} />
      )}
    </div>
  )
}
