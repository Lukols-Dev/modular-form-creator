import { useId } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge, Button, Card } from '../../../design-system'
import { MutedText, SectionHeading, SmallText } from '../../../shared/ui/layout'
import { MODULE_LABELS, type ModuleKey } from '../domain/constants'
import { getModuleState } from '../domain/rules'
import type { Resource } from '../domain/types'
import { modulePath } from '../routes'
import { Badges, CardActions, CardHeader } from './ModuleCard.styles'
import { ModuleStateBadge } from './ModuleStateBadge'

const MODULE_DESCRIPTIONS: Record<ModuleKey, string> = {
  basicInfo: 'Owner, contact email, description and priority.',
  projectDetails: 'Project name, budget, category and the team members needed.',
}

interface ModuleCardProps {
  resource: Resource
  module: ModuleKey
  hasUnsavedChanges: boolean
}

export function ModuleCard({ resource, module, hasUnsavedChanges }: ModuleCardProps) {
  const navigate = useNavigate()
  const hintId = useId()
  const state = getModuleState(resource, module)
  const label = MODULE_LABELS[module]

  return (
    <Card variant="outline">
      <CardHeader>
        <SectionHeading>{label}</SectionHeading>
        <Badges>
          <ModuleStateBadge state={state} />
          {hasUnsavedChanges ? <Badge variant="warning">Unsaved changes</Badge> : null}
        </Badges>
      </CardHeader>
      <MutedText>{MODULE_DESCRIPTIONS[module]}</MutedText>
      <CardActions>
        {state === 'locked' ? (
          <>
            <Button
              type="button"
              variant="secondary"
              state="locked"
              aria-describedby={hintId}
            >
              {label}
            </Button>
            <SmallText id={hintId}>
              Complete Basic Info first to unlock this module.
            </SmallText>
          </>
        ) : (
          <Button
            type="button"
            variant={state === 'complete' ? 'secondary' : 'primary'}
            onClick={() => navigate(modulePath(resource.resourceId, module))}
          >
            {state === 'complete' ? `Edit ${label}` : `Start ${label}`}
          </Button>
        )}
      </CardActions>
    </Card>
  )
}
