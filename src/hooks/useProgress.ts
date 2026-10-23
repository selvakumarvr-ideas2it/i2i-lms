import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as progressService from '@/services/progressService'

export const progressKeys = {
  derived: (traineeId: string) => ['progress', 'derived', traineeId] as const,
  summary: (traineeId: string) => ['progress', 'summary', traineeId] as const,
  nextDay: (traineeId: string) => ['progress', 'next-day', traineeId] as const,
  cohortSummaries: ['progress', 'cohort-summaries'] as const,
  cohortDaily: ['progress', 'cohort-daily'] as const,
  cohortQuiz: ['progress', 'cohort-quiz'] as const,
}

export function useDerivedProgress(traineeId: string | undefined) {
  return useQuery({
    queryKey: progressKeys.derived(traineeId ?? ''),
    queryFn: () => progressService.getDerivedProgressForTrainee(traineeId as string),
    enabled: Boolean(traineeId),
  })
}

export function useTraineeSummary(traineeId: string | undefined) {
  return useQuery({
    queryKey: progressKeys.summary(traineeId ?? ''),
    queryFn: () => progressService.getTraineeSummary(traineeId as string),
    enabled: Boolean(traineeId),
  })
}

export function useNextIncompleteDay(traineeId: string | undefined) {
  return useQuery({
    queryKey: progressKeys.nextDay(traineeId ?? ''),
    queryFn: () => progressService.getNextIncompleteDay(traineeId as string),
    enabled: Boolean(traineeId),
  })
}

/** Invalidate every progress-derived query for a trainee after a mutation touches their progress. */
export function useInvalidateProgress() {
  const queryClient = useQueryClient()
  return (traineeId: string) => {
    queryClient.invalidateQueries({ queryKey: ['progress'] })
    queryClient.invalidateQueries({ queryKey: progressKeys.derived(traineeId) })
    queryClient.invalidateQueries({ queryKey: progressKeys.summary(traineeId) })
    queryClient.invalidateQueries({ queryKey: progressKeys.nextDay(traineeId) })
  }
}

export function useMarkStudyComplete(traineeId: string) {
  const invalidate = useInvalidateProgress()
  return useMutation({
    mutationFn: (dayId: string) => progressService.markStudyComplete(traineeId, dayId),
    onSuccess: () => invalidate(traineeId),
  })
}

export function useMarkExerciseStarted(traineeId: string) {
  const invalidate = useInvalidateProgress()
  return useMutation({
    mutationFn: (dayId: string) => progressService.markExerciseStarted(traineeId, dayId),
    onSuccess: () => invalidate(traineeId),
  })
}

export function useMarkExerciseCompleted(traineeId: string) {
  const invalidate = useInvalidateProgress()
  return useMutation({
    mutationFn: (dayId: string) => progressService.markExerciseCompleted(traineeId, dayId),
    onSuccess: () => invalidate(traineeId),
  })
}
