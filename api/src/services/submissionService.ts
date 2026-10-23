import { randomUUID } from 'node:crypto'
import type { Repositories } from '../repositories/interfaces'
import type { GithubSubmission, SubmissionContextType } from '../../../src/domain/submission'

export interface GithubSubmissionInput {
  repoUrl: string
  branch: string
  commitOrPrUrl: string
  comments: string
}

export function createSubmissionService(repos: Repositories) {
  return {
    get(traineeId: string, contextType: SubmissionContextType, contextId: string): Promise<GithubSubmission | null> {
      return repos.githubSubmissions.get(traineeId, contextType, contextId)
    },

    getSubmissionsForTrainee(traineeId: string): Promise<GithubSubmission[]> {
      return repos.githubSubmissions.listForTrainee(traineeId)
    },

    getAllGithubSubmissions(): Promise<GithubSubmission[]> {
      return repos.githubSubmissions.listAll()
    },

    async submitGithubRepo(
      traineeId: string,
      contextType: SubmissionContextType,
      contextId: string,
      dayId: string | null,
      input: GithubSubmissionInput,
    ): Promise<GithubSubmission> {
      const now = new Date().toISOString()
      const existing = await repos.githubSubmissions.get(traineeId, contextType, contextId)

      const saved: GithubSubmission = existing
        ? { ...existing, ...input, status: 'SUBMITTED', updatedAt: now }
        : {
            id: randomUUID(),
            traineeId,
            contextType,
            contextId,
            ...input,
            status: 'SUBMITTED',
            submittedAt: now,
            updatedAt: now,
          }

      await repos.githubSubmissions.upsert(saved)
      if (dayId) await repos.progress.upsert(traineeId, dayId, { githubSubmitted: true })
      await repos.activity.append({
        id: randomUUID(),
        traineeId,
        type: 'GITHUB_SUBMITTED',
        dayId,
        metadata: { contextType, contextId },
        timestamp: now,
      })

      return saved
    },
  }
}

export type SubmissionService = ReturnType<typeof createSubmissionService>
