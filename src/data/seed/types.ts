import type { Admin, Trainee } from '@/domain/user'
import type { Course, CourseModule, LearningDay, StudyMaterial, Exercise, Capstone } from '@/domain/course'
import type { Quiz, QuizAttempt } from '@/domain/quiz'
import type { Assignment, AssignmentSubmission } from '@/domain/assignment'
import type { GithubSubmission } from '@/domain/submission'
import type { Evaluation } from '@/domain/evaluation'
import type { LearningProgress, AtRiskThresholds } from '@/domain/progress'
import type { ActivityEvent } from '@/domain/activity'
import type { Notification } from '@/domain/notification'

export interface SeedDatabase {
  course: Course
  modules: CourseModule[]
  days: LearningDay[]
  studyMaterials: StudyMaterial[]
  exercises: Exercise[]
  quizzes: Quiz[]
  assignments: Assignment[]
  capstones: Capstone[]
  users: Array<Admin | Trainee>
  progress: LearningProgress[]
  quizAttempts: QuizAttempt[]
  githubSubmissions: GithubSubmission[]
  assignmentSubmissions: AssignmentSubmission[]
  evaluations: Evaluation[]
  activity: ActivityEvent[]
  notifications: Notification[]
  atRiskThresholds: AtRiskThresholds
}

export interface GeneratedProgressData {
  progress: LearningProgress[]
  quizAttempts: QuizAttempt[]
  githubSubmissions: GithubSubmission[]
  assignmentSubmissions: AssignmentSubmission[]
  evaluations: Evaluation[]
  activity: ActivityEvent[]
  notifications: Notification[]
}
