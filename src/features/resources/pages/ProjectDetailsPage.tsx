import { useNavigate } from 'react-router-dom'
import { Button } from '../../../design-system'
import { getErrorMessage } from '../../../shared/api/client'
import { withFlash } from '../../../shared/hooks/useFlashMessage'
import { StatePanel } from '../../../shared/ui/StatePanel'
import { ModuleFormCard } from '../components/ModuleFormCard'
import { ProjectDetailsForm } from '../components/ProjectDetailsForm'
import { getProjectDetailsDefaults, isProjectDetailsLocked } from '../domain/rules'
import type { ProjectDetailsValues } from '../domain/types'
import { useUpdateProjectDetails } from '../queries/mutations'
import { modulePath, resourcePath } from '../routes'
import { useResourceContext } from './useResourceContext'

export function ProjectDetailsPage() {
  const { resource } = useResourceContext()
  const navigate = useNavigate()
  const updateProjectDetails = useUpdateProjectDetails(resource.resourceId)
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

  const save = async (values: ProjectDetailsValues) => {
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
      description="Changes are saved to the server when you submit. All fields are required."
      backTo={overviewPath}
    >
      <ProjectDetailsForm
        defaultValues={getProjectDetailsDefaults(resource.projectDetails)}
        submitLabel="Save Project Details"
        submittingLabel="Saving…"
        serverError={
          updateProjectDetails.isError
            ? getErrorMessage(updateProjectDetails.error)
            : undefined
        }
        onSubmit={save}
        onCancel={() => navigate(overviewPath)}
      />
    </ModuleFormCard>
  )
}
