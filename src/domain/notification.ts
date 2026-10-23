export type NotificationType =
  | 'QUIZ_AVAILABLE'
  | 'ASSIGNMENT_DUE'
  | 'ASSIGNMENT_EVALUATED'
  | 'FEEDBACK_AVAILABLE'
  | 'SUBMISSION_REVIEWED'
  | 'MILESTONE_COMPLETED'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  link: string | null
  isRead: boolean
  createdAt: string
}
