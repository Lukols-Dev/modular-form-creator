import { Button } from '../../../design-system'
import type { Pagination } from '../domain/types'
import { Bar, Controls, PageNumber, Summary } from './PaginationBar.styles'

interface PaginationBarProps {
  pagination: Pagination
  onPageChange: (page: number) => void
}

export function PaginationBar({ pagination, onPageChange }: PaginationBarProps) {
  const { page, pageSize, totalItems, totalPages } = pagination
  const firstItem = (page - 1) * pageSize + 1
  const lastItem = Math.min(page * pageSize, totalItems)

  return (
    <Bar aria-label="Pagination">
      <Summary>
        Showing {firstItem}–{lastItem} of {totalItems}
      </Summary>
      <Controls>
        <Button
          type="button"
          variant="secondary"
          size="small"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <PageNumber aria-live="polite">
          Page {page} of {totalPages}
        </PageNumber>
        <Button
          type="button"
          variant="secondary"
          size="small"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </Controls>
    </Bar>
  )
}
