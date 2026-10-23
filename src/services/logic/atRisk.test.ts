import { describe, expect, it } from 'vitest'
import { computeAtRiskReasons } from './atRisk'
import type { AtRiskThresholds } from '@/domain/progress'

const thresholds: AtRiskThresholds = {
  minProgressPercent: 50,
  inactivityDays: 2,
  minQuizAveragePercent: 60,
  maxOverdueAssignments: 2,
  gracePeriodDays: 1,
  courseStartDate: null,
}

const now = new Date('2026-09-17T09:00:00.000Z')
const wellEnrolled = '2026-09-01T09:00:00.000Z' // long past the 1-day grace period

describe('computeAtRiskReasons', () => {
  it('returns no reasons for a healthy, active trainee', () => {
    const reasons = computeAtRiskReasons(
      {
        completionToDatePercent: 90,
        quizAveragePercent: 85,
        lastActiveAt: '2026-09-17T07:00:00.000Z',
        overdueAssignmentsCount: 0,
        joinedAt: wellEnrolled,
        now,
      },
      thresholds,
    )
    expect(reasons).toHaveLength(0)
  })

  it('flags low progress', () => {
    const reasons = computeAtRiskReasons(
      {
        completionToDatePercent: 30,
        quizAveragePercent: 85,
        lastActiveAt: now.toISOString(),
        overdueAssignmentsCount: 0,
        joinedAt: wellEnrolled,
        now,
      },
      thresholds,
    )
    expect(reasons.some((r) => r.includes('Completion to date'))).toBe(true)
  })

  it('flags inactivity at/over the threshold', () => {
    const reasons = computeAtRiskReasons(
      {
        completionToDatePercent: 90,
        quizAveragePercent: 85,
        lastActiveAt: '2026-09-14T09:00:00.000Z',
        overdueAssignmentsCount: 0,
        joinedAt: wellEnrolled,
        now,
      },
      thresholds,
    )
    expect(reasons.some((r) => r.includes('No activity'))).toBe(true)
  })

  it('flags a trainee with no recorded activity at all', () => {
    const reasons = computeAtRiskReasons(
      {
        completionToDatePercent: 90,
        quizAveragePercent: 85,
        lastActiveAt: null,
        overdueAssignmentsCount: 0,
        joinedAt: wellEnrolled,
        now,
      },
      thresholds,
    )
    expect(reasons).toContain('No recorded activity yet')
  })

  it('flags low quiz average but ignores a 0 (no quizzes taken yet)', () => {
    const zeroReasons = computeAtRiskReasons(
      {
        completionToDatePercent: 90,
        quizAveragePercent: 0,
        lastActiveAt: now.toISOString(),
        overdueAssignmentsCount: 0,
        joinedAt: wellEnrolled,
        now,
      },
      thresholds,
    )
    expect(zeroReasons.some((r) => r.includes('Quiz average'))).toBe(false)

    const lowReasons = computeAtRiskReasons(
      {
        completionToDatePercent: 90,
        quizAveragePercent: 40,
        lastActiveAt: now.toISOString(),
        overdueAssignmentsCount: 0,
        joinedAt: wellEnrolled,
        now,
      },
      thresholds,
    )
    expect(lowReasons.some((r) => r.includes('Quiz average'))).toBe(true)
  })

  it('flags overdue assignments beyond the max', () => {
    const reasons = computeAtRiskReasons(
      {
        completionToDatePercent: 90,
        quizAveragePercent: 85,
        lastActiveAt: now.toISOString(),
        overdueAssignmentsCount: 3,
        joinedAt: wellEnrolled,
        now,
      },
      thresholds,
    )
    expect(reasons.some((r) => r.includes('overdue assignments'))).toBe(true)
  })

  it('never flags a trainee still inside the grace period, no matter how bad every other signal looks', () => {
    const reasons = computeAtRiskReasons(
      {
        completionToDatePercent: 0,
        quizAveragePercent: 0,
        lastActiveAt: null,
        overdueAssignmentsCount: 5,
        joinedAt: now.toISOString(), // joined this instant
        now,
      },
      thresholds,
    )
    expect(reasons).toHaveLength(0)
  })

  it('starts flagging again as soon as the grace period elapses', () => {
    const joinedJustOverADayAgo = new Date(now.getTime() - 25 * 60 * 60 * 1000).toISOString()
    const reasons = computeAtRiskReasons(
      {
        completionToDatePercent: 0,
        quizAveragePercent: 0,
        lastActiveAt: null,
        overdueAssignmentsCount: 0,
        joinedAt: joinedJustOverADayAgo,
        now,
      },
      thresholds,
    )
    expect(reasons.length).toBeGreaterThan(0)
  })

  it('applies the grace period from courseStartDate even when every trainee joined weeks earlier during onboarding prep', () => {
    const reasons = computeAtRiskReasons(
      {
        completionToDatePercent: 0,
        quizAveragePercent: 0,
        lastActiveAt: null,
        overdueAssignmentsCount: 0,
        joinedAt: '2026-08-18T09:00:00.000Z', // account created weeks before training actually starts
        now,
      },
      { ...thresholds, courseStartDate: now.toISOString() }, // course starts exactly "now"
    )
    expect(reasons).toHaveLength(0)
  })

  it('uses the later of courseStartDate and joinedAt, so a straggler added mid-course still gets their own grace period', () => {
    const reasons = computeAtRiskReasons(
      {
        completionToDatePercent: 0,
        quizAveragePercent: 0,
        lastActiveAt: null,
        overdueAssignmentsCount: 0,
        joinedAt: now.toISOString(), // added this instant, mid-cohort
        now,
      },
      { ...thresholds, courseStartDate: '2026-08-18T09:00:00.000Z' }, // course started weeks ago
    )
    expect(reasons).toHaveLength(0)
  })

  it('resumes evaluating normally once courseStartDate is long enough in the past', () => {
    const reasons = computeAtRiskReasons(
      {
        completionToDatePercent: 0,
        quizAveragePercent: 0,
        lastActiveAt: null,
        overdueAssignmentsCount: 0,
        joinedAt: '2026-08-18T09:00:00.000Z',
        now,
      },
      { ...thresholds, courseStartDate: '2026-08-18T09:00:00.000Z' },
    )
    expect(reasons.length).toBeGreaterThan(0)
  })
})
