/**
 * One-time (or repeatable) seeding of a realistic demo cohort into Table Storage —
 * reuses the exact same 8-trainee deterministic progress generator built for the
 * original mock/localStorage app (../../src/data/seed/progressGenerator.ts), so the
 * demo data (100/92/84/76/65/52/38/20% progress tiers, at-risk trainees, etc.) is
 * identical to what the app used to seed into localStorage. Also seeds the admin user
 * itself into the Users table (id/email `powerbi.admin@ideas2it.com` per
 * users.seed.ts) — see api/src/services/userService.ts for the login-by-email model
 * this feeds. Run with `npm run seed:demo` from api/ (run `npm run seed:course` first).
 *
 * Writes run with bounded concurrency (not one-at-a-time, not all-at-once) since
 * against a real Azure Table Storage endpoint each write is a network round trip —
 * ~1,100 of them sequentially can take several minutes and, worse, produce zero
 * output in between, which reads as "hung" (and can trip an idle-session disconnect
 * in environments like Azure Cloud Shell). This logs progress per collection instead.
 */
import { createTableUserRepository } from '../src/repositories/table/userRepository'
import { DEFAULT_PASSWORD } from '../src/auth/password'
import { createTableProgressRepository } from '../src/repositories/table/progressRepository'
import { createTableQuizAttemptRepository } from '../src/repositories/table/quizAttemptRepository'
import { createTableGithubSubmissionRepository } from '../src/repositories/table/githubSubmissionRepository'
import { createTableAssignmentSubmissionRepository } from '../src/repositories/table/assignmentSubmissionRepository'
import { createTableEvaluationRepository } from '../src/repositories/table/evaluationRepository'
import { createTableActivityRepository } from '../src/repositories/table/activityRepository'
import { createTableNotificationRepository } from '../src/repositories/table/notificationRepository'
import { ADMIN_USER, TRAINEES } from '../../src/data/seed/users.seed'
import { DAYS, ASSIGNMENTS } from '../../src/data/seed/course.seed'
import { QUIZZES } from '../../src/data/seed/quiz.seed'
import { generateProgressData } from '../../src/data/seed/progressGenerator'

const CONCURRENCY = 16

/** Runs `fn` over every item with at most `CONCURRENCY` in flight, logging as it goes. */
async function seedCollection<T>(label: string, items: T[], fn: (item: T) => Promise<unknown>): Promise<void> {
  if (items.length === 0) {
    console.log(`  ${label}: nothing to seed`)
    return
  }

  const startedAt = Date.now()
  let completed = 0
  let nextIndex = 0

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex++
      await fn(items[index]!)
      completed++
      if (completed % 25 === 0 || completed === items.length) {
        process.stdout.write(`\r  ${label}: ${completed}/${items.length}`)
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, items.length) }, worker))
  const seconds = ((Date.now() - startedAt) / 1000).toFixed(1)
  process.stdout.write(`\r  ${label}: ${items.length}/${items.length} done in ${seconds}s\n`)
}

async function main() {
  console.log(`Seeding demo cohort as of admin "${ADMIN_USER.email}"...`)
  console.log(`Every seeded user (admin + trainees) gets the default password "${DEFAULT_PASSWORD}" unless they already have one — see api/src/auth/password.ts.`)

  const users = createTableUserRepository()
  await seedCollection('Users', [ADMIN_USER, ...TRAINEES], (user) => users.upsert(user))

  const generated = generateProgressData({
    trainees: TRAINEES,
    days: DAYS,
    quizzes: QUIZZES,
    assignments: ASSIGNMENTS,
    adminId: ADMIN_USER.id,
  })

  const progress = createTableProgressRepository()
  await seedCollection('Progress', generated.progress, (row) => progress.upsert(row.traineeId, row.dayId, row))

  const quizAttempts = createTableQuizAttemptRepository()
  await seedCollection('QuizAttempts', generated.quizAttempts, (attempt) => quizAttempts.create(attempt))

  const githubSubmissions = createTableGithubSubmissionRepository()
  await seedCollection('GithubSubmissions', generated.githubSubmissions, (submission) => githubSubmissions.upsert(submission))

  const assignmentSubmissions = createTableAssignmentSubmissionRepository()
  await seedCollection('AssignmentSubmissions', generated.assignmentSubmissions, (submission) => assignmentSubmissions.upsert(submission))

  const evaluations = createTableEvaluationRepository()
  await seedCollection('Evaluations', generated.evaluations, (evaluation) => evaluations.create(evaluation))

  const activity = createTableActivityRepository()
  await seedCollection('Activity', generated.activity, (event) => activity.append(event))

  const notifications = createTableNotificationRepository()
  await seedCollection('Notifications', generated.notifications, (notification) => notifications.create(notification))

  console.log(`\nSeeded ${TRAINEES.length} trainees:`)
  console.log(`  ${generated.progress.length} progress rows, ${generated.quizAttempts.length} quiz attempts,`)
  console.log(`  ${generated.githubSubmissions.length} GitHub submissions, ${generated.assignmentSubmissions.length} assignment submissions,`)
  console.log(`  ${generated.evaluations.length} evaluations, ${generated.activity.length} activity events, ${generated.notifications.length} notifications.`)
}

main().catch((err) => {
  console.error('\nSeeding demo trainees failed:', err)
  process.exitCode = 1
})
