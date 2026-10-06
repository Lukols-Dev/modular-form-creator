import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Button, Drawer, Input } from '../../../design-system'
import { getErrorMessage, isApiError } from '../../../shared/api/client'
import { Alert } from '../../../shared/ui/Alert'
import { Form, FormActions } from '../../../shared/ui/form'
import { MutedText } from '../../../shared/ui/layout'
import { createResourceSchema, type CreateResourceValues } from '../domain/schemas'
import { useCreateResource } from '../queries/mutations'
import { resourcePath } from '../routes'

/** The backend's wording names the field; the form shows a friendlier sentence instead. */
const DUPLICATE_NAME_MESSAGE = 'resourceName must be unique'

interface CreateResourceDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateResourceDrawer({ isOpen, onClose }: CreateResourceDrawerProps) {
  return (
    // The design-system Drawer stays mounted while closed; `inert` keeps it out of the tab order.
    <div inert={!isOpen}>
      <Drawer title="New resource" isOpen={isOpen} onClose={onClose}>
        {/* Mounting the form on open gives every attempt a clean state. */}
        {isOpen ? <CreateResourceForm onCancel={onClose} /> : null}
      </Drawer>
    </div>
  )
}

function CreateResourceForm({ onCancel }: { onCancel: () => void }) {
  const navigate = useNavigate()
  const createResource = useCreateResource()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateResourceValues>({
    resolver: zodResolver(createResourceSchema),
    defaultValues: { resourceName: '' },
  })

  const submit = handleSubmit(async ({ resourceName }) => {
    try {
      await createResource.mutateAsync(resourceName, {
        // Skipped if the drawer was closed meanwhile; the new resource then shows up in the list.
        onSuccess: (resource) => navigate(resourcePath(resource.resourceId)),
      })
    } catch (error) {
      // Every 400 from this endpoint is about the name, for example a duplicate.
      if (isApiError(error, 400)) {
        setError('resourceName', {
          type: 'server',
          message:
            error.message === DUPLICATE_NAME_MESSAGE
              ? 'A resource with this name already exists. Names are not case-sensitive.'
              : error.message,
        })
      } else {
        setError('root.server', { type: 'server', message: getErrorMessage(error) })
      }
    }
  })

  return (
    <Form onSubmit={submit} noValidate>
      <MutedText>
        Give the resource a unique name. You will fill in its modules on the next screen.
      </MutedText>
      <Input
        label="Resource name"
        placeholder="e.g. Hiring Pipeline"
        autoComplete="off"
        autoFocus
        helperText="Letters, numbers, spaces and hyphens. The name cannot be changed later."
        error={errors.resourceName?.message}
        {...register('resourceName')}
      />
      {errors.root?.server ? (
        <Alert tone="error">{errors.root.server.message}</Alert>
      ) : null}
      <FormActions>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating…' : 'Create resource'}
        </Button>
      </FormActions>
    </Form>
  )
}
