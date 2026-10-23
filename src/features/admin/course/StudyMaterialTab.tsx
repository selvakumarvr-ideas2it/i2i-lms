import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import { useAuth } from '@/auth/AuthContext'
import { Button } from '@/components/ui/Button'
import { FieldError, Input, Label, Textarea } from '@/components/ui/Input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { MarkdownContent } from '@/components/shared/MarkdownContent'
import { useUpdateStudyMaterial } from '@/hooks/useCourseAdmin'
import type { StudyMaterial } from '@/domain/course'

interface StudyMaterialFormValues {
  title: string
  markdownContent: string
  resources: { label: string; url: string }[]
}

export function StudyMaterialTab({ studyMaterial }: { studyMaterial: StudyMaterial }) {
  const { user } = useAuth()
  const isReadOnly = user?.role === 'MANAGER'
  const updateStudyMaterial = useUpdateStudyMaterial()
  const [showSaved, setShowSaved] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<StudyMaterialFormValues>({
    defaultValues: {
      title: studyMaterial.title,
      markdownContent: studyMaterial.markdownContent,
      resources: studyMaterial.resources,
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'resources' })
  const markdownPreview = watch('markdownContent')

  const onSubmit = (values: StudyMaterialFormValues) => {
    updateStudyMaterial.mutate(
      {
        id: studyMaterial.id,
        patch: {
          title: values.title.trim(),
          markdownContent: values.markdownContent,
          resources: values.resources
            .map((resource) => ({ label: resource.label.trim(), url: resource.url.trim() }))
            .filter((resource) => resource.label && resource.url),
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
        <Label htmlFor="study-title">Title</Label>
        <Input id="study-title" aria-invalid={Boolean(errors.title)} {...register('title', { required: 'Title is required' })} />
        <FieldError>{errors.title?.message}</FieldError>
      </div>

      <div>
        <Label>Markdown Content</Label>
        <Tabs defaultValue="edit">
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="edit">
            <Textarea rows={16} className="font-mono text-xs" {...register('markdownContent')} />
          </TabsContent>
          <TabsContent value="preview">
            <div className="rounded-lg border border-line bg-white p-4">
              <MarkdownContent markdown={markdownPreview || '*Nothing to preview yet.*'} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <Label className="mb-0">Resources</Label>
          <Button type="button" variant="secondary" size="sm" onClick={() => append({ label: '', url: '' })}>
            <Plus className="h-3.5 w-3.5" /> Add Resource
          </Button>
        </div>
        <div className="space-y-2">
          {fields.length === 0 && <p className="text-sm text-muted">No resources added.</p>}
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <Input placeholder="Label" {...register(`resources.${index}.label` as const)} />
              <Input placeholder="https://…" {...register(`resources.${index}.url` as const)} />
              <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} aria-label="Remove resource">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={updateStudyMaterial.isPending}>
          {updateStudyMaterial.isPending ? 'Saving…' : 'Save Study Material'}
        </Button>
        {showSaved && <span className="text-sm font-medium text-success-700">Saved</span>}
        {updateStudyMaterial.isError && (
          <span className="text-sm font-medium text-danger-600">
            {updateStudyMaterial.error instanceof Error ? updateStudyMaterial.error.message : 'Unable to save study material.'}
          </span>
        )}
      </div>
      </fieldset>
    </form>
  )
}
