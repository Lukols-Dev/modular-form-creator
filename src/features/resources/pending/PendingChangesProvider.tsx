import { useMemo, useReducer, type ReactNode } from 'react'
import {
  PendingChangesContext,
  type PendingChangesActions,
  type PendingChangesContextValue,
} from './PendingChangesContext'
import { pendingChangesReducer } from './pendingChangesReducer'

/**
 * Holds pending edits of completed resources in memory only. It sits above the router, so the
 * edits survive moving between pages, and a refresh drops them, as the task requires. Nothing is
 * written to localStorage, sessionStorage or the URL.
 */
export function PendingChangesProvider({ children }: { children: ReactNode }) {
  const [pendingByResource, dispatch] = useReducer(pendingChangesReducer, {})

  const actions = useMemo<PendingChangesActions>(
    () => ({
      apply: (mongoId, changes) => dispatch({ type: 'apply', mongoId, changes }),
      revert: (mongoId, module) => dispatch({ type: 'revert', mongoId, module }),
      prune: (saved) => dispatch({ type: 'prune', saved }),
      discard: (mongoId) => dispatch({ type: 'discard', mongoId }),
    }),
    [],
  )
  const value = useMemo<PendingChangesContextValue>(
    () => ({ pendingByResource, ...actions }),
    [pendingByResource, actions],
  )

  return <PendingChangesContext value={value}>{children}</PendingChangesContext>
}
