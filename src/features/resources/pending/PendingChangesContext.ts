import { createContext } from 'react'
import type { ModuleKey } from '../domain/constants'
import type { PendingChanges, Resource } from '../domain/types'
import type { PendingChangesState } from './pendingChangesReducer'

export interface PendingChangesActions {
  apply: (mongoId: string, changes: PendingChanges) => void
  revert: (mongoId: string, module: ModuleKey) => void
  /** Drops the pending modules that the saved resource now contains. */
  prune: (saved: Resource) => void
  discard: (mongoId: string) => void
}

export interface PendingChangesContextValue extends PendingChangesActions {
  pendingByResource: PendingChangesState
}

export const PendingChangesContext = createContext<PendingChangesContextValue | null>(
  null,
)
