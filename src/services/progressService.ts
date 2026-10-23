import { apiFetch } from '@/services/http'
import type { LearningDay } from '@/domain/course'
import type { DerivedDayProgress, LearningProgress, TraineeSummary } from '@/domain/progress'

export async function getProgress(traineeId: string, dayId: string): Promise<LearningProgress> {
  return apiFetch(`/api/trainees/${traineeId}/progress/${dayId}`)
}

export async function getProgressForTrainee(traineeId: string): Promise<LearningProgress[]> {
  return apiFetch(`/api/trainees/${traineeId}/progress`)
}

export async function markStudyComplete(traineeId: string, dayId: string): Promise<LearningProgress> {
  return apiFetch(`/api/trainees/${traineeId}/progress/${dayId}/study-complete`, { method: 'POST' })
}

export async function markExerciseStarted(traineeId: string, dayId: string): Promise<LearningProgress> {
  return apiFetch(`/api/trainees/${traineeId}/progress/${dayId}/exercise-started`, { method: 'POST' })
}

export async function markExerciseCompleted(traineeId: string, dayId: string): Promise<LearningProgress> {
  return apiFetch(`/api/trainees/${traineeId}/progress/${dayId}/exercise-completed`, { method: 'POST' })
}

export async function getDerivedProgressForTrainee(traineeId: string): Promise<DerivedDayProgress[]> {
  return apiFetch(`/api/trainees/${traineeId}/progress/derived`)
}

export async function getNextIncompleteDay(traineeId: string): Promise<LearningDay | null> {
  return apiFetch(`/api/trainees/${traineeId}/next-day`)
}

export async function getTraineeSummary(traineeId: string): Promise<TraineeSummary> {
  return apiFetch(`/api/trainees/${traineeId}/summary`)
}

export async function getCohortSummaries(): Promise<TraineeSummary[]> {
  const rows = await apiFetch<{ summary: TraineeSummary }[]>('/api/manage/trainees')
  return rows.map((r) => r.summary)
}

export interface DailyCompletionStat {
  dayId: string
  dayNumber: number
  title: string
  completionPercent: number
}

export interface QuizPerformanceStat {
  dayId: string
  dayNumber: number
  title: string
  averageScorePercent: number
}

export async function getCohortDailyCompletion(): Promise<DailyCompletionStat[]> {
  return apiFetch('/api/manage/cohort/daily-completion')
}

export async function getCohortQuizPerformance(): Promise<QuizPerformanceStat[]> {
  return apiFetch('/api/manage/cohort/quiz-performance')
}
