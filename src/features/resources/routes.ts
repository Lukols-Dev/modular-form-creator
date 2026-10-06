import type { ModuleKey } from './domain/constants'

const MODULE_SEGMENTS: Record<ModuleKey, string> = {
  basicInfo: 'basic-info',
  projectDetails: 'project-details',
}

export const RESOURCES_PATH = '/resources'

export function resourcePath(resourceId: number) {
  return `${RESOURCES_PATH}/${resourceId}`
}

export function resourceDetailsPath(resourceId: number) {
  return `${resourcePath(resourceId)}/details`
}

export function modulePath(resourceId: number, module: ModuleKey) {
  return `${resourcePath(resourceId)}/${MODULE_SEGMENTS[module]}`
}

/** Route ids are positive integers in canonical form; anything else is rejected before a request. */
export function parseResourceId(value: string | undefined): number | null {
  if (!value || !/^[1-9]\d*$/.test(value)) {
    return null
  }
  const resourceId = Number(value)
  return Number.isSafeInteger(resourceId) ? resourceId : null
}
