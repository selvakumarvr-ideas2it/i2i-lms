import { app } from '@azure/functions'
import { getClientPrincipal } from '../auth/clientPrincipal'
import { requireRole } from '../auth/requireRole'
import { container } from '../container'
import { json, withErrorHandling } from '../http/respond'

const ANY_SIGNED_IN = ['ADMIN', 'TRAINEE', 'MANAGER'] as const

app.http('getCourse', {
  route: 'course',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    requireRole(getClientPrincipal(request), [...ANY_SIGNED_IN])
    return json(await container.services.course.getCourse())
  }),
})

app.http('getModules', {
  route: 'course/modules',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    requireRole(getClientPrincipal(request), [...ANY_SIGNED_IN])
    return json(await container.services.course.getModules())
  }),
})

app.http('getDays', {
  route: 'course/days',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    requireRole(getClientPrincipal(request), [...ANY_SIGNED_IN])
    return json(await container.services.course.getDays())
  }),
})

app.http('getDay', {
  route: 'course/days/{id}',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    requireRole(getClientPrincipal(request), [...ANY_SIGNED_IN])
    return json(await container.services.course.getDay(request.params.id as string))
  }),
})

app.http('getStudyMaterials', {
  route: 'study-materials',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    requireRole(getClientPrincipal(request), [...ANY_SIGNED_IN])
    return json(await container.services.course.getStudyMaterials())
  }),
})

app.http('getStudyMaterial', {
  route: 'study-materials/{id}',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    requireRole(getClientPrincipal(request), [...ANY_SIGNED_IN])
    return json(await container.services.course.getStudyMaterial(request.params.id as string))
  }),
})

app.http('getExercises', {
  route: 'exercises',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    requireRole(getClientPrincipal(request), [...ANY_SIGNED_IN])
    return json(await container.services.course.getExercises())
  }),
})

app.http('getExercise', {
  route: 'exercises/{id}',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    requireRole(getClientPrincipal(request), [...ANY_SIGNED_IN])
    return json(await container.services.course.getExercise(request.params.id as string))
  }),
})

app.http('getQuizzes', {
  route: 'quizzes',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    requireRole(getClientPrincipal(request), [...ANY_SIGNED_IN])
    return json(await container.services.course.getQuizzes())
  }),
})

app.http('getQuizById', {
  route: 'quizzes/{id}',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    requireRole(getClientPrincipal(request), [...ANY_SIGNED_IN])
    return json(await container.services.course.getQuiz(request.params.id as string))
  }),
})

app.http('getAssignments', {
  route: 'assignments',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    requireRole(getClientPrincipal(request), [...ANY_SIGNED_IN])
    return json(await container.services.course.getAssignments())
  }),
})

app.http('getAssignmentById', {
  route: 'assignments/{id}',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    requireRole(getClientPrincipal(request), [...ANY_SIGNED_IN])
    return json(await container.services.course.getAssignment(request.params.id as string))
  }),
})

app.http('getCapstones', {
  route: 'capstones',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    requireRole(getClientPrincipal(request), [...ANY_SIGNED_IN])
    return json(await container.services.course.getCapstones())
  }),
})
