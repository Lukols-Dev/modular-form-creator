import {
  getChangedModules,
  getUnsavedChanges,
  isSameBasicInfo,
  isSameProjectDetails,
} from '../domain/rules'
import type { BasicInfoValues, ProjectDetailsValues, Resource } from '../domain/types'
import { usePendingChanges } from './usePendingChanges'

/**
 * Pending edits of one resource. Only completed resources keep edits in memory: a draft saves
 * each module right away, so for drafts this always reports no changes.
 */
export function useResourceChanges(resource: Resource) {
  const { pendingByResource, apply, revert, prune, discard } = usePendingChanges()
  const changes = getUnsavedChanges(resource, pendingByResource[resource._id])
  const changedModules = getChangedModules(changes)

  return {
    changes,
    changedModules,
    hasChanges: changedModules.length > 0,
    // Applying values equal to the saved ones reverts the module instead of keeping a no-op.
    applyBasicInfo: (values: BasicInfoValues) =>
      isSameBasicInfo(values, resource.basicInfo)
        ? revert(resource, 'basicInfo')
        : apply(resource, { basicInfo: values }),
    applyProjectDetails: (values: ProjectDetailsValues) =>
      isSameProjectDetails(values, resource.projectDetails)
        ? revert(resource, 'projectDetails')
        : apply(resource, { projectDetails: values }),
    discardChanges: () => discard(resource._id),
    /** Call with the server's answer to a successful PUT. */
    pruneSaved: prune,
  }
}
