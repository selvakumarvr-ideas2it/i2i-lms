import { computeAtRiskReasons } from '../../../src/services/logic/atRisk'
import {
  computeCompletionToDatePercent,
  computeOverallCompletionPercent,
  computeQuizAverage,
  deriveDayProgress,
  findNextIncompleteDay,
} from '../../../src/services/logic/deriveProgress'
import { notFound } from '../http/respond'
import type { Repositories } from '../repositories/interfaces'
import type { LearningDay } from '../../../src/domain/course'
import type { DerivedDayProgress, LearningProgress, TraineeSummary } from '../../../src/domain/progress'

function dayHasAssignment(day: LearningDay) {
  return Boolean(day.assignmentId)
}

function defaultProgress(traineeId: string, dayId: string): LearningProgress {
  return {
    traineeId,
    dayId,
    studyCompleted: false,
    exerciseStarted: false,
    exerciseCompleted: false,
    quizCompleted: false,
    quizScorePercent: null,
    quizAttempts: 0,
    githubSubmitted: false,
    assignmentSubmitted: false,
    lastUpdatedAt: new Date(0).toISOString(),
  }
}

export function createProgressService(repos: Repositories) {
  async function getDerivedProgressForTrainee(traineeId: string): Promise<DerivedDayProgress[]> {
    const [days, progressRows] = await Promise.all([repos.courseContent.getDays(), repos.progress.getForTrainee(traineeId)])
    return [...days]
      .sort((a, b) => a.dayNumber - b.dayNumber)
      .map((day) => {
        const progress = progressRows.find((p) => p.dayId === day.id) ?? defaultProgress(traineeId, day.id)
        return deriveDayProgress(progress, { hasAssignment: dayHasAssignment(day) })
      })
  }

  async function getNextIncompleteDay(traineeId: string): Promise<LearningDay | null> {
    const [days, derived] = await Promise.all([repos.courseContent.getDays(), getDerivedProgressForTrainee(traineeId)])
    const sortedDays = [...days].sort((a, b) => a.dayNumber - b.dayNumber)
    const derivedByDayId = new Map(derived.map((d) => [d.dayId, d]))
    return findNextIncompleteDay(sortedDays, derivedByDayId)
  }

  async function countOverdueAssignments(traineeId: string, days: LearningDay[]): Promise<number> {
    const progressRows = await repos.progress.getForTrainee(traineeId)
    return days.filter((day) => {
      if (!day.assignmentId) return false
      const progress = progressRows.find((p) => p.dayId === day.id)
      return Boolean(progress?.quizCompleted) && !progress?.assignmentSubmitted
    }).length
  }

  async function getTraineeSummary(traineeId: string): Promise<TraineeSummary> {
    const [days, derived, thresholds, activity, trainee] = await Promise.all([
      repos.courseContent.getDays(),
      getDerivedProgressForTrainee(traineeId),
      repos.settings.getAtRiskThresholds(),
      repos.activity.listForTrainee(traineeId, 1),
      repos.users.getById(traineeId),
    ])

    const overallCompletionPercent = computeOverallCompletionPercent(derived)
    const quizAveragePercent = computeQuizAverage(derived)
    const assignmentsTotal = days.filter((d) => d.assignmentId).length
    const assignmentsCompleted = derived.filter((d) => d.assignmentSubmitted).length
    const exercisesTotal = days.length
    const exercisesCompleted = derived.filter((d) => d.exerciseCompleted).length
    const daysCompleted = derived.filter((d) => d.overallStatus === 'COMPLETED').length
    const lastActiveAt = activity[0]?.timestamp ?? null
    const overdueAssignmentsCount = await countOverdueAssignments(traineeId, days)

    const now = new Date()
    const elapsedDayIds = new Set(
      days.filter((d) => d.scheduledDate && new Date(d.scheduledDate) <= now).map((d) => d.id),
    )
    const completionToDatePercent = computeCompletionToDatePercent(derived, elapsedDayIds)

    const atRiskReasons = computeAtRiskReasons(
      {
        completionToDatePercent,
        quizAveragePercent,
        lastActiveAt,
        overdueAssignmentsCount,
        // Falls back to the epoch (no grace period) if the user row is somehow gone —
        // an anomaly that should surface as at-risk, not silently hide behind a grace
        // period that was never meant to apply to it.
        joinedAt: trainee?.joinedAt ?? new Date(0).toISOString(),
      },
      thresholds,
    )

    return {
      traineeId,
      overallCompletionPercent,
      quizAveragePercent,
      assignmentsCompleted,
      assignmentsTotal,
      exercisesCompleted,
      exercisesTotal,
      daysCompleted,
      totalDays: days.length,
      lastActiveAt,
      isAtRisk: atRiskReasons.length > 0,
      atRiskReasons,
    }
  }

  async function getCohortSummaries(): Promise<TraineeSummary[]> {
    const trainees = await repos.users.listTrainees()
    return Promise.all(trainees.map((t) => getTraineeSummary(t.id)))
  }

  async function getCohortDailyCompletion() {
    const [days, trainees] = await Promise.all([repos.courseContent.getDays(), repos.users.listTrainees()])
    return Promise.all(
      [...days]
        .sort((a, b) => a.dayNumber - b.dayNumber)
        .map(async (day) => {
          const rows = await repos.progress.getAllForDay(day.id)
          const rowByTrainee = new Map(rows.map((r) => [r.traineeId, r]))
          const derived = trainees.map((t) =>
            deriveDayProgress(rowByTrainee.get(t.id) ?? defaultProgress(t.id, day.id), { hasAssignment: dayHasAssignment(day) }),
          )
          const completionPercent = trainees.length === 0 ? 0 : computeOverallCompletionPercent(derived)
          return { dayId: day.id, dayNumber: day.dayNumber, title: day.title, completionPercent }
        }),
    )
  }

  async function getCohortQuizPerformance() {
    const days = await repos.courseContent.getDays()
    return Promise.all(
      [...days]
        .sort((a, b) => a.dayNumber - b.dayNumber)
        .map(async (day) => {
          const rows = await repos.progress.getAllForDay(day.id)
          const scores = rows.filter((r) => r.quizScorePercent != null).map((r) => r.quizScorePercent as number)
          const averageScorePercent = scores.length === 0 ? 0 : Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
          return { dayId: day.id, dayNumber: day.dayNumber, title: day.title, averageScorePercent }
        }),
    )
  }

  /**
   * A single grand-mean over every scored quiz row across the whole cohort (every
   * trainee, every day) — deliberately NOT an average of each trainee's own average.
   * That "mean of means" is what getCohortOverviewStats used to compute, and it can
   * diverge sharply from getCohortQuizPerformance's per-day averages: a trainee with
   * only one quiz scored counts exactly as much as one with ten, so cohort members with
   * fewer data points (e.g. everyone who only just started) get silently over-weighted
   * relative to their actual share of the underlying scores. Sharing this same flat
   * data source keeps the overview card reconcilable with the per-day breakdown chart.
   */
  async function getCohortQuizScoreAverage(): Promise<number> {
    const days = await repos.courseContent.getDays()
    const rowsByDay = await Promise.all(days.map((day) => repos.progress.getAllForDay(day.id)))
    const scores = rowsByDay
      .flat()
      .filter((r) => r.quizScorePercent != null)
      .map((r) => r.quizScorePercent as number)
    return scores.length === 0 ? 0 : Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  }

  async function requireDay(dayId: string): Promise<LearningDay> {
    const day = await repos.courseContent.getDay(dayId)
    if (!day) notFound(`Day not found: ${dayId}`)
    return day
  }

  return {
    getProgress: (traineeId: string, dayId: string) => repos.progress.getOne(traineeId, dayId).then((p) => p ?? defaultProgress(traineeId, dayId)),
    getProgressForTrainee: (traineeId: string) => repos.progress.getForTrainee(traineeId),
    markStudyComplete: (traineeId: string, dayId: string) => repos.progress.upsert(traineeId, dayId, { studyCompleted: true }),
    markExerciseStarted: (traineeId: string, dayId: string) => repos.progress.upsert(traineeId, dayId, { exerciseStarted: true }),
    markExerciseCompleted: (traineeId: string, dayId: string) =>
      repos.progress.upsert(traineeId, dayId, { exerciseStarted: true, exerciseCompleted: true }),
    markGithubSubmitted: (traineeId: string, dayId: string) => repos.progress.upsert(traineeId, dayId, { githubSubmitted: true }),
    markAssignmentSubmitted: (traineeId: string, dayId: string) => repos.progress.upsert(traineeId, dayId, { assignmentSubmitted: true }),
    recordQuizResult: (traineeId: string, dayId: string, scorePercent: number, attempts: number) =>
      repos.progress.upsert(traineeId, dayId, { quizCompleted: true, quizScorePercent: scorePercent, quizAttempts: attempts }),
    getDerivedProgressForTrainee,
    getNextIncompleteDay,
    getTraineeSummary,
    getCohortSummaries,
    getCohortDailyCompletion,
    getCohortQuizPerformance,
    getCohortQuizScoreAverage,
    requireDay,
  }
}

export type ProgressService = ReturnType<typeof createProgressService>
