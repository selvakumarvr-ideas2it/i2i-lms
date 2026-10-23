import { app } from '@azure/functions'
import { getClientPrincipal } from '../auth/clientPrincipal'
import { requireRole } from '../auth/requireRole'
import { container } from '../container'
import { json, noContent, withErrorHandling } from '../http/respond'

const ANY_SIGNED_IN = ['ADMIN', 'TRAINEE', 'MANAGER'] as const

// Scoped entirely to the authenticated caller — there is no "view another user's
// notifications" feature, so the route never takes a userId param at all.

app.http('getMyNotifications', {
  route: 'notifications',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    const principal = requireRole(getClientPrincipal(request), [...ANY_SIGNED_IN])
    return json(await container.services.notification.getNotificationsForUser(principal.oid))
  }),
})

app.http('markNotificationRead', {
  route: 'notifications/{id}/read',
  methods: ['PATCH'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    const principal = requireRole(getClientPrincipal(request), [...ANY_SIGNED_IN])
    await container.services.notification.markNotificationRead(request.params.id as string, principal.oid)
    return noContent()
  }),
})

app.http('markAllNotificationsRead', {
  route: 'notifications/read-all',
  methods: ['PATCH'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    const principal = requireRole(getClientPrincipal(request), [...ANY_SIGNED_IN])
    await container.services.notification.markAllNotificationsRead(principal.oid)
    return noContent()
  }),
})
