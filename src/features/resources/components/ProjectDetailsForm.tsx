import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import {
  Button,
  CheckboxGroup,
  Input,
  Select,
  type SelectOption,
} from '../../../design-system'
import { Alert } from '../../../shared/ui/Alert'
import { Form, FormActions } from '../../../shared/ui/form'
import { CATEGORIES, CATEGORY_LABELS, TEAM_MEMBER_OPTIONS } from '../domain/constants'
import { sortTeamMembers } from '../domain/rules'
import { projectDetailsSchema } from '../domain/schemas'
import type { ProjectDetailsValues } from '../domain/types'

const CATEGORY_OPTIONS: SelectOption[] = [
  { value: '', label: 'Select a category' },
  ...CATEGORIES.map((category) => ({
    value: category,
    label: CATEGORY_LABELS[category],
  })),
]

const TEAM_MEMBER_CHOICES = [...TEAM_MEMBER_OPTIONS]

interface ProjectDetailsFormProps {
  defaultValues: Partial<ProjectDetailsValues>
  submitLabel: string
  submittingLabel: string
  serverError?: string
  onSubmit: (values: ProjectDetailsValues) => Promise<void> | void
  onCancel: () => void
}

export function ProjectDetailsForm({
  defaultValues,
  submitLabel,
  submittingLabel,
  serverError,
  onSubmit,
  onCancel,
}: ProjectDetailsFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectDetailsValues>({
    resolver: zodResolver(projectDetailsSchema),
    defaultValues,
  })

  return (
    <Form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Input
        label="Project name"
        autoComplete="off"
        helperText="Letters, numbers, spaces and hyphens."
        error={errors.projectName?.message}
        {...register('projectName')}
      />
      {/* A text field, not type="number": the backend expects a string of digits. */}
      <Input
        label="Budget"
        inputMode="numeric"
        autoComplete="off"
        helperText="Whole number, digits only."
        error={errors.budget?.message}
        {...register('budget')}
      />
      <Select
        label="Category"
        tooltip="Category is required for project details."
        helperText="Select one category."
        options={CATEGORY_OPTIONS}
        error={errors.category?.message}
        {...register('category')}
      />
      <Controller
        control={control}
        name="options"
        render={({ field, fieldState }) => (
          <CheckboxGroup
            label="Team members needed"
            tooltip="Select all roles required for this project."
            helper="Pick all needed roles."
            options={TEAM_MEMBER_CHOICES}
            value={field.value ?? []}
            error={fieldState.error?.message}
            onChange={(selected) => field.onChange(sortTeamMembers(selected))}
          />
        )}
      />
      {serverError ? (
        <Alert tone="error" title="Project Details were not saved">
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
