import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isRejectedRequest } from '../../../shared/api/client'
import { createResource, deleteResource, provisionResource } from '../api/resourcesApi'
import type { Resource } from '../domain/types'
import { resourceKeys } from './resourceKeys'

/** Puts the server's copy of a saved resource into the cache and refreshes the lists. */
function useStoreResource() {
  const queryClient = useQueryClient()

  return (resource: Resource) => {
    queryClient.setQueryData(resourceKeys.detail(resource.resourceId), resource)
    void queryClient.invalidateQueries({ queryKey: resourceKeys.lists() })
  }
}

/**
 * A rejected change usually means the cached copy is stale, for example the resource was
 * completed or deleted in another tab. Reload it, so the page shows the current state.
 */
function useReloadAfterRejection(resourceId: number) {
  const queryClient = useQueryClient()

  return async (error: Error) => {
    if (isRejectedRequest(error)) {
      await queryClient.invalidateQueries({ queryKey: resourceKeys.detail(resourceId) })
    }
  }
}

export function useCreateResource() {
  const storeResource = useStoreResource()

  return useMutation({
    mutationFn: createResource,
    onSuccess: storeResource,
  })
}

export function useProvisionResource(resourceId: number) {
  const storeResource = useStoreResource()
  const reloadAfterRejection = useReloadAfterRejection(resourceId)

  return useMutation({
    mutationFn: () => provisionResource(resourceId),
    onSuccess: storeResource,
    onError: reloadAfterRejection,
  })
}

export function useDeleteResource() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (resource: Resource) => deleteResource(resource.resourceId),
    onSuccess: (_deleted, resource) => {
      queryClient.removeQueries({ queryKey: resourceKeys.detail(resource.resourceId) })
    },
    // Wait for the refreshed list, so the deleted row never flashes back.
    onSettled: () => queryClient.invalidateQueries({ queryKey: resourceKeys.lists() }),
  })
}
