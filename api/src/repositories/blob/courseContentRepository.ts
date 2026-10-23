import { CONTAINER_NAMES } from '../blobClientFactory'
import { readJson, writeJson } from './jsonBlobStore'
import { notFound } from '../../http/respond'
import type {
  CourseContentRepository,
} from '../interfaces'
import type { Capstone, Course, CourseModule, Exercise, LearningDay, StudyMaterial } from '../../../../src/domain/course'
import type { Quiz } from '../../../../src/domain/quiz'
import type { Assignment } from '../../../../src/domain/assignment'

const CONTAINER = CONTAINER_NAMES.courseContent

async function readArray<T>(blobPath: string): Promise<T[]> {
  return (await readJson<T[]>(CONTAINER, blobPath)) ?? []
}

async function updateOne<T extends { id: string }>(blobPath: string, id: string, patch: Partial<T>, label: string): Promise<T> {
  const items = await readArray<T>(blobPath)
  const index = items.findIndex((item) => item.id === id)
  if (index === -1) notFound(`${label} not found: ${id}`)
  const updated = { ...items[index], ...patch } as T
  items[index] = updated
  await writeJson(CONTAINER, blobPath, items)
  return updated
}

export function createBlobCourseContentRepository(): CourseContentRepository {
  return {
    async getCourse() {
      const course = await readJson<Course>(CONTAINER, 'course.json')
      if (!course) notFound('Course content has not been seeded yet — run `npm run seed:course` in api/.')
      return course
    },

    getModules: () => readArray<CourseModule>('modules.json'),
    getDays: () => readArray<LearningDay>('days.json'),
    async getDay(id) {
      const days = await readArray<LearningDay>('days.json')
      return days.find((d) => d.id === id) ?? null
    },
    updateDay: (id, patch) => updateOne<LearningDay>('days.json', id, patch, 'Day'),

    getStudyMaterials: () => readArray<StudyMaterial>('study-materials.json'),
    async getStudyMaterial(id) {
      const items = await readArray<StudyMaterial>('study-materials.json')
      return items.find((m) => m.id === id) ?? null
    },
    updateStudyMaterial: (id, patch) => updateOne<StudyMaterial>('study-materials.json', id, patch, 'Study material'),

    getExercises: () => readArray<Exercise>('exercises.json'),
    async getExercise(id) {
      const items = await readArray<Exercise>('exercises.json')
      return items.find((e) => e.id === id) ?? null
    },
    updateExercise: (id, patch) => updateOne<Exercise>('exercises.json', id, patch, 'Exercise'),

    getQuizzes: () => readArray<Quiz>('quizzes.json'),
    async getQuiz(id) {
      const items = await readArray<Quiz>('quizzes.json')
      return items.find((q) => q.id === id) ?? null
    },
    updateQuiz: (id, patch) => updateOne<Quiz>('quizzes.json', id, patch, 'Quiz'),

    getAssignments: () => readArray<Assignment>('assignments.json'),
    async getAssignment(id) {
      const items = await readArray<Assignment>('assignments.json')
      return items.find((a) => a.id === id) ?? null
    },
    updateAssignment: (id, patch) => updateOne<Assignment>('assignments.json', id, patch, 'Assignment'),

    getCapstones: () => readArray<Capstone>('capstones.json'),
  }
}
