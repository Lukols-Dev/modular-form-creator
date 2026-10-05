const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5001').replace(
  /\/+$/,
  '',
)

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

interface RequestOptions {
  method?: HttpMethod
  body?: unknown
  signal?: AbortSignal
}

/**
 * Error thrown for every failed request. `status` is the HTTP status code,
 * or 0 when the server could not be reached at all.
 */
export class ApiError extends Error {
  readonly status: number
  readonly details: unknown

  constructor(status: number, message: string, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

/** Business errors from the backend have the shape `{ message, details }`. */
function readErrorBody(body: unknown): { message?: string; details?: unknown } {
  if (typeof body !== 'object' || body === null) {
    return {}
  }
  const { message, details } = body as Record<string, unknown>
  return { message: typeof message === 'string' ? message : undefined, details }
}

export async function apiRequest<T>(
  path: string,
  { method = 'GET', body, signal }: RequestOptions = {},
): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      signal,
      // Only requests with a body declare JSON, so plain GETs stay simple CORS requests.
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch (error) {
    if (signal?.aborted) {
      throw error
    }
    throw new ApiError(
      0,
      'Cannot reach the server. Make sure the API is running and try again.',
    )
  }

  const data: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    const { message, details } = readErrorBody(data)
    throw new ApiError(
      response.status,
      response.status >= 500 || !message
        ? 'The server could not process the request. Please try again.'
        : message,
      details,
    )
  }
  return data as T
}

export function isApiError(error: unknown, status?: number): error is ApiError {
  return error instanceof ApiError && (status === undefined || error.status === status)
}

/** The server answered with a 4xx: the request itself was rejected, so retrying will not help. */
export function isRejectedRequest(error: unknown): error is ApiError {
  return error instanceof ApiError && error.status >= 400 && error.status < 500
}

export function getErrorMessage(error: unknown): string {
  return error instanceof ApiError
    ? error.message
    : 'Something went wrong. Please try again.'
}
