export type SubmissionStatus =
  | 'NOT_SUBMITTED'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'PASSED'
  | 'NEEDS_IMPROVEMENT'

export type SubmissionContextType = 'EXERCISE' | 'ASSIGNMENT' | 'CAPSTONE'

export interface GithubSubmission {
  id: string
  traineeId: string
  contextType: SubmissionContextType
  contextId: string
  repoUrl: string
  branch: string
  commitOrPrUrl: string
  comments: string
  status: SubmissionStatus
  submittedAt: string
  updatedAt: string
}
