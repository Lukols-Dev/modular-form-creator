import { z } from 'zod'
import {
  BUDGET_PATTERN,
  CATEGORIES,
  EMAIL_PATTERN,
  MAX_DESCRIPTION_LENGTH,
  MAX_NAME_LENGTH,
  NAME_PATTERN,
  OWNER_PATTERN,
  PRIORITIES,
  TEAM_MEMBER_OPTIONS,
} from './constants'
import type { BasicInfoValues, ProjectDetailsValues } from './types'

// Each rule mirrors the backend validation, so mistakes show next to the field instead of as a 400.
// `trim()` runs first because the backend trims text fields before validating them.

const requiredText = (label: string) => z.string().trim().min(1, `${label} is required`)

// The backend checks String.length, which counts UTF-16 units, while zod's max() counts code
// points. Text with emoji could then pass here and fail there, so lengths are checked the same way.
const limitedText = (label: string, max: number) =>
  requiredText(label).refine(
    (value) => value.length <= max,
    `${label} must be at most ${max} characters`,
  )

const nameText = (label: string) =>
  limitedText(label, MAX_NAME_LENGTH).regex(
    NAME_PATTERN,
    `${label} can contain only letters, numbers, spaces and hyphens`,
  )

export const createResourceSchema = z.object({
  resourceName: nameText('Resource name'),
})

export type CreateResourceValues = z.infer<typeof createResourceSchema>

export const basicInfoSchema = z.object({
  owner: limitedText('Owner', MAX_NAME_LENGTH).regex(
    OWNER_PATTERN,
    'Owner can contain only letters A–Z and spaces (no accents, digits or hyphens)',
  ),
  email: requiredText('Email').regex(
    EMAIL_PATTERN,
    'Enter a valid email address, e.g. name@example.com',
  ),
  description: limitedText('Description', MAX_DESCRIPTION_LENGTH),
  priority: z.enum(PRIORITIES, { error: 'Select a priority' }),
}) satisfies z.ZodType<BasicInfoValues>

export const projectDetailsSchema = z.object({
  projectName: nameText('Project name'),
  budget: requiredText('Budget').regex(
    BUDGET_PATTERN,
    'Budget must be a whole number written with digits only, e.g. 15000',
  ),
  category: z.enum(CATEGORIES, { error: 'Select a category' }),
  options: z.array(z.enum(TEAM_MEMBER_OPTIONS)).min(1, 'Select at least one option'),
}) satisfies z.ZodType<ProjectDetailsValues>
