import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@/components/ui/Table'
import { EmptyState, ErrorState, LoadingState } from '@/components/shared/States'
import { useCourseQuery, useDaysQuery, courseKeys } from '@/hooks/useCourse'
import { useSetDayPublished } from '@/hooks/useCourseAdmin'
import { getModules } from '@/services/courseService'
import { formatScheduledDate } from '@/lib/utils'
import type { CourseModule, LearningDay } from '@/domain/course'
import { ROUTES } from '@/routes'

export function CourseAdminPage() {
  const courseQuery = useCourseQuery()
  const daysQuery = useDaysQuery()
  const modulesQuery = useQuery({ queryKey: courseKeys.modules, queryFn: getModules })

  const isLoading = courseQuery.isLoading || daysQuery.isLoading || modulesQuery.isLoading
  const error = courseQuery.error ?? daysQuery.error ?? modulesQuery.error

  if (isLoading) return <LoadingState label="Loading course structure…" />

  if (error) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : 'Unable to load the course structure.'}
        onRetry={() => {
          courseQuery.refetch()
          daysQuery.refetch()
          modulesQuery.refetch()
        }}
      />
    )
  }

  const course = courseQuery.data
  if (!course) return <ErrorState message="Course not found." />

  const days = daysQuery.data ?? []
  const modules = [...(modulesQuery.data ?? [])].sort((a, b) => a.weekNumber - b.weekNumber)
  const publishedDays = days.filter((day) => day.isPublished).length

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Course Administration</p>
          <h1 className="mt-1 text-2xl font-bold text-ink">{course.title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">{course.description}</p>
        </div>
        <Badge tone={course.isPublished ? 'success' : 'warning'}>{course.isPublished ? 'Published' : 'Draft'}</Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Total Days</p>
            <p className="mt-1 text-2xl font-bold text-ink">{course.totalDays}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Total Hours</p>
            <p className="mt-1 text-2xl font-bold text-ink">{course.totalHours}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Published Days</p>
            <p className="mt-1 text-2xl font-bold text-ink">
              {publishedDays} / {days.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {modules.length === 0 ? (
        <EmptyState title="No modules found" description="The course structure has not been seeded yet." />
      ) : (
        modules.map((module) => (
          <ModuleSection
            key={module.id}
            module={module}
            days={days.filter((day) => day.moduleId === module.id).sort((a, b) => a.dayNumber - b.dayNumber)}
          />
        ))
      )}
    </div>
  )
}

function ModuleSection({ module, days }: { module: CourseModule; days: LearningDay[] }) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>
            Week {module.weekNumber} · {module.title}
          </CardTitle>
          <CardDescription>
            {days.length} day{days.length === 1 ? '' : 's'}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Day</TableHeaderCell>
              <TableHeaderCell>Scheduled Date</TableHeaderCell>
              <TableHeaderCell>Title</TableHeaderCell>
              <TableHeaderCell>Theory / Lab Hrs</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {days.map((day) => (
              <DayRow key={day.id} day={day} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function DayRow({ day }: { day: LearningDay }) {
  const { user } = useAuth()
  const isReadOnly = user?.role === 'MANAGER'
  const setPublished = useSetDayPublished()

  return (
    <TableRow>
      <TableCell>Day {day.dayNumber}</TableCell>
      <TableCell className="text-muted">{formatScheduledDate(day.scheduledDate) || '—'}</TableCell>
      <TableCell>
        <Link to={ROUTES.adminCourseDay(day.id)} className="font-medium text-brand-600 hover:underline">
          {day.title}
        </Link>
      </TableCell>
      <TableCell>
        {day.theoryHours}h / {day.labHours}h
      </TableCell>
      <TableCell>
        <Badge tone={day.isPublished ? 'success' : 'warning'}>{day.isPublished ? 'Published' : 'Draft'}</Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
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
          <Link to={ROUTES.adminCourseDay(day.id)} className="text-sm font-medium text-brand-600 hover:underline">
            {isReadOnly ? 'View' : 'Edit'}
          </Link>
        </div>
      </TableCell>
    </TableRow>
  )
}
