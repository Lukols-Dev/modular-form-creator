import { IconButton } from '../../../design-system'
import { formatDate } from '../../../shared/format'
import { VisuallyHidden } from '../../../shared/ui/layout'
import { MODULES } from '../domain/constants'
import { countCompletedModules } from '../domain/rules'
import type { Resource } from '../domain/types'
import { resourcePath } from '../routes'
import {
  NameCell,
  NameLink,
  SecondaryText,
  Table,
  TableScroller,
} from './ResourceTable.styles'
import { StatusBadge } from './StatusBadge'

interface ResourceTableProps {
  resources: Resource[]
  /** Dims the rows while another page is loading. */
  isStale: boolean
  onDelete: (resource: Resource) => void
}

export function ResourceTable({ resources, isStale, onDelete }: ResourceTableProps) {
  return (
    <TableScroller $dimmed={isStale} aria-busy={isStale}>
      <Table>
        <VisuallyHidden as="caption">Resources</VisuallyHidden>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Status</th>
            <th scope="col">Modules</th>
            <th scope="col">Created</th>
            <th scope="col">
              <VisuallyHidden>Actions</VisuallyHidden>
            </th>
          </tr>
        </thead>
        <tbody>
          {resources.map((resource) => (
            <tr key={resource._id}>
              <td>
                <NameCell>
                  <NameLink to={resourcePath(resource.resourceId)}>
                    {resource.name}
                  </NameLink>
                  <SecondaryText>#{resource.resourceId}</SecondaryText>
                </NameCell>
              </td>
              <td>
                <StatusBadge status={resource.status} />
              </td>
              <td>
                {countCompletedModules(resource)} of {MODULES.length} complete
              </td>
              <td>
                <SecondaryText as="time" dateTime={resource.createdAt}>
                  {formatDate(resource.createdAt)}
                </SecondaryText>
              </td>
              <td>
                <IconButton
                  type="button"
                  variant="ghost"
                  size="small"
                  aria-label={`Delete ${resource.name}`}
                  title="Delete"
                  onClick={() => onDelete(resource)}
                >
                  🗑️
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableScroller>
  )
}
