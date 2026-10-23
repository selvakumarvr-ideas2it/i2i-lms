import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as quizService from '@/services/quizService'
import { useInvalidateProgress } from '@/hooks/useProgress'
import type { QuizAnswer } from '@/domain/quiz'

const quizAttemptKeys = {
  list: (traineeId: string, quizId: string) => ['quiz-attempts', traineeId, quizId] as const,
}

export function useQuizAttempts(traineeId: string | undefined, quizId: string | undefined) {
  return useQuery({
    queryKey: quizAttemptKeys.list(traineeId ?? '', quizId ?? ''),
    queryFn: () => quizService.getAttempts(traineeId as string, quizId as string),
    enabled: Boolean(traineeId && quizId),
  })
}

export function useSubmitQuizAttempt(traineeId: string, dayId: string, quizId: string) {
  const queryClient = useQueryClient()
  const invalidateProgress = useInvalidateProgress()
  return useMutation({
    mutationFn: (answers: QuizAnswer[]) => quizService.submitAttempt(traineeId, dayId, quizId, answers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizAttemptKeys.list(traineeId, quizId) })
      invalidateProgress(traineeId)
    },
  })
}
