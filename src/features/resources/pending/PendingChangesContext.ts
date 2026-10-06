import { createContext } from 'react'
import type { ModuleKey } from '../domain/constants'
import type { PendingChanges, Resource } from '../domain/types'
import type { PendingChangesState } from './pendingChangesReducer'

export interface PendingChangesActions {
  apply: (resource: Resource, changes: PendingChanges) => void
  revert: (resource: Resource, module: ModuleKey) => void
  /** Drops the pending modules that the saved resource now contains. */
  prune: (saved: Resource) => void
  discard: (mongoId: string) => void
  /** Drops pending edits of the resource at this address after the backend answers 404. */
  discardMissing: (resourceId: number) => void
}

export interface PendingChangesContextValue extends PendingChangesActions {
  pendingByResource: PendingChangesState
}

export const PendingChangesContext = createContext<PendingChangesContextValue | null>(
  null,
)
