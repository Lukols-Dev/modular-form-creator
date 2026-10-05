import {
  MODULES,
  NAME_PATTERN,
  type Category,
  type ModuleKey,
  type Priority,
} from './constants'
import type { BasicInfo, ProjectDetails, Resource } from './types'

export type ModuleState = 'complete' | 'notStarted' | 'locked'

type CompleteBasicInfo = BasicInfo & { priority: Priority }
type CompleteProjectDetails = ProjectDetails & { category: Category }

/** Same rule as the backend: every Basic Info field, including the resource name, is filled in. */
export function isBasicInfoComplete(
  basicInfo: BasicInfo,
): basicInfo is CompleteBasicInfo {
  return Boolean(
    basicInfo.resourceName &&
    basicInfo.owner &&
    basicInfo.email &&
    basicInfo.description &&
    basicInfo.priority,
  )
}

/** Same rule as the backend. A budget of "0" is a non-empty string, so it counts as filled in. */
export function isProjectDetailsComplete(
  projectDetails: ProjectDetails,
): projectDetails is CompleteProjectDetails {
  return Boolean(
    projectDetails.projectName &&
    projectDetails.budget &&
    projectDetails.category &&
    projectDetails.options.length > 0,
  )
}

/** The backend accepts Project Details only once Basic Info is complete. */
export function isProjectDetailsLocked(resource: Resource): boolean {
  return resource.status === 'draft' && !isBasicInfoComplete(resource.basicInfo)
}

export function getModuleState(resource: Resource, module: ModuleKey): ModuleState {
  if (module === 'basicInfo') {
    return isBasicInfoComplete(resource.basicInfo) ? 'complete' : 'notStarted'
  }
  if (isProjectDetailsComplete(resource.projectDetails)) {
    return 'complete'
  }
  return isProjectDetailsLocked(resource) ? 'locked' : 'notStarted'
}

export function getIncompleteModules(resource: Resource): ModuleKey[] {
  return MODULES.filter((module) => getModuleState(resource, module) !== 'complete')
}

export function countCompletedModules(resource: Resource): number {
  return MODULES.length - getIncompleteModules(resource).length
}

/** Provisioning is the only way from draft to completed, and it needs both modules. */
export function canProvision(resource: Resource): boolean {
  return resource.status === 'draft' && getIncompleteModules(resource).length === 0
}

/**
 * The backend passes the search term straight into a MongoDB `$regex`, so a term such as "("
 * fails with a 500. Names only ever contain letters, digits, spaces and hyphens, so a term with
 * any other character cannot match and does not need a request.
 */
export function isSearchableName(term: string): boolean {
  return NAME_PATTERN.test(term)
}
