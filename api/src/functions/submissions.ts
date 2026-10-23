import { app } from '@azure/functions'
import { getClientPrincipal } from '../auth/clientPrincipal'
import { requireSelfOrAdmin } from '../auth/requireRole'
import { container } from '../container'
import { json, parseJsonBody, withErrorHandling } from '../http/respond'
import type { GithubSubmissionInput } from '../services/submissionService'
import type { AssignmentSubmissionInput } from '../services/assignmentService'
import type { SubmissionContextType } from '../../../src/domain/submission'

app.http('getGithubSubmissionsForTrainee', {
  route: 'trainees/{traineeId}/github-submissions',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    const traineeId = request.params.traineeId as string
    requireSelfOrAdmin(getClientPrincipal(request), traineeId)
    return json(await container.services.submission.getSubmissionsForTrainee(traineeId))
  }),
})

app.http('getGithubSubmission', {
  route: 'trainees/{traineeId}/github-submissions/{contextType}/{contextId}',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    const traineeId = request.params.traineeId as string
    requireSelfOrAdmin(getClientPrincipal(request), traineeId)
    const contextType = request.params.contextType as SubmissionContextType
    const contextId = request.params.contextId as string
    return json(await container.services.submission.get(traineeId, contextType, contextId))
  }),
})

app.http('submitGithubSubmission', {
  route: 'trainees/{traineeId}/github-submissions/{contextType}/{contextId}',
  methods: ['PUT'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    const traineeId = request.params.traineeId as string
    requireSelfOrAdmin(getClientPrincipal(request), traineeId)
    const contextType = request.params.contextType as SubmissionContextType
    const contextId = request.params.contextId as string
    const body = await parseJsonBody<GithubSubmissionInput & { dayId: string | null }>(request)
    const { dayId, ...input } = body
    return json(await container.services.submission.submitGithubRepo(traineeId, contextType, contextId, dayId, input))
  }),
})

app.http('getAssignmentSubmissionsForTrainee', {
  route: 'trainees/{traineeId}/assignment-submissions',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    const traineeId = request.params.traineeId as string
    requireSelfOrAdmin(getClientPrincipal(request), traineeId)
    return json(await container.services.assignment.getSubmissionsForTrainee(traineeId))
  }),
})

app.http('getAssignmentSubmission', {
  route: 'trainees/{traineeId}/assignment-submissions/{assignmentId}',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    const traineeId = request.params.traineeId as string
    requireSelfOrAdmin(getClientPrincipal(request), traineeId)
    return json(await container.services.assignment.getSubmission(traineeId, request.params.assignmentId as string))
  }),
})

app.http('submitAssignmentSubmission', {
  route: 'trainees/{traineeId}/assignment-submissions/{assignmentId}',
  methods: ['PUT'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    const traineeId = request.params.traineeId as string
    requireSelfOrAdmin(getClientPrincipal(request), traineeId)
    const assignmentId = request.params.assignmentId as string
    const body = await parseJsonBody<AssignmentSubmissionInput & { dayId: string }>(request)
    const { dayId, ...input } = body
    return json(await container.services.assignment.submitAssignment(traineeId, dayId, assignmentId, input))
  }),
})
