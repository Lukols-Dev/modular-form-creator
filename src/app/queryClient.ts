import { QueryClient } from '@tanstack/react-query'
import { isRejectedRequest } from '../shared/api/client'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // A 4xx answer (invalid id, not found) will not change on retry, so show it right away.
      retry: (failureCount, error) => !isRejectedRequest(error) && failureCount < 1,
    },
  },
})
