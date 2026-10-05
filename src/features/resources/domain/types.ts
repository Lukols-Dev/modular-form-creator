import type {
  Category,
  Priority,
  ResourceStatus,
  SortOrder,
  TeamMember,
} from './constants'

/** Basic Info as stored by the backend. A new resource has only `resourceName` filled in. */
export interface BasicInfo {
  resourceName: string
  owner: string
  email: string
  description: string
  priority: Priority | ''
}

/** Project Details as stored by the backend. Empty strings until the module is saved. */
export interface ProjectDetails {
  projectName: string
  budget: string
  category: Category | ''
  options: TeamMember[]
}

export interface Resource {
  _id: string
  resourceId: number
  name: string
  status: ResourceStatus
  basicInfo: BasicInfo
  projectDetails: ProjectDetails
  createdAt: string
  updatedAt: string
}

/** A filled-in Basic Info form. The resource name is locked, so it is not part of the form. */
export interface BasicInfoValues {
  owner: string
  email: string
  description: string
  priority: Priority
}

/** A filled-in Project Details form. `budget` stays a string: the backend rejects numbers. */
export interface ProjectDetailsValues {
  projectName: string
  budget: string
  category: Category
  options: TeamMember[]
}

/** Module edits of a completed resource, kept in memory until the user saves them with PUT. */
export interface PendingChanges {
  basicInfo?: BasicInfoValues
  projectDetails?: ProjectDetailsValues
}

/** The backend requires all five fields, including the unchanged resource name. */
export type BasicInfoPayload = BasicInfoValues & { resourceName: string }

export type ProjectDetailsPayload = ProjectDetailsValues

/** The full update body. A missing part makes the backend answer 500, so all three are required. */
export interface ReplaceResourcePayload {
  name: string
  basicInfo: BasicInfoPayload
  projectDetails: ProjectDetailsPayload
}

export interface ResourceListParams {
  page: number
  pageSize: number
  sortOrder: SortOrder
  status?: ResourceStatus
  name?: string
}

export interface Pagination {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface ResourceListResponse {
  items: Resource[]
  pagination: Pagination
}
