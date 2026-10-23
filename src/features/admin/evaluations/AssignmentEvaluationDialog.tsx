import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'
import { FieldError, HelpText, Input, Label, Textarea } from '@/components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { useAuth } from '@/auth/AuthContext'
import { useEvaluateAssignmentSubmission } from '@/hooks/useAdmin'
import type { AssignmentSubmission } from '@/domain/assignment'
import type { SubmissionStatus } from '@/domain/submission'

const STATUS_OPTIONS: { value: SubmissionStatus; label: string }[] = [
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'PASSED', label: 'Passed' },
  { value: 'NEEDS_IMPROVEMENT', label: 'Needs Improvement' },
]

function initialStatus(status: SubmissionStatus): SubmissionStatus {
  return status === 'SUBMITTED' || status === 'NOT_SUBMITTED' ? 'UNDER_REVIEW' : status
}

interface AssignmentEvaluationDialogProps {
  submission: AssignmentSubmission
  traineeName: string
  dayId: string | undefined
}

export function AssignmentEvaluationDialog({ submission, traineeName, dayId }: AssignmentEvaluationDialogProps) {
  const { user } = useAuth()
  const isReadOnly = user?.role === 'MANAGER'
  const evaluate = useEvaluateAssignmentSubmission()
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<SubmissionStatus>(initialStatus(submission.status))
  const [scoreInput, setScoreInput] = useState(submission.score !== null ? String(submission.score) : '')
  const [feedback, setFeedback] = useState(submission.feedback ?? '')
  const [formError, setFormError] = useState<string | null>(null)

  const needsScore = status === 'PASSED' || status === 'NEEDS_IMPROVEMENT'

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (next) {
      setStatus(initialStatus(submission.status))
      setScoreInput(submission.score !== null ? String(submission.score) : '')
      setFeedback(submission.feedback ?? '')
      setFormError(null)
    }
  }

  function submit() {
    if (!dayId) {
      setFormError('Unable to resolve the learning day for this assignment.')
      return
    }
    if (!feedback.trim()) {
      setFormError('Feedback is required — this is what the trainee will see.')
      return
    }

    let score: number | null = null
    if (scoreInput.trim()) {
      const parsed = Number(scoreInput)
      if (Number.isNaN(parsed) || parsed < 0 || parsed > 100) {
        setFormError('Score must be a number between 0 and 100.')
        return
      }
      score = parsed
    } else if (needsScore) {
      setFormError('Score is required when marking a submission as Passed or Needs Improvement.')
      return
    }

    setFormError(null)
    evaluate.mutate(
      {
        submissionId: submission.id,
        traineeId: submission.traineeId,
        dayId,
        status,
        score,
        feedback,
        evaluatorId: user?.id ?? '',
      },
      { onSuccess: () => setOpen(false) },
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">
          {isReadOnly ? 'View' : 'Evaluate'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Evaluate Assignment Submission</DialogTitle>
          <DialogDescription>{traineeName}</DialogDescription>
        </DialogHeader>

        <div className="mb-4 space-y-2 rounded-lg border border-line bg-slate-50 p-3 text-sm">
          <p className="font-medium text-ink">Submission Notes</p>
          <p className="whitespace-pre-wrap text-muted">{submission.notes || 'No notes provided.'}</p>
          <a
            href={submission.githubRepoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block text-brand-600 underline-offset-4 hover:underline"
          >
            {submission.githubRepoUrl}
          </a>
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
          noValidate
        >
          {isReadOnly && <p className="text-sm text-muted">Manager access is read-only — you can view but not save changes.</p>}
          <fieldset disabled={isReadOnly} className="contents">
          <div>
            <Label htmlFor="assignment-eval-status">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as SubmissionStatus)}>
              <SelectTrigger id="assignment-eval-status">
                <SelectValue />
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

          <div>
            <Label htmlFor="assignment-eval-score">Score{needsScore ? ' (required, 0-100)' : ' (0-100)'}</Label>
            <Input
              id="assignment-eval-score"
              type="number"
              min={0}
              max={100}
              placeholder="e.g. 90"
              value={scoreInput}
              onChange={(e) => setScoreInput(e.target.value)}
            />
            <HelpText>Score out of {submission.maxScore}, required when marking Passed or Needs Improvement.</HelpText>
          </div>

          <div>
            <Label htmlFor="assignment-eval-feedback">Trainer Feedback</Label>
            <Textarea
              id="assignment-eval-feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="This will be shown to the trainee…"
            />
          </div>

          {(formError || evaluate.isError) && (
            <FieldError>
              {formError ?? (evaluate.error instanceof Error ? evaluate.error.message : 'Unable to save evaluation.')}
            </FieldError>
          )}
          </fieldset>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            {!isReadOnly && (
              <Button type="submit" disabled={evaluate.isPending}>
                {evaluate.isPending ? 'Saving…' : 'Save Evaluation'}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
