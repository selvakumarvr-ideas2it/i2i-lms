import { getTableClient, TABLE_NAMES } from '../tableClientFactory'
import type { GithubSubmissionRepository } from '../interfaces'
import type { GithubSubmission, SubmissionContextType, SubmissionStatus } from '../../../../src/domain/submission'

interface GithubSubmissionEntity {
  partitionKey: string
  rowKey: string
  id: string
  traineeId: string
  contextType: SubmissionContextType
  contextId: string
  repoUrl: string
  branch: string
  commitOrPrUrl: string
  comments: string
  status: SubmissionStatus
  submittedAt: string
  updatedAt: string
}

function toEntity(submission: GithubSubmission): GithubSubmissionEntity {
  return { partitionKey: submission.traineeId, rowKey: submission.id, ...submission }
}

function fromEntity(entity: GithubSubmissionEntity): GithubSubmission {
  return {
    id: entity.id,
    traineeId: entity.traineeId,
    contextType: entity.contextType,
    contextId: entity.contextId,
    repoUrl: entity.repoUrl,
    branch: entity.branch,
    commitOrPrUrl: entity.commitOrPrUrl,
    comments: entity.comments,
    status: entity.status,
    submittedAt: entity.submittedAt,
    updatedAt: entity.updatedAt,
  }
}

export function createTableGithubSubmissionRepository(): GithubSubmissionRepository {
  return {
    async get(traineeId, contextType, contextId) {
      const client = await getTableClient(TABLE_NAMES.githubSubmissions)
      for await (const entity of client.listEntities<GithubSubmissionEntity>({
        queryOptions: { filter: `PartitionKey eq '${traineeId}' and contextType eq '${contextType}' and contextId eq '${contextId}'` },
      })) {
        return fromEntity(entity)
      }
      return null
    },

    async listForTrainee(traineeId) {
      const client = await getTableClient(TABLE_NAMES.githubSubmissions)
      const results: GithubSubmission[] = []
      for await (const entity of client.listEntities<GithubSubmissionEntity>({ queryOptions: { filter: `PartitionKey eq '${traineeId}'` } })) {
        results.push(fromEntity(entity))
      }
      return results.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    },

    async listAll() {
      const client = await getTableClient(TABLE_NAMES.githubSubmissions)
      const results: GithubSubmission[] = []
      for await (const entity of client.listEntities<GithubSubmissionEntity>()) {
        results.push(fromEntity(entity))
      }
      return results.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    },

    async upsert(submission) {
      const client = await getTableClient(TABLE_NAMES.githubSubmissions)
      await client.upsertEntity(toEntity(submission), 'Replace')
      return submission
    },
  }
}
