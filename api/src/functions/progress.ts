import { app } from '@azure/functions'
import { getClientPrincipal } from '../auth/clientPrincipal'
import { requireSelfOrAdmin } from '../auth/requireRole'
import { container } from '../container'
import { json, withErrorHandling } from '../http/respond'

app.http('getProgressForTrainee', {
  route: 'trainees/{traineeId}/progress',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    const traineeId = request.params.traineeId as string
    requireSelfOrAdmin(getClientPrincipal(request), traineeId)
    return json(await container.services.progress.getProgressForTrainee(traineeId))
  }),
})

app.http('getDerivedProgressForTrainee', {
  route: 'trainees/{traineeId}/progress/derived',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    const traineeId = request.params.traineeId as string
    requireSelfOrAdmin(getClientPrincipal(request), traineeId)
    return json(await container.services.progress.getDerivedProgressForTrainee(traineeId))
  }),
})

app.http('getOneProgress', {
  route: 'trainees/{traineeId}/progress/{dayId}',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    const traineeId = request.params.traineeId as string
    requireSelfOrAdmin(getClientPrincipal(request), traineeId)
    return json(await container.services.progress.getProgress(traineeId, request.params.dayId as string))
  }),
})

app.http('getTraineeSummary', {
  route: 'trainees/{traineeId}/summary',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    const traineeId = request.params.traineeId as string
    requireSelfOrAdmin(getClientPrincipal(request), traineeId)
    return json(await container.services.progress.getTraineeSummary(traineeId))
  }),
})

app.http('getNextIncompleteDay', {
  route: 'trainees/{traineeId}/next-day',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    const traineeId = request.params.traineeId as string
    requireSelfOrAdmin(getClientPrincipal(request), traineeId)
    return json(await container.services.progress.getNextIncompleteDay(traineeId))
  }),
})

app.http('markStudyComplete', {
  route: 'trainees/{traineeId}/progress/{dayId}/study-complete',
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    const traineeId = request.params.traineeId as string
    requireSelfOrAdmin(getClientPrincipal(request), traineeId)
    return json(await container.services.progress.markStudyComplete(traineeId, request.params.dayId as string))
  }),
})

app.http('markExerciseStarted', {
  route: 'trainees/{traineeId}/progress/{dayId}/exercise-started',
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    const traineeId = request.params.traineeId as string
    requireSelfOrAdmin(getClientPrincipal(request), traineeId)
    return json(await container.services.progress.markExerciseStarted(traineeId, request.params.dayId as string))
  }),
})

app.http('markExerciseCompleted', {
  route: 'trainees/{traineeId}/progress/{dayId}/exercise-completed',
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    const traineeId = request.params.traineeId as string
    requireSelfOrAdmin(getClientPrincipal(request), traineeId)
    return json(await container.services.progress.markExerciseCompleted(traineeId, request.params.dayId as string))
  }),
})
