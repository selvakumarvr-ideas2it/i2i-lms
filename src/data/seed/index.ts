import { COURSE, MODULES, DAYS, STUDY_MATERIALS, EXERCISES, ASSIGNMENTS } from './course.seed'
import { QUIZZES } from './quiz.seed'
import { CAPSTONES } from './capstones.seed'
import { ADMIN_USER, TRAINEES } from './users.seed'
import { generateProgressData } from './progressGenerator'
import type { SeedDatabase } from './types'
import type { AtRiskThresholds } from '@/domain/progress'

const DEFAULT_AT_RISK_THRESHOLDS: AtRiskThresholds = {
  minProgressPercent: 50,
  inactivityDays: 2,
  minQuizAveragePercent: 60,
  maxOverdueAssignments: 2,
  gracePeriodDays: 1,
  courseStartDate: null,
}

export function buildSeedDatabase(): SeedDatabase {
  const generated = generateProgressData({
    trainees: TRAINEES,
    days: DAYS,
    quizzes: QUIZZES,
    assignments: ASSIGNMENTS,
    adminId: ADMIN_USER.id,
  })

  return {
    course: COURSE,
    modules: MODULES,
    days: DAYS,
    studyMaterials: STUDY_MATERIALS,
    exercises: EXERCISES,
    quizzes: QUIZZES,
    assignments: ASSIGNMENTS,
    capstones: CAPSTONES,
    users: [ADMIN_USER, ...TRAINEES],
    atRiskThresholds: DEFAULT_AT_RISK_THRESHOLDS,
    ...generated,
  }
}
