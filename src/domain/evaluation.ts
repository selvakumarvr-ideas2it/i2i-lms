import type { SubmissionStatus } from './submission'

export type EvaluationContextType = 'EXERCISE' | 'ASSIGNMENT' | 'GITHUB' | 'CAPSTONE'

export interface Evaluation {
  id: string
  traineeId: string
  dayId: string
  contextType: EvaluationContextType
  contextId: string
  score: number | null
  maxScore: number
  status: SubmissionStatus
  feedback: string
  evaluatorId: string
  evaluatedAt: string
}
