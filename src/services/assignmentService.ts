import { apiFetch } from '@/services/http'
import type { AssignmentSubmission } from '@/domain/assignment'

export interface AssignmentSubmissionInput {
  notes: string
  githubRepoUrl: string
}

export async function getSubmission(traineeId: string, assignmentId: string): Promise<AssignmentSubmission | undefined> {
  return apiFetch(`/api/trainees/${traineeId}/assignment-submissions/${assignmentId}`)
}

export async function getSubmissionsForTrainee(traineeId: string): Promise<AssignmentSubmission[]> {
  return apiFetch(`/api/trainees/${traineeId}/assignment-submissions`)
}

export async function getAllAssignmentSubmissions(): Promise<AssignmentSubmission[]> {
  return apiFetch('/api/manage/assignment-submissions')
}

export async function submitAssignment(
  traineeId: string,
  dayId: string,
  assignmentId: string,
  input: AssignmentSubmissionInput,
): Promise<AssignmentSubmission> {
  return apiFetch(`/api/trainees/${traineeId}/assignment-submissions/${assignmentId}`, {
    method: 'PUT',
    body: JSON.stringify({ ...input, dayId }),
  })
}
