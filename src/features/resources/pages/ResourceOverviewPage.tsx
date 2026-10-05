import { Card } from '../../../design-system'
import { getErrorMessage, isRejectedRequest } from '../../../shared/api/client'
import { useFlashMessage } from '../../../shared/hooks/useFlashMessage'
import { useSingleFlight } from '../../../shared/hooks/useSingleFlight'
import { Alert } from '../../../shared/ui/Alert'
import { MutedText, SectionHeading, Stack } from '../../../shared/ui/layout'
import { CompletionPanel } from '../components/CompletionPanel'
import { ModuleCard } from '../components/ModuleCard'
import { MODULES } from '../domain/constants'
import { useProvisionResource } from '../queries/mutations'
import { ModulesGrid } from './ResourceOverviewPage.styles'
import { useResourceContext } from './useResourceContext'

export function ResourceOverviewPage() {
  const { resource } = useResourceContext()
  const provision = useProvisionResource(resource.resourceId)
  const singleFlight = useSingleFlight()
  const flashMessage = useFlashMessage()

  return (
    <Stack $gap="lg">
      {flashMessage ? <Alert tone="success">{flashMessage}</Alert> : null}
      {/* Shown outside the status panels: a failed provisioning reloads the resource, which may
          already be completed in another tab, and the message has to stay visible. */}
      {provision.isError ? (
        <Alert tone="error" title="The resource could not be completed">
          {getErrorMessage(provision.error)}
          {isRejectedRequest(provision.error)
            ? ' The page now shows its current state.'
            : null}
        </Alert>
      ) : null}
      {provision.isSuccess ? (
        <Alert tone="success">The resource is completed.</Alert>
      ) : null}

      {resource.status === 'draft' ? (
        <CompletionPanel
          resource={resource}
          isCompleting={provision.isPending}
          onComplete={() => singleFlight(() => provision.mutateAsync())}
        />
      ) : (
        <Card variant="elevated">
          <SectionHeading>Completed</SectionHeading>
          <MutedText>Both modules are complete and the resource is final.</MutedText>
        </Card>
      )}

      <ModulesGrid>
        {MODULES.map((module) => (
          <ModuleCard key={module} resource={resource} module={module} />
        ))}
      </ModulesGrid>
    </Stack>
  )
}
