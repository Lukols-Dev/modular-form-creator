import { getErrorMessage, isRejectedRequest } from '../../../shared/api/client'
import { useFlashMessage } from '../../../shared/hooks/useFlashMessage'
import { useSingleFlight } from '../../../shared/hooks/useSingleFlight'
import { Alert } from '../../../shared/ui/Alert'
import { Stack } from '../../../shared/ui/layout'
import { CompletionPanel } from '../components/CompletionPanel'
import { ModuleCard } from '../components/ModuleCard'
import { PendingChangesPanel } from '../components/PendingChangesPanel'
import { MODULES } from '../domain/constants'
import { buildReplacePayload } from '../domain/rules'
import { useResourceChanges } from '../pending/useResourceChanges'
import { useProvisionResource, useReplaceResource } from '../queries/mutations'
import { ModulesGrid } from './ResourceOverviewPage.styles'
import { useResourceContext } from './useResourceContext'

export function ResourceOverviewPage() {
  const { resource } = useResourceContext()
  const provision = useProvisionResource(resource.resourceId)
  const replace = useReplaceResource(resource.resourceId)
  const { changes, changedModules, hasChanges, discardChanges, pruneSaved } =
    useResourceChanges(resource)
  const singleFlight = useSingleFlight()
  const flashMessage = useFlashMessage()

  const saveChanges = () =>
    singleFlight(async () => {
      const payload = buildReplacePayload(resource, changes)
      if (!payload) {
        return
      }
      try {
        const saved = await replace.mutateAsync(payload)
        // Runs even if the user has left the overview meanwhile, so saved edits never linger.
        pruneSaved(saved)
      } catch {
        // The error is shown below and the edits stay pending for another try.
      }
    })

  const discard = () => {
    discardChanges()
    replace.reset()
  }

  return (
    <Stack $gap="lg">
      {/* The confirmation from the previous page is dropped once the user acts here. */}
      {flashMessage && provision.isIdle && replace.isIdle ? (
        <Alert tone="success">{flashMessage}</Alert>
      ) : null}
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
      {replace.isError ? (
        <Alert tone="error" title="Changes were not saved">
          {getErrorMessage(replace.error)} Your edits are kept, so you can try again.
        </Alert>
      ) : null}
      {replace.isSuccess && !hasChanges ? (
        <Alert tone="success">Changes saved.</Alert>
      ) : null}

      {resource.status === 'draft' ? (
        <CompletionPanel
          resource={resource}
          isCompleting={provision.isPending}
          onComplete={() => singleFlight(() => provision.mutateAsync())}
        />
      ) : (
        <PendingChangesPanel
          changedModules={changedModules}
          isSaving={replace.isPending}
          onSave={saveChanges}
          onDiscard={discard}
        />
      )}

      <ModulesGrid>
        {MODULES.map((module) => (
          <ModuleCard
            key={module}
            resource={resource}
            module={module}
            hasUnsavedChanges={changedModules.includes(module)}
          />
        ))}
      </ModulesGrid>
    </Stack>
  )
}
