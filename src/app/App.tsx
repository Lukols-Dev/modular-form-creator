import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { PendingChangesProvider } from '../features/resources/pending/PendingChangesProvider'
import { queryClient } from './queryClient'
import { router } from './router'

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PendingChangesProvider>
        <RouterProvider router={router} />
      </PendingChangesProvider>
    </QueryClientProvider>
  )
}
