export type ActivityEventType =
  | 'LOGIN'
  | 'STUDY_STARTED'
  | 'STUDY_COMPLETED'
  | 'EXERCISE_STARTED'
  | 'EXERCISE_COMPLETED'
  | 'QUIZ_STARTED'
  | 'QUIZ_COMPLETED'
  | 'ASSIGNMENT_SUBMITTED'
  | 'GITHUB_SUBMITTED'
  | 'EVALUATION_COMPLETED'
  | 'COURSE_COMPLETED'

export interface ActivityEvent {
  id: string
  traineeId: string
  type: ActivityEventType
  dayId: string | null
  metadata: Record<string, string | number | boolean> | null
  timestamp: string
}
