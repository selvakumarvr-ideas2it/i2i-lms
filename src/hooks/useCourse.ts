import { useQuery } from '@tanstack/react-query'
import * as courseService from '@/services/courseService'

export const courseKeys = {
  course: ['course'] as const,
  modules: ['course', 'modules'] as const,
  days: ['course', 'days'] as const,
  day: (id: string) => ['course', 'day', id] as const,
  studyMaterial: (id: string) => ['course', 'study', id] as const,
  exercise: (id: string) => ['course', 'exercise', id] as const,
  quiz: (id: string) => ['course', 'quiz', id] as const,
  assignment: (id: string) => ['course', 'assignment', id] as const,
  capstones: ['course', 'capstones'] as const,
  studyMaterials: ['course', 'study-materials'] as const,
  exercises: ['course', 'exercises'] as const,
  quizzes: ['course', 'quizzes'] as const,
  assignments: ['course', 'assignments'] as const,
}

export function useCourseQuery() {
  return useQuery({ queryKey: courseKeys.course, queryFn: courseService.getCourse })
}

export function useDaysQuery() {
  return useQuery({ queryKey: courseKeys.days, queryFn: courseService.getDays })
}

export function useDayQuery(dayId: string | undefined) {
  return useQuery({
    queryKey: courseKeys.day(dayId ?? ''),
    queryFn: async () => (await courseService.getDay(dayId as string)) ?? null,
    enabled: Boolean(dayId),
  })
}

export function useStudyMaterialQuery(id: string | undefined) {
  return useQuery({
    queryKey: courseKeys.studyMaterial(id ?? ''),
    queryFn: async () => (await courseService.getStudyMaterial(id as string)) ?? null,
    enabled: Boolean(id),
  })
}

export function useExerciseQuery(id: string | undefined) {
  return useQuery({
    queryKey: courseKeys.exercise(id ?? ''),
    queryFn: async () => (await courseService.getExercise(id as string)) ?? null,
    enabled: Boolean(id),
  })
}

export function useQuizQuery(id: string | undefined) {
  return useQuery({
    queryKey: courseKeys.quiz(id ?? ''),
    queryFn: async () => (await courseService.getQuiz(id as string)) ?? null,
    enabled: Boolean(id),
  })
}

export function useAssignmentQuery(id: string | undefined) {
  return useQuery({
    queryKey: courseKeys.assignment(id ?? ''),
    queryFn: async () => (await courseService.getAssignment(id as string)) ?? null,
    enabled: Boolean(id),
  })
}

export function useCapstonesQuery() {
  return useQuery({ queryKey: courseKeys.capstones, queryFn: courseService.getCapstones })
}

export function useStudyMaterialsQuery() {
  return useQuery({ queryKey: courseKeys.studyMaterials, queryFn: courseService.getStudyMaterials })
}

export function useExercisesQuery() {
  return useQuery({ queryKey: courseKeys.exercises, queryFn: courseService.getExercises })
}

export function useQuizzesQuery() {
  return useQuery({ queryKey: courseKeys.quizzes, queryFn: courseService.getQuizzes })
}

export function useAssignmentsQuery() {
  return useQuery({ queryKey: courseKeys.assignments, queryFn: courseService.getAssignments })
}
