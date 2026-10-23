import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '@/auth/AuthContext'
import { cn, formatScheduledDate } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Button, buttonVariants } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { ErrorState, LoadingState } from '@/components/shared/States'
import { useAssignmentQuery, useDayQuery, useExerciseQuery, useStudyMaterialQuery } from '@/hooks/useCourse'
import { useSetDayPublished } from '@/hooks/useCourseAdmin'
import { ROUTES } from '@/routes'
import { DayDetailsTab } from './DayDetailsTab'
import { StudyMaterialTab } from './StudyMaterialTab'
import { ExerciseTab } from './ExerciseTab'
import { AssignmentTab } from './AssignmentTab'

export function CourseDayAdminPage() {
  const { user } = useAuth()
  const isReadOnly = user?.role === 'MANAGER'
  const { id } = useParams<{ id: string }>()
  const dayQuery = useDayQuery(id)
  const day = dayQuery.data

  const studyMaterialQuery = useStudyMaterialQuery(day?.studyMaterialId)
  const exerciseQuery = useExerciseQuery(day?.exerciseId)
  const assignmentQuery = useAssignmentQuery(day?.assignmentId)
  const setPublished = useSetDayPublished()

  if (!id) return <ErrorState message="No learning day was specified." />

  if (dayQuery.isLoading) return <LoadingState label="Loading day…" />

  if (dayQuery.isError || !day) {
    return (
      <ErrorState
        message={dayQuery.error instanceof Error ? dayQuery.error.message : 'This learning day could not be found.'}
        onRetry={() => dayQuery.refetch()}
      />
    )
  }

  const hasAssignment = Boolean(day.assignmentId)
  const contentLoading = studyMaterialQuery.isLoading || exerciseQuery.isLoading || (hasAssignment && assignmentQuery.isLoading)
  const contentError = studyMaterialQuery.error ?? exerciseQuery.error ?? (hasAssignment ? assignmentQuery.error : null)

  return (
    <div className="space-y-6">
      <Link to={ROUTES.adminCourse} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Back to Course
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
            Day {day.dayNumber} · Week {day.weekNumber}
            {day.scheduledDate && <span className="normal-case text-muted"> · {formatScheduledDate(day.scheduledDate)}</span>}
          </p>
          <h1 className="mt-1 text-2xl font-bold text-ink">{day.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={day.isPublished ? 'success' : 'warning'}>{day.isPublished ? 'Published' : 'Draft'}</Badge>
          {!isReadOnly && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={setPublished.isPending}
              onClick={() => setPublished.mutate({ id: day.id, isPublished: !day.isPublished })}
            >
              {day.isPublished ? 'Unpublish' : 'Publish'}
            </Button>
          )}
        </div>
      </div>

      {contentLoading && <LoadingState label="Loading day content…" />}

      {!contentLoading && contentError && (
        <ErrorState message={contentError instanceof Error ? contentError.message : 'Unable to load day content.'} />
      )}

      {!contentLoading && !contentError && (
        <Card>
          <CardContent className="pt-5">
            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Day Details</TabsTrigger>
                <TabsTrigger value="study">Study Material</TabsTrigger>
                <TabsTrigger value="exercise">Exercise</TabsTrigger>
                <TabsTrigger value="quiz">Quiz</TabsTrigger>
                {hasAssignment && <TabsTrigger value="assignment">Assignment</TabsTrigger>}
              </TabsList>

              <TabsContent value="details">
                <DayDetailsTab key={day.id} day={day} />
              </TabsContent>

              <TabsContent value="study">
                {studyMaterialQuery.data && (
                  <StudyMaterialTab key={studyMaterialQuery.data.id} studyMaterial={studyMaterialQuery.data} />
                )}
              </TabsContent>

              <TabsContent value="exercise">
                {exerciseQuery.data && <ExerciseTab key={exerciseQuery.data.id} exercise={exerciseQuery.data} />}
              </TabsContent>

              <TabsContent value="quiz">
                <div className="space-y-3 rounded-lg border border-dashed border-line p-6 text-center">
                  <p className="text-sm text-muted">
                    Quiz questions for this day are managed from the dedicated Quiz Management page.
                  </p>
                  <Link to={ROUTES.adminQuizzes} className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }))}>
                    Manage this day's quiz
                  </Link>
                </div>
              </TabsContent>

              {hasAssignment && (
                <TabsContent value="assignment">
                  {assignmentQuery.data && <AssignmentTab key={assignmentQuery.data.id} assignment={assignmentQuery.data} />}
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
