import { format } from 'date-fns'
import { CheckCircle2, ExternalLink, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@/components/ui/Table'
import { EmptyState } from '@/components/shared/States'
import { OverallStatusBadge, SubmissionStatusBadge } from '@/components/shared/StatusBadge'
import type { DerivedDayProgress } from '@/domain/progress'
import type { QuizAttempt } from '@/domain/quiz'
import type { GithubSubmission } from '@/domain/submission'
import type { AssignmentSubmission } from '@/domain/assignment'
import type { Evaluation } from '@/domain/evaluation'
import type { ActivityEvent, ActivityEventType } from '@/domain/activity'
import type { LearningDay } from '@/domain/course'

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return format(new Date(iso), 'MMM d, yyyy')
}

export function DailyProgressTab({ progress, dayById }: { progress: DerivedDayProgress[]; dayById: Map<string, LearningDay> }) {
  if (progress.length === 0) {
    return <EmptyState title="No progress recorded yet" description="This trainee hasn't started any learning days." />
  }

  const sorted = [...progress].sort((a, b) => (dayById.get(a.dayId)?.dayNumber ?? 0) - (dayById.get(b.dayId)?.dayNumber ?? 0))

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Day</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell>Completion</TableHeaderCell>
          <TableHeaderCell>Quiz Score</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sorted.map((day) => {
          const learningDay = dayById.get(day.dayId)
          return (
            <TableRow key={day.dayId}>
              <TableCell className="font-medium text-ink">
                {learningDay ? `Day ${learningDay.dayNumber} — ${learningDay.title}` : day.dayId}
              </TableCell>
              <TableCell>
                <OverallStatusBadge status={day.overallStatus} />
              </TableCell>
              <TableCell>{day.completionPercent}%</TableCell>
              <TableCell>{day.quizScorePercent != null ? `${day.quizScorePercent}%` : '—'}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export function QuizScoresTab({ attempts, quizTitleById }: { attempts: QuizAttempt[]; quizTitleById: Map<string, string> }) {
  if (attempts.length === 0) {
    return <EmptyState title="No quiz attempts yet" description="This trainee hasn't attempted any quizzes." />
  }

  const sorted = [...attempts].sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Quiz</TableHeaderCell>
          <TableHeaderCell>Attempt</TableHeaderCell>
          <TableHeaderCell>Score</TableHeaderCell>
          <TableHeaderCell>Result</TableHeaderCell>
          <TableHeaderCell>Date</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sorted.map((attempt) => (
          <TableRow key={attempt.id}>
            <TableCell className="font-medium text-ink">{quizTitleById.get(attempt.quizId) ?? attempt.quizId}</TableCell>
            <TableCell>#{attempt.attemptNumber}</TableCell>
            <TableCell>
              {attempt.correctCount}/{attempt.totalQuestions} ({attempt.scorePercent}%)
            </TableCell>
            <TableCell>
              {attempt.passed ? (
                <Badge tone="success" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" aria-hidden /> Passed
                </Badge>
              ) : (
                <Badge tone="danger" className="gap-1">
                  <XCircle className="h-3 w-3" aria-hidden /> Failed
                </Badge>
              )}
            </TableCell>
            <TableCell className="text-muted">{formatDate(attempt.completedAt ?? attempt.startedAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function GithubSubmissionsTab({ submissions }: { submissions: GithubSubmission[] }) {
  if (submissions.length === 0) {
    return <EmptyState title="No GitHub submissions yet" description="This trainee hasn't submitted any repository links." />
  }

  const sorted = [...submissions].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Context</TableHeaderCell>
          <TableHeaderCell>Repository</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell>Submitted</TableHeaderCell>
          <TableHeaderCell>Updated</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sorted.map((submission) => (
          <TableRow key={submission.id}>
            <TableCell className="font-medium text-ink">{submission.contextType}</TableCell>
            <TableCell>
              <a
                href={submission.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-medium text-brand-600 hover:underline"
              >
                {submission.branch || 'View repository'}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </a>
            </TableCell>
            <TableCell>
              <SubmissionStatusBadge status={submission.status} />
            </TableCell>
            <TableCell className="text-muted">{formatDate(submission.submittedAt)}</TableCell>
            <TableCell className="text-muted">{formatDate(submission.updatedAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function AssignmentsTab({
  submissions,
  assignmentTitleById,
}: {
  submissions: AssignmentSubmission[]
  assignmentTitleById: Map<string, string>
}) {
  if (submissions.length === 0) {
    return <EmptyState title="No assignment submissions yet" description="This trainee hasn't submitted any assignments." />
  }

  const sorted = [...submissions].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Assignment</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell>Score</TableHeaderCell>
          <TableHeaderCell>Feedback</TableHeaderCell>
          <TableHeaderCell>Submitted</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sorted.map((submission) => (
          <TableRow key={submission.id}>
            <TableCell className="font-medium text-ink">
              {assignmentTitleById.get(submission.assignmentId) ?? submission.assignmentId}
            </TableCell>
            <TableCell>
              <SubmissionStatusBadge status={submission.status} />
            </TableCell>
            <TableCell>{submission.score != null ? `${submission.score}/${submission.maxScore}` : '—'}</TableCell>
            <TableCell className="max-w-xs text-muted">{submission.feedback ?? '—'}</TableCell>
            <TableCell className="text-muted">{formatDate(submission.submittedAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function FeedbackTab({ evaluations, dayById }: { evaluations: Evaluation[]; dayById: Map<string, LearningDay> }) {
  if (evaluations.length === 0) {
    return <EmptyState title="No trainer feedback yet" description="No submissions have been evaluated for this trainee." />
  }

  const sorted = [...evaluations].sort((a, b) => new Date(b.evaluatedAt).getTime() - new Date(a.evaluatedAt).getTime())

  return (
    <ul className="space-y-3">
      {sorted.map((evaluation) => {
        const day = dayById.get(evaluation.dayId)
        return (
          <li key={evaluation.id} className="rounded-card border border-line p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-ink">
                  {evaluation.contextType} {day ? `— Day ${day.dayNumber}` : ''}
                </span>
                <SubmissionStatusBadge status={evaluation.status} />
              </div>
              <span className="text-xs text-muted">{formatDate(evaluation.evaluatedAt)}</span>
            </div>
            {evaluation.score != null && (
              <p className="mt-1 text-sm font-medium text-ink">
                Score: {evaluation.score}/{evaluation.maxScore}
              </p>
            )}
            {evaluation.feedback && <p className="mt-1 text-sm text-muted">{evaluation.feedback}</p>}
          </li>
        )
      })}
    </ul>
  )
}

const ACTIVITY_LABEL: Record<ActivityEventType, string> = {
  LOGIN: 'Logged in',
  STUDY_STARTED: 'Started study material',
  STUDY_COMPLETED: 'Completed study material',
  EXERCISE_STARTED: 'Started an exercise',
  EXERCISE_COMPLETED: 'Completed an exercise',
  QUIZ_STARTED: 'Started a quiz',
  QUIZ_COMPLETED: 'Completed a quiz',
  ASSIGNMENT_SUBMITTED: 'Submitted an assignment',
  GITHUB_SUBMITTED: 'Submitted a GitHub repository',
  EVALUATION_COMPLETED: 'Received trainer feedback',
  COURSE_COMPLETED: 'Completed the course',
}

export function ActivityTab({ activity, dayById }: { activity: ActivityEvent[]; dayById: Map<string, LearningDay> }) {
  if (activity.length === 0) {
    return <EmptyState title="No activity yet" description="This trainee has no recorded activity." />
  }

  return (
    <ol className="space-y-0">
      {activity.map((event, index) => {
        const day = event.dayId ? dayById.get(event.dayId) : undefined
        return (
          <li key={event.id} className="relative flex gap-3 pb-6 last:pb-0">
            {index !== activity.length - 1 && <span className="absolute left-[5px] top-3 h-full w-px bg-line" aria-hidden />}
            <span className="relative mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-brand-500" aria-hidden />
            <div>
              <p className="text-sm font-medium text-ink">
                {ACTIVITY_LABEL[event.type]}
                {day ? ` — Day ${day.dayNumber}` : ''}
              </p>
              <p className="text-xs text-muted">{format(new Date(event.timestamp), 'MMM d, yyyy p')}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
