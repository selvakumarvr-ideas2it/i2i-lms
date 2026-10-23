import { useMemo, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { EmptyState, ErrorState, LoadingState } from '@/components/shared/States'
import { useDaysQuery, useQuizzesQuery } from '@/hooks/useCourse'
import { QuizEditorPanel } from './QuizEditorPanel'

export function QuizManagementPage() {
  const quizzesQuery = useQuizzesQuery()
  const daysQuery = useDaysQuery()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const dayNumberByDayId = useMemo(() => {
    const map = new Map<string, number>()
    for (const day of daysQuery.data ?? []) map.set(day.id, day.dayNumber)
    return map
  }, [daysQuery.data])

  if (quizzesQuery.isLoading || daysQuery.isLoading) return <LoadingState label="Loading quizzes…" />

  if (quizzesQuery.isError) {
    return (
      <ErrorState
        message={quizzesQuery.error instanceof Error ? quizzesQuery.error.message : 'Unable to load quizzes.'}
        onRetry={() => quizzesQuery.refetch()}
      />
    )
  }

  const quizzes = [...(quizzesQuery.data ?? [])].sort(
    (a, b) => (dayNumberByDayId.get(a.dayId) ?? 0) - (dayNumberByDayId.get(b.dayId) ?? 0),
  )

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Quiz Management</p>
        <h1 className="mt-1 text-2xl font-bold text-ink">Quizzes</h1>
        <p className="mt-1 text-sm text-muted">Edit questions, options, and scoring rules for each day's quiz.</p>
      </div>

      {quizzes.length === 0 ? (
        <EmptyState title="No quizzes found" description="Quiz content has not been seeded yet." />
      ) : (
        <div className="space-y-4">
          {quizzes.map((quiz) => {
            const isExpanded = expandedId === quiz.id
            return (
              <Card key={quiz.id}>
                <CardHeader className="cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : quiz.id)}>
                  <div>
                    <CardTitle>
                      Day {dayNumberByDayId.get(quiz.dayId) ?? '—'} · {quiz.title}
                    </CardTitle>
                    <CardDescription>
                      {quiz.questions.length} question{quiz.questions.length === 1 ? '' : 's'} · Passing score{' '}
                      {quiz.passingScorePercent}% · Max attempts {quiz.maxAttempts}
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(event) => {
                      event.stopPropagation()
                      setExpandedId(isExpanded ? null : quiz.id)
                    }}
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CardHeader>
                {isExpanded && (
                  <CardContent>
                    <QuizEditorPanel quiz={quiz} />
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
