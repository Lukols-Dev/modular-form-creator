import { apiRequest } from '../../../shared/api/client'
import type {
  BasicInfoPayload,
  ProjectDetailsPayload,
  ReplaceResourcePayload,
  Resource,
  ResourceListParams,
  ResourceListResponse,
} from '../domain/types'

const BASE_PATH = '/api/resources'

export function listResources(params: ResourceListParams, signal?: AbortSignal) {
  const query = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
    sortOrder: params.sortOrder,
  })
  if (params.status) {
    query.set('status', params.status)
  }
  if (params.name) {
    query.set('name', params.name)
  }
  return apiRequest<ResourceListResponse>(`${BASE_PATH}?${query}`, { signal })
}

export function getResource(resourceId: number, signal?: AbortSignal) {
  return apiRequest<Resource>(`${BASE_PATH}/${resourceId}`, { signal })
}

export function createResource(resourceName: string) {
  return apiRequest<Resource>(BASE_PATH, { method: 'POST', body: { resourceName } })
}

export function updateBasicInfo(resourceId: number, payload: BasicInfoPayload) {
  return apiRequest<Resource>(`${BASE_PATH}/${resourceId}/basic-info`, {
    method: 'PATCH',
    body: payload,
  })
}

export function updateProjectDetails(resourceId: number, payload: ProjectDetailsPayload) {
  return apiRequest<Resource>(`${BASE_PATH}/${resourceId}/project-details`, {
    method: 'PATCH',
    body: payload,
  })
}

export function provisionResource(resourceId: number) {
  return apiRequest<Resource>(`${BASE_PATH}/${resourceId}/provisioning`, {
    method: 'PATCH',
  })
}

export function replaceResource(resourceId: number, payload: ReplaceResourcePayload) {
  return apiRequest<Resource>(`${BASE_PATH}/${resourceId}`, {
    method: 'PUT',
    body: payload,
  })
}

export function deleteResource(resourceId: number) {
  return apiRequest<Resource>(`${BASE_PATH}/${resourceId}`, { method: 'DELETE' })
}
