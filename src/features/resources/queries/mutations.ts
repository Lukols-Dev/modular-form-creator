import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createResource, deleteResource } from '../api/resourcesApi'
import type { Resource } from '../domain/types'
import { resourceKeys } from './resourceKeys'

export function useCreateResource() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createResource,
    onSuccess: (resource) => {
      queryClient.setQueryData(resourceKeys.detail(resource.resourceId), resource)
      void queryClient.invalidateQueries({ queryKey: resourceKeys.lists() })
    },
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
