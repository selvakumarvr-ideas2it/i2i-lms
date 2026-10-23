import { app } from '@azure/functions'
import { getClientPrincipal } from '../auth/clientPrincipal'
import { container } from '../container'
import { json, noContent, parseJsonBody, withErrorHandling } from '../http/respond'

interface LoginBody {
  email: string
  password: string
}

app.http('login', {
  route: 'auth/login',
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    const body = await parseJsonBody<LoginBody>(request)
    const email = (body.email ?? '').trim()
    const password = body.password ?? ''
    if (!email || !password) return json({ error: 'Email and password are required.' }, 400)

    const user = await container.services.user.verifyPassword(email, password)
    if (!user) {
      return json({ error: 'Invalid email or password. Contact your program administrator if you don’t have an account.' }, 401)
    }

    return json(user)
  }),
})

interface ChangePasswordBody {
  currentPassword: string
  newPassword: string
}

app.http('changePassword', {
  route: 'auth/change-password',
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: withErrorHandling(async (request) => {
    const principal = getClientPrincipal(request)
    if (!principal) return json({ error: 'Sign-in required.' }, 401)

    const body = await parseJsonBody<ChangePasswordBody>(request)
    const currentPassword = body.currentPassword ?? ''
    const newPassword = body.newPassword ?? ''
    if (!currentPassword || !newPassword) return json({ error: 'Current and new password are required.' }, 400)
    if (newPassword.length < 8) return json({ error: 'New password must be at least 8 characters.' }, 400)

    await container.services.user.changePassword(principal.oid, principal.email, currentPassword, newPassword)
    return noContent()
  }),
})
