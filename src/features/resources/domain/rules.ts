import { NAME_PATTERN, type Category, type Priority } from './constants'
import type { BasicInfo, ProjectDetails, Resource } from './types'

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

export function countCompletedModules(resource: Resource): number {
  return (
    Number(isBasicInfoComplete(resource.basicInfo)) +
    Number(isProjectDetailsComplete(resource.projectDetails))
  )
}

/**
 * The backend passes the search term straight into a MongoDB `$regex`, so a term such as "("
 * fails with a 500. Names only ever contain letters, digits, spaces and hyphens, so a term with
 * any other character cannot match and does not need a request.
 */
export function isSearchableName(term: string): boolean {
  return NAME_PATTERN.test(term)
}
