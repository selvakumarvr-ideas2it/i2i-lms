import type { HttpHandler, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { HttpError } from '../auth/requireRole'

export function json(body: unknown, status = 200): HttpResponseInit {
  return {
    status,
    jsonBody: body,
    headers: { 'Content-Type': 'application/json' },
  }
}

export function noContent(): HttpResponseInit {
  return { status: 204 }
}

/**
 * Wraps a handler so a thrown HttpError (401/403/404/400) becomes the right HTTP
 * response instead of a generic 500, and anything unexpected is logged and returned as
 * a 500 without leaking internals to the client.
 */
export function withErrorHandling(handler: HttpHandler): HttpHandler {
  return async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      return await handler(request, context)
    } catch (error) {
      if (error instanceof HttpError) {
        return json({ error: error.message }, error.status)
      }
      context.error('Unhandled error', error)
      return json({ error: 'Internal server error' }, 500)
    }
  }
}

export async function parseJsonBody<T>(request: HttpRequest): Promise<T> {
  try {
    return (await request.json()) as T
  } catch {
    throw new HttpError(400, 'Request body must be valid JSON.')
  }
}

export function notFound(message: string): never {
  throw new HttpError(404, message)
}
