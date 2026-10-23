import { apiFetch } from '@/services/http'
import type { Capstone, Course, CourseModule, Exercise, LearningDay, StudyMaterial } from '@/domain/course'
import type { Quiz } from '@/domain/quiz'
import type { Assignment } from '@/domain/assignment'

export async function getCourse(): Promise<Course> {
  return apiFetch('/api/course')
}

export async function getModules(): Promise<CourseModule[]> {
  return apiFetch('/api/course/modules')
}

export async function getDays(): Promise<LearningDay[]> {
  return apiFetch('/api/course/days')
}

export async function getDay(dayId: string): Promise<LearningDay | undefined> {
  return apiFetch(`/api/course/days/${dayId}`)
}

export async function getStudyMaterials(): Promise<StudyMaterial[]> {
  return apiFetch('/api/study-materials')
}

export async function getStudyMaterial(id: string): Promise<StudyMaterial | undefined> {
  return apiFetch(`/api/study-materials/${id}`)
}

export async function getExercises(): Promise<Exercise[]> {
  return apiFetch('/api/exercises')
}

export async function getExercise(id: string): Promise<Exercise | undefined> {
  return apiFetch(`/api/exercises/${id}`)
}

export async function getQuizzes(): Promise<Quiz[]> {
  return apiFetch('/api/quizzes')
}

export async function getQuiz(id: string): Promise<Quiz | undefined> {
  return apiFetch(`/api/quizzes/${id}`)
}

export async function getAssignments(): Promise<Assignment[]> {
  return apiFetch('/api/assignments')
}

export async function getAssignment(id: string): Promise<Assignment | undefined> {
  return apiFetch(`/api/assignments/${id}`)
}

export async function getCapstones(): Promise<Capstone[]> {
  return apiFetch('/api/capstones')
}

export async function getCapstone(id: string): Promise<Capstone | undefined> {
  const capstones = await getCapstones()
  return capstones.find((c) => c.id === id)
}

export async function updateDay(id: string, patch: Partial<LearningDay>): Promise<LearningDay> {
  return apiFetch(`/api/manage/course/days/${id}`, { method: 'PATCH', body: JSON.stringify(patch) })
}

export async function setDayPublished(id: string, isPublished: boolean): Promise<LearningDay> {
  return apiFetch(`/api/manage/course/days/${id}/publish`, { method: 'PATCH', body: JSON.stringify({ isPublished }) })
}

export async function updateStudyMaterial(id: string, patch: Partial<StudyMaterial>): Promise<StudyMaterial> {
  return apiFetch(`/api/manage/study-materials/${id}`, { method: 'PATCH', body: JSON.stringify(patch) })
}

export async function updateExercise(id: string, patch: Partial<Exercise>): Promise<Exercise> {
  return apiFetch(`/api/manage/exercises/${id}`, { method: 'PATCH', body: JSON.stringify(patch) })
}

export async function updateQuiz(id: string, patch: Partial<Quiz>): Promise<Quiz> {
  return apiFetch(`/api/manage/quizzes/${id}`, { method: 'PATCH', body: JSON.stringify(patch) })
}

export async function updateAssignment(id: string, patch: Partial<Assignment>): Promise<Assignment> {
  return apiFetch(`/api/manage/assignments/${id}`, { method: 'PATCH', body: JSON.stringify(patch) })
}
