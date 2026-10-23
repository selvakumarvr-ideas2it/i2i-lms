import type { SubmissionStatus } from './submission'

export interface Assignment {
  id: string
  dayId: string
  title: string
  objective: string
  businessContext: string
  requirements: string[]
  deliverables: string[]
  submissionInstructions: string
  evaluationCriteria: string[]
}

export interface AssignmentSubmission {
  id: string
  assignmentId: string
  traineeId: string
  notes: string
  githubRepoUrl: string
  submittedAt: string
  status: SubmissionStatus
  score: number | null
  maxScore: number
  feedback: string | null
  evaluatedAt: string | null
}
