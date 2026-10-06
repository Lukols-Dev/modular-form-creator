import { BasicInfoForm } from '../components/BasicInfoForm'
import { ModuleFormCard } from '../components/ModuleFormCard'
import { getBasicInfoDefaults } from '../domain/rules'
import type { BasicInfoValues } from '../domain/types'
import { useResourceChanges } from '../pending/useResourceChanges'
import { useUpdateBasicInfo } from '../queries/mutations'
import { useModuleSubmit } from './useModuleSubmit'
import { useResourceContext } from './useResourceContext'

export function BasicInfoPage() {
  const { resource } = useResourceContext()
  const updateBasicInfo = useUpdateBasicInfo(resource.resourceId)
  const { changes, applyBasicInfo } = useResourceChanges(resource)
  const form = useModuleSubmit(resource, {
    apply: applyBasicInfo,
    save: (values: BasicInfoValues, onSaved) =>
      // The backend wants all five fields, including the unchanged name.
      updateBasicInfo.mutateAsync(
        { resourceName: resource.name, ...values },
        { onSuccess: onSaved },
      ),
    saveError: updateBasicInfo.error,
    saveLabel: 'Save Basic Info',
    savedMessage: 'Basic Info saved.',
  })

  return (
    <ModuleFormCard
      title="Basic Info"
      backTo={form.overviewPath}
      isCompleted={form.isCompleted}
    >
      <BasicInfoForm
        resourceName={resource.name}
        defaultValues={getBasicInfoDefaults(changes.basicInfo ?? resource.basicInfo)}
        submitLabel={form.submitLabel}
        submittingLabel={form.submittingLabel}
        serverError={form.serverError}
        onSubmit={form.submit}
        onCancel={form.cancel}
      />
    </ModuleFormCard>
  )
}
