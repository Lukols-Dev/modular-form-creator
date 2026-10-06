import { useEffect, useMemo, useReducer, type ReactNode } from 'react'
import {
  PendingChangesContext,
  type PendingChangesActions,
  type PendingChangesContextValue,
} from './PendingChangesContext'
import { pendingChangesReducer } from './pendingChangesReducer'

/**
 * Holds pending edits of completed resources in memory only. It sits above the router, so the
 * edits survive moving between pages, and a refresh drops them by design. Nothing is written to
 * localStorage, sessionStorage or the URL.
 */
export function PendingChangesProvider({ children }: { children: ReactNode }) {
  const [pendingByResource, dispatch] = useReducer(pendingChangesReducer, {})
  const hasPendingChanges = Object.keys(pendingByResource).length > 0

  // Losing the edits on refresh is intended, but the user gets the browser's warning first.
  useEffect(() => {
    if (!hasPendingChanges) {
      return
    }
    const warnBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener('beforeunload', warnBeforeUnload)
    return () => window.removeEventListener('beforeunload', warnBeforeUnload)
  }, [hasPendingChanges])

  // Stable functions, so consumers can use them in effect dependencies.
  const actions = useMemo<PendingChangesActions>(
    () => ({
      apply: (resource, changes) => dispatch({ type: 'apply', resource, changes }),
      revert: (resource, module) => dispatch({ type: 'revert', resource, module }),
      prune: (saved) => dispatch({ type: 'prune', saved }),
      discard: (mongoId) => dispatch({ type: 'discard', mongoId }),
      discardMissing: (resourceId) => dispatch({ type: 'discardMissing', resourceId }),
    }),
    [],
  )
  const value = useMemo<PendingChangesContextValue>(
    () => ({ pendingByResource, ...actions }),
    [pendingByResource, actions],
  )

  return <PendingChangesContext value={value}>{children}</PendingChangesContext>
}
