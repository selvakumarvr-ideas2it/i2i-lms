import { useMemo, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { EmptyState, ErrorState, LoadingState } from '@/components/shared/States'
import { useAssignmentsQuery, useDaysQuery } from '@/hooks/useCourse'
import { AssignmentEditorPanel } from './AssignmentEditorPanel'

export function AssignmentManagementPage() {
  const assignmentsQuery = useAssignmentsQuery()
  const daysQuery = useDaysQuery()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const dayNumberByDayId = useMemo(() => {
    const map = new Map<string, number>()
    for (const day of daysQuery.data ?? []) map.set(day.id, day.dayNumber)
    return map
  }, [daysQuery.data])

  if (assignmentsQuery.isLoading || daysQuery.isLoading) return <LoadingState label="Loading assignments…" />

  if (assignmentsQuery.isError) {
    return (
      <ErrorState
        message={assignmentsQuery.error instanceof Error ? assignmentsQuery.error.message : 'Unable to load assignments.'}
        onRetry={() => assignmentsQuery.refetch()}
      />
    )
  }

  const assignments = [...(assignmentsQuery.data ?? [])].sort(
    (a, b) => (dayNumberByDayId.get(a.dayId) ?? 0) - (dayNumberByDayId.get(b.dayId) ?? 0),
  )

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Assignment Management</p>
        <h1 className="mt-1 text-2xl font-bold text-ink">Assignments</h1>
        <p className="mt-1 text-sm text-muted">
          Edit objectives, requirements, and evaluation criteria for each day's assignment.
        </p>
      </div>

      {assignments.length === 0 ? (
        <EmptyState title="No assignments found" description="Assignment content has not been seeded yet." />
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment) => {
            const isExpanded = expandedId === assignment.id
            const dayNumber = dayNumberByDayId.get(assignment.dayId)
            return (
              <Card key={assignment.id}>
                <CardHeader className="cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : assignment.id)}>
                  <div>
                    <CardTitle>
                      {dayNumber ? `Day ${dayNumber} · ` : ''}
                      {assignment.title}
                    </CardTitle>
                    <CardDescription>
                      {assignment.requirements.length} requirements · {assignment.deliverables.length} deliverables
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(event) => {
                      event.stopPropagation()
                      setExpandedId(isExpanded ? null : assignment.id)
                    }}
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CardHeader>
                {isExpanded && (
                  <CardContent>
                    <AssignmentEditorPanel assignment={assignment} />
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
