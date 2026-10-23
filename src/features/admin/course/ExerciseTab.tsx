import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/auth/AuthContext'
import { Button } from '@/components/ui/Button'
import { FieldError, Input, Label, Textarea } from '@/components/ui/Input'
import { useUpdateExercise } from '@/hooks/useCourseAdmin'
import type { Exercise } from '@/domain/course'

interface ExerciseFormValues {
  title: string
  objective: string
  businessScenario: string
  dataset: string
  expectedOutcome: string
  requirements: string
  hints: string
  acceptanceCriteria: string
}

function toLines(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

export function ExerciseTab({ exercise }: { exercise: Exercise }) {
  const { user } = useAuth()
  const isReadOnly = user?.role === 'MANAGER'
  const updateExercise = useUpdateExercise()
  const [showSaved, setShowSaved] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExerciseFormValues>({
    defaultValues: {
      title: exercise.title,
      objective: exercise.objective,
      businessScenario: exercise.businessScenario,
      dataset: exercise.dataset,
      expectedOutcome: exercise.expectedOutcome,
      requirements: exercise.requirements.join('\n'),
      hints: exercise.hints.join('\n'),
      acceptanceCriteria: exercise.acceptanceCriteria.join('\n'),
    },
  })

  const onSubmit = (values: ExerciseFormValues) => {
    updateExercise.mutate(
      {
        id: exercise.id,
        patch: {
          title: values.title.trim(),
          objective: values.objective.trim(),
          businessScenario: values.businessScenario.trim(),
          dataset: values.dataset.trim(),
          expectedOutcome: values.expectedOutcome.trim(),
          requirements: toLines(values.requirements),
          hints: toLines(values.hints),
          acceptanceCriteria: toLines(values.acceptanceCriteria),
        },
      },
      {
        onSuccess: () => {
          setShowSaved(true)
          setTimeout(() => setShowSaved(false), 2000)
        },
      },
    )
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      {isReadOnly && <p className="text-sm text-muted">Manager access is read-only — editing is disabled.</p>}
      <fieldset disabled={isReadOnly} className="contents">
      <div>
        <Label htmlFor="exercise-title">Title</Label>
        <Input id="exercise-title" aria-invalid={Boolean(errors.title)} {...register('title', { required: 'Title is required' })} />
        <FieldError>{errors.title?.message}</FieldError>
      </div>

      <div>
        <Label htmlFor="exercise-objective">Objective</Label>
        <Textarea id="exercise-objective" aria-invalid={Boolean(errors.objective)} {...register('objective', { required: 'Objective is required' })} />
        <FieldError>{errors.objective?.message}</FieldError>
      </div>

      <div>
        <Label htmlFor="exercise-scenario">Business Scenario</Label>
        <Textarea id="exercise-scenario" rows={4} {...register('businessScenario')} />
      </div>

      <div>
        <Label htmlFor="exercise-dataset">Dataset</Label>
        <Textarea id="exercise-dataset" rows={2} {...register('dataset')} />
      </div>

      <div>
        <Label htmlFor="exercise-requirements">Requirements (one per line)</Label>
        <Textarea id="exercise-requirements" rows={5} {...register('requirements')} />
      </div>

      <div>
        <Label htmlFor="exercise-outcome">Expected Outcome</Label>
        <Textarea id="exercise-outcome" rows={3} {...register('expectedOutcome')} />
      </div>

      <div>
        <Label htmlFor="exercise-hints">Hints (one per line)</Label>
        <Textarea id="exercise-hints" rows={4} {...register('hints')} />
      </div>

      <div>
        <Label htmlFor="exercise-criteria">Acceptance Criteria (one per line)</Label>
        <Textarea id="exercise-criteria" rows={4} {...register('acceptanceCriteria')} />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={updateExercise.isPending}>
          {updateExercise.isPending ? 'Saving…' : 'Save Exercise'}
        </Button>
        {showSaved && <span className="text-sm font-medium text-success-700">Saved</span>}
        {updateExercise.isError && (
          <span className="text-sm font-medium text-danger-600">
            {updateExercise.error instanceof Error ? updateExercise.error.message : 'Unable to save exercise.'}
          </span>
        )}
      </div>
      </fieldset>
    </form>
  )
}
