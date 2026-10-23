import { getTableClient, TABLE_NAMES } from '../tableClientFactory'
import type { EvaluationRepository } from '../interfaces'
import type { Evaluation, EvaluationContextType } from '../../../../src/domain/evaluation'
import type { SubmissionStatus } from '../../../../src/domain/submission'

interface EvaluationEntity {
  partitionKey: string
  rowKey: string
  id: string
  traineeId: string
  dayId: string
  contextType: EvaluationContextType
  contextId: string
  score?: number
  maxScore: number
  status: SubmissionStatus
  feedback: string
  evaluatorId: string
  evaluatedAt: string
}

function toEntity(evaluation: Evaluation): EvaluationEntity {
  const entity: EvaluationEntity = {
    partitionKey: evaluation.traineeId,
    rowKey: evaluation.id,
    id: evaluation.id,
    traineeId: evaluation.traineeId,
    dayId: evaluation.dayId,
    contextType: evaluation.contextType,
    contextId: evaluation.contextId,
    maxScore: evaluation.maxScore,
    status: evaluation.status,
    feedback: evaluation.feedback,
    evaluatorId: evaluation.evaluatorId,
    evaluatedAt: evaluation.evaluatedAt,
  }
  if (evaluation.score != null) entity.score = evaluation.score
  return entity
}

function fromEntity(entity: EvaluationEntity): Evaluation {
  return {
    id: entity.id,
    traineeId: entity.traineeId,
    dayId: entity.dayId,
    contextType: entity.contextType,
    contextId: entity.contextId,
    score: entity.score ?? null,
    maxScore: entity.maxScore,
    status: entity.status,
    feedback: entity.feedback,
    evaluatorId: entity.evaluatorId,
    evaluatedAt: entity.evaluatedAt,
  }
}

export function createTableEvaluationRepository(): EvaluationRepository {
  return {
    async create(evaluation) {
      const client = await getTableClient(TABLE_NAMES.evaluations)
      await client.upsertEntity(toEntity(evaluation), 'Replace')
      return evaluation
    },

    async listForTrainee(traineeId) {
      const client = await getTableClient(TABLE_NAMES.evaluations)
      const results: Evaluation[] = []
      for await (const entity of client.listEntities<EvaluationEntity>({ queryOptions: { filter: `PartitionKey eq '${traineeId}'` } })) {
        results.push(fromEntity(entity))
      }
      return results.sort((a, b) => new Date(b.evaluatedAt).getTime() - new Date(a.evaluatedAt).getTime())
    },
  }
}
