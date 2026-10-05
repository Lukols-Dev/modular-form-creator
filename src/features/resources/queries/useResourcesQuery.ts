import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { listResources } from '../api/resourcesApi'
import { isSearchableName } from '../domain/rules'
import type { ResourceListParams, ResourceListResponse } from '../domain/types'
import { resourceKeys } from './resourceKeys'

function emptyPage(pageSize: number): ResourceListResponse {
  return { items: [], pagination: { page: 1, pageSize, totalItems: 0, totalPages: 1 } }
}

export function useResourcesQuery(params: ResourceListParams) {
  return useQuery({
    queryKey: resourceKeys.list(params),
    queryFn: ({ signal }) =>
      params.name && !isSearchableName(params.name)
        ? emptyPage(params.pageSize)
        : listResources(params, signal),
    // Keep the current page on screen while the next one loads.
    placeholderData: keepPreviousData,
  })
}
