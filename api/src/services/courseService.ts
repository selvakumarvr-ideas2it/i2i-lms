import type { Repositories } from '../repositories/interfaces'
import type { Exercise, LearningDay, StudyMaterial } from '../../../src/domain/course'
import type { Quiz } from '../../../src/domain/quiz'
import type { Assignment } from '../../../src/domain/assignment'
import { notFound } from '../http/respond'

export function createCourseService(repos: Repositories) {
  const content = repos.courseContent
  return {
    getCourse: () => content.getCourse(),
    getModules: () => content.getModules(),
    getDays: () => content.getDays(),
    async getDay(id: string): Promise<LearningDay> {
      const day = await content.getDay(id)
      if (!day) notFound(`Day not found: ${id}`)
      return day
    },
    updateDay: (id: string, patch: Partial<LearningDay>) => content.updateDay(id, patch),
    setDayPublished: (id: string, isPublished: boolean) => content.updateDay(id, { isPublished }),

    getStudyMaterials: () => content.getStudyMaterials(),
    async getStudyMaterial(id: string): Promise<StudyMaterial> {
      const item = await content.getStudyMaterial(id)
      if (!item) notFound(`Study material not found: ${id}`)
      return item
    },
    updateStudyMaterial: (id: string, patch: Partial<StudyMaterial>) => content.updateStudyMaterial(id, patch),

    getExercises: () => content.getExercises(),
    async getExercise(id: string): Promise<Exercise> {
      const item = await content.getExercise(id)
      if (!item) notFound(`Exercise not found: ${id}`)
      return item
    },
    updateExercise: (id: string, patch: Partial<Exercise>) => content.updateExercise(id, patch),

    getQuizzes: () => content.getQuizzes(),
    async getQuiz(id: string): Promise<Quiz> {
      const item = await content.getQuiz(id)
      if (!item) notFound(`Quiz not found: ${id}`)
      return item
    },
    updateQuiz: (id: string, patch: Partial<Quiz>) => content.updateQuiz(id, patch),

    getAssignments: () => content.getAssignments(),
    async getAssignment(id: string): Promise<Assignment> {
      const item = await content.getAssignment(id)
      if (!item) notFound(`Assignment not found: ${id}`)
      return item
    },
    updateAssignment: (id: string, patch: Partial<Assignment>) => content.updateAssignment(id, patch),

    getCapstones: () => content.getCapstones(),
  }
}

export type CourseService = ReturnType<typeof createCourseService>
