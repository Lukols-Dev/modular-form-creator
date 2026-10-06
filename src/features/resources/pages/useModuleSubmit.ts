import { useNavigate } from 'react-router-dom'
import { getErrorMessage } from '../../../shared/api/client'
import { withFlash } from '../../../shared/hooks/useFlashMessage'
import type { Resource } from '../domain/types'
import { resourcePath } from '../routes'

interface ModuleSubmitOptions<TValues> {
  /** Keeps the values as pending changes of a completed resource. */
  apply: (values: TValues) => void
  /**
   * Saves the module of a draft. Pass `onSaved` as the mutation's per-call onSuccess: TanStack
   * Query skips it once the page has unmounted, so a user who already left is not pulled back.
   */
  save: (values: TValues, onSaved: () => void) => Promise<unknown>
  /** The error of the last draft save, if any. */
  saveError: Error | null
  saveLabel: string
  savedMessage: string
}

/**
 * The core rule of the task in one place: a draft module is saved right away, while a completed
 * resource only keeps the change in memory until "Save changes" on the overview.
 */
export function useModuleSubmit<TValues>(
  resource: Resource,
  { apply, save, saveError, saveLabel, savedMessage }: ModuleSubmitOptions<TValues>,
) {
  const navigate = useNavigate()
  const isCompleted = resource.status === 'completed'
  const overviewPath = resourcePath(resource.resourceId)

  const submit = async (values: TValues) => {
    if (isCompleted) {
      apply(values)
      navigate(overviewPath)
      return
    }
    try {
      await save(values, () => navigate(overviewPath, withFlash(savedMessage)))
    } catch {
      // The form shows the error from serverError.
    }
  }

  let serverError: string | undefined
  if (saveError) {
    // A draft save can fail because another tab completed the resource meanwhile. The page has
    // reloaded it and now applies changes instead, so say that rather than the API's wording.
    serverError = isCompleted
      ? 'This resource was completed in another tab, so it cannot be saved here directly any more. Your input is still in the form: apply it, then save the changes on the overview.'
      : getErrorMessage(saveError)
  }

  return {
    isCompleted,
    overviewPath,
    submit,
    serverError,
    submitLabel: isCompleted ? 'Apply changes' : saveLabel,
    submittingLabel: isCompleted ? 'Applying…' : 'Saving…',
    cancel: () => navigate(overviewPath),
  }
}
