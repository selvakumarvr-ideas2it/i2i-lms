import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as assignmentService from '@/services/assignmentService'
import * as submissionService from '@/services/submissionService'
import { useInvalidateProgress } from '@/hooks/useProgress'
import type { AssignmentSubmissionInput } from '@/services/assignmentService'
import type { GithubSubmissionInput } from '@/services/submissionService'
import type { SubmissionContextType } from '@/domain/submission'

const submissionKeys = {
  github: (traineeId: string, contextType: SubmissionContextType, contextId: string) =>
    ['github-submission', traineeId, contextType, contextId] as const,
  githubList: (traineeId: string) => ['github-submissions', traineeId] as const,
  assignment: (traineeId: string, assignmentId: string) => ['assignment-submission', traineeId, assignmentId] as const,
  assignmentList: (traineeId: string) => ['assignment-submissions', traineeId] as const,
}

export function useGithubSubmission(traineeId: string | undefined, contextType: SubmissionContextType, contextId: string | undefined) {
  return useQuery({
    queryKey: submissionKeys.github(traineeId ?? '', contextType, contextId ?? ''),
    queryFn: async () => (await submissionService.getSubmission(traineeId as string, contextType, contextId as string)) ?? null,
    enabled: Boolean(traineeId && contextId),
  })
}

export function useGithubSubmissionsForTrainee(traineeId: string | undefined) {
  return useQuery({
    queryKey: submissionKeys.githubList(traineeId ?? ''),
    queryFn: () => submissionService.getSubmissionsForTrainee(traineeId as string),
    enabled: Boolean(traineeId),
  })
}

export function useSubmitGithubRepo(traineeId: string, contextType: SubmissionContextType, contextId: string, dayId: string | null) {
  const queryClient = useQueryClient()
  const invalidateProgress = useInvalidateProgress()
  return useMutation({
    mutationFn: (input: GithubSubmissionInput) => submissionService.submitGithubRepo(traineeId, contextType, contextId, dayId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: submissionKeys.github(traineeId, contextType, contextId) })
      queryClient.invalidateQueries({ queryKey: submissionKeys.githubList(traineeId) })
      invalidateProgress(traineeId)
    },
  })
}

export function useAssignmentSubmission(traineeId: string | undefined, assignmentId: string | undefined) {
  return useQuery({
    queryKey: submissionKeys.assignment(traineeId ?? '', assignmentId ?? ''),
    queryFn: async () => (await assignmentService.getSubmission(traineeId as string, assignmentId as string)) ?? null,
    enabled: Boolean(traineeId && assignmentId),
  })
}

export function useAssignmentSubmissionsForTrainee(traineeId: string | undefined) {
  return useQuery({
    queryKey: submissionKeys.assignmentList(traineeId ?? ''),
    queryFn: () => assignmentService.getSubmissionsForTrainee(traineeId as string),
    enabled: Boolean(traineeId),
  })
}

export function useSubmitAssignment(traineeId: string, dayId: string, assignmentId: string) {
  const queryClient = useQueryClient()
  const invalidateProgress = useInvalidateProgress()
  return useMutation({
    mutationFn: (input: AssignmentSubmissionInput) => assignmentService.submitAssignment(traineeId, dayId, assignmentId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: submissionKeys.assignment(traineeId, assignmentId) })
      queryClient.invalidateQueries({ queryKey: submissionKeys.assignmentList(traineeId) })
      invalidateProgress(traineeId)
    },
  })
}
