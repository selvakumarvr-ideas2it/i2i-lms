import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { FieldError, Input, Label, Textarea } from '@/components/ui/Input'
import { SubmissionStatusBadge } from '@/components/shared/StatusBadge'
import { useGithubSubmission, useSubmitGithubRepo } from '@/hooks/useSubmissions'
import { githubUrlSchema, optionalGithubUrlSchema } from '@/lib/validation'
import type { SubmissionContextType } from '@/domain/submission'

const schema = z.object({
  repoUrl: githubUrlSchema,
  branch: z.string().trim(),
  commitOrPrUrl: optionalGithubUrlSchema,
  comments: z.string().trim(),
})

type FormValues = z.infer<typeof schema>

interface GithubSubmissionFormProps {
  traineeId: string
  dayId: string | null
  contextType: SubmissionContextType
  contextId: string
}

export function GithubSubmissionForm({ traineeId, dayId, contextType, contextId }: GithubSubmissionFormProps) {
  const { data: submission } = useGithubSubmission(traineeId, contextType, contextId)
  const submitRepo = useSubmitGithubRepo(traineeId, contextType, contextId, dayId)
  const [showSuccess, setShowSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      repoUrl: submission?.repoUrl ?? '',
      branch: submission?.branch ?? '',
      commitOrPrUrl: submission?.commitOrPrUrl ?? '',
      comments: submission?.comments ?? '',
    },
  })

  useEffect(() => {
    if (submission) {
      reset({
        repoUrl: submission.repoUrl,
        branch: submission.branch,
        commitOrPrUrl: submission.commitOrPrUrl,
        comments: submission.comments,
      })
    }
  }, [submission, reset])

  const hasSubmission = Boolean(submission)

  const onSubmit = (values: FormValues) => {
    setShowSuccess(false)
    submitRepo.mutate(
      {
        repoUrl: values.repoUrl,
        branch: values.branch,
        commitOrPrUrl: values.commitOrPrUrl ?? '',
        comments: values.comments,
      },
      { onSuccess: () => setShowSuccess(true) },
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>GitHub Submission</CardTitle>
          {submission && <SubmissionStatusBadge status={submission.status} />}
        </div>
      </CardHeader>
      <CardContent>
        {submission && (
          <p className="mb-4 text-sm text-muted">
            Current repository:{' '}
            <a
              href={submission.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-brand-600 underline-offset-4 hover:underline"
            >
              {submission.repoUrl}
            </a>
          </p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <Label htmlFor="repoUrl">GitHub Repository URL</Label>
            <Input
              id="repoUrl"
              placeholder="https://github.com/username/repo"
              aria-invalid={Boolean(errors.repoUrl)}
              {...register('repoUrl')}
            />
            <FieldError>{errors.repoUrl?.message}</FieldError>
          </div>

          <div>
            <Label htmlFor="branch">Branch</Label>
            <Input id="branch" placeholder="main" {...register('branch')} />
            <FieldError>{errors.branch?.message}</FieldError>
          </div>

          <div>
            <Label htmlFor="commitOrPrUrl">Commit / PR URL</Label>
            <Input
              id="commitOrPrUrl"
              placeholder="https://github.com/username/repo/pull/1"
              aria-invalid={Boolean(errors.commitOrPrUrl)}
              {...register('commitOrPrUrl')}
            />
            <FieldError>{errors.commitOrPrUrl?.message}</FieldError>
          </div>

          <div>
            <Label htmlFor="comments">Comments</Label>
            <Textarea id="comments" placeholder="Anything the reviewer should know…" {...register('comments')} />
            <FieldError>{errors.comments?.message}</FieldError>
          </div>

          {submitRepo.isError && (
            <div role="alert" className="rounded-lg border border-danger-500/30 bg-danger-50 px-3 py-2 text-sm text-danger-600">
              {submitRepo.error instanceof Error ? submitRepo.error.message : 'Unable to submit your repository.'}
            </div>
          )}

          {showSuccess && !submitRepo.isPending && (
            <div className="rounded-lg border border-success-500/30 bg-success-50 px-3 py-2 text-sm text-success-700">
              Your repository was submitted successfully.
            </div>
          )}

          <Button type="submit" disabled={submitRepo.isPending}>
            {submitRepo.isPending ? 'Submitting…' : hasSubmission ? 'Update Submission' : 'Submit Repository'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
