import type { AtRiskThresholds } from '@/domain/progress'

export interface AtRiskInput {
  /** Completion across only the days scheduled so far, not the whole course — see computeCompletionToDatePercent. */
  completionToDatePercent: number
  quizAveragePercent: number
  lastActiveAt: string | null
  overdueAssignmentsCount: number
  /** ISO timestamp the trainee joined the cohort — see AtRiskThresholds.gracePeriodDays. */
  joinedAt: string
  now?: Date
}

const MS_PER_DAY = 1000 * 60 * 60 * 24

export function computeAtRiskReasons(input: AtRiskInput, thresholds: AtRiskThresholds): string[] {
  const now = input.now ?? new Date()

  // The grace period is measured from whichever is LATER: the cohort's overall course
  // start date, or this specific trainee's own joinedAt. Most trainees are added to the
  // Users table during onboarding prep, days or weeks before training actually starts —
  // joinedAt alone would never trigger a grace period for them on day one. courseStartDate
  // covers "the whole cohort starts today"; joinedAt still covers a straggler added mid-course.
  const joinedAt = new Date(input.joinedAt).getTime()
  const courseStartDate = thresholds.courseStartDate ? new Date(thresholds.courseStartDate).getTime() : joinedAt
  const referenceDate = Math.max(joinedAt, courseStartDate)
  const daysEnrolled = (now.getTime() - referenceDate) / MS_PER_DAY
  const gracePeriodDays = thresholds.gracePeriodDays ?? 1
  if (daysEnrolled < gracePeriodDays) return []

  const reasons: string[] = []

  if (input.completionToDatePercent < thresholds.minProgressPercent) {
    reasons.push(`Completion to date is ${input.completionToDatePercent}%, below the ${thresholds.minProgressPercent}% threshold`)
  }

  if (input.lastActiveAt) {
    const daysInactive = (now.getTime() - new Date(input.lastActiveAt).getTime()) / MS_PER_DAY
    if (daysInactive >= thresholds.inactivityDays) {
      reasons.push(`No activity for ${Math.floor(daysInactive)} day(s)`)
    }
  } else {
    reasons.push('No recorded activity yet')
  }

  if (input.quizAveragePercent > 0 && input.quizAveragePercent < thresholds.minQuizAveragePercent) {
    reasons.push(`Quiz average is ${input.quizAveragePercent}%, below the ${thresholds.minQuizAveragePercent}% threshold`)
  }

  if (input.overdueAssignmentsCount > thresholds.maxOverdueAssignments) {
    reasons.push(`${input.overdueAssignmentsCount} overdue assignments`)
  }

  return reasons
}
