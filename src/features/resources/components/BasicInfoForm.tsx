import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { Button, Input, Select, type SelectOption } from '../../../design-system'
import { Alert } from '../../../shared/ui/Alert'
import { Form, FormActions } from '../../../shared/ui/form'
import { MAX_DESCRIPTION_LENGTH, PRIORITIES, PRIORITY_LABELS } from '../domain/constants'
import { basicInfoSchema } from '../domain/schemas'
import type { BasicInfoValues } from '../domain/types'

const PRIORITY_OPTIONS: SelectOption[] = [
  { value: '', label: 'Select a priority' },
  ...PRIORITIES.map((priority) => ({
    value: priority,
    label: PRIORITY_LABELS[priority],
  })),
]

interface BasicInfoFormProps {
  /** Shown read-only: the backend locks the name after creation. */
  resourceName: string
  defaultValues: Partial<BasicInfoValues>
  submitLabel: string
  submittingLabel: string
  serverError?: string
  onSubmit: (values: BasicInfoValues) => Promise<void> | void
  onCancel: () => void
}

export function BasicInfoForm({
  resourceName,
  defaultValues,
  submitLabel,
  submittingLabel,
  serverError,
  onSubmit,
  onCancel,
}: BasicInfoFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BasicInfoValues>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues,
  })
  const description = useWatch({ control, name: 'description' }) ?? ''

  return (
    <Form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Not a form field: a locked Input is disabled, and the payload takes the name from the resource. */}
      <Input
        label="Resource name"
        value={resourceName}
        state="locked"
        tooltip="Resource name is immutable after creation."
        helperText="This value cannot be changed."
      />
      <Input
        label="Owner"
        autoComplete="name"
        helperText="Letters A–Z and spaces only."
        error={errors.owner?.message}
        {...register('owner')}
      />
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Description"
        multiline
        rows={5}
        helperText={`${description.trim().length} / ${MAX_DESCRIPTION_LENGTH} characters`}
        error={errors.description?.message}
        {...register('description')}
      />
      <Select
        label="Priority"
        options={PRIORITY_OPTIONS}
        error={errors.priority?.message}
        {...register('priority')}
      />
      {serverError ? (
        <Alert tone="error" title="Basic Info was not saved">
          {serverError}
        </Alert>
      ) : null}
      <FormActions>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
      </FormActions>
    </Form>
  )
}
