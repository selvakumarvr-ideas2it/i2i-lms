/**
 * Composition root. This is the ONLY file that would need to change to swap Azure
 * Table/Blob Storage for PostgreSQL or Cosmos DB later — write new classes that
 * implement the interfaces in ./repositories/interfaces.ts and swap the `repositories`
 * object below. Nothing in ./services/*.ts or ./functions/*.ts needs to change.
 */
import { createTableProgressRepository } from './repositories/table/progressRepository'
import { createTableQuizAttemptRepository } from './repositories/table/quizAttemptRepository'
import { createTableGithubSubmissionRepository } from './repositories/table/githubSubmissionRepository'
import { createTableAssignmentSubmissionRepository } from './repositories/table/assignmentSubmissionRepository'
import { createTableEvaluationRepository } from './repositories/table/evaluationRepository'
import { createTableActivityRepository } from './repositories/table/activityRepository'
import { createTableNotificationRepository } from './repositories/table/notificationRepository'
import { createTableUserRepository } from './repositories/table/userRepository'
import { createBlobCourseContentRepository } from './repositories/blob/courseContentRepository'
import { createBlobSettingsRepository } from './repositories/blob/settingsRepository'

import { createProgressService } from './services/progressService'
import { createQuizService } from './services/quizService'
import { createCourseService } from './services/courseService'
import { createSubmissionService } from './services/submissionService'
import { createAssignmentService } from './services/assignmentService'
import { createActivityService } from './services/activityService'
import { createNotificationService } from './services/notificationService'
import { createUserService } from './services/userService'
import { createAdminService } from './services/adminService'
import { createSearchService } from './services/searchService'

import type { Repositories } from './repositories/interfaces'

const repositories: Repositories = {
  progress: createTableProgressRepository(),
  quizAttempts: createTableQuizAttemptRepository(),
  githubSubmissions: createTableGithubSubmissionRepository(),
  assignmentSubmissions: createTableAssignmentSubmissionRepository(),
  evaluations: createTableEvaluationRepository(),
  activity: createTableActivityRepository(),
  notifications: createTableNotificationRepository(),
  users: createTableUserRepository(),
  courseContent: createBlobCourseContentRepository(),
  settings: createBlobSettingsRepository(),
}

const progress = createProgressService(repositories)
const quiz = createQuizService(repositories, progress)
const course = createCourseService(repositories)
const submission = createSubmissionService(repositories)
const assignment = createAssignmentService(repositories)
const activity = createActivityService(repositories)
const notification = createNotificationService(repositories)
const user = createUserService(repositories)
const admin = createAdminService(repositories, progress)
const search = createSearchService(repositories)

export const container = {
  repositories,
  services: {
    progress,
    quiz,
    course,
    submission,
    assignment,
    activity,
    notification,
    user,
    admin,
    search,
  },
}
