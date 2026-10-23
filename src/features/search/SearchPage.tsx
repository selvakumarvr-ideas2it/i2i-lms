import { useState } from 'react'
import { Search as SearchIcon } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { EmptyState, LoadingState } from '@/components/shared/States'
import { useSearchQuery } from '@/hooks/useSearch'
import type { SearchResultType } from '@/services/searchService'

const TYPE_LABEL: Record<SearchResultType, string> = {
  STUDY: 'Study Material',
  EXERCISE: 'Exercise',
  ASSIGNMENT: 'Assignment',
  QUIZ: 'Quiz',
}

export function SearchPage() {
  const [params, setParams] = useSearchParams()
  const [term, setTerm] = useState(params.get('q') ?? '')
  const query = params.get('q') ?? ''
  const { data: results, isLoading } = useSearchQuery(query)

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-xl font-semibold text-ink">Search the course</h1>
      <p className="mt-1 text-sm text-muted">Find study material, exercises, assignments and quiz topics across all 10 days.</p>

      <form
        className="relative mt-6"
        onSubmit={(e) => {
          e.preventDefault()
          setParams(term ? { q: term } : {})
        }}
      >
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <Input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search for CALCULATE, star schema, DirectQuery…"
          className="pl-9"
          autoFocus
        />
      </form>

      <div className="mt-6 space-y-3">
        {query.trim().length < 2 && (
          <EmptyState title="Start typing to search" description="Enter at least 2 characters to search study material, exercises, assignments and quizzes." />
        )}
        {query.trim().length >= 2 && isLoading && <LoadingState label="Searching…" />}
        {query.trim().length >= 2 && !isLoading && results?.length === 0 && (
          <EmptyState title={`No results for "${query}"`} description="Try a different keyword, e.g. a DAX function or topic name." />
        )}
        {results?.map((result) => (
          <Card key={`${result.type}-${result.linkPath}`}>
            <CardContent className="p-4">
              <Link to={result.linkPath} className="focus-ring block rounded-lg">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="brand">{TYPE_LABEL[result.type]}</Badge>
                  <span className="text-xs font-medium text-muted">
                    Day {result.dayNumber} — {result.dayTitle}
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold text-ink">{result.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{result.snippet}</p>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
