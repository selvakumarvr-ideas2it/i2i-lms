import { randomUUID } from 'node:crypto'
import type { Repositories } from '../repositories/interfaces'
import type { ActivityEventType } from '../../../src/domain/activity'

export function createActivityService(repos: Repositories) {
  return {
    logActivity(
      traineeId: string,
      type: ActivityEventType,
      dayId: string | null = null,
      metadata: Record<string, string | number | boolean> | null = null,
    ) {
      return repos.activity.append({
        id: randomUUID(),
        traineeId,
        type,
        dayId,
        metadata,
        timestamp: new Date().toISOString(),
      })
    },

    getActivityForTrainee(traineeId: string, limit?: number) {
      return repos.activity.listForTrainee(traineeId, limit)
    },
  }
}

export type ActivityService = ReturnType<typeof createActivityService>
