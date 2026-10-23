import { createSeededRng, rngInt } from '@/lib/seededRng'
import type { Trainee } from '@/domain/user'
import type { LearningDay } from '@/domain/course'
import type { Quiz, QuizAttempt, QuizAnswer } from '@/domain/quiz'
import type { Assignment, AssignmentSubmission } from '@/domain/assignment'
import type { GithubSubmission, SubmissionContextType, SubmissionStatus } from '@/domain/submission'
import type { Evaluation, EvaluationContextType } from '@/domain/evaluation'
import type { LearningProgress } from '@/domain/progress'
import type { ActivityEvent, ActivityEventType } from '@/domain/activity'
import type { Notification } from '@/domain/notification'
import type { GeneratedProgressData } from './types'

/** Fixed "now" so the seed database is stable across runs instead of drifting with the wall clock. */
export const SEED_NOW = '2026-09-17T09:00:00.000Z'

const SEED_NOW_MS = new Date(SEED_NOW).getTime()
const HOUR_MS = 60 * 60 * 1000

function hoursAgo(hours: number): string {
  return new Date(SEED_NOW_MS - hours * HOUR_MS).toISOString()
}

function traineeHandle(email: string): string {
  return email.split('@')[0] ?? email
}

function shuffledIndices(length: number, rng: () => number): number[] {
  const arr = Array.from({ length }, (_, i) => i)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = rngInt(rng, 0, i)
    const tmp = arr[i]!
    arr[i] = arr[j]!
    arr[j] = tmp
  }
  return arr
}

const DAY_SLUGS: Record<number, string> = {
  1: 'sales-overview',
  2: 'data-cleansing',
  3: 'star-schema',
  4: 'executive-dashboard',
  5: 'dax-kpi-library',
  6: 'healthcare-prototype',
  7: 'interactive-report',
  8: 'claude-assisted-dev',
  9: 'legacy-migration',
  10: 'capstone',
}

const PASSED_FEEDBACK: Record<number, string> = {
  1: 'Clear business-question-to-KPI mapping and a clean first report page — good start.',
  2: 'Data-quality issues were found and documented with clear before/after validation.',
  3: 'Clean star schema with a properly marked date dimension — relationships are all deliberate.',
  4: 'Both pages show clear hierarchy and consistent formatting; the UX review is specific and actionable.',
  5: 'KPI library is complete and every measure reconciles to SQL — explanations correctly reflect filter context.',
  6: 'Traceability matrix is thorough and the prototype clearly answers the stated business questions.',
  7: 'All ten journey tests pass and drill-down/drill-through are correctly distinguished.',
  8: 'Prompts are schema-constrained and two real AI errors were caught before they reached the report.',
  9: 'Mapping matrix and reconciliation are both solid — numbers match the legacy baseline exactly.',
  10: 'Capstone reconciles fully to the expected KPI values and the demo narrative is clear and well-validated.',
}

const NEEDS_IMPROVEMENT_FEEDBACK: Record<number, string> = {
  1: 'KPI cards are correct but the five business questions need sharper, more specific rationale before this is customer-ready.',
  2: 'Type fixes look right, but two data-quality issues were left undocumented — always log the impact and validation, not just the fix.',
  3: 'Star schema is clean but the date dimension is missing a fiscal year column — add it before certification.',
  4: 'Executive page is solid; the Analysis page still has inconsistent number formatting between cards.',
  5: "Measures are correct but the YoY explanation doesn't reflect actual filter-context behavior — revise the write-up.",
  6: "KPI dictionary is missing an owner for two KPIs — a dictionary without an owner isn't finished.",
  7: 'Drill-through works, but two of the ten journey tests were not actually executed under a real filter state.',
  8: 'Good use of the DAX Builder prompt, but only one AI error was identified — dig for a second, subtler one.',
  9: 'Mapping matrix is thorough, but Profit does not yet reconcile to the SQL baseline — check the cost sign convention.',
  10: 'Capstone is close, but two KPIs still do not reconcile to the supplied expected values.',
}

interface DayPlan {
  day: number
  study: boolean
  exerciseStarted: boolean
  exerciseCompleted: boolean
  /** Number of correct answers (out of 5) on the final quiz attempt, or null if the quiz was never attempted. */
  quizCorrect: number | null
  quizAttempts: number
  githubStatus: SubmissionStatus
  assignmentStatus: SubmissionStatus
}

interface TraineePlan {
  days: DayPlan[]
  lastActivityHoursAgo: number
  courseCompleted: boolean
  capstoneId: string | null
}

function full(day: number, quizCorrect: number, quizAttempts: number, githubStatus: SubmissionStatus, assignmentStatus: SubmissionStatus): DayPlan {
  return { day, study: true, exerciseStarted: true, exerciseCompleted: true, quizCorrect, quizAttempts, githubStatus, assignmentStatus }
}

function partialStudyExerciseNoSubmit(day: number, exerciseCompleted: boolean): DayPlan {
  return {
    day,
    study: true,
    exerciseStarted: true,
    exerciseCompleted,
    quizCorrect: null,
    quizAttempts: 0,
    githubStatus: 'NOT_SUBMITTED',
    assignmentStatus: 'NOT_SUBMITTED',
  }
}

// Trainee order matches TRAINEES in users.seed.ts (trainee01..trainee08), targeting
// approximate overall completion of 100/92/84/76/65/52/38/20 respectively.
const TRAINEE_PLANS: TraineePlan[] = [
  // trainee01 — 100%: every day fully complete, including the day-10 capstone.
  {
    days: [
      full(1, 5, 1, 'PASSED', 'PASSED'),
      full(2, 5, 1, 'PASSED', 'PASSED'),
      full(3, 4, 1, 'PASSED', 'PASSED'),
      full(4, 5, 1, 'PASSED', 'PASSED'),
      full(5, 5, 1, 'PASSED', 'PASSED'),
      full(6, 4, 1, 'PASSED', 'PASSED'),
      full(7, 5, 1, 'PASSED', 'PASSED'),
      full(8, 5, 1, 'PASSED', 'PASSED'),
      full(9, 4, 1, 'PASSED', 'PASSED'),
      full(10, 5, 1, 'PASSED', 'NOT_SUBMITTED'),
    ],
    lastActivityHoursAgo: 6,
    courseCompleted: true,
    capstoneId: 'capstone-sales360',
  },
  // trainee02 — 92%: days 1-9 fully complete, day 10 capstone only started.
  {
    days: [
      full(1, 5, 1, 'PASSED', 'PASSED'),
      full(2, 4, 1, 'PASSED', 'PASSED'),
      full(3, 5, 1, 'PASSED', 'PASSED'),
      full(4, 5, 1, 'PASSED', 'PASSED'),
      full(5, 4, 1, 'PASSED', 'PASSED'),
      full(6, 5, 1, 'PASSED', 'PASSED'),
      full(7, 5, 1, 'PASSED', 'PASSED'),
      full(8, 4, 1, 'PASSED', 'PASSED'),
      full(9, 5, 1, 'PASSED', 'PASSED'),
      partialStudyExerciseNoSubmit(10, false),
    ],
    lastActivityHoursAgo: 20,
    courseCompleted: false,
    capstoneId: 'capstone-healthcare',
  },
  // trainee03 — 84%: days 1-8 fully complete, day 9 submitted but not yet evaluated.
  {
    days: [
      full(1, 4, 1, 'PASSED', 'PASSED'),
      full(2, 5, 1, 'PASSED', 'PASSED'),
      full(3, 4, 1, 'PASSED', 'PASSED'),
      full(4, 3, 2, 'PASSED', 'PASSED'),
      full(5, 5, 1, 'PASSED', 'PASSED'),
      full(6, 4, 1, 'PASSED', 'PASSED'),
      full(7, 5, 1, 'PASSED', 'PASSED'),
      full(8, 4, 1, 'PASSED', 'PASSED'),
      full(9, 4, 1, 'SUBMITTED', 'SUBMITTED'),
    ],
    lastActivityHoursAgo: 30,
    courseCompleted: false,
    capstoneId: null,
  },
  // trainee04 — 76%: days 1-7 fully complete, day 8 under review.
  {
    days: [
      full(1, 4, 1, 'PASSED', 'PASSED'),
      full(2, 4, 1, 'PASSED', 'PASSED'),
      full(3, 5, 1, 'PASSED', 'PASSED'),
      full(4, 4, 1, 'PASSED', 'PASSED'),
      full(5, 3, 2, 'PASSED', 'PASSED'),
      full(6, 4, 1, 'PASSED', 'PASSED'),
      full(7, 5, 1, 'PASSED', 'PASSED'),
      full(8, 4, 1, 'UNDER_REVIEW', 'UNDER_REVIEW'),
    ],
    lastActivityHoursAgo: 40,
    courseCompleted: false,
    capstoneId: null,
  },
  // trainee05 — 65%: days 1-6 fully complete, day 7 started but the quiz was never attempted.
  {
    days: [
      full(1, 4, 1, 'PASSED', 'PASSED'),
      full(2, 3, 2, 'NEEDS_IMPROVEMENT', 'PASSED'),
      full(3, 4, 1, 'PASSED', 'PASSED'),
      full(4, 4, 1, 'PASSED', 'PASSED'),
      full(5, 3, 2, 'PASSED', 'PASSED'),
      full(6, 4, 1, 'PASSED', 'PASSED'),
      partialStudyExerciseNoSubmit(7, true),
    ],
    lastActivityHoursAgo: 50,
    courseCompleted: false,
    capstoneId: null,
  },
  // trainee06 — 52%: days 1-5 fully complete, day 6 study-only (exercise merely started).
  {
    days: [
      full(1, 3, 1, 'PASSED', 'PASSED'),
      full(2, 4, 1, 'PASSED', 'PASSED'),
      full(3, 3, 2, 'PASSED', 'PASSED'),
      full(4, 2, 2, 'NEEDS_IMPROVEMENT', 'NEEDS_IMPROVEMENT'),
      full(5, 4, 1, 'PASSED', 'PASSED'),
      partialStudyExerciseNoSubmit(6, false),
    ],
    lastActivityHoursAgo: 60,
    courseCompleted: false,
    capstoneId: null,
  },
  // trainee07 — 38%: days 1-3 completed while struggling on quizzes/submissions, day 4 started with no quiz.
  {
    days: [
      full(1, 2, 2, 'PASSED', 'PASSED'),
      full(2, 2, 1, 'NEEDS_IMPROVEMENT', 'SUBMITTED'),
      full(3, 3, 3, 'NOT_SUBMITTED', 'NOT_SUBMITTED'),
      partialStudyExerciseNoSubmit(4, true),
    ],
    lastActivityHoursAgo: 96,
    courseCompleted: false,
    capstoneId: null,
  },
  // trainee08 — 20%: only day 1 was touched, and the exercise was only started.
  {
    days: [
      { day: 1, study: true, exerciseStarted: true, exerciseCompleted: false, quizCorrect: 2, quizAttempts: 1, githubStatus: 'NOT_SUBMITTED', assignmentStatus: 'NOT_SUBMITTED' },
    ],
    lastActivityHoursAgo: 144,
    courseCompleted: false,
    capstoneId: null,
  },
]

interface TraineeContext {
  dayByNumber: Map<number, LearningDay>
  quizByDayId: Map<string, Quiz>
  assignmentByDayId: Map<string, Assignment>
  adminId: string
}

interface OutputSink {
  progress: LearningProgress[]
  quizAttempts: QuizAttempt[]
  githubSubmissions: GithubSubmission[]
  assignmentSubmissions: AssignmentSubmission[]
  evaluations: Evaluation[]
  activity: ActivityEvent[]
  notifications: Notification[]
}

function buildQuizAttempts(
  traineeId: string,
  quiz: Quiz,
  finalCorrect: number,
  attemptsCount: number,
  finalHoursAgo: number,
  rng: () => number,
): QuizAttempt[] {
  const attempts: QuizAttempt[] = []
  for (let attemptNumber = 1; attemptNumber <= attemptsCount; attemptNumber++) {
    const isFinal = attemptNumber === attemptsCount
    const correctCount = isFinal ? finalCorrect : Math.max(0, finalCorrect - rngInt(rng, 1, 2))
    const scorePercent = Math.round((correctCount / quiz.questions.length) * 100)
    const attemptHoursAgo = finalHoursAgo + (attemptsCount - attemptNumber) * 0.8
    const order = shuffledIndices(quiz.questions.length, rng)
    const correctSet = new Set(order.slice(0, correctCount))
    const answers: QuizAnswer[] = quiz.questions.map((q, i) => ({
      questionId: q.id,
      selectedOptionIndex: correctSet.has(i) ? q.correctOptionIndex : (q.correctOptionIndex + 1) % 4,
    }))
    attempts.push({
      id: `quizattempt-${traineeId}-${quiz.id}-a${attemptNumber}`,
      quizId: quiz.id,
      traineeId,
      attemptNumber,
      answers,
      correctCount,
      totalQuestions: quiz.questions.length,
      scorePercent,
      passed: scorePercent >= quiz.passingScorePercent,
      startedAt: hoursAgo(attemptHoursAgo + 0.2),
      completedAt: hoursAgo(attemptHoursAgo),
    })
  }
  return attempts
}

function buildTraineeData(trainee: Trainee, traineeIndex: number, plan: TraineePlan, ctx: TraineeContext, sink: OutputSink): void {
  const rng = createSeededRng(traineeIndex * 7919 + 13)
  const handle = traineeHandle(trainee.email)
  const frontierDay = plan.days.length > 0 ? plan.days[plan.days.length - 1]!.day : 0
  const planByDay = new Map(plan.days.map((d) => [d.day, d]))

  let activityCounter = 0
  const traineeNotifications: Notification[] = []

  function pushActivity(type: ActivityEventType, dayId: string | null, hoursAgoVal: number, metadata: Record<string, string | number | boolean> | null = null) {
    sink.activity.push({
      id: `activity-${trainee.id}-${activityCounter++}`,
      traineeId: trainee.id,
      type,
      dayId,
      metadata,
      timestamp: hoursAgo(hoursAgoVal),
    })
  }

  function pushEvaluation(
    dayNumber: number,
    contextType: EvaluationContextType,
    contextId: string,
    status: SubmissionStatus,
    hoursAgoVal: number,
  ): Evaluation | null {
    if (status !== 'PASSED' && status !== 'NEEDS_IMPROVEMENT') return null
    const feedback = status === 'PASSED' ? PASSED_FEEDBACK[dayNumber]! : NEEDS_IMPROVEMENT_FEEDBACK[dayNumber]!
    const score = status === 'PASSED' ? rngInt(rng, 82, 97) : rngInt(rng, 60, 74)
    const evaluation: Evaluation = {
      id: `evaluation-${trainee.id}-${contextType.toLowerCase()}-day-${dayNumber}`,
      traineeId: trainee.id,
      dayId: ctx.dayByNumber.get(dayNumber)!.id,
      contextType,
      contextId,
      score,
      maxScore: 100,
      status,
      feedback,
      evaluatorId: ctx.adminId,
      evaluatedAt: hoursAgo(hoursAgoVal),
    }
    sink.evaluations.push(evaluation)
    return evaluation
  }

  const totalDays = ctx.dayByNumber.size
  for (let dayNumber = 1; dayNumber <= totalDays; dayNumber++) {
    const day = ctx.dayByNumber.get(dayNumber)!
    const dayPlan = planByDay.get(dayNumber)

    if (!dayPlan) {
      sink.progress.push({
        traineeId: trainee.id,
        dayId: day.id,
        studyCompleted: false,
        exerciseStarted: false,
        exerciseCompleted: false,
        quizCompleted: false,
        quizScorePercent: null,
        quizAttempts: 0,
        githubSubmitted: false,
        assignmentSubmitted: false,
        lastUpdatedAt: trainee.joinedAt,
      })
      continue
    }

    const spacing = 26 + rngInt(rng, -3, 3)
    const anchorHoursAgo = plan.lastActivityHoursAgo + (frontierDay - dayNumber) * spacing
    const quiz = ctx.quizByDayId.get(day.id)!
    const assignment = ctx.assignmentByDayId.get(day.id)

    pushActivity('LOGIN', day.id, anchorHoursAgo + 9)
    pushActivity('STUDY_STARTED', day.id, anchorHoursAgo + 8.5)
    let lastTouchedHoursAgo = anchorHoursAgo + 8.5

    if (dayPlan.study) {
      pushActivity('STUDY_COMPLETED', day.id, anchorHoursAgo + 7.5)
      lastTouchedHoursAgo = anchorHoursAgo + 7.5
    }

    if (dayPlan.exerciseStarted) {
      pushActivity('EXERCISE_STARTED', day.id, anchorHoursAgo + 6)
      lastTouchedHoursAgo = anchorHoursAgo + 6
    }
    if (dayPlan.exerciseCompleted) {
      pushActivity('EXERCISE_COMPLETED', day.id, anchorHoursAgo + 4)
      lastTouchedHoursAgo = anchorHoursAgo + 4
    }

    let quizScorePercent: number | null = null
    if (dayPlan.quizCorrect !== null) {
      pushActivity('QUIZ_STARTED', day.id, anchorHoursAgo + 2.2)
      const attempts = buildQuizAttempts(trainee.id, quiz, dayPlan.quizCorrect, dayPlan.quizAttempts, anchorHoursAgo + 1.8, rng)
      sink.quizAttempts.push(...attempts)
      quizScorePercent = Math.round((dayPlan.quizCorrect / quiz.questions.length) * 100)
      pushActivity('QUIZ_COMPLETED', day.id, anchorHoursAgo + 1.8, { scorePercent: quizScorePercent })
      lastTouchedHoursAgo = anchorHoursAgo + 1.8
    }

    // GitHub submission for the exercise deliverable.
    const githubSubmitted = dayPlan.githubStatus !== 'NOT_SUBMITTED'
    if (githubSubmitted) {
      const repoUrl = `https://github.com/${handle}-ideas2it/pbi-day-${dayNumber}-${DAY_SLUGS[dayNumber]}`
      const isCapstoneDay = dayNumber === totalDays
      const contextType: SubmissionContextType = isCapstoneDay ? 'CAPSTONE' : 'EXERCISE'
      const contextId = isCapstoneDay ? plan.capstoneId ?? day.exerciseId : day.exerciseId
      const submittedAtHoursAgo = anchorHoursAgo + 0.8
      const evalHoursAgo = Math.max(0.5, anchorHoursAgo - rngInt(rng, 6, 30))
      const updatedAtHoursAgo = dayPlan.githubStatus === 'PASSED' || dayPlan.githubStatus === 'NEEDS_IMPROVEMENT' ? evalHoursAgo : submittedAtHoursAgo
      sink.githubSubmissions.push({
        id: `github-${trainee.id}-exercise-day-${dayNumber}`,
        traineeId: trainee.id,
        contextType,
        contextId,
        repoUrl,
        branch: 'main',
        commitOrPrUrl: `${repoUrl}/pull/1`,
        comments: `Day ${dayNumber} exercise deliverable for review.`,
        status: dayPlan.githubStatus,
        submittedAt: hoursAgo(submittedAtHoursAgo),
        updatedAt: hoursAgo(updatedAtHoursAgo),
      })
      pushActivity('GITHUB_SUBMITTED', day.id, submittedAtHoursAgo, { repoUrl })
      lastTouchedHoursAgo = submittedAtHoursAgo

      const evaluation = pushEvaluation(dayNumber, isCapstoneDay ? 'CAPSTONE' : 'EXERCISE', contextId, dayPlan.githubStatus, evalHoursAgo)
      if (evaluation) {
        pushActivity('EVALUATION_COMPLETED', day.id, evalHoursAgo, { contextType: evaluation.contextType })
        traineeNotifications.push({
          id: `notification-${trainee.id}-exercise-day-${dayNumber}`,
          userId: trainee.id,
          type: 'FEEDBACK_AVAILABLE',
          title: `Feedback available: Day ${dayNumber} exercise`,
          message: evaluation.feedback,
          link: '/submissions',
          isRead: true,
          createdAt: hoursAgo(evalHoursAgo),
        })
      }
    }

    // Assignment submission (days 1-9 only).
    const assignmentSubmitted = assignment !== undefined && dayPlan.assignmentStatus !== 'NOT_SUBMITTED'
    if (assignment && assignmentSubmitted) {
      const repoUrl = `https://github.com/${handle}-ideas2it/pbi-day-${dayNumber}-${DAY_SLUGS[dayNumber]}`
      const submittedAtHoursAgo = anchorHoursAgo + 0.3
      const evalHoursAgo = Math.max(0.3, anchorHoursAgo - rngInt(rng, 6, 30))
      const isEvaluated = dayPlan.assignmentStatus === 'PASSED' || dayPlan.assignmentStatus === 'NEEDS_IMPROVEMENT'
      sink.githubSubmissions.push({
        id: `github-${trainee.id}-assignment-day-${dayNumber}`,
        traineeId: trainee.id,
        contextType: 'ASSIGNMENT',
        contextId: assignment.id,
        repoUrl,
        branch: 'submission',
        commitOrPrUrl: `${repoUrl}/pull/2`,
        comments: `Day ${dayNumber} assignment deliverable for review.`,
        status: dayPlan.assignmentStatus,
        submittedAt: hoursAgo(submittedAtHoursAgo),
        updatedAt: hoursAgo(isEvaluated ? evalHoursAgo : submittedAtHoursAgo),
      })
      sink.assignmentSubmissions.push({
        id: `assignmentsubmission-${trainee.id}-day-${dayNumber}`,
        assignmentId: assignment.id,
        traineeId: trainee.id,
        notes: `Submitted deliverables for ${assignment.title}.`,
        githubRepoUrl: repoUrl,
        submittedAt: hoursAgo(submittedAtHoursAgo),
        status: dayPlan.assignmentStatus,
        score: isEvaluated ? (dayPlan.assignmentStatus === 'PASSED' ? rngInt(rng, 82, 97) : rngInt(rng, 60, 74)) : null,
        maxScore: 100,
        feedback: isEvaluated
          ? dayPlan.assignmentStatus === 'PASSED'
            ? PASSED_FEEDBACK[dayNumber]!
            : NEEDS_IMPROVEMENT_FEEDBACK[dayNumber]!
          : null,
        evaluatedAt: isEvaluated ? hoursAgo(evalHoursAgo) : null,
      })
      pushActivity('ASSIGNMENT_SUBMITTED', day.id, submittedAtHoursAgo, { assignmentId: assignment.id })
      lastTouchedHoursAgo = submittedAtHoursAgo

      const evaluation = pushEvaluation(dayNumber, 'ASSIGNMENT', assignment.id, dayPlan.assignmentStatus, evalHoursAgo)
      if (evaluation) {
        pushActivity('EVALUATION_COMPLETED', day.id, evalHoursAgo, { contextType: evaluation.contextType })
        traineeNotifications.push({
          id: `notification-${trainee.id}-assignment-day-${dayNumber}`,
          userId: trainee.id,
          type: 'FEEDBACK_AVAILABLE',
          title: `Feedback available: ${assignment.title}`,
          message: evaluation.feedback,
          link: `/assignment/${assignment.id}`,
          isRead: true,
          createdAt: hoursAgo(evalHoursAgo),
        })
      }
    }

    sink.progress.push({
      traineeId: trainee.id,
      dayId: day.id,
      studyCompleted: dayPlan.study,
      exerciseStarted: dayPlan.exerciseStarted,
      exerciseCompleted: dayPlan.exerciseCompleted,
      quizCompleted: dayPlan.quizCorrect !== null,
      quizScorePercent,
      quizAttempts: dayPlan.quizAttempts,
      githubSubmitted,
      assignmentSubmitted,
      lastUpdatedAt: hoursAgo(lastTouchedHoursAgo),
    })
  }

  if (plan.courseCompleted) {
    pushActivity('COURSE_COMPLETED', null, Math.max(0.5, plan.lastActivityHoursAgo - 0.5))
  }

  // Mark the most recent 1-2 notifications as unread so the UI has something to surface.
  traineeNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  traineeNotifications.forEach((n, i) => {
    n.isRead = i >= 2
  })
  sink.notifications.push(...traineeNotifications)
}

export function generateProgressData(params: {
  trainees: Trainee[]
  days: LearningDay[]
  quizzes: Quiz[]
  assignments: Assignment[]
  adminId: string
}): GeneratedProgressData {
  const { trainees, days, quizzes, assignments, adminId } = params

  const ctx: TraineeContext = {
    dayByNumber: new Map(days.map((d) => [d.dayNumber, d])),
    quizByDayId: new Map(quizzes.map((q) => [q.dayId, q])),
    assignmentByDayId: new Map(assignments.map((a) => [a.dayId, a])),
    adminId,
  }

  const sink: OutputSink = {
    progress: [],
    quizAttempts: [],
    githubSubmissions: [],
    assignmentSubmissions: [],
    evaluations: [],
    activity: [],
    notifications: [],
  }

  trainees.forEach((trainee, traineeIndex) => {
    const plan = TRAINEE_PLANS[traineeIndex] ?? TRAINEE_PLANS[TRAINEE_PLANS.length - 1]!
    buildTraineeData(trainee, traineeIndex, plan, ctx, sink)
  })

  sink.activity.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  return {
    progress: sink.progress,
    quizAttempts: sink.quizAttempts,
    githubSubmissions: sink.githubSubmissions,
    assignmentSubmissions: sink.assignmentSubmissions,
    evaluations: sink.evaluations,
    activity: sink.activity,
    notifications: sink.notifications,
  }
}
