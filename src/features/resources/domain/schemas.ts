import { z } from 'zod'
import { MAX_NAME_LENGTH, NAME_PATTERN } from './constants'

// Each rule mirrors the backend validation, so mistakes show next to the field instead of as a 400.
// `trim()` runs first because the backend trims text fields before validating them.

const requiredText = (label: string) => z.string().trim().min(1, `${label} is required`)

const nameText = (label: string) =>
  requiredText(label)
    .max(MAX_NAME_LENGTH, `${label} must be at most ${MAX_NAME_LENGTH} characters`)
    .regex(NAME_PATTERN, `${label} can contain only letters, numbers, spaces and hyphens`)

export const createResourceSchema = z.object({
  resourceName: nameText('Resource name'),
})

export type CreateResourceValues = z.infer<typeof createResourceSchema>
