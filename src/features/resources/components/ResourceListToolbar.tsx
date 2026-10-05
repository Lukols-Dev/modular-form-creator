import { Input, Select, type SelectOption } from '../../../design-system'
import {
  RESOURCE_STATUSES,
  SORT_ORDERS,
  STATUS_LABELS,
  type ResourceStatus,
  type SortOrder,
} from '../domain/constants'
import { Toolbar } from './ResourceListToolbar.styles'

const STATUS_OPTIONS: SelectOption[] = [
  { value: '', label: 'All statuses' },
  ...RESOURCE_STATUSES.map((status) => ({ value: status, label: STATUS_LABELS[status] })),
]

const SORT_LABELS: Record<SortOrder, string> = {
  desc: 'Newest first',
  asc: 'Oldest first',
}

const SORT_OPTIONS: SelectOption[] = SORT_ORDERS.map((sortOrder) => ({
  value: sortOrder,
  label: SORT_LABELS[sortOrder],
}))

interface ResourceListToolbarProps {
  search: string
  searchError?: string
  status: ResourceStatus | undefined
  sortOrder: SortOrder
  onSearchChange: (search: string) => void
  onStatusChange: (status: ResourceStatus | undefined) => void
  onSortOrderChange: (sortOrder: SortOrder) => void
}

export function ResourceListToolbar({
  search,
  searchError,
  status,
  sortOrder,
  onSearchChange,
  onStatusChange,
  onSortOrderChange,
}: ResourceListToolbarProps) {
  return (
    <Toolbar role="search">
      <Input
        type="search"
        label="Search by name"
        placeholder="e.g. Hiring Pipeline"
        autoComplete="off"
        value={search}
        error={searchError}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      <Select
        label="Status"
        options={STATUS_OPTIONS}
        value={status ?? ''}
        onChange={(event) =>
          onStatusChange(RESOURCE_STATUSES.find((value) => value === event.target.value))
        }
      />
      <Select
        label="Sort"
        options={SORT_OPTIONS}
        value={sortOrder}
        onChange={(event) =>
          onSortOrderChange(
            SORT_ORDERS.find((value) => value === event.target.value) ?? 'desc',
          )
        }
      />
    </Toolbar>
  )
}
