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
  const mongoId = resource._id
  const changes = getUnsavedChanges(
    resource,
    resource.status === 'completed' ? pendingByResource[mongoId] : undefined,
  )
  const changedModules = getChangedModules(changes)

  return {
    changes,
    changedModules,
    hasChanges: changedModules.length > 0,
    // Applying values equal to the saved ones reverts the module instead of keeping a no-op.
    applyBasicInfo: (values: BasicInfoValues) =>
      isSameBasicInfo(values, resource.basicInfo)
        ? revert(mongoId, 'basicInfo')
        : apply(mongoId, { basicInfo: values }),
    applyProjectDetails: (values: ProjectDetailsValues) =>
      isSameProjectDetails(values, resource.projectDetails)
        ? revert(mongoId, 'projectDetails')
        : apply(mongoId, { projectDetails: values }),
    discardChanges: () => discard(mongoId),
    /** Call with the server's answer to a successful PUT. */
    pruneSaved: prune,
  }
}
