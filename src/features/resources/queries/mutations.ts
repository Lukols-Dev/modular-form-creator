import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isApiError, isRejectedRequest } from '../../../shared/api/client'
import {
  createResource,
  deleteResource,
  provisionResource,
  replaceResource,
  updateBasicInfo,
  updateProjectDetails,
} from '../api/resourcesApi'
import type {
  BasicInfoPayload,
  ProjectDetailsPayload,
  ReplaceResourcePayload,
  Resource,
} from '../domain/types'
import { usePendingChanges } from '../pending/usePendingChanges'
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

export function useUpdateBasicInfo(resourceId: number) {
  const storeResource = useStoreResource()
  const reloadAfterRejection = useReloadAfterRejection(resourceId)

  return useMutation({
    mutationFn: (payload: BasicInfoPayload) => updateBasicInfo(resourceId, payload),
    onSuccess: storeResource,
    onError: reloadAfterRejection,
  })
}

export function useUpdateProjectDetails(resourceId: number) {
  const storeResource = useStoreResource()
  const reloadAfterRejection = useReloadAfterRejection(resourceId)

  return useMutation({
    mutationFn: (payload: ProjectDetailsPayload) =>
      updateProjectDetails(resourceId, payload),
    onSuccess: storeResource,
    onError: reloadAfterRejection,
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

/** Saves all modules of a completed resource in one request. */
export function useReplaceResource(resourceId: number) {
  const storeResource = useStoreResource()
  const reloadAfterRejection = useReloadAfterRejection(resourceId)

  return useMutation({
    mutationFn: (payload: ReplaceResourcePayload) => replaceResource(resourceId, payload),
    onSuccess: storeResource,
    onError: reloadAfterRejection,
  })
}

export function useDeleteResource() {
  const queryClient = useQueryClient()
  const { discard } = usePendingChanges()

  const forget = (resource: Resource) => {
    queryClient.removeQueries({ queryKey: resourceKeys.detail(resource.resourceId) })
    discard(resource._id)
  }

  return useMutation({
    mutationFn: (resource: Resource) => deleteResource(resource.resourceId),
    onSuccess: (_deleted, resource) => forget(resource),
    // A 404 means it was already deleted elsewhere, which is the outcome the user asked for.
    onError: (error, resource) => {
      if (isApiError(error, 404)) {
        forget(resource)
      }
    },
    // Wait for the refreshed list, so the deleted row never flashes back.
    onSettled: () => queryClient.invalidateQueries({ queryKey: resourceKeys.lists() }),
  })
}
