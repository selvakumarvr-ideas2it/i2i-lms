export type OverallStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'

export interface LearningProgress {
  traineeId: string
  dayId: string
  studyCompleted: boolean
  exerciseStarted: boolean
  exerciseCompleted: boolean
  quizCompleted: boolean
  quizScorePercent: number | null
  quizAttempts: number
  githubSubmitted: boolean
  assignmentSubmitted: boolean
  lastUpdatedAt: string
}

export interface DerivedDayProgress extends LearningProgress {
  overallStatus: OverallStatus
  completionPercent: number
}

export interface TraineeSummary {
  traineeId: string
  overallCompletionPercent: number
  quizAveragePercent: number
  assignmentsCompleted: number
  assignmentsTotal: number
  exercisesCompleted: number
  exercisesTotal: number
  daysCompleted: number
  totalDays: number
  lastActiveAt: string | null
  isAtRisk: boolean
  atRiskReasons: string[]
}

export interface AtRiskThresholds {
  minProgressPercent: number
  inactivityDays: number
  minQuizAveragePercent: number
  maxOverdueAssignments: number
  /** No at-risk reasons are ever computed until a trainee has been enrolled this many days. */
  gracePeriodDays: number
  /** ISO date the cohort's training starts — the grace period is measured from whichever is later, this or the trainee's own joinedAt. Null = grace period is measured from joinedAt alone. */
  courseStartDate: string | null
}
