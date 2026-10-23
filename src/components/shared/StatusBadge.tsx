import { Badge } from '@/components/ui/Badge'
import type { OverallStatus } from '@/domain/progress'
import type { SubmissionStatus } from '@/domain/submission'

const SUBMISSION_STATUS_LABEL: Record<SubmissionStatus, string> = {
  NOT_SUBMITTED: 'Not Submitted',
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  PASSED: 'Passed',
  NEEDS_IMPROVEMENT: 'Needs Improvement',
}

const SUBMISSION_STATUS_TONE: Record<SubmissionStatus, 'neutral' | 'info' | 'success' | 'warning'> = {
  NOT_SUBMITTED: 'neutral',
  SUBMITTED: 'info',
  UNDER_REVIEW: 'warning',
  PASSED: 'success',
  NEEDS_IMPROVEMENT: 'warning',
}

export function SubmissionStatusBadge({ status }: { status: SubmissionStatus }) {
  return <Badge tone={SUBMISSION_STATUS_TONE[status]}>{SUBMISSION_STATUS_LABEL[status]}</Badge>
}

const OVERALL_STATUS_LABEL: Record<OverallStatus, string> = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
}

const OVERALL_STATUS_TONE: Record<OverallStatus, 'neutral' | 'brand' | 'success'> = {
  NOT_STARTED: 'neutral',
  IN_PROGRESS: 'brand',
  COMPLETED: 'success',
}

export function OverallStatusBadge({ status }: { status: OverallStatus }) {
  return <Badge tone={OVERALL_STATUS_TONE[status]}>{OVERALL_STATUS_LABEL[status]}</Badge>
}
