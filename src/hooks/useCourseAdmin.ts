import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as courseService from '@/services/courseService'
import { courseKeys } from '@/hooks/useCourse'
import type { Assignment } from '@/domain/assignment'
import type { Exercise, LearningDay, StudyMaterial } from '@/domain/course'
import type { Quiz } from '@/domain/quiz'

function invalidateCourse(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ['course'] })
}

export function useUpdateDay() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<LearningDay> }) => courseService.updateDay(id, patch),
    onSuccess: (day) => {
      invalidateCourse(queryClient)
      queryClient.invalidateQueries({ queryKey: courseKeys.day(day.id) })
    },
  })
}

export function useSetDayPublished() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) => courseService.setDayPublished(id, isPublished),
    onSuccess: () => invalidateCourse(queryClient),
  })
}

export function useUpdateStudyMaterial() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<StudyMaterial> }) => courseService.updateStudyMaterial(id, patch),
    onSuccess: (item) => queryClient.invalidateQueries({ queryKey: courseKeys.studyMaterial(item.id) }),
  })
}

export function useUpdateExercise() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Exercise> }) => courseService.updateExercise(id, patch),
    onSuccess: (item) => queryClient.invalidateQueries({ queryKey: courseKeys.exercise(item.id) }),
  })
}

export function useUpdateQuiz() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Quiz> }) => courseService.updateQuiz(id, patch),
    onSuccess: (item) => queryClient.invalidateQueries({ queryKey: courseKeys.quiz(item.id) }),
  })
}

export function useUpdateAssignment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Assignment> }) => courseService.updateAssignment(id, patch),
    onSuccess: (item) => queryClient.invalidateQueries({ queryKey: courseKeys.assignment(item.id) }),
  })
}
