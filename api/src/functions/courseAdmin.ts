import { app } from '@azure/functions'
import { getClientPrincipal } from '../auth/clientPrincipal'
import { requireRole } from '../auth/requireRole'
import { container } from '../container'
import { json, parseJsonBody, withErrorHandling } from '../http/respond'
import type { Exercise, LearningDay, StudyMaterial } from '../../../src/domain/course'
import type { Quiz } from '../../../src/domain/quiz'
import type { Assignment } from '../../../src/domain/assignment'

app.http('updateDay', {
  route: 'manage/course/days/{id}',
  methods: ['PATCH'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    requireRole(getClientPrincipal(request), ['ADMIN'])
    const patch = await parseJsonBody<Partial<LearningDay>>(request)
    return json(await container.services.course.updateDay(request.params.id as string, patch))
  }),
})

app.http('setDayPublished', {
  route: 'manage/course/days/{id}/publish',
  methods: ['PATCH'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    requireRole(getClientPrincipal(request), ['ADMIN'])
    const body = await parseJsonBody<{ isPublished: boolean }>(request)
    return json(await container.services.course.setDayPublished(request.params.id as string, body.isPublished))
  }),
})

app.http('updateStudyMaterial', {
  route: 'manage/study-materials/{id}',
  methods: ['PATCH'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    requireRole(getClientPrincipal(request), ['ADMIN'])
    const patch = await parseJsonBody<Partial<StudyMaterial>>(request)
    return json(await container.services.course.updateStudyMaterial(request.params.id as string, patch))
  }),
})

app.http('updateExercise', {
  route: 'manage/exercises/{id}',
  methods: ['PATCH'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    requireRole(getClientPrincipal(request), ['ADMIN'])
    const patch = await parseJsonBody<Partial<Exercise>>(request)
    return json(await container.services.course.updateExercise(request.params.id as string, patch))
  }),
})

app.http('updateQuiz', {
  route: 'manage/quizzes/{id}',
  methods: ['PATCH'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    requireRole(getClientPrincipal(request), ['ADMIN'])
    const patch = await parseJsonBody<Partial<Quiz>>(request)
    return json(await container.services.course.updateQuiz(request.params.id as string, patch))
  }),
})

app.http('updateAssignment', {
  route: 'manage/assignments/{id}',
  methods: ['PATCH'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    requireRole(getClientPrincipal(request), ['ADMIN'])
    const patch = await parseJsonBody<Partial<Assignment>>(request)
    return json(await container.services.course.updateAssignment(request.params.id as string, patch))
  }),
})
