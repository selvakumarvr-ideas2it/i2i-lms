import { app } from '@azure/functions'
import { getClientPrincipal } from '../auth/clientPrincipal'
import { requireSelfOrAdmin } from '../auth/requireRole'
import { container } from '../container'
import { json, parseJsonBody, withErrorHandling } from '../http/respond'
import type { QuizAnswer } from '../../../src/domain/quiz'

app.http('getQuizAttempts', {
  route: 'trainees/{traineeId}/quizzes/{quizId}/attempts',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    const traineeId = request.params.traineeId as string
    requireSelfOrAdmin(getClientPrincipal(request), traineeId)
    return json(await container.services.quiz.getAttempts(traineeId, request.params.quizId as string))
  }),
})

app.http('submitQuizAttempt', {
  route: 'trainees/{traineeId}/quizzes/{quizId}/attempts',
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    const traineeId = request.params.traineeId as string
    requireSelfOrAdmin(getClientPrincipal(request), traineeId)
    const body = await parseJsonBody<{ dayId: string; answers: QuizAnswer[] }>(request)
    return json(await container.services.quiz.submitAttempt(traineeId, body.dayId, request.params.quizId as string, body.answers))
  }),
})
