import type { DerivedDayProgress, LearningProgress, OverallStatus } from '@/domain/progress'

const TRACKED_FLAGS = ['studyCompleted', 'exerciseCompleted', 'quizCompleted', 'githubSubmitted', 'assignmentSubmitted'] as const

/**
 * A day with no assignment (Day 9, the capstone) only tracks study/exercise/quiz/github,
 * so callers pass `hasAssignment: false` to exclude it from the denominator.
 */
export function deriveDayProgress(
  progress: LearningProgress,
  options: { hasAssignment: boolean } = { hasAssignment: true },
): DerivedDayProgress {
  const flags = options.hasAssignment
    ? TRACKED_FLAGS
    : TRACKED_FLAGS.filter((flag) => flag !== 'assignmentSubmitted')

  const completedCount = flags.filter((flag) => progress[flag]).length
  const completionPercent = Math.round((completedCount / flags.length) * 100)

  let overallStatus: OverallStatus = 'NOT_STARTED'
  if (completedCount === flags.length) {
    overallStatus = 'COMPLETED'
  } else if (completedCount > 0 || progress.exerciseStarted) {
    overallStatus = 'IN_PROGRESS'
  }

  return { ...progress, overallStatus, completionPercent }
}

export function findNextIncompleteDay<T extends { id: string; dayNumber: number }>(
  days: T[],
  derivedByDayId: Map<string, DerivedDayProgress>,
): T | null {
  const sorted = [...days].sort((a, b) => a.dayNumber - b.dayNumber)
  const next = sorted.find((day) => derivedByDayId.get(day.id)?.overallStatus !== 'COMPLETED')
  return next ?? sorted.at(-1) ?? null
}

export function computeOverallCompletionPercent(derived: DerivedDayProgress[]): number {
  if (derived.length === 0) return 0
  const total = derived.reduce((sum, d) => sum + d.completionPercent, 0)
  return Math.round(total / derived.length)
}

/**
 * Completion across only the days that have actually happened so far (scheduledDate
 * <= now), not the whole course. computeOverallCompletionPercent dilutes progress with
 * every day still ahead — a trainee who has perfectly finished every elapsed day would
 * still show, say, 56% (5 of 9 days) on Day 5, which reads as "behind" when they're
 * actually exactly on pace. This is the metric that should drive at-risk detection;
 * computeOverallCompletionPercent remains correct for "how far through the whole
 * course" displays elsewhere.
 *
 * Falls back to the whole-course figure if no day has a scheduledDate in the past —
 * either the feature isn't configured yet, or the course genuinely hasn't started.
 */
export function computeCompletionToDatePercent(derived: DerivedDayProgress[], elapsedDayIds: Set<string>): number {
  const elapsed = derived.filter((d) => elapsedDayIds.has(d.dayId))
  if (elapsed.length === 0) return computeOverallCompletionPercent(derived)
  const total = elapsed.reduce((sum, d) => sum + d.completionPercent, 0)
  return Math.round(total / elapsed.length)
}

export function computeQuizAverage(derived: DerivedDayProgress[]): number {
  const scored = derived.filter((d) => d.quizScorePercent != null)
  if (scored.length === 0) return 0
  const total = scored.reduce((sum, d) => sum + (d.quizScorePercent ?? 0), 0)
  return Math.round(total / scored.length)
}
