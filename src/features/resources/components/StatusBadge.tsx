import { Badge, type BadgeVariant } from '../../../design-system'
import { STATUS_LABELS, type ResourceStatus } from '../domain/constants'

const STATUS_VARIANTS: Record<ResourceStatus, BadgeVariant> = {
  draft: 'info',
  completed: 'success',
}

export function StatusBadge({ status }: { status: ResourceStatus }) {
  return <Badge variant={STATUS_VARIANTS[status]}>{STATUS_LABELS[status]}</Badge>
}
