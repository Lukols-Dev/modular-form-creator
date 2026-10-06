import { useNavigate } from 'react-router-dom'
import { Button } from '../../../design-system'
import { StatePanel } from '../../../shared/ui/StatePanel'
import { ModuleFormCard } from '../components/ModuleFormCard'
import { ProjectDetailsForm } from '../components/ProjectDetailsForm'
import { getProjectDetailsDefaults, isProjectDetailsLocked } from '../domain/rules'
import type { ProjectDetailsValues } from '../domain/types'
import { useResourceChanges } from '../pending/useResourceChanges'
import { useUpdateProjectDetails } from '../queries/mutations'
import { modulePath } from '../routes'
import { useModuleSubmit } from './useModuleSubmit'
import { useResourceContext } from './useResourceContext'

export function ProjectDetailsPage() {
  const { resource } = useResourceContext()
  const navigate = useNavigate()
  const updateProjectDetails = useUpdateProjectDetails(resource.resourceId)
  const { changes, applyProjectDetails } = useResourceChanges(resource)
  const form = useModuleSubmit(resource, {
    apply: applyProjectDetails,
    save: (values: ProjectDetailsValues, onSaved) =>
      updateProjectDetails.mutateAsync(values, { onSuccess: onSaved }),
    saveError: updateProjectDetails.error,
    saveLabel: 'Save Project Details',
    savedMessage: 'Project Details saved.',
  })

  // Also guards direct visits by URL: the backend rejects Project Details before Basic Info.
  if (isProjectDetailsLocked(resource)) {
    return (
      <StatePanel
        title="Project Details is locked"
        description="Complete Basic Info first. Project Details unlocks as soon as Basic Info is saved."
        action={
          <>
            <Button
              onClick={() => navigate(modulePath(resource.resourceId, 'basicInfo'))}
            >
              Go to Basic Info
            </Button>
            <Button variant="secondary" onClick={form.cancel}>
              Back to overview
            </Button>
          </>
        }
      />
    )
  }

  return (
    <ModuleFormCard
      title="Project Details"
      backTo={form.overviewPath}
      isCompleted={form.isCompleted}
    >
      <ProjectDetailsForm
        defaultValues={getProjectDetailsDefaults(
          changes.projectDetails ?? resource.projectDetails,
        )}
        submitLabel={form.submitLabel}
        submittingLabel={form.submittingLabel}
        serverError={form.serverError}
        onSubmit={form.submit}
        onCancel={form.cancel}
      />
    </ModuleFormCard>
  )
}
