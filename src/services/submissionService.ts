import { apiFetch } from '@/services/http'
import type { GithubSubmission, SubmissionContextType, SubmissionStatus } from '@/domain/submission'

export interface GithubSubmissionInput {
  repoUrl: string
  branch: string
  commitOrPrUrl: string
  comments: string
}

export async function getSubmission(
  traineeId: string,
  contextType: SubmissionContextType,
  contextId: string,
): Promise<GithubSubmission | undefined> {
  return apiFetch(`/api/trainees/${traineeId}/github-submissions/${contextType}/${contextId}`)
}

export async function getSubmissionsForTrainee(traineeId: string): Promise<GithubSubmission[]> {
  return apiFetch(`/api/trainees/${traineeId}/github-submissions`)
}

export async function getAllGithubSubmissions(): Promise<GithubSubmission[]> {
  return apiFetch('/api/manage/github-submissions')
}

export async function submitGithubRepo(
  traineeId: string,
  contextType: SubmissionContextType,
  contextId: string,
  dayId: string | null,
  input: GithubSubmissionInput,
): Promise<GithubSubmission> {
  return apiFetch(`/api/trainees/${traineeId}/github-submissions/${contextType}/${contextId}`, {
    method: 'PUT',
    body: JSON.stringify({ ...input, dayId }),
  })
}

/**
 * Not used by any current UI (the quick-triage status change was superseded by the
 * full evaluate flow in adminService), kept for API symmetry with the domain's
 * SubmissionStatus workflow. There is no dedicated backend route for it.
 */
export async function updateSubmissionStatus(_id: string, _status: SubmissionStatus, _comments?: string): Promise<GithubSubmission> {
  throw new Error('updateSubmissionStatus is not implemented — use adminService.evaluateGithubSubmission instead.')
}
