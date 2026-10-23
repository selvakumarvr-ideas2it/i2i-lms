import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'
import { FieldError, Input, Label, Textarea } from '@/components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { useAuth } from '@/auth/AuthContext'
import { useEvaluateGithubSubmission } from '@/hooks/useAdmin'
import type { GithubSubmission, SubmissionStatus } from '@/domain/submission'

const STATUS_OPTIONS: { value: SubmissionStatus; label: string }[] = [
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'PASSED', label: 'Passed' },
  { value: 'NEEDS_IMPROVEMENT', label: 'Needs Improvement' },
]

interface GithubReviewDialogProps {
  submission: GithubSubmission
  traineeName: string
  dayId: string | undefined
}

export function GithubReviewDialog({ submission, traineeName, dayId }: GithubReviewDialogProps) {
  const { user } = useAuth()
  const isReadOnly = user?.role === 'MANAGER'
  const evaluate = useEvaluateGithubSubmission()
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<SubmissionStatus>(submission.status === 'NOT_SUBMITTED' ? 'UNDER_REVIEW' : submission.status)
  const [feedback, setFeedback] = useState(submission.comments)
  const [scoreInput, setScoreInput] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (next) {
      setStatus(submission.status === 'NOT_SUBMITTED' ? 'UNDER_REVIEW' : submission.status)
      setFeedback(submission.comments)
      setScoreInput('')
      setFormError(null)
    }
  }

  function submit() {
    if (!dayId) {
      setFormError('Unable to resolve which learning day this submission belongs to.')
      return
    }

    let score: number | undefined
    if (scoreInput.trim()) {
      const parsed = Number(scoreInput)
      if (Number.isNaN(parsed) || parsed < 0 || parsed > 100) {
        setFormError('Score must be a number between 0 and 100.')
        return
      }
      score = parsed
    }

    setFormError(null)
    evaluate.mutate(
      {
        submissionId: submission.id,
        traineeId: submission.traineeId,
        dayId,
        status,
        feedback,
        evaluatorId: user?.id ?? '',
        ...(score !== undefined ? { score, maxScore: 100 } : {}),
      },
      { onSuccess: () => setOpen(false) },
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">
          {isReadOnly ? 'View' : 'Review'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review Submission</DialogTitle>
          <DialogDescription>
            {traineeName} · Branch: {submission.branch}
          </DialogDescription>
        </DialogHeader>

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
            <Label htmlFor="github-review-status">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as SubmissionStatus)}>
              <SelectTrigger id="github-review-status">
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
            <Label htmlFor="github-review-score">Score (optional, 0-100)</Label>
            <Input
              id="github-review-score"
              type="number"
              min={0}
              max={100}
              placeholder="e.g. 85"
              value={scoreInput}
              onChange={(e) => setScoreInput(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="github-review-feedback">Feedback / Comments</Label>
            <Textarea
              id="github-review-feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Notes for the trainee…"
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
