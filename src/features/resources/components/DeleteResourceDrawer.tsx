import { Button, Drawer } from '../../../design-system'
import { getErrorMessage, isApiError } from '../../../shared/api/client'
import { useSingleFlight } from '../../../shared/hooks/useSingleFlight'
import { Alert } from '../../../shared/ui/Alert'
import { FormActions } from '../../../shared/ui/form'
import { MutedText, Stack } from '../../../shared/ui/layout'
import type { Resource } from '../domain/types'
import { useDeleteResource } from '../queries/mutations'

interface DeleteResourceDrawerProps {
  /** The resource to delete; the drawer is open while it is set. */
  resource: Resource | null
  onClose: () => void
}

export function DeleteResourceDrawer({ resource, onClose }: DeleteResourceDrawerProps) {
  const isOpen = resource !== null

  return (
    <div inert={!isOpen}>
      <Drawer title="Delete resource" isOpen={isOpen} onClose={onClose}>
        {resource ? (
          <DeleteConfirmation key={resource._id} resource={resource} onClose={onClose} />
        ) : null}
      </Drawer>
    </div>
  )
}

function DeleteConfirmation({
  resource,
  onClose,
}: {
  resource: Resource
  onClose: () => void
}) {
  const deleteResource = useDeleteResource()
  const singleFlight = useSingleFlight()

  const confirmDelete = () =>
    singleFlight(async () => {
      try {
        await deleteResource.mutateAsync(resource)
        onClose()
      } catch (error) {
        // Someone else already deleted it, which is the outcome the user asked for.
        if (isApiError(error, 404)) {
          onClose()
        }
      }
    })

  return (
    <Stack $gap="lg">
      <MutedText>
        <strong>{resource.name}</strong> and both of its modules will be deleted
        permanently. This cannot be undone.
      </MutedText>
      {deleteResource.isError ? (
        <Alert tone="error">{getErrorMessage(deleteResource.error)}</Alert>
      ) : null}
      <FormActions>
        <Button type="button" variant="secondary" autoFocus onClick={onClose}>
          Cancel
        </Button>
        <Button type="button" disabled={deleteResource.isPending} onClick={confirmDelete}>
          {deleteResource.isPending ? 'Deleting…' : 'Delete resource'}
        </Button>
      </FormActions>
    </Stack>
  )
}
