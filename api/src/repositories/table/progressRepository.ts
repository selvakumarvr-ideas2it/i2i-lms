import { getTableClient, TABLE_NAMES } from '../tableClientFactory'
import type { ProgressRepository } from '../interfaces'
import type { LearningProgress } from '../../../../src/domain/progress'

interface ProgressEntity {
  partitionKey: string
  rowKey: string
  traineeId: string
  dayId: string
  studyCompleted: boolean
  exerciseStarted: boolean
  exerciseCompleted: boolean
  quizCompleted: boolean
  quizScorePercent?: number
  quizAttempts: number
  githubSubmitted: boolean
  assignmentSubmitted: boolean
  lastUpdatedAt: string
}

function toEntity(progress: LearningProgress, partitionKey: string, rowKey: string): ProgressEntity {
  const entity: ProgressEntity = {
    partitionKey,
    rowKey,
    traineeId: progress.traineeId,
    dayId: progress.dayId,
    studyCompleted: progress.studyCompleted,
    exerciseStarted: progress.exerciseStarted,
    exerciseCompleted: progress.exerciseCompleted,
    quizCompleted: progress.quizCompleted,
    quizAttempts: progress.quizAttempts,
    githubSubmitted: progress.githubSubmitted,
    assignmentSubmitted: progress.assignmentSubmitted,
    lastUpdatedAt: progress.lastUpdatedAt,
  }
  if (progress.quizScorePercent != null) entity.quizScorePercent = progress.quizScorePercent
  return entity
}

function fromEntity(entity: ProgressEntity): LearningProgress {
  return {
    traineeId: entity.traineeId,
    dayId: entity.dayId,
    studyCompleted: entity.studyCompleted,
    exerciseStarted: entity.exerciseStarted,
    exerciseCompleted: entity.exerciseCompleted,
    quizCompleted: entity.quizCompleted,
    quizScorePercent: entity.quizScorePercent ?? null,
    quizAttempts: entity.quizAttempts,
    githubSubmitted: entity.githubSubmitted,
    assignmentSubmitted: entity.assignmentSubmitted,
    lastUpdatedAt: entity.lastUpdatedAt,
  }
}

function defaultProgress(traineeId: string, dayId: string): LearningProgress {
  return {
    traineeId,
    dayId,
    studyCompleted: false,
    exerciseStarted: false,
    exerciseCompleted: false,
    quizCompleted: false,
    quizScorePercent: null,
    quizAttempts: 0,
    githubSubmitted: false,
    assignmentSubmitted: false,
    lastUpdatedAt: new Date().toISOString(),
  }
}

export function createTableProgressRepository(): ProgressRepository {
  return {
    async getForTrainee(traineeId) {
      const client = await getTableClient(TABLE_NAMES.progress)
      const results: LearningProgress[] = []
      for await (const entity of client.listEntities<ProgressEntity>({ queryOptions: { filter: `PartitionKey eq '${traineeId}'` } })) {
        results.push(fromEntity(entity))
      }
      return results
    },

    async getOne(traineeId, dayId) {
      const client = await getTableClient(TABLE_NAMES.progress)
      try {
        const entity = await client.getEntity<ProgressEntity>(traineeId, dayId)
        return fromEntity(entity)
      } catch (err: unknown) {
        if ((err as { statusCode?: number }).statusCode === 404) return null
        throw err
      }
    },

    async getAllForDay(dayId) {
      const client = await getTableClient(TABLE_NAMES.progressByDay)
      const results: LearningProgress[] = []
      for await (const entity of client.listEntities<ProgressEntity>({ queryOptions: { filter: `PartitionKey eq '${dayId}'` } })) {
        results.push(fromEntity(entity))
      }
      return results
    },

    async upsert(traineeId, dayId, patch) {
      const primary = await getTableClient(TABLE_NAMES.progress)
      const secondary = await getTableClient(TABLE_NAMES.progressByDay)

      const current = await this.getOne(traineeId, dayId)
      const updated: LearningProgress = {
        ...(current ?? defaultProgress(traineeId, dayId)),
        ...patch,
        lastUpdatedAt: new Date().toISOString(),
      }

      await primary.upsertEntity(toEntity(updated, traineeId, dayId), 'Replace')
      // Best-effort denormalized index for cohort-wide "progress for day X" queries.
      // Table Storage has no cross-table transactions; a failure here just means the
      // index is briefly stale, never that progress itself is lost.
      await secondary.upsertEntity(toEntity(updated, dayId, traineeId), 'Replace')

      return updated
    },
  }
}
