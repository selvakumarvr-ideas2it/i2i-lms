import { useQuery } from '@tanstack/react-query'
import { searchCourseContent } from '@/services/searchService'

export function useSearchQuery(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => searchCourseContent(query),
    enabled: query.trim().length >= 2,
  })
}
