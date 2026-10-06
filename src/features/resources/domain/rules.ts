import {
  MODULES,
  NAME_PATTERN,
  TEAM_MEMBER_OPTIONS,
  type Category,
  type ModuleKey,
  type Priority,
  type TeamMember,
} from './constants'
import type {
  BasicInfo,
  BasicInfoValues,
  PendingChanges,
  ProjectDetails,
  ProjectDetailsValues,
  ReplaceResourcePayload,
  Resource,
} from './types'

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

/** Keeps selected team members in the order of the options, whatever order they were clicked in. */
export function sortTeamMembers(selected: readonly string[]): TeamMember[] {
  return TEAM_MEMBER_OPTIONS.filter((option) => selected.includes(option))
}

/** Form defaults for Basic Info. An empty priority stays undefined so the placeholder shows. */
export function getBasicInfoDefaults(
  basicInfo: BasicInfo | BasicInfoValues,
): Partial<BasicInfoValues> {
  return {
    owner: basicInfo.owner,
    email: basicInfo.email,
    description: basicInfo.description,
    priority: basicInfo.priority || undefined,
  }
}

/** Form defaults for Project Details. An empty category stays undefined so the placeholder shows. */
export function getProjectDetailsDefaults(
  projectDetails: ProjectDetails | ProjectDetailsValues,
): Partial<ProjectDetailsValues> {
  return {
    projectName: projectDetails.projectName,
    budget: projectDetails.budget,
    category: projectDetails.category || undefined,
    options: sortTeamMembers(projectDetails.options),
  }
}

function sameMembers(first: readonly string[], second: readonly string[]): boolean {
  return first.length === second.length && first.every((item) => second.includes(item))
}

export function isSameBasicInfo(values: BasicInfoValues, saved: BasicInfo): boolean {
  return (
    values.owner === saved.owner &&
    values.email === saved.email &&
    values.description === saved.description &&
    values.priority === saved.priority
  )
}

export function isSameProjectDetails(
  values: ProjectDetailsValues,
  saved: ProjectDetails,
): boolean {
  return (
    values.projectName === saved.projectName &&
    values.budget === saved.budget &&
    values.category === saved.category &&
    sameMembers(values.options, saved.options)
  )
}

/**
 * Pending modules that still differ from the saved resource. Only a completed resource keeps
 * pending changes: a draft saves every module right away.
 */
export function getUnsavedChanges(
  resource: Resource,
  pending: PendingChanges | undefined,
): PendingChanges {
  const changes: PendingChanges = {}
  if (resource.status !== 'completed') {
    return changes
  }
  if (pending?.basicInfo && !isSameBasicInfo(pending.basicInfo, resource.basicInfo)) {
    changes.basicInfo = pending.basicInfo
  }
  if (
    pending?.projectDetails &&
    !isSameProjectDetails(pending.projectDetails, resource.projectDetails)
  ) {
    changes.projectDetails = pending.projectDetails
  }
  return changes
}

export function getChangedModules(changes: PendingChanges): ModuleKey[] {
  return MODULES.filter((module) => changes[module] !== undefined)
}

export function hasUnsavedChanges(
  resource: Resource,
  pending: PendingChanges | undefined,
): boolean {
  return getChangedModules(getUnsavedChanges(resource, pending)).length > 0
}

function pickBasicInfoValues(basicInfo: BasicInfo): BasicInfoValues | null {
  if (!isBasicInfoComplete(basicInfo)) {
    return null
  }
  const { owner, email, description, priority } = basicInfo
  return { owner, email, description, priority }
}

function pickProjectDetailsValues(
  projectDetails: ProjectDetails,
): ProjectDetailsValues | null {
  if (!isProjectDetailsComplete(projectDetails)) {
    return null
  }
  const { projectName, budget, category, options } = projectDetails
  return { projectName, budget, category, options }
}

/**
 * Builds the full PUT body. The backend answers 500 when any part is missing, so modules without
 * changes are taken from the saved resource. Returns null if a module is incomplete, which
 * cannot happen for a completed resource.
 */
export function buildReplacePayload(
  resource: Resource,
  changes: PendingChanges,
): ReplaceResourcePayload | null {
  const basicInfo = changes.basicInfo ?? pickBasicInfoValues(resource.basicInfo)
  const projectDetails =
    changes.projectDetails ?? pickProjectDetailsValues(resource.projectDetails)
  if (!basicInfo || !projectDetails) {
    return null
  }
  return {
    name: resource.name,
    basicInfo: { resourceName: resource.name, ...basicInfo },
    projectDetails,
  }
}
