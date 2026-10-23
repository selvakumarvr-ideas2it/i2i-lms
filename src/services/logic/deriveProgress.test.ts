import { describe, expect, it } from 'vitest'
import {
  computeCompletionToDatePercent,
  computeOverallCompletionPercent,
  computeQuizAverage,
  deriveDayProgress,
  findNextIncompleteDay,
} from './deriveProgress'
import type { DerivedDayProgress, LearningProgress } from '@/domain/progress'

function baseProgress(overrides: Partial<LearningProgress> = {}): LearningProgress {
  return {
    traineeId: 't1',
    dayId: 'day-1',
    studyCompleted: false,
    exerciseStarted: false,
    exerciseCompleted: false,
    quizCompleted: false,
    quizScorePercent: null,
    quizAttempts: 0,
    githubSubmitted: false,
    assignmentSubmitted: false,
    lastUpdatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

describe('deriveDayProgress', () => {
  it('is NOT_STARTED when nothing is done', () => {
    const result = deriveDayProgress(baseProgress())
    expect(result.overallStatus).toBe('NOT_STARTED')
    expect(result.completionPercent).toBe(0)
  })

  it('is IN_PROGRESS once at least one flag or exerciseStarted is set', () => {
    const result = deriveDayProgress(baseProgress({ studyCompleted: true }))
    expect(result.overallStatus).toBe('IN_PROGRESS')
    expect(result.completionPercent).toBe(20)
  })

  it('is COMPLETED once every tracked flag for a day with an assignment is set', () => {
    const result = deriveDayProgress(
      baseProgress({
        studyCompleted: true,
        exerciseCompleted: true,
        quizCompleted: true,
        githubSubmitted: true,
        assignmentSubmitted: true,
      }),
    )
    expect(result.overallStatus).toBe('COMPLETED')
    expect(result.completionPercent).toBe(100)
  })

  it('excludes assignment from the denominator when the day has none (Day 9)', () => {
    const result = deriveDayProgress(
      baseProgress({ studyCompleted: true, exerciseCompleted: true, quizCompleted: true, githubSubmitted: true }),
      { hasAssignment: false },
    )
    expect(result.overallStatus).toBe('COMPLETED')
    expect(result.completionPercent).toBe(100)
  })
})

describe('findNextIncompleteDay', () => {
  const days = [
    { id: 'day-1', dayNumber: 1 },
    { id: 'day-2', dayNumber: 2 },
    { id: 'day-3', dayNumber: 3 },
  ]

  function derived(dayId: string, overallStatus: DerivedDayProgress['overallStatus']): DerivedDayProgress {
    return { ...baseProgress({ dayId }), overallStatus, completionPercent: overallStatus === 'COMPLETED' ? 100 : 0 }
  }

  it('returns the first day that is not COMPLETED', () => {
    const map = new Map([
      ['day-1', derived('day-1', 'COMPLETED')],
      ['day-2', derived('day-2', 'IN_PROGRESS')],
      ['day-3', derived('day-3', 'NOT_STARTED')],
    ])
    expect(findNextIncompleteDay(days, map)?.id).toBe('day-2')
  })

  it('falls back to the last day when everything is complete', () => {
    const map = new Map(days.map((d) => [d.id, derived(d.id, 'COMPLETED')]))
    expect(findNextIncompleteDay(days, map)?.id).toBe('day-3')
  })
})

describe('cohort aggregate helpers', () => {
  it('computes average completion and quiz percent, ignoring days without a score', () => {
    const derived: DerivedDayProgress[] = [
      { ...baseProgress(), overallStatus: 'COMPLETED', completionPercent: 100, quizScorePercent: 90 },
      { ...baseProgress(), overallStatus: 'NOT_STARTED', completionPercent: 0, quizScorePercent: null },
    ]
    expect(computeOverallCompletionPercent(derived)).toBe(50)
    expect(computeQuizAverage(derived)).toBe(90)
  })
})

describe('computeCompletionToDatePercent', () => {
  it('averages only the elapsed days, not diluted by days that have not happened yet', () => {
    const derived: DerivedDayProgress[] = [
      { ...baseProgress({ dayId: 'day-1' }), overallStatus: 'COMPLETED', completionPercent: 100 },
      { ...baseProgress({ dayId: 'day-2' }), overallStatus: 'COMPLETED', completionPercent: 100 },
      { ...baseProgress({ dayId: 'day-3' }), overallStatus: 'NOT_STARTED', completionPercent: 0 }, // not scheduled yet
    ]
    // Day 3 hasn't happened yet, so a trainee perfectly on pace through Day 1-2 should
    // score 100%, not get diluted down to 67% by an unstarted future day.
    expect(computeCompletionToDatePercent(derived, new Set(['day-1', 'day-2']))).toBe(100)
  })

  it('falls back to the whole-course average when no day has elapsed yet (schedule unset or course not started)', () => {
    const derived: DerivedDayProgress[] = [
      { ...baseProgress({ dayId: 'day-1' }), overallStatus: 'COMPLETED', completionPercent: 100 },
      { ...baseProgress({ dayId: 'day-2' }), overallStatus: 'NOT_STARTED', completionPercent: 0 },
    ]
    expect(computeCompletionToDatePercent(derived, new Set())).toBe(computeOverallCompletionPercent(derived))
  })

  it('correctly reflects a genuinely behind trainee even restricted to elapsed days', () => {
    const derived: DerivedDayProgress[] = [
      { ...baseProgress({ dayId: 'day-1' }), overallStatus: 'NOT_STARTED', completionPercent: 0 },
      { ...baseProgress({ dayId: 'day-2' }), overallStatus: 'NOT_STARTED', completionPercent: 0 },
      { ...baseProgress({ dayId: 'day-3' }), overallStatus: 'NOT_STARTED', completionPercent: 0 },
    ]
    expect(computeCompletionToDatePercent(derived, new Set(['day-1', 'day-2', 'day-3']))).toBe(0)
  })
})
