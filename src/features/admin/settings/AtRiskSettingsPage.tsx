import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useAuth } from '@/auth/AuthContext'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { FieldError, HelpText, Input, Label } from '@/components/ui/Input'
import { EmptyState, ErrorState, LoadingState } from '@/components/shared/States'
import { useAtRiskThresholds, useSetAtRiskThresholds } from '@/hooks/useAdmin'

const schema = z.object({
  minProgressPercent: z.number().min(0, 'Must be 0 or greater').max(100, 'Must be 100 or less'),
  inactivityDays: z.number().min(1, 'Must be at least 1 day'),
  minQuizAveragePercent: z.number().min(0, 'Must be 0 or greater').max(100, 'Must be 100 or less'),
  maxOverdueAssignments: z.number().min(0, 'Must be 0 or greater'),
  gracePeriodDays: z.number().min(0, 'Must be 0 or greater'),
  courseStartDate: z.string(), // empty string = not set (stored as null)
})

type FormValues = z.infer<typeof schema>

export function AtRiskSettingsPage() {
  const { user } = useAuth()
  const isReadOnly = user?.role === 'MANAGER'
  const thresholdsQuery = useAtRiskThresholds()
  const setThresholds = useSetAtRiskThresholds()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      minProgressPercent: 0,
      inactivityDays: 1,
      minQuizAveragePercent: 0,
      maxOverdueAssignments: 0,
      gracePeriodDays: 1,
      courseStartDate: '',
    },
  })

  useEffect(() => {
    if (thresholdsQuery.data) reset({ ...thresholdsQuery.data, courseStartDate: thresholdsQuery.data.courseStartDate ?? '' })
  }, [thresholdsQuery.data, reset])

  const onSubmit = (values: FormValues) => {
    setThresholds.mutate({ ...values, courseStartDate: values.courseStartDate.trim() || null })
  }

  const showForm = !thresholdsQuery.isLoading && !thresholdsQuery.isError && thresholdsQuery.data

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">At-Risk Thresholds</h1>
        <p className="mt-1 text-sm text-muted">Configure the rules used to flag a trainee as at risk across the cohort.</p>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Thresholds</CardTitle>
            <CardDescription>Changes apply immediately across the dashboard and trainee list.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {thresholdsQuery.isLoading && <LoadingState label="Loading thresholds…" />}
          {thresholdsQuery.isError && (
            <ErrorState
              message={thresholdsQuery.error instanceof Error ? thresholdsQuery.error.message : 'Unable to load thresholds.'}
              onRetry={() => thresholdsQuery.refetch()}
            />
          )}
          {!thresholdsQuery.isLoading && !thresholdsQuery.isError && !thresholdsQuery.data && (
            <EmptyState title="No thresholds configured" description="Default thresholds could not be loaded." />
          )}
          {showForm && (
            <form id="at-risk-thresholds-form" className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
              {isReadOnly && <p className="text-sm text-muted">Manager access is read-only — editing is disabled.</p>}
              <fieldset disabled={isReadOnly} className="contents">
              <div>
                <Label htmlFor="courseStartDate">Course Start Date</Label>
                <Input id="courseStartDate" type="date" {...register('courseStartDate')} />
                <HelpText>
                  The whole cohort's grace period is measured from this date, not from when each trainee's account row was
                  created (accounts are often added days or weeks before training actually begins). Leave blank to fall back to
                  measuring each trainee's own join date instead.
                </HelpText>
              </div>

              <div>
                <Label htmlFor="gracePeriodDays">Grace Period (days)</Label>
                <Input
                  id="gracePeriodDays"
                  type="number"
                  min={0}
                  aria-invalid={Boolean(errors.gracePeriodDays)}
                  {...register('gracePeriodDays', { valueAsNumber: true })}
                />
                <HelpText>
                  A trainee is never flagged as at risk until this many days after the course start date above (or their own
                  join date, whichever is later) — a brand-new cohort hasn't had time to make progress, take a quiz, or even
                  log in yet.
                </HelpText>
                <FieldError>{errors.gracePeriodDays?.message}</FieldError>
              </div>

              <div>
                <Label htmlFor="minProgressPercent">Minimum Progress %</Label>
                <Input
                  id="minProgressPercent"
                  type="number"
                  min={0}
                  max={100}
                  aria-invalid={Boolean(errors.minProgressPercent)}
                  {...register('minProgressPercent', { valueAsNumber: true })}
                />
                <HelpText>Trainees whose overall completion falls below this percentage are flagged as at risk.</HelpText>
                <FieldError>{errors.minProgressPercent?.message}</FieldError>
              </div>

              <div>
                <Label htmlFor="inactivityDays">Inactivity Days</Label>
                <Input
                  id="inactivityDays"
                  type="number"
                  min={1}
                  aria-invalid={Boolean(errors.inactivityDays)}
                  {...register('inactivityDays', { valueAsNumber: true })}
                />
                <HelpText>Trainees with no activity for this many days or more are flagged as at risk.</HelpText>
                <FieldError>{errors.inactivityDays?.message}</FieldError>
              </div>

              <div>
                <Label htmlFor="minQuizAveragePercent">Minimum Quiz Average %</Label>
                <Input
                  id="minQuizAveragePercent"
                  type="number"
                  min={0}
                  max={100}
                  aria-invalid={Boolean(errors.minQuizAveragePercent)}
                  {...register('minQuizAveragePercent', { valueAsNumber: true })}
                />
                <HelpText>Trainees whose average quiz score falls below this percentage are flagged as at risk.</HelpText>
                <FieldError>{errors.minQuizAveragePercent?.message}</FieldError>
              </div>

              <div>
                <Label htmlFor="maxOverdueAssignments">Max Overdue Assignments</Label>
                <Input
                  id="maxOverdueAssignments"
                  type="number"
                  min={0}
                  aria-invalid={Boolean(errors.maxOverdueAssignments)}
                  {...register('maxOverdueAssignments', { valueAsNumber: true })}
                />
                <HelpText>Trainees with more overdue assignments than this are flagged as at risk.</HelpText>
                <FieldError>{errors.maxOverdueAssignments?.message}</FieldError>
              </div>

              {setThresholds.isError && (
                <div role="alert" className="rounded-lg border border-danger-500/30 bg-danger-50 px-3 py-2 text-sm text-danger-600">
                  {setThresholds.error instanceof Error ? setThresholds.error.message : 'Unable to save thresholds.'}
                </div>
              )}
              {setThresholds.isSuccess && !setThresholds.isPending && (
                <div className="rounded-lg border border-success-500/30 bg-success-50 px-3 py-2 text-sm text-success-700">
                  Saved.
                </div>
              )}
              </fieldset>
            </form>
          )}
        </CardContent>
        {showForm && (
          <CardFooter>
            <Button type="submit" form="at-risk-thresholds-form" disabled={setThresholds.isPending || isReadOnly}>
              {setThresholds.isPending ? 'Saving…' : 'Save Thresholds'}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
