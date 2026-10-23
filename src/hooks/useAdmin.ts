import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as adminService from '@/services/adminService'
import * as assignmentService from '@/services/assignmentService'
import * as progressService from '@/services/progressService'
import * as submissionService from '@/services/submissionService'
import { progressKeys } from '@/hooks/useProgress'
import type { TraineeListFilter } from '@/services/adminService'
import type { AtRiskThresholds } from '@/domain/progress'

const adminKeys = {
  trainees: (filter: TraineeListFilter) => ['admin', 'trainees', filter] as const,
  atRisk: ['admin', 'trainees', 'at-risk'] as const,
  traineeDetail: (id: string) => ['admin', 'trainee', id] as const,
  overview: ['admin', 'overview'] as const,
  assignmentStatus: (dayId?: string) => ['admin', 'assignment-status', dayId ?? 'all'] as const,
  thresholds: ['admin', 'at-risk-thresholds'] as const,
  githubSubmissions: ['admin', 'github-submissions'] as const,
  assignmentSubmissions: ['admin', 'assignment-submissions'] as const,
}

export function useTrainees(filter: TraineeListFilter = {}) {
  return useQuery({ queryKey: adminKeys.trainees(filter), queryFn: () => adminService.getTrainees(filter) })
}

export function useAtRiskTrainees() {
  return useQuery({ queryKey: adminKeys.atRisk, queryFn: adminService.getAtRiskTrainees })
}

export function useTraineeDetail(traineeId: string | undefined) {
  return useQuery({
    queryKey: adminKeys.traineeDetail(traineeId ?? ''),
    queryFn: () => adminService.getTraineeDetail(traineeId as string),
    enabled: Boolean(traineeId),
  })
}

export function useCohortOverviewStats() {
  return useQuery({ queryKey: adminKeys.overview, queryFn: adminService.getCohortOverviewStats })
}

export function useCohortDailyCompletion() {
  return useQuery({ queryKey: progressKeys.cohortDaily, queryFn: progressService.getCohortDailyCompletion })
}

export function useCohortQuizPerformance() {
  return useQuery({ queryKey: progressKeys.cohortQuiz, queryFn: progressService.getCohortQuizPerformance })
}

export function useAssignmentStatusBreakdown(dayId?: string) {
  return useQuery({
    queryKey: adminKeys.assignmentStatus(dayId),
    queryFn: () => adminService.getAssignmentStatusBreakdown(dayId),
  })
}

export function useAtRiskThresholds() {
  return useQuery({ queryKey: adminKeys.thresholds, queryFn: adminService.getAtRiskThresholds })
}

export function useSetAtRiskThresholds() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (thresholds: AtRiskThresholds) => adminService.setAtRiskThresholds(thresholds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.thresholds })
      queryClient.invalidateQueries({ queryKey: ['progress'] })
      queryClient.invalidateQueries({ queryKey: ['admin'] })
    },
  })
}

export function useAllGithubSubmissions() {
  return useQuery({ queryKey: adminKeys.githubSubmissions, queryFn: submissionService.getAllGithubSubmissions })
}

export function useAllAssignmentSubmissions() {
  return useQuery({ queryKey: adminKeys.assignmentSubmissions, queryFn: assignmentService.getAllAssignmentSubmissions })
}

function invalidateAfterEvaluation(queryClient: ReturnType<typeof useQueryClient>, traineeId: string) {
  queryClient.invalidateQueries({ queryKey: ['progress'] })
  queryClient.invalidateQueries({ queryKey: ['admin'] })
  queryClient.invalidateQueries({ queryKey: adminKeys.traineeDetail(traineeId) })
  queryClient.invalidateQueries({ queryKey: ['notifications', traineeId] })
}

export function useEvaluateGithubSubmission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: Parameters<typeof adminService.evaluateGithubSubmission>[1] & { submissionId: string; traineeId: string }) =>
      adminService.evaluateGithubSubmission(input.submissionId, input),
    onSuccess: (_data, variables) => invalidateAfterEvaluation(queryClient, variables.traineeId),
  })
}

export function useEvaluateAssignmentSubmission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: Parameters<typeof adminService.evaluateAssignmentSubmission>[1] & { submissionId: string; traineeId: string }) =>
      adminService.evaluateAssignmentSubmission(input.submissionId, input),
    onSuccess: (_data, variables) => invalidateAfterEvaluation(queryClient, variables.traineeId),
  })
}

export function useExportCohortCsv() {
  return useMutation({ mutationFn: adminService.exportCohortProgressCsv })
}
