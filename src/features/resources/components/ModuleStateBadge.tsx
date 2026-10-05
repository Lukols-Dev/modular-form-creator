import { Badge, type BadgeVariant } from '../../../design-system'
import type { ModuleState } from '../domain/rules'

const STATE_LABELS: Record<ModuleState, string> = {
  complete: 'Complete',
  notStarted: 'Not started',
  locked: 'Locked',
}

const STATE_VARIANTS: Record<ModuleState, BadgeVariant> = {
  complete: 'success',
  notStarted: 'neutral',
  locked: 'neutral',
}

export function ModuleStateBadge({ state }: { state: ModuleState }) {
  return (
    <Badge variant={STATE_VARIANTS[state]}>
      {state === 'locked' ? <span aria-hidden="true">🔒&nbsp;</span> : null}
      {STATE_LABELS[state]}
    </Badge>
  )
}
