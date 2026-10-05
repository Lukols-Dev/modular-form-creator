import { useSearchParams } from 'react-router-dom'
import {
  RESOURCE_STATUSES,
  SORT_ORDERS,
  type ResourceStatus,
  type SortOrder,
} from '../domain/constants'

export interface ResourceListFilters {
  page: number
  status: ResourceStatus | undefined
  search: string
  sortOrder: SortOrder
}

type FilterParam = 'page' | 'status' | 'q' | 'sort'

interface UpdateOptions {
  replace?: boolean
  flushSync?: boolean
}

function readFilters(params: URLSearchParams): ResourceListFilters {
  const page = Number(params.get('page') ?? 1)
  return {
    // Invalid values fall back to defaults instead of reaching the API (page=0 is a 400 there).
    page: Number.isSafeInteger(page) && page > 0 ? page : 1,
    status: RESOURCE_STATUSES.find((status) => status === params.get('status')),
    search: params.get('q') ?? '',
    sortOrder:
      SORT_ORDERS.find((sortOrder) => sortOrder === params.get('sort')) ?? 'desc',
  }
}

/** List filters live in the URL, so they survive a refresh and can be shared as a link. */
export function useResourceListFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = readFilters(searchParams)

  const update = (
    changes: Partial<Record<FilterParam, string>>,
    options: UpdateOptions = {},
  ) => {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current)
        for (const [key, value] of Object.entries(changes)) {
          if (value) {
            next.set(key, value)
          } else {
            next.delete(key)
          }
        }
        return next
      },
      { preventScrollReset: true, ...options },
    )
  }

  return {
    filters,
    setPage: (page: number, options?: UpdateOptions) =>
      update({ page: page > 1 ? String(page) : undefined }, options),
    setStatus: (status: ResourceStatus | undefined) =>
      update({ status, page: undefined }),
    setSortOrder: (sortOrder: SortOrder) =>
      update({ sort: sortOrder === 'desc' ? undefined : sortOrder, page: undefined }),
    // Typing replaces the history entry and renders synchronously, so the caret never jumps.
    setSearch: (search: string) =>
      update(
        { q: search || undefined, page: undefined },
        { replace: true, flushSync: true },
      ),
    clearFilters: () => update({ status: undefined, q: undefined, page: undefined }),
  }
}
