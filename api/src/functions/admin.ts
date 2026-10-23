import { app } from '@azure/functions'
import { getClientPrincipal } from '../auth/clientPrincipal'
import { requireRole } from '../auth/requireRole'
import { container } from '../container'
import { json, notFound, parseJsonBody, withErrorHandling } from '../http/respond'
import type { TraineeListFilter, TraineeStatusFilter } from '../services/adminService'
import type { AtRiskThresholds } from '../../../src/domain/progress'
import type { SubmissionStatus } from '../../../src/domain/submission'

app.http('getTrainees', {
  route: 'manage/trainees',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    requireRole(getClientPrincipal(request), ['ADMIN', 'MANAGER'])
    const filter: TraineeListFilter = {
      search: request.query.get('search') ?? undefined,
      status: (request.query.get('status') as TraineeStatusFilter | null) ?? undefined,
    }
    return json(await container.services.admin.getTrainees(filter))
  }),
})

app.http('getTraineeDetail', {
  route: 'manage/trainees/{id}',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    requireRole(getClientPrincipal(request), ['ADMIN', 'MANAGER'])
    const detail = await container.services.admin.getTraineeDetail(request.params.id as string)
    if (!detail) notFound(`Trainee not found: ${request.params.id}`)
    return json(detail)
  }),
})

app.http('getAtRiskThresholds', {
  route: 'manage/at-risk-thresholds',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    requireRole(getClientPrincipal(request), ['ADMIN', 'MANAGER'])
    return json(await container.services.admin.getAtRiskThresholds())
  }),
})

app.http('setAtRiskThresholds', {
  route: 'manage/at-risk-thresholds',
  methods: ['PUT'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    requireRole(getClientPrincipal(request), ['ADMIN'])
    const body = await parseJsonBody<AtRiskThresholds>(request)
    return json(await container.services.admin.setAtRiskThresholds(body))
  }),
})

app.http('getCohortOverviewStats', {
  route: 'manage/cohort/overview',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    requireRole(getClientPrincipal(request), ['ADMIN', 'MANAGER'])
    return json(await container.services.admin.getCohortOverviewStats())
  }),
})

app.http('getCohortDailyCompletion', {
  route: 'manage/cohort/daily-completion',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    requireRole(getClientPrincipal(request), ['ADMIN', 'MANAGER'])
    return json(await container.services.progress.getCohortDailyCompletion())
  }),
})

app.http('getCohortQuizPerformance', {
  route: 'manage/cohort/quiz-performance',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    requireRole(getClientPrincipal(request), ['ADMIN', 'MANAGER'])
    return json(await container.services.progress.getCohortQuizPerformance())
  }),
})

app.http('getAssignmentStatusBreakdown', {
  route: 'manage/cohort/assignment-status',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    requireRole(getClientPrincipal(request), ['ADMIN', 'MANAGER'])
    const dayId = request.query.get('dayId') ?? undefined
    return json(await container.services.admin.getAssignmentStatusBreakdown(dayId))
  }),
})

app.http('getAllGithubSubmissionsAdmin', {
  route: 'manage/github-submissions',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    requireRole(getClientPrincipal(request), ['ADMIN', 'MANAGER'])
    return json(await container.services.submission.getAllGithubSubmissions())
  }),
})

app.http('getAllAssignmentSubmissionsAdmin', {
  route: 'manage/assignment-submissions',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    requireRole(getClientPrincipal(request), ['ADMIN', 'MANAGER'])
    return json(await container.services.assignment.getAllAssignmentSubmissions())
  }),
})

interface EvaluateBody {
  status: SubmissionStatus
  feedback: string
  dayId: string
  score?: number | null
  maxScore?: number
}

app.http('evaluateGithubSubmission', {
  route: 'manage/github-submissions/{traineeId}/{submissionId}/evaluate',
  methods: ['PATCH'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    const principal = requireRole(getClientPrincipal(request), ['ADMIN'])
    const body = await parseJsonBody<EvaluateBody>(request)
    const result = await container.services.admin.evaluateGithubSubmission(
      request.params.traineeId as string,
      request.params.submissionId as string,
      { ...body, evaluatorId: principal.oid },
      principal.oid,
    )
    return json(result)
  }),
})

app.http('evaluateAssignmentSubmission', {
  route: 'manage/assignment-submissions/{traineeId}/{submissionId}/evaluate',
  methods: ['PATCH'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    const principal = requireRole(getClientPrincipal(request), ['ADMIN'])
    const body = await parseJsonBody<EvaluateBody>(request)
    const result = await container.services.admin.evaluateAssignmentSubmission(
      request.params.traineeId as string,
      request.params.submissionId as string,
      { ...body, evaluatorId: principal.oid },
      principal.oid,
    )
    return json(result)
  }),
})

app.http('getCohortProgressReport', {
  route: 'manage/reports/cohort-progress',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    requireRole(getClientPrincipal(request), ['ADMIN', 'MANAGER'])
    return json(await container.services.admin.getCohortProgressReport())
  }),
})
