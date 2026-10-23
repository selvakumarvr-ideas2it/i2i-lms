import { CONTAINER_NAMES } from '../blobClientFactory'
import { readJson, writeJson } from './jsonBlobStore'
import type { SettingsRepository } from '../interfaces'
import type { AtRiskThresholds } from '../../../../src/domain/progress'

const CONTAINER = CONTAINER_NAMES.courseContent
const BLOB_PATH = 'settings/at-risk-thresholds.json'

const DEFAULT_THRESHOLDS: AtRiskThresholds = {
  minProgressPercent: 50,
  inactivityDays: 2,
  minQuizAveragePercent: 60,
  maxOverdueAssignments: 2,
  gracePeriodDays: 1,
  courseStartDate: null,
}

export function createBlobSettingsRepository(): SettingsRepository {
  return {
    async getAtRiskThresholds() {
      // Merge over defaults, not replace — a thresholds blob saved before a new field
      // (like gracePeriodDays) existed would otherwise come back with that field
      // missing entirely, silently disabling whatever it's supposed to do.
      const stored = await readJson<AtRiskThresholds>(CONTAINER, BLOB_PATH)
      return { ...DEFAULT_THRESHOLDS, ...stored }
    },
    async setAtRiskThresholds(thresholds) {
      await writeJson(CONTAINER, BLOB_PATH, thresholds)
      return thresholds
    },
  }
}
