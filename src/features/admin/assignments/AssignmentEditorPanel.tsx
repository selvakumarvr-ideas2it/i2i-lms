import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/auth/AuthContext'
import { Button } from '@/components/ui/Button'
import { FieldError, Input, Label, Textarea } from '@/components/ui/Input'
import { useUpdateAssignment } from '@/hooks/useCourseAdmin'
import type { Assignment } from '@/domain/assignment'

interface AssignmentFormValues {
  title: string
  objective: string
  businessContext: string
  requirements: string
  deliverables: string
  submissionInstructions: string
  evaluationCriteria: string
}

function toLines(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

export function AssignmentEditorPanel({ assignment }: { assignment: Assignment }) {
  const { user } = useAuth()
  const isReadOnly = user?.role === 'MANAGER'
  const updateAssignment = useUpdateAssignment()
  const [showSaved, setShowSaved] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignmentFormValues>({
    defaultValues: {
      title: assignment.title,
      objective: assignment.objective,
      businessContext: assignment.businessContext,
      requirements: assignment.requirements.join('\n'),
      deliverables: assignment.deliverables.join('\n'),
      submissionInstructions: assignment.submissionInstructions,
      evaluationCriteria: assignment.evaluationCriteria.join('\n'),
    },
  })

  const onSubmit = (values: AssignmentFormValues) => {
    updateAssignment.mutate(
      {
        id: assignment.id,
        patch: {
          title: values.title.trim(),
          objective: values.objective.trim(),
          businessContext: values.businessContext.trim(),
          requirements: toLines(values.requirements),
          deliverables: toLines(values.deliverables),
          submissionInstructions: values.submissionInstructions.trim(),
          evaluationCriteria: toLines(values.evaluationCriteria),
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
        <Label htmlFor={`${assignment.id}-title`}>Title</Label>
        <Input
          id={`${assignment.id}-title`}
          aria-invalid={Boolean(errors.title)}
          {...register('title', { required: 'Title is required' })}
        />
        <FieldError>{errors.title?.message}</FieldError>
      </div>

      <div>
        <Label htmlFor={`${assignment.id}-objective`}>Objective</Label>
        <Textarea
          id={`${assignment.id}-objective`}
          aria-invalid={Boolean(errors.objective)}
          {...register('objective', { required: 'Objective is required' })}
        />
        <FieldError>{errors.objective?.message}</FieldError>
      </div>

      <div>
        <Label htmlFor={`${assignment.id}-context`}>Business Context</Label>
        <Textarea id={`${assignment.id}-context`} rows={4} {...register('businessContext')} />
      </div>

      <div>
        <Label htmlFor={`${assignment.id}-requirements`}>Requirements (one per line)</Label>
        <Textarea id={`${assignment.id}-requirements`} rows={5} {...register('requirements')} />
      </div>

      <div>
        <Label htmlFor={`${assignment.id}-deliverables`}>Deliverables (one per line)</Label>
        <Textarea id={`${assignment.id}-deliverables`} rows={4} {...register('deliverables')} />
      </div>

      <div>
        <Label htmlFor={`${assignment.id}-instructions`}>Submission Instructions</Label>
        <Textarea id={`${assignment.id}-instructions`} rows={3} {...register('submissionInstructions')} />
      </div>

      <div>
        <Label htmlFor={`${assignment.id}-criteria`}>Evaluation Criteria (one per line)</Label>
        <Textarea id={`${assignment.id}-criteria`} rows={4} {...register('evaluationCriteria')} />
      </div>

      <div className="flex items-center gap-3 border-t border-line pt-4">
        <Button type="submit" disabled={updateAssignment.isPending}>
          {updateAssignment.isPending ? 'Saving…' : 'Save Assignment'}
        </Button>
        {showSaved && <span className="text-sm font-medium text-success-700">Saved</span>}
        {updateAssignment.isError && (
          <span className="text-sm font-medium text-danger-600">
            {updateAssignment.error instanceof Error ? updateAssignment.error.message : 'Unable to save assignment.'}
          </span>
        )}
      </div>
      </fieldset>
    </form>
  )
}
