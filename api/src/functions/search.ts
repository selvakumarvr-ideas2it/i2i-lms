import { app } from '@azure/functions'
import { getClientPrincipal } from '../auth/clientPrincipal'
import { requireRole } from '../auth/requireRole'
import { container } from '../container'
import { json, withErrorHandling } from '../http/respond'

app.http('search', {
  route: 'search',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    requireRole(getClientPrincipal(request), ['ADMIN', 'TRAINEE'])
    const query = request.query.get('q') ?? ''
    return json(await container.services.search.searchCourseContent(query))
  }),
})
