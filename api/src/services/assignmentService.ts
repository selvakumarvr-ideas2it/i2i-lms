import { randomUUID } from 'node:crypto'
import type { Repositories } from '../repositories/interfaces'
import type { AssignmentSubmission } from '../../../src/domain/assignment'

export interface AssignmentSubmissionInput {
  notes: string
  githubRepoUrl: string
}

export function createAssignmentService(repos: Repositories) {
  return {
    getSubmission(traineeId: string, assignmentId: string): Promise<AssignmentSubmission | null> {
      return repos.assignmentSubmissions.get(traineeId, assignmentId)
    },

    getSubmissionsForTrainee(traineeId: string): Promise<AssignmentSubmission[]> {
      return repos.assignmentSubmissions.listForTrainee(traineeId)
    },

    getAllAssignmentSubmissions(): Promise<AssignmentSubmission[]> {
      return repos.assignmentSubmissions.listAll()
    },

    async submitAssignment(
      traineeId: string,
      dayId: string,
      assignmentId: string,
      input: AssignmentSubmissionInput,
    ): Promise<AssignmentSubmission> {
      const now = new Date().toISOString()
      const existing = await repos.assignmentSubmissions.get(traineeId, assignmentId)

      const saved: AssignmentSubmission = existing
        ? { ...existing, ...input, status: 'SUBMITTED', submittedAt: now, score: null, feedback: null, evaluatedAt: null }
        : {
            id: randomUUID(),
            assignmentId,
            traineeId,
            ...input,
            submittedAt: now,
            status: 'SUBMITTED',
            score: null,
            maxScore: 100,
            feedback: null,
            evaluatedAt: null,
          }

      await repos.assignmentSubmissions.upsert(saved)
      await repos.progress.upsert(traineeId, dayId, { assignmentSubmitted: true })
      await repos.activity.append({
        id: randomUUID(),
        traineeId,
        type: 'ASSIGNMENT_SUBMITTED',
        dayId,
        metadata: { assignmentId },
        timestamp: now,
      })

      return saved
    },
  }
}

export type AssignmentService = ReturnType<typeof createAssignmentService>
