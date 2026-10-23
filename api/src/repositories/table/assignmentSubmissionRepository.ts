import { getTableClient, TABLE_NAMES } from '../tableClientFactory'
import type { AssignmentSubmissionRepository } from '../interfaces'
import type { AssignmentSubmission } from '../../../../src/domain/assignment'
import type { SubmissionStatus } from '../../../../src/domain/submission'

interface AssignmentSubmissionEntity {
  partitionKey: string
  rowKey: string
  id: string
  assignmentId: string
  traineeId: string
  notes: string
  githubRepoUrl: string
  submittedAt: string
  status: SubmissionStatus
  score?: number
  maxScore: number
  feedback?: string
  evaluatedAt?: string
}

function toEntity(submission: AssignmentSubmission): AssignmentSubmissionEntity {
  const entity: AssignmentSubmissionEntity = {
    partitionKey: submission.traineeId,
    rowKey: submission.id,
    id: submission.id,
    assignmentId: submission.assignmentId,
    traineeId: submission.traineeId,
    notes: submission.notes,
    githubRepoUrl: submission.githubRepoUrl,
    submittedAt: submission.submittedAt,
    status: submission.status,
    maxScore: submission.maxScore,
  }
  if (submission.score != null) entity.score = submission.score
  if (submission.feedback != null) entity.feedback = submission.feedback
  if (submission.evaluatedAt != null) entity.evaluatedAt = submission.evaluatedAt
  return entity
}

function fromEntity(entity: AssignmentSubmissionEntity): AssignmentSubmission {
  return {
    id: entity.id,
    assignmentId: entity.assignmentId,
    traineeId: entity.traineeId,
    notes: entity.notes,
    githubRepoUrl: entity.githubRepoUrl,
    submittedAt: entity.submittedAt,
    status: entity.status,
    score: entity.score ?? null,
    maxScore: entity.maxScore,
    feedback: entity.feedback ?? null,
    evaluatedAt: entity.evaluatedAt ?? null,
  }
}

export function createTableAssignmentSubmissionRepository(): AssignmentSubmissionRepository {
  return {
    async get(traineeId, assignmentId) {
      const client = await getTableClient(TABLE_NAMES.assignmentSubmissions)
      for await (const entity of client.listEntities<AssignmentSubmissionEntity>({
        queryOptions: { filter: `PartitionKey eq '${traineeId}' and assignmentId eq '${assignmentId}'` },
      })) {
        return fromEntity(entity)
      }
      return null
    },

    async listForTrainee(traineeId) {
      const client = await getTableClient(TABLE_NAMES.assignmentSubmissions)
      const results: AssignmentSubmission[] = []
      for await (const entity of client.listEntities<AssignmentSubmissionEntity>({ queryOptions: { filter: `PartitionKey eq '${traineeId}'` } })) {
        results.push(fromEntity(entity))
      }
      return results.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    },

    async listAll() {
      const client = await getTableClient(TABLE_NAMES.assignmentSubmissions)
      const results: AssignmentSubmission[] = []
      for await (const entity of client.listEntities<AssignmentSubmissionEntity>()) {
        results.push(fromEntity(entity))
      }
      return results.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    },

    async upsert(submission) {
      const client = await getTableClient(TABLE_NAMES.assignmentSubmissions)
      await client.upsertEntity(toEntity(submission), 'Replace')
      return submission
    },
  }
}
