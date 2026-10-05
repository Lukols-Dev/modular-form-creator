import { useNavigate } from 'react-router-dom'
import { getErrorMessage } from '../../../shared/api/client'
import { withFlash } from '../../../shared/hooks/useFlashMessage'
import { BasicInfoForm } from '../components/BasicInfoForm'
import { ModuleFormCard } from '../components/ModuleFormCard'
import { getBasicInfoDefaults } from '../domain/rules'
import type { BasicInfoValues } from '../domain/types'
import { useUpdateBasicInfo } from '../queries/mutations'
import { resourcePath } from '../routes'
import { useResourceContext } from './useResourceContext'

export function BasicInfoPage() {
  const { resource } = useResourceContext()
  const navigate = useNavigate()
  const updateBasicInfo = useUpdateBasicInfo(resource.resourceId)
  const overviewPath = resourcePath(resource.resourceId)

  const save = async (values: BasicInfoValues) => {
    try {
      // The backend wants all five fields, including the unchanged name.
      await updateBasicInfo.mutateAsync({ resourceName: resource.name, ...values })
      navigate(overviewPath, withFlash('Basic Info saved.'))
    } catch {
      // The form shows the error from the mutation state.
    }
  }

  return (
    <ModuleFormCard
      title="Basic Info"
      description="Changes are saved to the server when you submit. All fields are required."
      backTo={overviewPath}
    >
      <BasicInfoForm
        resourceName={resource.name}
        defaultValues={getBasicInfoDefaults(resource.basicInfo)}
        submitLabel="Save Basic Info"
        submittingLabel="Saving…"
        serverError={
          updateBasicInfo.isError ? getErrorMessage(updateBasicInfo.error) : undefined
        }
        onSubmit={save}
        onCancel={() => navigate(overviewPath)}
      />
    </ModuleFormCard>
  )
}
