import { app } from '@azure/functions'
import { getClientPrincipal } from '../auth/clientPrincipal'
import { container } from '../container'
import { json, withErrorHandling } from '../http/respond'

app.http('getMe', {
  route: 'me',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    const principal = getClientPrincipal(request)
    if (!principal) return json({ error: 'Sign-in required.' }, 401)

    // Re-fetches from the Users table rather than trusting the cached headers, so a
    // role change (or a removed user) made directly in the table takes effect on the
    // next page load without the trainee/admin needing to "log out" first.
    const user = await container.services.user.getByEmail(principal.email)
    if (!user) return json({ error: 'This account no longer exists. Contact your program administrator.' }, 401)

    return json(user)
  }),
})
