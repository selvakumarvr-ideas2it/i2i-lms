import { apiFetch } from '@/services/http'
import { downloadCsv } from '@/lib/csvExport'
import type { Trainee } from '@/domain/user'
import type { AtRiskThresholds, DerivedDayProgress, TraineeSummary } from '@/domain/progress'
import type { GithubSubmission, SubmissionStatus } from '@/domain/submission'
import type { AssignmentSubmission } from '@/domain/assignment'
import type { Evaluation } from '@/domain/evaluation'
import type { ActivityEvent } from '@/domain/activity'
import type { QuizAttempt } from '@/domain/quiz'

export interface TraineeListRow extends Trainee {
  summary: TraineeSummary
}

export type TraineeStatusFilter = 'ALL' | 'AT_RISK' | 'COMPLETED' | 'ACTIVE'

export interface TraineeListFilter {
  search?: string
  status?: TraineeStatusFilter
}

export async function getTrainees(filter: TraineeListFilter = {}): Promise<TraineeListRow[]> {
  const params = new URLSearchParams()
  if (filter.search) params.set('search', filter.search)
  if (filter.status) params.set('status', filter.status)
  const query = params.toString()
  return apiFetch(`/api/manage/trainees${query ? `?${query}` : ''}`)
}

export async function getAtRiskTrainees(): Promise<TraineeListRow[]> {
  return getTrainees({ status: 'AT_RISK' })
}

export interface TraineeDetail {
  trainee: Trainee
  summary: TraineeSummary
  progress: DerivedDayProgress[]
  quizAttempts: QuizAttempt[]
  githubSubmissions: GithubSubmission[]
  assignmentSubmissions: AssignmentSubmission[]
  evaluations: Evaluation[]
  activity: ActivityEvent[]
}

export async function getTraineeDetail(traineeId: string): Promise<TraineeDetail | null> {
  try {
    return await apiFetch(`/api/manage/trainees/${traineeId}`)
  } catch {
    return null
  }
}

export async function getAtRiskThresholds(): Promise<AtRiskThresholds> {
  return apiFetch('/api/manage/at-risk-thresholds')
}

export async function setAtRiskThresholds(thresholds: AtRiskThresholds): Promise<AtRiskThresholds> {
  return apiFetch('/api/manage/at-risk-thresholds', { method: 'PUT', body: JSON.stringify(thresholds) })
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

export async function getCohortOverviewStats(): Promise<CohortOverviewStats> {
  return apiFetch('/api/manage/cohort/overview')
}

export interface AssignmentStatusBreakdown {
  status: SubmissionStatus
  count: number
}

export async function getAssignmentStatusBreakdown(dayId?: string): Promise<AssignmentStatusBreakdown[]> {
  const query = dayId ? `?dayId=${encodeURIComponent(dayId)}` : ''
  return apiFetch(`/api/manage/cohort/assignment-status${query}`)
}

export async function evaluateGithubSubmission(
  submissionId: string,
  input: { status: SubmissionStatus; feedback: string; evaluatorId: string; dayId: string; traineeId: string; maxScore?: number; score?: number | null },
): Promise<GithubSubmission> {
  return apiFetch(`/api/manage/github-submissions/${input.traineeId}/${submissionId}/evaluate`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}

export async function evaluateAssignmentSubmission(
  submissionId: string,
  input: { status: SubmissionStatus; score: number | null; feedback: string; evaluatorId: string; dayId: string; traineeId: string },
): Promise<AssignmentSubmission> {
  return apiFetch(`/api/manage/assignment-submissions/${input.traineeId}/${submissionId}/evaluate`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}

interface CohortProgressReportRow {
  traineeName: string
  dayCompletionPercents: number[]
  overallPercent: number
  quizAveragePercent: number
  assignmentsCompleted: number
  assignmentsTotal: number
  githubSubmissionsCount: number
}

export async function exportCohortProgressCsv(): Promise<void> {
  const [rows, days] = await Promise.all([
    apiFetch<CohortProgressReportRow[]>('/api/manage/reports/cohort-progress'),
    apiFetch<{ dayNumber: number }[]>('/api/course/days'),
  ])
  const sortedDays = [...days].sort((a, b) => a.dayNumber - b.dayNumber)

  const csvRows = rows.map((row) => [
    row.traineeName,
    ...row.dayCompletionPercents.map((p) => `${p}%`),
    `${row.overallPercent}%`,
    `${row.quizAveragePercent}%`,
    `${row.assignmentsCompleted}/${row.assignmentsTotal}`,
    String(row.githubSubmissionsCount),
    `${row.overallPercent}%`,
  ])

  const headers = ['Trainee', ...sortedDays.map((d) => `Day ${d.dayNumber}`), 'Overall %', 'Quiz Average', 'Assignments Completed', 'GitHub Submissions', 'Final Score']
  downloadCsv(`cohort-progress-report-${new Date().toISOString().slice(0, 10)}.csv`, headers, csvRows)
}
