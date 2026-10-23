import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { MarkdownContent } from '@/components/shared/MarkdownContent'
import { ErrorState, LoadingState } from '@/components/shared/States'
import { useStudyMaterialQuery } from '@/hooks/useCourse'
import { useDerivedProgress, useMarkStudyComplete } from '@/hooks/useProgress'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/routes'

export function StudyMaterialPage() {
  const { user } = useAuth()
  const { id } = useParams<{ id: string }>()

  const studyQuery = useStudyMaterialQuery(id)
  const derivedQuery = useDerivedProgress(user?.id)
  const markComplete = useMarkStudyComplete(user?.id ?? '')

  if (!user) return null

  if (studyQuery.isLoading) {
    return <LoadingState label="Loading study material…" />
  }

  if (studyQuery.error) {
    return (
      <ErrorState
        message={studyQuery.error instanceof Error ? studyQuery.error.message : 'Failed to load study material'}
        onRetry={() => void studyQuery.refetch()}
      />
    )
  }

  const study = studyQuery.data
  if (!study) {
    return <ErrorState message="This study material could not be found." />
  }

  const dayProgress = (derivedQuery.data ?? []).find((d) => d.dayId === study.dayId)
  const isCompleted = dayProgress?.studyCompleted ?? false

  return (
    <div className="space-y-6">
      <Link
        to={ROUTES.learningDay(study.dayId)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to Day
      </Link>

      <h1 className="text-2xl font-bold text-ink">{study.title}</h1>

      <Card>
        <CardContent className="pt-6">
          <MarkdownContent markdown={study.markdownContent} />
        </CardContent>
      </Card>

      {study.resources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {study.resources.map((resource) => (
                <li key={resource.url}>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden />
                    {resource.label}
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end pb-2">
        <Button
          size="lg"
          variant={isCompleted ? 'secondary' : 'primary'}
          disabled={isCompleted || markComplete.isPending}
          onClick={() => markComplete.mutate(study.dayId)}
          className={cn(isCompleted && 'border-success-500/40 bg-success-50 text-success-700 hover:bg-success-50')}
        >
          {isCompleted ? 'Completed ✓' : markComplete.isPending ? 'Marking…' : 'Mark as Complete'}
        </Button>
      </div>
    </div>
  )
}
