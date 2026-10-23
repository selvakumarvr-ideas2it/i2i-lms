import { randomUUID } from 'node:crypto'
import { notFound } from '../http/respond'
import type { ProgressService } from './progressService'
import type { Repositories, Trainee } from '../repositories/interfaces'
import type { AtRiskThresholds, TraineeSummary } from '../../../src/domain/progress'
import type { SubmissionStatus } from '../../../src/domain/submission'
import type { EvaluationContextType } from '../../../src/domain/evaluation'

export interface TraineeListRow extends Trainee {
  summary: TraineeSummary
}

export type TraineeStatusFilter = 'ALL' | 'AT_RISK' | 'COMPLETED' | 'ACTIVE'

export interface TraineeListFilter {
  search?: string
  status?: TraineeStatusFilter
}

export interface CohortOverviewStats {
  totalTrainees: number
  active: number
  completed: number
  atRisk: number
  averageProgressPercent: number
  averageQuizScorePercent: number
  assignmentsPending: number
  exercisesPending: number
}

export interface AssignmentStatusBreakdown {
  status: SubmissionStatus
  count: number
}

export interface CohortProgressReportRow {
  traineeName: string
  dayCompletionPercents: number[]
  overallPercent: number
  quizAveragePercent: number
  assignmentsCompleted: number
  assignmentsTotal: number
  githubSubmissionsCount: number
}

interface EvaluateInput {
  status: SubmissionStatus
  feedback: string
  evaluatorId: string // ignored — see note below
  dayId: string
  score?: number | null
  maxScore?: number
}

export function createAdminService(repos: Repositories, progressService: ProgressService) {
  async function getSummaryByTraineeId(): Promise<Map<string, TraineeSummary>> {
    const summaries = await progressService.getCohortSummaries()
    return new Map(summaries.map((s) => [s.traineeId, s]))
  }

  async function getTrainees(filter: TraineeListFilter = {}): Promise<TraineeListRow[]> {
    const [trainees, summaryByTrainee] = await Promise.all([repos.users.listTrainees(), getSummaryByTraineeId()])

    let rows: TraineeListRow[] = trainees.map((t) => ({ ...t, summary: summaryByTrainee.get(t.id) as TraineeSummary }))

    if (filter.search) {
      const q = filter.search.toLowerCase()
      rows = rows.filter((r) => r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q))
    }
    if (filter.status === 'AT_RISK') rows = rows.filter((r) => r.summary.isAtRisk)
    if (filter.status === 'COMPLETED') rows = rows.filter((r) => r.summary.overallCompletionPercent >= 100)
    if (filter.status === 'ACTIVE') rows = rows.filter((r) => r.summary.overallCompletionPercent > 0 && r.summary.overallCompletionPercent < 100)

    return rows.sort((a, b) => b.summary.overallCompletionPercent - a.summary.overallCompletionPercent)
  }

  async function getTraineeDetail(traineeId: string) {
    const user = await repos.users.getById(traineeId)
    if (!user || user.role !== 'TRAINEE') return null
    const trainee = user

    const [summary, progress, quizAttemptsByQuiz, githubSubmissions, assignmentSubmissions, evaluations, activity] = await Promise.all([
      progressService.getTraineeSummary(traineeId),
      progressService.getDerivedProgressForTrainee(traineeId),
      // QuizAttemptRepository is keyed per (trainee, quiz); fan out across this trainee's quizzes.
      (async () => {
        const days = await repos.courseContent.getDays()
        const attempts = await Promise.all(days.map((d) => repos.quizAttempts.listForTraineeQuiz(traineeId, d.quizId)))
        return attempts.flat()
      })(),
      repos.githubSubmissions.listForTrainee(traineeId),
      repos.assignmentSubmissions.listForTrainee(traineeId),
      repos.evaluations.listForTrainee(traineeId),
      repos.activity.listForTrainee(traineeId),
    ])

    return {
      trainee,
      summary,
      progress,
      quizAttempts: quizAttemptsByQuiz,
      githubSubmissions,
      assignmentSubmissions,
      evaluations,
      activity,
    }
  }

  async function getCohortOverviewStats(): Promise<CohortOverviewStats> {
    const [summaries, averageQuizScorePercent] = await Promise.all([
      progressService.getCohortSummaries(),
      progressService.getCohortQuizScoreAverage(),
    ])
    const totalTrainees = summaries.length
    const completed = summaries.filter((s) => s.overallCompletionPercent >= 100).length
    const active = summaries.filter((s) => s.overallCompletionPercent > 0 && s.overallCompletionPercent < 100).length
    const atRisk = summaries.filter((s) => s.isAtRisk).length
    const averageProgressPercent = totalTrainees === 0 ? 0 : Math.round(summaries.reduce((a, s) => a + s.overallCompletionPercent, 0) / totalTrainees)
    const assignmentsPending = summaries.reduce((a, s) => a + (s.assignmentsTotal - s.assignmentsCompleted), 0)
    const exercisesPending = summaries.reduce((a, s) => a + (s.exercisesTotal - s.exercisesCompleted), 0)
    return { totalTrainees, active, completed, atRisk, averageProgressPercent, averageQuizScorePercent, assignmentsPending, exercisesPending }
  }

  async function getAssignmentStatusBreakdown(dayId?: string): Promise<AssignmentStatusBreakdown[]> {
    const [trainees, days, allSubmissions] = await Promise.all([
      repos.users.listTrainees(),
      repos.courseContent.getDays(),
      repos.assignmentSubmissions.listAll(),
    ])

    let assignmentDays = days.filter((d) => d.assignmentId)
    let submissions = allSubmissions
    if (dayId) {
      const day = days.find((d) => d.id === dayId)
      if (!day) notFound(`Day not found: ${dayId}`)
      assignmentDays = day.assignmentId ? [day] : []
      const assignmentIdsForDay = new Set(assignmentDays.map((d) => d.assignmentId))
      submissions = allSubmissions.filter((s) => assignmentIdsForDay.has(s.assignmentId))
    }
    const totalPossible = trainees.length * assignmentDays.length

    const counts: Record<SubmissionStatus, number> = { NOT_SUBMITTED: 0, SUBMITTED: 0, UNDER_REVIEW: 0, PASSED: 0, NEEDS_IMPROVEMENT: 0 }
    for (const submission of submissions) counts[submission.status] += 1
    counts.NOT_SUBMITTED = Math.max(0, totalPossible - submissions.length)

    return (Object.keys(counts) as SubmissionStatus[]).map((status) => ({ status, count: counts[status] }))
  }

  async function recordEvaluation(input: {
    traineeId: string
    dayId: string
    contextType: EvaluationContextType
    contextId: string
    score: number | null
    maxScore: number
    status: SubmissionStatus
    feedback: string
    evaluatorId: string
  }) {
    const evaluation = { id: randomUUID(), ...input, evaluatedAt: new Date().toISOString() }
    await repos.evaluations.create(evaluation)
    await repos.activity.append({
      id: randomUUID(),
      traineeId: input.traineeId,
      type: 'EVALUATION_COMPLETED',
      dayId: input.dayId,
      metadata: { contextType: input.contextType, status: input.status },
      timestamp: evaluation.evaluatedAt,
    })
    await repos.notifications.create({
      id: randomUUID(),
      userId: input.traineeId,
      type: 'FEEDBACK_AVAILABLE',
      title: 'Trainer feedback available',
      message: input.feedback || 'Your submission has been reviewed.',
      link: `/learning/day/${input.dayId}`,
      isRead: false,
      createdAt: evaluation.evaluatedAt,
    })
    return evaluation
  }

  return {
    getTrainees,
    getAtRiskTrainees: () => getTrainees({ status: 'AT_RISK' }),
    getTraineeDetail,
    getAtRiskThresholds: () => repos.settings.getAtRiskThresholds(),
    setAtRiskThresholds: (thresholds: AtRiskThresholds) => repos.settings.setAtRiskThresholds(thresholds),
    getCohortOverviewStats,
    getAssignmentStatusBreakdown,

    // `evaluatorId` in the request body is ignored — `callerOid` (the caller's own id
    // off the x-user-id header, passed in by the function) is what's actually recorded.
    // This keeps attribution consistent with whoever the request headers claim to be;
    // it is not a real identity guarantee, since those headers aren't verified (see
    // api/src/auth/clientPrincipal.ts).
    async evaluateGithubSubmission(traineeId: string, submissionId: string, input: EvaluateInput, callerOid: string) {
      const all = await repos.githubSubmissions.listForTrainee(traineeId)
      const submission = all.find((s) => s.id === submissionId)
      if (!submission) notFound(`GitHub submission not found: ${submissionId}`)

      const updated = { ...submission, status: input.status, comments: input.feedback, updatedAt: new Date().toISOString() }
      await repos.githubSubmissions.upsert(updated)
      await recordEvaluation({
        traineeId,
        dayId: input.dayId,
        contextType: submission.contextType === 'CAPSTONE' ? 'CAPSTONE' : submission.contextType === 'ASSIGNMENT' ? 'ASSIGNMENT' : 'GITHUB',
        contextId: submission.contextId,
        score: input.score ?? null,
        maxScore: input.maxScore ?? 100,
        status: input.status,
        feedback: input.feedback,
        evaluatorId: callerOid,
      })
      return updated
    },

    async evaluateAssignmentSubmission(traineeId: string, submissionId: string, input: EvaluateInput, callerOid: string) {
      const all = await repos.assignmentSubmissions.listForTrainee(traineeId)
      const submission = all.find((s) => s.id === submissionId)
      if (!submission) notFound(`Assignment submission not found: ${submissionId}`)

      const updated = { ...submission, status: input.status, score: input.score ?? null, feedback: input.feedback, evaluatedAt: new Date().toISOString() }
      await repos.assignmentSubmissions.upsert(updated)
      await recordEvaluation({
        traineeId,
        dayId: input.dayId,
        contextType: 'ASSIGNMENT',
        contextId: submission.assignmentId,
        score: input.score ?? null,
        maxScore: submission.maxScore,
        status: input.status,
        feedback: input.feedback,
        evaluatorId: callerOid,
      })
      return updated
    },

    async getCohortProgressReport(): Promise<CohortProgressReportRow[]> {
      const [trainees, days] = await Promise.all([repos.users.listTrainees(), repos.courseContent.getDays()])
      const sortedDays = [...days].sort((a, b) => a.dayNumber - b.dayNumber)

      return Promise.all(
        trainees.map(async (trainee) => {
          const [summary, progress, githubSubmissions] = await Promise.all([
            progressService.getTraineeSummary(trainee.id),
            progressService.getDerivedProgressForTrainee(trainee.id),
            repos.githubSubmissions.listForTrainee(trainee.id),
          ])
          const progressByDay = new Map(progress.map((p) => [p.dayId, p]))
          return {
            traineeName: trainee.name,
            dayCompletionPercents: sortedDays.map((d) => progressByDay.get(d.id)?.completionPercent ?? 0),
            overallPercent: summary.overallCompletionPercent,
            quizAveragePercent: summary.quizAveragePercent,
            assignmentsCompleted: summary.assignmentsCompleted,
            assignmentsTotal: summary.assignmentsTotal,
            githubSubmissionsCount: githubSubmissions.length,
          }
        }),
      )
    },
  }
}

export type AdminService = ReturnType<typeof createAdminService>
