import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/auth/AuthContext'
import { Button } from '@/components/ui/Button'
import { FieldError, Input, Label, Textarea } from '@/components/ui/Input'
import { useUpdateDay } from '@/hooks/useCourseAdmin'
import type { LearningDay } from '@/domain/course'

interface DayDetailsFormValues {
  title: string
  description: string
  learningObjectives: string
  scheduledDate: string
}

export function DayDetailsTab({ day }: { day: LearningDay }) {
  const { user } = useAuth()
  const isReadOnly = user?.role === 'MANAGER'
  const updateDay = useUpdateDay()
  const [showSaved, setShowSaved] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DayDetailsFormValues>({
    defaultValues: {
      title: day.title,
      description: day.description,
      learningObjectives: day.learningObjectives.join('\n'),
      scheduledDate: day.scheduledDate ?? '',
    },
  })

  const onSubmit = (values: DayDetailsFormValues) => {
    updateDay.mutate(
      {
        id: day.id,
        patch: {
          title: values.title.trim(),
          description: values.description.trim(),
          learningObjectives: values.learningObjectives
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean),
          scheduledDate: values.scheduledDate.trim() || null,
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
          <Label htmlFor="day-scheduled-date">Scheduled Date</Label>
          <Input id="day-scheduled-date" type="date" {...register('scheduledDate')} />
        </div>

        <div>
          <Label htmlFor="day-title">Title</Label>
          <Input id="day-title" aria-invalid={Boolean(errors.title)} {...register('title', { required: 'Title is required' })} />
          <FieldError>{errors.title?.message}</FieldError>
        </div>

        <div>
          <Label htmlFor="day-description">Description</Label>
          <Textarea
            id="day-description"
            rows={4}
            aria-invalid={Boolean(errors.description)}
            {...register('description', { required: 'Description is required' })}
          />
          <FieldError>{errors.description?.message}</FieldError>
        </div>

        <div>
          <Label htmlFor="day-objectives">Learning Objectives (one per line)</Label>
          <Textarea id="day-objectives" rows={6} {...register('learningObjectives')} />
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={updateDay.isPending}>
            {updateDay.isPending ? 'Saving…' : 'Save Day Details'}
          </Button>
          {showSaved && <span className="text-sm font-medium text-success-700">Saved</span>}
          {updateDay.isError && (
            <span className="text-sm font-medium text-danger-600">
              {updateDay.error instanceof Error ? updateDay.error.message : 'Unable to save day details.'}
            </span>
          )}
        </div>
      </fieldset>
    </form>
  )
}
