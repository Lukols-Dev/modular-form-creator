import { useNavigate } from 'react-router-dom'
import { getErrorMessage } from '../../../shared/api/client'
import { withFlash } from '../../../shared/hooks/useFlashMessage'
import { BasicInfoForm } from '../components/BasicInfoForm'
import { ModuleFormCard } from '../components/ModuleFormCard'
import { getBasicInfoDefaults } from '../domain/rules'
import type { BasicInfoValues } from '../domain/types'
import { useResourceChanges } from '../pending/useResourceChanges'
import { useUpdateBasicInfo } from '../queries/mutations'
import { resourcePath } from '../routes'
import { useResourceContext } from './useResourceContext'

export function BasicInfoPage() {
  const { resource } = useResourceContext()
  const navigate = useNavigate()
  const updateBasicInfo = useUpdateBasicInfo(resource.resourceId)
  const { changes, applyBasicInfo } = useResourceChanges(resource)
  const isCompleted = resource.status === 'completed'
  const overviewPath = resourcePath(resource.resourceId)

  const submit = async (values: BasicInfoValues) => {
    // Completed resource: keep the edit in memory; it is saved later with a single PUT.
    if (isCompleted) {
      applyBasicInfo(values)
      navigate(overviewPath)
      return
    }
    try {
      // The backend wants all five fields, including the unchanged name.
      await updateBasicInfo.mutateAsync(
        { resourceName: resource.name, ...values },
        // Per-call callbacks are skipped once the page unmounts, so a user who has already
        // left is not pulled back when the request finishes.
        { onSuccess: () => navigate(overviewPath, withFlash('Basic Info saved.')) },
      )
    } catch {
      // The form shows the error from the mutation state.
    }
  }

  return (
    <ModuleFormCard title="Basic Info" backTo={overviewPath} isCompleted={isCompleted}>
      <BasicInfoForm
        resourceName={resource.name}
        defaultValues={getBasicInfoDefaults(changes.basicInfo ?? resource.basicInfo)}
        submitLabel={isCompleted ? 'Apply changes' : 'Save Basic Info'}
        submittingLabel={isCompleted ? 'Applying…' : 'Saving…'}
        serverError={
          updateBasicInfo.isError ? getErrorMessage(updateBasicInfo.error) : undefined
        }
        onSubmit={submit}
        onCancel={() => navigate(overviewPath)}
      />
    </ModuleFormCard>
  )
}
