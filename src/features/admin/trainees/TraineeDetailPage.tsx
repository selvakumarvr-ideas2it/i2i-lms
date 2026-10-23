import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { format } from 'date-fns'
import { AlertTriangle } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { EmptyState, ErrorState, LoadingState } from '@/components/shared/States'
import { useTraineeDetail } from '@/hooks/useAdmin'
import { useAssignmentsQuery, useDaysQuery, useQuizzesQuery } from '@/hooks/useCourse'
import {
  ActivityTab,
  AssignmentsTab,
  DailyProgressTab,
  FeedbackTab,
  GithubSubmissionsTab,
  QuizScoresTab,
} from './TraineeDetailTabs'

export function TraineeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: detail, isLoading, isError, error, refetch } = useTraineeDetail(id)
  const daysQuery = useDaysQuery()
  const quizzesQuery = useQuizzesQuery()
  const assignmentsQuery = useAssignmentsQuery()

  const dayById = useMemo(() => new Map((daysQuery.data ?? []).map((day) => [day.id, day])), [daysQuery.data])
  const quizTitleById = useMemo(
    () => new Map((quizzesQuery.data ?? []).map((quiz) => [quiz.id, quiz.title])),
    [quizzesQuery.data],
  )
  const assignmentTitleById = useMemo(
    () => new Map((assignmentsQuery.data ?? []).map((assignment) => [assignment.id, assignment.title])),
    [assignmentsQuery.data],
  )

  if (isLoading) return <LoadingState label="Loading trainee…" />
  if (isError) {
    return (
      <ErrorState message={error instanceof Error ? error.message : 'Unable to load this trainee.'} onRetry={() => refetch()} />
    )
  }
  if (!detail) {
    return <EmptyState title="Trainee not found" description="This trainee may have been removed or the link is incorrect." />
  }

  const { trainee, summary, progress, quizAttempts, githubSubmissions, assignmentSubmissions, evaluations, activity } = detail

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar initials={trainee.avatarInitials} className="h-14 w-14 text-lg" />
            <div>
              <h1 className="text-xl font-bold text-ink">{trainee.name}</h1>
              <p className="text-sm text-muted">{trainee.email}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted">
                <Badge tone="neutral">{trainee.cohort}</Badge>
                <span>Joined {format(new Date(trainee.joinedAt), 'MMM d, yyyy')}</span>
              </div>
            </div>
          </div>
          {summary.isAtRisk && (
            <div className="flex flex-col items-start gap-1.5 sm:items-end">
              <Badge tone="danger" className="gap-1">
                <AlertTriangle className="h-3 w-3" aria-hidden /> At Risk
              </Badge>
              <ul className="text-xs text-danger-600">
                {summary.atRiskReasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Course Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium text-ink">Overall Completion</span>
              <span className="font-semibold text-ink">{summary.overallCompletionPercent}%</span>
            </div>
            <ProgressBar value={summary.overallCompletionPercent} />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-xs font-medium text-muted">Quiz Average</p>
              <p className="text-lg font-bold text-ink">{summary.quizAveragePercent}%</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted">Assignments</p>
              <p className="text-lg font-bold text-ink">
                {summary.assignmentsCompleted}/{summary.assignmentsTotal}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted">Exercises</p>
              <p className="text-lg font-bold text-ink">
                {summary.exercisesCompleted}/{summary.exercisesTotal}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted">Days Completed</p>
              <p className="text-lg font-bold text-ink">
                {summary.daysCompleted}/{summary.totalDays}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="daily-progress">
        <TabsList className="flex-wrap">
          <TabsTrigger value="daily-progress">Daily Progress</TabsTrigger>
          <TabsTrigger value="quiz-scores">Quiz Scores</TabsTrigger>
          <TabsTrigger value="github">GitHub Submissions</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="feedback">Trainer Feedback</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="daily-progress">
          <DailyProgressTab progress={progress} dayById={dayById} />
        </TabsContent>
        <TabsContent value="quiz-scores">
          <QuizScoresTab attempts={quizAttempts} quizTitleById={quizTitleById} />
        </TabsContent>
        <TabsContent value="github">
          <GithubSubmissionsTab submissions={githubSubmissions} />
        </TabsContent>
        <TabsContent value="assignments">
          <AssignmentsTab submissions={assignmentSubmissions} assignmentTitleById={assignmentTitleById} />
        </TabsContent>
        <TabsContent value="feedback">
          <FeedbackTab evaluations={evaluations} dayById={dayById} />
        </TabsContent>
        <TabsContent value="activity">
          <ActivityTab activity={activity} dayById={dayById} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
