import type { Repositories } from '../repositories/interfaces'

export type SearchResultType = 'STUDY' | 'EXERCISE' | 'ASSIGNMENT' | 'QUIZ'

/**
 * `contentId` is the study-material/exercise/assignment/quiz id — the backend has no
 * business knowing frontend route shapes, so unlike the old mock implementation this
 * does NOT return a `linkPath`; the frontend's `searchService.ts` maps `contentId`
 * through `ROUTES.*` itself before handing results to `SearchPage.tsx`.
 */
export interface SearchResult {
  type: SearchResultType
  dayId: string
  dayNumber: number
  dayTitle: string
  title: string
  snippet: string
  contentId: string
}

function snippetAround(text: string, query: string, radius = 90): string {
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text.slice(0, radius * 2).trim()
  const start = Math.max(0, idx - radius)
  const end = Math.min(text.length, idx + query.length + radius)
  const prefix = start > 0 ? '…' : ''
  const suffix = end < text.length ? '…' : ''
  return `${prefix}${text.slice(start, end).trim()}${suffix}`
}

export function createSearchService(repos: Repositories) {
  return {
    async searchCourseContent(query: string): Promise<SearchResult[]> {
      const q = query.trim().toLowerCase()
      if (q.length < 2) return []

      const [days, studyMaterials, exercises, assignments, quizzes] = await Promise.all([
        repos.courseContent.getDays(),
        repos.courseContent.getStudyMaterials(),
        repos.courseContent.getExercises(),
        repos.courseContent.getAssignments(),
        repos.courseContent.getQuizzes(),
      ])
      const dayById = new Map(days.map((d) => [d.id, d]))
      const results: SearchResult[] = []

      for (const material of studyMaterials) {
        const haystack = `${material.title}\n${material.markdownContent}`
        if (!haystack.toLowerCase().includes(q)) continue
        const day = dayById.get(material.dayId)
        if (!day) continue
        results.push({
          type: 'STUDY',
          dayId: day.id,
          dayNumber: day.dayNumber,
          dayTitle: day.title,
          title: material.title,
          snippet: snippetAround(material.markdownContent, q),
          contentId: material.id,
        })
      }

      for (const exercise of exercises) {
        const haystack = `${exercise.title}\n${exercise.objective}\n${exercise.businessScenario}`
        if (!haystack.toLowerCase().includes(q)) continue
        const day = dayById.get(exercise.dayId)
        if (!day) continue
        results.push({
          type: 'EXERCISE',
          dayId: day.id,
          dayNumber: day.dayNumber,
          dayTitle: day.title,
          title: exercise.title,
          snippet: snippetAround(exercise.objective, q),
          contentId: exercise.id,
        })
      }

      for (const assignment of assignments) {
        const haystack = `${assignment.title}\n${assignment.objective}\n${assignment.businessContext}`
        if (!haystack.toLowerCase().includes(q)) continue
        const day = dayById.get(assignment.dayId)
        if (!day) continue
        results.push({
          type: 'ASSIGNMENT',
          dayId: day.id,
          dayNumber: day.dayNumber,
          dayTitle: day.title,
          title: assignment.title,
          snippet: snippetAround(assignment.objective, q),
          contentId: assignment.id,
        })
      }

      for (const quiz of quizzes) {
        const day = dayById.get(quiz.dayId)
        if (!day) continue
        const matchingTopics = new Set<string>()
        for (const question of quiz.questions) {
          const haystack = `${question.topic}\n${question.question}`
          if (haystack.toLowerCase().includes(q)) matchingTopics.add(question.topic)
        }
        if (matchingTopics.size === 0 && !quiz.title.toLowerCase().includes(q)) continue
        results.push({
          type: 'QUIZ',
          dayId: day.id,
          dayNumber: day.dayNumber,
          dayTitle: day.title,
          title: quiz.title,
          snippet: matchingTopics.size > 0 ? `Topics: ${[...matchingTopics].join(', ')}` : quiz.title,
          contentId: quiz.id,
        })
      }

      return results.sort((a, b) => a.dayNumber - b.dayNumber)
    },
  }
}

export type SearchService = ReturnType<typeof createSearchService>
