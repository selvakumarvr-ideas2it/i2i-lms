import { app } from '@azure/functions'
import { getClientPrincipal } from '../auth/clientPrincipal'
import { requireSelfOrAdmin } from '../auth/requireRole'
import { container } from '../container'
import { json, parseJsonBody, withErrorHandling } from '../http/respond'
import type { ActivityEventType } from '../../../src/domain/activity'

interface LogActivityBody {
  type: ActivityEventType
  dayId?: string | null
  metadata?: Record<string, string | number | boolean> | null
}

// The only two client-triggered activity events left after the migration are LOGIN
// and QUIZ_STARTED — everything else (STUDY/EXERCISE/ASSIGNMENT/GITHUB/QUIZ_COMPLETED,
// EVALUATION_COMPLETED) is recorded server-side as a side effect of the API call that
// actually performs the action, so it can never be logged without also happening.
const ALLOWED_CLIENT_EVENTS: ActivityEventType[] = ['LOGIN', 'QUIZ_STARTED']

app.http('logActivity', {
  route: 'trainees/{traineeId}/activity',
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    const traineeId = request.params.traineeId as string
    requireSelfOrAdmin(getClientPrincipal(request), traineeId)
    const body = await parseJsonBody<LogActivityBody>(request)
    if (!ALLOWED_CLIENT_EVENTS.includes(body.type)) {
      return json({ error: `Event type not client-loggable: ${body.type}` }, 400)
    }
    return json(await container.services.activity.logActivity(traineeId, body.type, body.dayId ?? null, body.metadata ?? null))
  }),
})

app.http('getActivityForTrainee', {
  route: 'trainees/{traineeId}/activity',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    const traineeId = request.params.traineeId as string
    requireSelfOrAdmin(getClientPrincipal(request), traineeId)
    const limitParam = request.query.get('limit')
    const limit = limitParam ? Number(limitParam) : undefined
    return json(await container.services.activity.getActivityForTrainee(traineeId, limit))
  }),
})
