import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../../design-system'
import { getErrorMessage, isApiError } from '../../../shared/api/client'
import { Alert } from '../../../shared/ui/Alert'
import { Stack } from '../../../shared/ui/layout'
import { StatePanel } from '../../../shared/ui/StatePanel'
import { ResourceHeader } from '../components/ResourceHeader'
import { useResourceQuery } from '../queries/useResourceQuery'
import { parseResourceId, RESOURCES_PATH } from '../routes'
import type { ResourceOutletContext } from './useResourceContext'

/** Loads the resource once for all of its routes and handles loading, missing and error states. */
export function ResourceLayout() {
  const resourceId = parseResourceId(useParams().resourceId)

  if (resourceId === null) {
    return (
      <MissingResource
        title="Invalid resource address"
        description="Resource addresses end with a positive number, for example /resources/1."
      />
    )
  }
  // A new key gives another resource fresh pages, so no form state leaks between resources.
  return <ResourceScreen key={resourceId} resourceId={resourceId} />
}

function ResourceScreen({ resourceId }: { resourceId: number }) {
  const { data: resource, error, isFetching, refetch } = useResourceQuery(resourceId)

  if (isApiError(error, 404) || isApiError(error, 400)) {
    return (
      <MissingResource
        title="Resource not found"
        description="It may have been deleted, or the address is wrong."
      />
    )
  }

  const retryButton = (
    <Button
      type="button"
      variant="secondary"
      disabled={isFetching}
      onClick={() => refetch()}
    >
      {isFetching ? 'Retrying…' : 'Retry'}
    </Button>
  )

  if (!resource) {
    return error ? (
      <StatePanel
        tone="error"
        title="Could not load the resource"
        description={getErrorMessage(error)}
        action={retryButton}
      />
    ) : (
      <StatePanel busy title="Loading resource…" />
    )
  }

  return (
    <Stack $gap="lg">
      <title>{`${resource.name} · Modular Form Creator`}</title>
      <ResourceHeader resource={resource} />
      {error ? (
        <Alert tone="warning" title="This data may be out of date" actions={retryButton}>
          {getErrorMessage(error)}
        </Alert>
      ) : null}
      <Outlet context={{ resource } satisfies ResourceOutletContext} />
    </Stack>
  )
}

function MissingResource({ title, description }: { title: string; description: string }) {
  const navigate = useNavigate()

  return (
    <>
      <title>{`${title} · Modular Form Creator`}</title>
      <StatePanel
        title={title}
        description={description}
        action={
          <Button onClick={() => navigate(RESOURCES_PATH)}>Back to resources</Button>
        }
      />
    </>
  )
}
