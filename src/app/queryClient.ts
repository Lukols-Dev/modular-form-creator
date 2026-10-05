import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '../shared/api/client'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // A 4xx answer (invalid id, not found) will not change, so show it right away.
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          return false
        }
        return failureCount < 1
      },
    },
  },
})
