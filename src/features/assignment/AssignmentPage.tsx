import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ArrowLeft } from 'lucide-react'
import { z } from 'zod'
import { useAuth } from '@/auth/AuthContext'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { FieldError, Input, Label, Textarea } from '@/components/ui/Input'
import { ErrorState, LoadingState } from '@/components/shared/States'
import { SubmissionStatusBadge } from '@/components/shared/StatusBadge'
import { useAssignmentQuery } from '@/hooks/useCourse'
import { useAssignmentSubmission, useSubmitAssignment } from '@/hooks/useSubmissions'
import { githubUrlSchema } from '@/lib/validation'
import { ROUTES } from '@/routes'

const schema = z.object({
  notes: z.string().trim().min(1, 'Please describe what you built before submitting'),
  githubRepoUrl: githubUrlSchema,
})

type FormValues = z.infer<typeof schema>

export function AssignmentPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const traineeId = user?.id

  const assignmentQuery = useAssignmentQuery(id)
  const submissionQuery = useAssignmentSubmission(traineeId, id)

  if (assignmentQuery.isLoading) return <LoadingState label="Loading assignment…" />
  if (assignmentQuery.isError) {
    return (
      <ErrorState
        message={assignmentQuery.error instanceof Error ? assignmentQuery.error.message : 'Unable to load this assignment.'}
        onRetry={() => assignmentQuery.refetch()}
      />
    )
  }

  const assignment = assignmentQuery.data
  if (!assignment) {
    return <ErrorState message="This assignment could not be found." />
  }

  const submission = submissionQuery.data
  const status = submission?.status ?? 'NOT_SUBMITTED'
  const showForm = !submission || status === 'NOT_SUBMITTED' || status === 'NEEDS_IMPROVEMENT'
  const showResults = status === 'PASSED' || status === 'NEEDS_IMPROVEMENT'
  const showReadOnly = status === 'SUBMITTED' || status === 'UNDER_REVIEW' || status === 'PASSED'

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        to={ROUTES.learningDay(assignment.dayId)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Day
      </Link>

      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Assignment</p>
        <h1 className="mt-1 text-2xl font-bold text-ink">{assignment.title}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Objective</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-ink">{assignment.objective}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business Context</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line text-sm text-ink">{assignment.businessContext}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-ink">
            {assignment.requirements.map((requirement: string, index: number) => (
              <li key={index}>{requirement}</li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Deliverables</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-2 pl-5 text-sm text-ink">
            {assignment.deliverables.map((deliverable: string, index: number) => (
              <li key={index}>{deliverable}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Submission Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line text-sm text-ink">{assignment.submissionInstructions}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Evaluation Criteria</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-2 pl-5 text-sm text-ink">
            {assignment.evaluationCriteria.map((criterion: string, index: number) => (
              <li key={index}>{criterion}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {showReadOnly && submission && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>Your Submission</CardTitle>
              <SubmissionStatusBadge status={submission.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Notes</p>
              <p className="mt-1 whitespace-pre-line text-sm text-ink">{submission.notes}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Repository</p>
              <a
                href={submission.githubRepoUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1 block text-sm font-medium text-brand-600 underline-offset-4 hover:underline"
              >
                {submission.githubRepoUrl}
              </a>
            </div>
            {(status === 'SUBMITTED' || status === 'UNDER_REVIEW') && (
              <p className="text-sm text-muted">Awaiting trainer review.</p>
            )}
          </CardContent>
        </Card>
      )}

      {showResults && submission && (
        <Card>
          <CardHeader>
            <CardTitle>Evaluation Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm font-semibold text-ink">
              Score: {submission.score ?? '—'} / {submission.maxScore}
            </p>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Trainer Feedback</p>
              <p className="mt-1 whitespace-pre-line text-sm text-ink">{submission.feedback ?? 'No feedback provided.'}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {showForm && traineeId && (
        <AssignmentSubmissionForm
          traineeId={traineeId}
          dayId={assignment.dayId}
          assignmentId={assignment.id}
          isResubmit={status === 'NEEDS_IMPROVEMENT'}
          defaultNotes={submission?.notes ?? ''}
          defaultRepoUrl={submission?.githubRepoUrl ?? ''}
        />
      )}
    </div>
  )
}

interface AssignmentSubmissionFormProps {
  traineeId: string
  dayId: string
  assignmentId: string
  isResubmit: boolean
  defaultNotes: string
  defaultRepoUrl: string
}

function AssignmentSubmissionForm({
  traineeId,
  dayId,
  assignmentId,
  isResubmit,
  defaultNotes,
  defaultRepoUrl,
}: AssignmentSubmissionFormProps) {
  const submitAssignment = useSubmitAssignment(traineeId, dayId, assignmentId)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { notes: defaultNotes, githubRepoUrl: defaultRepoUrl },
  })

  useEffect(() => {
    reset({ notes: defaultNotes, githubRepoUrl: defaultRepoUrl })
  }, [defaultNotes, defaultRepoUrl, reset])

  const onSubmit = (values: FormValues) => {
    submitAssignment.mutate(values)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isResubmit ? 'Resubmit Assignment' : 'Submit Assignment'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Summarize what you built and how it meets the requirements…"
              aria-invalid={Boolean(errors.notes)}
              {...register('notes')}
            />
            <FieldError>{errors.notes?.message}</FieldError>
          </div>

          <div>
            <Label htmlFor="githubRepoUrl">GitHub Repository</Label>
            <Input
              id="githubRepoUrl"
              placeholder="https://github.com/username/repo"
              aria-invalid={Boolean(errors.githubRepoUrl)}
              {...register('githubRepoUrl')}
            />
            <FieldError>{errors.githubRepoUrl?.message}</FieldError>
          </div>

          {submitAssignment.isError && (
            <div role="alert" className="rounded-lg border border-danger-500/30 bg-danger-50 px-3 py-2 text-sm text-danger-600">
              {submitAssignment.error instanceof Error ? submitAssignment.error.message : 'Unable to submit your assignment.'}
            </div>
          )}

          {submitAssignment.isSuccess && (
            <div className="rounded-lg border border-success-500/30 bg-success-50 px-3 py-2 text-sm text-success-700">
              Your assignment was submitted successfully.
            </div>
          )}

          <Button type="submit" disabled={submitAssignment.isPending}>
            {submitAssignment.isPending ? 'Submitting…' : isResubmit ? 'Resubmit Assignment' : 'Submit Assignment'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
