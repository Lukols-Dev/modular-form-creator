import { createContext } from 'react'
import type { ModuleKey } from '../domain/constants'
import type { PendingModules } from '../domain/types'
import type { PendingChangesState } from './pendingChangesReducer'

export interface PendingChangesContextValue {
  pendingByResource: PendingChangesState
  stage: (resourceKey: string, changes: PendingModules) => void
  unstage: (resourceKey: string, module: ModuleKey) => void
  discard: (resourceKey: string) => void
}

export const PendingChangesContext = createContext<PendingChangesContextValue | null>(
  null,
)
