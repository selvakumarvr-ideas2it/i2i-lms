import { apiFetch } from '@/services/http'
import { ROUTES } from '@/routes'

export type SearchResultType = 'STUDY' | 'EXERCISE' | 'ASSIGNMENT' | 'QUIZ'

export interface SearchResult {
  type: SearchResultType
  dayId: string
  dayNumber: number
  dayTitle: string
  title: string
  snippet: string
  linkPath: string
}

interface BackendSearchResult {
  type: SearchResultType
  dayId: string
  dayNumber: number
  dayTitle: string
  title: string
  snippet: string
  contentId: string
}

const LINK_BUILDERS: Record<SearchResultType, (contentId: string) => string> = {
  STUDY: ROUTES.study,
  EXERCISE: ROUTES.exercise,
  ASSIGNMENT: ROUTES.assignment,
  QUIZ: ROUTES.quiz,
}

export async function searchCourseContent(query: string): Promise<SearchResult[]> {
  if (query.trim().length < 2) return []
  const results = await apiFetch<BackendSearchResult[]>(`/api/search?q=${encodeURIComponent(query)}`)
  return results.map(({ contentId, ...rest }) => ({ ...rest, linkPath: LINK_BUILDERS[rest.type](contentId) }))
}
