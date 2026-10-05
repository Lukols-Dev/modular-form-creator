export const RESOURCE_STATUSES = ['draft', 'completed'] as const
export type ResourceStatus = (typeof RESOURCE_STATUSES)[number]

export const PRIORITIES = ['low', 'medium', 'high'] as const
export type Priority = (typeof PRIORITIES)[number]

export const CATEGORIES = ['internal', 'external', 'vendor'] as const
export type Category = (typeof CATEGORIES)[number]

export const TEAM_MEMBER_OPTIONS = [
  'FE devs',
  'BE devs',
  'Designer',
  'Data Eng',
  'Product Owner',
] as const
export type TeamMember = (typeof TEAM_MEMBER_OPTIONS)[number]

export const SORT_ORDERS = ['desc', 'asc'] as const
export type SortOrder = (typeof SORT_ORDERS)[number]

export const MODULES = ['basicInfo', 'projectDetails'] as const
export type ModuleKey = (typeof MODULES)[number]

// Validation rules mirrored from backend/src/modules/resources/resource.service.ts
export const NAME_PATTERN = /^[A-Za-z0-9 -]+$/
export const OWNER_PATTERN = /^[A-Za-z ]+$/
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const BUDGET_PATTERN = /^\d+$/
export const MAX_NAME_LENGTH = 255
export const MAX_DESCRIPTION_LENGTH = 1000

export const PAGE_SIZE = 10

export const STATUS_LABELS: Record<ResourceStatus, string> = {
  draft: 'Draft',
  completed: 'Completed',
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

export const CATEGORY_LABELS: Record<Category, string> = {
  internal: 'Internal',
  external: 'External',
  vendor: 'Vendor',
}

export const MODULE_LABELS: Record<ModuleKey, string> = {
  basicInfo: 'Basic Info',
  projectDetails: 'Project Details',
}
