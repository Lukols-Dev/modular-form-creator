import { useNavigate } from 'react-router-dom'
import { Button } from '../../../design-system'
import { getErrorMessage } from '../../../shared/api/client'
import { withFlash } from '../../../shared/hooks/useFlashMessage'
import { StatePanel } from '../../../shared/ui/StatePanel'
import { CompletedEditNotice } from '../components/CompletedEditNotice'
import { ModuleFormCard } from '../components/ModuleFormCard'
import { ProjectDetailsForm } from '../components/ProjectDetailsForm'
import { getProjectDetailsDefaults, isProjectDetailsLocked } from '../domain/rules'
import type { ProjectDetailsValues } from '../domain/types'
import { useResourceChanges } from '../pending/useResourceChanges'
import { useUpdateProjectDetails } from '../queries/mutations'
import { modulePath, resourcePath } from '../routes'
import { useResourceContext } from './useResourceContext'

export function ProjectDetailsPage() {
  const { resource } = useResourceContext()
  const navigate = useNavigate()
  const updateProjectDetails = useUpdateProjectDetails(resource.resourceId)
  const { changes, applyProjectDetails } = useResourceChanges(resource)
  const isCompleted = resource.status === 'completed'
  const overviewPath = resourcePath(resource.resourceId)

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
            <Button variant="secondary" onClick={() => navigate(overviewPath)}>
              Back to overview
            </Button>
          </>
        }
      />
    )
  }

  const submit = async (values: ProjectDetailsValues) => {
    // Completed resource: keep the edit in memory; it is saved later with a single PUT.
    if (isCompleted) {
      applyProjectDetails(values)
      navigate(overviewPath)
      return
    }
    try {
      await updateProjectDetails.mutateAsync(values)
      navigate(overviewPath, withFlash('Project Details saved.'))
    } catch {
      // The form shows the error from the mutation state.
    }
  }

  return (
    <ModuleFormCard
      title="Project Details"
      description={
        isCompleted
          ? 'Edit the module and apply the changes. All fields are required.'
          : 'Changes are saved to the server when you submit. All fields are required.'
      }
      backTo={overviewPath}
      notice={isCompleted ? <CompletedEditNotice /> : null}
    >
      <ProjectDetailsForm
        defaultValues={getProjectDetailsDefaults(
          changes.projectDetails ?? resource.projectDetails,
        )}
        submitLabel={isCompleted ? 'Apply changes' : 'Save Project Details'}
        submittingLabel={isCompleted ? 'Applying…' : 'Saving…'}
        serverError={
          updateProjectDetails.isError
            ? getErrorMessage(updateProjectDetails.error)
            : undefined
        }
        onSubmit={submit}
        onCancel={() => navigate(overviewPath)}
      />
    </ModuleFormCard>
  )
}
