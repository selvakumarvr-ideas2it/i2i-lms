export interface Course {
  id: string
  slug: string
  title: string
  description: string
  totalDays: number
  totalHours: number
  isPublished: boolean
}

export interface CourseModule {
  id: string
  courseId: string
  weekNumber: number
  title: string
}

export interface LearningDay {
  id: string
  courseId: string
  moduleId: string
  dayNumber: number
  weekNumber: number
  title: string
  description: string
  theoryHours: number
  labHours: number
  learningObjectives: string[]
  studyMaterialId: string
  exerciseId: string
  quizId: string
  assignmentId?: string
  isPublished: boolean
  /** Admin-controlled, informational only — ISO date (e.g. "2026-09-21"). Not read by any scheduling/at-risk logic. Null/unset if not scheduled yet. */
  scheduledDate: string | null
}

export interface StudyResource {
  label: string
  url: string
}

export interface StudyMaterial {
  id: string
  dayId: string
  title: string
  markdownContent: string
  resources: StudyResource[]
}

export interface Exercise {
  id: string
  dayId: string
  title: string
  objective: string
  businessScenario: string
  dataset: string
  requirements: string[]
  expectedOutcome: string
  hints: string[]
  acceptanceCriteria: string[]
}

export interface Capstone {
  id: string
  key: string
  title: string
  customerContext: string
  dataTables: string[]
  kpis: string[]
  pages: string[]
  pageContent: string[]
  acceptanceCriteria: string[]
}
