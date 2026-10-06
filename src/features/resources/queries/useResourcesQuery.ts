import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { listResources } from '../api/resourcesApi'
import { isSearchableName } from '../domain/rules'
import type { ResourceListParams, ResourceListResponse } from '../domain/types'
import { resourceKeys } from './resourceKeys'

function emptyPage(pageSize: number): ResourceListResponse {
  return { items: [], pagination: { page: 1, pageSize, totalItems: 0, totalPages: 1 } }
}

export function useResourcesQuery(params: ResourceListParams, { enabled = true } = {}) {
  return useQuery({
    queryKey: resourceKeys.list(params),
    queryFn: async ({ signal }) => {
      const page =
        params.name && !isSearchableName(params.name)
          ? emptyPage(params.pageSize)
          : await listResources(params, signal)
      // The page carries the filters it was loaded with, so the empty state always matches the
      // data on screen, including the previous page shown while the next one loads.
      return { ...page, params }
    },
    enabled,
    placeholderData: keepPreviousData,
  })
}
