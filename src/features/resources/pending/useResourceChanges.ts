import {
  getChangedModules,
  getUnsavedChanges,
  isSameBasicInfo,
  isSameProjectDetails,
} from '../domain/rules'
import type { BasicInfoValues, ProjectDetailsValues, Resource } from '../domain/types'
import { usePendingChanges } from './usePendingChanges'

/**
 * Unsaved edits of one resource. Only completed resources use the buffer: a draft saves each
 * module right away, so for drafts this always reports no changes.
 */
export function useResourceChanges(resource: Resource) {
  const { pendingByResource, stage, unstage, discard } = usePendingChanges()
  const resourceKey = resource._id
  const changes = getUnsavedChanges(
    resource,
    resource.status === 'completed' ? pendingByResource[resourceKey] : undefined,
  )
  const changedModules = getChangedModules(changes)

  return {
    changes,
    changedModules,
    hasChanges: changedModules.length > 0,
    // Applying values equal to the saved ones removes the module instead of staging a no-op.
    applyBasicInfo: (values: BasicInfoValues) =>
      isSameBasicInfo(values, resource.basicInfo)
        ? unstage(resourceKey, 'basicInfo')
        : stage(resourceKey, { basicInfo: values }),
    applyProjectDetails: (values: ProjectDetailsValues) =>
      isSameProjectDetails(values, resource.projectDetails)
        ? unstage(resourceKey, 'projectDetails')
        : stage(resourceKey, { projectDetails: values }),
    discardChanges: () => discard(resourceKey),
  }
}
