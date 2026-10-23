import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/routes'
import type { LearningDay } from '@/domain/course'
import type { DerivedDayProgress, OverallStatus } from '@/domain/progress'

function pillClasses(status: OverallStatus, isCurrent: boolean) {
  if (status === 'COMPLETED') return 'bg-success-500 text-white'
  if (isCurrent || status === 'IN_PROGRESS') return 'brand-gradient-accent text-white ring-2 ring-brand-300 ring-offset-2'
  return 'bg-slate-100 text-muted'
}

export function DayProgressStrip({
  days,
  derivedByDayId,
  currentDayId,
}: {
  days: LearningDay[]
  derivedByDayId: Map<string, DerivedDayProgress>
  currentDayId: string | undefined
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Days</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {days.map((day) => {
            const status = derivedByDayId.get(day.id)?.overallStatus ?? 'NOT_STARTED'
            const isCurrent = day.id === currentDayId
            return (
              <Link
                key={day.id}
                to={ROUTES.learningDay(day.id)}
                title={`Day ${day.dayNumber}: ${day.title}`}
                className={cn(
                  'focus-ring flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-full text-xs font-bold transition-transform hover:scale-105',
                  pillClasses(status, isCurrent),
                )}
              >
                {status === 'COMPLETED' ? <Check className="h-4 w-4" aria-hidden /> : day.dayNumber}
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
