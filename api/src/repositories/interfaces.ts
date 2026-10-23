/**
 * Repository ports. Every Azure Table/Blob implementation lives in ./table/*.ts or
 * ./blob/*.ts and is wired up in ../container.ts — that composition root is the ONLY
 * file that needs to change to swap Table Storage for PostgreSQL/Cosmos DB later.
 * Nothing in ../services/*.ts or ../functions/*.ts may import an Azure SDK directly.
 */
import type { Admin, Manager, Trainee } from '../../../src/domain/user'
import type {
  Capstone,
  Course,
  CourseModule,
  Exercise,
  LearningDay,
  StudyMaterial,
} from '../../../src/domain/course'
import type { Quiz, QuizAttempt } from '../../../src/domain/quiz'
import type { Assignment, AssignmentSubmission } from '../../../src/domain/assignment'
import type { GithubSubmission, SubmissionContextType } from '../../../src/domain/submission'
import type { Evaluation } from '../../../src/domain/evaluation'
import type { AtRiskThresholds, LearningProgress } from '../../../src/domain/progress'
import type { ActivityEvent, ActivityEventType } from '../../../src/domain/activity'
import type { Notification, NotificationType } from '../../../src/domain/notification'

export type UserRecord = Admin | Trainee | Manager

/**
 * The single source of truth for who can use the app and what role they have — see
 * docs/architecture.md's Auth section. Rows are added directly (seed script, Storage
 * Explorer, or `az storage entity insert`), not auto-provisioned on first login.
 */
export interface UserRepository {
  getByEmail(email: string): Promise<UserRecord | null>
  getById(id: string): Promise<UserRecord | null>
  list(): Promise<UserRecord[]>
  listTrainees(): Promise<Trainee[]>
  /** Preserves the existing stored password if the user already has one; otherwise sets it to DEFAULT_PASSWORD. */
  upsert(user: UserRecord): Promise<UserRecord>
  /** Checks email+password against the stored hash. Returns the safe UserRecord (no credential fields) on success. */
  verifyPassword(email: string, password: string): Promise<UserRecord | null>
  /** Replaces a user's stored password. Throws if the user doesn't exist. */
  setPassword(id: string, newPassword: string): Promise<void>
}

export interface ProgressRepository {
  getForTrainee(traineeId: string): Promise<LearningProgress[]>
  getOne(traineeId: string, dayId: string): Promise<LearningProgress | null>
  /** Upserts and keeps the ProgressByDay secondary index in sync. */
  upsert(traineeId: string, dayId: string, patch: Partial<LearningProgress>): Promise<LearningProgress>
  /** Backs cohort "daily completion" queries via the ProgressByDay index — no full table scan. */
  getAllForDay(dayId: string): Promise<LearningProgress[]>
}

export interface QuizAttemptRepository {
  listForTraineeQuiz(traineeId: string, quizId: string): Promise<QuizAttempt[]>
  create(attempt: QuizAttempt): Promise<QuizAttempt>
}

export interface GithubSubmissionRepository {
  get(traineeId: string, contextType: SubmissionContextType, contextId: string): Promise<GithubSubmission | null>
  listForTrainee(traineeId: string): Promise<GithubSubmission[]>
  listAll(): Promise<GithubSubmission[]>
  upsert(submission: GithubSubmission): Promise<GithubSubmission>
}

export interface AssignmentSubmissionRepository {
  get(traineeId: string, assignmentId: string): Promise<AssignmentSubmission | null>
  listForTrainee(traineeId: string): Promise<AssignmentSubmission[]>
  listAll(): Promise<AssignmentSubmission[]>
  upsert(submission: AssignmentSubmission): Promise<AssignmentSubmission>
}

export interface EvaluationRepository {
  create(evaluation: Evaluation): Promise<Evaluation>
  listForTrainee(traineeId: string): Promise<Evaluation[]>
}

export interface ActivityRepository {
  append(event: ActivityEvent): Promise<ActivityEvent>
  listForTrainee(traineeId: string, limit?: number): Promise<ActivityEvent[]>
}

export interface NotificationRepository {
  listForUser(userId: string): Promise<Notification[]>
  create(notification: Notification): Promise<Notification>
  markRead(id: string, userId: string): Promise<void>
  markAllRead(userId: string): Promise<void>
}

export interface CourseContentRepository {
  getCourse(): Promise<Course>
  getModules(): Promise<CourseModule[]>
  getDays(): Promise<LearningDay[]>
  getDay(id: string): Promise<LearningDay | null>
  updateDay(id: string, patch: Partial<LearningDay>): Promise<LearningDay>

  getStudyMaterials(): Promise<StudyMaterial[]>
  getStudyMaterial(id: string): Promise<StudyMaterial | null>
  updateStudyMaterial(id: string, patch: Partial<StudyMaterial>): Promise<StudyMaterial>

  getExercises(): Promise<Exercise[]>
  getExercise(id: string): Promise<Exercise | null>
  updateExercise(id: string, patch: Partial<Exercise>): Promise<Exercise>

  getQuizzes(): Promise<Quiz[]>
  getQuiz(id: string): Promise<Quiz | null>
  updateQuiz(id: string, patch: Partial<Quiz>): Promise<Quiz>

  getAssignments(): Promise<Assignment[]>
  getAssignment(id: string): Promise<Assignment | null>
  updateAssignment(id: string, patch: Partial<Assignment>): Promise<Assignment>

  getCapstones(): Promise<Capstone[]>
}

export interface SettingsRepository {
  getAtRiskThresholds(): Promise<AtRiskThresholds>
  setAtRiskThresholds(thresholds: AtRiskThresholds): Promise<AtRiskThresholds>
}

export interface Repositories {
  users: UserRepository
  progress: ProgressRepository
  quizAttempts: QuizAttemptRepository
  githubSubmissions: GithubSubmissionRepository
  assignmentSubmissions: AssignmentSubmissionRepository
  evaluations: EvaluationRepository
  activity: ActivityRepository
  notifications: NotificationRepository
  courseContent: CourseContentRepository
  settings: SettingsRepository
}

export type { ActivityEventType, NotificationType, Admin, Trainee, Manager }
