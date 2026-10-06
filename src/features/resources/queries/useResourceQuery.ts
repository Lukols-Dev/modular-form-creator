import { useQuery } from '@tanstack/react-query'
import { getResource } from '../api/resourcesApi'
import { resourceKeys } from './resourceKeys'

export function useResourceQuery(resourceId: number) {
  return useQuery({
    queryKey: resourceKeys.detail(resourceId),
    queryFn: ({ signal }) => getResource(resourceId, signal),
  })
}
